import React, { useState, useEffect, useRef } from 'react';
import { CheckingAccountService, CheckAccTransactionService } from "../service/CheckingAccountService";
import { CustomerService } from '../service/CustomerService';
import { EmployeeService } from "../service/EmployeeService";
import { LocalityService } from "../service/LocalityService";
import { LoggerService } from "../service/LoggerService";
import { RegionService } from "../service/RegionService";
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete } from 'primereact/autocomplete';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from 'primereact/inputmask';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import classNames from 'classnames';
import '../layout/CrudCustomer.scss';

export function CrudCustomer() {

    ////////////////////////////////
    // empty initialization objects
    ////////////////////////////////
    
    const emptyCustomer = {
        id: null,
        name:'',
        cuit:'',
        streetAddress:'',
        email:'',
        customerPhone1:'',
        contact:'',
        contactPhone1:'',
        locality: {id: null, name: ''},
        region: {id: null, name: ''},
        salesRep: {id: null, name: ''}, //salesRep:{name:'',image:null},
        checkingAccount: {id: null, name: ''}, 
        dateCreated: null,
        dateUpdated: 0,
        dateDeleted: 0,
    };

    const emptyLocality = {
        id: null,
        name: ''
    }

    const emptyRegion = {
        id: null,
        name: ''
    }
    
    const emptySalesRep = {
        id: null,
        name: '',
    }

    const emptyCheckingAccount = {
        id: 0,
        name: '',
        balance: 0.00,
        lastTransactionDate: 0,
        currency: {id: 7, code: 'ARS'},
        transactions: [],
        dateCreated: 0,
        dateUpdated: 0,
        dateDeleted: 0,
    };

    const emptyCheckAccTransaction = {
        id: 0,
        amount: 0.00,
        type: 0, // -1 payment, 0 acc initialization, 1 sale
        description: 'Apertura de cuenta',
        checkingAccountId: 0,
        paymentMethod: {id:null, type:''},
        dateCreated: 0,
        dateUpdated: 0,
        dateDeleted: 0,
    };



    ////////////////////////////////
    // React hooks
    ////////////////////////////////

    // Customer Variables
    const [customers, setCustomers] = useState([]);
    const [customersUndo, setCustomersUndo] = useState([]);
    const [customerEdited, setCustomerEdited] = useState({});
    const [customerEditedUndo, setCustomerEditedUndo] = useState({});
    const [customerInsert, setCustomerInsert] = useState({});
    const [customerUpdate, setCustomerUpdate] = useState({});
    const [selectedCustomers, setSelectedCustomers] = useState([]);

    // Region Variables
    const [regions, setRegions] = useState([]);
    //const [selectedRegion, setSelectedRegion] = useState ( {...emptyRegion} );
    const [selectedRegion, setSelectedRegion] = useState ( null );
    //const [filteredRegions, setFilteredRegions] = useState([]);

    // Localities Variables
    const [localities, setLocalities] = useState([]);    
    //const [selectedLocality, setSelectedLocality] = useState ( {...emptyLocality} );
    const [selectedLocality, setSelectedLocality] = useState ( null );
    const [filteredLocalities, setFilteredLocalities] = useState([]);

    // Employee / Sales Rep Variables
    const [salesReps, setSalesReps] = useState([]);
    //const [selectedSalesRep, setSelectedSalesRep] = useState ( {...emptySalesRep} );
    const [selectedSalesRep, setSelectedSalesRep] = useState ( null );

    // Input Variables
    const [inputName, setInputName] = useState('');
    const [invalidInputName, setInvalidInputName] = useState(false);
    const [inputStreetAddress, setInputStreetAddress] = useState('');
    const [inputCustomerPhone1, setInputCustomerPhone1] = useState('');
    const [inputCuit, setInputCuit] = useState('');

    // Dialogs Variables
    const [newCustomerDialog, setNewCustomerDialog] = useState (false);
    const [viewCustomerDialog, setViewCustomerDialog] = useState (false);
    const [editCustomerDialog, setEditCustomerDialog] = useState (false);
    const [deleteCustomerDialog, setDeleteCustomerDialog] = useState (false);
    const [deleteSelectedCustomersDialog, setDeleteSelectedCustomersDialog] = useState (false);

    // Other Variables
    const [globalFilter, setGlobalFilter] = useState ( [] );
    const [submitted, setSubmitted] = useState (false);
    const [onChangedInput, setOnChangedInput] = useState (false);
    const toast = useRef (null);
    const dt = useRef (null);

    // Services
    const checkingAccountService = new CheckingAccountService();
    const checkAccTransactionService = new CheckAccTransactionService();
    const customerService = new CustomerService();
    const employeeService = new EmployeeService();
    const localityService = new LocalityService();
    const loggerService = new LoggerService();
    const regionService = new RegionService();

    useEffect( () => {
        
        fetchCustomerData();
        fetchEmployeeData();
        fetchRegionData();
        fetchLocalityData();
        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);


    ////////////////////////////////
    // DB Data Functions
    ////////////////////////////////

    async function fetchCustomerData () {

        await customerService.getCustomerList().then( (_customersData) => {
            console.log ('setCustomers(customersData): ', _customersData);
            loggerService.sendToLog (`setCustomers(customersData): ${_customersData}`)
            setCustomers (JSON.parse(JSON.stringify(_customersData)));
            setCustomersUndo (JSON.parse(JSON.stringify(_customersData)));
        });
    };

    async function putCustomer (_customer) {
        console.log ( '# putCustomer #' );
        //console.log ('customer: ', customer, '\n');
        let returnId = await customerService.putCustomer (_customer);
        //console.log ('returnId: ', returnId, '\n');
        toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Cliente Creado', life: 3000 });
        return returnId;
    };

    async function updateCustomer (_customer, option) {
        console.log ( '# updateCustomer #' );
        //console.log ('_customer: ', _customer, '\n');
        await customerService.updateCustomer (_customer).then ( (returnedValue) => { //update persistent data source.

            switch (option) {
                case 'update':
                    toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Cliente Actualizado', life: 3000 });
                    break;
                case 'delete':
                    toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Cliente Borrado', life: 3000 });
                    break;             
            }
            return returnedValue;
        })
    }

    async function fetchEmployeeData () {
        console.log ( '# fetchEmployeeData #' );
        await employeeService.getEmployeeList().then( (employeesData) => {
            //console.log ('employeesData: ',employeesData);
            setSalesReps(employeesData);
        });

    };

    async function fetchRegionData () {
        console.log ( '# fetchRegionData #' );
        await regionService.getRegionList().then( (regionsData) => {
            //console.log ('regionsData: ',regionsData);
            setRegions(regionsData);
        });
    };

    async function fetchLocalityData () {
        console.log ( '# fetchLocalityData #' );
        await localityService.getLocalityList().then( (localitiesData) => {
            //console.log ('LocalitiesData: ',LocalitiesData);
            setLocalities(localitiesData);
        });

    };

    async function putCheckingAccount (_checkingAccount) {
        console.log ( '# putCheckingAccount #' );
        //console.log ('_checkingAccount: ', _checkingAccount, '\n');
        let returnId = await checkingAccountService.putCheckingAccount (_checkingAccount);
        //console.log ('returnId: ', returnId, '\n');
        toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Cuenta Corriente Creada', life: 3000 });
        return returnId;
    };

    async function updateCheckingAccount (_checkingAccount, option) {
        console.log ( '# updateCheckingAccount #' );
        //console.log ('_checkingAccount: ', _checkingAccount, '\n');
        await checkingAccountService.updateCheckingAccount (_checkingAccount).then ( (returnedValue) => { //update persistent data source.

            switch (option) {
                case 'update':
                    toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Cuenta Corriente Actualizada', life: 3000 });
                    break;

                case 'delete':
                    toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Cuenta Corriente Actualizada', life: 3000 });
                    break;             
            }
            return returnedValue;
        })
    }

    async function findCheckingAccountTransaction (_checkingAccount) {
        console.log ( '# findCheckingAccountTransaction #' );
        //console.log ('_checkingAccount: ', _checkingAccount, '\n');
        let returnList = await checkAccTransactionService.findCheckAccTransactionList (_checkingAccount.id);
        //console.log ('returnId: ', returnId, '\n');
        return returnList;
    };

    async function putCheckAccTransaction (_checkingAccount) {
        console.log ( '# putCheckAccTransaction #' );
        //console.log ('_checkingAccount: ', _checkingAccount, '\n');
        let returnedId = await checkAccTransactionService.putCheckAccTransaction (_checkingAccount);
        toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Nuevo Movimiento Ingresado', life: 3000 });
        return returnedId;
    }

    async function updateCheckAccTransaction (_checkingAccount, option) {
        console.log ( '# updateCheckAccTransaction #' );
        //console.log ('_checkingAccount: ', _checkingAccount, '\n');
        await checkAccTransactionService.updateCheckAccTransaction (_checkingAccount).then ( (returnedValue) => { //update persistent data source.
            switch (option) {
                case 'update':
                    toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Movimiento Actualizado', life: 3000 });
                    break;

                case 'delete':
                    toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Movimientos Removidos', life: 3000 });
                    break;               
            }
            return returnedValue;
        }) 
    }



    ////////////////////////////////
    // Action Body Functions
    ////////////////////////////////

    const openNewCustomerDialog = () => {
        setCustomerEdited ( {...emptyCustomer} );
        setInputName (emptyCustomer.name);
        setInputCuit (emptyCustomer.cuit);
        setInputStreetAddress (emptyCustomer.streetAddress);
        setInputCustomerPhone1 (emptyCustomer.customerPhone1);
        setSelectedLocality (emptyLocality.name);
        setSelectedRegion ( {...emptyRegion} );
        setSelectedSalesRep ( {...emptySalesRep} );

        //setCheckingAccountEdited ( {...emptyCheckingAccount} );
        //setCheckAccTransactionEdited ( {...emptyCheckAccTransaction} );

        setSubmitted(false);
        setNewCustomerDialog(true);
    }

    const hideNewCustomerDialog = () => {
        setCustomerEdited( {...emptyCustomer} );
        setSubmitted(false);
        setNewCustomerDialog(false);
    }

    const openViewCustomerDialog = (rowData) => {
        setCustomerEdited ( { ...rowData } );
        setInputName ( rowData.name || '');
        setInputCuit ( rowData.cuit || '');
        setInputStreetAddress ( rowData.streetAddress || '' );
        setInputCustomerPhone1 ( rowData.customerPhone1 || '');
        setSelectedLocality ( rowData.locality.name || '');
        setSelectedRegion ( rowData.region );
        setSelectedSalesRep ( rowData.salesRep );

        //setCheckingAccountEdited ( {...emptyCheckingAccount} );
        //setCheckAccTransactionEdited ( {...emptyCheckAccTransaction} );

        //setSubmitted(false);
        setViewCustomerDialog(true);
    }

    const hideViewCustomerDialog = () => {

        setViewCustomerDialog(false);
    }

    const openEditCustomerDialog = (rowData) => {
        console.log('# openEditCustomerDialog #' );

        setCustomerEdited ( { ...rowData } );
        setCustomerEditedUndo ( JSON.parse(JSON.stringify ( { ...rowData } ) ) );
        setInputName ( rowData.name || '');
        setInputCuit ( rowData.cuit || '');
        setInputStreetAddress ( rowData.streetAddress || '' );
        setInputCustomerPhone1 ( rowData.customerPhone1 || '');
        setSelectedLocality ( rowData.locality.name || '');
        setSelectedRegion ( rowData.region );
        setSelectedSalesRep ( rowData.salesRep );

        console.log( 'rowData: ', rowData );
        //console.log( 'selectedRegion: ', selectedRegion );
        //console.log( 'selectedSalesrep: ', selectedSalesRep );

        setEditCustomerDialog(true);
    };

    const hideEditCustomerDialog = () => {
        setCustomerEdited ( JSON.parse (JSON.stringify ( {...customerEditedUndo} ) ) );
        setOnChangedInput (false);
        setSubmitted(false);
        setEditCustomerDialog(false);
    }

    const openDeleteCustomerDialog = (rowData) => {
        setCustomerEdited ( { ...rowData} );
        //setCheckingAccountSettingsUpdate ( JSON.parse (JSON.stringify ( {...emptyCheckingAccountSettingsUpdate} ) )  )
        //setCheckingAccountTransactionsUpdate (JSON.parse(JSON.stringify ( {...emptyCheckingAccountTransactionsUpdate} ) ) )
        setDeleteCustomerDialog (true);
    }

    const hideDeleteCustomerDialog = () => {
        console.log ('# hideDeleteCustomerDialog #');
        setCustomerEdited ( JSON.parse ( JSON.stringify ( {...customerEditedUndo} ) ) );
        setDeleteCustomerDialog(false);
    }
  
    const openDeleteSelectedCustomersDialog = () => { // Delete one or multiple selected customers
        console.log ('# openDeleteSelectedCustomersDialog #');

        //setCheckingAccountSettingsUpdate ( JSON.parse (JSON.stringify ( {...emptyCheckingAccountSettingsUpdate} ) )  )
        //setCheckingAccountTransactionsUpdate (JSON.parse(JSON.stringify ( {...emptyCheckingAccountTransactionsUpdate} ) ) )
        setDeleteSelectedCustomersDialog(true);
    }

    const hideDeleteSelectedCustomersDialog = () => {
        console.log ('# hideDeleteSelectedCustomersDialog #');

        setDeleteSelectedCustomersDialog(false);
    }



    ////////////////////////////////
    // Event Functions
    ////////////////////////////////

    const onChangeInputName = (event) => {
        console.log ('# onInputNameChange #');

        const val = event.target.value || '';
        let _customers = [...customers];
        let _customerEdited = { ...customerEdited };
        let _customerInsert = { ...customerInsert };
        let _customerUpdate = { ...customerUpdate };
        let _invalidInputName = {...invalidInputName};
        let validName = true;

        _customers.forEach ( (cust) => {
            if ( (cust.name.trim()) === (event.target.value.trim()) ) { validName = false }
        });

        if ( ( validName ) && ( event.target.value.trim() ) ) { 
            _invalidInputName = false;
            _customerEdited.name = val || '';
            (_customerEdited.id) ? _customerEdited.dateUpdated = Date.now() : _customerEdited.dateCreated = Date.now();
        }else {
            _invalidInputName = true;
        };

        if (_customerEdited.id) {
            _customerUpdate.name =_customerEdited.name;
            _customerUpdate.dateUpdated = _customerEdited.dateUpdated; // time stamp of the update
            setCustomerUpdate ( {..._customerUpdate} );
        } else {
            _customerInsert.name =_customerEdited.name;
            _customerInsert.dateCreated = _customerEdited.dateCreated; // Just needed here because if it's an insert (all onChange will be done at the same time) and this field is mandatory.
            setCustomerInsert ( {..._customerInsert} );
        }

        //console.log('_invalidInputName: ', _invalidInputName)

        setInvalidInputName (_invalidInputName);
        setInputName (val);
        setCustomerEdited ( {..._customerEdited} );
        setOnChangedInput (true);
    }

    const onChangeInputStreetAddress = (event) => {
        console.log ('# onInputStreetAddressChange #');

        const val = event.target.value || '';
        let _customerEdited = { ...customerEdited };
        let _customerInsert = { ...customerInsert };
        let _customerUpdate = { ...customerUpdate };

        _customerEdited.streetAddress = val || '';
        (_customerEdited.id) ? _customerEdited.dateUpdated = Date.now() : _customerEdited.dateCreated = Date.now();

        if (_customerEdited.id) {
            _customerUpdate.streetAddress =_customerEdited.streetAddress;
            _customerUpdate.dateUpdated = _customerEdited.dateUpdated; // time stamp of the update
            setCustomerUpdate ( {..._customerUpdate} );
        } else {
            _customerInsert.streetAddress =_customerEdited.streetAddress;
            _customerInsert.dateCreated = _customerEdited.dateCreated; // Just needed here because if it's an insert (all onChange will be done at the same time) and this field is mandatory.
            setCustomerInsert ( {..._customerInsert} );
        }

        setInputStreetAddress (val || '');
        setCustomerEdited ( {..._customerEdited} );
        setOnChangedInput (true);
    }

    const onChangeInputCuit = (event) => {
        console.log ('# onInputCuitChange #');

        const val = event.target.value || '';       
        let _customerEdited = { ...customerEdited };
        let _customerInsert = { ...customerInsert };
        let _customerUpdate = { ...customerUpdate };
        
        _customerEdited.cuit = val || '';
        (_customerEdited.id) ? _customerEdited.dateUpdated = Date.now() : _customerEdited.dateCreated = Date.now();

        if (_customerEdited.id) {
            _customerUpdate.cuit =_customerEdited.cuit;
            _customerUpdate.dateUpdated = _customerEdited.dateUpdated; // time stamp of the update
            setCustomerUpdate ( {..._customerUpdate} );
        } else {
            _customerInsert.cuit =_customerEdited.cuit;
            _customerInsert.dateCreated = _customerEdited.dateCreated; // Just needed here because if it's an insert (all onChange will be done at the same time) and this field is mandatory.
            setCustomerInsert ( {..._customerInsert} );
        }

        setInputCuit (val || '');
        setCustomerEdited ( {..._customerEdited} );
        setOnChangedInput (true);
    }

    const onChangeInputCustomerPhone1 = (event) => {
        console.log ('# onInputCustomerPhone1Change #');

        const val = event.target.value || '';
        let _customerEdited = { ...customerEdited };
        let _customerInsert = { ...customerInsert };
        let _customerUpdate = { ...customerUpdate };

        _customerEdited.customerPhone1 = val || '';
        (_customerEdited.id) ? _customerEdited.dateUpdated = Date.now() : _customerEdited.dateCreated = Date.now();

        if (_customerEdited.id) {
            _customerUpdate.customerPhone1 =_customerEdited.customerPhone1;
            _customerUpdate.dateUpdated = _customerEdited.dateUpdated; // time stamp of the update
            setCustomerUpdate ( {..._customerUpdate} );
        } else {
            _customerInsert.customerPhone1 =_customerEdited.customerPhone1;
            _customerInsert.dateCreated = _customerEdited.dateCreated; // Just needed here because if it's an insert (all onChange will be done at the same time) and this field is mandatory.
            setCustomerInsert ( {..._customerInsert} );
        }

        setInputCustomerPhone1 (val || '');
        setCustomerEdited ( {..._customerEdited} );
        setOnChangedInput (true);
    }

    const onChangeLocality = (event) => {
        console.log ('# onLocalityChange #');

        const val =  event.target.value || '';
        let _customerEdited = { ...customerEdited };
        let _customerInsert = { ...customerInsert };
        let _customerUpdate = { ...customerUpdate };

        //console.log ('val: ', val);

        _customerEdited.locality = { id: val.id || null, name: val.name || ''};
        (_customerEdited.id) ? _customerEdited.dateUpdated = Date.now() : _customerEdited.dateCreated = Date.now();

        if (_customerEdited.id) {
            _customerUpdate.locality =_customerEdited.locality;
            _customerUpdate.dateUpdated = _customerEdited.dateUpdated; // time stamp of the update
            setCustomerUpdate ( {..._customerUpdate} );
        } else {
            _customerInsert.locality =_customerEdited.locality;
            _customerInsert.dateCreated = _customerEdited.dateCreated; // Just needed here because if it's an insert (all onChange will be done at the same time) and this field is mandatory.
            setCustomerInsert ( {..._customerInsert} );
        }

        setSelectedLocality (val);
        setCustomerEdited ( {..._customerEdited} );
        setOnChangedInput (true);
    };

    const onChangeRegion = (event) => {
        console.log('# onRegionChange #')

        const val =  event.target.value || '';
        let _customerEdited = { ...customerEdited };
        let _customerInsert = { ...customerInsert };
        let _customerUpdate = { ...customerUpdate };

        //console.log ('val: ', val);
      
        _customerEdited.region = { id: val.id || null, name: val.name || ''};
        (_customerEdited.id) ? _customerEdited.dateUpdated = Date.now() : _customerEdited.dateCreated = Date.now();

        if (_customerEdited.id) {
            _customerUpdate.region =_customerEdited.region;
            _customerUpdate.dateUpdated = _customerEdited.dateUpdated; // time stamp of the update
            setCustomerUpdate ( {..._customerUpdate} );
        } else {
            _customerInsert.region =_customerEdited.region;
            _customerInsert.dateCreated = _customerEdited.dateCreated; // Just needed here because if it's an insert (all onChange will be done at the same time) and this field is mandatory.
            setCustomerInsert ( {..._customerInsert} );
        }

        setSelectedRegion (val);
        setCustomerEdited ( {..._customerEdited} );
        setOnChangedInput (true);
    }

    const onChangeSalesRep = (event) => {
        console.log('# onSalesRepChange #')
        
        const val =  event.target.value || '';
        let _customerEdited = { ...customerEdited };
        let _customerInsert = { ...customerInsert };
        let _customerUpdate = { ...customerUpdate };

        //console.log ('val: ', val);

        _customerEdited.salesRep = { id: val.id || null, name: val.name || ''};
        (_customerEdited.id) ? _customerEdited.dateUpdated = Date.now() : _customerEdited.dateCreated = Date.now();

        if (_customerEdited.id) {
            _customerUpdate.salesRep =_customerEdited.salesRep;
            _customerUpdate.dateUpdated = _customerEdited.dateUpdated; // time stamp of the update
            setCustomerUpdate ( {..._customerUpdate} );
        } else {
            _customerInsert.salesRep =_customerEdited.salesRep;
            _customerInsert.dateCreated = _customerEdited.dateCreated; // Just needed here because if it's an insert (all onChange will be done at the same time) and this field is mandatory.
            setCustomerInsert ( {..._customerInsert} );
        }

        setSelectedSalesRep (val);
        setCustomerEdited ( {..._customerEdited} );
        setOnChangedInput (true);
    }


    ////////////////////////////////
    // Persist Data Functions
    ////////////////////////////////

    const saveNewCustomer = async () => {

        console.log ('# saveNewCustomer #');
        
        //setSubmitted(true);
        let _customerEdited = { ...customerEdited };
        let _customerInsert = { ...customerInsert };

        if (_customerEdited.name.trim()) {

            _customerEdited.checkingAccount.id = await addCheckingAccount (_customerEdited); // call function to create Customer Checking Account
            _customerEdited.dateCreated = Date.now(); // created timestamp
            _customerEdited.dateUpdated = 0; // created timestamp
            _customerEdited.dateDeleted = 0; // created timestamp

            //console.log (' _customerEdited',  _customerEdited)

            _customerInsert = JSON.parse( JSON.stringify (_customerEdited) ); //Deep copy. Only on new price list (insert) all props are copied.

            //await customerService.putCustomer(_customerEdited); // Create new customer
            //toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Cliente Creado', life: 3000 });
            await putCustomer (_customerInsert); // Create new customer

        };

        fetchCustomerData();
        setNewCustomerDialog(false);
        
    }

    const saveEditCustomer = async () => {
        console.log ('# saveEditCustomer #');
        
        let _customers = [...customers];
        let _customerEdited = { ...customerEdited };
        let _customerUpdate = { ...customerUpdate };
        //let _checkingAccountEdited = { ...checkingAccountEdited };

        setSubmitted(true);

        console.log ('_customerEdited: ', _customerEdited);
        console.log ('_customerUpdate: ', _customerUpdate);

        if ( _customerEdited.name.trim() && onChangedInput ) {

            const index = findIndexById (_customerEdited.id);                
            _customers[index] = _customerEdited;

            _customerUpdate.id = _customerEdited.id;
            _customerUpdate.dateUpdated = Date.now(); // updated timestamp

            await updateCustomer (_customerUpdate, 'update'); //updates existing

            /*
            if ( _customerUpdate.name.trim() ) {
                _checkingAccountEdited.id = _customerEdited.checkingAccount.id;
                _checkingAccountEdited.name = _customerUpdate.name;
                await checkingAccountService.updateCheckingAccount(_checkingAccountEdited); //updates existing
            }
            */

            modifyCheckingAccount (_customerEdited)
            
            fetchCustomerData();

        }

        //console.log ('_customerEdited: ', _customerEdited);
        //console.log ('_customerUpdate: ', _customerUpdate);

        setOnChangedInput (false);
        setEditCustomerDialog(false);
    }

    // Delete single customer
    const deleteCustomer = async () => {
        console.log ('# deleteCustomer #');

        let _customers = [...customers];
        let _customerEdited = {...customerEdited};
        let _customerUpdate = {...customerUpdate};

        _customers = _customers.filter ( val => val.id !== _customerEdited.id );
        setCustomers ( _customers );

        _customerUpdate.id = _customerEdited.id; //timestamp updated
        _customerUpdate.dateUpdated = Date.now(); //timestamp updated
        _customerUpdate.dateDeleted = Date.now(); //logical delete

        //console.log('_customerUpdate', _customerUpdate);
        //console.log('_customerEdited', _customerEdited);

        await updateCustomer (_customerUpdate, 'delete') // soft delete
        await deleteCheckingAccount(_customerEdited.checkingAccount);

        setDeleteCustomerDialog(false);
    }

    const deleteSelectedCustomers = () => {
        console.log ('# deleteSelectedCustomers #');

        let _customers = [...customers];
        let _selectedCustomers = [...selectedCustomers];
        let _customerUpdate = {...customerUpdate};

        _customers = _customers.filter(val => !_selectedCustomers.includes(val));
        setCustomers(_customers);

        _selectedCustomers.forEach ( async (_customerEdited) => {
            //_customerEdited.dateUpdated = Date.now(); //timestamp updated
            //_customerEdited.dateDeleted = Date.now(); // logical delte
            _customerUpdate.id = _customerEdited.id; //timestamp updated
            _customerUpdate.dateUpdated = Date.now(); //timestamp updated
            _customerUpdate.dateDeleted = Date.now(); // logical delte
            
            await updateCustomer (_customerUpdate, 'delete') // Soft delete
            await deleteCheckingAccount (_customerEdited.checkingAccount);
        });

        setSelectedCustomers([]);
        setDeleteSelectedCustomersDialog(false);
    }

    const addCheckingAccount = async (_customer) => {
        console.log ('# saveCheckingAccount #');

        let _checkAccTransactionEdited = { ...emptyCheckAccTransaction };
        let _checkingAccountInsert = { ...emptyCheckingAccount };

        // Creates Checking Account
        _checkingAccountInsert.name = _customer.name;
        _checkingAccountInsert.dateCreated = Date.now(); // created timestamp
        _checkingAccountInsert.dateUpdated = 0; // created timestamp
        _checkingAccountInsert.dateDeleted = 0; // created timestamp

        _checkingAccountInsert.id = await putCheckingAccount (_checkingAccountInsert); // Create associated Checking Account

        // Initialize Checking Account first Transaction
        _checkAccTransactionEdited.checkingAccountId = _checkingAccountInsert.id;
        _checkAccTransactionEdited.dateCreated = Date.now(); // created timestamp

        _checkingAccountInsert.transactions.push (_checkAccTransactionEdited);

        //await checkAccTransactionService.putCheckAccTransaction (_checkingAccountTransactionsInsert);
        await putCheckAccTransaction (_checkingAccountInsert);

        return (_checkingAccountInsert.id);
    }

    const modifyCheckingAccount = async (_customer) => {
        console.log ('# modifyCheckingAccount #');
        
        let _checkingAccountUpdate = {};

        console.log ('_customer: ', _customer);
        //console.log ('_customerUpdate: ', _customerUpdate);

        if ( _customer.name.trim() ) {
            _checkingAccountUpdate.id = _customer.checkingAccount.id;
            _checkingAccountUpdate.name = _customer.name;
            //await checkingAccountService.updateCheckingAccount(_checkingAccountEdited); //updates existing
            await updateCheckingAccount (_checkingAccountUpdate, 'update'); //updates existing
        }

        setOnChangedInput (false);
    }

    // This function deletes checking account related to the customer
    const deleteCheckingAccount = async (_checkingAccount) => {
        console.log('# deleteCheckingAccount #', '\n');

        let _checkAccTransactionEdited = {}
        let _checkingAccountUpdate = { transactions:[] };
        //let _checkingAccountTransactionsUpdate = { ...checkingAccountTransactionsUpdate };
        //let _transactionsTarget = [];

        console.log ('_checkingAccount: ', _checkingAccount, '\n');

        // Sets customer's checking account update information
        _checkingAccountUpdate.id = _checkingAccount.id; //timestamp updated
        _checkingAccountUpdate.dateDeleted = Date.now(); //logical delete

        let _checkAccTransactionList = await findCheckingAccountTransaction (_checkingAccount.id); // Gets transactions list for customer's checking account
        
        console.log ('_checkAccTransactionList: ', _checkAccTransactionList);

        // Logical delete of all transaction in Checking Account
        _checkAccTransactionList.forEach ( async (chkAccTr) => {
            _checkAccTransactionEdited.id = chkAccTr.id; //timestamp updated
            _checkAccTransactionEdited.dateDeleted = Date.now(); //logical delete
            console.log('_checkAccTransactionEdited', _checkAccTransactionEdited, '\n' );
            //await checkAccTransactionService.updateCheckAccTransaction(_checkAccTransactionEdited); //updates existing
            //_transactionsTarget.push (JSON.parse( JSON.stringify (_checkAccTransactionEdited) ) );
            _checkingAccountUpdate.transactions.push (JSON.parse( JSON.stringify (_checkAccTransactionEdited) ) );
        });

        //_checkingAccountUpdate.transactions = ( JSON.parse(JSON.stringify(_transactionsTarget)) );

        await updateCheckAccTransaction (_checkingAccountUpdate, 'delete'); // soft delete of all transactions in the checking account deleted
        console.log('_checkingAccountUpdate',_checkingAccountUpdate );

        await updateCheckingAccount (_checkingAccountUpdate, 'delete'); //soft delete

    }



    /*
    const addCheckingAccount = async (customerEdited) => {
        console.log ('# saveCheckingAccount #');

        let _checkingAccountEdited = {...checkingAccountEdited};
        let _checkAccTransactionEdited = {...checkAccTransactionEdited};

        // Creates Checking Account
        _checkingAccountEdited.name = customerEdited.name;
        _checkingAccountEdited.dateCreated = Date.now(); // created timestamp
        _checkingAccountEdited.dateUpdated = 0; // created timestamp
        _checkingAccountEdited.dateDeleted = 0; // created timestamp

        _checkingAccountEdited.id = await checkingAccountService.putCheckingAccount(_checkingAccountEdited); // Create associated Checking Account

        // Initialize Checking Account first Transaction
        _checkAccTransactionEdited.checkingAccount.id = _checkingAccountEdited.id;
        _checkAccTransactionEdited.dateCreated = Date.now(); // created timestamp

        await checkAccTransactionService.putCheckAccTransaction(_checkAccTransactionEdited);
        
        //toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Centa Corriente Creada', life: 3000 });

        return (_checkingAccountEdited.id);
    }
    */

    /*
    const saveEditCustomer = async () => {
 
        setSubmitted(true);
        let _customers = [...customers];
        let _customer = { ...customerEdited };

        if (_customer.name.trim()) {

            if (_customer.id) {

                const index = findIndexById(_customer.id);                
                _customers[index] = _customer;
                _customer.dateUpdated = Date.now(); // updated timestamp

                await customerService.updateCustomer(_customer); //updates existing
                toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Cliente Actualizado', life: 3000 });
            }

            fetchCustomerData();

            setEditCustomerDialog(false);
        }
    }
*/

    ////////////////////////////////
    // Supporting Functions
    ////////////////////////////////

    const findIndexById = (id) => {

        let _customers = [...customers];

        let index = -1;
        for (let i = 0; i < _customers.length; i++) {
            if (_customers[i].id === id) {
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

    /*
    const searchRegion = (event) => {
        //console.log ('event: ', event)
        setTimeout(() => {
            let _filteredRegions;
            if (!event.query.trim().length) {
                _filteredRegions = [...regions];
            }
            else {
                _filteredRegions = regions.filter ( (reg) => {
                    return reg.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }
            setFilteredRegions(_filteredRegions);
        }, 150);
    }
    */

    ////////////////////////////////
    // Layout formating  Functions
    ////////////////////////////////

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only" onClick={() => openViewCustomerDialog(rowData)} />
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-2" onClick={() => openEditCustomerDialog(rowData)} />
                {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only" onClick={() => openDeleteCustomerDialog(rowData)} /> */}
            </React.Fragment>
        );
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.name}
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
        return <img src={`assets/demo/images/product/${rowData.image}`} onError={(event) => event.target.src = 'assets/layout/images/avatar_4.png'} alt={rowData.image} className="customer-image" />
    }
   
    const searchLocality = (event) => {
        //console.log ('event: ', event)
        setTimeout(() => {
            let _filteredLocalities;
            if (!event.query.trim().length) {
                //_filteredLocalities = [...localities];
            }
            else {
                _filteredLocalities = localities.filter ( (loc) => {
                    return loc.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }
            setFilteredLocalities(_filteredLocalities);
        }, 150);
    }

    const localityOptionTemplate = (option) => {
        //console.log ('rlocalityOptionTemplate option: ', option)
        return (
            <div className="locality-item">
                <div>{option.name}</div>
            </div>
        );
    };

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

    const selectedSalesRepTemplate = (option, props) => {
        //console.log ('selectedSalesRepTemplate option: ', option)
        if (option) {
            return (
                <div className="salesRep-item salesRep-item-value">
                    <div>{option.fullName}</div>
                </div>
            );
        }
        return (
            <span>
                {props.placeholder}
            </span>
        );
    }

    const salesRepOptionTemplate = (option) => {
        //console.log ('salesRepOptionTemplate option: ', option)
        return (
            <div className="salesRep-item">
                <div>{option.fullName}</div>
            </div>
        );
    };

    ////////////////////////////////
    // Toolbar Functions
    ////////////////////////////////

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="" icon="pi pi-plus" className="p-button-secondary p-button-raised p-mr-2" onClick={openNewCustomerDialog} />
                <Button label="" icon="pi pi-minus" className="p-button-warning p-button-raised" onClick={openDeleteSelectedCustomersDialog} disabled={!selectedCustomers || !selectedCustomers.length} />
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

    ////////////////////////////////
    // Headers Functions
    ////////////////////////////////

    const header = (
        <div className="table-header">
            <h5 className="p-m-0">Clientes</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(event) => setGlobalFilter(event.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );


    ////////////////////////////////
    // Footers Functions
    ////////////////////////////////

    const newCustomerDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={saveNewCustomer} disabled={ invalidInputName || !inputName }/> 
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideNewCustomerDialog} />
        </React.Fragment>
    );

    const viewCustomerDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={hideViewCustomerDialog} /> 
        </React.Fragment>
    );

    const editCustomerDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={saveEditCustomer} disabled={ invalidInputName || !inputName }/> 
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideEditCustomerDialog} />
        </React.Fragment>
    );

    const deleteCustomerDialogFooter = (
        <React.Fragment>
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteCustomer} />
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCustomerDialog} />
        </React.Fragment>
    );

    const deleteSelectedCustomersDialogFooter = (
        <React.Fragment>
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedCustomers} />
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSelectedCustomersDialog} />
        </React.Fragment>
    );

    ////////////////////////////////
    // Renderer
    ////////////////////////////////

    return (
        <div className="datatable-crud">
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}> </Toolbar>

                <DataTable ref={dt} className="p-datatable-striped" value={customers} dataKey="id"
                    selection={selectedCustomers} onSelectionChange={ (event) => setSelectedCustomers(event.value)}
                    //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    //currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                    scrollable scrollHeight="650px"
                    globalFilter={globalFilter}
                    header={header}>

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                     <Column field="id" header="ID" sortable></Column>
                    <Column field="name" header="Cliente" sortable></Column>
                    {/* <Column header="Image" body={imageBodyTemplate}></Column> */} 
                    <Column field="cuit" header="CUIT" sortable></Column>
                    <Column field="locality.name" header="Localidad" sortable></Column>
                    {/* <Column field="region.name" header="Región" sortable></Column> */}
                    <Column field="salesRep.name" header="Vendedor" sortable></Column>
                    <Column field="customerPhone1" header="Teléfono"></Column>
                    <Column body={actionBodyTemplate} headerStyle={{ width: '8em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />                  
                </DataTable>
            </div>

            <Dialog visible={newCustomerDialog} style={{ width: '550px' }} header="Detalles del Cliente" modal closable={false} className="p-fluid" footer={newCustomerDialogFooter} onHide={ () => {} }>

                <div className="p-field">
                    <span className="p-inputgroup-addon"> Nombre / Razón Social </span>
                   {/* <InputText id="nameInputText" value={customerEdited.name} onChange={(event) => onInputTextChange(event, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !customerEdited.name })} /> */}
                    <InputText id="nameInputText" value={inputName} onChange={ (event) => onChangeInputName (event) } required autoFocus keyfilter={/^[^<>*!+`{}]+$/} className={classNames({ 'p-invalid': !inputName || invalidInputName })} />
                    { !inputName  && <small className="p-invalid"> Requerido !</small>}
                    { invalidInputName && <small className="p-invalid"> El nombre ya existe ! </small>}
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Localidad </span>
                    <AutoComplete id="localityAutoComplete" value={selectedLocality} suggestions={filteredLocalities} completeMethod={searchLocality} field ='name' itemTemplate={localityOptionTemplate} tooltip="Ingrese el nombre de la localidad" onChange={ (event) => { onChangeLocality(event); } } placeholder="Seleccione una localidad" /> 
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Región </span>
                    <Dropdown id="regionDropdown" value={selectedRegion} onChange={ (event) => { onChangeRegion (event) } } options={regions} optionLabel="name" dataKey="id" valueTemplate={selectedRegionTemplate} itemTemplate={regionOptionTemplate} showClear placeholder="Seleccione una región" scrollHeight='100px' autoWidth={false} /> 
                    {/* <AutoComplete id="regionAutoComplete" value={selectedRegion} suggestions={filteredRegions} completeMethod={searchRegion} field ='name' itemTemplate={regionOptionTemplate} tooltip="Ingrese el nombre de la región" onChange={ (event) => { onRegionChange (event) } } placeholder="Seleccione una región" /> */}
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Vendedor </span>
                    <Dropdown id="salesRepDropdown" value={selectedSalesRep} onChange={ (event) => { onChangeSalesRep (event) } } options={salesReps} optionLabel="fullName" dataKey="id" valueTemplate={selectedSalesRepTemplate} itemTemplate={salesRepOptionTemplate} showClear placeholder="Asigne un vendedor" scrollHeight='100px' autoWidth={false}/>
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Dirección </span>
                    <InputText id="streetAddressInputText" value={inputStreetAddress} onChange={ (event) => onChangeInputStreetAddress (event) } /> 
                </div>

                <br/>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"> Tel. </span>
                    <InputMask id="phone1InputMask" mask="+9999999999999" value={inputCustomerPhone1} onChange={ (event) => onChangeInputCustomerPhone1 (event) }> </InputMask>
                    <span className="p-inputgroup-addon"> CUIT </span>
                    <InputMask id="cuitInputMask" mask="99-99999999-9" value={inputCuit} onChange={ (event) => onChangeInputCuit (event) }> </InputMask>
                </div>
                {/*}
                <div className="ui-fluid p-formgrid p-grid">

                    <div className="p-field p-col">
                        <span className="p-inputgroup-addon"> Tel. </span>
                        <InputMask id="phone1InputMask" mask="+9999999999999" value={inputCustomerPhone1} onChange={ (event) => onChangeInputCustomerPhone1 (event) }> </InputMask>
                    </div>

                    <div className="p-field p-col">
                        <span className="p-inputgroup-addon"> CUIT </span>
                        <InputMask id="cuitInputMask" mask="99-99999999-9" value={inputCuit} onChange={ (event) => onChangeInputCuit (event) }> </InputMask>
                    </div>

                </div>
                */}
            </Dialog>

            <Dialog visible={viewCustomerDialog} style={{ width: '550px' }} header="Detalles del Cliente" modal closable={false} className="p-fluid" footer={viewCustomerDialogFooter} onHide={ () => {} }>

                <div className="p-field">
                    <span className="p-inputgroup-addon"> Nombre / Razón Social </span>
                   {/* <InputText id="nameInputText" value={customerEdited.name} onChange={(event) => onInputTextChange(event, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !customerEdited.name })} /> */}
                    <InputText id="nameInputText" value={inputName} onChange={ (event) => onChangeInputName (event) } required autoFocus keyfilter={/^[^<>*!+`{}]+$/} disabled={true}/>
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Localidad </span>
                    <AutoComplete id="localityAutoComplete" value={selectedLocality} suggestions={filteredLocalities} completeMethod={searchLocality} field ='name' itemTemplate={localityOptionTemplate} tooltip="Ingrese el nombre de la localidad" onChange={ (event) => { onChangeLocality(event); } } placeholder="Seleccione una localidad" disabled={true}/> 
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Región </span>
                    <Dropdown id="regionDropdown" value={selectedRegion} onChange={ (event) => { onChangeRegion (event) } } options={regions} optionLabel="name" dataKey="id" valueTemplate={selectedRegionTemplate} itemTemplate={regionOptionTemplate} showClear placeholder="Seleccione una región" scrollHeight='100px' autoWidth={false} disabled={true}/> 
                    {/* <AutoComplete id="regionAutoComplete" value={selectedRegion} suggestions={filteredRegions} completeMethod={searchRegion} field ='name' itemTemplate={regionOptionTemplate} tooltip="Ingrese el nombre de la región" onChange={ (event) => { onRegionChange (event) } } placeholder="Seleccione una región" /> */}
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Vendedor </span>
                    <Dropdown id="salesRepDropdown" value={selectedSalesRep} onChange={ (event) => { onChangeSalesRep (event) } } options={salesReps} optionLabel="fullName" dataKey="id" valueTemplate={selectedSalesRepTemplate} itemTemplate={salesRepOptionTemplate} showClear placeholder="Asigne un vendedor" scrollHeight='100px' autoWidth={false} disabled={true}/>
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Dirección </span>
                    <InputText id="streetAddressInputText" value={inputStreetAddress} onChange={ (event) => onChangeInputStreetAddress (event) } disabled={true} /> 
                </div>

                <br/>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"> Tel. </span>
                    <InputMask id="phone1InputMask" mask="+9999999999999" value={inputCustomerPhone1} onChange={ (event) => onChangeInputCustomerPhone1 (event) } disabled={true} />
                    <span className="p-inputgroup-addon"> CUIT </span>
                    <InputMask id="cuitInputMask" mask="99-99999999-9" value={inputCuit} onChange={ (event) => onChangeInputCuit (event) } disabled={true} />
                </div>

            </Dialog>

            <Dialog visible={editCustomerDialog} style={{ width: '550px' }} header="Detalles del Cliente" modal closable={false} className="p-fluid" footer={editCustomerDialogFooter} onHide={ () => {} }>

                <div className="p-field">
                    <label htmlFor="nameInput">Nombre / Razón Social</label>
                   {/* <InputText id="nameInputText" value={customerEdited.name} onChange={(event) => onInputTextChange(event, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !customerEdited.name })} /> */}
                    <InputText id="nameInputText" value={inputName} onChange={ (event) => onChangeInputName (event) } required autoFocus className={classNames({ 'p-invalid': submitted && !inputName })} />
                    {submitted && !inputName && <small className="p-invalid">Requerido !</small>}
                </div>

                <div className="ui-fluid p-formgrid p-grid">

                    <div className="p-field p-md-6">
                        {/* <h5>Localidad</h5> */}
                        <label htmlFor="localityAutoComplete">Localidad</label>
                       <AutoComplete id="localityAutoComplete" value={selectedLocality} suggestions={filteredLocalities} completeMethod={searchLocality} field ='name' itemTemplate={localityOptionTemplate} tooltip="Ingrese el nombre de la localidad" onChange={ (event) => { onChangeLocality (event) } } placeholder="Seleccione una localidad" /> 
                    </div>

                    <div className="p-field p-md-6">
                        {/* <h5>Región</h5> */}
                        <label htmlFor="regionDropdown">Región</label>
                        <Dropdown id="regionDropdown" value={selectedRegion} onChange={ (event) => {onChangeRegion (event) } } options={regions} optionLabel="name" dataKey="id" valueTemplate={selectedRegionTemplate} itemTemplate={regionOptionTemplate} showClear placeholder="Seleccione una región" scrollHeight='100px' autoWidth={false} /> 
                        {/* <AutoComplete id="regionAutoComplete" value={selectedRegion} suggestions={filteredRegions} completeMethod={searchRegion} field ='name' itemTemplate={regionOptionTemplate} tooltip="Ingrese el nombre de la región" onChange={ (event) => { onRegionChange(event) } } placeholder="Seleccione una región" /> */}
                    </div>

                    <div className="p-field p-md-6">
                        {/* <h5>SalesRep</h5> */}
                        <label htmlFor="salesRepDropdown">Vendedor</label>
                        <Dropdown id="salesRepDropdown" value={selectedSalesRep} onChange={ (event) => {onChangeSalesRep (event) } } options={salesReps} optionLabel="fullName" dataKey="id" valueTemplate={selectedSalesRepTemplate} itemTemplate={salesRepOptionTemplate} showClear placeholder="Asigne un vendedor" scrollHeight='100px' autoWidth={false}/>
                    </div>

                </div>

                <div className="p-field">
                    <label htmlFor="streetAddressInputText">Dirección</label>
                   {/* <InputText id="streetAddressInputText" value={customerEdited.streetAddress} onChange={(event) => onInputTextChange(event, 'streetAddress')} /> */}
                    <InputText id="streetAddressInputText" value={inputStreetAddress} onChange={ (event) => onChangeInputStreetAddress (event) } /> 
                </div>

                <div className="ui-fluid p-formgrid p-grid">

                    <div className="p-field p-col">
                        <label htmlFor="phone1InputMask">Tel.</label>
                        <InputMask id="phone1InputMask" mask="+9999999999999" value={inputCustomerPhone1} onChange={ (event) => onChangeInputCustomerPhone1 (event) }> </InputMask>
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="cuitInput">CUIT</label>
                        <InputMask id="cuitInputMask" mask="99-99999999-9" value={inputCuit} onChange={ (event) => onChangeInputCuit (event) }> </InputMask>
                    </div>

                </div>

            </Dialog>

            <Dialog visible={deleteCustomerDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCustomerDialogFooter} onHide={hideDeleteCustomerDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                  {/*  {customer && <span>¿Confirma ELIMINAR <b>{customer.name}</b>?</span>} */}
                    {customerEdited && <span>¿Confirma ELIMINAR <b>{customerEdited.name}</b>?</span>} 

                </div>
            </Dialog>

            <Dialog visible={deleteSelectedCustomersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSelectedCustomersDialogFooter} onHide={hideDeleteSelectedCustomersDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                  {/*  {customer && <span>¿Confirma ELIMINACIÓN de los clientes seleccionados?</span>} */}
                    {customerEdited && <span>¿Confirma ELIMINACIÓN de los clientes seleccionados?</span>}

                </div>
            </Dialog>
        </div>
    );
}