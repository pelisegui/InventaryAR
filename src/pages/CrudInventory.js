import React, { useState, useEffect, useRef } from 'react';
import { InventoryIndexCardService, InventoryIndexCardTransactionService } from '../service/InventoryService';
import { CurrencyService } from "../service/CurrencyService";
//import { ExchangeRateService } from "../service/ExchangeRateService";
import { StatusService } from "../service/StatusService";
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { PickList } from 'primereact/picklist';
import { ToggleButton } from 'primereact/togglebutton';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from 'primereact/inputmask';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { SpeedDial } from 'primereact/speeddial';
import classNames from 'classnames';
//import '../layout/CrudInventory.scss';
import '../layout/CrudInventory.css';

export function CrudInventory() {

    ////////////////////////////////////
    // Empty Objects for initialization
    ////////////////////////////////////

    const emptyInventoryIndexCard = {
        id: null,
        indexCardPartNumber: '', 
        indexCardName: '',
        minimumStock: '0',
        maximumStock: '0',
        calculatedQuantityBalance: '0',
        indexCardCreationDate: '0',
        lastTransactionDate: '0',
        transactions:[],
        inventoryMethod: null,
        product: {id: null, code: '', model:''},
        status: {id: 2, name:''},
        dateCreated: 0,
        dateUpdated: 0,
        dateDeleted: 0
    };

    const emptyInventoryIndexCardTransaction = {
        id: null,
        unitQuantity: 0,
        type: 0, // 0 initialize, 1 increment, -1 decrement 
        description: '',
        //inventoryIndexCard: {id: null, indexCardName: ''},
        inventoryIndexCardId: null,
        purchaseOrder: {id: 1, number: ''}, // 1 means no purchase order in place so manual input.
        saleOrder: {id: 1, number: ''}, // 1 means no sale order in place so manual input.
        warehouseSlot: {id: 1, code:''}, // 1 default slot (lobby)
        dateCreated: 0,
        dateUpdated: 0,
        dateDeleted: 0
    };

    const emptyCurrency = {
        id: 7,
        code: 'ARS',
    }

    const emptyInventoryIndexCardInsert = {
        id: 0,
        transactions: []
    };

    const emptyInventoryIndexCardUpdate = {
        id: 0,
        transactions: []
    };


    ///////////////
    // React Hooks
    ///////////////

    // Invetory Index Card Variables
    const [inventoryIndexCardList, setInventoryIndexCardList] = useState([]);    
    const [inventoryIndexCardListUndo, setInventoryIndexCardListUndo] = useState([]);
    const [inventoryIndexCardEdited, setInventoryIndexCardEdited] = useState( {} );
    const [inventoryIndexCardEditedUndo, setInventoryIndexCardEditedUndo] = useState({});
    const [inventoryIndexCardTransactionEdited, setInventoryIndexCardTransactionEdited] = useState({});
    const [inventoryIndexCardTransactionEditedUndo, setInventoryIndexCardTransactionEditedUndo] = useState({});
    const [inventoryIndexCardInsert, setInventoryIndexCardInsert] = useState({});
    const [inventoryIndexCardUpdate, setInventoryIndexCardUpdate] = useState({});
    const [inventoryIndexCardTransactionIsert, setInventoryIndexCardTransactionInsert] = useState({});
    const [transactionsSource, setTransactionsSource] = useState([]);
    const [transactionsTarget, setTransactionsTarget] = useState([]);

    // Status Variables
    const [statusList, setStatusList] = useState([]);    

    // Input Variables
    const [inputIndexCardName, setInputIndexCardName] = useState('');
    //const [invalidInputIndexCardName, setInvalidInputIndexCardName] = useState(false); 
    const [inputIndexCardPartNumber, setInputIndexCardPartNumber] = useState('');
    const [invalidInputIndexCardPartNumber, setInvalidInputIndexCardPartNumber] = useState(false); 
    const [inputTransactionUnitQuantity, setInputTransactionUnitQuantity] = useState(0);
    const [inputType, setInputType] = useState(0);
    const [inputTransactionDescription, setInputTransactionDescription] = useState('');
    const [inputMinimumStock, setInputMinimumStock] = useState(0);
    const [inputMaximumStock, setInputMaximumStock] = useState(0);
    const [inputInventoryMethod, setInputInventoryMethod] = useState(0);
    const [inputCurrency, setInputCurrency] = useState({...emptyCurrency});
    const [currencyList, setCurrencyList] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState({...emptyCurrency});
    const [selectedInventoryIndexCard, setSelectedInventoryIndexCard] = useState([]);
    const [selectedInventoryIndexCardTransactions, setSelectedInventoryIndexCardTransactions] = useState([]);

    // Dialog Variables
    const [viewInventoryIndexCardTransactionsDialog, setViewInventoryIndexCardTransactionsDialog] = useState(false);
    const [newInventoryIndexCardSettingDialog, setNewInventoryIndexCardSettingsDialog] = useState(false);
    const [editInventoryIndexCardSettingsDialog, setEditInventoryIndexCardSettingsDialog] = useState(false);
    const [editInventoryIndexCardTransactionsDialog, setEditInventoryIndexCardTransactionsDialog] = useState(false);
    const [InsertInventoryIndexCardTransactiDialog, setInsertInventoryIndexCardTransactiDialog] = useState(false);

    // Other Variables
    const [expandedRows, setExpandedRows] = useState ([]);
    const [globalFilter, setGlobalFilter] = useState([]);
    const [multiSortMeta, setMultiSortMeta] = useState( [ { field: 'indexCardPartNumber', order: -1 } ] );
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);

    // Services
    const inventoryIndexCardService = new InventoryIndexCardService();
    const inventoryIndexCardTransactionService = new InventoryIndexCardTransactionService();
    const currencyService = new CurrencyService();
    const statusService = new StatusService();

    useEffect( () => {

        inventoryIndexCardStockStatusUpdate();
        fetchInventoryIndexCardListData();
        fetchStatusListData();
        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);


    ///////////////////////
    // DB Data Functions
    ///////////////////////

    async function inventoryIndexCardStockStatusUpdate () {
        console.log ( '# inventoryIndexCardStockAutomaticUpdate #' );

        await inventoryIndexCardService.getInventoryIndexCardList().then( (inventoryIndexCardListData) => {
            //console.log ('inventoryIndexCardListData: ', inventoryIndexCardListData, '\n');

            inventoryIndexCardListData.forEach ( async (_inventoryIndexCard) => {

                let _inventoryIndexCardSettingsUpdate = {}

                // Adjust status
                if  (_inventoryIndexCard.calculatedQuantityBalance <= 0 ) {
                    _inventoryIndexCardSettingsUpdate.status = { id: 3 } // Out of Stock
                } else if (_inventoryIndexCard.calculatedQuantityBalance < _inventoryIndexCard.minimumStock) {
                    _inventoryIndexCardSettingsUpdate.status = { id: 2 } // Low Stock, under minimum required
                } else{
                    _inventoryIndexCardSettingsUpdate.status = { id: 1 } // Stock available, over minimum required
                }

                _inventoryIndexCardSettingsUpdate.id = _inventoryIndexCard.id;
                _inventoryIndexCardSettingsUpdate.dateUpdated = Date.now();
                //console.log ('_inventoryIndexCardSettingsUpdate: ', _inventoryIndexCardSettingsUpdate, '\n');

                await inventoryIndexCardService.updateInventoryIndexCard (_inventoryIndexCardSettingsUpdate)

            });
        
        });

    };

    async function fetchInventoryIndexCardListData () {
        console.log ( '# fetchInventoryIndexCardListData #' );

        await inventoryIndexCardService.getInventoryIndexCardList().then( (inventoryIndexCardListData) => {
            console.log ('inventoryIndexCardListData: ', inventoryIndexCardListData, '\n');
            setInventoryIndexCardList (JSON.parse(JSON.stringify(inventoryIndexCardListData)));
            setInventoryIndexCardListUndo (JSON.parse(JSON.stringify(inventoryIndexCardListData)));
        });
    };

    async function fetchInventoryIndexCardTransactionListData (_inventoryIndexCard) {
        console.log ( '# fetchInventoryIndexCardTransactionListData #' );

        await inventoryIndexCardTransactionService.getInventoryIndexCardTransactionList(_inventoryIndexCard.id).then( (inventoryIndexCardTransactionListData) => {
            console.log ('inventoryIndexCardTransactionListData: ', inventoryIndexCardTransactionListData, '\n');
            
            _inventoryIndexCard.transactions = [...inventoryIndexCardTransactionListData];

            console.log ('inventoryIndexCardTransactionListData: ', inventoryIndexCardTransactionListData, '\n');
            setInventoryIndexCardEdited (JSON.parse (JSON.stringify ( {..._inventoryIndexCard}) ) );
            setInventoryIndexCardEditedUndo (JSON.parse (JSON.stringify ( {..._inventoryIndexCard}) ) );
        });
    };

    async function putInventoryIndexCard (_inventoryIndexCardSettings) {
        console.log ( '# putInventoryIndexCard #' );
        let returnedId = await inventoryIndexCardService.putInventoryIndexCard (_inventoryIndexCardSettings);
        //console.log ('returnedId: ', returnedId, '\n');
        return returnedId;
    };

    async function putInventoryIndexCardTransactions (_inventoryIndexCardTransactions) {
        console.log ( '# putInventoryIndexCardTransactions #' );
        let returnedId = await inventoryIndexCardTransactionService.putInventoryIndexCardTransaction (_inventoryIndexCardTransactions);
        console.log ('returnedId: ', returnedId, '\n');
        return returnedId;

    };

    async function updateInventoryIndexCard (_inventoryIndexCardSettings) {
        console.log ( '# updateInventoryIndexCard #' );
        await inventoryIndexCardService.updateInventoryIndexCard (_inventoryIndexCardSettings).then( (returnedValue) => {
            console.log ('returnedValue: ', returnedValue, '\n');
            return returnedValue;
        });
        toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Inventario Actualizado', life: 3000 });
    };

    async function updateInventoryIndexCardTransactions (_inventoryIndexCardTransactions) {
        console.log ( '# updateInventoryIndexCardTransactions #' );
        await inventoryIndexCardTransactionService.updateInventoryIndexCardTransaction (_inventoryIndexCardTransactions).then( (returnedValue) => {
            console.log ('returnedValue: ', returnedValue, '\n');
            return returnedValue;
        });
    };

    async function fetchStatusListData () {
        console.log ('fetchStatusListData','\n');
        await statusService.getStatusList("'SaleOrder'").then( (statusListData) => { // must be between double cuotes to be used as string in SQLIte query
            console.log ('statusListData): ', statusListData);
            setStatusList (JSON.parse(JSON.stringify(statusListData)));
        });
    };


    ///////////////////////////////
    // Action Body Dialog Functions
    ///////////////////////////////

    const openViewInventoryIndexCardTransactionsDialog = (rowData) => {
        console.log ('# openViewInventoryIndexCardTransactionsDialog #');
        //console.log ('rowData: ', rowData);

        setInventoryIndexCardEdited ({ ...rowData });
        //fetchInventoryIndexCardTransactionListData({ ...rowData });

        setViewInventoryIndexCardTransactionsDialog(true);
    };

    const hideViewInventoryIndexCardTransactionsDialog = () => {
        //setSubmitted(false);
        setViewInventoryIndexCardTransactionsDialog(false);
    }

    const openInsertInventoryIndexCardSettingsDialog = (rowData) => { // Not enabled, business rule applied: Not possible to add Iventory Index Card in tblInventory
        console.log ('# openInsertInventoryIndexCardSettingsDialog #');
        setInventoryIndexCardEdited ({ ...emptyInventoryIndexCard });
        setInputIndexCardName ( emptyInventoryIndexCard.indexCardName );
        setInventoryIndexCardInsert (JSON.parse(JSON.stringify({...emptyInventoryIndexCardInsert})));

        setEditInventoryIndexCardSettingsDialog(true);
    };

    const hideInsertInventoryIndexCardSettingsDialog = () => { // Not enabled, business rule applied: Not possible to add Iventory Index Card in tblInventory
        console.log ('# hideInsertInventoryIndexCardSettingsDialog #');

        setSubmitted(false);
        setNewInventoryIndexCardSettingsDialog(false);
    };

    const openEditInventoryIndexCardSettingsDialog = (rowData) => {
        console.log ('# openEditInventoryIndexCardSettingsDialog #');
        //setInventoryIndexCardEdited ( { ...rowData } );
        setInventoryIndexCardEdited ( rowData );
        setInputIndexCardName ( rowData.indexCardName );
        setInputIndexCardPartNumber ( rowData.indexCardPartNumber );
        setInputMinimumStock ( rowData.minimumStock );
        setInputMaximumStock ( rowData.maximumStock );
        setInventoryIndexCardUpdate (JSON.parse (JSON.stringify( {...emptyInventoryIndexCardUpdate} ) ) );

        setEditInventoryIndexCardSettingsDialog(true);
    };

    const hideEditInventoryIndexCardSettingsDialog = () => {
        console.log ('# hideEditInventoryIndexCardSettingsDialog #');

        setInventoryIndexCardList(JSON.parse(JSON.stringify(inventoryIndexCardListUndo)));
        //setSubmitted(false);
        setEditInventoryIndexCardSettingsDialog(false);
    };

    const openInsertInventoryIndexCardTransactionDialog = (type) => { // Dialog for adding new transaction row into inventory transactions (used for manual reconciliation)
        console.log ('# openInsertInventoryIndexCardTransactionDialog #');

        let _inventoryIndexCardTransactionList = [...inventoryIndexCardEdited.transactions];
        let _inventoryIndexCardTransactionEdited = {...inventoryIndexCardTransactionEdited};

        console.log ('_inventoryIndexCardTransactionList', _inventoryIndexCardTransactionList);
        //console.log ('_inventoryIndexCardTransactionEdited', _inventoryIndexCardTransactionEdited);

        //_inventoryIndexCardTransactionEdited.inventory.id = _inventoryIndexCardEdited.id;
        _inventoryIndexCardTransactionEdited.type = type;
        setInventoryIndexCardInsert (JSON.parse (JSON.stringify ( {...emptyInventoryIndexCardInsert} ) ) );
        setTransactionsSource (_inventoryIndexCardTransactionList); // 
        setInventoryIndexCardTransactionEdited (_inventoryIndexCardTransactionEdited);
        
        setInsertInventoryIndexCardTransactiDialog(true);
    };
    
    const hideInsertInventoryIndexCardTransactiDialog = () => {
        //console.log ('# hideInsertInventoryIndexCardTransactiDialog #');

        //console.log ('inventoryIndexCardEdited', inventoryIndexCardEdited);
        //console.log ('inventoryIndexCardTransactionEditedUndo', inventoryIndexCardTransactionEditedUndo);
        //console.log ('inventoryIndexCardSettingsUpdate', inventoryIndexCardSettingsUpdate);
        //console.log ('inventoryIndexCardTransactiInsertUndo', inventoryIndexCardTransactiInsertUndo);
        //setInventoryIndexCardEdited (JSON.parse (JSON.stringify ( {...inventoryIndexCardEditedUndo} ) ) );
        //setInventoryIndexCardTransactionEdited (JSON.parse (JSON.stringify ( {...inventoryIndexCardTransactionEditedUndo} ) ) );
        setTransactionsSource([]);
        setInventoryIndexCardInsert({});
        setInventoryIndexCardUpdate ({});

        //setSubmitted(false);
        setInsertInventoryIndexCardTransactiDialog(false);
    }

    const openEditInventoryIndexCardTransactionsDialog = (rowData) => {
        console.log ('# openEditInventoryIndexCardTransactionsDialog #');
        console.log ('rowData: ', rowData);
        
        setInventoryIndexCardEdited ({ ...rowData });
        //fetchInventoryIndexCardTransactionListData({ ...rowData });

        //setInventoryIndexCardUpdate (JSON.parse (JSON.stringify ( {...emptyInventoryIndexCardUpdate} ) ) );
        setInventoryIndexCardTransactionEdited ( {...emptyInventoryIndexCardTransaction} );
        setInputTransactionUnitQuantity ( emptyInventoryIndexCardTransaction.unitQuantity );
        setInputTransactionDescription ( emptyInventoryIndexCardTransaction.description );
        setInputMaximumStock ( rowData.maximumStock )
        setInputMinimumStock ( rowData. minimumStock )

        let _inventoryIndexCardInsert = JSON.parse( JSON.stringify ({...emptyInventoryIndexCardInsert}) ) //New transaction inserted in a existing IndexCard, that's why we use _inventoryIndexCardInsert 
        _inventoryIndexCardInsert.dateUpdated = Date.now() //Used dateUpdated because we are inserting new transaction on n EXISTING Index Card
        //setSaleOrderInsert (JSON.parse (JSON.stringify ({...emptySaleOrderInsert}) ) );
        setInventoryIndexCardInsert ({..._inventoryIndexCardInsert}) ;

        let _inventoryIndexCardUpdate = JSON.parse( JSON.stringify ({...emptyInventoryIndexCardUpdate}) )
        _inventoryIndexCardUpdate.dateUpdated = Date.now()
        //setInventoryIndexCardUpdate (JSON.parse (JSON.stringify ({...emptyInventoryIndexCardUpdate}) ) );
        setInventoryIndexCardUpdate ( {..._inventoryIndexCardUpdate} );

        setEditInventoryIndexCardTransactionsDialog(true);
    };

    const hideEditInventoryIndexCardTransactionsDialog = () => {
        //console.log ('# hideEditInventoryIndexCardTransactionsDialog #');

        //setTransactionsSource([]);
        //setTransactionsTarget([]);        
        setInventoryIndexCardInsert({});
        setInventoryIndexCardUpdate({});
        setInventoryIndexCardList(JSON.parse(JSON.stringify(inventoryIndexCardListUndo)));
        setInventoryIndexCardEdited(JSON.parse(JSON.stringify(inventoryIndexCardEditedUndo)));
        //setSubmitted(false);
        setEditInventoryIndexCardTransactionsDialog(false);
    }
    
    // Needed only if trash can icon and action is added to actionBodyTemplate in datatable
    const openConfirmDeleteInventoryIndexCardTransactionDialog = (rowData) => {
        //setinventoryIndexCardTransactionEdited ( { ...rowData} );
        //setDeleteInventoryIndexCardTransactionDialog(true);
    }

    const hideDeleteInventoryIndexCardTransactionDialog = () => {
        //setDeleteInventoryIndexCardTransactionDialog(false);
    }


    ////////////////////////
    // Event Functions
    ////////////////////////

    const onChangeInputIndexCardPartNumber = (event) => {
        console.log ('# onChangeInputIndexCardPartNumber #');
        
        const val = event.target.value
        let _inventoryIndexCardList = [...inventoryIndexCardList]
        let _inventoryIndexCardEdited = { ...inventoryIndexCardEdited };
        let _inventoryIndexCardInsert = {...inventoryIndexCardInsert}; // to capture just modifications to price list settings
        let _inventoryIndexCardUpdate = {...inventoryIndexCardUpdate}; // to capture just modifications to price list settings
        let _invalidInputIndexCardPartNumber = {...invalidInputIndexCardPartNumber};
        let valid = true;

        //console.log ('_inventoryIndexCardList', _inventoryIndexCardList);
        //console.log ('_inventoryIndexCardEdited', _inventoryIndexCardEdited);
        //console.log ('_inventoryIndexCardInsert', _inventoryIndexCardInsert);
        //console.log ('_inventoryIndexCardUpdate', _inventoryIndexCardUpdate);

        _inventoryIndexCardList.forEach ( (_inventoryIndexCard) => { // Looks for repeated name in the Index Card List. Name must be unique.
            //console.log ('_inventoryIndexCard:', _inventoryIndexCard)
            if ( _inventoryIndexCard.indexCardPartNumber.trim() === val.trim() ) { valid = false }
        });
        //console.log('valid: ', valid);

        if ( valid ) {
            _invalidInputIndexCardPartNumber = false;
            _inventoryIndexCardEdited.indexCardPartNumber = val;

            if (_inventoryIndexCardUpdate.dateUpdated) { // checks if its an update or a new price list
                _inventoryIndexCardUpdate.id = _inventoryIndexCardEdited.id;
                _inventoryIndexCardUpdate.indexCardPartNumber = _inventoryIndexCardEdited.indexCardPartNumber
                //_inventoryIndexCardUpdate.dateUpdated = Date.now(); // time stamp of the update
                setInventoryIndexCardUpdate (_inventoryIndexCardUpdate); //to capture just modifications to sale order settings
            }
            
            if (_inventoryIndexCardInsert.dateCreated) { 
                _inventoryIndexCardInsert.indexCardPartNumber = _inventoryIndexCardEdited.indexCardPartNumber; // if has an id is an update, if not is an insert
                //_inventoryIndexCardInsert.dateCreated = Date.now(); // time stamp of the update
                setInventoryIndexCardInsert (_inventoryIndexCardInsert); //to capture just new insert to sale order settings
            }

        }else {
            _invalidInputIndexCardPartNumber = true;
        };

        //console.log('_invalidInputIndexCardPartNumber: ', _invalidInputIndexCardPartNumber)
        //console.log('event.target.value: ', event.target.value)
        //console.log('_inventoryIndexCardEdited: ', _inventoryIndexCardEdited)

        setInputIndexCardPartNumber (val);
        setInvalidInputIndexCardPartNumber (_invalidInputIndexCardPartNumber);
        setInventoryIndexCardEdited ( {..._inventoryIndexCardEdited} );
    }

    const onChangeInputIndexCardName = (event) => {
        console.log ('# onChangeInputIndexCardName #');

        const val = event.target.value
        let _inventoryIndexCardEdited = { ...inventoryIndexCardEdited };
        let _inventoryIndexCardInsert = {...inventoryIndexCardInsert}; // to capture just modifications to price list settings
        let _inventoryIndexCardUpdate = {...inventoryIndexCardUpdate}; //to capture just modifications to price list settings
        
        //console.log ('_inventoryIndexCardUpdate', _inventoryIndexCardUpdate);

        _inventoryIndexCardEdited.indexCardName = val;

        if (_inventoryIndexCardUpdate.dateUpdated){
            _inventoryIndexCardUpdate.id = _inventoryIndexCardEdited.id;
            _inventoryIndexCardUpdate.indexCardName = _inventoryIndexCardEdited.indexCardName
            //_inventoryIndexCardUpdate.dateUpdated = Date.now(); // time stamp of the update
            setInventoryIndexCardUpdate ( {..._inventoryIndexCardUpdate} ); //to capture just modifications to price list settings
        } 
        
        if (_inventoryIndexCardInsert.dateCreated) {
            _inventoryIndexCardInsert.indexCardName = _inventoryIndexCardEdited.indexCardName; //to capture just new inserts to price list settings
            //_inventoryIndexCardInsert.dateCreated = Date.now(); // time stamp of the update
            setInventoryIndexCardInsert ( {..._inventoryIndexCardInsert} ); //to capture just new inserts to price list settings
        }

        setInputIndexCardName (val);
        setInventoryIndexCardEdited ( {..._inventoryIndexCardEdited} );
    }

    const onChangeInputMinimumStock = (event) => {
        console.log ('# onChangeInputMinimumStock #');

        const val = event.value
        let _inventoryIndexCardEdited = { ...inventoryIndexCardEdited };
        let _inventoryIndexCardInsert = {...inventoryIndexCardInsert}; // to capture just modifications to price list settings
        let _inventoryIndexCardUpdate = {...inventoryIndexCardUpdate}; //to capture just modifications to price list settings

        console.log ('_inventoryIndexCardEdited', _inventoryIndexCardEdited);

        _inventoryIndexCardEdited.minimumStock = val;
        //(_inventoryIndexCardEdited.id) ? _inventoryIndexCardEdited.dateUpdated = Date.now() : _inventoryIndexCardEdited.dateCreated = Date.now();

        if (_inventoryIndexCardUpdate.dateUpdated){
            _inventoryIndexCardUpdate.id = _inventoryIndexCardEdited.id;
            _inventoryIndexCardUpdate.minimumStock = _inventoryIndexCardEdited.minimumStock
            //_inventoryIndexCardUpdate.dateUpdated = _inventoryIndexCardEdited.dateUpdated; // time stamp of the update
            setInventoryIndexCardUpdate ( _inventoryIndexCardUpdate ); //to capture just modifications to price list settings
            updateInventoryStockStatus(_inventoryIndexCardEdited, _inventoryIndexCardUpdate); // Need to update stock status accordingly when this value is changed
        } 
        
        if (_inventoryIndexCardInsert.dateCreated) {
            _inventoryIndexCardInsert.minimumStock = _inventoryIndexCardEdited.minimumStock; //to capture just new inserts to price list settings
            //_inventoryIndexCardInsert.dateCreated = _inventoryIndexCardEdited.dateCreated; // time stamp of the update
            setInventoryIndexCardInsert ( _inventoryIndexCardInsert ); //to capture just new inserts to price list settings
        }

        setInputMinimumStock (val);
        setInventoryIndexCardEdited ( {..._inventoryIndexCardEdited} );
    }

    const onChangeInputMaximumStock = (event) => {
        console.log ('# onChangeInputMaximumStock #');

        const val = event.value
        let _inventoryIndexCardEdited = { ...inventoryIndexCardEdited };
        let _inventoryIndexCardInsert = {...inventoryIndexCardInsert}; // to capture just modifications to price list settings
        let _inventoryIndexCardUpdate = {...inventoryIndexCardUpdate}; //to capture just modifications to price list settings
        
        //console.log ('_inventoryIndexCardUpdate', _inventoryIndexCardUpdate);

        _inventoryIndexCardEdited.maximumStock = val;
        //(_inventoryIndexCardEdited.id) ? _inventoryIndexCardEdited.dateUpdated = Date.now() : _inventoryIndexCardEdited.dateCreated = Date.now();

        if (_inventoryIndexCardUpdate.dateUpdated){
            _inventoryIndexCardUpdate.id = _inventoryIndexCardEdited.id;
            _inventoryIndexCardUpdate.maximumStock = _inventoryIndexCardEdited.maximumStock
            _inventoryIndexCardUpdate.dateUpdated = _inventoryIndexCardEdited.dateUpdated; // time stamp of the update
            setInventoryIndexCardUpdate ( {..._inventoryIndexCardUpdate} ); //to capture just modifications to price list settings
        }
        
        if (_inventoryIndexCardInsert.dateCreated) {
            _inventoryIndexCardInsert.maximumStock = _inventoryIndexCardEdited.maximumStock; //to capture just new inserts to inventoryIndexCard settings
            _inventoryIndexCardInsert.dateCreated = _inventoryIndexCardEdited.dateCreated; //to capture just new inserts to inventoryIndexCard settings
            setInventoryIndexCardInsert ( {..._inventoryIndexCardInsert} ); //to capture just new inserts to inventoryIndexCard settings
        }

        setInputMaximumStock (val);
        setInventoryIndexCardEdited ( {..._inventoryIndexCardEdited} );
    }

    const onChangeInputTransactionUnitQuantity = (event, dataTableProps) => { // For manual reconciliation of stock
        console.log('# onChangeInputTransactionUnitQuantity #');

        //console.log ('event', event)
        const val = event.value || 0;
        let _inventoryIndexCardEdited = { ...inventoryIndexCardEdited };
        let _inventoryIndexCardInsert = { ...inventoryIndexCardInsert };
        let _inventoryIndexCardUpdate = { ...inventoryIndexCardUpdate };   
        let _inventoryIndexCardTransactionEdited = {};
        (dataTableProps) ? _inventoryIndexCardTransactionEdited = dataTableProps.rowData : _inventoryIndexCardTransactionEdited = { ...inventoryIndexCardTransactionEdited };

        //console.log ('event', event)
        //console.log ('dataTableProps ', dataTableProps);
        //console.log ('_inventoryIndexCardEdited ', _inventoryIndexCardEdited);
        //console.log ('_inventoryIndexCardUpdate ', _inventoryIndexCardUpdate);

        //(_inventoryIndexCardEdited.id) ? _inventoryIndexCardEdited.dateUpdated = Date.now() : _inventoryIndexCardEdited.dateCreated = Date.now(); // For current busines rules there  is always an existing inventoryIndexCard when inserting transactions manually
        _inventoryIndexCardTransactionEdited.unitQuantity = val * _inventoryIndexCardTransactionEdited.type; // New transaction quantity
        (_inventoryIndexCardTransactionEdited.id) ? _inventoryIndexCardTransactionEdited.dateUpdated = Date.now() : _inventoryIndexCardTransactionEdited.dateCreated = Date.now();

        _inventoryIndexCardEdited.calculatedQuantityBalance += _inventoryIndexCardTransactionEdited.unitQuantity; // New quantity balance

        if (_inventoryIndexCardEdited.id){
            _inventoryIndexCardUpdate.calculatedQuantityBalance = _inventoryIndexCardEdited.calculatedQuantityBalance
            _inventoryIndexCardUpdate.dateUpdated = _inventoryIndexCardEdited.dateUpdated // time stamp of the update
            setInventoryIndexCardUpdate ( {..._inventoryIndexCardUpdate} ); //to capture just modifications to price list settings
        } else {
            _inventoryIndexCardInsert.maximumStock = _inventoryIndexCardEdited.maximumStock; //to capture just new inserts to price list settings
            _inventoryIndexCardInsert.dateCreated = _inventoryIndexCardEdited.dateCreated; //to capture just new inserts to inventoryIndexCard settings
            setInventoryIndexCardInsert ( {..._inventoryIndexCardInsert} ); //to capture just new inserts to price list settings
        }

        // inventoryIndexCardTransactionEdited changes are not saved in _inventoryIndexCardUpdate to avoid multiple row insertion during function call (onChange value in renderer)
        // each key pressed generates a function call, that makes iteract through if loop for each number presed, generating multiple rows insertion with each number.
        
        setInputTransactionUnitQuantity (val);
        setInventoryIndexCardEdited ( {..._inventoryIndexCardEdited} );
        setInventoryIndexCardTransactionEdited ( {..._inventoryIndexCardTransactionEdited} );
    }
    
    const onChangeInputDescription = (event, dataTableProps) => { // For manual reconciliation of stock
        console.log('# onChangeInputDescription #');

        //console.log ('event', event)
        const val = event.target.value || '';
        let _inventoryIndexCardTransactionEdited = {};
        (dataTableProps) ? _inventoryIndexCardTransactionEdited = dataTableProps.rowData : _inventoryIndexCardTransactionEdited = { ...inventoryIndexCardTransactionEdited };

        //console.log ('dataTableProps ', dataTableProps);
        //console.log ('_inventoryIndexCardEdited ', _inventoryIndexCardEdited);
        //console.log ('_inventoryIndexCardUpdate ', _inventoryIndexCardUpdate);

        _inventoryIndexCardTransactionEdited.description = val; // New transaction quantity
        (_inventoryIndexCardTransactionEdited.id) ? _inventoryIndexCardTransactionEdited.dateUpdated = Date.now() : _inventoryIndexCardTransactionEdited.dateCreated = Date.now();

        setInputTransactionDescription (val);
        //setInventoryIndexCardEdited ( {..._inventoryIndexCardEdited} );
        setInventoryIndexCardTransactionEdited ( {..._inventoryIndexCardTransactionEdited} );
    }

    const onCurrencyDropDownChange = (event) => { // code should be like onChangeInputTransactionUnitQuantity but no editing of transactions posible because of business rule applied
        console.log('# onCurrencyDropDownChange #');

        const val =  event.target.value || null;
        let _inventoryIndexCardTransactionEdited = { ...inventoryIndexCardTransactionEdited };
        
        _inventoryIndexCardTransactionEdited.currency = {id: val.id || null, code: val.code || ''};

        setSelectedCurrency(val);
        setInventoryIndexCardTransactionEdited (_inventoryIndexCardTransactionEdited);
    };

    const onFocusInput = (event) => {
        console.log('# onFocusInput #');

        event.target.select();
    }

    const onRowExpand = (event) => {
        // toast.current.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    }

    const onRowCollapse = (event) => {
       // toast.current.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    }

    const expandAll = () => {

        let _expandedRows = {};
        let _inventoryIndexCardEdited = {...inventoryIndexCardEdited};
        _inventoryIndexCardEdited.transactions.forEach ( (chkAccT) => _expandedRows[`${chkAccT.id}`] = true);

        setExpandedRows(_expandedRows);
    }

    const collapseAll = () => {
        setExpandedRows(null);
    }


    //////////////////////////////////////
    // Action Body Complementary Functions
    //////////////////////////////////////

    const addNewInventoryIndexCardTransaction = () => { // Adds a transaction row into inventory transactions (used for manual reconciliation)
        console.log ('# addNewInventoryIndexCardTransaction #');

        let _inventoryIndexCardEdited = {...inventoryIndexCardEdited}; // Shallow copy to reference array.
        let _inventoryIndexCardTransactionEdited = {...inventoryIndexCardTransactionEdited};
        let _inventoryIndexCardInsert = {...inventoryIndexCardInsert};
        let _inventoryIndexCardUpdate = { ...inventoryIndexCardUpdate };
 
        //console.log ('_inventoryIndexCardEdited', _inventoryIndexCardEdited);
        //console.log ('_inventoryIndexCardTransactionEdited', _inventoryIndexCardTransactionEdited);
        //console.log ('_inventoryIndexCardInsert', _inventoryIndexCardInsert);

        (_inventoryIndexCardEdited.id) ? _inventoryIndexCardEdited.dateUpdated = Date.now() : _inventoryIndexCardEdited.dateCreated = Date.now();
        _inventoryIndexCardTransactionEdited.inventoryIndexCardId = _inventoryIndexCardEdited.id
        _inventoryIndexCardEdited.transactions.push(_inventoryIndexCardTransactionEdited) // Updates the element that will be rendered in the UI


        if (_inventoryIndexCardEdited.id) { // if its an existing inventory index card it will have an id, if not it is a new added one with id = null or zero

            _inventoryIndexCardUpdate.id = _inventoryIndexCardEdited.id
            _inventoryIndexCardUpdate.calculatedQuantityBalance = _inventoryIndexCardEdited.calculatedQuantityBalance
            _inventoryIndexCardUpdate.dateUpdated = _inventoryIndexCardEdited.dateUpdated;

            if (_inventoryIndexCardTransactionEdited.id) {
                //index = findInventoryIndexCardTransactionIndexById (_inventoryIndexCardTransactionEdited.inventoryIndexCardId, _inventoryIndexCardUpdate); // finds new added transaction_id to update it during editing before inserting it into transactions table in the db
                const index = _inventoryIndexCardUpdate.transactions.findIndex (_transaction => _transaction.id === _inventoryIndexCardTransactionEdited.id ); // finds if the edited transaction was already edited an is already included in the _inventoryIndexCardUpdate to do a new editing before inserting it into transactions table in the db
                if (index >=0) {
                    _inventoryIndexCardUpdate.transactions[index] = _inventoryIndexCardTransactionEdited;
                } else { // If the first change during current edition, it will be added to the _inventoryIndexCardUpdate.transactions array in _inventoryIndexCardUpdate object
                    _inventoryIndexCardUpdate.transactions.push( _inventoryIndexCardTransactionEdited )
                }
            } else {
                _inventoryIndexCardUpdate.transactions.push( _inventoryIndexCardTransactionEdited )
            }

            setInventoryIndexCardUpdate ( {..._inventoryIndexCardUpdate} );
            updateInventoryStockStatus(_inventoryIndexCardEdited, _inventoryIndexCardUpdate)

        } else { // Its a new Index Card

            _inventoryIndexCardInsert.calculatedQuantityBalance = _inventoryIndexCardEdited.calculatedQuantityBalance
            _inventoryIndexCardInsert.dateCreated = _inventoryIndexCardEdited.dateCreated;
            _inventoryIndexCardInsert.transactions.push ( _inventoryIndexCardTransactionEdited );

            setInventoryIndexCardInsert ( {..._inventoryIndexCardInsert} );
            updateInventoryStockStatus(_inventoryIndexCardEdited, _inventoryIndexCardInsert)
        }

        //console.log ('_inventoryIndexCardEdited', _inventoryIndexCardEdited);
        //console.log ('_inventoryIndexCardTransactionEdited', _inventoryIndexCardTransactionEdited);
        //console.log ('_inventoryIndexCardInsert', _inventoryIndexCardInsert);
        //console.log ('_inventoryIndexCardUpdate', _inventoryIndexCardUpdate);

        setInventoryIndexCardEdited (_inventoryIndexCardEdited);
        setInsertInventoryIndexCardTransactiDialog(false);
    };

    const updateInventoryStockStatus = (_inventoryIndexCard, _indexCardUpdates) => { // Called from onChangeInvenotryMinimumStock
        console.log ( '# updateInventoryStockStatus #' );

        let _statusList = [...statusList];
        let _inventoryIndexCardEdited = {};
        (_inventoryIndexCard) ? _inventoryIndexCardEdited = _inventoryIndexCard : _inventoryIndexCardEdited = {...inventoryIndexCardEdited};
        let _inventoryIndexCardUpdate = {};
        (_indexCardUpdates) ? _inventoryIndexCardUpdate = _indexCardUpdates : _inventoryIndexCardUpdate = {...inventoryIndexCardUpdate};

        console.log ('_inventoryIndexCardEdited', _inventoryIndexCardEdited);
        console.log ('_inventoryIndexCardUpdate', _inventoryIndexCardUpdate);

        // Adjust status
        if  (_inventoryIndexCardEdited.calculatedQuantityBalance <= 0 ) {
            _inventoryIndexCardEdited.status.id = 3 // Out of Stock
        } else if (_inventoryIndexCardEdited.calculatedQuantityBalance < _inventoryIndexCardEdited.minimumStock) {
            _inventoryIndexCardEdited.status.id = 2 // Low Stock, under minimum required
        } else{
            _inventoryIndexCardEdited.status.id = 1 // Stock available, over minimum required
        }

        _statusList.forEach ( (status) => {
            if (status.id === _inventoryIndexCardEdited.status.id) {
                _inventoryIndexCardEdited.status = { id: status.id, code: status.code, group: status.group, name: status.name}
            }
        })

        _inventoryIndexCardUpdate.status = _inventoryIndexCardEdited.status
        _inventoryIndexCardUpdate.dateUpdated = Date.now();

        console.log ('_inventoryIndexCardEdited', _inventoryIndexCardEdited);
        console.log ('_inventoryIndexCardUpdate', _inventoryIndexCardUpdate);

        setInventoryIndexCardEdited (_inventoryIndexCardEdited)
        setInventoryIndexCardUpdate (_inventoryIndexCardUpdate)
    };

    /////////////////////////
    // Persist data Functions
    /////////////////////////

    const saveInventoryIndexCardSettings = async (event, _inventoryIndexCard) => { //Use this instead of saveNewInventoryIndexCardSettings
        console.log ('# saveInventoryIndexCardSettings #');

        let _inventoryIndexCardList = [...inventoryIndexCardList];
        let _inventoryIndexCardEdited = { ...inventoryIndexCardEdited};
        let _inventoryIndexCardInsert = {...inventoryIndexCardInsert};
        let _inventoryIndexCardUpdate = null;
        (_inventoryIndexCard) ? _inventoryIndexCardUpdate = { ..._inventoryIndexCard } : _inventoryIndexCardUpdate = {...inventoryIndexCardUpdate}; ;
        //let _inventoryIndexCardTransactionInsert = { ...inventoryIndexCardTransactionsInsert };
        //setSubmitted(true); // used for input control in form, not in use

        console.log ('_inventoryIndexCardEdited: ', _inventoryIndexCardEdited);
        console.log ('_inventoryIndexCardInsert', _inventoryIndexCardInsert);
        console.log ('_inventoryIndexCardUpdate', _inventoryIndexCardUpdate);
        //console.log ('_inventoryIndexCardTransactionInsert', _inventoryIndexCardTransactionInsert);

        if ( inputMinimumStock !== null && inputMaximumStock !== null ) {

            if (_inventoryIndexCardEdited.id) { // If inventory already exist then update it in the UI with new values

                //const index = findInventoryIndexCardListIndexById(_inventoryIndexCardEdited.id);
                const index = _inventoryIndexCardList.findIndex (_inventoryIndexCard => _inventoryIndexCard.id === _inventoryIndexCardEdited.id );
                _inventoryIndexCardList[index] = _inventoryIndexCardEdited;
                setInventoryIndexCardList(_inventoryIndexCardList);

            } else { // No need to insert in UI to update it, because the data table in UI will be reloaded after the insert.
                /*
                _inventoryIndexCardEdited.dateCreated = Date.now(); // created timestamp
                _inventoryIndexCardEdited.dateUpdated = 0; // updated timestamp
                _inventoryIndexCardEdited.dateDeleted = 0; // updated timestamp

                if ( _inventoryIndexCardEdited.transactions.length > 0 ) {
                    _inventoryIndexCardEdited.transactions.forEach ( (trans) => {
                        //console.log ('prod', prod)
                        trans.dateCreated = Date.now(); //timestamp updated
                        trans.dateUpdated = 0; //timestamp updated
                        trans.dateDeleted = 0; //timestamp updated
                    });
                }

                _inventoryIndexCardList.push (_inventoryIndexCardEdited);
                setInventoryIndexCardList (_inventoryIndexCardList);
                */
            }

            // Insert
            if ( isNotEmpty(_inventoryIndexCardInsert) ) { // If new inventory index card added

                _inventoryIndexCardInsert.id = await putInventoryIndexCard (_inventoryIndexCardInsert); //before insert on tblInventoryTransactions table, create a new invenotry in tblInventory table and return ID created

                if ( _inventoryIndexCardInsert.transactions.length > 0 ) { // true when new inventory index card has initial products by default
                    console.log ('_inventoryIndexCardInsert: ', _inventoryIndexCardInsert );

                    await putInventoryIndexCardTransactions (_inventoryIndexCardInsert); // Adds intial transactions if any inside inventory object.
                };
            };

            // Update / Delete
            if ( isNotEmpty(_inventoryIndexCardUpdate) ) { 

                _inventoryIndexCardUpdate.id = _inventoryIndexCardEdited.id; // updated timestamp

                await updateInventoryIndexCard (_inventoryIndexCardUpdate, 'update'); // updates PriceList table

                if (_inventoryIndexCardUpdate.dateUpdated) { // checks if its an update operation
                    await updateInventoryIndexCard (_inventoryIndexCardUpdate, 'update'); //updates table tblPriceList with the price list object info
                } else if (_inventoryIndexCardUpdate.dateDeleted) { // checks if its a soft delete operation
                    await updateInventoryIndexCard (_inventoryIndexCardUpdate, 'delete'); //updates table tblPriceList with the price list object info
                }
            };
        };

        fetchInventoryIndexCardListData();
        setInventoryIndexCardEdited (_inventoryIndexCardEdited);
        setNewInventoryIndexCardSettingsDialog (false);
        setEditInventoryIndexCardSettingsDialog (false);
    };

    const saveInventoryIndexCardTransactions = async (event, _inventoryIndexCard) => { //because it is a button (event driven object) if no parameter is passed during function call event info is captured
        console.log ('# saveInventoryIndexCardTransactions #');

        let _inventoryIndexCardList = [...inventoryIndexCardList];
        let _inventoryIndexCardEdited = { ...inventoryIndexCardEdited };
        let _inventoryIndexCardInsert = {...inventoryIndexCardInsert};
        let _inventoryIndexCardUpdate = null;
        (_inventoryIndexCard) ? _inventoryIndexCardUpdate = { ..._inventoryIndexCard } : _inventoryIndexCardUpdate = { ...inventoryIndexCardUpdate } ; ;

        //console.log ('_inventoryIndexCardList: ', _inventoryIndexCardList )
        //console.log ('_inventoryIndexCardEdited: ', _inventoryIndexCardEdited );

        // Updates UI
        //const index = findInventoryIndexCardListIndexById(_inventoryIndexCardEdited.id);                
        const index = _inventoryIndexCardList.findIndex ( _inventoryIndexCard => _inventoryIndexCard.id === _inventoryIndexCardEdited.id );
        _inventoryIndexCardList[index] = _inventoryIndexCardEdited;
        setInventoryIndexCardList(_inventoryIndexCardList);

        // Insert
        if ( isNotEmpty(_inventoryIndexCardInsert) ) { // In this case insert is allways to update an indexcard with the insertion of a new transaction
            if ( _inventoryIndexCardInsert.transactions.length > 0 ) {

                console.log ('_inventoryIndexCardInsert: ', _inventoryIndexCardInsert );

                await updateInventoryIndexCard (_inventoryIndexCardInsert); //updates inventoryIndexCard table
                await putInventoryIndexCardTransactions (_inventoryIndexCardInsert); // DTO requires that the list object only contains added porducts on productList prop
                //updateInventoryStockStatus(_inventoryIndexCardEdited, _inventoryIndexCardInsert)
            };
        };

        // Update & Remove
        if ( isNotEmpty(_inventoryIndexCardUpdate) ) {

            console.log ('_inventoryIndexCardUpdate: ', _inventoryIndexCardUpdate );

            if (_inventoryIndexCardUpdate.dateUpdated) { // checks first element for operation type
                await updateInventoryIndexCard (_inventoryIndexCardUpdate, 'update'); //updates PriceList table
            } else if (_inventoryIndexCardUpdate.dateDeleted) {
                await updateInventoryIndexCard (_inventoryIndexCardUpdate, 'delete'); //updates PriceList table
            }

            if (_inventoryIndexCardUpdate.transactions.length > 0 ) {

                if (_inventoryIndexCardUpdate.transactions[0].dateCreated) { // checks first element for operation type
                    await putInventoryIndexCardTransactions (_inventoryIndexCardUpdate); // DTO requires that the list object only contains added porducts on productList prop
                } else if (_inventoryIndexCardUpdate.transactions[0].dateUpdated) { // checks first element for operation type
                    await updateInventoryIndexCardTransactions (_inventoryIndexCardUpdate, 'update'); // DTO requires that the list object only contains removed porducts on productList prop
                } else if (_inventoryIndexCardUpdate.transactions[0].dateDeleted) {
                    await updateInventoryIndexCardTransactions (_inventoryIndexCardUpdate, 'delete'); // DTO requires that the list object only contains removed porducts on productList prop
                }

                //updateInventoryStockStatus(_inventoryIndexCardEdited, _inventoryIndexCardUpdate)
            };
        };


        fetchInventoryIndexCardListData();

        setTransactionsSource ([]); // Reset transactionsSource variable
        setTransactionsTarget ([]); // Reset transactionsTarget variable
        setInventoryIndexCardInsert ({});
        setInventoryIndexCardUpdate ({});
        //setAddTransactionClicked(false);
        //setRemoveTransactionClicked(false);
        //setEditInventoryIndexCardSettingsDialog (false);
        setInsertInventoryIndexCardTransactiDialog (false)
        setEditInventoryIndexCardTransactionsDialog (false)  
    };

    // Following function Not in use. Business rule applied: IndexCards are created automatically on Product creation,
    // no modification or deletion of transactions possible
    const saveNewInventoryIndexCardSettings = async () => {
        console.log ('# saveNewInventoryIndexCardSettings #');

        //let _inventoryIndexCardList = [...inventoryIndexCardList];
        let _newInventoryIndexCardEdited = { ...inventoryIndexCardEdited};
        let _inventoryIndexCardInsert = {...inventoryIndexCardInsert};
        let _transactionsSource = [...transactionsSource];
        let _transactionsTarget = [...transactionsTarget];

        console.log ('_newInventoryIndexCardEdited', _newInventoryIndexCardEdited)

        //setSubmitted(true);

        if ( inputTransactionUnitQuantity != null && inputType != null ) {

            _newInventoryIndexCardEdited.dateCreated = Date.now(); // created timestamp
            _newInventoryIndexCardEdited.dateUpdated = 0; // updated timestamp
            _newInventoryIndexCardEdited.dateDeleted = 0; // updated timestamp

            _inventoryIndexCardInsert = JSON.parse( JSON.stringify (_newInventoryIndexCardEdited) ); //Deep copy. Only on new price list insert all props are copied.
            
            _transactionsTarget = JSON.parse( JSON.stringify (_transactionsSource) ); // Use assigment to add price list products because no selection made (should use addPriceListProducts or pick list if selection required). All existing products added.
         
            _newInventoryIndexCardEdited.transactions = JSON.parse( JSON.stringify (_transactionsTarget) ); //Assigns selected products to the list

            //console.log ('_newInventoryIndexCardEdited: ', _newInventoryIndexCardEdited);

            if (_newInventoryIndexCardEdited.transactions.length > 0){
                //saveNewInventoryIndexCardTransactions(_newInventoryIndexCardEdited);
            } else {
                //await inventoryIndexCardService.putInventoryIndexCard (_inventoryIndexCardInsert); //before insert on tblProductPriceList table, create a new price list in tblPriceList table and return ID created
                await putInventoryIndexCard (_inventoryIndexCardInsert); //before insert on tblProductPriceList table, create a new price list in tblPriceList table and return ID created
                toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Nuevo Inventario Creado', life: 3000 });
                fetchInventoryIndexCardListData();
                setInventoryIndexCardEdited (_newInventoryIndexCardEdited);
                setNewInventoryIndexCardSettingsDialog (false);
            }

            //console.log ('_newInventoryIndexCardEdited: ', _newInventoryIndexCardEdited);
        };
    };

    const saveEditInventoryIndexCardSettings = async () => {
        console.log ('# saveEditInventoryIndexCardSettings #');
 
        let _inventoryIndexCardList = [...inventoryIndexCardList];
        let _inventoryIndexCardEdited = {...inventoryIndexCardEdited};
        let _inventoryIndexCardUpdate = {...inventoryIndexCardUpdate};

        //const index = findInventoryIndexCardListIndexById(_inventoryIndexCardEdited.id);
        const index = _inventoryIndexCardList.findIndex ( _inventoryIndexCard => _inventoryIndexCard.id === _inventoryIndexCardEdited.id );
        _inventoryIndexCardList[index] = _inventoryIndexCardEdited;
        setInventoryIndexCardList(_inventoryIndexCardList);

        _inventoryIndexCardUpdate.id = _inventoryIndexCardEdited.id; // updated timestamp
        _inventoryIndexCardUpdate.dateUpdated = Date.now(); // updated timestamp

        //await inventoryIndexCardService.updateInventoryIndexCard(_inventoryIndexCardUpdate); //updates existing
        //toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Inventario Actualizado', life: 3000 });
        await updateInventoryIndexCard (_inventoryIndexCardUpdate); //updates existing

        fetchInventoryIndexCardListData();

        setInventoryIndexCardUpdate (JSON.parse( JSON.stringify ( {...emptyInventoryIndexCardUpdate} ) ) );
        setEditInventoryIndexCardSettingsDialog (false);
    };

    // No enabled. Business rule applied: transactions cannot be deleted or modified.
    const deleteInventoryIndexCard = async () => { // Is called when trash can icon is clicked. Not in use (action must be added to actionBodyTemplate)
        console.log ('# deleteInventoryIndexCard #');

        let _inventoryIndexCardList = [...inventoryIndexCardList];
        let _inventoryIndexCardEdited = {...inventoryIndexCardEdited};
        let _inventoryIndexCardUpdate = {...inventoryIndexCardUpdate};

        //console.log('_inventoryIndexCardEdited: ', _inventoryIndexCardEdited);

        _inventoryIndexCardList = _inventoryIndexCardList.filter ( so => so.id !== _inventoryIndexCardEdited.id );
        setInventoryIndexCardList(_inventoryIndexCardList);

        _inventoryIndexCardUpdate.id = _inventoryIndexCardEdited.id; //timestamp updated
        _inventoryIndexCardUpdate.dateDeleted = Date.now(); //logical delete

        if (_inventoryIndexCardEdited.transactions.length > 0){

            _inventoryIndexCardUpdate.transactions = _inventoryIndexCardEdited.transactions

            _inventoryIndexCardUpdate.transactions.forEach( (trans) => {
                trans.dateDeleted = Date.now(); //logical delete
            });

            await updateInventoryIndexCardTransactions (_inventoryIndexCardUpdate, 'delete') //update persistent data source.
    
        };

        await updateInventoryIndexCard (_inventoryIndexCardUpdate, 'delete')  //update persistent data source.

        //setDeleteInventoryIndexCardDialog(false);
    };

    // No enabled. Business rule applied: transactions cannot be deleted or modified.
    const deleteInventoryIndexCardTransaction = async () => {

        let _inventoryIndexCardEdited = {...inventoryIndexCardEdited};
        let _inventoryIndexCardTransactionEdited = {...inventoryIndexCardTransactionEdited};
        let _inventoryIndexCardTransactionList = [...inventoryIndexCardTransactionEdited.transactions];

        _inventoryIndexCardEdited.dateUpdated = Date.now(); //timestamp updated

        let index = findInventoryIndexCardTransactionIndexById (_inventoryIndexCardTransactionEdited.id, _inventoryIndexCardEdited)
        _inventoryIndexCardEdited.transactions[index] = _inventoryIndexCardEdited;
        _inventoryIndexCardTransactionEdited.dateDeleted = Date.now(); //logical delete

        _inventoryIndexCardTransactionEdited = _inventoryIndexCardTransactionEdited.filter(val => val.id !== _inventoryIndexCardTransactionEdited.id);

        //setInventoryIndexCardTransactionList(_inventoryIndexCardTransaction);

        await updateInventoryIndexCardTransactions (_inventoryIndexCardEdited) //update persistent data source.
        //toast.current.show({ severity: 'success', summary: 'Perfecto !', detail: 'Lista de Precio Borrada', life: 3000 });

        //setDeleteInvenotryTransactionDialog(false);
    }

    ////////////////////////
    // Supporting Functions
    ////////////////////////

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    // test empty objects
    function isNotEmpty(object) { 
        for(var i in object) { 
            return true; 
        } return false; 
    } 

    const findInventoryIndexCardListIndexById = (id) => {

        let _inventoryIndexCardList = [...inventoryIndexCardList];

        let index = -1;
        for (let i = 0; i < _inventoryIndexCardList.length; i++) {
            if (_inventoryIndexCardList[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    const findInventoryIndexCardTransactionIndexById = (_productId, _inventoryIndexCardEdited) => {
        console.log('# findInventoryIndexCardTransactionIndexById #');

        console.log('_inventoryIndexCardEdited', _inventoryIndexCardEdited);

        let index = -1;
        for (let i = 0; i < _inventoryIndexCardEdited.transactions.length; i++) {
            if (_inventoryIndexCardEdited.transactions[i].id === _productId ) {
                index = i;
                break;
            }
        }
        //console.log('index', index);
        return index;
    }


    ////////////////////////
    // React Functions
    ////////////////////////

    const actionBodyTemplate = (rowData) => {

        const items = [
            {
                label: 'Ver',
                icon: 'pi pi-eye',
                command: () => {
                    openViewInventoryIndexCardTransactionsDialog(rowData);
                }
            },
            {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: () => {
                    openEditInventoryIndexCardTransactionsDialog(rowData);
                }
            },
            {
                label: 'Configurar',
                icon: 'pi pi-cog',
                command: () => {
                    openEditInventoryIndexCardSettingsDialog(rowData);
                }
            },
            {
                label: 'Borrar',
                icon: 'pi pi-trash',
                command: () => {
                }
            }
        ];
        
        return (
            <React.Fragment>
                <Button icon='pi pi-eye' className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-2" tooltip= 'Ver' onClick={ () => openViewInventoryIndexCardTransactionsDialog(rowData) } />
                <Button icon='pi pi-pencil' className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-2" tooltip= 'Editar' onClick={ () => openEditInventoryIndexCardTransactionsDialog(rowData) } />
                {/* <Button icon='pi pi-cog' className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-2" tooltip= 'Configurar' onClick={ () => openEditInventoryIndexCardSettingsDialog(rowData) } /> */}
            </React.Fragment>
        );
    }

    const editInventoryIndexCardDialogLeftToolbar = () => {
        return (
            <React.Fragment>
                {/*<Button type="button" icon="pi pi-file-o" onClick={exportCSV(false)} className="p-mr-2" data-pr-tooltip="CSV" /> */}
                <Button type="button" icon="pi pi-file-o" onClick={exportCSV} className="p-mr-2" data-pr-tooltip="CSV" /> 
                {/* <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning p-mr-2" data-pr-tooltip="PDF" /> */}
                {/* <Button label="Cobro" icon="pi pi-plus" className="p-button-secondary p-button-raised p-mr-2" onClick={addPaymentTransaction} tooltip = 'Ingresar Cobro' /> */}
            </React.Fragment>
        )
    }

    const editInventoryIndexCardDialogRightToolbar = () => {
        return (
            
            <React.Fragment>
                <span className="p-buttonset">
                <Button label="" icon="pi pi-plus" className="p-button-secondary p-button-raised p-mr-2" onClick={ () => { openInsertInventoryIndexCardTransactionDialog (1) } } />
                <Button label="" icon="pi pi-minus" className="p-button-secondary p-button-raised p-mr-2" onClick={ () => { openInsertInventoryIndexCardTransactionDialog (-1) } } />
                </span>
           </React.Fragment>

        )
    }

    const formatCurrency = (value) => {
        //console.log('formatCurrency', value);
        return value.toLocaleString('de-DE', { style: 'currency', currency: 'ARS'}); //cambiar símbolo 'USD' por variable y Locale 'en-US' por variable
    }

    const formatDate = (date) => {
        //console.log ('date : ', date);
        let month = new Date (date).getMonth() + 1;
        let day = new Date (date).getDate();
        let fullYear = new Date (date).getFullYear();

        //console.log ('fullYear, month, day : ', fullYear, month, day);

        if (month < 10) {
            month = '0' + month;
        }

        if (day < 10) {
            day = '0' + day;
        }

        return fullYear + '-' + month + '-' + day;
    }

    const indexCardCreationDateBodyTemplate = (rowData) => {
        //console.log ('rowData', rowData)
        let val = rowData.indexCardCreationDate;
        return (
            <React.Fragment>
                {/* <span className="p-column-title">Date</span> */}
                <span>{formatDate (val) }</span>
            </React.Fragment>
        );
    }

    const lastTransactionDateBodyTemplate = (rowData) => {
        //console.log ('rowData', rowData)
        let val = rowData.lastTransactionDate;
        return (
            <React.Fragment>
                {/* <span className="p-column-title">Date</span> */}
                <span>{formatDate (val) }</span>
            </React.Fragment>
        );
    }

    const dateCreatedBodyTemplate = (rowData) => {
        //console.log ('rowData', rowData)
        let val = rowData.dateCreated;
        return (
            <React.Fragment>
                {/* <span className="p-column-title">Date</span> */}
                <span>{formatDate (val) }</span>
            </React.Fragment>
        );
    }

    const balanceBodyTemplate = (rowData) => {
        //console.log('amountBodyTemplate rowData',rowData)
        return (
            <React.Fragment>
                {/* <span className="price-text">{`ARS `}</span>  */}
                <span className="price-text">{formatCurrency(rowData.balance)}</span>
            </React.Fragment>
        );
    }

    const amountBodyTemplate = (rowData) => {
        //console.log('amountBodyTemplate rowData',rowData)
        return (
            <React.Fragment>
                <span className="price-text">{`ARS`}</span> 
                <span className="price-text">{formatCurrency(rowData.amount)}</span>
            </React.Fragment>
        );
    }

    const quantityBalanceBodyTemplate = (rowData) => {
        console.log('# quantityBalanceBodyTemplate #');
        console.log('rowData',rowData);
        return (
            <React.Fragment>
                <span className="quantityBalance-text">{rowData.Transactions.quantity}</span>
            </React.Fragment>
        );
    }

    const typeBodyTemplate = (rowData) => {
        //console.log ('typeBodyTemplate rowData: ', rowData)

        if (rowData.type === -1) {
            return (
                <React.Fragment>
                    <span className="type-text">{`Egreso`}</span> 
                </React.Fragment>
            );
        }

        if (rowData.type === 1) {
            return (
                <React.Fragment>
                    <span className="type-text">{`Ingreso`}</span> 
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <span className="type-text">{`Inicial`}</span> 
            </React.Fragment>
        );
    }

    const selectedCurrencyTemplate = (option, props) => {
        //console.log ('selectedRegionTemplate option: ', option)
        if (option) {
            return (
                <div className="region-item region-item-value">
                    <div>{option.code}</div>
                </div>
            );
        }
        return (
            <span>
                {props.placeholder}
            </span>
        );
    }

    const currencyOptionTemplate = (option) => {
        //console.log ('currencyOptionTemplate option: ', option)
        return (
            <div className="currency-item">
                <div>{option.code}</div>
            </div>
        );
    };

    const searchBodyTemplate = () => {
        return <Button icon="pi pi-search" />;
    }

    const statusBodyTemplate = (rowData) => {
        return <span className={`product-badge status-${rowData.status.name.toLowerCase()}`}>{rowData.status.name}</span>;
    }

    /////////////////////////////
    // Header Functions
    /////////////////////////////

    const renderHeader = (_inventoryIndexCard) => {

        let _partNumber, _productModel = '';

        _partNumber = (_inventoryIndexCard) ? _partNumber = _inventoryIndexCard.indexCardPartNumber : 'Part Number';
        _productModel = (_inventoryIndexCard.product) ? _productModel = _inventoryIndexCard.product.model : 'Product Model';
        return (
            <div className="inventory-code">
                <div> Inventario [ {_partNumber} - {_productModel} ]</div>
            </div>           
        );
    }   

    const headerInventoryIndexCardList = (
        <div className="table-header">
            <h5 className="p-m-0"> Inventario </h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(event) => setGlobalFilter(event.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const headerEditInventoryIndexCard = (
        <div className="table-header">
            <h5 className="p-m-0"> Movimientos </h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(event) => setGlobalFilter(event.target.value)} placeholder="Buscar..." className="p-m-0" />
            </span>
        </div>
    );

    const headerViewInventoryIndexCard = (
        <div className="table-header">
            <h5 className="p-m-0"> Movimientos </h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(event) => setGlobalFilter(event.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    /////////////////////////////
    // Footer Functions
    /////////////////////////////

    const editInventoryIndexCardSettingsDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={saveInventoryIndexCardSettings} disabled={ (inputMaximumStock < 0) || (inputMinimumStock < 0) }/>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideEditInventoryIndexCardSettingsDialog} />
        </React.Fragment>
    );

    const viewInventoryIndexCardTransactionsDialogFooter = (
        <React.Fragment>
          <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideViewInventoryIndexCardTransactionsDialog} />
        </React.Fragment>
    );

    const InsertInventoryIndexCardTransactiDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={addNewInventoryIndexCardTransaction} disabled={ (inputTransactionUnitQuantity === 0) || !inputTransactionDescription } />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideInsertInventoryIndexCardTransactiDialog} />
        </React.Fragment>
    );

    const editInventoryIndexCardTransactionsDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={saveInventoryIndexCardTransactions} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideEditInventoryIndexCardTransactionsDialog} /> 
        </React.Fragment>
    );




    ////////////////////////
    // Renderer
    ////////////////////////

    return (
        <div className="datatable-crud">
            <Toast ref={toast} />

            <div className="card">
                {/* <Toolbar className="p-mb-4" left={inventoryIndexCardListLeftToolbar} right={inventoryIndexCardListRightToolbar}></Toolbar> */}

                <DataTable ref={dt} className="p-datatable-striped" value={inventoryIndexCardList} dataKey="id"
                    //selection={selectedInventoryIndexCard} onSelectionChange={ (event) => setSelectedInventoryIndexCard(event.value) }
                    //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    //currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                    scrollable scrollHeight="650px"
                    globalFilter={globalFilter}
                    sortMode="multiple" removableSort multiSortMeta={multiSortMeta} onSort={ (event) => setMultiSortMeta(event.multiSortMeta)}
                    header={headerInventoryIndexCardList}>

                    {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}> </Column>  */}
                    <Column field="id" header="IndexCardId" sortable />
                    <Column field="product.id" header="Prod Id" sortable />
                    {/* <Column field="indexCardName" header="Nombre" sortable /> */}
                    <Column field="indexCardPartNumber" header="Código de parte" sortable />
                    <Column field="indexCreationDate" header="Primer Ingreso" body={ indexCardCreationDateBodyTemplate } sortable />
                    <Column field="lastTransactionDate" header="Último movimiento" body= { lastTransactionDateBodyTemplate } sortable/>
                    <Column field="calculatedQuantityBalance" header="Cantitad Total" sortable /> 
                    {/* <Column field="currency" header="Status" body={currencyBodyTemplate3} sortable /> */}
                    <Column field="status.name" header="Estado" body={statusBodyTemplate} sortable/>
                    <Column body={actionBodyTemplate} headerStyle={{ width: '8em', textAlign: 'left' }} bodyStyle={{ textAlign: 'left', overflow: 'visible' }} />                  
                </DataTable>
            </div>

            <Dialog visible={viewInventoryIndexCardTransactionsDialog}  header= {renderHeader(inventoryIndexCardEdited)} style={{ width: '1000px' }} autoLayout={true} modal closable={false} footer={viewInventoryIndexCardTransactionsDialogFooter} onHide={ () => {} }>

                <div className="View Transactions">

                    <br/>
                    <div className="inventorySettingsData">
                        <div className="inventoryDataTop">
                            <span className="p-inputgroup-addon"> Stock Mínimo </span>
                            <InputNumber id="MinimumStock" value={inputMinimumStock} onFocus={onFocusInput} onChange= { (event) => onChangeInputMinimumStock (event) } integeronly maxFractionDigits={0} min={0} placeholder='0' disabled={false} />
                        </div>
                        <div className="inventoryDataTop">
                            <span className="p-inputgroup-addon"> Stock Máximo </span>
                            <InputNumber id="MaximumStock" value={inputMaximumStock} onFocus={onFocusInput} onChange= { (event) => onChangeInputMaximumStock (event) } integeronly maxFractionDigits={0} min={0} placeholder='0' disabled={false} />
                        </div>
                    </div>

                    <br/>
                    <DataTable ref={dt} className="p-datatable-striped" value={inventoryIndexCardEdited.transactions} dataKey='id' 
                        //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        scrollable //scrollHeight="250px"
                        globalFilter={globalFilter}
                        header={headerViewInventoryIndexCard}>

                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="id" header="Id" />
                        <Column field="dateCreated" header="Fecha" body={ dateCreatedBodyTemplate } sortable />
                        <Column field="inventoryIndexCardId" header="Código de Inventario" />
                        <Column field="type" header="Tipo" body={typeBodyTemplate} />
                        <Column field="description" header="Descripción" /> 
                        <Column field="unitQuantity" header="Cantidad" />
                        {/* <Column body={editPriceListProductBodyTemplate} headerStyle={{ width: '8em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} /> */}
                    </DataTable>                  
                </div>
            </Dialog>

            <Dialog className="p-fluid" visible={editInventoryIndexCardSettingsDialog}  header= {renderHeader(inventoryIndexCardEdited)} modal closable={false} footer={editInventoryIndexCardSettingsDialogFooter} onHide={ () => {} }>
               
                    <div className="p-field">
                        <span className="p-inputgroup-addon"> Stock Mínimo </span>
                        <InputNumber id="MinimumStock" value={inputMinimumStock} onFocus={onFocusInput} onChange= { (event) => onChangeInputMinimumStock (event) } integeronly maxFractionDigits={0} min={0} placeholder='0' disabled={false} />
                    </div>

                    <br/>
                    <div className="p-field">
                        <span className="p-inputgroup-addon"> Stock Máximo </span>
                        <InputNumber id="MaximumStock" value={inputMaximumStock} onFocus={onFocusInput} onChange= { (event) => onChangeInputMaximumStock (event) } integeronly maxFractionDigits={0} min={0} placeholder='0' disabled={false} />
                    </div>


            </Dialog>

            <Dialog visible={editInventoryIndexCardTransactionsDialog} header= {renderHeader(inventoryIndexCardEdited)} style={{ width: '1000px' }} autoLayout={true} modal closable={false} footer={editInventoryIndexCardTransactionsDialogFooter} onHide={ () => {} }>

                <div className="card">
                    <Toolbar className="p-mb-auto" left={editInventoryIndexCardDialogLeftToolbar} right={editInventoryIndexCardDialogRightToolbar}></Toolbar>

                    <br/>
                    <div className="inventorySettingsData">
                        <div className="inventoryDataTop">
                            <span className="p-inputgroup-addon"> Stock Mínimo </span>
                            <InputNumber id="MinimumStock" value={inputMinimumStock} onFocus={onFocusInput} onChange= { (event) => onChangeInputMinimumStock (event) } integeronly maxFractionDigits={0} min={0} placeholder='0' disabled={false} />
                        </div>
                        <div className="inventoryDataTop">
                            <span className="p-inputgroup-addon"> Stock Máximo </span>
                            <InputNumber id="MaximumStock" value={inputMaximumStock} onFocus={onFocusInput} onChange= { (event) => onChangeInputMaximumStock (event) } integeronly maxFractionDigits={0} min={0} placeholder='0' disabled={false} />
                        </div>
                    </div>

                    <br/>
                    <DataTable ref={dt} className="p-datatable-striped-md" value={inventoryIndexCardEdited.transactions} dataKey="id"
                        selection={selectedInventoryIndexCardTransactions} onSelectionChange={ (event) => setSelectedInventoryIndexCardTransactions(event.value) } 
                        //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        //currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                        scrollable //scrollHeight="250px"
                        globalFilter={globalFilter}
                        header={headerEditInventoryIndexCard}>

                        {/*<Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column> */}
                        <Column field="id" header="Id" />
                        <Column field="dateCreated" header="Fecha" body={ dateCreatedBodyTemplate } sortable />
                        <Column field="inventoryIndexCardId" header="Código de Inventario" />
                        <Column field="type" header="Movimiento" body={typeBodyTemplate} />
                        <Column field="description" header="Descripción" />
                        <Column field="unitQuantity" header="Cantidad" />
                        {/* <Column field="quantity" header="Cantidad" body={quantityBodyTemplate} editor={ quantityEditor } autoFocus > </Column> */}
                    </DataTable>                  
                </div>
            </Dialog>
            
            <Dialog className="p-fluid" visible={InsertInventoryIndexCardTransactiDialog} header="Movimiento" modal closable={false} footer={InsertInventoryIndexCardTransactiDialogFooter} onHide={ () => {} }>

                    <div className="p-field">
                        <span className="p-inputgroup-addon"> Cantidad </span>
                        <InputNumber id="quantityInputNumber" value={inputTransactionUnitQuantity}  onFocus={onFocusInput} onChange={ (event) => onChangeInputTransactionUnitQuantity (event) } integeronly maxFractionDigits={0} min={0} placeholder='0' disabled={false} required autofocus className={classNames({ 'p-invalid': !inputTransactionUnitQuantity })} />
                        { !inputTransactionUnitQuantity  && <small className="p-invalid"> Requerido !</small>}
                        {/* { invalidInputAmount && <small className="p-invalid"> No es un monto válido !</small>} */}
                    </div>

                    <br/>
                    <div className="p-field">
                        <span className="p-inputgroup-addon"> Descripción </span>
                        <InputText id="descriptionInputText" value={inputTransactionDescription} onFocus={onFocusInput} onChange={ (event) => onChangeInputDescription (event) } placeholder='Detalle el movimiento' required className={classNames({ 'p-invalid': !inputTransactionDescription })} />
                        { !inputTransactionDescription && <small className="p-invalid"> Requerido !</small>}
                    </div>
            </Dialog>
            
        </div>
    );
}