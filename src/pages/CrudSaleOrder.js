import React, { useCallback, useState, useEffect, useRef } from 'react';

import { CheckAccTransactionService } from "../service/CheckingAccountService";
import { CurrencyService } from "../service/CurrencyService";
import { CustomerService } from "../service/CustomerService";
import { EmployeeService } from "../service/EmployeeService";
import { InventoryIndexCardService, InventoryIndexCardTransactionService } from '../service/InventoryService';
import { PaymentMethodService } from "../service/PaymentMethodService";
import { ProductPriceListService } from '../service/PriceListService';
import { PrintToPDFService } from "../service/PrintToPDFService";
import { ProductService } from "../service/ProductService";
import { SaleOrderService, ProductSaleOrderService } from '../service/SaleOrderService';
import { StatusService } from "../service/StatusService";

import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { ToggleButton } from 'primereact/togglebutton';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from 'primereact/inputmask';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
//import { Splitter, SplitterPanel } from 'primereact/splitter';

import classNames from 'classnames';
//import '../layout/CrudSaleOrder.scss';
import '../layout/CrudSaleOrder.css';
import { Switch } from 'react-router-dom';

//const { CreatePDF, CreateForm } = require('./PrintToPDF');
export function CrudSaleOrder() {

    ////////////////////////////////////
    // Empty Objects for initialization
    ////////////////////////////////////
    
    const emptySaleOrder = {
        id: 0,
        number: 0,
        date:0, 
        amountSubTotal: 0, 
        VATax: 0,
        otherTaxes: 0,
        amountTotal: 0, 
        confirmationDate: 0,
        currency: { id: 7, code: 'ARS' },
        customer: { id: 0, name: '', checkingAccountId: 0 },
        employee: { id: 0, name: '', priceListId: 0 },
        paymentMethod: {id: 0, type:''},
        status: { id: 5, code: 50, name: 'PENDIENTE', group: 'saleOrder' }, // By default orders are in pending status when created
        saleOrderProducts: [],
        dateCreated: 0, 
        dateUpdated: 0, 
        dateDeleted: 0,
    };

    const emptySaleOrderProduct = {
        id: null,
        code: '',
        name: '',
        detail: '',
        brand: '',
        model: '',
        category: '',
        manufacturer: '',
        initialUnitQuantity: 0,
        quantityPerUnit: 1,
        unitPurchasePrice: 0,
        purchasePriceCurrency: { id: null, code: ''},
        productSaleOrderId: null,
        saleOrderId: null,
        productId: null,
        unitQuantity: 0,
        unitType: {id: null, name: ''},
        unitSellPrice: 0,
        unitSellPriceCurrency: { id: null, code: ''},
        discount: 0,
        subTotal: 0,
        VATax: 0,
        subTotalWithVATax: 0,
        productInventory: {indexCardId: null, indexCardname: '', minimumStock: null, calculatedQuantityBalance: null, status: { id: null, code: null, name: '', group: ''} },
        dateCreated: 0,
        dateUpdated: 0,
        dateDeleted: 0 //must be always last column
    }

    const emptyProduct = {
        id: null,
        code: '',
        name: '',
        detail: '',
        brand: '',
        model: '',
        category: '',
        manufacturer: '',
        initialUnitQuantity: 0,
        quantityPerUnit: 1,
        unitPurchasePrice: 0,
        purchasePriceCurrency: {id: null , code: ''},
        priceListId: null,
        productPriceListId: null,
        unitSellPrice: 0,
        unitSellPriceCurrency: {id: null, code: ''},
        inventoryStatus: {id: null , name: '' },
        productInventory: {id: null, quantityBalance: 0 },
        unitQuantity: 0, //added for saleOrder
        discount: 0, //added for saleOrder
        subTotal: 0, //added for saleOrder
        VATax: 0, //added for saleOrder
        subTotalWithVATax: 0, //added for saleOrder
        dateCreated: null, 
        dateUpdated: 0, 
        dateDeleted: 0,
    }

    const emptyInventoryIndexCard = {
        id: null,
        indexCardPartNumber: '', 
        indexCardName: '',
        minimumStock: 0,
        maximumStock: 0,
        calculatedQuantityBalance: 0,
        inventoryMethodId: 0,
        indexCardCreationDate: 0,
        lastTransactionDate: 0,
        transactions:[],
        product: {id: 0, code: '', model:''},
        status: {id: 2, name:''},
        dateCreated: 0,
        dateUpdated: 0,
        dateDeleted: 0
    };

    const emptyInventoryIndexCardTransaction = {
        id: 0,
        unitQuantity: 0,
        type: '0', // 0 initialize, 1 increment, -1 decrement 
        description: '',
        //inventoryIndexCard: {id: null, indexCardName: ''},
        inventoryIndexCardId: 0,
        purchaseOrder: {id: 1, number: ''}, // 1 means no purchase order in place so manual input.
        saleOrder: {id: 1, number: ''}, // 1 means no sale order in place so manual input.
        warehouseSlot: {id: 1, code:''}, // 1 default slot (lobby)
        dateCreated: 0,
        dateUpdated: 0,
        dateDeleted: 0
    };

    const emptyCheckAccTransaction = {
        id: 0,
        amount: 0.00,
        type: 0, // -1 payment, 0 acc initialization, 1 sale
        description: '',
        checkingAccountId: 0,
        paymentMethod: {id:1, type:'Efectivo'}, // 1 Cash, 2 Check, 3 Wire transfer
        saleOrder: {id: 1, name: 'default'},
        dateCreated: 0,
        dateUpdated: 0,
        dateDeleted: 0,
    };

    const emptySaleOrderInsert = { // Needed to insert new products
        id:0,
        saleOrderProducts: []
    }

    const emptySaleOrderUpdate = {
        id:0,
        saleOrderProducts: []
    }

    //const emptyInventoryIndexCardInsert = {  transactions: []   };


    ///////////////
    // React Hooks
    ///////////////

    //Sale Order Variables
    const [saleOrderList, setSaleOrderList] = useState([]);    
    const [saleOrderListUndo, setSaleOrderListUndo] = useState([]);
    const [saleOrderEdited, setSaleOrderEdited] = useState({});
    const [saleOrderEditedUndo, setSaleOrderEditedUndo] = useState({});
    const [saleOrderInsert, setSaleOrderInsert] = useState({});
    const [saleOrderUpdate, setSaleOrderUpdate] = useState({});
    const [saleOrderProductList, setSaleOrderProductList] = useState([]);
    const [saleOrderProductEdited, setSaleOrderProductEdited] = useState(JSON.parse( JSON.stringify ({...emptySaleOrderProduct})))

    // Customer Variables
    const [customerList, setCustomerList] = useState([]);

    // Currency Variables
    const [currencyList, setCurrencyList] = useState([]);

    //Employee Variables
    const [employeeList, setEmployeeList] = useState([]);

    // PaymentMethod Variables
    const [paymentMethodList, setPaymentMethodList] = useState([]);


    // Product Variables
    const [products, setProducts] = useState([]);
    const [productsSource, setProductsSource] = useState([]);
    const [productsTarget, setProductsTarget] = useState([]);
    const [productListType, setProductListType] = useState( 'saleOrder' );
    const [productQueryFilter, setProductQueryFilter] = useState(null);
    
    //Inventory variables
    const [inventoryIndexCardList, setInventoryIndexCardList] = useState ([]);
    //const [inventoryIndexCardTransactionEdited, setInventoryIndexCardTransactionEdited] = useState({});
    //const [inventoryIndexCardInsert, setInventoryIndexCardInsert] = useState ({...emptyInventoryIndexCardInsert});
    //const [transactionsSource, setTransactionsSource] = useState([]);
    const [transactionsTarget, setTransactionsTarget] = useState([]);

    //Status Variables
    const [statusList, setStatusList] = useState([]);

    //const [exchangeRateEdited, setExchangeRateEdited] = useState(emptyExchangeRate);

    // Input variables
    const [inputNumber, setInputNumber] = useState('');
    //const [invalidInputCode, setInvalidInputCode] = useState(false); 
    const [inputDate, setInputDate] = useState('');
    const [inputVATax, setInputVATax] = useState(0.0);
    const [inputOtherTaxes, setInputOtherTaxes] = useState(0.0);
    const [inputDiscount, setInputDiscount] = useState(0.0);
    const [inputUnitQuantity, setInputUnitQuantity] = useState(0);
    //const [inputCurrency, setInputCurrency] = useState(emptySaleOrder.currency);
    const [inputUnitSellPrice, setInputUnitSellPrice] = useState (0);
    const [selectedSaleOrders, setSelectedSaleOrders] = useState([]);
    const [selectedSaleOrderProducts, setSelectedSaleOrderProducts] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(emptySaleOrder.currency); //needs starting valuo to validate field in Dialog
    const [selectedCustomer, setSelectedCustomer] = useState(emptySaleOrder.customer); //needs starting valuo to validate field in Dialog
    const [selectedEmployee, setSelectedEmployee] = useState(emptySaleOrder.employee); //needs starting valuo to validate field in Dialog
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(emptySaleOrder.paymentMethod); //needs starting valuo to validate field in Dialog
    const [selectedStatus, setSelectedStatus] = useState(emptySaleOrder.status);
    //const [submitted, setSubmitted] = useState(false); // used for input control in form, not in use
    const [checkedVATax, setCheckedVATax] = useState(false);
    const [checkedDiscount, setCheckedDiscount] = useState(false);
    const [disableAddProduct, setDisableAddProduct] = useState(true);
    const [disableRemoveProduct, setDisableRemoveProduct] = useState(true);
    const [disableSubmit, setDisableSubmit] = useState(true);
    //const [disableStatusEditor, setDisableStatusEditor] = useState(true)
    const [disableUnitQuantityEditor, setDisableUnitQuantityEditor] = useState(true)
    const [disableEditor, setDisableEditor] = useState(true)
    const [disableEmployeeDropDown, setDisableEmployeeDropDown] = useState(true)
    const [confirmSaleOrder, setConfirmSaleOrder] = useState(false)
    const [cancelSaleOrder, setCancelSaleOrder] = useState(false)

    //Calculated Variables
    const [modifiedDate, setModifiedDate] = useState(false);
    const [amountSubTotal, setAmountSubTotal] = useState(0);
    const [amountTotal, setAmountTotal] = useState(0);

    // Dialog Variables
    const [newSaleOrderDialog, setNewSaleOrderDialog] = useState(false);
    const [editSaleOrderSettingsDialog, setEditSaleOrderSettingsDialog] = useState(false);
    const [editSaleOrderProductsDialog, setEditSaleOrderProductsDialog] = useState(false);
    const [viewSaleOrderDialog, setViewSaleOrderDialog] = useState(false);
    const [addSaleOrderProductDialog, setAddSaleOrderProductDialog] = useState(false);
    const [removeProductsDialog, setRemoveProductsDialog] = useState(false);
    const [confirmSaleOrderDialog, setConfirmSaleOrderDialog] = useState(false);
    const [deleteSaleOrderDialog, setDeleteSaleOrderDialog] = useState(false);
    const [deleteSaleOrdersDialog, setDeleteSaleOrdersDialog] = useState(false);
    const [deleteSaleOrderProductDialog, setDeleteSaleOrderProductDialog] = useState(false);
    //const [deleteSaleOrderProductsDialog, setDeleteSaleOrderProductsDialog] = useState(false);
    //const [queryData, setQueryData] = useState(null);

    // Other Variables
    const [globalFilter, setGlobalFilter] = useState([]);
    //const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'date', order: -1 }]);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'number', order: -1 }]);
    const toast = useRef(null);
    const dt = useRef(null);

    // Services
    const checkAccTransactionService = new CheckAccTransactionService();
    const currencyService = new CurrencyService();
    const customerService = new CustomerService();
    const employeeService = new EmployeeService();
    const inventoryIndexCardService = new InventoryIndexCardService();
    const inventoryIndexCardTransactionService = new InventoryIndexCardTransactionService();
    const printToPDFService = new PrintToPDFService();
    const productSaleOrderService = new ProductSaleOrderService();
    const productService = new ProductService();
    const statusService = new StatusService();
    const saleOrderService = new SaleOrderService();
    const paymentMethodService = new PaymentMethodService();
    const productPriceListService = new ProductPriceListService();

    useEffect( () => {

        saleOrderAmountTotalUpdate();
        fetchSaleOrderData();
        fetchCustomerListData();
        fetchCurrencyListData();
        fetchEmployeeListData();
        fetchPaymentMethodListData();
        fetchStatusListData();
        //fetchProductListData(productListType, productQueryFilter);
        //fetchInventoryIndexCardListData();
        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);

    ///////////////////////
    // DB Data Functions
    ///////////////////////

    async function saleOrderAmountTotalUpdate () {
        console.log ( '# saleOrderAmountTotalUpdate #' );

        await saleOrderService.getSaleOrderList().then( (_saleOrderListData) => {
            console.log ('_saleOrderListData: ', _saleOrderListData, '\n');

            _saleOrderListData.forEach ( async (_saleOrder) => {
                //console.log ('_saleOrder: ', _saleOrder);
                let _saleOrderUpdate = {}
                let calculatedAmountSubTotal = 0
                let calculatedAmountTotal = 0

                _saleOrder.saleOrderProducts.forEach ( async (_prod) => {
                    calculatedAmountSubTotal += _prod.subTotal;
                });
                calculatedAmountTotal = calculatedAmountSubTotal * (_saleOrder.VATax + _saleOrder.otherTaxes + 1) ;
                calculatedAmountTotal = Math.round((calculatedAmountTotal + Number.EPSILON) * 100) / 100

                //console.log ('calculatedAmountSubTotal: ', calculatedAmountSubTotal);
                //console.log ('calculatedAmountTotal ', calculatedAmountTotal);

                if ( (_saleOrder.amountTotal !== calculatedAmountTotal) && (_saleOrder.status.id === 5) ) { // Adjust subTotal and Total amounts only if there is change and the sale order is pending
                    _saleOrderUpdate.id = _saleOrder.id;
                    _saleOrderUpdate.amountSubTotal = calculatedAmountSubTotal
                    _saleOrderUpdate.amountTotal = calculatedAmountTotal
                    _saleOrderUpdate.dateUpdated = Date.now();
                    console.log ('_saleOrderUpdate: ', _saleOrderUpdate);
        
                    await saleOrderService.updateSaleOrder (_saleOrderUpdate)
                }
            });
        });



    };

    async function fetchSaleOrderData () {
        console.log ('fetchSaleOrderData','\n');

        await saleOrderService.getSaleOrderList().then( (saleOrderListData) => {
            console.log ('saleOrderListData: ', saleOrderListData);

            saleOrderListData = saleOrderListData.filter (_saloOrder => _saloOrder.id !== 1 );

            setSaleOrderList (JSON.parse (JSON.stringify (saleOrderListData) ) );
            setSaleOrderListUndo (JSON.parse (JSON.stringify (saleOrderListData) ) );

        })
    };

    async function putSaleOrder (newSaleOrderSettings) {
        console.log ( '# putSaleOrder #' );
        let returnedId = await saleOrderService.putSaleOrder (newSaleOrderSettings);
        console.log ('returnedId: ', returnedId, '\n');
        toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Presupuesto Creado', life: 3000 });
        return returnedId;

    };

    async function updateSaleOrder (updatedSaleOrderSettings, option) {
        console.log ( '# updateSaleOrder #' );
        //console.log ('priceListSettings: ', priceListSettings, '\n');
        await saleOrderService.updateSaleOrder (updatedSaleOrderSettings).then ( (returnedValue) => { //update persistent data source.

            switch (option) {
                case 'update':
                    toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Presupuesto Actualizado', life: 3000 });
                    break;

                case 'delete':
                    toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Presupuesto/s Borrada/s', life: 3000 });
                    break;             
            }
            return returnedValue;
        })
    }

    async function fetchProductSaleOrderData (saleOrder) {
        console.log ('fetchProductSaleOrderData','\n');

        await productSaleOrderService.getProductSaleOrderList(saleOrder.id).then( (productSaleOrderData) => {
            //console.log ('saleOrder: ', saleOrder);
            //console.log ('productSaleOrderData: ', productSaleOrderData);
            saleOrder.saleOrderProducts = [...productSaleOrderData];
            setSaleOrderEdited (JSON.parse(JSON.stringify(saleOrder)));
            setSaleOrderEditedUndo (JSON.parse(JSON.stringify(saleOrder)));
        });
        //console.log ('saleOrder: ', saleOrder);
        return saleOrder.saleOrderProducts
    };

    async function putProductSaleOrder (newSaleOrderProducts) {
        console.log ( '# putProductSaleOrder #' );
        let returnedId = await productSaleOrderService.putProductSaleOrder (newSaleOrderProducts);
        //console.log ('returnedId: ', returnedId, '\n');
        toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Prodcto/s Agregado/s', life: 3000 });
        return returnedId;

    };

    async function updateProductSaleOrder (updatedSaleOrderProducts, option) {
        console.log ( '# updateProductSaleOrder #' );
        //console.log ('priceListSettings: ', priceListSettings, '\n');
        await productSaleOrderService.updateProductSaleOrder (updatedSaleOrderProducts).then ( (returnedValue) => { //update persistent data source.

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
        console.log ('fetchCurrencyListData','\n');
        await currencyService.getCurrencyList().then( (currencyListData) => {
            //console.log ('currencyListData: ', currencyListData, '\n');
            setCurrencyList(JSON.parse(JSON.stringify(currencyListData)));
            //setCurrencyListUndo(JSON.parse(JSON.stringify(currencysData)));
        });

    };

    async function fetchCustomerListData () {
        console.log ('fetchCustomerListData','\n');
        await customerService.getCustomerList().then( (customerListData) => {
            console.log ('customerListData): ', customerListData);
            setCustomerList (JSON.parse(JSON.stringify(customerListData)));
            //setCustomersUndo (JSON.parse(JSON.stringify(customersData)));
        });
    };

    async function fetchEmployeeListData () {
        console.log ('fetchEmployeeListData','\n');
        await employeeService.getEmployeeList().then( (employeeListData) => {
            console.log ('employeeListData: ',employeeListData);
            setEmployeeList(employeeListData);
        });

    };

    async function fetchProductListData (productListType, productQueryFilter) {
        console.log ( '# fetchProductListData #' );
        let productFilter = [productListType, productQueryFilter]; // Is needed
        let products = [];
        console.log ('productFilter: ', productFilter, '\n');
        await productService.getProductList(productFilter).then ( (_productsData) => {
            console.log ('_productsData: ', _productsData, '\n');
            //products = [...productsData]
            products = _productsData.filter (prod => prod.id !== 1 );
            setProducts(JSON.parse(JSON.stringify(products)));
            //setProductsUndo (JSON.parse(JSON.stringify(productsData)));
        });
        return products
    };

    async function fetchStatusListData () {
        console.log ('fetchStatusListData');
        await statusService.getStatusList("'SaleOrder'").then( (statusListData) => { // must be between double cuotes to be used as string in SQLIte query
            console.log ('statusListData): ', statusListData);
            setStatusList (JSON.parse(JSON.stringify(statusListData)));
        });
    };

    async function fetchInventoryIndexCardListData () {
        console.log ( '# fetchInventoryIndexCardListData #' );
        await inventoryIndexCardService.getInventoryIndexCardList().then( (inventoryIndexCardListData) => {
            console.log ('inventoryIndexCardListData: ', inventoryIndexCardListData, '\n');
            setInventoryIndexCardList (JSON.parse(JSON.stringify(inventoryIndexCardListData)));
            //setInventoryIndexCardListUndo (JSON.parse(JSON.stringify(inventoryIndexCardListData)));
        });
    };

    async function updateInventoryIndexCard (inventoryIndexCardSettings) {
        console.log ( '# updateInventoryIndexCard #' );
        await inventoryIndexCardService.updateInventoryIndexCard (inventoryIndexCardSettings).then ( (returnedValue) => {
            console.log ('returnedValue: ', returnedValue, '\n');
            return returnedValue;
        });
    };

    async function putInventoryIndexCardTransactions (newInventoryIndexCardTransactions) {
        console.log ( '# putInventoryIndexCardTransactions #' );
        let returnedId = await inventoryIndexCardTransactionService.putInventoryIndexCardTransaction (newInventoryIndexCardTransactions);
        //console.log ('returnedId: ', returnedId, '\n');
        return returnedId;

    };

    async function putCheckAccTransaction (_checkingAccount) {
        console.log ( '# putCheckAccTransaction #' );
        //console.log ('_checkingAccount: ', _checkingAccount, '\n');
        let returnedId = await checkAccTransactionService.putCheckAccTransaction (_checkingAccount);
        toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Nuevo Movimiento Ingresado', life: 3000 });
        return returnedId;
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

    async function fetchProductPriceListData (_priceListId) {
        console.log ( '# fetchProductPriceListData #' );
        let _priceListProducts = []
        await productPriceListService.getProductPriceList(_priceListId).then( (_productPriceListData) => {
            console.log ('productPriceListData: ', _productPriceListData);
            (_productPriceListData) ? _priceListProducts = [..._productPriceListData] : _priceListProducts = [];
        });
        return _priceListProducts
    };
    
    ////////////////////////////////////
    // Action Body Dialog Functions
    ////////////////////////////////////

    const openViewSaleOrderDialog = (rowData) => {
        console.log ('# openViewSaleOrderDialog #');
        console.log ('rowData: ', rowData);

        //fetchProductSaleOrderData ( { ...rowData } );
        setSaleOrderEdited ( { ...rowData } );
        setInputNumber ( rowData.number );
        setInputDate ( rowData.date );
        setAmountSubTotal ( rowData.amountSubTotal );
        setInputVATax ( rowData.VATax * 100 );
        setInputOtherTaxes ( rowData.otherTaxes * 100 );
        setAmountTotal ( rowData.amountTotal );
        setModifiedDate ( rowData.modifiedDate );
        setSelectedCurrency ( {...rowData.currency} );
        setSelectedCustomer ( rowData.customer.name );
        setSelectedEmployee ( rowData.employee.name );
        setSelectedStatus ( rowData.status.name.toLowerCase() );
        setSelectedPaymentMethod ( rowData.paymentMethod.type )
        //setCheckedDollarLinked ( (rowData.dollarLinked) ? true : false );

        setViewSaleOrderDialog(true);
    };

    const hideViewSaleOrderDialog = () => {
        //setSubmitted(false); // used for input control in form, not in use
        setViewSaleOrderDialog(false);
    }

    const openNewSaleOrderDialog = () => {
        console.log ('# openNewSaleOrderDialog #');

        emptySaleOrder.number = generateSaleOrderNumber() + 1;
        setSaleOrderEdited( {...emptySaleOrder} );
        setInputNumber ( emptySaleOrder.number );
        setInputDate ( emptySaleOrder.date );
        setAmountSubTotal ( emptySaleOrder.amountSubTotal );
        setInputVATax ( emptySaleOrder.VATax * 100 );
        setInputOtherTaxes ( emptySaleOrder.otherTaxes * 100 );
        setAmountTotal ( emptySaleOrder.amountTotal );
        setModifiedDate ( emptySaleOrder.modifiedDate );
        setSelectedCurrency ( {...emptySaleOrder.currency} );
        setSelectedCustomer ( {...emptySaleOrder.customer} );
        setSelectedEmployee ( {...emptySaleOrder.employee} );
        setSelectedStatus ( {...emptySaleOrder.status} );
        setSelectedPaymentMethod ( {...emptySaleOrder.paymentMethod} );
        //setCheckedVATax (false);

        let _saleOrderInsert = JSON.parse( JSON.stringify ({...emptySaleOrder}) ) //Because is a new sale order, emptySaleOrder is used as a default
        _saleOrderInsert.dateCreated = Date.now()
        //setSaleOrderInsert ( JSON.parse( JSON.stringify ({...emptySaleOrder}) ) ); // It must have same starting data that saleOrderEdited has.
        setSaleOrderInsert ( {..._saleOrderInsert} ); // It must have same starting data that saleOrderEdited has.

        setProductsSource( JSON.parse( JSON.stringify ( products ) ) ); // Can also be used with pick lits to assig products to the a new lit
        setProductsTarget([]); // Can also be used with pick lits form to asign products to a new list
        //setSubmitted(false); // used for input control in form, not in use
        setDisableEditor(false) //enable editor
        setDisableAddProduct(false); //enable add products button
        setDisableRemoveProduct(false); //enable remove products button
        setDisableEmployeeDropDown(false); // enable employee dropdown selection
        setDisableUnitQuantityEditor(false);
        setNewSaleOrderDialog(true);
    }

    const hideNewSaleOrderDialog = () => {
        setSaleOrderEdited(emptySaleOrder);
        setProductsSource([]);
        setProductsTarget([]);
        // setSubmitted(false); // used for input control in form, not in use
        setCheckedVATax (false);

        setNewSaleOrderDialog(false);
    }

    const openEditSaleOrderSettingsDialog = (rowData) => {
        console.log ('# openEditSaleOrderSettingsDialog #');

        console.log ('rowData: ', rowData);

        if (rowData.status.code === 500) { setDisableEditor (false) } // If status is different from pending, it wont allow saleOrder editing 
        console.log ('disableEditor: ', disableEditor)

        setSaleOrderEdited ( { ...rowData } );
        //fetchProductSaleOrderData ( { ...rowData } );
        setInputNumber ( rowData.number );
        setInputDate ( rowData.date );
        setAmountSubTotal ( rowData.amountSubTotal );
        setInputVATax ( rowData.VATax * 100 );
        //setCheckedDollarLinked ( (rowData.dollarLinked) ? true : false );
        setAmountTotal ( rowData.amountTotal );
        setModifiedDate ( rowData.modifiedDate );
        setSelectedCurrency ( {...rowData.currency} );
        setSelectedCustomer ( {...rowData.customer} );
        setSelectedEmployee ( {...rowData.employee} );
        setSelectedStatus ( {...rowData.status} );
        setSelectedPaymentMethod ( {...rowData.paymentMethod} )

        let _saleOrderUpdate = JSON.parse( JSON.stringify ({...emptySaleOrderUpdate}) )
        _saleOrderUpdate.dateUpdated = Date.now()
        setSaleOrderUpdate ( {..._saleOrderUpdate} ) ;
        //setInventoryIndexCardInsert (JSON.parse (JSON.stringify ({...emptyInventoryIndexCardInsert}) ) );

        setDisableEmployeeDropDown(true); // Once selected employee may not be changed because pricelist products composition may vary
        setEditSaleOrderSettingsDialog(true);
    };

    const hideEditSaleOrderSettingsDialog = () => {
        setSaleOrderList(JSON.parse(JSON.stringify(saleOrderListUndo)));
        console.log ('saleOrderListUndo', saleOrderListUndo);
        //setProductsSource([]);
        //setProductsTarget([]);
        //setSubmitted(false); // used for input control in form, not in use
        setEditSaleOrderSettingsDialog(false);
    }

    const openEditSaleOrderProductsDialog = async (rowData) => {
        console.log ('# openEditSaleOrderProductsDialog #');
        console.log ('rowData: ', rowData);

        if (rowData.status.code === 500) { // Staus 500 = PENDING
            setDisableEditor(false) //enable Sale order editor
            setDisableAddProduct(false); //enable add products button
            setDisableRemoveProduct(false); //enable remove products button
            setDisableUnitQuantityEditor(false) //enable quantity editor
        }

        //if ( rowData.confirmationDate !== 0 ) { setDisableUnitQuantityEditor(false) }

        console.log ('disableEditor: ', disableEditor)
        console.log ('disableUnitQuantityEditor: ', disableUnitQuantityEditor)

        await fetchProductListData(productListType, rowData.employee.priceListId); // Get product list to be used in addSelectedProduct function

        //let saleOrderProducts = await fetchProductSaleOrderData ( { ...rowData } ); // or use setSaleOrderEdited ( {...rowData} ) to get all sale order products of each sale order at once
        //console.log ('saleOrderProducts: ', saleOrderProducts)

        setSaleOrderEdited ( { ...rowData } );
        //setSaleOrderEditedUndo (JSON.parse(JSON.stringify(rowData)));
        setInputNumber ( rowData.number );
        setInputDate ( rowData.date );
        setAmountSubTotal ( rowData.amountSubTotal );
        setInputVATax ( rowData.VATax * 100 );
        setInputOtherTaxes ( rowData.otherTaxes * 100 );
        setAmountTotal ( rowData.amountTotal );
        setModifiedDate ( rowData.modifiedDate );
        setSelectedCurrency ( {...rowData.currency} );
        setSelectedCustomer ( {...rowData.customer} );
        setSelectedEmployee ( {...rowData.employee} );
        setSelectedStatus ( {...rowData.status} );
        setSelectedPaymentMethod ( {...rowData.paymentMethod} )
        //setCheckedDollarLinked ( (rowData.dollarLinked) ? true : false );
        //setInventoryIndexCardTransactionEdited (JSON.parse (JSON.stringify ({...emptyInventoryIndexCardTransaction}) ) );
        //setInventoryIndexCardInsert (JSON.parse (JSON.stringify ({...emptyInventoryIndexCardInsert}) ) );

        let _saleOrderInsert = JSON.parse( JSON.stringify ({...emptySaleOrderInsert}) ) //New product inserted in a existing sale order, that's why we use _saleOrderInsert 
        _saleOrderInsert.dateUpdated = Date.now() //Used dateUpdated because we are inserting new products on n EXISTING sale order
        //setSaleOrderInsert (JSON.parse (JSON.stringify ({...emptySaleOrderInsert}) ) );
        setSaleOrderInsert ({..._saleOrderInsert}) ;

        let _saleOrderUpdate = JSON.parse( JSON.stringify ({...emptySaleOrderUpdate}) )
        _saleOrderUpdate.dateUpdated = Date.now()
        //setSaleOrderUpdate (JSON.parse (JSON.stringify ({...emptySaleOrderUpdate}) ) );
        setSaleOrderUpdate ( {..._saleOrderUpdate} );

        setDisableEmployeeDropDown(true); // Once selected employee may not be changed because pricelist products composition may vary
        setEditSaleOrderProductsDialog(true);
    };

    const hideEditSaleOrderProductsDialog = () => {

        //console.log ('saleOrderListUndo', saleOrderListUndo);
        setSaleOrderList(JSON.parse(JSON.stringify(saleOrderListUndo)));
        //console.log ('saleOrderEdited', saleOrderEditedUndo);
        setSaleOrderEdited(JSON.parse(JSON.stringify(saleOrderEditedUndo)));

        setProductsSource([]);
        setProductsTarget([]);
        //setSubmitted(false); // used for input control in form, not in use
        setSelectedSaleOrderProducts([]);
        setDisableEditor(true) //disable Sale order editor
        setDisableAddProduct (true) //disable add products button
        setDisableRemoveProduct (true) //disable remove products button
        setDisableUnitQuantityEditor(true) //disable quantity editor
        setEditSaleOrderProductsDialog(false); //close dialog
    }

    const openAddSelectedProductsDialog = () => {  //Opens Add Product List Dialog. Here is generated the list of products available to be selected in the addSelectedProducts function    
        console.log ('# openAddSelectedProductsDialog #');

        let _saleOrderProductList = [ ...saleOrderEdited.saleOrderProducts];
        let _productsSource = [...productsSource];
        let _products = [...products]; // Shallow copy to reference array

        console.log ('_saleOrderProductList', _saleOrderProductList);
        console.log ('_productsSource', _productsSource);
        console.log ('_products', _products);
        
        
        for (const prod of _products) { //Filter product list to show only the ones not already included in the list
            let alreadyInSaleOrder, alreadyInSource = false;

            _saleOrderProductList.forEach ( (_priceListProd) => {
                //console.log ('prod.id && prod.id: ', prod.id, _priceListProd.id);
                if (prod.id === _priceListProd.id ) { alreadyInSaleOrder = true }
            });

            _productsSource.forEach ( (_sourceProd) => {
                if (prod.id === _sourceProd.id ) { alreadyInSource = true }
            })

            if ( !alreadyInSaleOrder && !alreadyInSource) { _productsSource.push (prod) };
        };

        //console.log ('_productsSource', _productsSource);

        setProductsSource(_productsSource); // sets updated list in the UI (react component)
        //setProductsTarget ([]);
        //setDisableAddProduct (false);
        setAddSaleOrderProductDialog(true);
    };

    const hideAddSelectedProductsDialog = () => { //close Add Product List Dialog.
        
        //setSaleOrderList (JSON.parse(JSON.stringify(saleOrderListUndo)));
        //console.log ('saleOrderEdited', saleOrderEdited);
        //setSaleOrderEdited (JSON.parse(JSON.stringify(saleOrderEditedUndo)));
        //console.log ('saleOrderProductsUpdate', saleOrderProductsUpdate);
        //setSaleOrderUpdate (JSON.parse(JSON.stringify(saleOrderProductsUpdateUndo)));
        //setSaleOrderProductList (JSON.parse(JSON.stringify(saleOrderProductListUndo)));
        
        setSelectedSaleOrderProducts ([]);
        setProductsSource([]);
        setProductsTarget([]);
        //setSubmitted(false); // used for input control in form, not in use

        setAddSaleOrderProductDialog(false);
    }

    const openConfirmSaleOrderDialog = () => {  // Single delete dialog confirmation

        //setInventoryIndexCardTransactionEdited ( {...emptyInventoryIndexCardTransaction} )
        setConfirmSaleOrderDialog (true);
    }

    const hideConfirmSaleOrderDialog = () => {
        setConfirmSaleOrderDialog (false);
    }

    const openDeleteSingleSaleOrderDialog = (rowData) => {  // Single deletetion dialog confirmation
        setSaleOrderEdited ( { ...rowData} );
        setDeleteSaleOrderDialog(true);
    }

    const hideDeleteSaleOrderDialog = () => {
        setDeleteSaleOrderDialog(false);
    }

    const openRemoveSelectedProductsDialog = () => {
        console.log ('# openRemoveSelectedProductsDialog #');

        let _saleOrderProductList = [...saleOrderEdited.saleOrderProducts]; // Shallow copy to reference array
   
        setProductsSource(_saleOrderProductList); // sets updated list in the UI (react component)
        //setDisableRemoveProduct (false);
        setRemoveProductsDialog(true);
    };

    const hideRemoveProductsDialog = () => {
        setProductsSource ([]);
        setProductsTarget ([]);
        setSelectedSaleOrderProducts ([]);
        setRemoveProductsDialog(false);
    }

    const openDeleteSelectedSaleOrdersDialog = () => {
        setDeleteSaleOrdersDialog(true);
    }

    const hideDeleteSelectedSaleOrdersDialog = () => {
        setSelectedSaleOrders([]);
        setDeleteSaleOrdersDialog(false);
    };

    const confirmDeleteSaleOrderProduct = (rowData) => {  // Only in use when trash can icon action is added to actionBodyTemplate in datatable for individual products
        setSaleOrderProductEdited({ ...rowData});
        setDeleteSaleOrderProductDialog(true);
    }

    const hideDeleteSaleOrderProductDialog = () => { // Only in use when trash can icon action is added to actionBodyTemplate in datatable for individual products
        setDeleteSaleOrderProductDialog(false); 
    }


    /////////////////////
    // Event Functions
    /////////////////////

    const onChangeCustomer = (event) => {
        console.log ('# onChangeCustomer #');

        const val =  event.target.value || null;
        let _saleOrderEdited = { ...saleOrderEdited };
        let _saleOrderInsert = { ...saleOrderInsert };
        let _saleOrderUpdate = { ...saleOrderUpdate };

        //console.log ('val: ', val);

        _saleOrderEdited.customer = { id: val.id || null, name: val.name || ''};
        //(_saleOrderEdited.id) ? _saleOrderEdited.dateUpdated = Date.now() : _saleOrderEdited.dateCreated = Date.now();
 
        if (_saleOrderUpdate.dateUpdated) {
            _saleOrderUpdate.id = _saleOrderEdited.id;
            _saleOrderUpdate.customer = _saleOrderEdited.customer;
            //_saleOrderUpdate.dateUpdated = _saleOrderEdited.dateUpdated; // time stamp for updates
            setSaleOrderUpdate (_saleOrderUpdate);
        } 
        
        if (_saleOrderInsert.dateCreated) {
            _saleOrderInsert.customer = _saleOrderEdited.customer;
            //_saleOrderInsert.dateCreated = _saleOrderEdited.dateCreated; // it only required once for inserts, so placed here because customer is a required field
            setSaleOrderInsert (_saleOrderInsert);
            // addDefaultSaleOrderProducts(); // Uncommnent to use
        }

        setSelectedCustomer(val);
        setSaleOrderEdited(_saleOrderEdited);
    }

    const onChangeDiscount = (event, prop) => {
        console.log ('# onChangeDiscount #');

        const val = event.target.value
        let _saleOrderEdited = { ...saleOrderEdited };
        let _saleOrderInsert = {...saleOrderInsert}; //to capture new sale order inserts
        let _saleOrderUpdate = {...saleOrderUpdate}; //to capture sale order updates
        
        //console.log ('_saleOrderUpdate', _saleOrderUpdate);

        _saleOrderEdited.discount = val / 100;
        //(_saleOrderEdited.id) ? _saleOrderEdited.dateUpdated = Date.now() : _saleOrderEdited.dateCreated = Date.now();

        if (_saleOrderUpdate.dateUpdated) {
            _saleOrderUpdate.id = _saleOrderEdited.id;
            _saleOrderUpdate.discount = _saleOrderEdited.discount; //to capture just modifications to price list settings
            //_saleOrderUpdate.dateUpdated = _saleOrderEdited.dateUpdated; // time stamp for updates
            setSaleOrderUpdate(_saleOrderUpdate); //to capture just modifications to price list settings
        }

        if (_saleOrderInsert.dateCreated) {
            _saleOrderInsert.discount = _saleOrderEdited.discount; //to capture just modifications to price list settings
            setSaleOrderInsert (_saleOrderInsert); //to capture just modifications to price list settings
        }

        setInputDate (val);
        setSaleOrderEdited(_saleOrderEdited);

    }

    const onChanegOtherTaxes = (event) => {
        console.log ('# onChangeVATax #');

        const val = event.target.value
        let _saleOrderEdited = { ...saleOrderEdited };
        let _saleOrderInsert = {...saleOrderInsert}; //to capture new sale order settings insert
        let _saleOrderUpdate = {...saleOrderUpdate}; //to capture just modifications to sale order settings
        //console.log ('_saleOrderUpdate', _saleOrderUpdate);

        _saleOrderEdited.otherTaxes = val / 100;
        _saleOrderEdited.amountTotal = _saleOrderEdited.amountSubTotal * (_saleOrderEdited.VATax + _saleOrderEdited.otherTaxes + 1) ;
        //(_saleOrderEdited.id) ? _saleOrderEdited.dateUpdated = Date.now() : _saleOrderEdited.dateCreated = Date.now();

        console.log ('_saleOrderEdited.amountSubTotal', _saleOrderEdited.amountSubTotal)

        if (_saleOrderUpdate.dateUpdated) { // If sale order already exist it is an update
            _saleOrderUpdate.id = _saleOrderEdited.id;
            _saleOrderUpdate.otherTaxes = _saleOrderEdited.otherTaxes;
            _saleOrderUpdate.amountTotal = _saleOrderEdited.amountTotal
            //_saleOrderUpdate.dateUpdated = _saleOrderEdited.dateUpdated; // time stamp for updates
            setSaleOrderUpdate(_saleOrderUpdate); //to capture just modifications to price list settings
        } 
        
        if (_saleOrderInsert.dateCreated) {
            _saleOrderInsert.otherTaxes = _saleOrderEdited.otherTaxes; //to capture just modifications to price list settings
            _saleOrderInsert.amountTotal = _saleOrderEdited.amountTotal
            setSaleOrderInsert (_saleOrderInsert); //to capture just modifications to price list settings
        }

        setInputOtherTaxes (val);
        setSaleOrderEdited(_saleOrderEdited);

    }

    const onChangeVATax = (event) => {
        console.log ('# onChangeVATax #');

        const val = event.target.value
        let _saleOrderEdited = { ...saleOrderEdited };
        let _saleOrderInsert = { ...saleOrderInsert }; //to capture new sale order settings insert
        let _saleOrderUpdate = { ...saleOrderUpdate }; //to capture just modifications to sale order settings
        //console.log ('_saleOrderUpdate', _saleOrderUpdate);
        _saleOrderEdited.amountSubTotal = 0

        _saleOrderEdited.VATax = val / 100;
        _saleOrderEdited.saleOrderProducts.forEach( (_saleOrderProductEdited) => {
            _saleOrderProductEdited.VATax = _saleOrderEdited.VATax
            _saleOrderProductEdited.subTotalWithVATax = _saleOrderProductEdited.subTotal * (_saleOrderProductEdited.VATax + 1); // Addition of VAT to subtotal
            _saleOrderProductEdited.subTotalWithVATax = Math.round((_saleOrderProductEdited.subTotalWithVATax + Number.EPSILON) * 100) / 100
            //_saleOrderEdited.amountSubTotal += _saleOrderProductEdited.subTotalWithVATax
            
            _saleOrderEdited.amountSubTotal += _saleOrderProductEdited.subTotal
        });
        _saleOrderEdited.amountTotal = _saleOrderEdited.amountSubTotal * (_saleOrderEdited.VATax + _saleOrderEdited.otherTaxes + 1)
 
        //if (_saleOrderEdited.id) { _saleOrderEdited.dateUpdated = Date.now() } else  { _saleOrderEdited.dateCreated = Date.now() }

        if (_saleOrderUpdate.dateUpdated) { // If sale order is being edited (edit sale order option), means already exist and it is an update
            _saleOrderUpdate.id = _saleOrderEdited.id;
            _saleOrderUpdate.VATax = _saleOrderEdited.VATax;
            _saleOrderUpdate.amountSubTotal = _saleOrderEdited.amountSubTotal
            _saleOrderUpdate.amountTotal = _saleOrderEdited.amountTotal

            _saleOrderEdited.saleOrderProducts.forEach( (_saleOrderProductEdited) => { // I take all products from the sale order and update VAT and related VAT amounts 
                console.log ('saleOrderProductEdited:', _saleOrderProductEdited)
                _saleOrderUpdate.saleOrderProducts.push ( { // Add alll changes to saleOrderUpdate to persist data
                    id: _saleOrderProductEdited.id, 
                    productSaleOrderId: _saleOrderProductEdited.productSaleOrderId, 
                    VATax: _saleOrderProductEdited.VATax, 
                    subTotalWithVATax: _saleOrderProductEdited.subTotalWithVATax, 
                    dateUpdated: _saleOrderUpdate.dateUpdated} )
            });
            _saleOrderUpdate.dateUpdated = _saleOrderEdited.dateUpdated; // time stamp for updates
            console.log ('_saleOrderUpdate:', _saleOrderUpdate)
            setSaleOrderUpdate(_saleOrderUpdate); //to capture just modifications to price list settings
        } 
        
        if (_saleOrderInsert.dateCreated) { // If its a new sale order (new sale order option), means an insert will be made in db
            _saleOrderInsert.VATax = _saleOrderEdited.VATax; //to capture just modifications to price list settings
            _saleOrderInsert.amountSubTotal = _saleOrderEdited.amountSubTotal
            _saleOrderInsert.amountTotal = _saleOrderEdited.amountTotal
            _saleOrderInsert.saleOrderProducts = _saleOrderEdited.saleOrderProducts // On insert I will put all products with all attributes.
            //_saleOrderInsert.dateCreated = _saleOrderEdited.dateCreated
            setSaleOrderInsert (_saleOrderInsert); //to capture just modifications to price list settings
        }

        setInputVATax (val);
        setSaleOrderEdited(_saleOrderEdited);

    }

    const onChangePaymentMethodDropDown = (event) => {
        console.log('# onChangePaymentMethodDropDown #');

        const val =  event.target.value || null;
        let _saleOrderEdited = { ...saleOrderEdited };
        let _saleOrderInsert = { ...saleOrderInsert };
        let _saleOrderUpdate = { ...saleOrderUpdate };

        _saleOrderEdited.paymentMethod = { id: val.id || null, type: val.type || '' };
        //(_saleOrderEdited.id) ? _saleOrderEdited.dateUpdated = Date.now() : _saleOrderEdited.dateCreated = Date.now();

        if (_saleOrderUpdate.dateUpdated) { // If it's an existing sale order
            _saleOrderUpdate.id = _saleOrderEdited.id;
            _saleOrderUpdate.paymentMethod = _saleOrderEdited.paymentMethod;
            _saleOrderUpdate.dateUpdated = _saleOrderEdited.dateUpdated // time stamp for updates
            setSaleOrderUpdate (_saleOrderUpdate);
        }
        
        if (_saleOrderInsert.dateCreated) { // if it's a new sale order
            _saleOrderInsert.paymentMethod = _saleOrderEdited.paymentMethod;
            setSaleOrderInsert (_saleOrderInsert);
        }

        setSelectedPaymentMethod(val);
        setSaleOrderEdited (_saleOrderEdited);
    };

    const onChangeEmployee = async (event) => { //Changing the seller is not just that, means changing product prices according to seller asociated pricelist 
        console.log ('# onChangeEmployee #');

        console.log ('event: ', event);
        const val =  event.target.value || 0;
        let _saleOrderEdited = { ...saleOrderEdited };
        let _saleOrderInsert = { ...saleOrderInsert };
        let _saleOrderUpdate = { ...saleOrderUpdate };
        _saleOrderEdited.amountSubTotal = 0
        //console.log ('val: ', val);

        _saleOrderEdited.employee = { id: val.id || null, name: val.fullName || '', priceListId: val.priceList.id || -1};

        //(_saleOrderEdited.id) ? _saleOrderEdited.dateUpdated = Date.now() : _saleOrderEdited.dateCreated = Date.now();

        if (_saleOrderUpdate.dateUpdated) { // If it's an existing sale order
            _saleOrderUpdate.id = _saleOrderEdited.id;
            _saleOrderUpdate.employee = _saleOrderEdited.employee;
            _saleOrderUpdate.dateUpdated = _saleOrderEdited.dateUpdated // time stamp for updates
            setSaleOrderUpdate (_saleOrderUpdate);
        } 
        if (_saleOrderInsert.dateCreated) { // if it's a new sale order
            await fetchProductListData(productListType, _saleOrderEdited.employee.priceListId); // Get product list to be used in addSelectedProduct function
            _saleOrderInsert.employee = _saleOrderEdited.employee;
            setSaleOrderInsert (_saleOrderInsert);
        }

        setDisableAddProduct(false); // Only allows to add products if seller is set.
        setSelectedEmployee(val);
        setSaleOrderEdited(_saleOrderEdited);

    }

    const onChangeStatus = (event, dataTableProps) => {
        console.log ('# onChangeStatus #');

        //console.log ('event: ', event);
        console.log ('dataTableProps: ', dataTableProps);
        
        const val =  event.target.value || null;
        let _saleOrderEdited = null;
        (dataTableProps) ? _saleOrderEdited = { ...dataTableProps.rowData } : _saleOrderEdited = { ...saleOrderEdited };
        let _saleOrderInsert = { ...saleOrderInsert };
        let _saleOrderUpdate = { ...saleOrderUpdate };

        //console.log ('val: ', val);
        console.log ('_saleOrderEdited: ', _saleOrderEdited);
        
        //console.log ('_saleOrderUpdate: ', _saleOrderUpdate);

        _saleOrderEdited.status.id = val.id || null;
        _saleOrderEdited.status.code = val.code || '';
        _saleOrderEdited.status.name = val.name || '';
        _saleOrderEdited.status.group = val.group || '';
        //(_saleOrderEdited.id) ? _saleOrderEdited.dateUpdated = Date.now() : _saleOrderEdited.dateCreated = Date.now();

        if ( ( _saleOrderEdited.status.code === 400) || ( _saleOrderEdited.status.code === 600) ) { //Checks if sale order is confirmed or cancelled. If yes, confirmationDate control field is updated
            _saleOrderEdited.confirmationDate = Date.now();
            console.log ('_saleOrderEdited.confirmationDate : ', _saleOrderEdited.confirmationDate );
        }

        if (_saleOrderUpdate.dateUpdated) { // Existing sale order ?

            _saleOrderUpdate.id = _saleOrderEdited.id;
            _saleOrderUpdate.status = _saleOrderEdited.status;

            console.log ('_saleOrderUpdate.confirmationDate : ', _saleOrderUpdate.confirmationDate );

            if ( (_saleOrderEdited.saleOrderProducts.length > 0) && ( _saleOrderEdited.status.code === 400) ) { //Checks if sale order has products. If not, PENDING status wont be changed AND If its confirmed ( code = 400) it will update the inventory of each sale orer product
                setConfirmSaleOrder (true)
                _saleOrderUpdate.saleOrderProducts = _saleOrderEdited.saleOrderProducts;
                _saleOrderUpdate.confirmationDate = _saleOrderEdited.confirmationDate;
            }

            if ( _saleOrderEdited.status.code === 600) { //Checks if sale order status is CANCELLED ( code = 600). If it is, it will change sale order status.
                setCancelSaleOrder (true)
                _saleOrderUpdate.confirmationDate = _saleOrderEdited.confirmationDate;
            }

            _saleOrderUpdate.dateUpdated = Date.now(); // time stamp for updates

            setSaleOrderUpdate (_saleOrderUpdate);
        } 
        
        if (_saleOrderInsert.dateCreated) {
            _saleOrderInsert.status = _saleOrderEdited.status;
            setSaleOrderInsert (_saleOrderInsert);
        }

        console.log ('_saleOrderEdited: ', _saleOrderEdited);
        console.log ('_saleOrderUpdate: ', _saleOrderUpdate);

        setSelectedStatus(val);
        setSaleOrderEdited(_saleOrderEdited);
        openConfirmSaleOrderDialog (true)
    }  

    const onFocusUnitQuantity = (event) => {
        console.log ('# onFocusUnitQuantity #');

        event.target.select();
    };

    const onFocusVAT = (event) => {
        console.log ('# onFocusVAT #');

        event.target.select();
    };

    const onBlurUnitQuantity = (event, dataTableProps) => {
        console.log ('# onBlurUnitQuantity #');

    };

    const onEditorInit = (dataTableProps) => {
        console.log ('# onEditorInit #');
        console.log ('dataTableProps', dataTableProps);
    };

    const onEditorSubmit = (event) => {
        console.log ('# onEditorSubmit #');
        console.log ('event', event);
    };

    const onEditorCancel = (event) => {
        console.log ('# onEditorCancel #');
        console.log ('event', event);
        //setDisableSubmit (false)
        console.log ('disableSubmit', disableSubmit);
    };

    const onBeforeEditorShow = () => {
        console.log ('# onBeforeEditorShow #');
        return;
    };

    const onBeforeEditorHide = () => {
        console.log ('# onBeforeEditorHide #');
        return;
    };

    const updateSaleOrderProductNetSellPrice = (_saleOrder) => {
        console.log('# updateSaleOrderProductNetSellPrice #');

        console.log('_saleOrder ', _saleOrder);

        let _priceListEdited = { ..._saleOrder }
 
        console.log ('_priceListEdited', _priceListEdited);

        _priceListEdited.saleOrderProducts.forEach ( (_productEdited) => {
            _productEdited.netPrice=0
        });

    }

    const validateEditorInput = (event) => { // according to onChangeUnitQuantityValidator results, enables or disable OK button used to submit change
        console.log ('# validateEditorInput #');

        console.log ('event.columnProps', event.columnProps);

        let validInput = onChangeUnitQuantityValidator(event.columnProps); // check if valid quantity input
        let enableSubmit = validInput //If valid quantity input then submit is enable
        let validEditorInput = validInput //If valid quantity and editable product then editor validator is true.

        console.log ('validInput ', validInput, '\n');
        console.log ('enableSubmit ', enableSubmit, '\n');
        console.log ('validEditorInput ', validEditorInput, '\n');

        setDisableSubmit (!enableSubmit); //if enable submit is true I need to convert it to false to NOT disable it.

        return validEditorInput;

    };

    const onChangeUnitQuantityValidator = (_dataTableProps) => { // Validates input value during cell edition to verify quntity doesnt decrease stock below minimum stock level
        console.log ('# onChangeUnitQuantityValidator #');

        console.log ('_dataTableProps', _dataTableProps);

        let unitQuantity = _dataTableProps.rowData.unitQuantity;
        let minimumStock = _dataTableProps.rowData.productInventory.minimumStock;
        let calculatedQuantityBalance = 0;
        let validQuantity = 0

        if (_dataTableProps.rowData.productInventory) { // Because product can be already in productSaleOrder table or beig added from productPriceList table, both DTOs ( productSaleOrderDTO or productDTO('saleOrder') ) have the same attribute productInvemtory
            calculatedQuantityBalance = _dataTableProps.rowData.productInventory.calculatedQuantityBalance 
        }

        //console.log ('unitQuantity ', unitQuantity, '\n');
        //console.log ('minimumStock ', minimumStock, '\n');
        console.log ('calculatedQuantityBalance ', calculatedQuantityBalance, '\n');
        //console.log ('disableUnitQuantityEditor', disableUnitQuantityEditor);

        if (unitQuantity > 0) {
            validQuantity = ( unitQuantity > ( calculatedQuantityBalance - minimumStock) ) ? false : true ;
        }

        console.log ('validQuantity ', validQuantity, '\n');

        return validQuantity;

    };

    const onChangeUnitQuantityEditor = (event, dataTableProps) => { // Only used during edition of sale order. Used to edit existing productos or new adedd products
        console.log ('# onChangeUnitQuantityEditor #');

        //console.log ('event', event);
        const val = (event.value) ? event.value : dataTableProps.rowData.unitQuantity; // If not unitQuanity input it gets default value
        let _saleOrderEdited = { ...saleOrderEdited };
        let _saleOrderInsert = { ...saleOrderInsert };
        let _saleOrderUpdate = { ...saleOrderUpdate };
        let _saleOrderProductEdited = {  ...emptySaleOrderProduct } // needed to calculate subTotal
        //let _unitSellPrice = 0; // needed to calculate subTotal
        if (dataTableProps) { _saleOrderProductEdited = dataTableProps.rowData }
        _saleOrderEdited.amountSubTotal = 0 //Always initialize to zero before calculation
        
        //console.log('val', val);
        //console.log ('dataTableProps ', dataTableProps);
        //console.log('_netSellPrice', _netSellPrice);

        console.log ('_saleOrderEdited', _saleOrderEdited);
        console.log ('_saleOrderProductEdited', _saleOrderProductEdited);

        //(_saleOrderEdited.id) ? _saleOrderEdited.dateUpdated = Date.now() : _saleOrderEdited.dateCreated = Date.now(); // we are always editing a pre-existing order in current code design
        _saleOrderProductEdited.unitQuantity = val;
        _saleOrderProductEdited.subTotal = val * _saleOrderProductEdited.unitSellPrice;
        _saleOrderProductEdited.VATax = _saleOrderEdited.VATax;
        _saleOrderProductEdited.subTotalWithVATax = _saleOrderProductEdited.subTotal * (_saleOrderProductEdited.VATax + 1); // Addition of VAT to subtotal
        //_saleOrderProductEdited.subTotalWithVATax = Math.round( (_saleOrderProductEdited.subTotalWithVATax + Number.EPSILON) * 100) / 100
        
        (_saleOrderProductEdited.id) ? _saleOrderProductEdited.dateUpdated = Date.now() : _saleOrderProductEdited.dateCreated = Date.now();

        _saleOrderEdited.saleOrderProducts.forEach( (_saleOrderProductEdited) => {
            //_saleOrderEdited.amountSubTotal += _saleOrderProductEdited.subTotalWithVATax
            _saleOrderEdited.amountSubTotal += _saleOrderProductEdited.subTotal
        });
        _saleOrderEdited.amountTotal = _saleOrderEdited.amountSubTotal * (_saleOrderEdited.VATax + _saleOrderEdited.otherTaxes + 1) ;
        
        console.log ('_saleOrderEdited', _saleOrderEdited);
        console.log ('_saleOrderInsert', _saleOrderInsert);
        console.log ('_saleOrderUpdate', _saleOrderUpdate);
        console.log ('_saleOrderProductEdited', _saleOrderProductEdited);


        if (_saleOrderProductEdited.productSaleOrderId) { // If its a product already included in the order.

            _saleOrderUpdate.id = _saleOrderEdited.id
            _saleOrderUpdate.amountSubTotal = _saleOrderEdited.amountSubTotal
            _saleOrderUpdate.amountTotal = _saleOrderEdited.amountTotal
            //_saleOrderUpdate.dateUpdated = _saleOrderEdited.dateUpdated;

            const index = _saleOrderUpdate.saleOrderProducts.findIndex (_saloProduct => _saloProduct.id === _saleOrderProductEdited.id );
            if (index >= 0) { // Checks if it is an edition of a product already added to _saleOrderUpdate.saleOrderProducts array 
                _saleOrderUpdate.saleOrderProducts[index].unitQuantity = _saleOrderProductEdited.unitQuantity;
                _saleOrderUpdate.saleOrderProducts[index].subTotal = _saleOrderProductEdited.subTotal;
                _saleOrderUpdate.saleOrderProducts[index].VATax = _saleOrderProductEdited.VATax;
                _saleOrderUpdate.saleOrderProducts[index].subTotalWithVATax = _saleOrderProductEdited.subTotalWithVATax;
                _saleOrderUpdate.saleOrderProducts[index].dateUpdated = _saleOrderProductEdited.dateUpdated; // time stamp for updates
            } else { // Editing a product that is not already in _saleOrderUpdate.saleOrderProducts array
                _saleOrderUpdate.saleOrderProducts.push ( { 
                    id: _saleOrderProductEdited.id, 
                    productSaleOrderId: _saleOrderProductEdited.productSaleOrderId, 
                    unitQuantity: _saleOrderProductEdited.unitQuantity, 
                    subTotal: _saleOrderProductEdited.subTotal, 
                    VATax:  _saleOrderProductEdited.VATax, 
                    subTotalWithVATax: _saleOrderProductEdited.subTotalWithVATax, 
                    dateUpdated: _saleOrderProductEdited.dateUpdated });
            }
            setSaleOrderUpdate (_saleOrderUpdate);

        } else { // If its a new product in the order

            _saleOrderInsert.id = _saleOrderEdited.id
            _saleOrderInsert.amountSubTotal = _saleOrderEdited.amountSubTotal
            _saleOrderInsert.amountTotal = _saleOrderEdited.amountTotal
            //_saleOrderInsert.dateUpdated = _saleOrderUpdate.dateUpdated;

            const index = _saleOrderInsert.saleOrderProducts.findIndex (_product => _product.id === _saleOrderProductEdited.id );
            if (index >= 0) {
                //const index = findSaleOrderProductIndexById (_saleOrderProductEdited.id, _saleOrderInsert); // finds new added product_id to update it during editing before inserting it into transactions table in the db
                const index = _saleOrderInsert.saleOrderProducts.findIndex (_product => _product.id === _saleOrderProductEdited.id );
                _saleOrderInsert.saleOrderProducts[index].unitQuantity = _saleOrderProductEdited.unitQuantity; 
                _saleOrderInsert.saleOrderProducts[index].subTotal = _saleOrderProductEdited.subTotal;
                _saleOrderInsert.saleOrderProducts[index].VATax = _saleOrderProductEdited.VATax;
                _saleOrderInsert.saleOrderProducts[index].subTotalWithVATax = _saleOrderProductEdited.subTotalWithVATax;
                _saleOrderInsert.saleOrderProducts[index].dateCreated = _saleOrderProductEdited.dateCreated;
            } else {
                _saleOrderInsert.priceListProducts.push( { 
                    unitQuantity: _saleOrderProductEdited.unitQuantity, 
                    subTotal: _saleOrderProductEdited.subTotal, 
                    VATax: _saleOrderProductEdited.VATax, 
                    subTotalWithVATax: _saleOrderProductEdited.subTotalWithVATax, 
                    dateCreated: _saleOrderProductEdited.dateCreated } );
            }
            setSaleOrderInsert (_saleOrderInsert);

        }

        setInputUnitQuantity (val);
        setSaleOrderEdited (_saleOrderEdited);

    }

    const updateSaleOrderCalculatedAmountTotal = (_saleOrder) => {
        console.log ('# calculatedTotals #');

        let _saleOrderEdited = _saleOrder;

        _saleOrderEdited.saleOrderProducts.forEach( (_saleOrderProductEdited) => {
            _saleOrderEdited.amountSubTotal += _saleOrderProductEdited.subTotal
        });

        _saleOrderEdited.amountTotal += _saleOrderEdited.amountSubTotal * (_saleOrderEdited.VATax + _saleOrderEdited.otherTaxes + 1)

        console.log ('_saleOrderEdited.amountTotal', _saleOrderEdited.amountTotal)

       return _saleOrderEdited.amountTotal
    }

    const updateSaleOrderCalculatedAmountSubTotal = (_saleOrder) => {
        console.log ('# updateSaleOrderCalculatedAmountSubTotal #');

        let _saleOrderEdited = _saleOrder;

        _saleOrderEdited.saleOrderProducts.forEach( (_saleOrderProductEdited) => {
            _saleOrderEdited.amountSubTotal += _saleOrderProductEdited.subTotal
        });

        console.log ('_saleOrderEdited.amountSubTotal', _saleOrderEdited.amountSubTotal)

       return _saleOrderEdited.amountSubTotal
    }

   
    //////////////////////////////////////
    // Button Action Functions
    //////////////////////////////////////

    const addDefaultSaleOrderProducts = () => { // Not in use. Generates a sale order with preloaded active products. Called from event function onChangeCustomer
        console.log ('# addAllPriceListProducts #');

        let _saleOrderEdited = {...saleOrderEdited};
        let _saleOrderInsert = {...saleOrderInsert};
        //let _priceListProductsInsert = {...priceListProductsInsert};
        let _productsSource = [...productsSource];
        let _productsTarget = [...productsTarget];
        //setSubmitted(true); // used for input control in form, not in use

        console.log ('_saleOrderEdited', _saleOrderEdited);
        console.log ('_saleOrderInsert', _saleOrderInsert); 
        //console.log ('_priceListProductsInsert', _priceListProductsInsert); 
        console.log ('_productsSource', _productsSource);


        _productsTarget = JSON.parse( JSON.stringify (_productsSource) ); // Use assigment to add products because no selection made (should use addPriceListProducts or pick list if selection required). All existing products are added.

        _saleOrderEdited.saleOrderProducts = JSON.parse( JSON.stringify (_productsTarget) ); //Assigns selected products to the list

        _saleOrderInsert = JSON.parse( JSON.stringify (_saleOrderEdited) ); //Deep copy. Only on new price list (insert) all props are copied.

        console.log ('_saleOrderEdited: ', _saleOrderEdited);

        
        _saleOrderInsert.dateCreated = Date.now(); // created timestamp
        _saleOrderInsert.saleOrderProducts.forEach ( (prod) => {
            //console.log ('prod', prod);
            prod.dateCreated = Date.now(); // created timestamp for first time product is addedd
        });

        console.log ('_saleOrderInsert: ', _saleOrderInsert);
        //console.log ('_priceListProductsInsert: ', _priceListProductsInsert);

        setSaleOrderEdited (_saleOrderEdited);
        setSaleOrderInsert (_saleOrderInsert);
    };

    // Function to add products from sale order. UI changes are made on saleOrderEdited object and
    // only changes and new data are copied to saleOrderProductsInsert to be persisted (impacting linkProductSaleOrder table in db)
    //Use case: Add product to diplayed sale order and persist changed data only
    const addSelectedProducts = () => {
        console.log ('# addSelectedProducts #');

        let _saleOrderEdited = {...saleOrderEdited}; // Shallow copy to reference array
        let _saleOrderInsert = {...saleOrderInsert}; // Shallow copy to reference array
        let _productsTarget = [...productsTarget]; // Shallow copy to reference array
        let _selectedSaleOrderProducts = [...selectedSaleOrderProducts]; // Shallow copy to reference array

        //setDisableAddProduct (false);

        //(_saleOrderEdited.id) ? _saleOrderEdited.dateUpdated = Date.now() : _saleOrderEdited.dateCreated = Date.now(); // In sales order is always a existing sale order because products are added after saleOrder creation
        _productsTarget = _selectedSaleOrderProducts;
        _saleOrderEdited.saleOrderProducts = _saleOrderEdited.saleOrderProducts.concat (_productsTarget.filter( (prod) => _saleOrderEdited.saleOrderProducts.indexOf (prod) < 0) ) // This is done to avoid duplicates after concat already added with new added before hit ok button

        _saleOrderInsert.id = _saleOrderEdited.id
        _saleOrderInsert.saleOrderProducts = _productsTarget;

        _saleOrderInsert.saleOrderProducts.forEach ( (_prodEdited) => {
            //console.log ('_prodEdited', _prodEdited)
            _prodEdited.productSaleOrderId = null; // field must exist even it's a new product to be inserted, because needs to be used in DTO object creation.
            _prodEdited.VATax = _saleOrderEdited.VATax; // use same VATax applied for the SaleOrder
            _prodEdited.dateCreated = Date.now(); // timestamp updated
        });

        console.log ('_saleOrderEdited', _saleOrderEdited);
        console.log ('_productsTarget', _productsTarget);
        console.log ('_saleOrderInsert', _saleOrderInsert);

        setSaleOrderEdited (_saleOrderEdited);
        setSaleOrderInsert (_saleOrderInsert);
        setProductsTarget (_productsTarget);
        setProductsSource([]);
        setSelectedSaleOrderProducts ([]);
        setDisableEmployeeDropDown(true); //After product is added, seller dropdown will be disable to prevent inconsistency problems with price list products
        setAddSaleOrderProductDialog(false);
    };

    // Function to remove products from sale order. UI changes are made on saleOrderEdited object and
    // only changes and new data are copied to saleOrderProductsInsert to be persisted (impacting linkProductSaleOrder table in db)
    const OLDremoveSelectedProducts = () => {
        console.log ('# removeSelectedProducts #');

        let _saleOrderEdited = {...saleOrderEdited}; // Shallow copy to reference array
        let _saleOrderInsert = {...saleOrderInsert}; // Shallow copy to reference array
        let _saleOrderUpdate = {...saleOrderUpdate}; // Shallow copy to reference array
        let _productsSource = [...productsSource]; // Shallow copy to reference array
        let _productsTarget = [...productsTarget];
        let _selectedSaleOrderProducts = [...selectedSaleOrderProducts]; // Shallow copy to reference array

        //setDisableRemoveProduct(false);

        _productsTarget = _selectedSaleOrderProducts;
        _productsSource = _productsSource.filter ( (prod) => !_selectedSaleOrderProducts.includes (prod) ); // Filters selected prododucts marked for removal (can be just added or existing) to be removed also from UI
        //_productsTarget = _productsTarget.filter ( (prod) => !_selectedSaleOrderProducts.includes (prod) ); // Filter selected products marked for removal (can be just added or existing) from target list (wont be included in _saleOrderProductsUpdate.saleOrderProducts)
        _productsTarget = _productsTarget.filter ( (prod) =>  (prod.productSaleOrderId) ? true : false ); // Filters unexisting (dont have productSaleOrderId) selected products marked for removal from target list (wont be included in _saleOrderProductsUpdate.saleOrderProducts)
        _saleOrderInsert.saleOrderProducts = _saleOrderInsert.saleOrderProducts.filter ( (prod) => !_selectedSaleOrderProducts.includes (prod) ); // Filter selected products marked for removal (can be just added or existing) from target list (wont be included in _saleOrderProductsUpdate.saleOrderProducts)
        
        _saleOrderEdited.saleOrderProducts = _productsSource;

        _saleOrderUpdate.id = _saleOrderEdited.id;
        _saleOrderUpdate.saleOrderProducts = _saleOrderUpdate.saleOrderProducts.concat (_productsTarget);

        _saleOrderUpdate.saleOrderProducts.forEach ( (_prodEdited) => {
            //console.log ('_prodEdited.productSaleOrderId', _prodEdited.productSaleOrderId)
                _prodEdited.dateDeleted = Date.now();
        })

        console.log ('_saleOrderEdited', _saleOrderEdited);
        console.log ('_productsSource', _productsSource);
        console.log ('_productsTarget', _productsTarget);
        console.log ('_saleOrderUpdate', _saleOrderUpdate);
        console.log ('_saleOrderInsert', _saleOrderInsert);

        setSaleOrderEdited (_saleOrderEdited);
        setSaleOrderInsert (_saleOrderInsert);
        setSaleOrderUpdate (_saleOrderUpdate);
        setProductsTarget (_productsTarget);
        setProductsSource([]);
        setSelectedSaleOrderProducts ([]);
        setRemoveProductsDialog (false);
    };

    const removeSelectedProducts = () => {
        console.log ('# removeSelectedProducts #');

        let _saleOrderEdited = {...saleOrderEdited}; // Shallow copy to reference array
        //let _saleOrderInsert = {...saleOrderInsert}; // Shallow copy to reference array
        let _saleOrderUpdate = {...saleOrderUpdate}; // Shallow copy to reference array
        //let _productsSource = [...productsSource]; // Shallow copy to reference array
        let _productsTarget = [...productsTarget];
        let _selectedSaleOrderProducts = [...selectedSaleOrderProducts]; // Shallow copy to reference array

        _saleOrderEdited.saleOrderProducts = _saleOrderEdited.saleOrderProducts.filter ( (prod) => !_selectedSaleOrderProducts.includes (prod) ); // Filters selected prododucts marked for removal (can be just added or existing) to be removed also from UI

        _productsTarget = _selectedSaleOrderProducts.filter ( (prod) =>  (prod.productSaleOrderId) ? true : false ); // Filters unexisting (dont have productSaleOrderId) selected products marked for removal from target list (wont be included in _saleOrderProductsUpdate.saleOrderProducts)

        _saleOrderUpdate.id = _saleOrderEdited.id;
        _saleOrderUpdate.saleOrderProducts = _saleOrderUpdate.saleOrderProducts.concat (_productsTarget);
        _saleOrderUpdate.saleOrderProducts.forEach ( (_prodEdited) => {
            //console.log ('_prodEdited.productSaleOrderId', _prodEdited.productSaleOrderId)
            _prodEdited.dateDeleted = Date.now();
        })

        console.log ('_saleOrderEdited', _saleOrderEdited);
        //console.log ('_productsSource', _productsSource);
        console.log ('_productsTarget', _productsTarget);
        console.log ('_saleOrderUpdate', _saleOrderUpdate);
        //console.log ('_saleOrderInsert', _saleOrderInsert);

        setSaleOrderEdited (_saleOrderEdited);
        //setSaleOrderInsert (_saleOrderInsert);
        setSaleOrderUpdate (_saleOrderUpdate);
        setProductsTarget (_productsTarget);
        setProductsSource([]);
        setSelectedSaleOrderProducts ([]);
        setRemoveProductsDialog (false);
    };

    const deleteSelectedSaleOrders = () => {
        console.log ('# deleteSelectedSaleOrders #');

        let _saleOrderList = [...saleOrderList];
        let _selectedSaleOrders = [...selectedSaleOrders];
        let _saleOrderUpdate = {...saleOrderUpdate};

        _saleOrderList = _saleOrderList.filter(val => !_selectedSaleOrders.includes(val));
        setSaleOrderList(_saleOrderList);

        //console.log ('saleOrderList:', _saleOrderList );
        console.log ('selectedSaleOrders:', _selectedSaleOrders );

        _selectedSaleOrders.forEach ( async (_saleOrderEdited) => {
            //console.log(' _selectedSaleOrders _saleOrderEdited: ',_saleOrderEdited);

            _saleOrderUpdate.id = _saleOrderEdited.id; //timestamp updated
            _saleOrderUpdate.dateDeleted = Date.now(); // logical delte

            fetchSaleOrderData ({ ..._saleOrderEdited }); // Get products for selected price list

            _saleOrderEdited = { ...saleOrderEdited } // sets the edited price list to current price list in the array

            console.log('_saleOrderEdited.saleOrderProducts: ', _saleOrderEdited.saleOrderProducts);

            if (_saleOrderEdited.saleOrderProducts.length > 0) {

                _saleOrderUpdate.saleOrderProducts = _saleOrderEdited.saleOrderProducts;

                _saleOrderUpdate.saleOrderProducts.forEach( (prod) => {
                    prod.dateDeleted = Date.now(); //logical delete
                });

            }

            //console.log('_saleOrderUpdate: ', _saleOrderUpdate);
            saveSaleOrderProducts (null, _saleOrderUpdate)
        });

        setSelectedSaleOrders([]);
        setDeleteSaleOrdersDialog(false);
    };

    const OLDaddInventoryIndexCardTransaction = (_saleOrder, _type) => {
        console.log ('# addInventoryIndexCardTransaction #');

        //let _saleOrderEdited = {...saleOrderEdited};
        let _saleOrderEdited = null;
        (_saleOrder) ? _saleOrderEdited = {..._saleOrder} : _saleOrderEdited = {...saleOrderEdited};
        let _inventoryIndexCardEdited = {...emptyInventoryIndexCard};
        let _inventoryIndexCardTransactionEdited = {...emptyInventoryIndexCardTransaction};
        let _transactionsTarget = [...transactionsTarget];

        //console.log ('_saleOrderEdited', _saleOrderEdited);
        //console.log ('_inventoryIndexCardTransactionEdited', _inventoryIndexCardTransactionEdited);
        //console.log ('_inventoryIndexCardEdited', _inventoryIndexCardEdited);
        //console.log ('_transactionsTarget', _transactionsTarget);

        _saleOrderEdited.saleOrderProducts.forEach ( (prod) => {
            console.log ('prod: ', prod);
            _inventoryIndexCardTransactionEdited.unitQuantity = prod.unitQuantity * _type;
            _inventoryIndexCardTransactionEdited.type = _type;
            _inventoryIndexCardTransactionEdited.description = ( _type < 0 ) ? 'Decrece stock por venta' : 'Aumenta stock por cancelación de venta';
            _inventoryIndexCardTransactionEdited.inventoryIndexCardId = prod.productInventory.indexCardId; // Inventory index card id copied to transaction being edited / created
            //_inventoryIndexCardTransactionEdited.purchaseOrder = {id: 1, number: ''}; // 1 means no purchase order in place so manual input.
            _inventoryIndexCardTransactionEdited.saleOrder.id = _saleOrderEdited.id;
            //_inventoryIndexCardTransactionEdited.warehouseSlot = {id: 1, code:''}; // 1 default slot (lobby)
            _inventoryIndexCardTransactionEdited.dateCreated = Date.now(); //timestamp updated
            _inventoryIndexCardEdited.indexCardName = prod.productInventory.indexCardName; // Inventory index card name copied to transaction being edited / created
            _inventoryIndexCardEdited.product = { id: prod.id }; // product id copied to transaction being edited / created
            _inventoryIndexCardEdited.calculatedQuantityBalance = prod.productInventory.calculatedQuantityBalance; // Inventory quantity balance copied to transaction being edited / created
            _inventoryIndexCardEdited.lastTransactionDate = _inventoryIndexCardTransactionEdited.dateCreated; // Inventory quantity balance copied to transaction being edited / created
            _inventoryIndexCardEdited.dateUpdated = Date.now(); //timestamp updated
            _inventoryIndexCardEdited.transactions.push (_inventoryIndexCardTransactionEdited);
            _transactionsTarget.push (JSON.parse(JSON.stringify(_inventoryIndexCardEdited)));
        });

        console.log ('_inventoryIndexCardTransactionEdited', _inventoryIndexCardTransactionEdited);
        console.log ('_transactionsTarget', _transactionsTarget);
        console.log ('_inventoryIndexCardEdited', _inventoryIndexCardEdited);

        _transactionsTarget.forEach ( async (_inventoryIndexCardUpdate) => {

            // Insert
            if ( isNotEmpty(_inventoryIndexCardUpdate) ) { 
                if ( _inventoryIndexCardUpdate.transactions.length > 0 ) {

                    console.log ('_inventoryIndexCardUpdate: ', _inventoryIndexCardUpdate );

                    await updateInventoryIndexCard (_inventoryIndexCardUpdate); //updates PriceList table
                    await putInventoryIndexCardTransactions (_inventoryIndexCardUpdate); // DTO requires that the list object only contains added porducts on productList prop
                };
            };
        });

        //fetchInventoryIndexCardListData();

        //setInventoryIndexCardEdited (_inventoryIndexCardEdited);
        setTransactionsTarget ([]);
        //setInventoryIndexCardEdited ({});
        //setInventoryIndexCardTransactionEdited ({});

    };

    const addInventoryIndexCardTransaction = (_saleOrder, _type) => {
        console.log ('# addInventoryIndexCardTransaction #');

        //let _saleOrderEdited = {...saleOrderEdited};
        let _saleOrderEdited = null;
        (_saleOrder) ? _saleOrderEdited = {..._saleOrder} : _saleOrderEdited = {...saleOrderEdited};
        let _inventoryIndexCardUpdate = { transactions:[] };
        let _inventoryIndexCardTransactionInsert = {...emptyInventoryIndexCardTransaction};
        let _inventoryIndexCardUpdateTarget = [...transactionsTarget];

        //console.log ('_saleOrderEdited', _saleOrderEdited);
        //console.log ('_inventoryIndexCardTransactionInsert', _inventoryIndexCardTransactionInsert);
        //console.log ('_inventoryIndexCardUpdate', _inventoryIndexCardUpdate);
        //console.log ('_inventoryIndexCardUpdateTarget', _inventoryIndexCardUpdateTarget);

        _saleOrderEdited.saleOrderProducts.forEach ( (prod) => {
            console.log ('prod: ', prod);
            _inventoryIndexCardTransactionInsert.unitQuantity = prod.unitQuantity * _type;
            _inventoryIndexCardTransactionInsert.type = _type;
            _inventoryIndexCardTransactionInsert.description = ( _type < 0 ) ? 'Decrece stock por venta' : 'Aumenta stock por cancelación de venta';
            _inventoryIndexCardTransactionInsert.inventoryIndexCardId = prod.productInventory.indexCardId; // Inventory index card id copied to transaction being edited / created
            //_inventoryIndexCardTransactionInsert.purchaseOrder = {id: 1, number: ''}; // 1 means no purchase order in place so manual input.
            _inventoryIndexCardTransactionInsert.saleOrder = { id: _saleOrderEdited.id, number: _saleOrderEdited.number};
            //_inventoryIndexCardTransactionInsert.warehouseSlot = {id: 1, code:''}; // 1 default slot (lobby)
            _inventoryIndexCardTransactionInsert.dateCreated = Date.now(); //timestamp updated
            _inventoryIndexCardUpdate.id = prod.productInventory.indexCardId;
            _inventoryIndexCardUpdate.indexCardName = prod.productInventory.indexCardName; // Inventory index card name copied to transaction being edited / created
            _inventoryIndexCardUpdate.product = { id: prod.id }; // product id copied to transaction being edited / created
            _inventoryIndexCardUpdate.calculatedQuantityBalance = prod.productInventory.calculatedQuantityBalance - prod.unitQuantity; // Inventory quantity balance copied to transaction being edited / created
            _inventoryIndexCardUpdate.lastTransactionDate = _inventoryIndexCardTransactionInsert.dateCreated; // Inventory quantity balance copied to transaction being edited / created
            _inventoryIndexCardUpdate.dateUpdated = Date.now(); //timestamp updated
            _inventoryIndexCardUpdate.transactions.push (_inventoryIndexCardTransactionInsert); // It will be just one transaction per product per Inventory Index Card
            _inventoryIndexCardUpdateTarget.push (JSON.parse(JSON.stringify(_inventoryIndexCardUpdate)));
        });

        console.log ('_inventoryIndexCardTransactionInsert', _inventoryIndexCardTransactionInsert);
        console.log ('_inventoryIndexCardUpdateTarget', _inventoryIndexCardUpdateTarget);
        console.log ('_inventoryIndexCardUpdate', _inventoryIndexCardUpdate);

        _inventoryIndexCardUpdateTarget.forEach ( async (_inventoryIndexCardUpdate) => {

            // Insert
            if ( isNotEmpty(_inventoryIndexCardUpdate) ) { 
                if ( _inventoryIndexCardUpdate.transactions.length > 0 ) {

                    console.log ('_inventoryIndexCardUpdate: ', _inventoryIndexCardUpdate );

                    await updateInventoryIndexCard (_inventoryIndexCardUpdate); //updates PriceList table
                    await putInventoryIndexCardTransactions (_inventoryIndexCardUpdate); // DTO requires that the list object only contains added porducts on productList prop
                };
            };
        });

        //fetchInventoryIndexCardListData();

        //setInventoryIndexCardEdited (_inventoryIndexCardEdited);
        setTransactionsTarget ([]);
        //setInventoryIndexCardEdited ({});
        //setInventoryIndexCardTransactionEdited ({});

    };

    const addCheckingAccountTransaction = async (_saleOrder, _type) => {
        console.log ('# saveCheckingAccount #');

        let _checkAccTransactionEdited = { ...emptyCheckAccTransaction };
        let _checkingAccountUpdate = { transactions:[] };

        console.log ('_saleOrder: ', _saleOrder);

        // Update Checking Account 
        _checkingAccountUpdate.id = _saleOrder.customer.checkingAccountId
        _checkingAccountUpdate.dateUpdated = Date.now(); // created timestamp


        // Insert CheckAcc Transaction
        _checkAccTransactionEdited.checkingAccountId = _checkingAccountUpdate.id;
        _checkAccTransactionEdited.type = _type;
        _checkAccTransactionEdited.amount = _saleOrder.amountTotal;
        _checkAccTransactionEdited.paymentMethod = _saleOrder.paymentMethod;
        _checkAccTransactionEdited.description = `Presupuesto ${_saleOrder.number}`;
        _checkAccTransactionEdited.saleOrder.id = _saleOrder.id;
        _checkAccTransactionEdited.dateCreated = Date.now(); // created timestamp

        _checkingAccountUpdate.transactions.push (_checkAccTransactionEdited);

        await putCheckAccTransaction (_checkingAccountUpdate);
    }

    ////////////////////////////////////
    // Persist Data Functions
    // Save functions persist new / modified data into databases
    ////////////////////////////////////

    const saveSaleOrderSettings = async () => {
        console.log ('# saveSaleOrderSettings #');

        let _saleOrderList = [...saleOrderList];
        let _saleOrderEdited = {...saleOrderEdited};
        let _saleOrderInsert = {...saleOrderInsert};
        let _saleOrderUpdate = {...saleOrderUpdate};
        //let _saleOrderProductsInsert = {...saleOrderProductsInsert};
        //setSubmitted(true); // used for input control in form, not in use

        console.log ('_saleOrderEdited: ', _saleOrderEdited);
        console.log ('_saleOrderInsert', _saleOrderInsert);
        console.log ('_saleOrderUpdate', _saleOrderUpdate);

        if ( (selectedCustomer != null) && (selectedEmployee != null) ) {

            if (_saleOrderEdited.id) { // If has an Id then is not a new sale order and is updated in UI.

                const index = findSaleOrdersIndexById (_saleOrderEdited.id);                
                _saleOrderList[index] = _saleOrderEdited;
                setSaleOrderList(_saleOrderList);

            } else { // No realy need to insert in UI to update it, because the data table in UI will be reloaded from db after the insert.
                
                _saleOrderEdited.number = generateSaleOrderNumber() + 1 ;
                _saleOrderEdited.date = Date.now(); // created timestamp
                _saleOrderEdited.dateCreated = Date.now(); // created timestamp

                if ( _saleOrderEdited.saleOrderProducts.length > 0 ) {
                    _saleOrderEdited.saleOrderProducts.forEach ( (prod) => {
                        //console.log ('prod', prod)
                        prod.dateCreated = Date.now(); //timestamp updated
                    });
                }

                _saleOrderList.push (_saleOrderEdited);
                setSaleOrderList(_saleOrderList);
            }

            // Insert
            if ( isNotEmpty(_saleOrderInsert) ) {

                _saleOrderInsert.number = generateSaleOrderNumber() + 1 ;

                _saleOrderInsert.id = await putSaleOrder (_saleOrderInsert); //before insert on tblProductPriceList table, create a new price list in tblPriceList table and return ID created

                if ( _saleOrderInsert.saleOrderProducts.length > 0 ) { // If there are products preloaded during creation of the sale order.

                    _saleOrderInsert.saleOrderProducts.forEach ( (_prodEdited) => {
                        //console.log ('_prodEdited', _prodEdited)
                        _prodEdited.productSaleOrderId = _saleOrderInsert.id; // Id required to insert in table linkproductSaleOrder
                    });

                    console.log ('_saleOrderInsert: ', _saleOrderInsert );
                    await putProductSaleOrder (_saleOrderInsert); // Adds all active products in product table to the new price list.
                };
            };

            // Update / Delete
            if ( isNotEmpty(_saleOrderUpdate) ) { 

                //_saleOrderUpdate.id = _saleOrderEdited.id; // updated timestamp
                //_saleOrderUpdate.modifiedDate = Date.now(); // updated timestamp
                //_saleOrderUpdate.dateUpdated = Date.now(); // updated timestamp

                console.log ('_saleOrderUpdate: ', _saleOrderUpdate );
                await updateSaleOrder (_saleOrderUpdate, 'update'); // updates PriceList table
                console.log ('confirmSaleOrder: ', confirmSaleOrder );

                if ( _saleOrderUpdate.saleOrderProducts.length > 0 ) { 
                    //_saleOrderUpdate.dateUpdated = Date.now(); // updated timestamp
                    console.log ('_saleOrderUpdate: ', _saleOrderUpdate );
                    await updateProductSaleOrder (_saleOrderUpdate, 'update'); // DTO requires that the list object only contains removed porducts on productList prop
                };

                if (confirmSaleOrder) {
                    addInventoryIndexCardTransaction (_saleOrderUpdate, -1); // Inventory is updated only when status is changed to CONFIRMED
                    addCheckingAccountTransaction (_saleOrderEdited, 1) // Checking account is updated only when status is changed to CONFIRMED
                }
                /*
                console.log ('cancelSaleOrder: ', cancelSaleOrder );
                if (cancelSaleOrder) {
                    addInventoryIndexCardTransaction (_saleOrderUpdate, 1); // Inventory is updated only when status is changed to cacelled
                }
                */               
            };
        }

        saleOrderAmountTotalUpdate();
        fetchSaleOrderData();

        setDisableEditor(true) //disable Sale order editor
        setDisableAddProduct (true) //disable add products button
        setDisableRemoveProduct (true) //disable remove products button
        setDisableUnitQuantityEditor(true) //disable quantity editor
        setConfirmSaleOrder (false)
        setNewSaleOrderDialog(false);
        setEditSaleOrderSettingsDialog (false);
        setConfirmSaleOrderDialog (false)
    };

    const saveSaleOrderProducts = async (event, _saleOrder) => { //because it is a button (event driven object) if no parameter is passed during function call event info captured
        console.log ('# saveSaleOrderProducts #');

        let _saleOrderList = [...saleOrderList];
        let _saleOrderEdited = { ...saleOrderEdited };
        let _saleOrderInsert = { ...saleOrderInsert };
        let _saleOrderUpdate = null;       
        (_saleOrder) ? _saleOrderUpdate = { ..._saleOrder } : _saleOrderUpdate = { ...saleOrderUpdate };

        console.log ('_saleOrderEdited: ', _saleOrderEdited )
        //console.log ('_saleOrderSettingsUpdate: ', _saleOrderSettingsUpdate );
        console.log ('_saleOrderInsert: ', _saleOrderInsert );
        console.log ('_saleOrderUpdate: ', _saleOrderUpdate );

        // Updates UI
        if (_saleOrderEdited.id) { // If has an Id then is not a new sale order and is updated in UI.

            //const index = findSaleOrdersIndexById (_saleOrderEdited.id);
            const index = _saleOrderList.findIndex (_saleOrder => _saleOrder.id === _saleOrderEdited.id );
            _saleOrderList[index] = _saleOrderEdited;
            setSaleOrderList(_saleOrderList);

        } else { // No need to insert in UI to update it, because the data table in UI will be reloaded after the insert.
            /*
            _saleOrderEdited.number = generateSaleOrderNumber() + 1 ;
            _saleOrderEdited.date = Date.now(); // created timestamp
            _saleOrderEdited.dateCreated = Date.now(); // created timestamp
            _saleOrderEdited.dateUpdated = 0; // updated timestamp
            _saleOrderEdited.dateDeleted = 0; // updated timestamp

            if ( _saleOrderEdited.saleOrderProducts.length > 0 ) {
                _saleOrderEdited.saleOrderProducts.forEach ( (prod) => {
                    //console.log ('prod', prod)
                    prod.dateCreated = Date.now(); //timestamp updated
                    prod.dateUpdated = 0; //timestamp updated
                    prod.dateDeleted = 0; //timestamp updated
                });
            }

            _saleOrderList.push (_saleOrderEdited);
            setSaleOrderList(_saleOrderList);
            */
        }

        // Insert Products
        if ( isNotEmpty(_saleOrderInsert) ) { 
            if ( _saleOrderInsert.saleOrderProducts.length > 0 ) {

                console.log ('_saleOrderInsert: ', _saleOrderInsert );

                await updateSaleOrder (_saleOrderInsert, 'update'); //updates PriceList table
                await putProductSaleOrder (_saleOrderInsert); // DTO requires that the list object only contains added porducts on productList prop

            };
        };

        // Update / Delete Products
        if ( isNotEmpty(_saleOrderUpdate) ) { // Checks if there is a Sale Order Update

            console.log ('_saleOrderUpdate: ', _saleOrderUpdate );

            if (_saleOrderUpdate.dateUpdated) { // checks if it is a sale order update or delete
                await updateSaleOrder (_saleOrderUpdate, 'update'); // Updates tblPriceList table
            } else if (_saleOrderUpdate.dateDeleted) {
                await updateSaleOrder (_saleOrderUpdate, 'delete'); //updates PriceList table
            }

            if ( _saleOrderUpdate.saleOrderProducts.length > 0 ) { 

                if (_saleOrderUpdate.saleOrderProducts[0].dateUpdated) { // checks first element for operation type
                    await updateProductSaleOrder (_saleOrderUpdate, 'update'); // DTO requires that the list object only contains removed porducts on productList prop
                } else if (_saleOrderUpdate.saleOrderProducts[0].dateDeleted) {
                    await updateProductSaleOrder (_saleOrderUpdate, 'delete'); // DTO requires that the list object only contains removed porducts on productList prop
                }

            };

            if (confirmSaleOrder) {
                addInventoryIndexCardTransaction (_saleOrderUpdate, -1); // Inventory is updated only when status is changed to CONFIRMED
                addCheckingAccountTransaction (_saleOrderEdited, 1) // Checking account is updated only when status is changed to CONFIRMED
            }
        };

        saleOrderAmountTotalUpdate();
        fetchSaleOrderData();

        setProductsSource ([]);
        setProductsTarget ([]);
        setSaleOrderInsert (JSON.parse (JSON.stringify ( {...emptySaleOrderInsert} ) ) );
        setSaleOrderUpdate (JSON.parse (JSON.stringify ( {...emptySaleOrderUpdate} ) ) );
        setDisableEditor(true) //disable Sale order editor
        setDisableAddProduct (true) //disable add products button
        setDisableRemoveProduct (true) //disable remove products button
        setDisableUnitQuantityEditor(true) //disable quantity editor
        setEditSaleOrderProductsDialog (false)
    };

    const deleteSaleOrder = async () => { // Is called when trash can icon is clicked. Not in use (action must be added to actionBodyTemplate)

        let _saleOrderList = [...saleOrderList];
        let _saleOrderEdited = {...saleOrderEdited};
        let _saleOrderUpdate = {...saleOrderUpdate};

        //console.log('deleteSaleOrder _saleOrderEdited', _saleOrderEdited);

        _saleOrderList = _saleOrderList.filter ( so => so.id !== _saleOrderEdited.id );
        setSaleOrderList(_saleOrderList);

        _saleOrderUpdate.id = _saleOrderEdited.id; //timestamp updated
        _saleOrderUpdate.dateDeleted = Date.now(); //logical delete

        if (_saleOrderEdited.saleOrderProducts.length > 0){

            _saleOrderUpdate.saleOrderProducts = _saleOrderEdited.saleOrderProducts

            _saleOrderUpdate.saleOrderProducts.forEach( (prod) => {
                prod.dateDeleted = Date.now(); //logical delete
            });

            //await productSaleOrderService.updateProductSaleOrder(_saleOrderUpdate) //update persistent data source.
            //toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Presupuesto Borrado', life: 3000 });
            await updateProductSaleOrder (_saleOrderUpdate, 'delete') //update persistent data source.
    
        };

        //await saleOrderService.updateSaleOrder(_saleOrderUpdate) //update persistent data source.
        //toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Presupuesto Borrado', life: 3000 });
        await updateSaleOrder (_saleOrderUpdate, 'delete')  //update persistent data source.

        setDeleteSaleOrderDialog(false);
    };

    const deleteSaleOrderProduct = async () => { // Is called when trash can icon is clicked. Not in use (action must be added to actionBodyTemplate)

        let _saleOrderEdited = {...saleOrderEdited};
        let _saleOrderProductEdited = {...saleOrderProductEdited};
        let _saleOrderProducts = [..._saleOrderEdited.saleOrderProducts];

        _saleOrderEdited.dateUpdated = Date.now(); //logical delete
        _saleOrderProductEdited.dateDeleted = Date.now(); //logical delete

        _saleOrderProducts = _saleOrderProducts.filter(val => val.id !== _saleOrderProductEdited.id);

        setSaleOrderProductList(_saleOrderProducts);

        await updateSaleOrder (_saleOrderEdited) //update persistent data source.
        //toast.current.show({ severity: 'success', summary: 'Perfecto !', detail: 'Lista de Precio Borrada', life: 3000 });
        await updateProductSaleOrder (_saleOrderEdited) //update persistent data source.
        toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Presupuesto Borrado', life: 3000 });

        setDeleteSaleOrderDialog(false);
    }


    ///////////////////////////////
    // Supporting Functions
    //////////////////////////////

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const printPDF = (event) => {
        console.log('event', event)
        printToPDFService.sendPrintRequest();
    }

    const findSaleOrdersIndexById = (id) => {

        let _saleOrderList = [...saleOrderList];

        let index = -1;
        for (let i = 0; i < _saleOrderList.length; i++) {
            if (_saleOrderList[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    const findSaleOrderProductIndexById = (id, _saleOrderEdited) => {
        console.log('# findSaleOrderProductIndexById #');

        //console.log('_saleOrderEdited', _saleOrderEdited);

        let index = -1;
        for (let i = 0; i < _saleOrderEdited.saleOrderProducts.length; i++) {
            if (_saleOrderEdited.saleOrderProducts[i].id === id) {
                index = i;
                break;
            }
        }
        console.log('index', index);
        return index;
    }

    const generateSaleOrderNumber = () => {
        console.log ('# generateSaleOrderNumber #');

        let _saleOrderList = [...saleOrderList];
        let maxSaleOrderNumber = 0;
        //console.log ('_saleOrderList', _saleOrderList);

        for (let i = 0; i < _saleOrderList.length; i++) {
            if (_saleOrderList[i].number  > maxSaleOrderNumber) {
                maxSaleOrderNumber = _saleOrderList[i].number;
            } //else { maxSaleOrderNumber = 0 };
        }
        console.log ('maxSaleOrderNumber', maxSaleOrderNumber);
        return maxSaleOrderNumber;
    }
   
    // test empty objects

    // because Object.keys(new Date()).length === 0); we have to do some additional check
    // obj --> checks null and undefined
    // Object.keys(obj).length === 0 --> checks keys
    // obj.constructor === Object --> checks obj type: __proto__.constructor property equals f Object
    // return obj && Object.keys(obj).length === 0 && obj.constructor === Object
    function isNotEmpty(object) { 
        for(var i in object) { 
            return true; 
        } return false; 
    } 

    const statusEditor = (dataTableProps) => {
        console.log ('# statusEditor #');

        console.log ('dataTableProps: ', dataTableProps);
        let disableStatusEditor = (dataTableProps.rowData.confirmationDate) ? true : false; // If NOT a new product in sale order wont be editable. Else is editable so, input change is allowed.
        console.log ('disableStatusEditor: ', disableStatusEditor);
        return (
            <Dropdown id="statusDropdown" value={ dataTableProps.rowData.status } onChange={ (event) => {onChangeStatus (event, dataTableProps) } } options={statusList} optionLabel="name" dataKey="id" valueTemplate={selectedStatusTemplate} itemTemplate={saleOrderStatusItemTemplate} placeholder="Seleccione el Estado" scrollHeight='100px' autoWidth={false} autoFocus={true} disabled={disableStatusEditor}/>
        );
    }

    const unitQuantityEditor = (dataTableProps) => {
        console.log ('# unitQuantityEditor #');

        console.log ('dataTableProps', dataTableProps)
        //const validInput = ( dataTableProps.rowData.unitQuantity > ( dataTableProps.rowData.productInventory.calculatedQuantityBalance - dataTableProps.rowData.productInventory.minimumStock ) ) ? false : true;
 
        const validInput = onChangeUnitQuantityValidator(dataTableProps)
        //const disableUnitQuantityEditor = (dataTableProps.rowData.confirmationDate) ? true : false; // If it's already CONFIRMED / CANCELLED sale order wont be editable. Else (PENDING) new input is validated.
        return (
            <div> 
                <InputNumber id='unitQuantityInputNumber' value={dataTableProps.rowData.unitQuantity} onFocus={ (event) => onFocusUnitQuantity (event)} onChange={ (event) => onChangeUnitQuantityEditor (event, dataTableProps)} mode="decimal" locale="es-AR" placeholder ='00' className={ classNames({ 'p-invalid': !validInput }) }  size = {10} autoFocus = {true} disabled={disableUnitQuantityEditor} />
                { !validInput && <small className="p-invalid"> Stock insuficiente </small> }
            </div>
        )
    }

    ////////////////////////
    // Formating functions
    ////////////////////////

    const formatNumber = (value, places) => {
        (value) ? value = value : value = '0';
        //console.log('formatNumber', value);
        return String(value).padStart(places, '0')
    }

    const formatCurrency = (value) => {
        //console.log('formatCurrency', value);
        return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS'}); //cambiar símbolo 'USD' por variable y Locale 'en-US' por variable
    }

    const formatPercentage = (value) => {
        //console.log('formatPercent', value);
        return value.toLocaleString('es-AR', { style: 'percent', minimumFractionDigits:2 }); //cambiar símbolo 'USD' por variable y Locale 'en-US' por variable
        //mode="decimal" min={0} max={100} maxFractionDigits={2}  locale="es-AR" placeholder='000.00' suffix=' %'
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


    //////////////////////////////////////////////////
    // Datatable and Forms Layout formating functions
    //////////////////////////////////////////////////

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-auto" tooltip= 'Ver' onClick={ () => openViewSaleOrderDialog(rowData)} />
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-auto" tooltip= 'Editar' onClick={ () => openEditSaleOrderProductsDialog(rowData)} />
                {/* <Button icon="pi pi-cog" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-auto" tooltip= 'Configurar' onClick={() => openEditSaleOrderSettingsDialog(rowData)} /> */}
                {/* <Button icon="pi pi-trash p-c" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only" tooltip= 'Borrar' onClick={() => openDeleteSingleSaleOrderDialog(rowData)} /> */}
            </React.Fragment>
        );
    }

    const amountSubTotalBodyTemplate = (rowData) => {
        //console.log('amountBodyTemplate rowData',rowData)
        return (
            <React.Fragment>
                <span className="price-text">{`ARS`}</span> 
                <span className="price-text">{formatCurrency(rowData.amountSubTotal)}</span>
            </React.Fragment>
        );
    }

    const amountTotalBodyTemplate = (rowData) => {
        //console.log('amountBodyTemplate rowData',rowData)
        return (
            <React.Fragment>
                <span className="price-text">{`ARS`}</span> 
                <span className="price-text">{formatCurrency(rowData.amountTotal)}</span>
            </React.Fragment>
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

    const customerOptionTemplate = (option) => {
        //console.log ('employeeOptionTemplate option: ', option)
        return (
            <div className="customer-item">
                <div>{option.name}</div>
            </div>
        );
    };

    const dateBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {/* <span className="p-column-title">Date</span> */}
                <span>{formatDate (rowData.date)}</span>
            </React.Fragment>
        );
    }

    const discountBodyTemplate = (rowData) => {
        //console.log('# discountBodyTemplate #')
        //console.log('rowData',rowData)
        return (
            <React.Fragment>
                <span className="discount-formatedValue">{formatPercentage(rowData.discount || 0)}</span>
            </React.Fragment>
        );
    }

    const editSaleOrderProductBodyTemplate = (rowData) => {
        return (
           <React.Fragment>
                // <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-2" onClick={() => openEditSaleOrderSettingsDialog(rowData)} />
                <Button icon="pi pi-times p-c" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only" onClick={() => confirmDeleteSaleOrderProduct(rowData)} />
            </React.Fragment>
        );
    }

    const imageBodyTemplate = (rowData) => {
        return <img src={`assets/demo/images/product/${rowData.image}`} onError={(e) => e.target.src = 'assets/layout/images/avatar_4.png'} alt={rowData.image} className="saleOrder-image" />
    }

    const numberBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {/* <span className="p-column-title">Date</span> */}
                <span>{formatNumber (rowData.number, 7)}</span>
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

    const paymentMethodOptionTemplate = (option) => {
        //console.log ('paymentMethodOptionTemplate option: ', option)
        return (
            <div className="paymentMethod-item">
                <div>{option.type}</div>
            </div>
        );
    };

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

    const productStatusBodyTemplate = (rowData) => {
        //console.log('rowData',rowData.inventoryStatus)
        return <span className={`product-badge status-${rowData.inventoryStatus.name.toLowerCase()}`}>{rowData.inventoryStatus.name}</span>;
    }

    const saleOrderStatusBodyTemplate = (rowData) => {
        //console.log ('rowData', rowData )
        return <span className={`saleOrder-badge status-${rowData.status.name.toLowerCase()}`}> {rowData.status.name} </span>;
    }

    const saleOrderStatusItemTemplate = (option) => {
        return <span className={`saleOrder-badge status-${option.name.toLowerCase()}`}>{option.name}</span>
    }

    const employeeOptionTemplate = (option) => {
        //console.log ('employeeOptionTemplate option: ', option)
        return (
            <div className="employee-item">
                <div>{option.fullName}</div>
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

    const selectedCustomerTemplate = (option, props) => {
        //console.log ('selectedEmployeeTemplate option: ', option)
        if (option) {
            return (
                <div className="customer-item customer-item-value">
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
    
    const selectedEmployeeTemplate = (option, props) => {
        //console.log ('selectedEmployeeTemplate option: ', option)
        if (option) {
            return (
                <div className="employee-item employee-item-value">
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

    const selectedStatusTemplate = (option, props) => {
        //console.log ('selectedStatusTemplate option: ', option)
        if (option) {
            return (
                <div className="status-item status-item-value">
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

    const selectedStatusTemplateDropDown = (option, props) => {
        //console.log ('selectedStatusTemplate option: ', option)
        if (option) {
            return <span className={`saleOrder-badge status-${option.name.toLowerCase()}`}> {option.name} </span>;
        }

        return <span className={`saleOrder-badge status-${props.placeholder.toLowerCase()}`}> {props.placeholder} </span>;
        return (
            <span>
                {props.placeholder}
            </span>
        );
    }

    const statusOptionTemplate = (option) => { //Format the items listed in the dropdown menu
        //console.log ('statusOptionTemplate option: ', option)
        return <span> {option.name}</span>
    };

    const statusOptionTemplateDropDown = (option) => { //Format the items listed in the dropdown menu
        //console.log ('statusOptionTemplate option: ', option)
        return <span className={`saleOrder-badge status-${option.name.toLowerCase()}`}> {option.name} </span>;
    };

    const stockBodyTemplate = (rowData) => {
        const stockClassName = classNames({
            'outofstock': rowData.quantity === 0,
            'lowstock': rowData.quantity > 0 && rowData.quantity < 10,
            'instock': rowData.quantity > 10
        });

        return (
            <div className={stockClassName}>
                {rowData.quantity}
            </div>
        );
    }

    const subTotalBodyTemplate = (rowData) => {
        //console.log('# subTotalPriceBodyTemplate #')
        //console.log('rowData',rowData)
        return (
            <React.Fragment>
                <span className="subTotal-text">{`${rowData.unitSellPriceCurrency.code} `}</span> 
                <span className="subTotal-formatedValue">{formatCurrency(rowData.subTotal)}</span>
            </React.Fragment>
        );
    }

    const subTotalWithVATaxBodyTemplate = (rowData) => {
        //console.log('# subTotalWithVATaxBodyTemplate #')
        //console.log('rowData',rowData)
        return (
            <React.Fragment>
                <span className="subTotalWithVATax-text">{` ${rowData.unitSellPriceCurrency.code} `}</span> 
                <span className="subTotalWithVATax-formatedValue">{formatCurrency(rowData.subTotalWithVATax || 0)}</span>
            </React.Fragment>
        );
    }

    const unitSellPriceBodyTemplate = (rowData) => {
        //console.log('# unitSellPriceBodyTemplate #')
        //console.log('rowData',rowData)
        //console.log('dataTableProps',dataTableProps)
        return (
            <React.Fragment>
                <span className="unitSellPrice-text">{`${rowData.unitSellPriceCurrency.code} `}</span> 
                <span className="unitSellPrice-formatedValue">{formatCurrency(rowData.unitSellPrice)}</span>
            </React.Fragment>
        );
    }

    const VATaxBodyTemplate = (rowData) => {
        //console.log('# VATaxBodyTemplate #')
        //console.log('rowData',rowData)
        return (
            <React.Fragment>
                <span className="VATax-formatedValue">{formatPercentage(rowData.VATax || 0)}</span>
            </React.Fragment>
        );
    }

    ////////////
    // Toolbars
    ////////////

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="" icon="pi pi-plus" className="p-button-secondary p-button-raised p-mr-2" onClick={openNewSaleOrderDialog} tooltip = 'Nuevo'/>
                {/* <Button label="Eliminar" icon="pi pi-trash" className="p-button-warning p-button-raised" onClick={confirmDeleteSelected} disabled={!selectedSaleOrders || !selectedSaleOrders.length} /> */}
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            
            <React.Fragment>

           </React.Fragment>

        )
    }

    const saleOrderProductsLeftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="" icon="pi pi-plus" className="p-button-secondary p-button-raised p-mr-2" onClick={openAddSelectedProductsDialog} tooltip = 'Agregar Productos' disabled={disableAddProduct} />
                <Button label="" icon="pi pi-minus" className="p-button-warning p-button-raised" onClick={removeSelectedProducts} tooltip = 'Quitar Productos' disabled={disableRemoveProduct || (selectedSaleOrderProducts.length === 0) } />
            </React.Fragment>
        )
    }

    const saleOrderProductsRightToolbarTemplate = () => {
        return (
            
            <React.Fragment>
            {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Importar" chooseLabel="Importar" className="p-mr-2 p-d-inline-block" />
                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
           */}            
           </React.Fragment>

        )
    }

    const viewSaleOrderDialogLeftToolbar = () => {
        return (
            <React.Fragment>
                <div> PRESUPUESTO - { formatNumber ( saleOrderEdited.number,7) } </div> 
                {/*<Button type="button" icon="pi pi-file-o" onClick={exportCSV(false)} className="p-mr-2" data-pr-tooltip="CSV" /> */}
                {/* <Button type="button" icon="pi pi-file-o" onClick={exportCSV} className="p-mr-2" data-pr-tooltip="CSV" /> */}
                {/* <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning p-mr-2" data-pr-tooltip="PDF" /> */}
                {/* <Button label="Cobro" icon="pi pi-plus" className="p-button-secondary p-button-raised p-mr-2" onClick={addPaymentTransaction} tooltip = 'Ingresar Cobro' /> */}
            </React.Fragment>
        )
    }

    const viewSaleOrderDialogRightToolbar = () => {
        return (
            <React.Fragment>
                <Button type="button" icon="pi pi-file-o" onClick={exportCSV} className="p-mr-2" data-pr-tooltip="CSV" />
                <Button type="button" icon="pi pi-file-pdf" onClick={printPDF} className="p-button-warning p-mr-2" data-pr-tooltip="PDF" />
            </React.Fragment>
        )
    }

    ///////////
    // Headers
    ///////////

    const renderHeader = (number) => {
        return (
            <div className="window-header">
                <div> PRESUPUESTO - { formatNumber ( number,7) } </div>
            </div>           
        );
    }
     
    const headerProductSaleOrders = (
        <div className="table-header">
            <h5 className="p-m-0"> Presupuestos </h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(event) => setGlobalFilter(event.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const headerEditSaleOrderProducts = (
        <div className="table-header">
            <h5 className="p-m-0"> Lista de Productos </h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText className= 'p-inputtext' type="search" onInput={(event) => setGlobalFilter(event.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const headerViewSaleOrderProducts = (
        <div className="table-header">
            <h5 className="p-m-0"> Lista de Productos </h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(event) => setGlobalFilter(event.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    //////////
    //Footers
    //////////

    const newSaleOrderDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={saveSaleOrderSettings} disabled={ !selectedCustomer.id || !selectedEmployee.id } /> 
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideNewSaleOrderDialog} />
        </React.Fragment>
    );

    const viewSaleOrderDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={hideViewSaleOrderDialog} />
        </React.Fragment>
    );

    const editSaleOrderSettingsDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={saveSaleOrderSettings} disabled={ !selectedCustomer.id || !selectedEmployee.id } /> 
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideEditSaleOrderSettingsDialog} />
        </React.Fragment>
    );

    const editSaleOrderProductsDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={saveSaleOrderProducts} disabled={ disableSubmit } />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideEditSaleOrderProductsDialog} />
        </React.Fragment>
    );

    /*
    const addProductDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideAddProductDialog} />
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={ confirmAddProduct } /> 
        </React.Fragment>
    );
    */

    const addSelectedProductsDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={ addSelectedProducts } /> 
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideAddSelectedProductsDialog} />
        </React.Fragment>
    );


    const confirmSaleOrderDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={saveSaleOrderSettings} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideConfirmSaleOrderDialog} />
        </React.Fragment>
    );

    const deleteSaleOrderDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={deleteSaleOrder} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSaleOrderDialog} />
        </React.Fragment>
    );

    const deleteSaleOrdersDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedSaleOrders} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSelectedSaleOrdersDialog} />
        </React.Fragment>
    );

    const removeProductsDialogFooter = (
        <React.Fragment>
            <Button label="OK" icon="pi pi-check" className="p-button-text" onClick={removeSelectedProducts} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideRemoveProductsDialog} />
        </React.Fragment>
    );

    const deleteSaleOrderProductDialogFooter = (
        <React.Fragment>
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSaleOrderProduct} />
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSaleOrderProductDialog} />
        </React.Fragment>
    );


    /////////////
    // Renderer
    /////////////

    return (
        <div>
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} className="p-datatable-striped" value={saleOrderList} dataKey="id" editMode="cell"
                    rowHover = {true} scrollable scrollHeight="594px" autoLayout = {false}
                    //selection={selectedSaleOrders} onSelectionChange={ (event) => setSelectedSaleOrders(event.value) }
                    //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    //currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                    //sortMode="multiple" sortField = 'id' sortOrder={-1} removableSort = {true} defaultSortOrder={-1}
                    sortMode="multiple" removableSort multiSortMeta={multiSortMeta} onSort={ (event) => setMultiSortMeta (event.multiSortMeta) }
                    //onRowClick = {(rowData) => onRowClick(rowData)}
                    globalFilter={globalFilter} 
                    header={headerProductSaleOrders}>

                    {/*<Column selectionMode="multiple" headerStyle={{ width: '3rem' }}> </Column> */}
                    {/*<Column field="id" header="Order Id" sortable> </Column>*/}
                    <Column field="number" header="Presupuesto Nro." sortable body={numberBodyTemplate} />
                    <Column field="customer.name" header="Cliente" sortable />
                    <Column field="employee.name" header="Vendedor" sortable />
                    <Column field="date" header="Fecha" sortable  body={dateBodyTemplate} />
                    {/* <Column field="modifiedDate" header="Última modificación" sortable body={dateBodyTemplate} /> */}
                    {/* <Column field="amountSubTotal" header="SubTotal" body={amountSubTotalBodyTemplate} > </Column> */}
                    {/*<Column field="VATax" header="IVA" sortable body={VATaxBodyTemplate}></Column>*/}
                    {/* <Column field="amountTotal" header="Total" body={amountTotalBodyTemplate} ></Column> */}
                    {/* <Column field="status" header="Estado" body={saleOrderStatusBodyTemplate}  editor={statusEditor} sortable /> */}
                    <Column field="status" header="Estado" body={saleOrderStatusBodyTemplate} sortable />
                    <Column body={actionBodyTemplate} />
                </DataTable>
            </div>

            <Dialog visible={viewSaleOrderDialog} autoLayout={true} header= {renderHeader(saleOrderEdited.number)} modal closable={false} footer={viewSaleOrderDialogFooter} onHide={ () => {} }>

                    <Toolbar className="p-mb-4" left={viewSaleOrderDialogLeftToolbar} right={viewSaleOrderDialogRightToolbar}></Toolbar>

                    <br/>
                    <div className="saleOrderSettingsData">
                        <div className="saleOrderDataTop">
                             {/* <label htmlFor="employeeSelection"> Vendedor </label> */}
                            <span className="p-inputgroup-addon"> Vendedor </span>
                            <InputText className='saleOrder-textAlignment' value={selectedEmployee} options={employeeList} disabled = {true} />
                        </div>

                        <div className="saleOrderDataTop">
                            {/* <label htmlFor="customerDropdown"> Cliente </label> */}
                            <span className="p-inputgroup-addon"> Cliente </span>
                            <InputText className='saleOrder-textAlignment' value={selectedCustomer} disabled = {true} />
                        </div>

                        <div className="saleOrderDataTop">
                            {/* <label htmlFor="paymentMethodDropdown"> Método de Pago </label> */}
                            <span className="p-inputgroup-addon"> Método de Pago </span>
                            <InputText className='saleOrder-textAlignment' value={selectedPaymentMethod} disabled={true} /> 
                        </div>

                        <div className="saleOrderDataTop">
                            {/* <label htmlFor="statusDropdown"> Estado </label> */}
                            <span className="p-inputgroup-addon"> Estado </span>
                            <InputText className = {`saleOrder-textAlignment saleOrder-badge-inputText status-${selectedStatus}`} value={selectedStatus} size={20} disabled={true} />
                        </div>
                        {/*}
                        <div className="saleOrderDataTop">
                            <span className="p-inputgroup-addon"> IVA </span>
                            <InputNumber inputClassName='ta' value={ inputVATax} mode="decimal" locale="es-AR" prefix='% ' disabled={true} />
                        </div>
                        */}
                    </div>
                    <br/>

                    <DataTable ref={dt} className="p-datatable-striped" value={saleOrderEdited.saleOrderProducts} dataKey='id' rowHover = {true} emptyMessage = 'No hay productos cargados' autoLayout = {true}
                        scrollable scrollHeight="250px"
                        //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        globalFilter={globalFilter}
                        header={headerViewSaleOrderProducts}>
                        <Column field="id" header="Prod Id" ></Column>
                        <Column field="code" header="Código" ></Column>
                        <Column field="unitQuantity" header="Cantidad"></Column>
                        <Column field="unitSellPrice" header="Precio" body={unitSellPriceBodyTemplate} ></Column>
                        <Column field="discount" header="Bonificación" body={discountBodyTemplate}> </Column>
                        <Column field="subTotal" header="Subtotal" body={subTotalBodyTemplate} ></Column>
                        <Column field="VATax" header="IVA" body={VATaxBodyTemplate} ></Column>
                        <Column field="SubTotalWithVATax" header="Subtotal c/ IVA" body={subTotalWithVATaxBodyTemplate} ></Column>
                    </DataTable>

                    <br/>
                    <div className="saleOrderDataBottom">
                        <span className="p-inputgroup-addon"> Subtotal </span>
                        <InputNumber  inputClassName='saleOrder-textAlignment' value={ amountSubTotal } mode="decimal" locale="es-AR"  prefix='$ ' disabled={true}/>
                    </div>
                    <div className="saleOrderDataBottom">
                        <span className="p-inputgroup-addon"> IVA </span>
                        <InputNumber  inputClassName='saleOrder-textAlignment' value={ inputVATax } mode="decimal" locale="es-AR"  prefix='% ' disabled={true}/>
                    </div>
                    <div className="saleOrderDataBottom">
                        <span className="p-inputgroup-addon"> Otros Impuestos </span>
                        <InputNumber  inputClassName='saleOrder-textAlignment' value={ inputOtherTaxes } mode="decimal" locale="es-AR"  prefix='% ' disabled={true}/>
                    </div>
                    <div className="saleOrderDataBottom">
                        <span className="p-inputgroup-addon"> Total </span>
                        <InputNumber  inputClassName='saleOrder-textAlignment' value={ amountTotal } mode="decimal" locale="es-AR"  prefix='$ ' disabled={true}/>
                    </div>

            </Dialog>

            {/*
            <Dialog className="p-fluid" visible={OLDnewSaleOrderDialog} autoLayout={true} header="Nuevo Presupuesto" modal closable={false} blockScroll={true} footer={newSaleOrderDialogFooter} onHide={ () => {} }>

                <div className='card'>

                    <br/>
                    <div className="p-field">
                        <span className="p-inputgroup-addon"> Vendedor </span>
                        <Dropdown id="employeeDropdown" value={selectedEmployee} onChange={ (event) => { onChangeEmployee (event) } } options={employeeList} optionLabel="fullName" dataKey="id" valueTemplate={selectedEmployeeTemplate} itemTemplate={employeeOptionTemplate} placeholder="Asigne un vendedor" scrollHeight='100px' autoWidth={false} required className={classNames({ 'p-invalid': !selectedEmployee.id })}/>
                        { !selectedEmployee.id  && <small className="p-invalid"> Requerido !</small>}
                    </div>

                    <br/>
                    <div className="p-field p-md-6">
                        <span className="p-inputgroup-addon"> Cliente </span>
                        <Dropdown id="customerDropdown" value={selectedCustomer} onChange={ (event) => { onChangeCustomer (event) } } options={customerList} optionLabel="name" dataKey="id" valueTemplate={selectedCustomerTemplate} itemTemplate={customerOptionTemplate} placeholder="Seleccione un cliente" scrollHeight='100px' autoWidth={false} required className={classNames({ 'p-invalid': !selectedCustomer.id })}/>
                        { !selectedCustomer.id  && <small className="p-invalid"> Requerido !</small> }
                    </div>

                    <br/>
                    <div className="p-field p-md-4">
                        <span className="p-inputgroup-addon"> Método de Pago </span>
                        <Dropdown id="paymentMethodDropdown" value={selectedPaymentMethod} onChange={ (event) => { onChangePaymentMethodDropDown (event) } } options={paymentMethodList} optionLabel="type" dataKey="id" valueTemplate={selectedPaymentMethodTemplate} itemTemplate={paymentMethodOptionTemplate} placeholder="Seleccione el Método de Pago" scrollHeight='150px' autoWidth={false} disabled={false} required className={classNames({ 'p-invalid': !selectedPaymentMethod.id } )} /> 
                        { !selectedPaymentMethod.id  && <small id="username2-help" className="p-error p-d-block">Username is not available.</small> }
                    </div>

                    <br/>
                    <div className="ui-fluid p-formgrid p-grid">
                        <div className="p-col-12 p-md-12">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"> VAT % </span>
                                <InputNumber id="VATaxInputNumber" value={ inputVATax } onFocus={ (event) => onFocusVAT (event)} onValueChange={ (event) => onChangeVATax (event) } mode="decimal" min={0} max={100} locale="es-AR" placeholder='000' disabled={!checkedVATax} autoFocus={true} />
                                <span className="p-inputgroup-addon">
                                    <Checkbox inputId="booleanVATax" checked={checkedVATax} onChange={event => setCheckedVATax (event.checked)} />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="ui-fluid p-formgrid p-grid">
                        {/*
                        <div className="p-field p-md-2">
                            <label htmlFor="VATaxInputNumber">Bonificación</label>
                            <InputNumber id="VATaxInputNumber" value={inputDiscount} onValueChange={ (event) => onChangeDiscount (event, 'discount')} mode="decimal" min={0} max={100} maxFractionDigits={2}  locale="es-AR" placeholder='00.00' suffix=' %' disabled={!checkedDiscount} />
                        </div>
                        
                        <div className="p-field-checkbox">
                            <Checkbox inputId="binaryDiscount" checked={checkedDiscount} onChange={event => setCheckedDiscount (event.checked)} />
                            <label htmlFor="binaryDiscount">{checkedDiscount ? 'Si' : 'No'}</label>               
                        </div>
                        * / }
                    </div>
                </div>
                    
            </Dialog>
            */}

            <Dialog visible={newSaleOrderDialog} autoLayout={true} header= {renderHeader(saleOrderEdited.number)}  modal closable={false} blockScroll={true} footer={newSaleOrderDialogFooter} onHide={ () => {} }>

                    <Toolbar className="p-mb-4" left={saleOrderProductsLeftToolbarTemplate} right={saleOrderProductsRightToolbarTemplate}></Toolbar>

                    <br/>
                    <div className="saleOrderSettingsData">
                        <div className="saleOrderDataTop">
                            <span className="p-inputgroup-addon"> Vendedor </span>
                            <div className="saleOrderDataToplvl2">
                                <Dropdown className='saleOrder-textAlignment' value={selectedEmployee} onChange={ (event) => { onChangeEmployee (event) } } options={employeeList} optionLabel="fullName" dataKey="id" valueTemplate={selectedEmployeeTemplate} itemTemplate={employeeOptionTemplate} placeholder="Vendedor" scrollHeight='100px' autoWidth={false} required className={classNames({ 'p-invalid': !selectedEmployee.id })} required disabled = {disableEmployeeDropDown } />
                                { !selectedEmployee.id  && <small className="p-invalid"> Requerido! </small>}
                            </div>
                        </div>

                        <div className="saleOrderDataTop">
                            <span className="p-inputgroup-addon"> Cliente </span>
                            <div className="saleOrderDataToplvl2">
                                <Dropdown className='saleOrder-textAlignment' value={selectedCustomer} onChange={ (event) => { onChangeCustomer (event); } } options={customerList} optionLabel="name" dataKey="id" valueTemplate={selectedCustomerTemplate} itemTemplate={customerOptionTemplate} placeholder="Cliente" scrollHeight='100px' autoWidth={false} className={classNames({ 'p-invalid': !selectedCustomer.id })} required disabled = {disableEditor} />
                                { !selectedCustomer.id  && <small className="p-invalid"> Requerido! </small> }
                            </div>
                        </div>

                        <div className="saleOrderDataTop">
                            <span className="p-inputgroup-addon"> Método de Pago </span>
                            <div className="saleOrderDataToplvl2">
                                <Dropdown className='saleOrder-textAlignment' value={selectedPaymentMethod} onChange={ (event) => { onChangePaymentMethodDropDown (event) } } options={paymentMethodList} optionLabel="type" dataKey="id" valueTemplate={selectedPaymentMethodTemplate} itemTemplate={paymentMethodOptionTemplate} placeholder="Método de Pago" scrollHeight='100px' autoWidth={false} className={classNames({ 'p-invalid': !selectedPaymentMethod.id })} required disabled={disableEditor} />
                                { !selectedPaymentMethod.id  && <small className="p-invalid"> Requerido! </small> }
                            </div>
                        </div>

                        <div className="saleOrderDataTop">
                            <span className="p-inputgroup-addon"> Estado </span>
                            <Dropdown value={selectedStatus} onChange={ (event) => {onChangeStatus (event) } } options={statusList} optionLabel="name" dataKey="id" valueTemplate={selectedStatusTemplateDropDown} itemTemplate={statusOptionTemplateDropDown} placeholder="Seleccione el Estado" scrollHeight='100px' autoWidth={false} disabled={true} />
                        </div>
                    </div>

                    <br/>
                    <DataTable ref={dt} className="p-datatable-striped" value={saleOrderEdited.saleOrderProducts} dataKey="id" editMode="cell" rowHover = {true}
                        selection={selectedSaleOrderProducts} onSelectionChange={ (event) => setSelectedSaleOrderProducts (event.value) } 
                        //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        //currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                        sortMode="multiple" removableSort multiSortMeta={multiSortMeta} onSort={ (event) => setMultiSortMeta (event.multiSortMeta) }
                        scrollable //scrollHeight="250px"
                        globalFilter={globalFilter}
                        header={headerEditSaleOrderProducts} headerClassName='p-datatable-header' > 

                        <Column field="productSaleOrderId" header="PSO_Id" />
                        <Column field="saleOrderId" header="SO_Id" />
                        <Column field="id" header="Prod_Id" />
                        <Column field="code" header="Código" />
                        <Column field="unitQuantity" header="Cantidad" editor={unitQuantityEditor} editorValidator={validateEditorInput}/>
                        <Column field="unitSellPrice" header="Precio" body={unitSellPriceBodyTemplate} />
                        <Column field="discount" header="Bonificación" body={discountBodyTemplate} />
                        <Column field="subTotal" header="Subtotal" body={subTotalBodyTemplate} />
                        <Column field="VATax" header="IVA" body={VATaxBodyTemplate} />
                        <Column field="SubTotalWithVATax" header="Subtotal c/ IVA" body={subTotalWithVATaxBodyTemplate} />
                    </DataTable>

                    <br/>
                    <div className="saleOrderDataBottom">
                        <div className="p-inputgroup-addon"> Subtotal </div>
                        <InputNumber  inputClassName='saleOrder-textAlignment' value={ saleOrderEdited.amountSubTotal } mode="decimal" locale="es-AR"  prefix='$ ' disabled={disableEditor}/>
                    </div>
                    <div className="saleOrderDataBottom">
                        <div className="p-inputgroup-addon"> IVA </div>
                        {/* <InputNumber inputClassName='saleOrder-textAlignment' value={ inputVATax } mode="decimal" locale="es-AR"  prefix='% ' disabled={disableEditor}/> */}
                        <InputNumber inputClassName='saleOrder-textAlignment' value={ inputVATax } onFocus={ (event) => onFocusVAT (event)} onValueChange={ (event) => onChangeVATax (event) } mode="decimal" min={0} max={100} locale="es-AR" placeholder='000' prefix='% ' autoFocus={false} disabled={disableEditor} />

                    </div>
                    <div className="saleOrderDataBottom">
                        <div className="p-inputgroup-addon"> Otros Impuestos </div>
                        <InputNumber  inputClassName='saleOrder-textAlignment' value={ inputOtherTaxes } mode="decimal" locale="es-AR"  prefix='% ' disabled={disableEditor}/>
                    </div>
                    <div className="saleOrderDataBottom">
                        <div className="p-inputgroup-addon"> Total </div>
                        <InputNumber  inputClassName='saleOrder-textAlignment' value={ saleOrderEdited.amountTotal } mode="decimal" locale="es-AR"  prefix='$ ' disabled={disableEditor}/>
                    </div>
            </Dialog>

             <Dialog className="p-fluid" visible={editSaleOrderSettingsDialog}  autoLayout={true} header="Editar Presupuesto" modal closable={false} blockScroll={true} footer={editSaleOrderSettingsDialogFooter} autoLayout ={false} onHide={ () => {} }>

                <div className="ui-fluid p-formgrid p-grid">
                    <div className="p-field p-md-5">
                        <span className="p-inputgroup-addon"> Presupuesto Nro. [ { formatNumber ( inputNumber,7) } ] </span>
                    </div>
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Vendedor </span>
                    <Dropdown id="employeeDropdown" className={classNames({ 'p-invalid': !selectedEmployee.id })} value={selectedEmployee} onChange={ (event) => { onChangeEmployee (event) } } options={employeeList} optionLabel="fullName" dataKey="id" valueTemplate={selectedEmployeeTemplate} itemTemplate={employeeOptionTemplate} placeholder="Asigne un vendedor" scrollHeight='100px' autoWidth={false} required disabled = {disableEmployeeDropDown} />
                    { !selectedEmployee.id  && <small className="p-invalid"> Requerido !</small>}
                </div>

                <br/>
                <div className="p-field p-md-6">
                    <span className="p-inputgroup-addon"> Cliente </span>
                    <Dropdown id="customerDropdown" className={classNames({ 'p-invalid': !selectedCustomer.id })} value={selectedCustomer} onChange={ (event) => { onChangeCustomer (event) } } options={customerList} optionLabel="name" dataKey="id" valueTemplate={selectedCustomerTemplate} itemTemplate={customerOptionTemplate} placeholder="Seleccione un cliente" scrollHeight='100px' autoWidth={false} required disabled = {false} />
                    { !selectedCustomer.id  && <small className="p-invalid"> Requerido !</small> }
                </div>

                <br/>
                <div className="p-field p-md-4">
                    <span className="p-inputgroup-addon"> Método de Pago </span>
                    <Dropdown id="paymentMethodDropdown" value={selectedPaymentMethod} onChange={ (event) => { onChangePaymentMethodDropDown (event) } } options={paymentMethodList} optionLabel="type" dataKey="id" valueTemplate={selectedPaymentMethodTemplate} itemTemplate={paymentMethodOptionTemplate} placeholder="Seleccione el Método de Pago" scrollHeight='150px' autoWidth={false} disabled={false} required className={classNames({ 'p-invalid': !selectedPaymentMethod.id } )} /> 
                    { !selectedPaymentMethod.id  && <small id="username2-help" className="p-error p-d-block">Username is not available.</small> }
                </div>

                
                <br/>
                <div className="saleOrderSettingsData">
                    <div className="saleOrderDataBottom">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon"> VAT %</span>
                            <InputNumber id="VATaxInputNumber" value={ inputVATax } onFocus={ (event) => onFocusVAT (event)} onValueChange={ (event) => onChangeVATax (event) } mode="decimal" min={0} max={100} locale="es-AR" placeholder='000' size={5} disabled={!checkedVATax} autoFocus={false} />
                            <span className="p-inputgroup-addon">
                                <Checkbox inputId="booleanVATax" checked={checkedVATax} onChange={event => setCheckedVATax (event.checked)} />
                            </span>
                        </div>
                    </div>
                    <div className="saleOrderDataTop">
                        <span className="p-inputgroup-addon"> Estado </span>
                        <Dropdown value={selectedStatus} onChange={ (event) => {onChangeStatus (event) } } options={statusList} optionLabel="name" dataKey="id" valueTemplate={selectedStatusTemplateDropDown} itemTemplate={statusOptionTemplateDropDown} placeholder="Seleccione el Estado" scrollHeight='100px' autoWidth={false} disabled={disableEditor} />
                    </div>
                </div>

            </Dialog>
            
            <Dialog visible={editSaleOrderProductsDialog} autoLayout={true} header= {renderHeader(saleOrderEdited.number)}  modal closable={false} blockScroll={true} footer={editSaleOrderProductsDialogFooter} onHide={ () => {} }>

                <Toolbar className="p-mb-4" left={saleOrderProductsLeftToolbarTemplate} right={saleOrderProductsRightToolbarTemplate}></Toolbar>

                <br/>
                <div className="saleOrderSettingsData">
                    <div className="saleOrderDataTop">
                        <span className="p-inputgroup-addon"> Vendedor </span>
                        <Dropdown className='saleOrder-textAlignment' value={selectedEmployee} onChange={ (event) => { onChangeEmployee (event) } } options={employeeList} optionLabel="fullName" dataKey="id" valueTemplate={selectedEmployeeTemplate} itemTemplate={employeeOptionTemplate} placeholder="Asigne un vendedor" scrollHeight='100px' autoWidth={true} disabled = {disableEmployeeDropDown} />
                    </div>

                    <div className="saleOrderDataTop">
                        <span className="p-inputgroup-addon"> Cliente </span>
                        <Dropdown className='saleOrder-textAlignment' value={selectedCustomer} onChange={ (event) => { onChangeCustomer (event); } } options={customerList} optionLabel="name" dataKey="id" valueTemplate={selectedCustomerTemplate} itemTemplate={customerOptionTemplate} placeholder="Seleccione un cliente" scrollHeight='100px' autoWidth={false} disabled = {disableEditor} />
                    </div>

                    <div className="saleOrderDataTop">
                        <span className="p-inputgroup-addon"> Método de Pago </span>
                        <Dropdown className='saleOrder-textAlignment' value={selectedPaymentMethod} onChange={ (event) => { onChangePaymentMethodDropDown (event) } } options={paymentMethodList} optionLabel="type" dataKey="id" valueTemplate={selectedPaymentMethodTemplate} itemTemplate={paymentMethodOptionTemplate} placeholder="Seleccione el Método de Pago" scrollHeight='100px' autoWidth={false} disabled={disableEditor} /> 
                    </div>

                    <div className="saleOrderDataTop">
                        <span className="p-inputgroup-addon"> Estado </span>
                        <Dropdown value={selectedStatus} onChange={ (event) => {onChangeStatus (event) } } options={statusList} optionLabel="name" dataKey="id" valueTemplate={selectedStatusTemplateDropDown} itemTemplate={statusOptionTemplateDropDown} placeholder="Seleccione el Estado" scrollHeight='100px' autoWidth={false} disabled={disableEditor} />
                    </div>

                    {/*
                    <div>
                        <label htmlFor="statusDropdown"> Estado </label>
                        <span className="p-inputgroup-addon"> VAT </span>
                        <InputNumber inputClassName='saleOrder-textAlignment' value={ inputVATax } onFocus={ (event) => onFocusVAT (event)} onValueChange={ (event) => onChangeVATax (event) } mode="decimal" min={0} max={100} locale="es-AR" placeholder='000' prefix='% ' size={10} autoFocus={false} disabled={disableEditor} />
                    </div>
                    */}
                </div>

                <br/>
                <DataTable ref={dt} className="p-datatable-striped" value={saleOrderEdited.saleOrderProducts} dataKey="id" editMode="cell" rowHover = {true}
                    selection={selectedSaleOrderProducts} onSelectionChange={ (event) => setSelectedSaleOrderProducts (event.value) } 
                    //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    //currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                    sortMode="multiple" removableSort multiSortMeta={multiSortMeta} onSort={ (event) => setMultiSortMeta (event.multiSortMeta) }
                    scrollable scrollHeight="250px"
                    globalFilter={globalFilter}
                    header={headerEditSaleOrderProducts} headerClassName='p-datatable-header' > 

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column field="productSaleOrderId" header="PSO_Id" />
                    <Column field="saleOrderId" header="SO_Id" />
                    <Column field="id" header="Prod_Id" />
                    <Column field="code" header="Código" />
                    <Column field="unitQuantity" header="Cantidad" editor={unitQuantityEditor} editorValidator={validateEditorInput}/>
                    <Column field="unitSellPrice" header="Precio" body={unitSellPriceBodyTemplate} />
                    <Column field="discount" header="Bonificación" body={discountBodyTemplate} />
                    <Column field="subTotal" header="Subtotal" body={subTotalBodyTemplate} />
                    <Column field="VATax" header="IVA" body={VATaxBodyTemplate} />
                    <Column field="SubTotalWithVATax" header="Subtotal c/ IVA" body={subTotalWithVATaxBodyTemplate} />
                </DataTable>

                <br/>
                <div className="saleOrderDataBottom">
                    <div className="p-inputgroup-addon"> Subtotal </div>
                    <InputNumber  inputClassName='saleOrder-textAlignment' value={ saleOrderEdited.amountSubTotal } mode="decimal" locale="es-AR"  prefix='$ ' disabled={disableEditor}/>
                </div>
                <div className="saleOrderDataBottom">
                    <div className="p-inputgroup-addon"> IVA </div>
                    {/* <InputNumber inputClassName='saleOrder-textAlignment' value={ inputVATax } mode="decimal" locale="es-AR"  prefix='% ' disabled={disableEditor}/> */}
                    <InputNumber inputClassName='saleOrder-textAlignment' value={ inputVATax } onFocus={ (event) => onFocusVAT (event)} onValueChange={ (event) => onChangeVATax (event) } mode="decimal" min={0} max={100} locale="es-AR" placeholder='000' prefix='% ' autoFocus={false} disabled={disableEditor} />
                </div>
                <div className="saleOrderDataBottom">
                    <div className="p-inputgroup-addon"> Otros Impuestos </div>
                    <InputNumber  inputClassName='saleOrder-textAlignment' value={ inputOtherTaxes } mode="decimal" locale="es-AR"  prefix='% ' disabled={disableEditor}/>
                </div>
                <div className="saleOrderDataBottom">
                    <div className="p-inputgroup-addon"> Total </div>
                    <InputNumber  inputClassName='saleOrder-textAlignment' value={ saleOrderEdited.amountTotal } mode="decimal" locale="es-AR"  prefix='$ ' disabled={disableEditor}/>
                </div>
            </Dialog>

            <Dialog className="p-fluid" visible={addSaleOrderProductDialog} style={{ width: '1050px' }} header="Seleccione los Productos a agregar" modal closable={false}  blockScroll={true} footer={addSelectedProductsDialogFooter} onHide={ () => {} }>

                <div className="AddProduct">                    
                    <DataTable ref={dt} className="p-datatable-striped" value={productsSource} dataKey="id" scrollable scrollHeight="250px" rowHover = {true}
                        selection={selectedSaleOrderProducts} onSelectionChange={ (event) => setSelectedSaleOrderProducts(event.value) } 
                        //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        //currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                        globalFilter={globalFilter}
                        header={headerEditSaleOrderProducts}>

                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="productInventory.indexCardId" header="IndexCardId" ></Column>
                        <Column field="id" header="PId" ></Column>
                        <Column field="code" header="Código" ></Column>
                        <Column field="detail" header="Materiales" ></Column>
                         {/*<Column field="unitQuantity" header="Cantidad" editor={unitQuantityEditor} autoFocus ></Column>
                        {/* <Column field="unitSellPrice" header="Precio" body={unitSellPriceBodyTemplate} ></Column> */}
                        <Column field="productInventory.calculatedQuantityBalance" header="Stock" ></Column>
                        <Column field="inventoryStatus.name" header="Estado" body={productStatusBodyTemplate}></Column>
                    </DataTable>
                </div>
                
                <div className="ui-fluid p-formgrid p-grid">
                {/*
                <div className="picklist">
                    <div className="card">
                        <PickList source={productsSource} target={productsTarget} itemTemplate={productsItemTemplate}
                            sourceHeader="Fuera de la lista" targetHeader="Agregados a la lista"
                            showSourceControls={false} showTargetControls={false}
                            sourceStyle={{ height: '342px' }} targetStyle={{ height: '342px' }}
                            onChange={ (event) => { onProductsPickListChange (event, 'saleOrderProducts') } }></PickList>
                    </div>
                </div>
                */}
                </div>
            </Dialog>

            <Dialog visible={removeProductsDialog} autoLayout = {true} header="Seleccione los productos a quitar" modal closable={false} blockScroll={true}  footer={removeProductsDialogFooter} onHide={() => {}}>
                <DataTable ref={dt} className="p-datatable-striped" value={productsSource} dataKey="id" 
                    scrollable scrollHeight="250px" rowHover = {true} autoWidth ={true}
                    selection={selectedSaleOrderProducts} onSelectionChange={ (event) => setSelectedSaleOrderProducts(event.value) } 
                    //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    //currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                    globalFilter={globalFilter}
                    header={headerEditSaleOrderProducts}>

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="id" header="Id" ></Column>
                    <Column field="code" header="Código" ></Column>
                    {/* <Column field="manufacturer" header="Fabricante" ></Column> */}
                    <Column field="unitQuantity" header="Cantidad" editor={unitQuantityEditor}></Column>
                    <Column field="unitSellPrice" header="Precio" body={unitSellPriceBodyTemplate}  ></Column>
                </DataTable>
            </Dialog>

            <Dialog visible={deleteSaleOrderDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteSaleOrderDialogFooter} closable={false} onHide={() => {}}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {saleOrderEdited && <span>¿Confirma ELIMINAR <b> {renderHeader(saleOrderEdited.number)} </b> ? </span>} 

                </div>
            </Dialog>

            <Dialog visible={deleteSaleOrdersDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteSaleOrdersDialogFooter} closable={false} onHide={() => {}}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {saleOrderEdited && <span> ¿Confirma ELIMINACIÓN de los PRESUPUESTOS seleccionados? </span>}

                </div>
            </Dialog>

            <Dialog visible={confirmSaleOrderDialog} style={{ width: '450px' }} header="Confirmación" modal footer={confirmSaleOrderDialogFooter} closable={false} onHide={() => {}}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {saleOrderEdited && <span>¿Desea CONFIRMAR el PRESUPUESTO: <b> {renderHeader(saleOrderEdited.number)} </b> ? (No es posible deshacer la acción)</span>} 

                </div>
            </Dialog>

            {/*
            <Dialog visible={deleteSaleOrderProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSaleOrderProductsDialogFooter} onHide={hideDeleteSaleOrderProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {saleOrderProductList && <span>¿Confirma QUITAR los productos seleccionados?</span>}
                </div>
            </Dialog>
            */}

        </div>
    );
}