import React, { useState, useEffect, useRef } from 'react';
import { CheckAccTransactionService, CheckingAccountService } from "../service/CheckingAccountService";
import { PaymentMethodService } from "../service/PaymentMethodService";
import { CurrencyService } from "../service/CurrencyService";
//import { ExchangeRateService } from "../service/ExchangeRateService";
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
import classNames from 'classnames';
import '../layout/CrudCheckingAccount.scss';

export function CrudCheckingAccount() {
    

    ////////////////////////////////////
    // Empty Objects for initialization
    ////////////////////////////////////

    const emptyCheckingAccount = {
        id: null,
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
        id: null,
        amount: 0.00,
        description: '',
        type: 0, // -1 payment, 0 acc initialization, 1 sale
        transactionDate: 0,
        //checkingAccount: {id: null, name: ''},
        checkingAccountId: null,
        paymentMethod: {id:null, type:''},
        dateCreated: 0,
        dateUpdated: 0,
        dateDeleted: 0,
    };

    const emptyCurrency = {
        id: 7,
        code: 'ARS',
    }

    const emptyPaymentMethod = {
        id: null,
        type: '',
    }

    const emptyCheckingAccountInsert = {
        id: null,
        transactions: []
    }

    const emptyCheckingAccountUpdate = {
        id: null,
        transactions: []
    }


    ///////////////
    // React Hooks
    ///////////////

    // Checking Account Variables
    const [checkingAccountList, setCheckingAccountList] = useState([]);    
    const [checkingAccountListUndo, setCheckingAccountListUndo] = useState([]);
    const [checkingAccountEdited, setCheckingAccountEdited] = useState(emptyCheckingAccount);
    const [checkingAccountEditedUndo, setCheckingAccountEditedUndo] = useState(null);
    const [checkAccTransactionEdited, setCheckAccTransactionEdited] = useState(null);
    const [checkAccTransactionEditedUndo, setCheckAccTransactionEditedUndo] = useState(null);
    const [checkingAccountInsert, setCheckingAccountInsert] = useState (null);
    const [checkingAccountUpdate, setCheckingAccountUpdate] = useState(null);
    const [transactionsSource, setTransactionsSource] = useState([]);
    const [transactionsTarget, setTransactionsTarget] = useState([]);
    //const [checkingAccountExpandedRows, setCheckingAccountExpandedRows] = useState([]);
    //const [expandedRows, setExpandedRows] = useState ([]);
    //const [selectedCheckingAccounts, setSelectedCheckingAccounts] = useState([]);

    // Currency Variables
    const [currencyList, setCurrencyList] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);

    // PaymentMethod Variables
    const [paymentMethodList, setPaymentMethodList] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    // Input Variables
    const [inputName, setInputName] = useState('');
    const [invalidInputName, setInvalidInputName] = useState(false); 
    const [inputAmount, setInputAmount] = useState(null);
    const [inputType, setInputType] = useState(null);
    const [inputDescription, setInputDescription] = useState('');
    const [inputCurrency, setInputCurrency] = useState(null);

    // Dialog Variables
    const [newCheckingAccountSettingsDialog, setNewCheckingAccountSettingsDialog] = useState(false);
    const [editCheckingAccountSettingsDialog, setEditCheckingAccountSettingsDialog] = useState(false);
    const [editCheckAccTransactionsDialog, setEditCheckAccTransactionsDialog] = useState(false);
    const [viewCheckingAccountDialog, setViewCheckingAccountDialog] = useState(false);
    const [newCheckAccTransactionDialog, setNewCheckAccTransactionDialog] = useState(false);

    // Other Variables
    const [globalFilter, setGlobalFilter] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);

    // Services
    const checkingAccountService = new CheckingAccountService();
    const checkAccTransactionService = new CheckAccTransactionService();
    const currencyService = new CurrencyService();
    // const exchangeRateService = new ExchangeRateService();
    const paymentMethodService = new PaymentMethodService();



    useEffect( () => {

        fetchCheckingAccountListData();
        fetchPaymentMethodListData();
        //fetchCurrencyListData(); //only used if checking accout settings are editable
        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);


    ///////////////////////
    // DB Data Functions
    ///////////////////////

    async function fetchCheckingAccountListData() {
        console.log ( '# fetchCheckingAccountData #' );       
        await checkingAccountService.getCheckingAccountList().then( (checkingAccountListData) => {
            console.log ('checkingAccountListData', checkingAccountListData);
            checkingAccountListData = checkingAccountListData.filter ( chkacc => chkacc.dateCreated !== 0 );
            setCheckingAccountList (JSON.parse(JSON.stringify(checkingAccountListData)));
            setCheckingAccountListUndo (JSON.parse(JSON.stringify(checkingAccountListData)));
        });
    };

    async function fetchCheckAccTransactionData (_checkingAccount) {
        console.log ( '# fetchCheckAccTransactionData #' );

        await checkAccTransactionService.getCheckAccTransactionList(_checkingAccount.id).then( (checkAccTransactionListData) => {
            console.log ('checkAccTransactionListData', checkAccTransactionListData);

            //Calculate account balance
            _checkingAccount.balance = 0;
            checkAccTransactionListData.forEach( (element) => {
                //console.log ('element', element);
                _checkingAccount.balance += element.amount;
            });
            _checkingAccount.transactions = [...checkAccTransactionListData];
            //console.log ('_checkingAccount', _checkingAccount);
            setCheckingAccountEdited ( {..._checkingAccount} );
            setCheckingAccountEditedUndo ( JSON.parse (JSON.stringify ( {..._checkingAccount} ) ) );
        });
    };
    
    async function putCheckingAccount (_checkingAccount) {
        console.log ( '# putCheckingAccount #' );
        //console.log ('_checkingAccount: ', _checkingAccount, '\n');
        let returnedId = await checkingAccountService.putCheckingAccount (_checkingAccount);
        toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Cuenta Corriente creada', life: 3000 });
        return returnedId;
    }

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

    async function fetchPaymentMethodListData() {
        console.log ( '# fetchPaymentMethodListData #' );
        await paymentMethodService.getPaymentMethodList().then( (paymentMethodListData) => {
            console.log ('paymentMethodListData: ', paymentMethodListData, '\n');
            paymentMethodListData = paymentMethodListData.filter ( payMeth => payMeth.dateCreated !== 0 );
            setPaymentMethodList(JSON.parse(JSON.stringify(paymentMethodListData)));
            //setPaymentMethodListUndo(JSON.parse(JSON.stringify(paymentMethodListData)));
            //console.log ('paymentMethodList: ', paymentMethodList);
        });

    };

    async function fetchCurrencyListData() {
        console.log ( '# fetchCurrencyListData #' );
        await currencyService.getCurrencyList().then( (currencyListData) => {
            console.log ('currencyListData: ', currencyListData, '\n');
            setCurrencyList(JSON.parse(JSON.stringify(currencyListData)));
            //setCurrenciesUndo(JSON.parse(JSON.stringify(currencysData)));
            //console.log ('currencyList: ', currencyList);
        });

    };


    ////////////////////////////////////
    // Action Body Functions
    /////////////////////////////////

    const openViewCheckingAccountDialog = (rowData) => {
        console.log ('# openViewCheckingAccountDialog #');
        //console.log ('rowData: ', rowData);

        setCheckingAccountEdited ({ ...rowData });
        //fetchCheckAccTransactionData ({ ...rowData });

        console.log ('rowData', rowData);

        setViewCheckingAccountDialog(true);
    };

    const hideViewCheckingAccountDialog = () => {
        //setSubmitted(false);
        setViewCheckingAccountDialog(false);
    }

    const openInsertCheckingAccountDialog = () => {
        console.log ('# openNewCheckingAccountSettingsDialog #');
        setCheckingAccountEdited ({ ...emptyCheckingAccount });
        setInputName ( emptyCheckingAccount.name );
        setSelectedCurrency ( emptyCheckingAccount.currency );

        //setCheckingAccountInsert (JSON.parse(JSON.stringify({...emptyCheckingAccountSettingsInsert})));

        setNewCheckingAccountSettingsDialog(true);
    };

    const hideInsertCheckingAccountDialog = () => {
        console.log ('# hideNewCheckingAccountSettingsDialog #');

        setSubmitted(false);
        setNewCheckingAccountSettingsDialog(false);
    };

    const openEditCheckingAccountSettingsDialog = (rowData) => {
        console.log ('# openEditCheckingAccountSettingsDialog #');
        setCheckingAccountEdited ({ ...rowData });
        setInputName ( rowData.name );
        setSelectedCurrency ( rowData.currency );
        //setCheckingAccountSettingsUpdate (JSON.parse(JSON.stringify({...emptyCheckingAccountSettingsUpdate})));

        setEditCheckingAccountSettingsDialog(true);
    };

    const hideEditCheckingAccountSettingsDialog = () => {
        console.log ('# hideEditCheckingAccountSettingsDialog #');
        setCheckingAccountList(JSON.parse(JSON.stringify(checkingAccountListUndo)));
        console.log ('checkingAccountListUndo', checkingAccountListUndo);
        setSubmitted(false);
        setEditCheckingAccountSettingsDialog(false);
    };

    const openEditCheckAccTransactionsDialog = (rowData) => {
        console.log ('# openEditCheckAccTransactionsDialog #');
        //console.log ('rowData: ', rowData);

        setCheckingAccountEdited ( {...rowData} );
        //fetchCheckAccTransactionData ({ ...rowData });
        setCheckingAccountEditedUndo (JSON.parse(JSON.stringify( {...rowData} )));

        setCheckAccTransactionEdited ( {...emptyCheckAccTransaction} );
        setCheckAccTransactionEditedUndo (JSON.parse(JSON.stringify( {...emptyCheckAccTransaction} )));

        setCheckingAccountInsert ( {...emptyCheckingAccountInsert} );
        setCheckingAccountUpdate ( {...emptyCheckingAccountUpdate} );

        setInputAmount ( emptyCheckAccTransaction.amount );
        setSelectedPaymentMethod ( {...emptyCheckAccTransaction.paymentMethod} );
        setInputCurrency ( {...emptyCheckAccTransaction.currency} );
        setInputDescription ( emptyCheckAccTransaction.description );

        setEditCheckAccTransactionsDialog(true);
    };

    const hideEditCheckAccTransactionsDialog = () => {
        //console.log ('checkingAccountListUndo', checkingAccountListUndo);
        setCheckingAccountList(JSON.parse(JSON.stringify(checkingAccountListUndo)));
        //console.log ('checkingAccountEditedUndo', checkingAccountEditedUnso);
        setCheckingAccountEdited(JSON.parse(JSON.stringify(checkingAccountEditedUndo)));

        setTransactionsSource([]);
        setTransactionsTarget([]);
        //setSubmitted(false);
        setEditCheckAccTransactionsDialog(false);
    }

    const openNewCheckAccTransactionDialog = (type) => {
        console.log ('# openNewCheckAccTransactionDialog #');

        let _checkAccTransactionEdited = {...checkAccTransactionEdited};        
        let _checkingAccountTransactionList = [...checkingAccountEdited.transactions];

        console.log ('_checkAccTransactionEdited', _checkAccTransactionEdited);
        console.log ('_checkingAccountTransactionList', _checkingAccountTransactionList);
        
        //_checkAccTransactionEdited.checkingAccount.id = _checkingAccountEdited.id;
        _checkAccTransactionEdited.type = type;
        setTransactionsSource (_checkingAccountTransactionList);
        setCheckAccTransactionEdited (_checkAccTransactionEdited);
        //setCheckAccTransactionsInsert(_checkAccTransactionInsert);
        
        setNewCheckAccTransactionDialog(true);
    };

    const hideNewCheckAccTransactionDialog = () => {
        //console.log ('checkingAccountEdited', checkingAccountEdited);
        setCheckingAccountEdited(JSON.parse(JSON.stringify(checkingAccountEditedUndo)));
        //console.log ('checkAccTransactionEditedUndo', checkAccTransactionEditedUndo);
        setCheckAccTransactionEdited(JSON.parse(JSON.stringify(checkAccTransactionEditedUndo)));

        //setSubmitted(false);
        setNewCheckAccTransactionDialog(false);
    }

    //Not in use. Ttrash can icon and action have to be added to actionBodyTemplate in datatable
    const openDeleteCheckAccTransactionDialog = (rowData) => {

        //setCheckAccTransactionEdited ( { ...rowData} );
        //setDeleteCheckAccTransationDialog (true);
    }
    //Not in use. Ttrash can icon and action have to be added to actionBodyTemplate in datatable
    const hideDeleteCheckAccTransactionDialog = () => {
        //setDeleteCheckAccTransactionDialog(false);
    }



    //////////////////////////////////////
    // Action Body Complementary Functions
    //////////////////////////////////////

    const addTransaction = () => {
        console.log ('# addTransaction #');

        let _checkingAccountEdited = {...checkingAccountEdited}; // Shallow copy to reference array
        let _checkAccTransactionEdited = {...checkAccTransactionEdited};
        let _checkingAccountInsert = { transactions: [] };
        let _transactionsSource = [...transactionsSource];
        let _transactionsTarget = [...transactionsTarget];

        console.log ('_checkingAccountEdited', _checkingAccountEdited);
        console.log ('_checkAccTransactionEdited', _checkAccTransactionEdited);
        console.log ('_checkingAccountInsert', _checkingAccountInsert);
        console.log ('_transactionsSource', _transactionsSource);
        console.log ('_transactionsTarget', _transactionsTarget);

        //_checkAccTransactionEdited.checkingAccount.id = _checkingAccountEdited.id;
        _checkAccTransactionEdited.checkingAccountId = _checkingAccountEdited.id;
        _checkAccTransactionEdited.dateCreated = Date.now(); //timestamp updated
        _checkAccTransactionEdited.dateUpdated = 0; //timestamp updated
        _checkAccTransactionEdited.dateDeleted = 0; //timestamp updated

        console.log ('_checkAccTransactionEdited', _checkAccTransactionEdited);

        _transactionsTarget.push (JSON.parse(JSON.stringify(_checkAccTransactionEdited)));
        
        //_checkingAccountEdited.transactions.push (JSON.parse(JSON.stringify(_checkAccTransactionEdited)));       
        _checkingAccountEdited.transactions = _checkingAccountEdited.transactions.concat (_transactionsTarget.filter((item) => _checkingAccountEdited.transactions.indexOf(item) < 0))
        _checkingAccountInsert.transactions = _transactionsTarget;

        console.log ('checkingAccountEdited', _checkingAccountEdited);
        console.log ('_checkAccTransactionEdited', _checkAccTransactionEdited);
        console.log ('_transactionsTarget', _transactionsTarget);
        console.log ('_checkingAccountInsert', _checkingAccountInsert);

        //toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Movimiento ingresado', life: 3000 });

        setInputAmount ( emptyCheckAccTransaction.amount );
        setSelectedPaymentMethod ( {...emptyCheckAccTransaction.paymentMethod} );
        setInputCurrency ( {...emptyCheckAccTransaction.currency} );
        setInputDescription ( emptyCheckAccTransaction.description );
        
        setCheckingAccountEdited (_checkingAccountEdited);
        setTransactionsSource ([]);
        setTransactionsTarget (_transactionsTarget);
        setCheckAccTransactionEdited (emptyCheckAccTransaction);
        setCheckingAccountInsert (_checkingAccountInsert);

        setNewCheckAccTransactionDialog(false);
    };


    ////////////////////////////
    // Event Functions
    ///////////////////////////

    const onFocusInputAmount = (event) => {
        console.log('# onFocusInputAmount #');

        event.target.select();
    }

    const onChangeInputAmount = (event) => {
        console.log('# onChangeInputAmount #');

        const val = event.value || null;
        let _checkAccTransactionEdited = { ...checkAccTransactionEdited };
        let _checkingAccountInsert = {...checkingAccountInsert};
        let _checkingAccountUpdate = {...checkingAccountUpdate};
        let index = -1; 

        _checkAccTransactionEdited.amount = val * _checkAccTransactionEdited.type;

        if (_checkAccTransactionEdited.checkingAccountId) { // If its an existing transaction then must have checkingAccountId value !== null

            index = _checkingAccountUpdate.transactions.findIndex (_transaction => _transaction.id === _checkAccTransactionEdited.id ); // Gets rows array index.
            if (index >= 0) { // If it was found index number should not be null or below zero
                _checkingAccountUpdate.transactions[index].amount = _checkAccTransactionEdited.amount;
                _checkingAccountUpdate.transactions[index].dateUpdated = Date.now();
            } else { // If the first change during current edition, it will be added to the transactions array in _checkingAccountUpdate object
                _checkingAccountUpdate.id = _checkAccTransactionEdited.checkingAccountId;
                _checkingAccountUpdate.transactions.push ( { id: _checkAccTransactionEdited.id, amount: _checkAccTransactionEdited.amount, dateUpdated: Date.now() } );
            }
            setCheckingAccountUpdate(_checkingAccountUpdate); //to capture just modifications to checking account

        } else { // If its not an existing transaction in the checking account

            index = _checkingAccountInsert.transactions.findIndex (_transaction => _transaction.id === _checkAccTransactionEdited.id ); // Gets rows array index.
            if (index >= 0) {
                _checkingAccountInsert.transactions[index].amount = _checkAccTransactionEdited.amount;
            } else {
                _checkingAccountInsert.transactions.push( { amount: _checkAccTransactionEdited.amount } );
            }
            setCheckingAccountInsert (_checkingAccountInsert);

        }

        setInputAmount (val);
        setCheckAccTransactionEdited ( {..._checkAccTransactionEdited} );
    }
    
    const onChangeDescriptionTextInput = (event) => {
        console.log('# onChangeDescriptionTextInput #');

        const val = event.target.value || '';
        let _checkAccTransactionEdited = { ...checkAccTransactionEdited };
        let _checkingAccountInsert = {...checkingAccountInsert};
        let _checkingAccountUpdate = {...checkingAccountUpdate};
        let index = -1;

        _checkAccTransactionEdited.description = val;

        if (_checkAccTransactionEdited.checkingAccountId) { // If its an existing transaction then must have checkingAccountId value !== null

            index = _checkingAccountUpdate.transactions.findIndex (_transaction => _transaction.id === _checkAccTransactionEdited.id ); // Gets rows array index.
            if (index >= 0) { // If it was found index number should not be null or below zero
                _checkingAccountUpdate.transactions[index].description = _checkAccTransactionEdited.description;
                _checkingAccountUpdate.transactions[index].dateUpdated = Date.now();
            } else { // If the first change during current edition, it will be added to the transactions array in _checkingAccountUpdate object
                _checkingAccountUpdate.id = _checkAccTransactionEdited.checkingAccountId;
                _checkingAccountUpdate.transactions.push ( { id: _checkAccTransactionEdited.id, description: _checkAccTransactionEdited.description, dateUpdated: Date.now() } );
            }
            setCheckingAccountUpdate(_checkingAccountUpdate); //to capture just modifications to checking account

        } else { // If its not an existing transaction in the checking account

            index = _checkingAccountInsert.transactions.findIndex (_transaction => _transaction.id === _checkAccTransactionEdited.id ); // Gets rows array index.
            if (index >= 0) {
                _checkingAccountInsert.transactions[index].description = _checkAccTransactionEdited.description;
            } else {
                _checkingAccountInsert.transactions.push( { description: _checkAccTransactionEdited.description } );
            }
            setCheckingAccountInsert (_checkingAccountInsert);

        }

        setInputDescription (val);
        setCheckAccTransactionEdited ( {..._checkAccTransactionEdited} );
    }

    const onChangePaymentMethodDropDown = (event) => {
        console.log('# onChangePaymentMethodDropDown #');

        const val =  event.target.value;
        let _checkAccTransactionEdited = { ...checkAccTransactionEdited };
        let _checkingAccountInsert = {...checkingAccountInsert};
        let _checkingAccountUpdate = {...checkingAccountUpdate};
        let index = -1;

        _checkAccTransactionEdited.paymentMethod = { id: val.id || null, type: val.type || '' };

        if (_checkAccTransactionEdited.checkingAccountId) { // If its an existing transaction then must have checkingAccountId value !== null

            index = _checkingAccountUpdate.transactions.findIndex (_transaction => _transaction.id === _checkAccTransactionEdited.id ); // Gets rows array index.
            if (index >= 0) { // If it was found index number should not be null or below zero
                _checkingAccountUpdate.transactions[index].paymentMethod = _checkAccTransactionEdited.paymentMethod;
                _checkingAccountUpdate.transactions[index].dateUpdated = Date.now();
            } else { // If the first change during current edition, it will be added to the transactions array in _checkingAccountUpdate object
                _checkingAccountUpdate.id = _checkAccTransactionEdited.checkingAccountId;
                _checkingAccountUpdate.transactions.push ( { id: _checkAccTransactionEdited.id, paymentMethod: _checkAccTransactionEdited.paymentMethod, dateUpdated: Date.now() } );
            }
            setCheckingAccountUpdate(_checkingAccountUpdate); //to capture just modifications to checking account

        } else { // If its not an existing transaction in the checking account

            index = _checkingAccountInsert.transactions.findIndex (_transaction => _transaction.id === _checkAccTransactionEdited.id ); // Gets rows array index.
            if (index >= 0) {
                _checkingAccountInsert.transactions[index].paymentMethod = _checkAccTransactionEdited.paymentMethod;
            } else {
                _checkingAccountInsert.transactions.push( { paymentMethod: _checkAccTransactionEdited.paymentMethod } );
            }
            setCheckingAccountInsert (_checkingAccountInsert);

        }

        setSelectedPaymentMethod(val);
        setCheckAccTransactionEdited (_checkAccTransactionEdited);
    };
    
    const onChangeCurrencyDropDown = (event) => {
        console.log('# onChangeCurrencyDropDown #');

        const val =  event.target.value || null;
        let _checkAccTransactionEdited = { ...checkAccTransactionEdited };
        let _checkingAccountInsert = {...checkingAccountInsert};
        let _checkingAccountUpdate = {...checkingAccountUpdate};
        let index = -1;

        _checkAccTransactionEdited.currency = { id: val.id || null, code: val.code || ''};

        if (_checkAccTransactionEdited.checkingAccountId) { // If its an existing transaction then must have checkingAccountId value !== null

            index = _checkingAccountUpdate.transactions.findIndex (_transaction => _transaction.id === _checkAccTransactionEdited.id ); // Gets rows array index.
            if (index >= 0) { // If it was found index number should not be null or below zero
                _checkingAccountUpdate.transactions[index].currency = _checkAccTransactionEdited.currency;
                _checkingAccountUpdate.transactions[index].dateUpdated = Date.now();
            } else { // If the first change during current edition, it will be added to the transactions array in _checkingAccountUpdate object
                _checkingAccountUpdate.id = _checkAccTransactionEdited.checkingAccountId;
                _checkingAccountUpdate.transactions.push ( { id: _checkAccTransactionEdited.id, currency: _checkAccTransactionEdited.currency, dateUpdated: Date.now() } );
            }
            setCheckingAccountUpdate(_checkingAccountUpdate); //to capture just modifications to checking account

        } else { // If its not an existing transaction in the checking account

            index = _checkingAccountInsert.transactions.findIndex (_transaction => _transaction.id === _checkAccTransactionEdited.id ); // Gets rows array index.
            if (index >= 0) {
                _checkingAccountInsert.transactions[index].currency = _checkAccTransactionEdited.currency;
            } else {
                _checkingAccountInsert.transactions.push( { currency: _checkAccTransactionEdited.currency } );
            }
            setCheckingAccountInsert (_checkingAccountInsert);

        }


        setSelectedCurrency(val);
        setCheckAccTransactionEdited (_checkAccTransactionEdited);
    };

    const onRowExpand = (event) => {
        // toast.current.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    }

    const onRowCollapse = (event) => {
       // toast.current.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    }

    const expandAll = () => {
        let _expandedRows = {};
        let _checkingAccountEdited = {...checkingAccountEdited};
        _checkingAccountEdited.transactions.forEach ( (chkAccT) => _expandedRows[`${chkAccT.id}`] = true);

        //setExpandedRows(_expandedRows);
    }

    const collapseAll = () => {
        //setExpandedRows(null);
    }

    ////////////////////////////
    // Persist Data Functions
    ///////////////////////////

    const saveCheckingAccount = async () => { //Use this instead of saveNewInventoryIndexCardSettings
        console.log ('# saveCheckingAccount #');

        let _checkingAccountList = [...checkingAccountList];
        let _checkingAccountEdited = {...checkingAccountEdited};
        let _checkingAccountInsert = {...checkingAccountInsert};
        let _checkingAccountUpdate = {...checkingAccountUpdate};
        //let _transactionsSource = [...transactionsSource];
        //let _transactionsTarget = [...transactionsTarget];

        //setSubmitted(true); // used for input control in form, not in use

        console.log ('_checkingAccountEdited: ', _checkingAccountEdited);
        console.log ('_checkingAccountInsert', _checkingAccountInsert);
        console.log ('_checkingAccountUpdate', _checkingAccountUpdate);

        if ( inputAmount != null && inputType != null ) {

            if (_checkingAccountEdited.id) { // If inventory already exist then update it in the UI with new values
                const index = _checkingAccountList.findIndex (_checkingAccount => _checkingAccount.id === _checkingAccountEdited.id );             
                _checkingAccountList[index] = _checkingAccountEdited;
                setCheckingAccountList(_checkingAccountList);
            } else {  // No need to insert in UI to update it, because the data table in UI will be reloaded after the insert.
                /*
                _checkingAccountEdited.dateCreated = Date.now(); // created timestamp
                _checkingAccountEdited.dateUpdated = 0; // updated timestamp
                _checkingAccountEdited.dateDeleted = 0; // updated timestamp

                if ( _checkingAccountEdited.transactions.length > 0 ) {
                    _checkingAccountEdited.transactions.forEach ( (_trans) => {
                        //console.log ('_trans', _trans)
                        _trans.dateCreated = Date.now(); //timestamp updated
                        _trans.dateUpdated = 0; //timestamp updated
                        _trans.dateDeleted = 0; //timestamp updated
                    });
                }
                _checkingAccountList.push (_checkingAccountEdited);
                setCheckingAccountList(_checkingAccountList);
                */
            }

            // Insert
            if ( isNotEmpty(_checkingAccountInsert) ) {
                console.log ('_checkingAccountInsert: ', _checkingAccountInsert );

                _checkingAccountInsert.id = await putCheckingAccount (_checkingAccountInsert); //before insert on tblCheckAccTransactions table, create a new checking account in tblCheckingAccount table and return ID created
                if ( _checkingAccountInsert.transactions.length > 0 ) {
                    await putCheckAccTransaction (_checkingAccountInsert); // Adds all intitial transactions into the new checking account and insert into tblCheckAccTransactions 
                };
            };

            // Update / Delete
            if ( isNotEmpty(_checkingAccountUpdate) ) { 
                console.log ('_checkingAccountUpdate: ', _checkingAccountUpdate );

                _checkingAccountUpdate.id = _checkingAccountEdited.id;

                if (_checkingAccountUpdate.dateUpdated) { // checks if its an update operation
                    await updateCheckingAccount (_checkingAccountUpdate, 'update'); //updates table tblCheckingAccount with the checking account object info
                } else if (_checkingAccountUpdate.dateDeleted) { // checks if its a soft delete operation
                    await updateCheckingAccount (_checkingAccountUpdate, 'delete'); //updates table tblCheckingAccount (for logical delete) with the checking account object info
                }
            };
        };
            /*            
            // Insert
            if ( isNotEmpty(_checkingAccountInsert) ) { // If new inventory index card added

                _checkingAccountInsert.dateCreated = Date.now(); // created timestamp
                _checkingAccountInsert.dateUpdated = 0; // updated timestamp
                _checkingAccountInsert.dateDeleted = 0; // updated timestamp

                if ( _checkingAccountInsert.transactions.length > 0 ) { // true when new Checking Account index card has initial transactions by default
                    _checkingAccountInsert.transactions.forEach ( (_trans) => {
                        //console.log ('_trans', _trans)
                        _trans.dateCreated = Date.now(); //timestamp updated
                        _trans.dateUpdated = 0; //timestamp updated
                        _trans.dateDeleted = 0; //timestamp updated
                    });
                    console.log ('_checkingAccountInsert: ', _checkingAccountInsert );
                    await putCheckAccTransaction (_checkingAccountInsert); // Adds intial transactions.
                };
            };

            // Update & Delete
            if ( isNotEmpty(_checkingAccountUpdate) ) { 

                _checkingAccountUpdate.id = _checkingAccountEdited.id; // updated timestamp
                _checkingAccountUpdate.modifiedDate = Date.now(); // updated timestamp
                _checkingAccountUpdate.dateUpdated = Date.now(); // updated timestamp

                await updateCheckingAccount (_checkingAccountUpdate, 'update'); // updates PriceList table
            };
        };

        fetchCheckingAccountListData();
        setCheckingAccountEdited (_checkingAccountEdited);
        setNewCheckingAccountSettingsDialog (false);
        setEditCheckingAccountSettingsDialog (false);
        */
    };

    const saveCheckAccTransactions = async (_checkingAccount) => {
        console.log ('# saveCheckAccTransactions #');

        let _checkingAccountList = [...checkingAccountList];
        let _checkingAccountEdited = null;
        (_checkingAccount) ? _checkingAccountEdited = { ..._checkingAccount } : _checkingAccountEdited = { ...checkingAccountEdited };
        let _checkingAccountInsert = {...checkingAccountInsert};
        let _checkingAccountUpdate = {...checkingAccountUpdate};

        //console.log ('_checkingAccountList: ', _checkingAccountList )
        //console.log ('_checkingAccountEdited: ', _checkingAccountEdited );

        // Updates UI
        //const index = findCheckingAccountListIndexById(_checkingAccountEdited.id);
        const index = _checkingAccountList.findIndex (_checkingAccount => _checkingAccount.id === _checkingAccountEdited.id );
        _checkingAccountList[index] = _checkingAccountEdited;
        setCheckingAccountList(_checkingAccountList);

        // Insert
        if ( isNotEmpty(_checkingAccountInsert) ) {
            console.log ('_checkingAccountInsert: ', _checkingAccountInsert );
            if ( _checkingAccountInsert.transactions.length > 0 ) {

                await updateCheckingAccount (_checkingAccountInsert, 'update'); //updates table tblPriceList with the price list object info
                await putCheckAccTransaction (_checkingAccountInsert); // DTO requires that the price list object only contains added porducts on productList prop
            };
        };

        // Update / Delete
        if ( isNotEmpty(_checkingAccountUpdate) ) { // If object not empry
            console.log ('_checkingAccountUpdate: ', _checkingAccountUpdate );

            if (_checkingAccountUpdate.dateUpdated) { // checks if its an update operation
                await updateCheckingAccount (_checkingAccountUpdate, 'update'); //updates table tblPriceList with the price list object info
            } else if (_checkingAccountUpdate.dateDeleted) { // checks if its a soft delete operation
                await updateCheckingAccount (_checkingAccountUpdate, 'delete'); //updates table tblPriceList with the price list object info
            }

            if ( _checkingAccountUpdate.transactions.length > 0 ) { // IF has products
                if (_checkingAccountUpdate.transactions[0].dateUpdated) { // checks first element to know if its an update operation type
                    await updateCheckAccTransaction (_checkingAccountUpdate, 'update'); // DTO requires that the list object only contains removed porducts on productList prop
                } else if (_checkingAccountUpdate.priceListProducts[0].dateDeleted) { // checks first element to know if its a delete operation type
                    await updateCheckAccTransaction (_checkingAccountUpdate, 'delete'); // DTO requires that the list object only contains removed porducts on productList prop
                }
            };
        };

        fetchCheckingAccountListData();

        setTransactionsSource ([]);
        setTransactionsTarget ([]);
        setCheckingAccountInsert ({});
        setCheckingAccountUpdate ({});
        setEditCheckingAccountSettingsDialog (false);
        setEditCheckAccTransactionsDialog (false)  
    };
    
    const saveNewCheckingAccount = async () => { // Not in use. Business rule applied, no modification or deletion of transactions possible

        console.log ('# saveNewCheckingAccount #');

        //let _checkingAccountList = [...checkingAccountList];
        let _checkingAccountEdited = { ...checkingAccountEdited};
        let _checkingAccountInsert = {...checkingAccountInsert};
        //let _checkAccTransactionInsert = { ...checkAccTransactionsInsert };
        let _transactionsSource = [...transactionsSource];
        let _transactionsTarget = [...transactionsTarget];

        console.log ('_checkingAccountEdited', _checkingAccountEdited)

        //setSubmitted(true);

        if ( inputAmount != null && inputType != null && selectedPaymentMethod != null ) {

            _checkingAccountEdited.dateCreated = Date.now(); // created timestamp
            _checkingAccountEdited.dateUpdated = 0; // updated timestamp
            _checkingAccountEdited.dateDeleted = 0; // updated timestamp

            _checkingAccountInsert = JSON.parse( JSON.stringify (_checkingAccountEdited) ); //Deep copy. Only on new price list insert all props are copied.
            
            _transactionsTarget = JSON.parse( JSON.stringify (_transactionsSource) ); // Use assigment to add price list products because no selection made (should use addPriceListProducts or pick list if selection required). All existing products added.
         
            _checkingAccountEdited.priceListProducts = JSON.parse( JSON.stringify (_transactionsTarget) ); //Assigns selected products to the list

            //console.log ('_checkingAccountEdited: ', _checkingAccountEdited);

            if (_checkingAccountEdited.transactions.length > 0){
                //console.log ('_checkingAccountEdited.priceListProducts: ',_checkingAccountEdited.priceListProducts)
                saveCheckAccTransactions (_checkingAccountEdited);
            } else {
                //await checkingAccountService.putCheckingAccount (_checkingAccountInsert); //before insert on tblProductPriceList table, create a new price list in tblPriceList table and return ID created
                //toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Cuenta Corriente Creada', life: 3000 });
                await putCheckingAccount (_checkingAccountInsert); //before insert on tblProductPriceList table, create a new price list in tblPriceList table and return ID created
                
                fetchCheckingAccountListData();
                setCheckingAccountEdited (_checkingAccountEdited);
                setNewCheckingAccountSettingsDialog (false);
            }

            //console.log ('_checkingAccountEdited: ', _checkingAccountEdited);
        };
    };

    const saveEditCheckingAccountSettings = async () => {

        console.log ('# saveEditCheckingAccountSettings #');
 
        //setSubmitted(true);

        let _checkingAccountList = [...checkingAccountList];
        let _checkingAccountEdited = {...checkingAccountEdited};
        let _checkingAccountUpdate = {...checkingAccountUpdate};

        const index = findCheckingAccountListIndexById(_checkingAccountEdited.id);                
        _checkingAccountList[index] = _checkingAccountEdited;
        setCheckingAccountList(_checkingAccountList);

        //_checkingAccountEdited.dateUpdated = Date.now(); // updated timestamp
        _checkingAccountUpdate.id = _checkingAccountEdited.id; // updated timestamp
        //_checkingAccountUpdate.lastTransactionDate = Date.now(); // updated timestamp
        _checkingAccountUpdate.dateUpdated = Date.now(); // updated timestamp

        //await checkingAccountService.updateCheckingAccount(_checkingAccountUpdate); //updates existing
        //toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Cuenta Corriente Actualizada', life: 3000 });
        await updateCheckingAccount(_checkingAccountUpdate, 'update'); //updates existing
        
        
        fetchCheckingAccountListData();

        //setCheckingAccountEdited (_checkingAccountUpdate);
        setCheckingAccountUpdate ({});

        setEditCheckingAccountSettingsDialog (false);
        //setEditCheckAccTransactionsDialog (false)
        //setAddCheckAccTransactionDialog (false);
        
    };

    const saveNewCheckAccTransactions = async (_newCheckingAccountEdited) => { 
    }

    const saveEditCheckAccTransactions = async (_newCheckingAccountEdited) => { // Not in use beause of business rule applied: modification or deletion of transactions not allowed
        console.log ('# saveCheckAccTransactions #');

        let _checkingAccountList = [...checkingAccountList];
        let _checkingAccountEdited = null;
        (_newCheckingAccountEdited) ? _checkingAccountEdited = { ..._newCheckingAccountEdited } : _checkingAccountEdited = { ...checkingAccountEdited };
        let _checkingAccountSettingsUpdate = {...checkingAccountUpdate};
        let _checkAccTransactionsInsert = {...checkingAccountInsert};
        let _checkingAccountTransactionsUpdate = {...checkingAccountUpdate};

        //console.log ('_checkingAccountList: ', _checkingAccountList )
        //console.log ('_checkingAccountEdited: ', _checkingAccountEdited );

        const index = findCheckingAccountListIndexById(_checkingAccountEdited.id);                
        _checkingAccountList[index] = _checkingAccountEdited;
        setCheckingAccountList(_checkingAccountList);

        //_checkingAccountEdited.lastTransactionDate = Date.now(); // to track changes in PriceList products
        //_checkingAccountEdited.dateUpdated = Date.now(); // updated timestamp
        //console.log ('_checkingAccountEdited: ', _checkingAccountEdited );
        //_checkingAccountUpdated.id = _checkingAccountEdited.id
        _checkingAccountSettingsUpdate.id = _checkingAccountEdited.id;
        _checkingAccountSettingsUpdate.lastTransactionDate = Date.now(); // to track changes in PriceList products
        _checkingAccountSettingsUpdate.dateUpdated = Date.now(); // updated timestamp
        

        // Add
        if ( isNotEmpty(_checkAccTransactionsInsert) ) { 
            if ( _checkAccTransactionsInsert.transactions.length > 0 ) {
                console.log ('_checkAccTransactionsInsert: ', _checkAccTransactionsInsert );
                //_checkAccTransactionsInsert.modifiedDate = Date.now(); // to track changes in PriceList products
                //_checkAccTransactionsInsert.dateUpdated = Date.now(); // updated timestamp
                //await checkingAccountService.updateCheckingAccount (_checkingAccountSettingsUpdate); //updates PriceList table
                //await checkAccTransactionService.putCheckAccTransaction (_checkAccTransactionsInsert); // DTO requires that the list object only contains added porducts on productList prop
                //toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Cuenta Corriente Actualizada', life: 3000 });
                await updateCheckingAccount (_checkingAccountSettingsUpdate, 'update'); //updates PriceList table
                await putCheckAccTransaction (_checkAccTransactionsInsert); // DTO requires that the list object only contains added porducts on productList prop
            };
        };

        // Update & Remove  // In his case no removals allowed as per business rules
        if ( isNotEmpty(_checkingAccountTransactionsUpdate) ) { 
            if (_checkingAccountTransactionsUpdate.transactions.length > 0 ) { 
                //console.log ('_checkingAccountTransactionsUpdate: ', _checkingAccountTransactionsUpdate );
                //console.log ('_checkingAccountTransactionsUpdate: ', _checkingAccountTransactionsUpdate );
                //_checkingAccountTransactionsUpdate.modifiedDate = Date.now(); // to track changes in PriceList products
                //_checkingAccountTransactionsUpdate.dateUpdated = Date.now(); // updated timestamp
                //await checkingAccountService.updateCheckingAccount (_checkingAccountSettingsUpdate); //updates PriceList table
                //await checkAccTransactionService.updateCheckAccTransaction (_checkingAccountTransactionsUpdate); // DTO requires that the list object only contains removed porducts on productList prop
                //toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Cuenta Corriente Actualizada', life: 3000 });
                await updateCheckingAccount (_checkingAccountSettingsUpdate, 'update'); //updates PriceList table
                await updateCheckAccTransaction (_checkingAccountTransactionsUpdate, 'update'); // DTO requires that the list object only contains removed items
            };
        };

        fetchCheckingAccountListData();

        //setCheckingAccountEdited(emptyCheckingAccount);
        setTransactionsSource ([]);
        setTransactionsTarget ([]);
        setCheckingAccountUpdate (JSON.parse( JSON.stringify (emptyCheckingAccountUpdate)));
        setCheckingAccountInsert (JSON.parse( JSON.stringify (emptyCheckingAccountInsert)));
        //setCheckAccTransactionsUpdate (JSON.parse( JSON.stringify (emptyCheckingAccountTransactionsUpdate)));
        //setEditCheckingAccountSettingsDialog (false);
        setEditCheckAccTransactionsDialog (false)  
    };

    ////////////////////////////
    // Support Functions
    ///////////////////////////

    const findCheckingAccountListIndexById = (id) => {

        let _checkingAccountList = [...checkingAccountList];

        let index = -1;
        for (let i = 0; i < _checkingAccountList.length; i++) {
            if (_checkingAccountList[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    // test empty objects
    function isNotEmpty(object) { 
        for(var i in object) { 
            return true; 
        } return false; 
    } 

    const exportCSV = () => {
        dt.current.exportCSV();
    };


    ////////////////////////////
    // React Functions
    ///////////////////////////
 
    const checkingAccountListLeftToolbar = () => {
        return (
            <React.Fragment>
                {/* <Button label="Nueva" icon="pi pi-plus" className="p-button-secondary p-button-raised p-mr-2" onClick={newCheckingAccount} disabled={true} /> */}
                {/* <Button label="Eliminar" icon="pi pi-trash" className="p-button-warning p-button-raised" onClick={confirmDeleteSelected} disabled={!selectedPriceLists || !selectedPriceLists.length} /> */}
            </React.Fragment>
        )
    }
   
    const checkingAccountListRightToolbar = () => {
        return ( 
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="p-mr-2 p-d-inline-block" />
           </React.Fragment>
        )
    }
   
    const editCheckingAccountDialogLeftToolbar = () => {
        return (
            <React.Fragment>
                {/*<Button type="button" icon="pi pi-file-o" onClick={exportCSV(false)} className="p-mr-2" data-pr-tooltip="CSV" /> */}
                <Button type="button" icon="pi pi-file-o" onClick={exportCSV} className="p-mr-2" data-pr-tooltip="CSV" /> 
                {/* <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning p-mr-2" data-pr-tooltip="PDF" /> */}
                {/* <Button label="Cobro" icon="pi pi-plus" className="p-button-secondary p-button-raised p-mr-2" onClick={addPaymentTransaction} tooltip = 'Ingresar Cobro' /> */}
            </React.Fragment>
        )
    }

    const editCheckingAccountDialogRightToolbar = () => {
        return (
            
            <React.Fragment>
                <span className="p-buttonset">
                <Button label="Cobro" icon="pi pi-plus" className="p-button-secondary p-button-raised p-mr-2" onClick={ () => { openNewCheckAccTransactionDialog(1) } } />
                <Button label="Deuda" icon="pi pi-minus" className="p-button-secondary p-button-raised p-mr-2" onClick={ () => { openNewCheckAccTransactionDialog(-1) } } />
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

    const lastTransactionDateBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {/* <span className="p-column-title">Date</span> */}
                <span>{formatDate (rowData.lastTransactionDate)}</span>
            </React.Fragment>
        );
    }

    const transactionDateBodyTemplate = (rowData) => {
        //console.log ('rowData: ', rowData )
        return (
            <React.Fragment>
                {/* <span className="p-column-title">Date</span> */}
                <span>{formatDate (rowData.transactionDate)}</span>
            </React.Fragment>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-2" tooltip= 'Ver' onClick={() => openViewCheckingAccountDialog(rowData)} />
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-2" tooltip= 'Editar' onClick={() => openEditCheckAccTransactionsDialog(rowData)} />
                {/*<Button icon="pi pi-cog" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-2" tooltip= 'Configurar' onClick={() => openEditCheckingAccountSettingsDialog(rowData)} />*/}
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

    const typeBodyTemplate = (rowData) => {
        //console.log ('typeBodyTemplate rowData: ', rowData)

        if (rowData.type === -1) {
            return (
                <React.Fragment>
                    <span className="type-text">{`Venta`}</span> 
                </React.Fragment>
            );
        }

        if (rowData.type === 1) {
            return (
                <React.Fragment>
                    <span className="type-text">{`Cobro`}</span> 
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <span className="type-text">{`Inicial`}</span> 
            </React.Fragment>
        );
    }

    const paymentMethodBodyTemplate = (rowData, props) => {
        //console.log ('selectedPaymentMethodTemplate rowData: ', rowData)
        if (rowData) {
            return (
                <div className="paymentMethod-item paymentMethod-item-value">
                    <div>{rowData.paymentMethod.type}</div>
                </div>
            );
        }
        return (
            <span>
                {props.placeholder}
            </span>
        );
    }

    const selectedPaymentMethodTemplate = (option, props) => {
        //console.log ( '# selectedPaymentMethodTemplate #' );
        //console.log ('option: ', option, '\n', 'props: ', props, '\n');
        if (option) {
            return (
                <div className="paymentMethod-item paymentMethod-item-value">
                    <div>{option.type}</div>
                </div>
            );
        }
        return (
            <span>
                {props.placeholder}
            </span>
        );
    }

    const paymentMethodOptionTemplate = (option) => {
        //console.log ('currencyOptionTemplate option: ', option)
        return (
            <div className="currency-item">
                <div>{option.type}</div>
            </div>
        );
    };

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


    ////////////////////////////
    // Headers & Footers
    ///////////////////////////

    const renderHeader = (obj) => {
        return (
            <div className="checkingAccount-name">
                <div> Cuenta Corriente [ {obj.name} ]</div>
            </div>           
        );
    }   

    const headerCheckingAccountList = (
        <div className="table-header">
            <h5 className="p-m-0"> Cuentas Corrientes </h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(event) => setGlobalFilter(event.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const headerEditCheckingAccount = (
        <div className="table-header">
            <h5 className="p-m-0"> Movimientos </h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(event) => setGlobalFilter(event.target.value)} placeholder="Buscar..." className="p-m-0" />
            </span>
        </div>
    );

    const headerViewCheckingAccount = (
        <div className="table-header">
            <h5 className="p-m-0"> Movimientos </h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(event) => setGlobalFilter(event.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const newCheckAccTransactionDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideNewCheckAccTransactionDialog} />
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={addTransaction} disabled={ (inputAmount ===0) || !inputDescription || !selectedPaymentMethod } />
        </React.Fragment>
    );

    const viewCheckingAccountDialogFooter = (
        <React.Fragment>
          <Button label="Cerrar" icon="pi pi-times" className="p-button-text" onClick={hideViewCheckingAccountDialog} />
        </React.Fragment>
    );

    const editCheckingAccountSettingsDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideEditCheckingAccountSettingsDialog} />
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={saveCheckingAccount} disabled={ (inputAmount === 0) || !inputDescription || !selectedPaymentMethod }/>
        </React.Fragment>
    );

    const editCheckAccTransactionsDialogFooter = (
        <React.Fragment>
             <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideEditCheckAccTransactionsDialog} /> 
             <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={saveCheckAccTransactions} />
        </React.Fragment>
    );



    ////////////////////////////
    // Renderer
    ///////////////////////////

    return (
        <div className="datatable-crud">
            <Toast ref={toast} />

            <div className='card'>
                {/* <Toolbar className="p-mb-4" left={checkingAccountListLeftToolbar} right={checkingAccountListRightToolbar}></Toolbar> */}

                <DataTable ref={dt} className="p-datatable-striped" value={checkingAccountList} dataKey="id" 
                    //selection={selectedCheckingAccounts} onSelectionChange={ (event) => setSelectedCheckingAccounts(event.value) }
                    //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    //currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                    scrollable scrollHeight="650px"
                    globalFilter={globalFilter}
                    header={headerCheckingAccountList}>

                    {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column> */}
                    {/* <Column field="id" header="ID" sortable></Column> */}
                    <Column field="name" header="Name" sortable />
                    <Column field="lastTransactionDate" header="Último movimiento" sortable body={lastTransactionDateBodyTemplate} />
                    <Column field="balance" header="Saldo" sortable body={balanceBodyTemplate} />
                    {/* <Column field="currency" header="Status" sortable body={currencyBodyTemplate3} /> */}
                    <Column body={actionBodyTemplate} headerStyle={{ width: '8em', textAlign: 'left' }} bodyStyle={{ textAlign: 'left', overflow: 'visible' }} />                  
                </DataTable>
            </div>

            <Dialog className="p-fluid" visible={newCheckAccTransactionDialog} style={{ width: '600px' }} header="Movimientos" modal closable={false} footer={newCheckAccTransactionDialogFooter} onHide={ () => {} }>

                <div className="card">
                    {/*
                    <div className="p-field p-md-2">
                        <label htmlFor="transactionTypeDropdownSelection"> Tipo de ajuste </label>
                        <Dropdown id="transactionTypeDropdownSelection" value={selectedTransactionType} onChange={ (event) => { onTransactionTypeDropDownChange (event, 'type', 'id', 'type') } } options={paymentMethods} optionLabel="type" dataKey="id" valueTemplate={selectedPaymentMethodTemplate} itemTemplate={paymentMethodOptionTemplate} placeholder="Seleccione el Método de Pago" scrollHeight='150px' autoWidth={true} disabled={false} /> 
                    </div>
                    */}
                    <div className="p-field p-md-3">
                        <label htmlFor="amountInputNumber"> Monto </label>
                        <InputNumber id="amountInputNumber" value={inputAmount}  onFocus={onFocusInputAmount} onChange={ (event) => { onChangeInputAmount (event, 'amount', 'type') } } mode="currency" currency="ARS" maxFractionDigits={2} min={0} locale="es-AR" currencyDisplay="symbol" placeholder='0.00' disabled={false} required className={classNames({ 'p-invalid': !inputAmount })} />
                        { !inputAmount  && <small className="p-invalid"> Requerido !</small>}
                        {/* { invalidInputAmount && <small className="p-invalid"> No es un monto válido !</small>} */}
                    </div>

                    <div className="p-field p-md-4">
                        <label htmlFor="paymentMethodDropdownSelection"> Método de Pago </label>
                        <Dropdown id="paymentMethodDropdownSelection" value={selectedPaymentMethod} onChange={ (event) => { onChangePaymentMethodDropDown (event) } } options={paymentMethodList} optionLabel="type" dataKey="id" valueTemplate={selectedPaymentMethodTemplate} itemTemplate={paymentMethodOptionTemplate} placeholder="Seleccione el Método de Pago" scrollHeight='150px' autoWidth={false} disabled={false} required className={classNames({ 'p-invalid': !selectedPaymentMethod })} /> 
                        { !selectedPaymentMethod  && <small className="p-invalid"> Requerido !</small>}
                    </div>

                    <div className="p-field p-md-2">
                        <label htmlFor="currencyDropdownSelection">Moneda</label>
                        <Dropdown id="currencyDropdownSelection" value={selectedCurrency} onChange={ (event) => { onChangeCurrencyDropDown (event) } } options={currencyList} optionLabel="code" dataKey="id" valueTemplate={selectedCurrencyTemplate} itemTemplate={currencyOptionTemplate} placeholder="Seleccione la moneda" scrollHeight='150px' autoWidth={true} disabled={true} /> 
                    </div>

                    <div className="p-field p-md-6">
                        <label htmlFor="descriptionInputText"> Descripción </label>
                        <InputText id="descriptionInputText" value={inputDescription} onChange={ (event) => onChangeDescriptionTextInput(event) } required autoFocus className={classNames({ 'p-invalid': !inputDescription })} />
                        { !inputDescription && <small className="p-invalid"> Requerido !</small>}
                    </div>

                </div>

            </Dialog>

            <Dialog visible={viewCheckingAccountDialog} autoWidth={true} header= {renderHeader(checkingAccountEdited)}  modal closable={false} footer={viewCheckingAccountDialogFooter} onHide={ () => {} }>
                <div className="View Transactions">
                    <DataTable ref={dt} className="p-datatable-striped" value={checkingAccountEdited.transactions} dataKey='id' 
                        scrollable scrollHeight="250px" //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        globalFilter={globalFilter}
                        header={headerViewCheckingAccount}>

                        <Column field="id" header="Id" />
                        <Column field="checkingAccountId" header="ID Cuenta" />
                        <Column field="transactionDate" header="Fecha" body={transactionDateBodyTemplate}/>
                        <Column field="type" header="Tipo" body={typeBodyTemplate} />
                        <Column field="paymentMethod" header="Método de Pago" body={paymentMethodBodyTemplate} />
                        <Column field="description" header="Descripción" /> 
                        <Column field="amount" header="Monto" />
                        {/* <Column body={editPriceListProductBodyTemplate} headerStyle={{ width: '8em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} /> */}
                    </DataTable>                  
                </div>
            </Dialog>
            


            <Dialog className="p-fluid" visible={editCheckAccTransactionsDialog} style={{ width: '1000px' }} header= {renderHeader(checkingAccountEdited)}  modal closable={false} footer={editCheckAccTransactionsDialogFooter} onHide={ () => {} }>

                <div className="card">
                    <Toolbar className="p-mb-4" left={editCheckingAccountDialogLeftToolbar} right={editCheckingAccountDialogRightToolbar}></Toolbar>

                    <br/>
                    <DataTable ref={dt} className="p-datatable-striped-md" value={checkingAccountEdited.transactions} dataKey="id"
                        //selection={selectedPriceListProducts} onSelectionChange={ (event) => setSelectedPriceListProducts(event.value) } 
                        scrollable scrollHeight="250px" //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                        globalFilter={globalFilter}
                        header={headerEditCheckingAccount}>

                        {/* <Column field="id" header="Id" /> */}
                        <Column field="checkingAccountId" header="Número de Cuenta" />
                        <Column field="transactionDate" header="Fecha" body={transactionDateBodyTemplate}/>
                        <Column field="type" header="Movimiento" body={typeBodyTemplate} />
                        <Column field="paymentMethod" header="Metodo de Pago" body={paymentMethodBodyTemplate} />
                        <Column field="description" header="Descripción" /> 
                        <Column field="amount" header="Monto" />
                    </DataTable>                  
                </div>
            </Dialog>
            
        </div>
    );
}