import React, { useState, useEffect, useRef } from 'react';
import { EmployeeService } from "../service/EmployeeService";
import { RegionService } from "../service/RegionService";
import { PriceListService } from "../service/PriceListService";
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete } from 'primereact/autocomplete';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from 'primereact/inputmask';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import classNames from 'classnames';
import '../layout/CrudEmployee.scss';



export function CrudEmployee() {
    

    ////////////////////////////////////
    // Empty Objects for initialization
    ////////////////////////////////////

    const emptyEmployee = {
        id: null,
        dni: '',
        email: '',
        firstName: '',
        lastName: '',
        fullName: '',
        streetAddress: '',
        phone1: '',
        country: {id: null, name: ''},
        locality: {id: null, name: ''},
        priceList: {id: null, name: ''},
        region: {id: null, name: ''},
        dateCreated: null,
        dateUpdated: null,
        dateDeleted: 0,
    }

    const emptyRegion = {
        id: null,
        name: '',
    }

    const emptyPriceList = {
        id: null,
        name: '',
    }

    ///////////////
    // React Hooks
    ///////////////

    // Employee Variables
    const [employees, setEmployees] = useState([]);
    const [employeesUndo, setEmployeesUndo] = useState([]);
    const [employeeEdited, setEmployeeEdited] = useState(null);
    const [employeeEditedUndo, setEmployeeEditedUndo] = useState(null);
    const [employeeUpdate, setEmployeeUpdate] = useState(null);
    const [employeeInsert, setEmployeeInsert] = useState(null);

    // Input Variables
    const [inputDni, setInputDni] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [inputFirstName, setInputFirstName] = useState('');
    const [inputLastName, setInputLastName] = useState('');
    const [inputStreetAddress, setInputStreetAddress] = useState('');
    const [inputPhone1, setInputPhone1] = useState(null);

    // Region Variables
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState (null);

    // PriceList Variables
    const [priceLists, setPricesLists] = useState ([]);
    const [selectedPriceList, setSelectedPriceList] = useState (null);

    // Dialog Variables
    const [newEmployeeDialog, setNewEmployeeDialog] = useState(false);
    const [viewEmployeeDialog, setViewEmployeeDialog] = useState(false);
    const [editEmployeeDialog, setEditEmployeeDialog] = useState(false);
    const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
    const [deleteSelectedEmployeesDialog, setDeleteSelectedEmployeesDialog] = useState(false);

    // Other Variables
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);

    // Services
    const employeeService = new EmployeeService();
    const regionService = new RegionService();
    const priceListService = new PriceListService();


    useEffect( () => {

        fetchEmployeeListData();
        fetchPricesListsData();
        fetchRegionListData();
        // eslint-disable-next-line react-hooks/exhaustive-deps       
    }, []);


    //////////////////////
    // DB Data functions
    //////////////////////

    async function fetchEmployeeListData () {     
        console.log ( '# fetchEmployeeListData #' );
        await employeeService.getEmployeeList().then( (_employeesData) => {
            console.log ('_employeesData: ',_employeesData);
            setEmployees(_employeesData);
            setEmployeesUndo (JSON.parse(JSON.stringify(_employeesData)));
        });
    };

    async function putEmployee (_employee) {
        console.log ( '# putEmployee #' );
        //console.log ('newEmployee: ', newEmployee, '\n');
        let returnedId = await employeeService.putEmployee (_employee);
        toast.current.show({ severity: 'success', summary: 'Perfecto !', detail: 'Empleado Creado', life: 3000 });
        return returnedId;
    }

    async function updateEmployee (employeeList, option) {
        console.log ( '# updateEmployee #' );
        //console.log ('employeeList: ', employeeList, '\n');
        await employeeService.updateEmployee (employeeList).then ( (returnedValue) => {
            //console.log ('returnedValue: ', returnedValue, '\n');
            switch (option) {
                case 'update':
                    toast.current.show({ severity: 'success', summary: 'Perfecto !', detail: 'Empleado Actualizado', life: 3000 });
                    break;
                case 'delete':
                    toast.current.show({ severity: 'success', summary: 'Perfecto !', detail: 'Empleado Borrado', life: 3000 });
                    break;     
            }
            return returnedValue;
        });
    }

    async function fetchPricesListsData () {

        await priceListService.getPriceList().then( (_priceListsData) => {
            //console.log ('priceListsData: ',priceListsData);
            _priceListsData = _priceListsData.filter( pl => !(pl.dateCreated === 0) ); // Removes db DEFAULT row

            setPricesLists (JSON.parse(JSON.stringify(_priceListsData)));
        });
    };

    async function fetchRegionListData () {  
        console.log ( '# fetchRegionListData #' );
        await regionService.getRegionList().then( (_regionsData) => {
            //console.log ('regionsData: ',regionsData);
            setRegions(_regionsData);
        });
    };


    ////////////////////////////////
    // Action Body Dialog Functions
    ////////////////////////////////

    const openInsertNewEmployeeDialog = () => {
        console.log ('# openInsertNewEmployeeDialog #')
        
        setEmployeeEdited(emptyEmployee);
        setInputDni (emptyEmployee.dni);
        setInputEmail (emptyEmployee.email);
        setInputFirstName (emptyEmployee.firstName);
        setInputLastName (emptyEmployee.lastName);
        setInputStreetAddress (emptyEmployee.streetAddress);
        setInputPhone1 (emptyEmployee.phone1);
        setSelectedRegion(emptyRegion);
        setSelectedPriceList(emptyPriceList);
        setSubmitted(false);

        setNewEmployeeDialog(true);
    }

    const hideInsertNewEmployeeDialog = () => {
        //setEmployees(JSON.parse(JSON.stringify(employeesUndo)));
        setEmployeeEdited ( {...employeeEditedUndo} );
        //setEmployeeUpdate (JSON.parse(JSON.stringify (employeeUpdatedUndo) ) );
        setSubmitted(false);
        setNewEmployeeDialog(false);
    }

    const openViewEmployeeDialog = (rowData) => {
        console.log ('# openViewEmployeeDialog #')
        
        setEmployeeEdited ( { ...rowData } );
        setInputDni ( rowData.dni );
        setInputEmail ( rowData.email );
        setInputFirstName ( rowData.firstName );
        setInputLastName ( rowData.lastName );        
        setInputStreetAddress ( rowData.streetAddress );
        setInputPhone1 ( rowData.phone1 );
        setSelectedPriceList( {...rowData.priceList} );
        setSelectedRegion ( {...rowData.region} );

        console.log('rowData: ', rowData);

        setViewEmployeeDialog(true);
    }

    const hideViewEmployeeDialog = () => {
        //setEmployees(JSON.parse(JSON.stringify(employeesUndo)));
        //setEmployeeEdited ( {...employeeEditedUndo} );
        //setEmployeeUpdate (JSON.parse(JSON.stringify (employeeUpdatedUndo) ) );
        setSubmitted(false);
        setViewEmployeeDialog(false);
    }

    const openUpdateEmployeeDialog = (rowData) => {
        console.log ('# openUpdateEmployeeDialog #')

        setEmployeeEdited ( { ...rowData } );
        setEmployeeEditedUndo ( JSON.parse(JSON.stringify ( { ...rowData } ) ) );
        setInputDni ( rowData.dni );
        setInputEmail ( rowData.email );
        setInputFirstName ( rowData.firstName );
        setInputLastName ( rowData.lastName );        
        setInputStreetAddress ( rowData.streetAddress );
        setInputPhone1 ( rowData.phone1 );
        setSelectedPriceList( {...rowData.priceList} );
        setSelectedRegion ( {...rowData.region} );

        console.log('rowData: ', rowData);
        //console.log('selectedRegion: ', selectedRegion);
        //console.log('openUpdateEmployeeDialog selectedPriceList: ', selectedPriceList);

        setEditEmployeeDialog(true);
    }

    const hideUpdateEmployeeDialog = () => {
        //setEmployees(JSON.parse(JSON.stringify(employeesUndo)));
        setEmployeeEdited ( {...employeeEditedUndo} );
        //setEmployeeUpdate (JSON.parse (JSON.stringify (employeeUpdatedUndo) ) );
        setSubmitted(false);
        setEditEmployeeDialog(false);
    }

    const openDeleteEmployeeDialog = (rowData) => {
        setEmployeeEdited ({ ...rowData});
        setDeleteEmployeeDialog(true);
    }

    const hideDeleteEmployeeDialog = () => {
        setDeleteEmployeeDialog(false);
    }

    const openDeleteSelectedEmployeesDialog = () => {
        setDeleteSelectedEmployeesDialog(true);
    }

    const hideDeleteSelectedEmployeesDialog = () => {
        setDeleteSelectedEmployeesDialog(false);
    }


    ///////////////////////
    // Event funtctions
    ///////////////////////

    const onChangeInputFirstName = (event) => {
        console.log ('# onChangeInputFirstName #')

        const val = event.target.value || '';
        let _employeeEdited = { ...employeeEdited };
        let _employeeInsert = { ...employeeInsert }
        let _employeeUpdate = { ...employeeUpdate };

        _employeeEdited.firstName = val || '';
        _employeeEdited.fullName = _employeeEdited.firstName + ' ' + _employeeEdited.lastName;
        (_employeeEdited.id) ? _employeeEdited.dateUpdated = Date.now() : _employeeEdited.dateCreated = Date.now();

        console.log ('_employeeEdited.fullName', _employeeEdited.fullName)

        if (_employeeEdited.id){
            _employeeUpdate.firstName = _employeeEdited.firstName
            _employeeUpdate.fullName = _employeeEdited.fullName
            _employeeUpdate.dateUpdated = _employeeEdited.dateUpdated; // time stamp of the update
            setEmployeeUpdate (_employeeUpdate); //to capture just modifications to price list settings
        } else {
            _employeeInsert.firstName = _employeeEdited.firstName; //to capture just new inserts to price list settings
            _employeeInsert.fullName = _employeeEdited.fullName
            _employeeInsert.dateCreated = _employeeEdited.dateCreated; // Just needed here because if it's an insert (all onChange will be done at the same time) and this field is mandatory.
            setEmployeeInsert (_employeeInsert); //to capture just new inserts to price list settings
        }

        setInputFirstName (val);
        setEmployeeEdited (_employeeEdited);
    }

    const onChangeInputLastName = (event) => {
        console.log ('# onChangeInputLastName #');

        const val = event.target.value || '';
        let _employeeEdited = { ...employeeEdited };
        let _employeeInsert = { ...employeeInsert };
        let _employeeUpdate = { ...employeeUpdate };

        _employeeEdited.lastName = val;
        _employeeEdited.fullName = _employeeEdited.firstName + ' ' + _employeeEdited.lastName;
        (_employeeEdited.id) ? _employeeEdited.dateUpdated = Date.now() : _employeeEdited.dateCreated = Date.now();

        if (_employeeEdited.id){
            _employeeUpdate.lastName = _employeeEdited.lastName
            _employeeUpdate.fullName = _employeeEdited.fullName
            _employeeUpdate.dateUpdated = _employeeEdited.dateUpdated; // time stamp of the update
            setEmployeeUpdate (_employeeUpdate); //to capture just modifications to price list settings
        } else {
            _employeeInsert.lastName = _employeeEdited.lastName; //to capture just new inserts to price list settings
            _employeeInsert.fullName = _employeeEdited.fullName
            //_employeeInsert.dateCreated = Date.now(); // just needed once in a mandatory field
            setEmployeeInsert (_employeeInsert); //to capture just new inserts to price list settings
        }

        setInputLastName (val);
        setEmployeeEdited(_employeeEdited);
    }

    const onChangeInputStreetAddress = (event) => {
        console.log ('# onChangeInputStreetAddress #');

        const val = event.target.value || '';
        let _employeeEdited = { ...employeeEdited };
        let _employeeInsert = { ...employeeInsert };
        let _employeeUpdate = { ...employeeUpdate };

        _employeeEdited.streetAddress = val;
        (_employeeEdited.id) ? _employeeEdited.dateUpdated = Date.now() : _employeeEdited.dateCreated = Date.now();

        if (_employeeEdited.id){
            _employeeUpdate.streetAddress = _employeeEdited.streetAddress
            _employeeUpdate.dateUpdated = _employeeEdited.dateUpdated; // time stamp of the update
            setEmployeeUpdate (_employeeUpdate); //to capture just modifications to price list settings
        } else {
            _employeeInsert.streetAddress = _employeeEdited.streetAddress; //to capture just new inserts to price list settings
            // _employeeInsert.dateCreated = Date.now(); // just needed once in a mandatory field
            setEmployeeInsert (_employeeInsert); //to capture just new inserts to price list settings
        }

        setInputStreetAddress (val);
        setEmployeeEdited (_employeeEdited);
    }

    const onChangeInputEmail = (event) => {
        console.log ('# onChangeInputEmail #');

        const val = event.target.value || '';
        let _employeeEdited = { ...employeeEdited };
        let _employeeInsert = { ...employeeInsert };
        let _employeeUpdate = { ...employeeUpdate };

        _employeeEdited.email = val;
        (_employeeEdited.id) ? _employeeEdited.dateUpdated = Date.now() : _employeeEdited.dateCreated = Date.now();

        if (_employeeEdited.id){
            _employeeUpdate.email = _employeeEdited.email
            _employeeUpdate.dateUpdated = Date.now(); // time stamp of the update
            setEmployeeUpdate (_employeeUpdate); //to capture just modifications to price list settings
        } else {
            _employeeInsert.email = _employeeEdited.email; //to capture just new inserts to price list settings
            // _employeeInsert.dateCreated = Date.now(); // just needed once in a mandatory field
            setEmployeeInsert (_employeeInsert); //to capture just new inserts to price list settings
        }

        setInputEmail (val);
        setEmployeeEdited (_employeeEdited);
    }

    const onChangeInputPhone1 = (event) => {
        console.log ('# onChangeInputPhone1 #');

        const val = event.target.value || '';
        let _employeeEdited = { ...employeeEdited };
        let _employeeInsert = { ...employeeInsert };
        let _employeeUpdate = {...employeeUpdate };

        _employeeEdited.phone1 = val;
        (_employeeEdited.id) ? _employeeEdited.dateUpdated = Date.now() : _employeeEdited.dateCreated = Date.now();

        if (_employeeEdited.id){
            _employeeUpdate.phone1 = _employeeEdited.phone1
            _employeeUpdate.dateUpdated = _employeeEdited.dateUpdated; // time stamp of the update
            setEmployeeUpdate (_employeeUpdate); //to capture just modifications to price list settings
        } else {
            _employeeInsert.phone1 = _employeeEdited.phone1; //to capture just new inserts to price list settings
            // _employeeInsert.dateCreated = Date.now(); // just needed once in a mandatory field
            setEmployeeInsert (_employeeInsert); //to capture just new inserts to price list settings
        }

        setInputPhone1 (val);
        setEmployeeEdited(_employeeEdited);
    }

    const onChangeInputDni = (event) => {
        console.log ('# onChangeInputDni #');

        const val = event.target.value || '';
        let _employeeEdited = { ...employeeEdited };
        let _employeeInsert = { ...employeeInsert };
        let _employeeUpdate = { ...employeeUpdate };

        _employeeEdited.dni = val;
        (_employeeEdited.id) ? _employeeEdited.dateUpdated = Date.now() : _employeeEdited.dateCreated = Date.now();

        if (_employeeEdited.id){
            _employeeUpdate.dni = _employeeEdited.dni
            _employeeUpdate.dateUpdated = _employeeEdited.dateUpdated; // time stamp of the update
            setEmployeeUpdate (_employeeUpdate); //to capture just modifications to price list settings
        } else {
            _employeeInsert.dni = _employeeEdited.dni; //to capture just new inserts to price list settings
            // _employeeInsert.dateCreated = Date.now(); // just needed once in a mandatory field
            setEmployeeInsert (_employeeInsert); //to capture just new inserts to price list settings
        }

        setInputDni (val);
        setEmployeeEdited(_employeeEdited);
    }

    const onChangeRegion = (event) => {
        console.log ('# onChangeRegion #')

        const val =  event.target.value || 0;
        let _employeeEdited = { ...employeeEdited };
        let _employeeInsert = { ...employeeInsert };
        let _employeeUpdate = { ...employeeUpdate };

        //console.log ('val: ', val);

        _employeeEdited.region = { id: val.id, name: val.name || '' };
        (_employeeEdited.id) ? _employeeEdited.dateUpdated = Date.now() : _employeeEdited.dateCreated = Date.now();
        
        if (_employeeEdited.id){
            _employeeUpdate.region = _employeeEdited.region
            _employeeUpdate.dateUpdated = _employeeEdited.dateUpdated; // time stamp of the update
            setEmployeeUpdate (_employeeUpdate); //to capture just modifications to price list settings
        } else {
            _employeeInsert.region = _employeeEdited.region; //to capture just new inserts to price list settings
            // _employeeInsert.dateCreated = Date.now(); // just needed once in a mandatory field
            setEmployeeInsert (_employeeInsert); //to capture just new inserts to price list settings
        }

        setSelectedRegion(val);
        setEmployeeEdited (_employeeEdited);
    }

    const onChangePriceList = (event) => {
        console.log ('# onChangePriceList #')

        const val =  event.target.value || 0;
        let _employeeEdited = { ...employeeEdited };
        let _employeeInsert = { ...employeeInsert };
        let _employeeUpdate = { ...employeeUpdate };

        //console.log ('val: ', val);

        _employeeEdited.priceList = { id: val.id || null, name: val.name || ''};
        (_employeeEdited.id) ? _employeeEdited.dateUpdated = Date.now() : _employeeEdited.dateCreated = Date.now();

        if (_employeeEdited.id){
            _employeeUpdate.priceList = _employeeEdited.priceList
            _employeeUpdate.dateUpdated = _employeeEdited.dateUpdated; // time stamp of the update
            setEmployeeUpdate (_employeeUpdate); //to capture just modifications to price list settings
        } else {
            _employeeInsert.priceList = _employeeEdited.priceList; //to capture just new inserts to price list settings
            // _employeeInsert.dateCreated = Date.now(); // just needed once in a mandatory field
            setEmployeeInsert (_employeeInsert); //to capture just new inserts to price list settings
        }

        setSelectedPriceList(val);
        setEmployeeEdited (_employeeEdited);
    }


    ////////////////////////////////////
    // Persist Data Functions
    ////////////////////////////////////


    const saveEmployee = async () => {

        let _employees = [ ...employees ];
        let _employeeEdited = { ...employeeEdited };
        let _employeeInsert = { ...employeeInsert };
        let _employeeUpdated = { ...employeeUpdate };

        setSubmitted(true);

        if (_employeeEdited.firstName.trim() && _employeeEdited.lastName.trim() && _employeeEdited.email.trim() ) {

            if (_employeeEdited.id) {

                //const index = findIndexById(_employeeEdited.id);
                const index = _employees.findIndex (_employee => _employee.id === _employeeEdited.id );
                console.log ('index: ', index);
                _employees[index] = _employeeEdited;
                setEmployees (_employees)

            } else {  // No need to insert in UI to update it, because the data table in UI will be reloaded from DB after the insert.
                /*
                _employeeEdited.dateCreated = Date.now(); // created timestamp
                _employeeEdited.dateUpdated = 0; // updated timestamp
                _employeeEdited.dateDeleted = 0; // updated timestamp

                _employees.push (_employeeEdited);
                setEmployees (_employees);
                */
            }

            // DB Insert
            if ( isNotEmpty(_employeeInsert) ) {
                console.log ('_employeeInsert: ', _employeeInsert );

                await putEmployee(_employeeInsert); //create new
            };

            // DB Update / Delete
            if ( isNotEmpty(_employeeUpdated) ) { 
                console.log ('_employeeUpdated: ', _employeeUpdated );

                _employeeUpdated.id = _employeeEdited.id;

                if (_employeeUpdated.dateUpdated) { // checks if its an update operation
                    await updateEmployee (_employeeUpdated, 'update'); //updates table tblPriceList with the price list object info
                } else if (_employeeUpdated.dateDeleted) { // checks if its a soft delete operation
                    await updateEmployee (_employeeUpdated, 'delete'); //updates table tblPriceList (for logical delete) with the price list object info
                }

            };

            fetchEmployeeListData();

            setEditEmployeeDialog(false);
        }
    }

    const deleteEmployee = async() => { // Detele single employee using trash icon

        let _employees = [...employees];
        let _employeeEdited = {...employeeEdited};
        let _employeeUpdated = {};

        _employees = _employees.filter(_employee => _employee.id !== _employeeEdited.id);
        setEmployees(_employees);

        _employeeUpdated.id = _employeeEdited.id;
        _employeeUpdated.dateDeleted = Date.now(); //logical delete

        await updateEmployee(_employeeUpdated, 'delete') //update persistent data source.

        setDeleteEmployeeDialog(false);
    }

    const deleteSelectedEmployees = () => {

        let _employees = [...employees];
        let _employeeUpdated = {};
        let _selectedEmployees = {...selectedEmployees};

        _employees = _employees.filter(emp => !_selectedEmployees.includes(emp));
        setEmployees(_employees);

        _selectedEmployees.forEach ( async(_employeeEdited) => {
            _employeeUpdated.id = _employeeEdited.id;
            _employeeUpdated.dateDeleted = Date.now(); // logical delte
            
            //await employeeService.updateEmployee(_employeeUpdated);
            await updateEmployee(_employeeUpdated, 'delete');
        });

        setSelectedEmployees([]);
        setDeleteSelectedEmployeesDialog(false);
    }

    const saveNewEmployee = async () => {

        setSubmitted(true);
        let _employeeEdited = { ...employeeEdited };
        let _employeeInsert = { ...employeeInsert };

        if (_employeeEdited.firstName.trim() && _employeeEdited.lastName.trim() && _employeeEdited.email.trim() ) {

            _employeeEdited.fullName = _employeeEdited.firstName + ' ' + _employeeEdited.lastName;
            _employeeEdited.dateCreated = Date.now(); // created timestamp
            _employeeEdited.dateUpdated = 0; // updated timestamp
            _employeeEdited.dateDeleted = 0; // updated timestamp

            _employeeInsert = JSON.parse( JSON.stringify (_employeeEdited) ); //Deep copy. Only on new price list (insert) all props are copied.
            
            await putEmployee(_employeeInsert); //create new
            
            fetchEmployeeListData();

            setEditEmployeeDialog(false);
        };
    };

    const saveEditEmployee = async () => {

        let _employees = [ ...employees ];
        let _employeeEdited = { ...employeeEdited };
        let _employeeUpdated = { ...employeeUpdate };

        setSubmitted(true);

        if (_employeeEdited.firstName.trim() && _employeeEdited.lastName.trim() && _employeeEdited.email.trim() ) {

            if (_employeeEdited.id) {

                //_employeeEdited.fullName = _employeeEdited.firstName + ' ' + _employeeEdited.lastName;

                const index = findIndexById(_employeeEdited.id);
                _employees[index] = _employeeEdited;

                _employeeUpdated.id = _employeeEdited.id;
                _employeeUpdated.dateUpdated = Date.now(); // updated timestamp

                //await employeeService.updateEmployee(_employeeUpdated); //updates existing
                //toast.current.show({ severity: 'success', summary: 'Perfecto !', detail: 'Empleado Actualizado', life: 3000 });
                await updateEmployee(_employeeUpdated); //updates existing
            }

            fetchEmployeeListData();

            setEditEmployeeDialog(false);
        }
    }

    
    /////////////////////////
    // Supporting Funtctions
    /////////////////////////

    const findIndexById = (id) => {

        let _employees = [...employees];

        let index = -1;
        for (let i = 0; i < _employees.length; i++) {
            if (_employees[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    // test empty objects
    function isNotEmpty(obj) {
        // because Object.keys(new Date()).length === 0); we have to do some additional check
        // obj --> checks null and undefined
        // Object.keys(obj).length === 0 --> checks keys
        // obj.constructor === Object --> checks obj type: __proto__.constructor property equals f Object
        // return obj && Object.keys(obj).length === 0 && obj.constructor === Object
        for(var key in obj) { 
            return true; 
        } return false; 
    }

    //////////////////////////////////////////////////
    // Datatable and Forms Layout formating functions
    //////////////////////////////////////////////////

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only" onClick={() => openViewEmployeeDialog(rowData)} />
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-2" onClick={() => openUpdateEmployeeDialog(rowData)} />
            </React.Fragment>
        );
    }

    ///////////////////////
    // Toolbar Functions
    ///////////////////////

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="" icon="pi pi-plus" className="p-button-secondary p-button-raised p-mr-2" onClick={openInsertNewEmployeeDialog} tooltip = 'Nuevo'/>
                <Button label="" icon="pi pi-minus" className="p-button-warning p-button-raised" tooltip = 'Eliminar' onClick={openDeleteSelectedEmployeesDialog} disabled={!selectedEmployees || !selectedEmployees.length} />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            
            <React.Fragment>
            {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Importar" chooseLabel="Importar" className="p-mr-2 p-d-inline-block" />
                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
           */} </React.Fragment>

        )
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </React.Fragment>
        );
    }

    const countryBodyTemplate = (rowData) => {
        let { name, code } = rowData.country;

        return (
            <React.Fragment>
                <span className="p-column-title">Country</span>
                <img src="assets/layout/flags/flag_placeholder.png" onError={(event) => event.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={name} className={classNames('flag', 'flag-' + code)} />
                <span style={{ verticalAlign: 'middle', marginLeft: '.5em' }}>{name}</span>
            </React.Fragment>
        );
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Date</span>
                <span>{rowData.date}</span>
            </React.Fragment>
        );
    }

    const imageBodyTemplate = (rowData) => {
        return <img src={`assets/demo/images/product/${rowData.image}`} onError={(event) => event.target.src = 'assets/layout/images/avatar_4.png'} alt={rowData.image} className="employee-image" />
    }

    const selectedRegionTemplate = (option, props) => {
        //console.log ('selectedRegionTemplate option: ', option)
        if (option) {
            return (
                <div className="region-item region-item-value">
                    <div>{option.name}</div>
                </div>
            );
        }
        return (
            <span>
                {props.placeholder}
            </span>
        );
    }

    const regionOptionTemplate = (option) => {
        //console.log ('regionOptionTemplate option: ', option)
        return (
            <div className="region-item">
                <div>{option.name}</div>
            </div>
        );
    };

    const selectedPriceListTemplate = (option, props) => {
        //console.log ('# selectedPriceListTemplate #');
        //console.log ('option: ', option)
        //console.log ('props: ', props)
        if (option) {
            return (
                <div className="priceList-item priceList-item-value">
                    <div>{option.name}</div>
                </div>
            );
        }
        return (
            <span>
                {props.placeholder}
            </span>
        );
    }

    const priceListOptionTemplate = (option) => {
        //console.log ('# priceListOptionTemplate #');
        //console.log ('option: ', option)
        return (
            <div className="priceList-item">
                <div>{option.name}</div>
            </div>
        );
    };


    ////////////////////////////////
    // Headers funtctions
    ////////////////////////////////

    const header = (
        <div className="table-header">
            <h5 className="p-m-0">Vendedores</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={ (event) => setGlobalFilter (event.target.value) } placeholder="Buscar..." />
            </span>
        </div>
    );

    ////////////////////////////////
    // Footers funtctions
    ////////////////////////////////

    const newEmployeeDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={saveEmployee} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideInsertNewEmployeeDialog} />
        </React.Fragment>
    );

    const viewEmployeeDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={hideViewEmployeeDialog} />
        </React.Fragment>
    );

    const editEmployeeDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={saveEmployee} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideUpdateEmployeeDialog} />
        </React.Fragment>
    );

    const deleteEmployeeDialogFooter = (
        <React.Fragment>
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteEmployee} />
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEmployeeDialog} />
        </React.Fragment>
    );

    const deleteSelectedEmployeesDialogFooter = (
        <React.Fragment>
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedEmployees} />
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSelectedEmployeesDialog} />
        </React.Fragment>
    );


    ///////////////////////
    // Renderer
    ///////////////////////

    return (
        <div className="datatable-crud">

            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} className="p-datatable-striped" value={employees} dataKey="id" 
                    selection={selectedEmployees} onSelectionChange={(event) => setSelectedEmployees(event.value)}
                    rowHover = {true} scrollable scrollHeight="590px" autoLayout = {true}
                    //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    //currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                    globalFilter={globalFilter}
                    header={header}>

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    {/* <Column field="id" header="ID" sortable></Column> */} 
                    {/* <Column field="firstName" header="Nombre" sortable></Column> */}
                    {/* <Column header="Image" body={imageBodyTemplate}></Column> */} 
                    <Column field="fullName" header="Nombre" sortable></Column>
                    <Column field="email" header="Email" sortable></Column>
                    <Column field="region.name" header="Región" sortable></Column>
                    <Column field="priceList.name" header="Lista de Precios" sortable></Column>
                    <Column field="phone1" header="Tel" sortable></Column>
                    <Column body={actionBodyTemplate} headerStyle={{ width: '8em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />                  
                </DataTable>
            </div>

            <Dialog className="p-fluid" visible={newEmployeeDialog} style={{ width: '550px' }} header="Detalles del Empleado" modal closable={false} footer={newEmployeeDialogFooter} onHide={ () => {} }>
            {/* {employee.image && <img src={`assets/demo/images/employee/${employee.image}`} onError={(event) => event.target.src = 'assets/layout/images/avatar_4.png'} alt={employee.image} className="employee-image" />} */}

                <div className="p-field">
                    <span className="p-inputgroup-addon"> Nombre (requerido) </span>
                    <InputText id="firstNameInputText" value={inputFirstName} onChange={ (event) => onChangeInputFirstName (event) } required autoFocus className={classNames({ 'p-invalid': submitted && !inputFirstName })} />
                    {submitted && !inputFirstName && <small className="p-invalid">Requerido !</small>}
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Apellido (requerido) </span>
                    <InputText id="lastNameInputText" value={inputLastName} onChange={ (event) => onChangeInputLastName (event) } required autoFocus className={classNames({ 'p-invalid': submitted && !inputLastName })} />
                    {submitted && !inputLastName && <small className="p-invalid">Requerido !</small>}
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Región </span>
                    <Dropdown id="regionDropdown" value={selectedRegion} onChange={ (event) => { onChangeRegion (event) } } options={regions} optionLabel="name" dataKey="id" valueTemplate={selectedRegionTemplate} itemTemplate={regionOptionTemplate} showClear placeholder="Seleccione una región" scrollHeight='100px' autoWidth={false} />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Lista de Precios </span>
                    {/* <AutoComplete id="priceListAutoComplete" value={selectedPriceList} suggestions={filteredPriceLists} completeMethod={searchPriceList} field="name" itemTemplate={priceListOptionTemplate} tooltip="Ingrese el nombre de la lista de precios" onChange={ (event) => { onPriceListChange(event, 'priceList', 'id', 'name');} } placeholder="Seleccione una Lista de Precios" /> */}
                    <Dropdown id="priceListDropdown" value={selectedPriceList} onChange={ (event) => { onChangePriceList (event) } } options={priceLists} optionLabel="name" dataKey="id" valueTemplate={selectedPriceListTemplate} itemTemplate={priceListOptionTemplate} showClear placeholder="Seleccione una lista de precios" scrollHeight='100px' autoWidth={false} autoFocus />
                </div>

                <br/>
                <div className="p-field ">
                    <span className="p-inputgroup-addon"> Dirección </span>
                    <InputText id="streetAddressInputText" value={inputStreetAddress} onChange={ (event) => onChangeInputStreetAddress (event) } />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Email (requerido) </span>
                    <InputText id="emailInputText" value={inputEmail} onChange={ (event) => onChangeInputEmail (event) } required className={classNames({ 'p-invalid': submitted && !inputEmail})} />
                    {submitted && !inputEmail && <small className="p-invalid">Email (requerido).</small>}
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Tel. </span>
                    <InputMask id="phone1InputMask" mask="9999999999999" value={inputPhone1} onChange={ (event) => onChangeInputPhone1 (event) }> </InputMask>
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> DNI </span>
                    <InputMask id="dniInputMask" mask="99.999.999" value={inputDni} onChange={ (event) => onChangeInputDni (event) }> </InputMask>
                </div>
            </Dialog>

            <Dialog className="p-fluid" visible={viewEmployeeDialog} style={{ width: '550px' }} header="Detalles del Empleado" modal closable={false} footer={viewEmployeeDialogFooter} onHide={ () => {} }>
            {/* {employee.image && <img src={`assets/demo/images/employee/${employee.image}`} onError={(event) => event.target.src = 'assets/layout/images/avatar_4.png'} alt={employee.image} className="employee-image" />} */}

                <div className="p-field">
                    <span className="p-inputgroup-addon"> Nombre (requerido) </span>
                    <InputText id="firstNameInputText" value={inputFirstName} onChange={ (event) => onChangeInputFirstName (event) } disabled = {true} />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Apellido (requerido) </span>
                    <InputText id="lastNameInputText" value={inputLastName} onChange={ (event) => onChangeInputLastName (event) } disabled = {true} />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Región </span>
                    <Dropdown id="regionDropdown" value={selectedRegion} onChange={ (event) => { onChangeRegion (event) } } options={regions} optionLabel="name" dataKey="id" valueTemplate={selectedRegionTemplate} itemTemplate={regionOptionTemplate} disabled = {true} />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Lista de Precios </span>
                    <Dropdown id="priceListDropdown" value={selectedPriceList} onChange={ (event) => { onChangePriceList (event) } } options={priceLists} optionLabel="name" dataKey="id" valueTemplate={selectedPriceListTemplate} itemTemplate={priceListOptionTemplate} disabled = {true} />
                </div>

                <br/>
                <div className="p-field ">
                    <span className="p-inputgroup-addon"> Dirección </span>
                    <InputText id="streetAddressInputText" value={inputStreetAddress} onChange={ (event) => onChangeInputStreetAddress (event) } disabled = {true}/>
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Email (requerido) </span>
                    <InputText id="emailInputText" value={inputEmail} onChange={ (event) => onChangeInputEmail (event) } disabled = {true} />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Tel. </span>
                    <InputMask id="phone1InputMask" mask="9999999999999" value={inputPhone1} onChange={ (event) => onChangeInputPhone1 (event) } disabled = {true}>  </InputMask>
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> DNI </span>
                    <InputMask id="dniInputMask" mask="99.999.999" value={inputDni} onChange={ (event) => onChangeInputDni (event) } disabled = {true}> </InputMask>
                </div>
            </Dialog>

            <Dialog visible={editEmployeeDialog} style={{ width: '550px' }} header="Detalles del Empleado" modal closable={false} className="p-fluid" footer={editEmployeeDialogFooter} onHide={ () => {} }>
            {/* {employee.image && <img src={`assets/demo/images/employee/${employee.image}`} onError={(event) => event.target.src = 'assets/layout/images/avatar_4.png'} alt={employee.image} className="employee-image" />} */}

                <div className="p-field">
                    <span className="p-inputgroup-addon"> Nombre (requerido) </span>
                    <InputText id="firstNameInputText" value={inputFirstName} onChange={ (event) => onChangeInputFirstName (event) } required autoFocus className={classNames({ 'p-invalid': submitted && !inputFirstName })} />
                    {submitted && !inputFirstName && <small className="p-invalid">Requerido !</small>}
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Apellido (requerido) </span>
                    <InputText id="lastNameInputText" value={inputLastName} onChange={ (event) => onChangeInputLastName (event) } required autoFocus className={classNames({ 'p-invalid': submitted && !inputLastName })} />
                    {submitted && !inputLastName && <small className="p-invalid">Requerido !</small>}
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Región </span>
                    <Dropdown id="regionDropdown" value={selectedRegion} onChange={ (event) => { onChangeRegion (event) } } options={regions} optionLabel="name" dataKey="id" valueTemplate={selectedRegionTemplate} itemTemplate={regionOptionTemplate} showClear placeholder="Seleccione una región" scrollHeight='100px' autoWidth={false} />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Lista de Precios asignada </span>
                    {/* <AutoComplete id="priceListAutoComplete" value={selectedPriceList} suggestions={filteredPriceLists} completeMethod={searchPriceList} field="name" itemTemplate={priceListOptionTemplate} tooltip="Ingrese el nombre de la lista de precios" onChange={ (event) => { onPriceListChange(event, 'priceList', 'id', 'name');} } placeholder="Seleccione una Lista de Precios" /> */}
                    <Dropdown id="priceListDropdown" value={selectedPriceList} onChange={ (event) => { onChangePriceList (event) } } options={priceLists} optionLabel="name" dataKey="id" valueTemplate={selectedPriceListTemplate} itemTemplate={priceListOptionTemplate} showClear placeholder="Seleccione una lista de precios" scrollHeight='100px' autoWidth={false} autoFocus />
                </div>

                <br/>
                <div className="p-field ">
                    <span className="p-inputgroup-addon"> Dirección </span>
                    <InputText id="streetAddressInputText" value={inputStreetAddress} onChange={ (event) => onChangeInputStreetAddress (event) } />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Email (requerido) </span>
                    <InputText id="emailInputText" value={inputEmail} onChange={ (event) => onChangeInputEmail (event) } required className={classNames({ 'p-invalid': submitted && !inputEmail})} />
                    {submitted && !inputEmail && <small className="p-invalid">Email (requerido).</small>}
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Tel. </span>
                    <InputMask id="phone1InputMask" mask="9999999999999" value={inputPhone1} onChange={ (event) => onChangeInputPhone1 (event) }> </InputMask>
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> DNI </span>
                    <InputMask id="dniInputMask" mask="99.999.999" value={inputDni} onChange={ (event) => onChangeInputDni (event) }> </InputMask>
                </div>
            </Dialog>

            <Dialog visible={deleteEmployeeDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEmployeeDialogFooter} onHide={hideDeleteEmployeeDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {employeeEdited && <span>¿Confirma ELIMINAR <b>{employeeEdited.fullName}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteSelectedEmployeesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSelectedEmployeesDialogFooter} onHide={hideDeleteSelectedEmployeesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {employeeEdited && <span>¿Confirma ELIMINACIÓN de los clientes seleccionados?</span>}
                </div>
            </Dialog>
        </div>
    );

}