import React, { useState, useEffect, useRef } from 'react';
import { PriceListService, ProductPriceListService } from '../service/PriceListService';
import { CurrencyService } from "../service/CurrencyService";
import { ExchangeRateService } from "../service/ExchangeRateService";
import { EmployeeService } from "../service/EmployeeService";
import { ProductService } from "../service/ProductService";
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
//import '../layout/CrudPriceList.scss';
import '../layout/CrudPriceList.css';

export function CrudPriceList() {


    ////////////////////////////////////
    // Empty Objects for initialization
    ////////////////////////////////////
    
    const emptyPriceList = {
        id: 0,
        //id: null, //new:tblPriceListId, existing: lnkProductPriceListListId
        code: '',
        name:'', //from: tblPriceListName
        markup: 35, //from: tblPriceListMarkup
        //VATax: 0.21, //from: tblPriceListVATax
        dollarLinked: false, //from: tblPriceListDollarLinked
        modifiedDate: 0,
        exchangeRate: { id: 1, rate: 1.00 }, //from tblPriceList
        currency: { id: 7, code: 'ARS' }, //from tblPriceList
        priceListProducts: [],
        dateCreated: 0, 
        dateUpdated: 0, 
        dateDeleted: 0,
    };

    const emptyPriceListProduct = {
        id: 0,
        code: '',
        name: '',
        detail: '',
        brand: '',
        model: '',
        category: '',
        manufacturer: '',
        initialUnitQuantity: 0,
        quantityPerUnit: 0,
        unitPurchasePrice: 0,
        purchasePriceCurrency: {id: 459, code: 'USD'},
        inventoryStatus: {id: 0, name:''},
        productPriceListId: 0,
        priceListId: 0,
        sellPrice: 0,
        //sellPriceCurrency: {id: null, code: ''}, // Currency is setted in PriceList, not in Product
        netPrice: 0,
        //netPriceCurrency: {id: null, code: ''}, // Currency is setted in PriceList, not in Product
        dateCreated: 0, //it's the value of productPriceList table row
        dateUpdated: 0, //it's the value of productPriceList table row
        dateDeleted: 0,  //it's the value of productPriceList table row
        //image: null,
        //rating: 0,
    }

    const emptyCurrency = {
        id: 7,
        code: 'ARS'
    }

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

    const emptyExchangeRate = {
        id: 1,
        rate: 1.00
    }

    const emptyPriceListInsert = {
        id:null,
        priceListProducts: []
    }

    const emptyPriceListUpdate = {
        id: null,
        priceListProducts: []
    }


    ///////////////
    // React Hooks
    ///////////////

    // Price List Variables
    const [pricesLists, setPricesLists] = useState([]);    
    const [pricesListsUndo, setPricesListsUndo] = useState([]);
    const [priceListEdited, setPriceListEdited] = useState({});
    const [priceListEditedUndo, setPriceListEditedUndo] = useState({});
    const [priceListInsert, setPriceListInsert] = useState(null);
    const [priceListUpdate, setPriceListUpdate] = useState(null);
    const [priceListProductList, setPriceListProductList] = useState([]);
    const [priceListProductEdited, setPriceListProductEdited] = useState({});

    // Currency Variables
    const [currencyList, setCurrencyList] = useState([]);

    // Employee Variables
    const [employeeList, setEmployeeList] = useState([]);

    // Product Variables
    const [products, setProducts] = useState([]);
    const [productsSource, setProductsSource] = useState([]);
    const [productsTarget, setProductsTarget] = useState([]);
    const [addProductClicked, setAddProductClicked] = useState(false);
    const [removeProductClicked, setRemoveProductClicked] = useState(false);
    const [productListType, setProductListType] = useState( 'priceList' );
    const [productQueryFilter, setProductQueryFilter] = useState(null);

    // Input Variables
    const [inputCode, setInputCode] = useState('');
    const [invalidInputCode, setInvalidInputCode] = useState(false); 
    const [inputName, setInputName] = useState('');
    const [inputMarkup, setInputMarkup] = useState(1.00);
    const [inputVATax, setInputVATax] = useState(1.21);
    //const [inputDollarLinked, setInputDollarLinked] = useState(0);
    const [inputGlobalExchangeRate, setInputGlobalExchangeRate] = useState(1);
    const [globalExchangeRateEdited, setGlobalExchangeRateEdited] = useState( {...emptyExchangeRate} );
    //const [globalExchangeRateCurrency, setGlobalExchangeRateCurrency] = useState( {...emptyCurrency} );
    const [checkedDollarLinked, setCheckedDollarLinked] = useState(false);
    //const [modifedDate, setModifiedDate] = useState(false);
    const [exchangeRateList, setExchangeRateList] = useState([]);
    const [inputExchangeRate, setInputExchangeRate] = useState( {...emptyExchangeRate} );
    //const [exchangeRateEdited, setExchangeRateEdited] = useState(emptyExchangeRate);
    const [inputCurrency, setInputCurrency] = useState({...emptyCurrency});
    const [selectedCurrency, setSelectedCurrency] = useState({...emptyCurrency});
    const [inputSellPrice, setInputSellPrice] = useState (0);
    //const [inputNetPrice, setInputNetPrice] = useState (0);
    const [selectedPriceLists, setSelectedPriceLists] = useState([]);
    const [selectedPriceListProducts, setSelectedPriceListProducts] = useState([]);

    // Dialog Variables
    const [viewPriceListDialog, setViewPriceListDialog] = useState(false);
    const [insertNewPriceListDialog, setInsertNewPriceListDialog] = useState(false);
    const [updatePriceListSettingsDialog, setUpdatePriceListSettingsDialog] = useState(false);
    const [updatePriceListProductsDialog, setUpdatePriceListProductsDialog] = useState(false);
    const [deletePriceListDialog, setDeletePriceListDialog] = useState(false);
    const [deletePriceListProductDialog, setDeletePriceListProductDialog] = useState(false);
    const [addPriceListProductsDialog, setAddPriceListProductsDialog] = useState(false);
    const [removePriceListProductsDialog, setRemovePriceListProductsDialog] = useState(false);
    const [deleteSelectedPriceListsDialog, setDeleteSelectedPriceListsDialog] = useState(false);
    const [deleteSelectedPriceListProductsDialog, setDeleteSelectedPriceListProductsDialog] = useState(false);

    // Other Varibles
    const [globalFilter, setGlobalFilter] = useState([]);
    //const [submitted, setSubmitted] = useState(false); // used for input control in form, not in use
    const toast = useRef(null);
    const dt = useRef(null);
    const currencyService = new CurrencyService();
    const employeeService = new EmployeeService();
    const exchangeRateService = new ExchangeRateService();
    const priceListService = new PriceListService();
    const productPriceListService = new ProductPriceListService();
    const productService = new ProductService();

    useEffect( () => {

        fetchPriceListData();
        fetchCurrencyListData();
        fetchExchangeRateListData();
        fetchEmployeeListData();
        fetchProductListData(productListType, productQueryFilter); //productQueryFilter will be null becuase there is no need to filter by pricelist at this point, just get all the existing products in product table
        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);


    ///////////////////////
    // DB Data Functions
    ///////////////////////

    async function fetchPriceListData () {
        console.log ( '# fetchPriceListData #' );
        await priceListService.getPriceList().then( (_priceListsData) => {
            console.log ('priceListsData: ', _priceListsData);

            _priceListsData = _priceListsData.filter( pl => !(pl.dateCreated === 0) ); // Removes db DEFAULT row

            setPricesLists (JSON.parse(JSON.stringify(_priceListsData)));
            setPricesListsUndo (JSON.parse(JSON.stringify(_priceListsData)));
        });
    };

    async function putPriceList (_priceList) {
        console.log ( '# putPriceList #' );
        //console.log ('_priceList: ', _priceList, '\n');
        let returnedId = await priceListService.putPriceList (_priceList);
        toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Nueva Lista Creada', life: 3000 });
        return returnedId;
    }

    async function updatePriceList (_priceList, option) {
        console.log ( '# updatePriceList #' );
        //console.log ('_priceList: ', _priceList, '\n');
        await priceListService.updatePriceList (_priceList).then ( (returnedValue) => { //update persistent data source.

            switch (option) {
                case 'update':
                    toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Lista de Precios Actualizada', life: 3000 });
                    break;
                case 'delete':
                    toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Lista/s de Precios Borrada/s', life: 3000 });
                    break;             
            }
            return returnedValue;
        })
    }

    async function fetchProductPriceListData (_priceList) {
        console.log ( '# fetchProductPriceListData #' );
        await productPriceListService.getProductPriceList(_priceList.id).then( (_productPriceListData) => {
            console.log ('productPriceListData: ', _productPriceListData);
            //console.log ('_priceList: ', _priceList);
            (_productPriceListData) ? _priceList.priceListProducts = [..._productPriceListData] : _priceList.priceListProducts = [];
            setPriceListEdited (JSON.parse(JSON.stringify(_priceList)));
            setPriceListEditedUndo (JSON.parse(JSON.stringify(_priceList)));
            return _priceList
        });
    };

    async function putProductPriceList (_priceList) {
        console.log ( '# putProductPriceList #' );
        //console.log ('newPriceListProduct: ', newPriceListProduct, '\n');
        let returnedId = await productPriceListService.putProductPriceList (_priceList);
        return returnedId;
    }

    async function updateProductPriceList (priceListProducts, option) {
        console.log ( '# updateProductPriceList #' );
        //console.log ('priceListProducts: ', priceListProducts, '\n');
        await productPriceListService.updateProductPriceList (priceListProducts).then ( (returnedValue) => { //update persistent data source.
            switch (option) {
                case 'update':
                    toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Productos Actualizados', life: 3000 });
                    break;
                case 'delete':
                    toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Productos Removidos', life: 3000 });
                    break;               
            }
            return returnedValue;
        }) 
    }

    async function fetchCurrencyListData () {
        console.log ( '# fetchCurrencyListData #' );
        await currencyService.getCurrencyList().then( (currencyListData) => {
            //console.log ('currencyListData: ', currencyListData, '\n');
            setCurrencyList(JSON.parse(JSON.stringify(currencyListData)));
            //setCurrencyListUndo(JSON.parse(JSON.stringify(currencysData)));
        });

    };

    async function fetchExchangeRateListData () {
        console.log ( '# fetchExchangeRateListData #' );
        await exchangeRateService.getExchangeRateList().then( (exchangeRatesData) => {
            console.log ('exchangeRatesData: ', exchangeRatesData, '\n');
            setExchangeRateList (JSON.parse(JSON.stringify(exchangeRatesData)));
            //setExchangeRatesUndo (JSON.parse(JSON.stringify(currencysData)));
            setInputGlobalExchangeRate (exchangeRatesData[1].rate);
            setGlobalExchangeRateEdited (JSON.parse(JSON.stringify(exchangeRatesData[1])));
        });

    };

    async function updateExchangeRate (_exchangeRate) {
        console.log ( '# updateExchangeRate #' );
        //console.log ('_exchangeRate: ', _exchangeRate, '\n');
        await exchangeRateService.updateExchangeRate (_exchangeRate).then ( (returnedValue) => { //update persistent data source.
            return returnedValue;
        }) 
    }

    async function fetchEmployeeListData () {
        console.log ( '# fetchEmployeeListData #' );
        await employeeService.getEmployeeList().then( (_employeeListData) => {
            //console.log ('exchangeRatesData: ', exchangeRatesData, '\n');
            setEmployeeList (JSON.parse(JSON.stringify(_employeeListData)));
        });

    };

    async function updateEmployee (_employee) {
        console.log ( '# updateEmployee #' );
        //console.log ('_employee: ', _employee, '\n');
        await employeeService.updateEmployee (_employee).then ( (returnedValue) => { //update persistent data source.
            return returnedValue;
        }) 
    }

    async function fetchProductListData (productListType, productQueryFilter) {
        console.log ( '# fetchProductListData #' );
        let productFilter = [productListType, productQueryFilter];
        await productService.getProductList ( productFilter ).then( (productsData) => {
            console.log ('productsData: ', productsData, '\n');
            setProducts(JSON.parse(JSON.stringify(productsData)));
        });
    }


    ////////////////////////////////////
    // Action Body Dialog Functions
    ////////////////////////////////////

    const openViewPriceListDialog = (rowData) => { // Opens view price list dialog
        console.log ('# openViewPriceListDialog #');

        //fetchProductPriceListData ( { ...rowData } );
        setPriceListEdited ( { ...rowData } );
        setInputCurrency ( {...priceListEdited.currency} )

        setViewPriceListDialog(true);
    };

    const hideViewPriceListDialog = () => {  // Hides view price list dialog
        //setSubmitted(false); // used for input control in form, not in use
        setViewPriceListDialog(false);
    }

    const openInsertNewPriceListDialog = () => { // Opens new pirce list dialog
        console.log ('# openInsertNewPriceListDialog #');

        setPriceListEdited( {...emptyPriceList} );
        setInputCode ( emptyPriceList.code );
        setInputName ( emptyPriceList.name );
        setInputMarkup ( emptyPriceList.markup * 100 );
        //setInputVATax ( emptyPriceList.VATax * 100 );
        setCheckedDollarLinked ( emptyPriceList.dollarLinked );
        //setModifiedDate ( emptyPriceList.modifiedDate );
        setInputExchangeRate ( emptyPriceList.exchangeRate );
        setSelectedCurrency ( emptyPriceList.currency );

        setProductsSource(JSON.parse(JSON.stringify(products))); // Can also be used with pick lits to assig products to the a new lit
        setProductsTarget([]); // Can also be used with pick lits form to asign products to a new list
        setPriceListInsert (JSON.parse( JSON.stringify ( {...emptyPriceList} ) ) );

        setInsertNewPriceListDialog(true);
    }

    const hideInsertNewPriceListDialog = () => { // Hides new price list dialog
        
        setProductsSource([]);
        setProductsTarget([]);
        // setSubmitted(false); // used for input control in form, not in use

        setInsertNewPriceListDialog(false);
    }

    const openUpdatePriceListSettingsDialog = (rowData) => { // Opens edit price list dialog
        console.log ('# openUpdatePriceListSettingsDialog #');
        //setPriceListEdited ( { ...rowData } );
        setPriceListEdited ( rowData );
        setInputCode ( rowData.code );
        setInputName ( rowData.name );
        setInputMarkup ( rowData.markup );
        //setInputVATax ( rowData.VATax );
        setCheckedDollarLinked ( (rowData.dollarLinked) ? true : false );
        //setModifiedDate ( emptyPriceList.modifiedDate );
        setInputExchangeRate ( rowData.exchangeRate ); // Object inside a state hook should not be enclosed in angle brackets to work properly
        setSelectedCurrency ( rowData.currency ); // Object inside a state hook should not be enclosed in angle brackets to work properly
        setPriceListUpdate ({});
        setUpdatePriceListSettingsDialog(true);

    };

    const hideUpdatePriceListSettingsDialog = () => { // Hides edit price list dialog
        setPricesLists(JSON.parse(JSON.stringify(pricesListsUndo)));
        console.log ('pricesListsUndo', pricesListsUndo);
        setUpdatePriceListSettingsDialog(false);
    }

    const openEditPriceListProductsDialog = (rowData) => { // Opens edit price list products dialog
        console.log ('# openEditPriceListProductsDialog #');
        //console.log ('rowData: ', rowData);

        //fetchProductPriceListData ({ ...rowData });
        setPriceListEdited ( {...rowData} );
        setInputCode ( rowData.code );
        setInputName ( rowData.name );
        setInputMarkup ( rowData.markup * 100 );
        setInputExchangeRate ( rowData.exchangeRate );
        setInputCurrency ( priceListEdited.currency )

        setPriceListInsert (JSON.parse (JSON.stringify ( {...emptyPriceListInsert} ) ) );
        setPriceListUpdate (JSON.parse (JSON.stringify ( {...emptyPriceListUpdate} ) ) );
        
        setUpdatePriceListProductsDialog(true);
    };

    const hideEditPriceListProductsDialog = () => { // Hides edit price list products dialog

        //console.log ('pricesListsUndo', pricesListsUndo);
        setPricesLists(JSON.parse(JSON.stringify(pricesListsUndo)));
        //console.log ('priceListEdited', priceListEditedUndo);
        setPriceListEdited(JSON.parse(JSON.stringify(priceListEditedUndo)));
        //console.log ('priceListProductsUpdate', priceListProductsUpdateUndo);
        //setPriceListProductsUpdate(JSON.parse(JSON.stringify(priceListProductsUpdateUndo)));
        //console.log ('priceListProductsUndo', priceListProductListUndo);
        //setPriceListProductList(JSON.parse(JSON.stringify(priceListProductListUndo)));

        setProductsSource([]);
        setProductsTarget([]);
        //setSubmitted(false); // used for input control in form, not in use
        setSelectedPriceListProducts([]);
        setUpdatePriceListProductsDialog(false);
    }

    //Opens Add Product List Dialog. This function generates the list of products available to be selected in the addSelectedProducts function
    const openAddSelectedProductsDialog = () => { // Opens add selected products dialog
        console.log ('# openAddSelectedProductsDialog #');

        let _priceListProductList = [ ...priceListEdited.priceListProducts ]; // 
        let _productsSource = [...productsSource]; // Shallow copy to reference array
        let _productList = [...products]; // Shallow copy to reference array

        //Filter product list to show only the ones not already included in the list
        for (const prod of _productList) {
            let include = true;
            _priceListProductList.forEach ( (_priceListProdEdited) => {
                //console.log ('prod.id && prod.id: ', prod.id, prod.id);
                if (prod.id === _priceListProdEdited.id ) { include = false }
            });
            if ( include ) { _productsSource.push (prod) };
        };

        //console.log ('_productsSource', _productsSource);

        setProductsSource(_productsSource); // sets updated list in the UI (react component)
        //setProductsTarget ([]);

        setAddPriceListProductsDialog(true);
    };

    const hideAddSelectedProductsDialog = () => {
        
        //setPricesLists (JSON.parse(JSON.stringify(pricesListsUndo)));
        //console.log ('priceListEdited', priceListEdited);
        //setPriceListEdited (JSON.parse(JSON.stringify(priceListEditedUndo)));
        //console.log ('priceListProductsUpdate', priceListProductsUpdate);
        //setPriceListProductsUpdate (JSON.parse(JSON.stringify(priceListProductsUpdateUndo)));
        //setPriceListProductList (JSON.parse(JSON.stringify(priceListProductListUndo)));
        

        setProductsSource([]);
        setProductsTarget([]);
        //setSubmitted(false); // used for input control in form, not in use
        setSelectedPriceListProducts ([]);
        setAddProductClicked (false);
        setAddPriceListProductsDialog(false);
    }

    const openRemoveSelectedProductsDialog = () => { // Opens remove selected products dialog
        console.log ('# openRemoveSelectedProductsDialog #');

        let _priceListProductList = [...priceListEdited.priceListProducts]; // Shallow copy to reference array

        setPriceListInsert ( {...emptyPriceListInsert} );
        setPriceListUpdate ( {...emptyPriceListUpdate} );
        setProductsSource(_priceListProductList); // sets updated list in the UI (react component)
        setRemovePriceListProductsDialog(true);
    };

    const hideRemoveProductsDialog = () => {
        setProductsSource([]);
        setProductsTarget ([]);
        setSelectedPriceListProducts ([]);
        setRemoveProductClicked(false);
        setRemovePriceListProductsDialog(false);
    }

    const openDeletePriceListDialog = (rowData) => { // Opens delete single pirce list dialog
        console.log ('# openDeletePriceListDialog #');
        setPriceListEdited ( { ...rowData} );
        //setPriceListSettingsUpdate (JSON.parse( JSON.stringify ( {...emptyPriceListSettingsUpdate} ) ) );
        setPriceListUpdate ( {} );
        setDeletePriceListDialog(true);
    }

    const hideDeletePriceListDialog = () => {
        setDeletePriceListDialog(false);
    }

    const openDeleteSelectedPriceListsDialog = async () => { // Opens delete selected pirce lists dialog
        console.log ('# openDeleteSelectedPriceListsDialog #');
        let _selectedPriceLists = [...selectedPriceLists];
        /*
        _selectedPriceLists.forEach ( async (_priceListSelected) => { 
            _priceListSelected = await fetchProductPriceListData ( { ..._priceListSelected } ); // Gets products for selected price list
        });
        */
        setSelectedPriceLists ([..._selectedPriceLists]) ;
        setDeleteSelectedPriceListsDialog(true);
    }

    const hideDeleteSelectedPriceListsDialog = () => {
        setSelectedPriceLists([]);
        setDeleteSelectedPriceListsDialog(false);
    };

    // Only in use when trash can icon action is added to actionBodyTemplate in datatable for individual products
    const openDeletePriceListProductDialog = (rowData) => { // Opens delete single pirce list product dialog

        setPriceListProductEdited({ ...rowData});
        //setPriceListSettingsUpdate (JSON.parse( JSON.stringify ( {...emptyPriceListSettingsUpdate} ) ) );        
        //setPriceListProductsUpdate (JSON.parse( JSON.stringify ( {...emptyPriceListProductsUpdate} ) ) );
        setPriceListUpdate ( {} );        

        setDeletePriceListProductDialog(true);
    }

    // Only in use when trash can icon action is added to actionBodyTemplate in datatable for individual products
    const hideDeletePriceListProductDialog = () => {
        setDeletePriceListProductDialog(false);
    }


    /////////////////////
    // Event Functions
    /////////////////////

    const onInputCodeChange = (event) => {
        console.log ('# onInputCodeChange #');
        
        const val = event.target.value
        let _pricesLists = [...pricesLists]
        let _priceListEdited = { ...priceListEdited };
        let _priceListInsert = { ...priceListInsert }; // All value changed during creation are stored in this variable and finally used in savePriceList function
        let _priceListUpdate = { ...priceListUpdate }; // All value changed during update are stored in this variable and finally used in savePriceList function
        let _invalidInputCode = {...invalidInputCode};
        let valid = true;

        _pricesLists.forEach ( (_priceList) => {
            //console.log ('pl:', pl)
            if ( _priceList.code.trim() === val.trim() ) { valid = false }
        });

        if ( valid ) {
            _invalidInputCode = false;
            _priceListEdited.code = val;
            (_priceListEdited.id) ? _priceListEdited.dateUpdated = Date.now() : _priceListEdited.dateCreated = Date.now();

            if (_priceListEdited.id) { // checks if its an update or a new price list
                _priceListUpdate.code = _priceListEdited.code
                _priceListUpdate.dateUpdated = _priceListEdited.dateUpdated // time stamp of the update
                setPriceListUpdate(_priceListUpdate); //to capture just modifications to sale order settings
            }else{ 
                _priceListInsert.code = _priceListEdited.code; // if has an id is an update, if not is an insert
                _priceListUpdate.dateCreated = _priceListEdited.dateCreated // Just needed here because if it's an insert (all onChange will be done at the same time) and this field is mandatory.
                setPriceListInsert(_priceListInsert); //to capture just new insert to sale order settings
                addAllPriceListProducts();
            }

        }else {
            _invalidInputCode = true;
        };

        setInputCode (val);
        setInvalidInputCode (_invalidInputCode);
        setPriceListEdited(_priceListEdited);
    }

    const onInputNameChange = (event) => {
        console.log ('# onInputNameChange #');

        const val = event.target.value
        let _priceListEdited = { ...priceListEdited };
        let _priceListInsert = { ...priceListInsert }; // All value changed during creation are stored in this variable and finally used in savePriceList function
        let _priceListUpdate = { ...priceListUpdate }; // All value changed during update are stored in this variable and finally used in savePriceList function

        _priceListEdited.name = val;
        (_priceListEdited.id) ? _priceListEdited.dateUpdated = Date.now() : _priceListEdited.dateCreated = Date.now(); // to be used during save fnctions

        if (_priceListEdited.id){
            _priceListUpdate.name = _priceListEdited.name
            _priceListUpdate.dateUpdated = _priceListEdited.dateUpdated; // time stamp of the update
            setPriceListUpdate(_priceListUpdate); //to capture just modifications to price list settings
        } else {
            _priceListInsert.name = _priceListEdited.name; //to capture just new inserts to price list settings
            setPriceListInsert(_priceListInsert); //to capture just new inserts to price list settings
        }

        setInputName (val);
        setPriceListEdited(_priceListEdited);
    }

    const onInputMarkupChange = (event) => {
        console.log ('# onInputMarkupChange #');

        const val = event.target.value
        let _priceListEdited = { ...priceListEdited };
        let _priceListInsert = { ...priceListInsert }; // All value changed during creation are stored in this variable and finally used in savePriceList function
        let _priceListUpdate = { ...priceListUpdate }; // All value changed during update are stored in this variable and finally used in savePriceList function

        _priceListEdited.markup = val / 100;
        (_priceListEdited.id) ? _priceListEdited.dateUpdated = Date.now() : _priceListEdited.dateCreated = Date.now(); // to be used during save fnctions

        if (_priceListEdited.id) {
            _priceListUpdate.markup = _priceListEdited.markup
            _priceListUpdate.dateUpdated = _priceListEdited.dateUpdated // time stamp of the update
            setPriceListUpdate(_priceListUpdate); //to capture just modifications to price list settings
        } else {
            _priceListInsert.markup = _priceListEdited.markup; //to capture just modifications to price list settings
            setPriceListInsert(_priceListInsert); //to capture just modifications to price list settings
        }
        setInputMarkup (val);
        setPriceListEdited(_priceListEdited);
    }

    const onInputVATaxChange = (event) => {
        console.log ('# onInputVATaxChange #');

        const val = event.target.value;
        let _priceListEdited = { ...priceListEdited };
        let _priceListInsert = { ...priceListInsert }; // All value changed during creation are stored in this variable and finally used in savePriceList function
        let _priceListUpdate = { ...priceListUpdate }; // All value changed during update are stored in this variable and finally used in savePriceList function

        _priceListEdited.VATax = val / 100;
        (_priceListEdited.id) ? _priceListEdited.dateUpdated = Date.now() : _priceListEdited.dateCreated = Date.now(); // to be used during save fnctions

        if (_priceListEdited.id) {
            _priceListUpdate.VATax = _priceListEdited.VATax
            _priceListUpdate.dateUpdated = _priceListEdited.dateUpdated // time stamp of the update
            setPriceListUpdate(_priceListUpdate); //to capture just modifications to price list settings
        } else {
            _priceListInsert.VATax = _priceListEdited.VATax; //to capture just modifications to price list settings
             setPriceListInsert(_priceListInsert); //to capture just modifications to price list settings
        }

        setInputVATax (val);
        setPriceListEdited(_priceListEdited);
    }

    const onDollarLinkedChecked = (event) => {
        console.log ('# onDollarLinkedChecked #');

        const val = event.target.value;
        let _priceListEdited = { ...priceListEdited };
        let _priceListInsert = { ...priceListInsert }; // All value changed during creation are stored in this variable and finally used in savePriceList function
        let _priceListUpdate = { ...priceListUpdate }; // All value changed during update are stored in this variable and finally used in savePriceList function
        let _exchangeRates = [ ...exchangeRateList ];

        if (val) {
            _priceListEdited.dollarLinked = 1;
            _priceListEdited.exchangeRate.id = 2; // From USD to ARS
            _priceListEdited.currency.id = 459; // USD currency Code
            (_priceListEdited.id) ? _priceListEdited.dateUpdated = Date.now() : _priceListEdited.dateCreated = Date.now(); // to be used during save fnctions
        } else {
            _priceListEdited.dollarLinked = 0;
            _priceListEdited.exchangeRate.id = 1; // From ARS to ARS
            _priceListEdited.currency.id = 7; // ARS currency Code
            (_priceListEdited.id) ? _priceListEdited.dateUpdated = Date.now() : _priceListEdited.dateCreated = Date.now(); // to be used during save fnctions
        }
        /*
        // Searches in the exchange rate list by id and assigns the corresponding rate.
        for (let i = 0; i < _exchangeRates.length; i++) {
            if (_exchangeRates[i].id === _priceListEdited.exchangeRate.id) {
                _priceListEdited.exchangeRate.rate = _exchangeRates[i].rate || null;
                setInputExchangeRate ( _priceListEdited.exchangeRate ); 
                break;
            };
        };
        */
        // Searches in the exchange rate list by id and assigns the corresponding rate.
        let index = _exchangeRates.findIndex (_exchangeRate => _exchangeRate.id === _priceListEdited.exchangeRate.id );
        _priceListEdited.exchangeRate.rate = _exchangeRates[index].rate || 0;
        setInputExchangeRate ( _priceListEdited.exchangeRate ); 

        if (_priceListEdited.id) { // check if if it's an existing price List or a new one
            _priceListUpdate.dollarLinked = _priceListEdited.dollarLinked;
            _priceListUpdate.exchangeRate = { id: _priceListEdited.exchangeRate.id }; // From USD to ARS
            _priceListUpdate.currency = { id: _priceListEdited.currency.id }; // USD currency Code
            _priceListUpdate.exchangeRate.rate = _priceListEdited.exchangeRate.rate || 0; // to capture just modifications
            _priceListUpdate.dateUpdated = _priceListEdited.dateUpdated // time stamp of the update
            setPriceListUpdate(_priceListUpdate); //to capture just modifications to price list settings
        }else { 
            _priceListInsert.dollarLinked = _priceListEdited.dollarLinked;
            _priceListInsert.exchangeRate = { id: _priceListEdited.exchangeRate.id }; // From USD to ARS
            _priceListInsert.currency = { id: _priceListEdited.currency.id }; // USD currency Code
            _priceListInsert.exchangeRate.rate = _priceListEdited.exchangeRate.rate || null; // to capture just modifications
            setPriceListInsert(_priceListInsert); //to capture just modifications to price list settings
        }

        setCheckedDollarLinked (val);
        setPriceListEdited(_priceListEdited);
    }
    
    const onFocusEditGlobalExchangeRate = (event) => {
        console.log ('# onFocusEditGlobalExchangeRate #');

        event.target.select();
        //setInputGlobalExchangeRate(null);
    };

    const onBlurEditGlobalExchangeRate = () => {
        console.log ('# onBlurEditGlobalExchangeRate #');

        let _globalExchangeRateEdited = {...globalExchangeRateEdited};

        setInputGlobalExchangeRate(_globalExchangeRateEdited.rate);
    };

    const onChangeInputGlobalExchangeRate = async (event) => {
        console.log ('# onChangeInputGlobalExchangeRate #');
        //const val =  event.value;

        let _globalExchangeRateEdited = {...globalExchangeRateEdited};
 
        if (event.value) {

            _globalExchangeRateEdited.rate = event.value;

            //setInputGlobalExchangeRate (event.value);
            setGlobalExchangeRateEdited(_globalExchangeRateEdited);

            //await exchangeRateService.updateExchangeRate(_globalExchangeRateEdited);
            updateExchangeRate(_globalExchangeRateEdited);

        };
        
    };

    // to be usued only if exchange rate is defined individualy on each price list using newPriceList form
    const onInputExchangeRateChange = async (event) => {
        console.log ('# onInputExchangeRateChange #');

        const val = event.target.value;
        let _priceListEdited = { ...priceListEdited };
        let _priceListInsert = { ...priceListInsert }; // All value changed during creation are stored in this variable and finally used in savePriceList function
        let _priceListUpdate = { ...priceListUpdate }; // All value changed during update are stored in this variable and finally used in savePriceList function

        _priceListEdited.exchangeRate.id = val;
        (_priceListEdited.id) ? _priceListEdited.dateUpdated = Date.now() : _priceListEdited.dateCreated = Date.now(); // to be used during save fnctions

        if (_priceListEdited.id) {
            _priceListUpdate.exchangeRate.id = _priceListEdited.exchangeRate.id
            _priceListUpdate.dateUpdated = _priceListEdited.dateUpdated // time stamp of the update
            setPriceListUpdate(_priceListUpdate); //to capture just modifications to price list settings
        } else {
            _priceListInsert.exchangeRate.id = _priceListEdited.exchangeRate.id; //to capture just modifications to price list settings
             setPriceListInsert(_priceListInsert); //to capture just modifications to price list settings
        }

        setInputExchangeRate (val);
        setPriceListEdited(_priceListEdited);
    };

    // to be usued only if currenct is defined individualy on each product in the price list
    const onCurrencyDropDownChange = (event) => {
        console.log ('# onCurrencyDropDownChange #')
        
        const val =  event.target.value;
        let _priceListEdited = { ...priceListEdited };
        let _priceListInsert = { ...priceListInsert }; // All value changed during creation are stored in this variable and finally used in savePriceList function
        let _priceListUpdate = { ...priceListUpdate }; // All value changed during update are stored in this variable and finally used in savePriceList function
        
        _priceListEdited.currency = {id: val.id || 0, code: val.code || ''};
        (_priceListEdited.id) ? _priceListEdited.dateUpdated = Date.now() : _priceListEdited.dateCreated = Date.now(); // to be used during save fnctions

        if (_priceListEdited.id) {
            _priceListUpdate.currency = _priceListEdited.currency;
            _priceListUpdate.dateUpdated = _priceListEdited.dateUpdated // time stamp of the update
            setPriceListUpdate(_priceListUpdate); //to capture just modifications to price list settings
        } else {
            _priceListInsert.currency = _priceListEdited.currency; //to capture just modifications to price list settings
            setPriceListInsert(_priceListInsert); //to capture just modifications to price list settings
        }

        setSelectedCurrency (val);
        setPriceListEdited(_priceListEdited);
    };

    const onFocusSellPrice = (event) => {
        console.log ('# onFocusSellPrice #');

        event.target.select();
    };

    const onBlurSellPrice = () => {
        console.log ('# onBlurSellPrice #');

        let _priceListEdited = {...priceListEdited }

        setInputSellPrice (_priceListEdited);
    };

    const onChangeProductSellPriceEditor = (event, dataTableProps) => {
        console.log('# onChangeProductSellPriceEditor #');

        const val = (event.value) ? event.value : dataTableProps.rowData.sellPrice; //get sellPrice
        let _priceListEdited = { ...priceListEdited }
        let _priceListInsert = { ...priceListInsert }; // All value changed during creation are stored in this variable and finally used in savePriceList function
        let _priceListUpdate = { ...priceListUpdate }; // All value changed during update are stored in this variable and finally used in savePriceList function
        let _inputExchangeRate = { ...inputExchangeRate }; // needed to calculate netSellPrice
        //let index = -1; 
        let _priceListProductEdited = dataTableProps.rowData
 
        //console.log('val', val);
        console.log('dataTableProps ', dataTableProps);
        console.log ('_priceListEdited', _priceListEdited);
        console.log ('_priceListProductEdited', _priceListProductEdited);
        //console.log ('_priceListProductsUpdate', _priceListProductsUpdate);
        //console.log ('_priceListProductsInsert', _priceListProductsInsert);
        //console.log('_productId / _productPriceListId', _productId, '/', _productPriceListId);

        (_priceListEdited.id) ? _priceListEdited.dateUpdated = Date.now() : _priceListEdited.dateCreated = Date.now();
        _priceListProductEdited.sellPrice = val; // Sell price of product edited in UI gets updated
        _priceListProductEdited.netPrice = val * _inputExchangeRate.rate; // Net price of product edited in UI gets updated
        (_priceListProductEdited.productPriceListId) ? _priceListProductEdited.dateUpdated = Date.now() : _priceListProductEdited.dateCreated = Date.now();

        console.log ('_priceListProductEdited', _priceListProductEdited);

        if (_priceListEdited.id) { // if its an existing product it will have a productPriceListId, if not it is a new added product with productPeiceListId = null

            _priceListUpdate.id = _priceListEdited.id
            _priceListUpdate.dateUpdated = _priceListEdited.dateUpdated;
            
            //index = findPriceListProductIndexById(_priceListProductEdited.id, _priceListUpdate);
            const index = _priceListUpdate.priceListProducts.findIndex (_product => _product.id === _priceListProductEdited.id ); // finds if edited product was already edited an is already included in the _priceListProductsUpdate to do a new editing before inserting it into transactions table in the db
            if (index >= 0) { // If it was found, the index number should not be null o below zero
                _priceListUpdate.priceListProducts[index].sellPrice = _priceListProductEdited.sellPrice;
                _priceListUpdate.priceListProducts[index].netPrice = _priceListProductEdited.netPrice;
                _priceListUpdate.priceListProducts[index].dateUpdated = _priceListProductEdited.dateUpdated;
            } else { // If the first change during current edition, it will be added to the priceListProducts array in _priceListUpdate object
                _priceListUpdate.priceListProducts.push ( { id: _priceListProductEdited.id, productPriceListId: _priceListProductEdited.productPriceListId, sellPrice: _priceListProductEdited.sellPrice, netPrice: _priceListProductEdited.netPrice, dateUpdated: _priceListProductEdited.dateUpdated } );
            }
            setPriceListUpdate (_priceListUpdate);
        } else { // New added pricelist

            _priceListInsert.dateUpdated = _priceListEdited.dateUpdated;
            //index = findPriceListProductIndexById(_priceListProductEdited.id, _priceListInsert); 
            const index = _priceListInsert.priceListProducts.findIndex (_product => _product.id === _priceListProductEdited.id ); // finds new added product_id to update it during editing before inserting it into transactions table in the db
            if (index >= 0) {
                _priceListInsert.priceListProducts[index].sellPrice = _priceListProductEdited.sellPrice;
                _priceListInsert.priceListProducts[index].netPrice = _priceListProductEdited.netPrice;
                _priceListInsert.priceListProducts[index].dateCreated = _priceListProductEdited.dateCreated;
            } else {
                _priceListInsert.priceListProducts.push( { sellPrice: _priceListProductEdited.sellPrice, netPrice: _priceListProductEdited.netPrice, dateCreated: _priceListProductEdited.dateCreated } );
            }
            setPriceListInsert (_priceListInsert);

        }

        console.log ('_priceListInsert', _priceListInsert);
        console.log ('_priceListUpdate', _priceListUpdate);

        setInputSellPrice (val);
        setPriceListEdited (_priceListEdited); // Product edited in UI gets updated
    }

    const ProductSellPriceEditor = (dataTableProps) => {
        //return <InputNumber value={inputSellPrice} onValueChange={ (event) => onChangeProductSellPriceEditor (event, 'priceListProducts', 'sellPrice', dataTableProps)} mode="currency" currency="USD" locale="en-US" />
        if (dataTableProps.rowData.productPriceListId) { //If it has a productPriceListId is an existing product
            //return <InputNumber value={dataTableProps.rowData[`sellPrice`]}  onFocus={ () => onFocusSellPrice ('priceListProducts', 'id', 'sellPrice', dataTableProps)} onValueChange={ (event) => onChangeProductSellPriceEditor (event, 'priceListProducts', 'id', 'sellPrice', dataTableProps)} mode="currency" currency="ARS" locale="es-AR" placeholder ='0.00' />
            return <InputNumber value={dataTableProps.rowData.sellPrice}  onFocus={ (event) => onFocusSellPrice (event)} onChange={ (event) => onChangeProductSellPriceEditor (event, dataTableProps) } mode="currency" currency="ARS" locale="es-AR" placeholder ='0.00' disabled={false}/>
        }else { //If it has NOT a productPriceListId is a new product
            return <InputNumber value={dataTableProps.rowData.sellPrice}  onFocus={ (event) => onFocusSellPrice (event)} onChange={ (event) => onChangeProductSellPriceEditor (event, dataTableProps)} mode="currency" currency="ARS" locale="es-AR" placeholder ='0.00' disabled={false}/>
        }

    }


    //////////////////////////////////////
    // Buttons Functions
    //////////////////////////////////////

    const addAllPriceListProducts = () => { // Save new price list with all active products. Called from event function onInputCodeChange
        console.log ('# addAllPriceListProducts #');

        let _priceListEdited = {...priceListEdited};
        let _priceListInsert = {...priceListInsert};
        let _productsSource = [...productsSource];
        let _productsTarget = [...productsTarget];

        //console.log ('_priceListEdited', _priceListEdited);
        //console.log ('_productsSource', _productsSource);
        //console.log ('_priceListInsert', _priceListInsert); 

        _productsTarget = JSON.parse( JSON.stringify (_productsSource) ); // Use assigment to add products because no selection made (should use addPriceListProducts or pick list if selection required). All existing products are added.

        _priceListEdited.priceListProducts = JSON.parse( JSON.stringify (_productsTarget) ); //Assigns selected products to the list

        _priceListInsert = JSON.parse( JSON.stringify (_priceListEdited) ); //Deep copy. Only on new price list (insert) all props are copied.

        console.log ('_priceListEdited: ', _priceListEdited);

        _priceListInsert.dateCreated = Date.now(); // created timestamp
        _priceListInsert.priceListProducts.forEach ( (_productEdited) => {
            //console.log ('_productEdited', _productEdited);
            _productEdited.dateCreated = Date.now(); // created timestamp for first time product is addedd
        });

        console.log ('_priceListInsert: ', _priceListInsert);

        setPriceListEdited (_priceListEdited);
        setPriceListInsert (_priceListInsert)
    };

    // Function to add products to Price List. UI changes are made on priceListEdited object and
    // only changes and new data are copied to priceListProductsInsert to be persisted (impacting linkProductPriceList table in db)
    const addSelectedProducts = () => { // Add selected products from list of available products
        console.log ('# addSelectedProducts #');

        let _priceListEdited = { ...priceListEdited }; // Shallow copy to reference array
        let _priceListInsert = {}; // Use insert object because is a savePriceListProducts Insert operation inside function
        let _productsTarget = [...productsTarget];
        let _selectedPriceListProducts = [...selectedPriceListProducts]; // Shallow copy to reference array

        //setAddProductClicked (true);

        //console.log ('_priceListEdited', _priceListEdited);
        //console.log ('_priceListProductsInsert', _priceListProductsInsert); 
        //console.log ('_productsTarget', _productsTarget);
        //console.log ('_selectedPriceListProducts', _selectedPriceListProducts);

        _productsTarget = _selectedPriceListProducts;
        _priceListEdited.priceListProducts = _priceListEdited.priceListProducts.concat ( _productsTarget.filter ( (prod) => _priceListEdited.priceListProducts.indexOf (prod) < 0 ) ) // This is done to avoid duplicates after concat already added with new added before hit ok button

        _priceListInsert.id = _priceListEdited.id
        _priceListInsert.dateUpdated = Date.now();
        _priceListInsert.priceListProducts = JSON.parse( JSON.stringify (_productsTarget) );
        _priceListInsert.priceListProducts.forEach ( (_prodEdited) => {
            //console.log ('_prodEdited', _prodEdited)
            _prodEdited.dateCreated = Date.now(); // timestamp updated
        });

        console.log ('_priceListEdited', _priceListEdited);
        console.log ('_priceListInsert', _priceListInsert);
        console.log ('_productsTarget', _productsTarget);

        setPriceListEdited (_priceListEdited);
        setPriceListInsert (_priceListInsert)
        setProductsTarget (_productsTarget);
        setProductsSource([]);
        setSelectedPriceListProducts ([]);
        setAddPriceListProductsDialog(false);
    };

    // Function to remove products from Price List. UI changes are made on priceListEdited object and
    // only changes and new data are copied to priceListProductsInsert to be persisted (impacting linkProductPriceList table in db)
    const OLDremoveSelectedProducts = () => { // Removes selected products from the edited price list
        console.log ('# removeSelectedProducts #');

        let _priceListEdited = { ...priceListEdited }; // Shallow copy to reference array
        let _priceListInsert = { ...priceListInsert }; // Shallow copy to reference array
        let _priceListUpdate = { ...priceListUpdate }; // Shallow copy to reference array
        let _productsSource = [...productsSource]; // Shallow copy to reference array
        let _productsTarget = [...productsTarget];
        let _selectedPriceListProducts = [...selectedPriceListProducts]; // Shallow copy to reference array

        //setRemoveProductClicked(true);

        //console.log ('_priceListEdited', _priceListEdited);
        console.log ('_priceListInsert', _priceListInsert);
        console.log ('_priceListUpdate', _priceListUpdate);
        //console.log ('_productsSource', _productsSource);
        //console.log ('_productsTarget', _productsTarget);
        //console.log ('_selectedPriceListProducts', _selectedPriceListProducts);

        _productsSource = _productsSource.filter ( (prod) => !_selectedPriceListProducts.includes (prod) ); // UI: Filter selected prododucts tu update UI (remove them from datatable component)
        _priceListEdited.priceListProducts = _productsSource; // UI: Updates products list in UI removing the selected ones for the edited price list

        _productsTarget = _selectedPriceListProducts
        _productsTarget = _productsTarget.filter ( (prod) =>  (prod.productPriceListId) ? true : false ); // Persist Data: Filters unexisting (dont have productSaleOrderId) selected products marked for removal from target list (wont be included in _priceListUpdate.priceListProducts)
        _priceListInsert.priceListProducts = _priceListInsert.priceListProducts.filter ( (prod) => !_selectedPriceListProducts.includes (prod) ); // Persist data: Filter selected products marked for removal (can be just added or existing) from target list (wont be included in _priceListUpdate.priceListProducts)

        _priceListUpdate.id = _priceListEdited.id; // Persist data: sets price list id to be undated in the db (required by priceListProducts DTO function)
        _priceListUpdate.priceListProducts = _priceListUpdate.priceListProducts.concat (_productsTarget); // Persist data: sets the list of products to be removed from the edited price list in linkProductPriceList table
        _priceListUpdate.priceListProducts.forEach ( (_prodEdited) => {
            //console.log ('prod.productPriceListId', prod.productPriceListId)
                _prodEdited.dateDeleted = Date.now();
        })

        console.log ('_priceListEdited', _priceListEdited);
        console.log ('_productsSource', _productsSource);
        console.log ('_productsTarget', _productsTarget);
        console.log ('_priceListInsert', _priceListInsert);
        console.log ('_priceListUpdate', _priceListUpdate);

        setPriceListEdited (_priceListEdited);
        setPriceListInsert (_priceListInsert);
        setPriceListUpdate (_priceListUpdate);
        setProductsTarget (_productsTarget);
        setProductsSource ([]);
        setSelectedPriceListProducts ([]);
        setRemovePriceListProductsDialog (false);
    };

    const removeSelectedProducts = () => { // Removes selected products from the edited price list
        console.log ('# removeSelectedProducts #');

        let _priceListEdited = { ...priceListEdited }; // Shallow copy to reference object
        let _priceListInsert = { ...priceListInsert }; // Shallow copy to reference object
        let _priceListUpdate = { ...priceListUpdate }; // Shallow copy to reference object
        let _productsSource = [...productsSource]; // Shallow copy to reference array
        let _productsTarget = [...productsTarget];
        let _selectedPriceListProducts = [...selectedPriceListProducts]; // Shallow copy to reference array

        //console.log ('_priceListEdited', _priceListEdited);
        console.log ('_priceListInsert', _priceListInsert);
        console.log ('_priceListUpdate', _priceListUpdate);
        //console.log ('_productsSource', _productsSource);
        //console.log ('_productsTarget', _productsTarget);
        //console.log ('_selectedPriceListProducts', _selectedPriceListProducts);

        _priceListEdited.priceListProducts = _priceListEdited.priceListProducts.filter ( (prod) => !_selectedPriceListProducts.includes (prod) ); // UI: Filter selected prododucts tu update UI (remove them from datatable component)

        if (_priceListInsert.priceListProducts.length > 0){
            _priceListInsert.priceListProducts = _priceListInsert.priceListProducts.filter ( (prod) => !_selectedPriceListProducts.includes (prod) ); // Persist data: Filter selected products marked for removal (just added during addProducts operation) from target list (wont be included in _priceListInsert.priceListProducts)
        }

        //_productsTarget = _selectedPriceListProducts
        _productsTarget = _selectedPriceListProducts.filter ( (prod) =>  (prod.productPriceListId) ? true : false ); // Persist Data: Filters unexisting (dont have productSaleOrderId) selected products marked for removal from target list (wont be included in _priceListUpdate.priceListProducts)

        _priceListUpdate.id = _priceListEdited.id; // Persist data: sets price list id to be undated in the db (required by priceListProducts DTO function)
        _priceListUpdate.priceListProducts = _priceListUpdate.priceListProducts.concat (_productsTarget); // Persist data: sets the list of products to be removed from the edited price list in linkProductPriceList table
        _priceListUpdate.priceListProducts.forEach ( (_prodEdited) => {
            //console.log ('prod.productPriceListId', prod.productPriceListId)
            _prodEdited.dateDeleted = Date.now();
        })

        console.log ('_priceListEdited', _priceListEdited);
        //console.log ('_productsSource', _productsSource);
        console.log ('_productsTarget', _productsTarget);
        console.log ('_priceListInsert', _priceListInsert);
        console.log ('_priceListUpdate', _priceListUpdate);

        setPriceListEdited (_priceListEdited);
        setPriceListInsert (_priceListInsert);
        setPriceListUpdate (_priceListUpdate);
        setProductsTarget (_productsTarget);
        setProductsSource ([]);
        setSelectedPriceListProducts ([]);
        setRemovePriceListProductsDialog (false);
    };

    const deleteSelectedPriceLists = async () => {
        console.log ('# deleteSelectedPriceLists #');

        let _priceLists = [...pricesLists];
        let _selectedPriceLists = [...selectedPriceLists];
        let _priceListUpdate = {};

        _priceLists = _priceLists.filter( pl => !_selectedPriceLists.includes (pl) ); // Updates UI removing selected products from datatable component list
        setPricesLists(_priceLists);

        //console.log ('pricesLists:', _priceLists );
        console.log ('selectedPriceLists:', _selectedPriceLists );

        _selectedPriceLists.forEach ( async (_priceListEdited) => {
            //console.log(' _selectedPriceLists _priceListEdited: ',_priceListEdited);
            _priceListUpdate.id = _priceListEdited.id; // sets the Price list object id to be deleted from tblPriceList table
            _priceListUpdate.dateDeleted = Date.now(); // sets the timestamp of the control field of the price list object for logical delete

            // console.log('_priceListEdited: ', _priceListEdited);
            // console.log('_priceListEdited.priceListProducts: ', _priceListEdited.priceListProducts);

            if (_priceListEdited.priceListProducts.length > 0) { // If price list has products

                _priceListUpdate.priceListProducts = _priceListEdited.priceListProducts; // copy all product list to be deleted

                _priceListUpdate.priceListProducts.forEach( (_prodEdited) => {
                    _prodEdited.dateDeleted = Date.now(); // sets the control field to do the logical delete in linkProductPriceList table
                });
            } else {
                _priceListUpdate.priceListProducts = [];
            }

            updateEmployeePriceList (_priceListEdited)
            //console.log('_priceListUpdate: ', _priceListUpdate);
            savePriceListProducts (null, _priceListUpdate) //because it is a button (event driven object) if no parameter is passed during function call the event info will be passed instead by default
        });

        setSelectedPriceLists([]);
        setDeleteSelectedPriceListsDialog(false);
    };


    ////////////////////////////////////
    // Persist Data Functions
    ////////////////////////////////////

    // Save functions are required to persist new / modified data into databases

    const savePriceList = async () => {
        console.log ('# savePriceList #');

        let _pricesLists = [...pricesLists];
        let _priceListEdited = {...priceListEdited};
        let _priceListInsert = {...priceListInsert}; //Will contain new added price list with all active existing product (just for creation operation)
        let _priceListUpdate = {...priceListUpdate}; //Will contain price list updated values except product list

        console.log ('_priceListEdited: ', _priceListEdited);
        console.log ('_priceListInsert', _priceListInsert);
        console.log ('_priceListUpdate', _priceListUpdate);

        if ( (inputCode !== null) && (inputCode.trim()) && (inputName !== null) && (inputName.trim()) ) {

            // UI update
            if (_priceListEdited.id) { // if price list is not new

                //const index = findPriceListsIndexById(_priceListEdited.id);
                const index = _pricesLists.findIndex (_priceList => _priceList.id === _priceListEdited.id );
                _pricesLists[index] = _priceListEdited;
                setPricesLists(_pricesLists);

            } else {  // No need to insert in UI to update it, because the data table in UI will be reloaded from DB after the insert.
                /*
                _priceListEdited.dateCreated = Date.now(); // created timestamp
                _priceListEdited.dateUpdated = 0; // updated timestamp
                _priceListEdited.dateDeleted = 0; // updated timestamp

                if ( _priceListEdited.priceListProducts.length > 0 ) {
                    _priceListEdited.priceListProducts.forEach ( (prod) => {
                        //console.log ('prod', prod)
                        prod.dateCreated = Date.now(); //timestamp updated
                        prod.dateUpdated = 0; //timestamp updated
                        prod.dateDeleted = 0; //timestamp updated
                    });
                }
                _pricesLists.push (_priceListEdited);
                setPricesLists(_pricesLists);
                */
            }

            // DB Insert
            if ( isNotEmpty(_priceListInsert) ) {
                console.log ('_priceListInsert: ', _priceListInsert );

                _priceListInsert.id = await putPriceList(_priceListInsert); //before insert on tblProductPriceList table, create a new price list in tblPriceList table and return ID created

                if ( _priceListInsert.priceListProducts.length > 0 ) {
                    await putProductPriceList (_priceListInsert); // Adds all active products from product table into the new price list and insert into tblProductPriceList 
                };
            };

            // DB Update / Delete
            if ( isNotEmpty(_priceListUpdate) ) { 
                console.log ('_priceListUpdate: ', _priceListUpdate );

                _priceListUpdate.id = _priceListEdited.id;

                if (_priceListUpdate.dateUpdated) { // checks if its an update operation
                    await updatePriceList (_priceListUpdate, 'update'); //updates table tblPriceList with the price list object info
                } else if (_priceListUpdate.dateDeleted) { // checks if its a soft delete operation
                    await updatePriceList (_priceListUpdate, 'delete'); //updates table tblPriceList (for logical delete) with the price list object info
                }

            };
        };

        fetchPriceListData(); // Fetching after undating database I ensure new values are the ones currently being displayed in UI
        setPriceListEdited (_priceListEdited);
        setInsertNewPriceListDialog(false);
        setUpdatePriceListSettingsDialog (false);
    };

    const savePriceListProducts = async (event, _priceList) => { //because it is a button (event driven object) if no parameter is passed during function call the event info will be passed instead by default 
        console.log ('# savePriceListProducts #');

        let _pricesLists = [...pricesLists];
        let _priceListEdited = { ...priceListEdited };
        let _priceListInsert = { ...priceListInsert }; // Will contain new added products to the pricelist
        let _priceListUpdate = {};
        (_priceList) ? _priceListUpdate = { ..._priceList } : _priceListUpdate = { ...priceListUpdate }; // Will contain 

        console.log ('_pricesLists: ', _pricesLists )
        console.log ('_priceListEdited: ', _priceListEdited )

        // Updates UI
        //const index = findPriceListsIndexById(_priceListEdited.id);
        const index = _pricesLists.findIndex (_priceList => _priceList.id === _priceListEdited.id );
        _pricesLists[index] = _priceListEdited;// UI: refresh componenet with updated price list
        setPricesLists(_pricesLists);

        // DB Insert PriceList Products
        if ( isNotEmpty(_priceListInsert) ) {
            console.log ('_priceListInsert: ', _priceListInsert );

            if ( _priceListInsert.priceListProducts.length > 0 ) {
                await updatePriceList (_priceListInsert, 'update'); //updates table tblPriceList with the price list object info
                await putProductPriceList (_priceListInsert); // DTO requires that the price list object only contains added porducts on productList prop
            };
        };

        // DB Update / Delete PriceList Products
        if ( isNotEmpty(_priceListUpdate) ) { // Checks if there is a Price List update (object won be empty to be a true statement)
            console.log ('_priceListUpdate: ', _priceListUpdate );

            if (_priceListUpdate.dateUpdated) { // checks if its an update operation
                await updatePriceList (_priceListUpdate, 'update'); //updates table tblPriceList with the price list object info
            } else if (_priceListUpdate.dateDeleted) { // checks if its a soft delete operation
                await updatePriceList (_priceListUpdate, 'delete'); //updates table tblPriceList with the price list object info
            }

            if ( _priceListUpdate.priceListProducts.length > 0 ) { // IF has products

                if (_priceListUpdate.priceListProducts[0].dateUpdated) { // checks first element to know if its an update operation type
                    await updateProductPriceList(_priceListUpdate, 'update'); // DTO requires that the list object only contains removed porducts on productList prop
                } else if (_priceListUpdate.priceListProducts[0].dateDeleted) { // checks first element to know if its a delete operation type
                    await updateProductPriceList(_priceListUpdate, 'delete'); // DTO requires that the list object only contains removed porducts on productList prop
                }

            }
        };

        fetchPriceListData();

        setProductsSource ([]); // Clear product source array
        setProductsTarget ([]); // Clear product target array
        setPriceListInsert ({});
        setPriceListUpdate ({});
        setAddProductClicked(false);
        setRemoveProductClicked(false);
        setUpdatePriceListProductsDialog (false)
    };

    const deletePriceList = async () => {  // Is called when trash can is clicked
        console.log ('# deletePriceList #');

        let _pricesLists = [...pricesLists];
        let _priceListEdited = {...priceListEdited};
        //let _priceListSettingsUpdate = {...priceListSettingsUpdate}
        let _priceListUpdate = {}

        //console.log('deletePriceList _priceListEdited', _priceListEdited);

        _priceListEdited.dateDeleted = Date.now();

        _pricesLists = _pricesLists.filter (pl => pl.id !== _priceListEdited.id);
        setPricesLists(_pricesLists);

        _priceListUpdate.id = _priceListEdited.id;
        _priceListUpdate.dateDeleted = _priceListEdited.dateDeleted //logical delete
        //_priceListProductsUpdate.id = _priceListEdited.id;

        if (_priceListEdited.priceListProducts.length > 0){

            _priceListUpdate.priceListProducts = _priceListEdited.priceListProducts

            _priceListUpdate.priceListProducts.forEach( (prod) => {
                //prod.dateUpdated = Date.now(); //timestamp updated
                prod.dateDeleted = Date.now(); //logical delete
            });

            //await productPriceListService.updateProductPriceList(_priceListProductsUpdate) //update persistent data source.
            //toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Lista de Precio Borrada', life: 3000 });
            await updateProductPriceList(_priceListUpdate, 'delete') // first updates (marked for deletiom) products in price list
        };

        //await priceListService.updatePriceList (_priceListUpdate) //update persistent data source.
        //toast.current.show({ severity: 'success', summary: 'Perfecto !', detail: 'Lista de Precio Borrada', life: 3000 });
        await updatePriceList (_priceListUpdate, 'delete') // After products updated (marked for deletn) delete price list

        updateEmployeePriceList(_priceListEdited)

        setDeletePriceListDialog(false);
    };

    const deletePriceListProduct = async () => { // Is called when trash can icon is clicked. Not in use (action must be added to actionBodyTemplate)

        let _priceListEdited = {...priceListEdited};
        let _priceListProductEdited = {...priceListProductEdited};
        //let _priceListProductsUpdate = {...priceListProductsUpdate};
        let _priceListUpdate = {...priceListUpdate};

        _priceListProductEdited.dateDeleted = Date.now(); //logical delete

        _priceListEdited.priceListProducts = _priceListEdited.priceListProducts.filter( prod => prod.dateDeleted !== 0 );

        setPriceListProductList(_priceListEdited.priceListProducts);

        await updateProductPriceList (_priceListUpdate, 'delete'); // set updated list in database

        setDeletePriceListDialog(false);
    }

    const updateEmployeePriceList = async (_priceList) => { // Updates employee's price list when proce list is deleted

        let _employeeList = [ ...employeeList ];
        let _employeeEdited = {...emptyEmployee};
        let _employeeUpdated = {};

        _employeeList.forEach ( (_employee) => {
            if (_employee.priceList.id === _priceList.id) {
                _employeeEdited = _employee
                _employeeEdited.priceList.id = 1; // Sets default pricelist because current one is being deleted
            }
        })

        _employeeUpdated.id = _employeeEdited.id;
        _employeeUpdated.priceList = { id: _employeeEdited.priceList.id };
        _employeeUpdated.dateUpdated = Date.now(); // updated timestamp

        //await employeeService.updateEmployee(_employeeUpdated); //updates existing
        //toast.current.show({ severity: 'success', summary: 'Perfecto !', detail: 'Empleado Actualizado', life: 3000 });
        await updateEmployee(_employeeUpdated); //updates existing
        
    }

/*
    const saveNewPriceList = async () => {
        console.log ('# saveNewPriceList #');

        let _priceListEdited = {...priceListEdited};
        let _priceListSettingsInsert = {...priceListSettingsInsert};
        let _productsSource = [...productsSource];
        let _productsTarget = [...productsTarget];
        //setSubmitted(true); // used for input control in form, not in use

        if ( (inputCode != null) && (inputCode.trim()) && (inputName != null) && (inputName.trim()) ) {

            _priceListEdited.dateCreated = Date.now(); // created timestamp
            _priceListEdited.dateUpdated = 0; // updated timestamp
            _priceListEdited.dateDeleted = 0; // updated timestamp

            _priceListSettingsInsert = JSON.parse( JSON.stringify (_priceListEdited) ); //Deep copy. Only on new price list (insert) all props are copied.
            
            _productsTarget = JSON.parse( JSON.stringify (_productsSource) ); // Use assigment to add price list products because no selection made (should use addPriceListProducts or pick list if selection required). All existing products added.
         
            _priceListEdited.priceListProducts = JSON.parse( JSON.stringify (_productsTarget) ); //Assigns selected products to the list

            //console.log ('_priceListEdited: ', _priceListEdited);

            if (_priceListEdited.priceListProducts.length > 0){
                //console.log ('priceListEdited.priceListProducts: ',priceListEdited.priceListProducts)
                //saveNewPriceListProducts(_priceListEdited); //Uncomment to use when this function is active.
            } else {
                //await priceListService.putPriceList(_priceListSettingsInsert); //before insert on tblProductPriceList table, create a new price list in tblPriceList table and return ID created
                //toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Nueva Lista Creada', life: 3000 });
                await putPriceList (_priceListSettingsInsert); //before insert on tblProductPriceList table, create a new price list in tblPriceList table and return ID created

                fetchPriceListData();
                setPriceListEdited (_priceListEdited);
                setInsertNewPriceListDialog(false);
            }

            console.log ('_priceListEdited: ', _priceListEdited);

        };
        
        setPriceListSettingsInsert (JSON.parse( JSON.stringify (emptyPriceListSettingsInsert)));
    };

    const saveNewPriceListProducts = async (_priceList) => { // creates price list and adds initial products
        console.log ('# saveNewPriceListProducts #');

        //let _priceList = {...priceListEdited};
        let _priceListProductsInsert = {...priceListProductsInsert};

        //console.log ('_priceList: ', _priceList);
        //console.log('_priceListProductsInsert', _priceListProductsInsert);

        _priceListProductsInsert = JSON.parse( JSON.stringify (_priceList) ); //Deep copy. Only on new price list insert, all props are copied.

        //console.log('_priceListProductsInsert', _priceListProductsInsert);

        _priceListProductsInsert.priceListProducts.forEach ( (prod) => {
            //prod.sellPriceCurrency.id = _priceListProductsInsert.currency.id;
            //prod.netPriceCurrency.id = emptyCurrency.id; // _priceListProductsInsert.currency.id change to this to use same currency as sell price.
            prod.dateCreated = Date.now(); // created timestamp for first time product is addedd
            prod.dateUpdated = 0; // updated timestamp each time product is updated in list
            prod.dateDeleted = 0; // updated timestamp 0 when product is adedd and active.
            //console.log ('prod', prod);
        });
        
        //_priceListProductsInsert.id = await priceListService.putPriceList(_priceListProductsInsert); //before insert on tblProductPriceList table, create a new price list in tblPriceList table and return ID created
        _priceListProductsInsert.id = await putPriceList(_priceListProductsInsert); //before insert on tblProductPriceList table, create a new price list in tblPriceList table and return ID created

        console.log('_priceListProductsInsert', _priceListProductsInsert);

        //await productPriceListService.putProductPriceList(_priceListProductsInsert); //create new productPriceList relation using created ID in previous step
        //toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Nueva Lista Creada', life: 3000 });
        await putProductPriceList (_priceListProductsInsert); //create new productPriceList relation using created ID in previous step

        setPriceListEdited (_priceListProductsInsert);
        setProductsSource ([]);

        setInsertNewPriceListDialog(false);  

        fetchPriceListData();

    };

    const saveEditPriceListSettings = async () => {
        console.log ('# saveEditPriceListSettings #');
 
        //setSubmitted(true); // used for input control in form, not in use

        let _pricesLists = [...pricesLists];
        let _priceListEdited = {...priceListEdited};
        let _priceListSettingsUpdate = {...priceListSettingsUpdate};
        //let _priceListProductsUpdate = {...priceListProductsUpdate};

        // Updates UI
        //const index = findPriceListsIndexById(_priceListEdited.id);
        const index = _pricesLists.findIndex (_priceList => _priceList.id === _priceListEdited.id );
        _pricesLists[index] = _priceListEdited;
        setPricesLists(_pricesLists);

        // Prepare for Add or Update persistent data.
        _priceListSettingsUpdate.id = _priceListEdited.id; // updated timestamp
        _priceListSettingsUpdate.modifiedDate = Date.now(); // updated timestamp
        _priceListSettingsUpdate.dateUpdated = Date.now(); // updated timestamp

        //await priceListService.updatePriceList(_priceListSettingsUpdate); //updates existing
        //toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Lista de Precios Actualizada', life: 3000 });
        await updatePriceList (_priceListSettingsUpdate, 'update'); //updates existing

        fetchPriceListData();

        setUpdatePriceListSettingsDialog (false);
        //setUpdatePriceListProductsDialog (false)
        //setAddPriceListProductsDialog (false);
        
    };

    const deleteSelectedPriceLists = () => {
        console.log ('# deleteSelectedPriceLists #');

        let _priceLists = [...pricesLists];
        let _selectedPriceLists = [...selectedPriceLists];
        //let _priceListSettingsUpdate = {...priceListSettingsUpdate};
        let _priceListProductsUpdate = {...priceListProductsUpdate};

        _priceLists = _priceLists.filter( pl => !_selectedPriceLists.includes(pl) );
        setPricesLists(_priceLists);

        //console.log ('pricesLists:', _priceLists );
        //console.log ('selectedPriceLists:', _selectedPriceLists );

        _selectedPriceLists.forEach ( async (pl) => {
            //console.log(' _selectedPriceLists pl: ',pl);
            //pl.dateUpdated = Date.now(); //timestamp updated
            //pl.dateDeleted = Date.now(); // logical delte
            //console.log('_selectedPriceLists pl: ',pl);
            _priceListProductsUpdate.id = pl.id; //timestamp updated
            //_priceListSettingsUpdate.dateUpdated = Date.now(); //timestamp updated
            _priceListProductsUpdate.dateDeleted = Date.now(); // logical delete

            console.log('pl.priceListProducts: ', pl.priceListProducts);

            if (pl.priceListProducts.length > 0) {

                _priceListProductsUpdate.priceListProducts = pl.priceListProducts;

                _priceListProductsUpdate.priceListProducts.forEach( (prod) => {
                    //prod.dateUpdated = Date.now(); //timestamp updated
                    prod.dateDeleted = Date.now(); //logical delete
                });

                //await productPriceListService.updateProductPriceList (_priceListProductsUpdate); // set updated list in database
                //toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Lista de Precios Borrada', life: 3000 });
                await updateProductPriceList (_priceListProductsUpdate, 'delete'); // set updated list in database
            }else{

            };
            //await priceListService.updatePriceList(_priceListSettingsUpdate);
            //toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Listas de Precios Borradas', life: 3000 });
            await updatePriceList (_priceListProductsUpdate, 'delete');
        });

        setSelectedPriceLists([]);
        setDeleteSelectedPriceListsDialog(false);
    };
    */

    /////////////////////////
    // Supporting Functions
    /////////////////////////

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

    const findPriceListsIndexById = (id) => {

        let _priceLists = [...pricesLists];

        let index = -1;
        for (let i = 0; i < _priceLists.length; i++) {
            if (_priceLists[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    const findPriceListProductIndexById = (_productId, _priceList) => {
        console.log('# findPriceListProductIndexById #');

        //console.log('_priceList', _priceList);

        let index = -1;
        for (let i = 0; i < _priceList.priceListProducts.length; i++) {
            if (_priceList.priceListProducts[i].id === _productId) {
                index = i;
                break;
            }
        }
        //console.log('index', index);
        return index;
    }
   
 
    /////////////////////////////////////////////////////
    // Dialogs and DataTables Display Formating Functions
    /////////////////////////////////////////////////////

    const formatCurrency = (value) => {
        //console.log('formatCurrency', value);
        return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS'}); //cambiar símbolo 'USD' por variable y Locale 'en-US' por variable
    }

    const exchangeRateBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="exchangeCurrency-text">{`${rowData.currency.code} `}</span>
                <span className="exchangeRate-text">{formatCurrency(rowData.exchangeRate.rate)}</span>
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

    const dollarLinkedBodyTemplate = (rowData) => {

        if (rowData.dollarLinked) {
            return (
                <React.Fragment>
                    <span className="p-column-value">Si</span>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <span className="p-column-value">No</span>
                </React.Fragment>
            );
        }
    }

    const imageBodyTemplate = (rowData) => {
        return <img src={`assets/demo/images/product/${rowData.image}`} onError={(e) => e.target.src = 'assets/layout/images/avatar_4.png'} alt={rowData.image} className="priceList-image" />
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-2" tooltip= 'Ver' onClick={() => openViewPriceListDialog(rowData)} />
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-2" tooltip= 'Editar' onClick={() => openEditPriceListProductsDialog(rowData)} />
                {/* <Button icon="pi pi-cog" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-2" tooltip= 'Configurar' onClick={() => openUpdatePriceListSettingsDialog(rowData)} /> */}
                {/* <Button icon="pi pi-trash p-c" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only" tooltip= 'Borrar' onClick={() => openDeletePriceListDialog(rowData)} /> */}
            </React.Fragment>
        );
    }

    const editPriceListProductBodyTemplate = (rowData) => {
        return (
           <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-2" onClick={() => openUpdatePriceListSettingsDialog(rowData)} />
                <Button icon="pi pi-times p-c" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only" onClick={() => openDeletePriceListProductDialog(rowData)} />
            </React.Fragment>
        );
    }

    const productsItemTemplate = (item) => {
        return (
            <div className="product-item">

                <div className="product-list-detail">
                    <h5 className="p-mb-2">{item.code}</h5>
                    <i className="pi pi-tag product-category-icon"></i>
                    <span className="product-category">{item.category}</span>
                </div>

                <div className="product-list-detail">
                    <h5 className="p-mb-2">{item.manufacturer}</h5>
                    <span className="product-manufacturer">{item.model}</span>
                </div>

                <div className="product-list-action">
                    <h6 className="p-mb-2"> {item.purchasePriceCurrency.code} ${item.unitPurchasePrice}</h6>
                    <span className={`product-badge status-${item.inventoryStatus.name.toLowerCase()}`}>{item.inventoryStatus.name}</span>
                </div>

            </div>
        );
    }

    const unitPurchasePriceBodyTemplate = (rowData) => {
        //console.log('rowData',rowData)
        return (
            <React.Fragment>
                <span className="price-text">{`${rowData.purchasePriceCurrency.code} `}</span>
                <span className="price-text">{formatCurrency(rowData.unitPurchasePrice)}</span>
            </React.Fragment>
        );
    }

    const sellPriceBodyTemplate = (rowData) => {
        //console.log('sellPriceBodyTemplate rowData',rowData)
        return (
            <React.Fragment>
                {/* <span className="price-text">{` ${rowData.sellPriceCurrency.code} `}</span>  */}
                <span className="price-text">{ `${priceListEdited.currency.code}` }</span>
                <span className="price-text">{ formatCurrency (rowData.sellPrice) }</span>
            </React.Fragment>
        );
    }

    const netPriceBodyTemplate = (rowData) => {
        //console.log('netPriceBodyTemplate rowData',rowData)
        return (
            <React.Fragment>
               {/* <span className="price-text">{` ${rowData.netPriceCurrency.code} `}</span> */}
                <span className="price-text">{ `${priceListEdited.currency.code}` }</span>
                {/* <span className="price-text">{ formatCurrency ( rowData.netPrice ) }</span> */}
                <span className="price-text">{ formatCurrency (rowData.sellPrice * inputExchangeRate.rate) }</span>
            </React.Fragment>
        );
        return (
            <React.Fragment>
                <span className="price-text">{`ARS`}</span> 
                <span className="price-text">{formatCurrency(rowData.sellPrice * inputExchangeRate.rate)}</span>
            </React.Fragment>
        );
    }

    const statusBodyTemplate = (rowData) => {
        return <span className={`product-badge status-${rowData.inventoryStatus.name.toLowerCase()}`}>{rowData.inventoryStatus.name}</span>;
    }

    // Displays code prop of the currency object when diplaying drop down option in UI. It doesnt change valuo on price list
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


    /////////////////////////
    // Toolbar Functions
    /////////////////////////


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="" icon="pi pi-plus" className="p-button-secondary p-button-raised p-mr-2" tooltip='Nueva' onClick={openInsertNewPriceListDialog} />
                <Button label="" icon="pi pi-minus" className="p-button-warning p-button-raised" tooltip='Eliminar' onClick={openDeleteSelectedPriceListsDialog} disabled={!selectedPriceLists || !selectedPriceLists.length} />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            
            <React.Fragment>

                <span className="p-inputgroup-addon"> Cotización Dolar (USD) </span>
                {<InputNumber id="exchangeRateInput" value={globalExchangeRateEdited.rate}   
                        onFocus= { (event) => onFocusEditGlobalExchangeRate(event) } 
                        onChange= { (event) => { onChangeInputGlobalExchangeRate (event) } }
                        //onBlur= {  onBlurEditGlobalExchangeRate }
                        mode="currency" currency="ARS"  maxFractionDigits={2} min={0}
                        placeholder='0.00' /> }

                {/*
                <label> 
                    Cotización Dolar (USD) = <InputNumber id="exchangeRateInput" value={globalExchangeRateEdited.rate}   
                                                onFocus= { (event) => onFocusEditGlobalExchangeRate (event) } 
                                                onChange= { (event) => { onChangeInputGlobalExchangeRate (event) } }
                                                //onBlur= {  onBlurEditGlobalExchangeRate }
                                                mode="currency" currency="ARS" maxFractionDigits={2} min={0} locale="es-AR" 
                                                currencyDisplay="code" placeholder='0.00' disabled={false} />
                </label>
                */}
           </React.Fragment>

        )
    }

    const priceListProductsLeftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="" icon="pi pi-plus" className="p-button-secondary p-button-raised p-mr-2" onClick={openAddSelectedProductsDialog} tooltip = 'Agregar Productos' disabled={removeProductClicked} />
                <Button label="" icon="pi pi-minus" className="p-button-warning p-button-raised" onClick={removeSelectedProducts} tooltip = 'Quitar Productos' disabled={addProductClicked || (selectedPriceListProducts.length === 0)} />
            </React.Fragment>
        )
    }

    const priceListProductsRightToolbarTemplate = () => {
        return (
            
            <React.Fragment>
            {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Importar" chooseLabel="Importar" className="p-mr-2 p-d-inline-block" />
                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
           */}            
           </React.Fragment>

        )
    }

    //////////////////////////////
    // Headers Functions
    //////////////////////////////

    const renderHeader = (name) => {
        return (
            <div className="window-header">
                <div> {name} </div>
            </div>
        );
    }
     
    const headerProductPriceLists = (
        <div className="table-header">
            <h5 className="p-m-0"> Listas de Precios </h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(event) => setGlobalFilter(event.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const headerEditPriceListProducts = (
        <div className="table-header">
            <h5 className="p-m-0"> Lista de Productos </h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(event) => setGlobalFilter(event.target.value)} placeholder="Buscar..." className="p-m-0" />
            </span>
        </div>
    );

    const headerViewPriceListProducts = (
        <div className="table-header">
            <h5 className="p-m-0"> Lista de Productos </h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(event) => setGlobalFilter(event.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    //////////////////////////////
    // Footers Functions
    //////////////////////////////

    /*
    const newPriceListDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={openAddNewPriceListDialog} disabled={ !inputCode || invalidInputCode || !inputName } /> 
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideInsertNewPriceListDialog} />
        </React.Fragment>
    );

    const editPriceListSettingsDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={savePriceList} disabled={ !inputCode || invalidInputCode || !inputName }/> 
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideUpdatePriceListSettingsDialog} />
        </React.Fragment>
    );
  */

    const viewPriceListDialogFooter = (
        <React.Fragment>
            <Button label="Cerrar" icon="pi pi-times" className="p-button-text" onClick={hideViewPriceListDialog} />
        </React.Fragment>
    );
    const newPriceListDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={savePriceList} disabled={ !inputCode || invalidInputCode || !inputName } /> 
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideInsertNewPriceListDialog} />
        </React.Fragment>
    );
 
    const editPriceListSettingsDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={savePriceList} disabled={ !inputCode || invalidInputCode || !inputName }/> 
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideUpdatePriceListSettingsDialog} />
        </React.Fragment>
    );
 
    const editPriceListProductsDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={savePriceListProducts} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideEditPriceListProductsDialog} />
        </React.Fragment>
    );

    /*
    const addProductDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={ confirmAddProduct } /> 
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideAddProductDialog} />
        </React.Fragment>
    );
    */

    const deletePriceListDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={deletePriceList} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDeletePriceListDialog} />
        </React.Fragment>
    );

    const deletePriceListProductDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={deletePriceListProduct} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDeletePriceListProductDialog} />
        </React.Fragment>
    );

    const deleteSelectedPriceListsDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedPriceLists} />            
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSelectedPriceListsDialog} />
        </React.Fragment>
    );

    const addSelectedProductsDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={ addSelectedProducts } /> 
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideAddSelectedProductsDialog} />
        </React.Fragment>
    );

    const removeSelectedProductsDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={removeSelectedProducts} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideRemoveProductsDialog} />
        </React.Fragment>
    );

    /* Replaced by removeSelectedProductsDialogFooter
    const deletePriceListProductsDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedPriceListProducts} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDeletePriceListProductsDialog} />
        </React.Fragment>
    );
    */

    ////////////
    // Renderer
    ////////////

    return (
        <div>
            <Toast ref={toast} />
            
            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}> </Toolbar>

                <DataTable ref={dt} className="p-datatable-striped" value={pricesLists} dataKey="id"
                    selection={selectedPriceLists} onSelectionChange={ (event) => setSelectedPriceLists (event.value) }
                    //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    //currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                    scrollable scrollHeight="590px"
                    globalFilter={globalFilter}
                    header={headerProductPriceLists}>

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column field="id" header="ID" sortable />
                    <Column field="code" header="Código" sortable />
                    <Column field="name" header="Lista" sortable />
                    {/* <Column field="VATax" header="IVA" sortable /> */}
                    <Column field="dollarLinked" header="Ajusta por Dolar" body={dollarLinkedBodyTemplate} sortable />
                   {/* <Column field="exchangeRate.rate" header="Cambio actual" body={exchangeRateBodyTemplate} sortable></Column> */}
                    <Column body={actionBodyTemplate} headerStyle={{ width: '8em', textAlign: 'left' }} bodyStyle={{ textAlign: 'left', overflow: 'visible' }} />                  
                </DataTable>
            </div>

            <Dialog className="p-fluid" visible={viewPriceListDialog} style={{ width: '1080px' }} header= {renderHeader(priceListEdited.name)}  modal closable={false} footer={viewPriceListDialogFooter} onHide={ () => {} }>

                {/*
                <div className="priceListSettingsData">
                    <div className="priceListDataTop">
                        <span className="p-inputgroup-addon"> Código de la Lista </span>
                        <InputText id="codeInputText" value={inputCode} onChange={ (event) => onInputCodeChange (event) } />
                    </div>

                    <div className="priceListDataTop">
                        <span className="p-inputgroup-addon"> Nombre de la Lista </span>
                        <InputText id="nameInputText" value={inputName} onChange={ (event) => onInputNameChange (event) } />
                    </div>
                </div>
                <br/>
                */}

                <div className="priceListSettingsData">
                    <div className="priceListDataTop">
                        <span className="p-inputgroup-addon"> Moneda </span>
                        <Dropdown id="currencyDropdownSelection" value={selectedCurrency} onChange={ (event) => { onCurrencyDropDownChange (event) } } options={currencyList} optionLabel="code" dataKey="id" valueTemplate={selectedCurrencyTemplate} itemTemplate={currencyOptionTemplate} disabled={true} /> 
                    </div>
                    
                    <div className="priceListDataTop">
                        <span className="p-inputgroup-addon"> Ajusta por Dolar </span>
                        <ToggleButton id="dollarLinkedCheck" onLabel='Si' offLabel='No' onIcon="pi pi-check" offIcon="pi pi-times" checked={checkedDollarLinked} /> 
                    </div>

                    <div className="priceListDataTop">
                        <span className="p-inputgroup-addon"> Cotización Dolar (USD) </span>
                        <InputNumber id="exchangeRateInputNumber" value={inputExchangeRate.rate} onChange={ (event) => { onInputExchangeRateChange (event) } } mode="currency" currency="ARS" maxFractionDigits={2} min={0} locale="es-AR" currencyDisplay="code" placeholder='0.00' disabled={true} />
                    </div>
                </div>

                <br/>
                <div className="card">
                    <DataTable ref={dt} className="p-datatable-striped" value={priceListEdited.priceListProducts} dataKey='id'
                        scrollable scrollHeight="250px"
                        //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        globalFilter={globalFilter}
                        header={headerViewPriceListProducts}>

                        <Column field="productPriceListId" header="PPLId" ></Column>
                        <Column field="priceListId" header="PLId" ></Column>
                        <Column field="id" header="Id" ></Column>
                        <Column field="code" header="Código" ></Column>
                        <Column field="unitPurchasePrice" header="Costo" body={unitPurchasePriceBodyTemplate}></Column>
                        <Column field="sellPrice" header="Precio" body={sellPriceBodyTemplate}></Column>
                        <Column field="netPrice" header="Precio Final" body={netPriceBodyTemplate} ></Column>
                    </DataTable>                  
                </div>
                
            </Dialog>

            <Dialog className="p-fluid" visible={insertNewPriceListDialog} autoWidth={true} header="Nueva Listas de Precios" modal closable={false} footer={newPriceListDialogFooter} onHide={ () => {} }>

                <div className="p-field">
                    <span className="p-inputgroup-addon"> Código de la Lista </span>
                    <InputText id="codeInputText" value={inputCode} onChange={ (event) => onInputCodeChange (event) } required autoFocus className={ classNames({ 'p-invalid': !inputCode || invalidInputCode }) } />
                        { !inputCode  && <small className="p-invalid"> Requerido !</small>}
                        { invalidInputCode && <small className="p-invalid"> El código ya existe !</small>}
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Nombre de la Lista </span>
                    <InputText id="nameInputText" value={inputName} onChange={ (event) => onInputNameChange (event) } required autoFocus className={classNames({ 'p-invalid': !inputName })} />
                    { !inputName && <small className="p-invalid"> Requerido !</small>}
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Moneda </span>
                    <Dropdown id="currencyDropdownSelection" value={selectedCurrency} onChange={ (event) => { onCurrencyDropDownChange (event) } } options={currencyList} optionLabel="code" dataKey="id" valueTemplate={selectedCurrencyTemplate} itemTemplate={currencyOptionTemplate} placeholder="Seleccione la moneda" scrollHeight='150px' autoWidth={true} disabled={true} /> 
                </div>

                <br/>
                <div className="ui-fluid p-formgrid p-grid">
                    <div className="p-col-12 p-md-12">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon"> Ajusta por Dolar </span>
                            <ToggleButton id="dollarLinkedCheck" onLabel="Si" offLabel="No" onIcon="pi pi-check" offIcon="pi pi-times" checked={checkedDollarLinked} onChange = { (event) => onDollarLinkedChecked (event) } className="p-mr-2" /> 
                        </div>
                    </div>
                    <br/>
                    <div className="p-col-12 p-md-12">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon"> Cotización Dolar (USD) </span>
                            <InputNumber id="exchangeRateInputNumber" value={inputExchangeRate.rate} onValueChange={ (event) => { onInputExchangeRateChange (event) } } mode="currency" currency="ARS" maxFractionDigits={2} min={0} locale="es-AR" currencyDisplay="code" placeholder='0.00' disabled={true} />
                        </div>
                    </div>
                </div>

            </Dialog>

            <Dialog className="p-fluid" visible={updatePriceListSettingsDialog} header="Listas de Precios" modal closable={false} footer={editPriceListSettingsDialogFooter} onHide={ () => {} }>

                <div className="ui-fluid p-formgrid p-grid">
                    <div className="p-field p-md-3">
                        <span className="p-inputgroup-addon"> Código de la Lista </span>
                        <InputText id="codeInputText" value={inputCode} onChange={ (event) => onInputCodeChange (event) } required autoFocus className={classNames({ 'p-invalid': !inputCode || invalidInputCode })} />
                        {/*{submitted && !inputCode && <small className="p-invalid">Código de la Lista (requerido).</small>}*/}
                        { !inputCode  && <small className="p-invalid"> Requerido !</small>}
                        { invalidInputCode && <small className="p-invalid"> El código ya existe !</small>}

                    </div>

                    <div className="p-field p-md-5">
                        <span className="p-inputgroup-addon"> Nombre de la Lista </span>
                        <InputText id="nameInputText" value={inputName} onChange={ (event) => onInputNameChange (event) } required autoFocus className={classNames({ 'p-invalid': !inputName })} />
                        {!inputName && <small className="p-invalid">Rrequerido !</small>}
                    </div>
                </div>

                <div className="ui-fluid p-formgrid p-grid">
                    <div className="p-field p-md-2">
                        <span className="p-inputgroup-addon"> Ajusta por Dolar </span>
                        <ToggleButton id="dollarLinkedCheck" onLabel="Si" offLabel="No" onIcon="pi pi-check" offIcon="pi pi-times" checked={checkedDollarLinked} onChange = { (event) => onDollarLinkedChecked (event) } className="p-mr-2" /> 
                    </div>

                    <div className="p-field p-md-2">
                        <label htmlFor="markupInputNumber">Ganancia</label>
                        <InputNumber id="markupInputNumber" value={inputMarkup} onValueChange={ (event) => onInputMarkupChange (event) } mode="decimal" min={0} max={100} maxFractionDigits={1}  locale="es-AR" placeholder='000.0' suffix=' %' disabled={true} />
                    </div>
                    {/*
                    <div className="p-field p-md-2">
                        <label htmlFor="VATaxInputNumber">IVA</label>
                        <InputNumber id="VATaxInputNumber" value={inputVATax} onValueChange={ (e) => onInputVATaxChange (e) } mode="decimal" min={0} max={100} maxFractionDigits={1}  locale="es-AR" placeholder='000.0' suffix=' %' disabled={true} />
                    </div>
                    */}
                    <div className="p-field p-md-2">
                        <label htmlFor="currencyDropdownSelection">Moneda</label>
                        <Dropdown id="currencyDropdownSelection" value={selectedCurrency} onChange={ (event) => { onCurrencyDropDownChange (event) } } options={currencyList} optionLabel="code" dataKey="id" valueTemplate={selectedCurrencyTemplate} itemTemplate={currencyOptionTemplate} placeholder="Seleccione la moneda" scrollHeight='150px' autoWidth={true} disabled={false} /> 
                    </div>

                    <div className="p-field p-md-2">
                        <label htmlFor="exchangeRateInputNumber"> Cotización USD </label>
                        <InputNumber id="exchangeRateInputNumber" value={inputExchangeRate.rate} onValueChange={ (event) => { onInputExchangeRateChange (event) } } mode="currency" currency="ARS" maxFractionDigits={2} min={0} locale="es-AR" currencyDisplay="code" placeholder='0.00' disabled={true} />
                    </div>

                </div>

                <div className="ui-fluid p-formgrid p-grid">
 
                </div>

            </Dialog>
            
            <Dialog visible={updatePriceListProductsDialog} autoLayout={true} header= {renderHeader(priceListEdited.name)}  modal closable={false} blockScroll={true} footer={editPriceListProductsDialogFooter} onHide={ () => {} }>

                <Toolbar className="p-mb-4" left={priceListProductsLeftToolbarTemplate} right={priceListProductsRightToolbarTemplate}></Toolbar>

                <br/>
                <div className="priceListSettingsData">
                    <div className="priceListDataTop">
                        <span className="p-inputgroup-addon"> Código de la Lista </span>
                        <InputText className='priceList-textAlignment' value={inputCode} onChange={ (event) => onInputCodeChange (event) } required className={ classNames({ 'p-invalid': !inputCode || invalidInputCode }) } disabled={true} />
                        { !inputCode  && <small className="p-invalid"> Requerido !</small>}
                        { invalidInputCode && <small className="p-invalid"> El código ya existe !</small>}
                    </div>

                    <div className="priceListDataTop">
                        <span className="p-inputgroup-addon"> Nombre de la Lista </span>
                        <InputText className='priceList-textAlignment' value={inputName} onChange={ (event) => onInputNameChange (event) } required className={classNames({ 'p-invalid': !inputName })} />
                        {!inputName && <small className="p-invalid"> Requerido !</small>}
                    </div>

                    <div className="priceListDataTop">
                        <span className="p-inputgroup-addon"> Moneda </span>
                        <Dropdown className='priceList-textAlignment' value={selectedCurrency} onChange={ (event) => { onCurrencyDropDownChange (event) } } options={currencyList} optionLabel="code" dataKey="id" valueTemplate={selectedCurrencyTemplate} itemTemplate={currencyOptionTemplate} disabled={true} /> 
                    </div>
                        
                    <div className="priceListDataTop">
                        <span className="p-inputgroup-addon"> Ajusta por Dolar </span>
                        <ToggleButton className='priceList-textAlignment' onLabel="Si" offLabel="No" onIcon="pi pi-check" offIcon="pi pi-times" checked={checkedDollarLinked} onChange = { (event) => onDollarLinkedChecked (event) } /> 
                    </div>

                    <div className="priceListDataTop">
                        <span className="p-inputgroup-addon"> Cotización Dolar (USD) </span>
                        <InputNumber className='priceList-textAlignment' value={inputExchangeRate.rate} onValueChange={ (event) => { onInputExchangeRateChange (event) } } mode="currency" currency="ARS" maxFractionDigits={2} min={0} locale="es-AR" currencyDisplay="code" placeholder='0.00' disabled={true} />
                    </div>
                </div>

                <br/>
                <DataTable ref={dt} className="p-datatable-striped" value={priceListEdited.priceListProducts} dataKey="id" editMode="cell" rowHover = {true}
                    selection={selectedPriceListProducts} onSelectionChange={ (event) => setSelectedPriceListProducts(event.value) } 
                    //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    //currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                    scrollable scrollHeight="450px" blockScroll={true}
                    globalFilter={globalFilter}
                    header={headerEditPriceListProducts} headerClassName='p-datatable-header' >

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}/>
                    <Column field="productPriceListId" header="Id" />
                    <Column field="id" header="productId" />
                    <Column field="code" header="Código" />
                    <Column field="unitPurchasePrice" header="Costo" body={unitPurchasePriceBodyTemplate} />
                    <Column field="sellPrice" header="Precio Lista" body={sellPriceBodyTemplate} editor={ ProductSellPriceEditor } />
                    <Column field="netPrice" header="Precio Final" body={netPriceBodyTemplate} />
                    {/* <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
                    {/* <Column body={editPriceListProductBodyTemplate} headerStyle={{ width: '8em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} /> */}
                </DataTable> 

            </Dialog>
            
            <Dialog visible={deletePriceListDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePriceListDialogFooter} onHide={hideDeletePriceListDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {priceListEdited && <span>¿Confirma ELIMINAR <b>{priceListEdited.name}</b>?</span>} 

                </div>
            </Dialog>

            <Dialog visible={deletePriceListProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePriceListProductDialogFooter} onHide={hideDeletePriceListProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {priceListProductEdited && <span>¿Confirma ELIMINAR <b>{priceListProductEdited.name}</b>?</span>} 

                </div>
            </Dialog>

            <Dialog visible={deleteSelectedPriceListsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSelectedPriceListsDialogFooter} onHide={hideDeleteSelectedPriceListsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {priceListEdited && <span>¿Confirma ELIMINACIÓN de las listas de precios seleccionadas?</span>}

                </div>
            </Dialog>

            <Dialog visible={addPriceListProductsDialog} header="Seleccione los Productos a agregar" modal closable={false}  footer={addSelectedProductsDialogFooter} onHide={ () => {} }>

                <div className="card">

                    <DataTable ref={dt} className="p-datatable-striped" style={{ width: '550px' }} value={productsSource} dataKey="id" 
                        selection={selectedPriceListProducts} onSelectionChange={ (event) => setSelectedPriceListProducts(event.value) } 
                        //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        //currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                        scrollable scrollHeight="250px"
                        globalFilter={globalFilter}
                        header={headerEditPriceListProducts}>

                        <Column selectionMode="multiple"/>
                        <Column field="id" header="Id" />
                        <Column field="code" header="Código" />
                        {/* <Column field="manufacturer" header="Fabricante" /> */}
                        <Column field="unitPurchasePrice" header="Costo" body={unitPurchasePriceBodyTemplate}/>
                        {/* <Column field="sellPrice" header="Precio" body={sellPriceBodyTemplate} editor={ProductSellPriceEditor} /> */}
                    </DataTable>
                    
                </div>
                
            </Dialog>

            <Dialog visible={removePriceListProductsDialog} style={{ width: '450px' }} header="Seleccione los productos a quitar" modal closable={false} footer={removeSelectedProductsDialogFooter} onHide={() => {}}>

                <DataTable ref={dt} className="p-datatable-striped" value={productsSource} dataKey="id" scrollable scrollHeight="250px"
                    selection={selectedPriceListProducts} onSelectionChange={ (event) => setSelectedPriceListProducts(event.value) } 
                    //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    //currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                    globalFilter={globalFilter}
                    header={headerEditPriceListProducts}>

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="id" header="Id" ></Column>
                    <Column field="code" header="Código" ></Column>
                    {/* <Column field="manufacturer" header="Fabricante" ></Column> */}
                    <Column field="unitPurchasePrice" header="Costo" body={unitPurchasePriceBodyTemplate}></Column>
                    <Column field="sellPrice" header="Precio" body={sellPriceBodyTemplate} editor={ProductSellPriceEditor} ></Column>
                </DataTable>
            </Dialog>

            {/* Replaced by removePriceListProductsDialog
            <Dialog visible={deleteSelectedPriceListProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePriceListProductsDialogFooter} onHide={hideDeletePriceListProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {priceListProductList && <span>¿Confirma QUITAR los productos seleccionados?</span>}
                </div>
            </Dialog>
            */}

        </div>
    );
}