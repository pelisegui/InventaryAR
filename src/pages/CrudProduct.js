import React, { useState, useEffect, useRef } from 'react';
import { ProductService } from "../service/ProductService";
import { PriceListService, ProductPriceListService } from '../service/PriceListService';
import { InventoryIndexCardService, InventoryIndexCardTransactionService } from '../service/InventoryService';
import { WarehouseService, WarehouseAreaService, WarehouseSlotService } from '../service/WarehouseService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
//import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { SplitButton } from 'primereact/splitbutton';
import classNames from 'classnames';
import '../layout/CrudProduct.scss';


export function CrudProduct() {

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
        quantityPerUnit: null,
        unitPurchasePrice: null,
        purchasePriceCurrency: {id: 459, code: 'USD'}, // assigned values just for use in UI at insertion
        //inventoryStatus: {id: null, name:''}, // needed for PriceList update process.
        //productPriceListId: null, // needed for PriceList update process.
        //priceListId: null, // needed for PriceList update process.
        //sellPrice: 0, // needed for PriceList update process.
        //sellPriceCurrency: {id: null, code: ''}, // needed for PriceList update process.
        //netPrice: 0, // needed for PriceList update process.
        //netPriceCurrency: {id: null, code: ''}, // Currency is setted in PriceList, not in Product
        dateCreated: null,
        dateUpdated: 0,
        dateDeleted: 0
    };

    const emptyPriceListProduct = {
        id: null,
        code: '',
        name: '',
        detail: '',
        brand: '',
        model: '',
        category: '',
        manufacturer: '',
        initialUnitQuantity: 0,
        quantityPerUnit: null,
        unitPurchasePrice: null,
        purchasePriceCurrency: {id: 459, code: 'USD'},
        inventoryStatus: {id: null, name:''},
        productPriceListId: null,
        priceListId: null,
        sellPrice: null,
        netPrice: 0,
        //sellPriceCurrency: {id: null, code: ''}, // Currency is setted in PriceList, not in Product
        //netPriceCurrency: {id: null, code: ''}, // Currency is setted in PriceList, not in Product
        dateCreated: null, //it's the value of productPriceList table row
        dateUpdated: 0, //it's the value of productPriceList table row
        dateDeleted: 0,  //it's the value of productPriceList table row
        //image: null,
        //rating: 0,
    }

    const emptyInventoryIndexCardInsert = { // Default data to be inserted in inventory index card on product creation
        id: null,
        indexCardPartNumber: '', 
        indexCardName: '',
        minimumStock: 0,
        maximumStock: 0,
        quantityBalance: 0,
        inventoryMethod: 0,
        indexCardCreationDate: 0,
        lastTransactionDate: 0,
        transactions:[],
        inventoryMethod: null,
        product: {id: null},
        status: {id: 3}, // default status is out of stock
        dateCreated: null,
        dateUpdate: 0,
        dateDeleted: 0
    };

    const emptyInventoryIndexCardTransaction = {
        id: null,
        unitQuantity: 0,
        type: 0, // 0 initialize, 1 increment, -1 decrement 
        description: 'Alta de inventario', // 'Added to inventory'
        inventoryIndexCardId: null,
        purchaseOrder: {id: 1, number: ''}, // 1 means no purchase order in place so manual input.
        saleOrder: {id: 1, number: ''}, // 1 means no sale order in place so manual input.
        warehouseSlot: {id: 1, code:''}, // 1 default slot (lobby)
        dateCreated: null,
        dateUpdated: null,
        dateDeleted: null
    };

    const emptyInventoryWarehouseSlot = {
        id: -1,
        warehouseSlotId: -1,
        type: 0, // 0 initialize, 1 increment, -1 decrement 
        inventoryIndexCardId: null,
        description: 'Alta de inventario', // 'Added to inventory'
        purchaseOrder: {id: 1, number: ''}, // 1 means no purchase order in place so manual input.
        saleOrder: {id: 1, number: ''}, // 1 means no sale order in place so manual input.
        warehouseSlot: {id: 1, code:''}, // 1 default slot (lobby)
        dateCreated: null,
        dateUpdated: null,
        dateDeleted: null
    };

    
    // Product variables
    const [productList, setProductList] = useState ([]);
    const [productListUndo, setProductListUndo] = useState ([]);
    const [productEdited, setProductEdited] = useState ({});
    const [productEditedUndo, setProductEditedUndo] = useState ({});
    const [productInsert, setProductInsert] = useState ({});
    const [productUpdate, setProductUpdate] = useState ({});

    //Price List Variables
    const [pricesLists, setPricesLists] = useState ([]);
    const [priceListUpdate, setPriceListUpdate] = useState (null);

    //Inventory variables
    const [inventoryIndexCardList, setInventoryIndexCardList] = useState ([]);
    //const [inventoryIndexCardSettingsUpdate, setInventoryIndexCardSettingsUpdate] = useState (JSON.parse(JSON.stringify({...emptyInventoryIndexCardSettingsUpdate})));
    //const [inventoryIndexCardTransactionsUpdate, setInventoryIndexCardTransactionsUpdate] = useState (JSON.parse(JSON.stringify({...emptyInventoryIndexCardTransactionsUpdate})));

    // Input variables
    const [inputCode, setInputCode] = useState ('');
    const [inputName, setInputName] = useState ('');
    const [inputDetail, setInputDetail] = useState ('');
    const [inputBrand, setInputBrand] = useState ('');
    const [inputModel, setInputModel] = useState ('');
    const [inputCategory, setInputCategory] = useState ('');
    const [inputManufacturer, setInputManufacturer] = useState ('');
    const [inputQuantityPerUnit, setInputQuantityPerUnit] = useState (null);
    const [inputInitialUnitQuantity, setInputInitialUnitQuantity] = useState (null);
    const [inputUnitPurchasePrice, setInputUnitPurchasePrice] = useState (null);
    const [inputPurchasePriceCurrency, setInputPurchasePriceCurrency] = useState (null);
    //const [currencies, setCurrencies] = useState([]);
    //const [selectedCurrency, setSelectedCurrency] = useState(emptyCurrency);
    const [inputInventoryIndexCardStatus, setInputInventoryIndexCardStatus] = useState(null);

    //Dialog variables
    const [newProductDialog, setNewProductDialog] = useState (false);
    const [viewProductDialog, setViewProductDialog] = useState (false);
    const [editProductDialog, setEditProductDialog] = useState (false);
    const [deleteSingleProductDialog, setDeleteSingleProductDialog] = useState(false);
    const [deleteSelectedProductsDialog, setDeleteSelectedProductsDialog] = useState(false);

    //Other Variables
    const [productsTarget, setProductsTarget] = useState([]);
    //const [transactionsTarget, setTransactionsTarget] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    //Services
    const productService = new ProductService();
    const priceListService = new PriceListService();
    const productPriceListService = new ProductPriceListService();
    const inventoryIndexCardService = new InventoryIndexCardService();
    const inventoryIndexCardTransactionService = new InventoryIndexCardTransactionService();
    const warehouseService = new WarehouseService();
    const warehouseAreaService = new WarehouseAreaService();
    const warehouseSlotService = new WarehouseSlotService();

    useEffect( () => {

        fetchProductListData();
        fetchPriceListData();
        fetchInventoryIndexCardList();
        // eslint-disable-next-line react-hooks/exhaustive-deps            
    }, []);

    async function fetchProductListData () {
        console.log ( '# fetchProductListData #' );
        await productService.getProductList().then( (_productsData) => {
            //console.log ('_productsData: ', _productsData, '\n');

            _productsData = _productsData.filter( prod => !(prod.dateCreated === 0) ); // Removes db DEFAULT row
            
            setProductList (JSON.parse (JSON.stringify (_productsData) ) );
            setProductListUndo (JSON.parse (JSON.stringify (_productsData) ) );
        });
    }

    async function putProduct (_product) {
        console.log ( '# putProduct #' );
        //console.log ('_product: ', _product, '\n');
        let returnedId = await productService.putProduct (_product);
        toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Producto Creado', life: 3000 });
        return returnedId;
    }

    async function updateProduct (_productList, _option) {
        console.log ( '# updateProduct #' );
        //console.log ('_productList: ', _productList, '\n');
        await productService.updateProduct (_productList).then ( (returnedValue) => {
            //console.log ('returnedValue: ', returnedValue, '\n');
            switch (_option) {
                case 'update':
                    toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Producto Actualizado', life: 3000 });
                    break;
                case 'delete':
                    toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Producto Borrado', life: 3000 });
                    break;      
            }
            return returnedValue;
        });
    }

    async function fetchPriceListData () {
        console.log ( '# fetchPriceListData #' );
        await priceListService.getPriceList().then( (_priceListsData) => {
            console.log ('priceListsData: ', _priceListsData);

            _priceListsData = _priceListsData.filter( pl => !(pl.dateCreated === 0) ); // Removes db DEFAULT row

            setPricesLists (JSON.parse(JSON.stringify(_priceListsData)));
        });
    };

    async function updatePriceList (_priceList) {
        console.log ( '# updatePriceList #' );
        //console.log ('_priceList: ', _priceList, '\n');
        await priceListService.updatePriceList (_priceList).then( (returnedValue) => {
            //console.log ('returnedValue: ', returnedValue, '\n');
            toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Lista de precios actualizada', life: 3000 });
            return returnedValue;
        });
    };

    async function putProductPriceList (_priceList) {
        console.log ( '# putProductPriceList #' );
        //console.log ('_priceList: ', _priceList, '\n');
        let returnId = await productPriceListService.putProductPriceList(_priceList);
        //console.log ('returnId: ', returnId, '\n');
        //toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Producto agregado a todas las listas', life: 3000 });
        return returnId;
    };

    async function updateProductPriceList (_priceList, _option) {
        console.log ( '# updateProductPriceList #' );
        await productPriceListService.updateProductPriceList(_priceList).then( (returnedValue) => {
            //console.log ('returnedValue: ', returnedValue, '\n');
            switch (_option) {
                case 'update':
                    toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Producto actualizado en todas las listas', life: 3000 });
                    break;
                case 'delete':
                    toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Producto/s Removido/s', life: 3000 });
                    break;        
            }
            return returnedValue;
        });


    };

    async function fetchInventoryIndexCardList () {
        console.log ( '# fetchInventoryIndexCardList #' );
        await inventoryIndexCardService.getInventoryIndexCardList().then ( (_inventoryIndexCardListData) => {
            console.log ('_inventoryIndexCardListData: ', _inventoryIndexCardListData, '\n');
            setInventoryIndexCardList (JSON.parse(JSON.stringify(_inventoryIndexCardListData)));
        });
    };

    async function putInventoryIndexCard (_inventoryIndexCard) {
        console.log ( '# putInventoryIndexCard #' );
        let returnedId = await inventoryIndexCardService.putInventoryIndexCard (_inventoryIndexCard);
        console.log ('returnedId: ', returnedId, '\n');
        return returnedId;
    };

    async function putInventoryIndexCardTransactions (_inventoryIndexCard) {
        console.log ( '# putInventoryIndexCardTransactions #' );
        let returnedId = await inventoryIndexCardTransactionService.putInventoryIndexCardTransaction (_inventoryIndexCard);
        //console.log ('returnedId: ', returnedId, '\n');
        toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Producto agregado al inventario', life: 3000 });
        return returnedId;

    };

    async function updateInventoryIndexCard (_inventoryIndexCard) {
        console.log ( '# updateInventoryIndexCard #' );
        await inventoryIndexCardService.updateInventoryIndexCard(_inventoryIndexCard).then ( (returnedValue) => {
            console.log ('returnedValue: ', returnedValue, '\n');
            return returnedValue;
        });
    };

    async function updateInventoryIndexCardTransactions (_inventoryIndexCard) {
        console.log ( '# updateInventoryIndexCardTransactions #' );
        await inventoryIndexCardTransactionService.updateInventoryIndexCardTransaction (_inventoryIndexCard).then( (returnedValue) => {
            console.log ('returnedValue: ', returnedValue, '\n');
            return returnedValue;
        });
    };


    ///////////////////////////////
    // Action Body Dialog Functions
    ///////////////////////////////

    const openNewProductDialog = () => {
        setProductEdited (JSON.parse(JSON.stringify({...emptyProduct})));
        setProductEditedUndo (JSON.parse(JSON.stringify({...emptyProduct})));
        setInputCode (emptyProduct.code);
        setInputName (emptyProduct.name);
        setInputDetail (emptyProduct.detail);
        setInputBrand (emptyProduct.brand);
        setInputModel (emptyProduct.model);
        setInputCategory (emptyProduct.category);
        setInputManufacturer (emptyProduct.manufacturer);
        setInputQuantityPerUnit (emptyProduct.quantityPerUnit);
        setInputUnitPurchasePrice (emptyProduct.unitPurchasePrice);
        setInputPurchasePriceCurrency (emptyProduct.purchasePriceCurrency);
        setInputInitialUnitQuantity (emptyProduct.initialUnitQuantity);
        setInputInventoryIndexCardStatus (emptyProduct.inventoryStatus);

        //setInventoryIndexCardSettingsInsert (JSON.parse(JSON.stringify({...emptyInventoryIndexCardSettingsInsert})));
        //setInventoryIndexCardTransactionsInsert (JSON.parse(JSON.stringify({...emptyInventoryIndexCardTransactionsInsert})));

        setSubmitted (false);
        setNewProductDialog (true);
    }

    const hideNewProductDialog = () => {
        setProductEdited (JSON.parse (JSON.stringify ( {...productEditedUndo} ) ) );
        //setProductInsert (JSON.parse (JSON.stringify ( {...productInsertUndo} ) ) );
        setSubmitted (false);
        setNewProductDialog (false);
    }

    const openViewProductDialog = (rowData) => {
        setProductEdited ({ ...rowData });
        setInputCode (rowData.code);
        setInputName (rowData.name);
        setInputDetail (rowData.detail);
        setInputBrand (rowData.brand);
        setInputModel (rowData.model);
        setInputCategory (rowData.category);
        setInputQuantityPerUnit (rowData.quantityPerUnit);
        setInputUnitPurchasePrice (rowData.unitPurchasePrice);

        setViewProductDialog (true);
    }

    const hideViewProductDialog = () => {
        setViewProductDialog (false);
    }

    const openEditProductDialog = (rowData) => {
        setProductEdited ({ ...rowData });
        setProductEditedUndo (JSON.parse(JSON.stringify({...rowData})));
        setInputCode (rowData.code);
        setInputName (rowData.name);
        setInputDetail (rowData.detail);
        setInputBrand (rowData.brand);
        setInputModel (rowData.model);
        setInputCategory (rowData.category);
        setInputQuantityPerUnit (rowData.quantityPerUnit);
        setInputUnitPurchasePrice (rowData.unitPurchasePrice);

        setEditProductDialog(true);
    }

    const hideEditProductDialog = () => {
        setProductList(JSON.parse(JSON.stringify(productListUndo)))
        setProductEdited (JSON.parse(JSON.stringify(productEditedUndo)))
        //setProductUpdate (JSON.parse(JSON.stringify(productUpdateUndo)));
        setSubmitted(false);
        setEditProductDialog(false);
    }

    const openDeleteSelectedProductsDialog = () => {
        setDeleteSelectedProductsDialog(true);
    };

    const hideDeleteSelectedProductsDialog = () => {
        setSelectedProducts([]);
        setDeleteSelectedProductsDialog(false);
    };

    // Needed only if trash icon is enable in actionBodyItems 
    const openDeleteSingleProductDialog = (rowData) => {
        setProductEdited(rowData);

        setPriceListUpdate ({});        

        setDeleteSingleProductDialog(true);
    }
    // Needed only if trash icon is enable in actionBodyItems 
    const hideDeleteSingleProductDialog = () => {
        setDeleteSingleProductDialog(false);
    };


    ///////////////////////////////
    // Event Functions
    ///////////////////////////////

    const onInputCodeChange = (event) => {

        const val = event.target.value || '';
        let _productEdited = { ...productEdited };
        let _productUpdate = { ...productUpdate };

        _productEdited.code = val;
        _productUpdate.code= _productEdited.code;

        setInputCode (val);
        setProductEdited(_productEdited);
        setProductUpdate(_productUpdate);
    }

    const onInputNameChange = (event) => {

        const val = event.target.value || '';
        let _productEdited = { ...productEdited };
        let _productUpdate = { ...productUpdate };

        _productEdited.name = val;
        _productUpdate.name = _productEdited.name;

        setInputName (val);
        setProductEdited(_productEdited);
        setProductUpdate(_productUpdate);
    }

    const onInputDetailChange = (event) => {

        const val = event.target.value || '';
        let _productEdited = { ...productEdited };
        let _productUpdate = { ...productUpdate };

        _productEdited.detail = val;
        _productUpdate.detail = _productEdited.detail;

        setInputDetail (val);
        setProductEdited(_productEdited);
        setProductUpdate(_productUpdate);
    }

    const onInputBrandChange = (event) => {

        const val = event.target.value || '';
        let _productEdited = { ...productEdited };
        let _productUpdate = { ...productUpdate };

        _productEdited.brand = val;
        _productUpdate.brand = _productEdited.brand;

        setInputBrand (val);
        setProductEdited(_productEdited);
        setProductUpdate(_productUpdate);
    }

    const onInputModelChange = (event) => {

        const val = event.target.value || '';
        let _productEdited = { ...productEdited };
        let _productUpdate = { ...productUpdate };

        _productEdited.model = val;
        _productUpdate.model = _productEdited.model;

        setInputModel(val);
        setProductEdited(_productEdited);
        setProductUpdate(_productUpdate);
    }

    const onInputCategoryChange = (event) => {

        const val = event.target.value || '';
        let _productEdited = { ...productEdited };
        let _productUpdate = { ...productUpdate };

        _productEdited.category = val;
        _productUpdate.category = _productEdited.category;

        setInputCategory (val);
        setProductEdited(_productEdited);
        setProductUpdate(_productUpdate);
    }

    const onInputManufacturerChange = (event) => {

        const val = event.target.value || '';
        let _productEdited = { ...productEdited };
        let _productUpdate = { ...productUpdate };

        _productEdited.manufacturer = val;
        _productUpdate.manufacturer = _productEdited.manufacturer ;

        setInputManufacturer (val);
        setProductEdited(_productEdited);
        setProductUpdate(_productUpdate);
    }

    const onChangeInputQuantityPerUnit = (event) => {

        const val = event.target.value || 0;
        let _productEdited = { ...productEdited };
        let _productUpdate = { ...productUpdate };

        _productEdited.quantityPerUnit = val;
        _productUpdate.quantityPerUnit = _productEdited.quantityPerUnit;

        setInputQuantityPerUnit (val);
        setProductEdited(_productEdited);
        setProductUpdate(_productUpdate);

    }

    const onChangeInputInitialUnitQuantity = (event) => {

        const val = event.target.value || 0;
        let _productEdited = { ...productEdited };
        let _productUpdate = { ...productUpdate };

        _productEdited.initialUnitQuantity = val;
        _productUpdate.initialUnitQuantity = _productEdited.initialUnitQuantity;

        setInputQuantityPerUnit (val);
        setProductEdited(_productEdited);
        setProductUpdate(_productUpdate);
    }

    const onInputPurchasePriceChange = (event) => {

        const val = event.target.value || 0;
        let _productEdited = { ...productEdited };
        let _productUpdate = { ...productUpdate };

        _productEdited.unitPurchasePrice = val;
        _productUpdate.unitPurchasePrice = _productEdited.unitPurchasePrice;

        setInputUnitPurchasePrice (val);
        setProductEdited(_productEdited);
        setProductUpdate(_productUpdate);
    }

    const onFocus = (event) => {
        console.log ('# onFocus #');

        event.target.select();
    };


    /////////////////////////////////////////
    // Persist data into db
    ////////////////////////////////////////

    const saveNewProduct = async () => {      
        console.log ('# saveNewProduct #');
        
        setSubmitted(true);
        
        let _productEdited = { ...productEdited };
        let _productInsert = {...productInsert };
        let _productsTarget = [];
        console.log ('_productEdited: ', _productEdited);
        console.log ('_productInsert: ', _productInsert);

        if (_productEdited.code.trim()) { // If product code input is valid, proceed to insert it to product table, price lists table and Inventory table

            _productEdited.dateCreated = Date.now(); // created timestamp
            //_productEdited.dateUpdated = 0; // updated timestamp
            //_productEdited.dateDeleted = 0; // deleted timestamp

            _productInsert = JSON.parse( JSON.stringify( _productEdited ) ); //Deep copy. Only on new product (insert) all props are copied.
            _productsTarget.push (_productInsert); //step needed for SQLiteDTO module. An array must be provided to run properly
            _productInsert.id = await putProduct(_productsTarget); // Product inserted in tblProduct table. Id returned to be used as FK
            
            console.log('_productInsert', _productInsert);

            _productsTarget = [];

            if (_productInsert.id) { // If product was created successfully, it will be asociated with Inventtory Index Card and included in PriceLists
                await addNewPriceListProduct (_productInsert); //Add new product to price Lists. Product to be inserted passed as parameter.
                await addNewProductInventoryIndexCard (_productInsert); //Add new product to the inventory. Product to be inserted passed as parameter.
            }

            //toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Producto Creado', life: 3000 });
        }

        //setProductsTarget ([]);
        fetchProductListData();
        setNewProductDialog(false);
    }

    const saveEditProduct = async () => {
        
        setSubmitted(true);
        let _productList = [...productList];
        let _productEdited = { ...productEdited };
        let _productUpdate = { ...productUpdate };
        let _productsTarget = [];

        console.log ('_productEdited', _productEdited);
        console.log ('_productUpdate', _productUpdate);

        if ( _productEdited.code.trim() ) {

            const index = findIndexById(_productEdited.id);
            _productList[index] = _productEdited;
            setProductList(_productList);

            _productUpdate.id = _productEdited.id;
            _productUpdate.dateUpdated = Date.now(); // updated timestamp
            _productsTarget.push (_productUpdate);

            console.log ('_productsTarget', _productsTarget);

            await updateProduct (_productsTarget, 'update');

            await modifyPriceListProduct (_productsTarget); //Updates product data in all price lists

        }

        fetchProductListData();
        setProductEdited ( {...emptyProduct} );
        //setProductsTarget ( [] )
        setEditProductDialog(false);
    }

    //Use case: Delete product using a trash can icon displayed at the end of the row.
    const deleteSingleProduct = async () => {
        console.log ('# deleteSingleProduct #');

        let _productList = [...productList];
        let _productEdited = {...productEdited};
        let _productUpdate = {...productUpdate};

        _productList = _productList.filter ( listItem => listItem.id !== _productEdited.id);
        setProductList(_productList);

        _productUpdate.id = _productEdited.id;
        _productUpdate.dateDeleted = Date.now(); //logical delete

        await updateProduct(_productUpdate, 'delete') // update persistent data source.

        //await deleteSingleProductFromPricesLists (_productUpdate);

        await deleteSelectedProductsFromPricesLists ( [_productUpdate] );
       
        setDeleteSingleProductDialog(false);
    };

    //Use case: Delete selected Products from the product list. Delete also from inventory and prices lists.  
    const deleteSelectedProducts = async () => {
        console.log ('# deleteSelectedProducts #');
        let _productList = [...productList];
        let _selectedProducts = [...selectedProducts];
        let _productUpdate = {};
        let _productsTarget = [];

        _productList = _productList.filter( listItem => !_selectedProducts.includes (listItem));
        setProductList(_productList);

        console.log ('_selectedProducts',_selectedProducts);
 
        _selectedProducts.forEach( (prodEdited) => {
            _productUpdate.id = prodEdited.id;
            _productUpdate.dateDeleted = Date.now(); // logical delte
            _productsTarget.push (JSON.parse(JSON.stringify(_productUpdate)));
            console.log ('_productsTarget',_productsTarget);
        });

        //await productService.updateProduct (_productsTarget);
        //toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Productos Borrados', life: 3000 });
        await updateProduct (_productsTarget, 'delete');

        await deleteSelectedProductsFromPricesLists (_productsTarget);

        await deleteSelectedProductsFromInventoryIndexCard (_productsTarget);

        setSelectedProducts([]);
        setDeleteSelectedProductsDialog(false);
    };

    //Use case: Add new Product to all Prices Lists
    const addNewPriceListProduct = async (_product) => { // Add new product to all existing prices lists
        console.log ('# addNewPriceListProduct #');

        let _pricesLists = [ ...pricesLists ];
        let _priceListProductInsert = {...emptyPriceListProduct};
        let _priceListInsert = { priceListProducts: [] };

        console.log ('_product: ', _product);
        console.log ('_pricesLists: ', _pricesLists);
        console.log ('_priceListInsert', _priceListInsert);

        _priceListProductInsert.id = _product.id;
        _priceListProductInsert.code = _product.code;
        _priceListProductInsert.name = _product.name;
        _priceListProductInsert.detail = _product.detail;
        _priceListProductInsert.brand = _product.brand;
        _priceListProductInsert.model = _product.model;
        _priceListProductInsert.category = _product.category;
        _priceListProductInsert.manufacturer = _product.manufacturer;
        _priceListProductInsert.initialUnitQuantity = _product.initialUnitQuantity;
        _priceListProductInsert.quantityPerUnit = _product.quantityPerUnit;
        _priceListProductInsert.unitPurchasePrice = _product.unitPurchasePrice;
        _priceListProductInsert.purchasePriceCurrency = _product.purchasePriceCurrency;
        //_priceListProductInsert.inventoryStatus = {id: 3, name:'SINSTOCK'} // Default status is OUTOFSTOCK
        //_priceListProductInsert.productPriceListId = null
        //_priceListProductInsert.priceListId = null
        //_priceListProductInsert.sellPrice = 0
        //_priceListProductInsert.netPrice = 0
        _priceListProductInsert.dateCreated = _product.dateCreated; //it's the value of productPriceList table row
        //_priceListProductInsert.dateUpdated = 0, //it's the value of productPriceList table row
        //_priceListProductInsert.dateDeleted = 0,  //it's the value of productPriceList table row

        _pricesLists.forEach ( async (_priceListEdited) => { // add the new product to every PriceList   

            _priceListInsert = { priceListProducts: [] };
            console.log('_priceListEdited', _priceListEdited);
            console.log('_priceListEdited', _priceListEdited);

            _priceListInsert.id = _priceListEdited.id;
            _priceListInsert.dateUpdated = Date.now();
            _priceListInsert.modifiedDate = _priceListInsert.dateUpdated;
            _priceListInsert.priceListProducts.push ( JSON.parse( JSON.stringify( _product ) ) );

            console.log('_priceListInsert', _priceListInsert);

            updatePriceList (_priceListInsert);

            putProductPriceList (_priceListInsert);

        });

        //fetchProductListData();    
    };

    //Use case: Edit product data and propagate those changes to all Prices Lists that contain that product.
    const modifyPriceListProduct = async (_product) => { // Modify product in all existing prices lists
        console.log ('# modifyPriceListProduct #');

        let _pricesLists = [ ...pricesLists ];
        let _priceListUpdate = { priceListProducts: [] };

        console.log ('_product: ', _product);
        console.log ('_pricesLists: ', _pricesLists);
        console.log ('_priceListUpdate', _priceListUpdate);
        
        _pricesLists.forEach ( async (_priceListEdited) => { // update the modified product on every Price List   
            
            _priceListUpdate = { priceListProducts: []}; // Needs to be empty for next iteration
            console.log('_priceListEdited', _priceListEdited);
            console.log('_priceListUpdate', _priceListUpdate);

            _priceListUpdate.id = _priceListEdited.id;
            _priceListUpdate.dateUpdated = Date.now();
            _priceListUpdate.modifiedDate =_priceListUpdate.dateUpdated;
            _priceListUpdate.priceListProducts.push ( JSON.parse( JSON.stringify( _product ) ) );

            //console.log('_priceListUpdate', _priceListUpdate);

            updatePriceList (_priceListUpdate);

            updateProductPriceList (_priceListUpdate, 'update');

        });

        //fetchProductListData();    
    };

    //Use case: Add new Product to the inventory. To do that create an Inventpry Index card and add firts transaction to initialize it.
    const addNewProductInventoryIndexCard = async (_product) => { // Adds new product to the inventory, creates an index card for it
        console.log ('# addNewProductInventoryIndexCard #');

        let _inentoryIndexCardTransactionInsert = {...emptyInventoryIndexCardTransaction }
        let _inventoryIndexCardInsert = { ...emptyInventoryIndexCardInsert };

        console.log ('_product', _product);

        _inventoryIndexCardInsert.indexCardPartNumber = _product.code; 
        _inventoryIndexCardInsert.indexCardName = _product.name;
        //_inventoryIndexCardInsert.minimumStock = 0;
        //_inventoryIndexCardInsert.maximumStock = 0;
        _inventoryIndexCardInsert.calculatedQuantityBalance = _product.initialUnitQuantity;
        //_inventoryIndexCardInsert.inventoryMethod = 0;
        _inventoryIndexCardInsert.lastTransactionDate = Date.now();
        _inventoryIndexCardInsert.product = {id: _product.id};
        _inventoryIndexCardInsert.dateCreated = Date.now();
        _inventoryIndexCardInsert.indexCardCreationDate = _inventoryIndexCardInsert.dateCreated;
        
        _inventoryIndexCardInsert.id = await putInventoryIndexCard (_inventoryIndexCardInsert); // Creates Product Inventory Index Card

        console.log('_inventoryIndexCardInsert', _inventoryIndexCardInsert);

        _inentoryIndexCardTransactionInsert.inventoryIndexCardId = _inventoryIndexCardInsert.id;
        _inentoryIndexCardTransactionInsert.unitQuantity = _product.initialUnitQuantity; // Added to the the inventory with the initial input quantity.
        _inentoryIndexCardTransactionInsert.dateCreated = _product.dateCreated

        _inventoryIndexCardInsert.transactions.push(_inentoryIndexCardTransactionInsert);

        //console.log ('_inventoryIndexCardInsert', _inventoryIndexCardInsert);

        await putInventoryIndexCardTransactions (_inventoryIndexCardInsert);  
    }

    const deleteSelectedProductsFromInventoryIndexCard = (deletedProductList) => { // Deleted products are removed from invetory table
        console.log ('# deleteSelectedProductsFromInventoryIndexCard #');

        let _inventoryIndexCardList = [...inventoryIndexCardList];
        //let _inventoryIndexCardSettingsUpdate = {...inventoryIndexCardSettingsUpdate};
        //let _inventoryIndexCardTransactionsUpdate = {...inventoryIndexCardTransactionsUpdate};
        let _inventoryIndexCardUpdate = {};
        let _inventoryIndexCardTransactionsUpdate = {};
        let _transactionsTarget = [];

        deletedProductList.forEach( async (productEdited) => {
            _inventoryIndexCardList.forEach ( async (inventoryIndexCardEdited) => { // remove the product from every PriceList   
                console.log('inventoryIndexCardEdited', inventoryIndexCardEdited);

                if (inventoryIndexCardEdited.product.id === productEdited.id) {
                    console.log('prod.id / _productUpdate.id: ', inventoryIndexCardEdited.product.id, '/', productEdited.id);

                    inventoryIndexCardEdited.transactions.forEach( (transEdited) => {
                        transEdited.dateDeleted = Date.now();
                        _transactionsTarget.push(JSON.parse(JSON.stringify(transEdited)));
                    });
                }
                if (_transactionsTarget.length > 0){

                    _inventoryIndexCardUpdate.id = inventoryIndexCardEdited.id;
                    _inventoryIndexCardUpdate.dateDeleted = Date.now();

                    _inventoryIndexCardTransactionsUpdate.id = inventoryIndexCardEdited.id;
                    _inventoryIndexCardTransactionsUpdate.transactions = JSON.parse(JSON.stringify(_transactionsTarget));

                    _transactionsTarget=[];

                    //await inventoryIndexCardService.updateInventoryIndexCard (_inventoryIndexCardUpdate) //update persistent data source.
                    await updateInventoryIndexCard (_inventoryIndexCardUpdate);

                    //await inventoryIndexCardTransactionService.updateInventoryIndexCardTransaction (_inventoryIndexCardTransactionsUpdate); //just modify updated ones
                    await updateInventoryIndexCardTransactions (_inventoryIndexCardTransactionsUpdate, 'delete');
                }
            });
        });

        //toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Productos Borrados de las Listas de Precios', life: 3000 });

        setProductsTarget ([]);
        //setInventoryIndexCardUpdate ({}); 
        //setInventoryIndexCardTransactionsUpdate(JSON.parse(JSON.stringify({...emptyInventoryIndexCardTransactionsUpdate})));    
    };

    //Use case: Want to delete 2 products that are in at least in 4 different Price List
    const deleteSelectedProductsFromPricesLists = (_deletedProductList) => { // Deleted products are removed from all prices lists
        console.log ('# deleteSelectedProductsFromPricesLists #');

        let _pricesLists = [...pricesLists];
        let _priceListUpdate = {};
        let _priceListProductsUpdate = { };
        let _productsTarget = [];

        _deletedProductList.forEach( (_productEdited) => { // for each Product to be deleted (soft delete)
            _pricesLists.forEach ( async (priceListEdited) => { // look for the product in every Price List   
                //console.log('priceListEdited', priceListEdited);
                priceListEdited.priceListProducts.forEach ( (plProd) => { // for each product in the priceListEdited product list
                    if (plProd.id === _productEdited.id) { //check if Product to be deleted match with a product in the price list porduct list
                        // console.log('plProd.id / _productUpdate.id: ', plProd.id, '/', _productEdited.id);
                        plProd.dateDeleted = Date.now(); // if there is a march it will be marked for deletion
                        _productsTarget.push ( JSON.parse(JSON.stringify(plProd)) ); // get all products to be deleted that match products in the proce list in an array
                    }
                });
                if (_productsTarget.length > 0) { // If there are products to be deleted
                    _priceListUpdate.id = priceListEdited.id;
                    _priceListUpdate.dateUpdated = Date.now();
                    _priceListUpdate.modifiedDate = _priceListUpdate.dateUpdated;
                    //_priceListProductsUpdate.id = priceListEdited.id;
                    //_priceListProductsUpdate.priceListProducts = _productsTarget;
                    _priceListUpdate.priceListProducts = _productsTarget;
                    await updatePriceList (_priceListUpdate);
                    await updateProductPriceList (_priceListProductsUpdate, 'delete');
                }
            });
        });

        _productsTarget = [];

        //toast.current.show({ severity: 'success', summary: 'Listo !', detail: 'Productos Borrados de las Listas de Precios', life: 3000 }); 
    };

    /*
    // Use case: Product to be deleted must be removed from all prices lists that includes it.
    const deleteSingleProductFromPricesLists = async (_deletedProduct) => {  // Used with trash can added to AtionBody. Deleted product is removed from all prices lists
        console.log ('# deleteSingleProductFromPricesLists #');
        let _pricesLists = [ ...pricesLists ];
        //let _priceListSettingsUpdate = {...priceListSettingsUpdate};
        //let _priceListProductsUpdate = {...priceListProductsUpdate};
        //let _priceListProductsUpdate = {};
        let _priceListUpdate = {};
        let _productsTarget = [];
        //console.log ('_priceLists: ', _priceLists);

        _pricesLists.forEach ( async (_priceListEdited) => {    
            console.log('_priceListEdited', _priceListEdited);
            _priceListEdited.priceListProducts.forEach ( async (prod) => {
                if (prod.id === _deletedProduct.id) { //on match between edited product with price list product, product gets updated
                    console.log('prod.id / _productUpdate.id: ', prod.id, '/', _deletedProduct.id);
                    prod.dateDeleted = Date.now();
                    _productsTarget.push ( JSON.parse(JSON.stringify(prod)) );
                    //count ++;
                }
            });
            if (_productsTarget.length > 0){
                _priceListUpdate.id = _priceListEdited.id;
                _priceListUpdate.dateUpdated = Date.now();
                _priceListUpdate.modifiedDate = _priceListUpdate.dateUpdated;
                _priceListUpdate.priceListProducts = _productsTarget;

                await updatePriceList (_priceListUpdate) //update persistent data source.
                await updateProductPriceList (_priceListUpdate, 'delete'); //just modify updated ones

            }
        });
        setProductsTarget ([]);
        //setPriceListSettingsUpdate (JSON.parse(JSON.stringify({...emptyPriceListSettingsUpdate})));
        //setPriceListProductsUpdate ({});        
        //setDeleteSingleProductDialog(false);
    };
    */




    ////////////////////////////
    // Aditional functions
    //////////////////////////7

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const findIndexById = (id) => {
        let _productList = [...productList];

        let index = -1;
        for (let i = 0; i < _productList.length; i++) {
            if (_productList[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    /////////////////////////
    // Toolbar Functions
    /////////////////////////

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="" icon="pi pi-plus" className="p-button-secondary p-button-raised p-mr-2" onClick={openNewProductDialog} tooltip="Alta de producto" />
                <Button label="" icon="pi pi-minus" className="p-button-warning p-button-raised" onClick={openDeleteSelectedProductsDialog} tooltip='Baja de producto' disabled={!selectedProducts || !selectedProducts.length} />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            
            <React.Fragment>
{/*             <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Importar" chooseLabel="Importar" className="p-mr-2 p-d-inline-block" />
                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
*/}            </React.Fragment>

        )
    }


    /////////////////////////////
    // Layout formating functions 
    /////////////////////////////

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only" onClick={() => openViewProductDialog(rowData)} />
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only p-mr-2" onClick={() => openEditProductDialog(rowData)} tooltip='editar' />
                {/* <Button icon="pi pi-times p-c" className="p-button-rounded p-button-secondary p-button-text p-button-icon-only" onClick={() => confirmDeleteSingleProduct(rowData)} /> */}
            </React.Fragment>
        );
    }

    const imageBodyTemplate = (rowData) => {
        return <img src={`assets/demo/images/product/${rowData.image}`} onError={(event) => event.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" />
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('es-AR', { style: 'currency', currency: 'USD' }); //cambiar símbolo 'USD' por variable y Locale 'en-US' por variable
    }

    const priceBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="price-text">{`${rowData.purchasePriceCurrency.code} `}</span>
                <span className="price-text">{formatCurrency(rowData.unitPurchasePrice)}</span>
            </React.Fragment>
        );
    }

    const statusBodyTemplate = (rowData) => {
        return <span className={`product-badge status-${rowData.inventoryStatus.name.toLowerCase()}`}>{rowData.inventoryStatus.name}</span>;
    }


    ////////////////////////
    // Headers
    ////////////////////////

    const header = (
        <div className="table-header">
            <h5 className="p-m-0">Productos</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(event) => setGlobalFilter(event.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    //////////////////////////
    // Footers
    //////////////////////////

    const newProductDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideNewProductDialog} />
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={saveNewProduct} />
        </React.Fragment>
    );

    const viewProductDialogFooter = (
        <React.Fragment>
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={hideViewProductDialog} />
        </React.Fragment>
    );

    const editProductDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideEditProductDialog} />
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={saveEditProduct} />
        </React.Fragment>
    );

    const deleteSingleProductDialogFooter = (
        <React.Fragment>
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSingleProduct} />
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSingleProductDialog} />

        </React.Fragment>
    );

    const deleteSelectedProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSelectedProductsDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    return (
        <div className="datatable-crud">
            <Toast ref={toast} />
            
            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} className="p-datatable-striped" value={productList} dataKey="id"
                    selection={selectedProducts} onSelectionChange={ (event) => setSelectedProducts(event.value)}
                    //paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    //currentPageReportTemplate="Viendo ({first} - {last}) de ({totalRecords})"
                    scrollable scrollHeight="590px"
                    globalFilter={globalFilter}
                    header={header}>

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column field="id" header="ProdId" sortable />
                    <Column field="code" header="Código" sortable />
                    <Column field="brand" header="Marca" sortable />
                    <Column field="model" header="Modelo" sortable />
                    <Column field="detail" header="Materiales" sortable />
                    <Column field="category" header="Categoría" sortable />
                {/* <Column header="Image" body={imageBodyTemplate}></Column> */}
                    <Column field="unitPurchasePrice" header="Costo" body={priceBodyTemplate} sortable/>
                {/* <Column field="quantityPerUnit" header="Cantidad por Unidad" disabled={true} ></Column> */}
                {/* <Column field="initialUnitQuantity" header="Cantidad" > </Column> */}
                {/* <Column field="sellPrice" header="Precio" body={priceBodyTemplate} sortable></Column>   */}
                {/* <Column field="rating" header="Opinión" body={ratingBodyTemplate} sortable></Column>    */}
                {/* <Column field="inventoryStatus.name" header="Estado" body={statusBodyTemplate} sortable></Column> */}
                    <Column body={actionBodyTemplate}/>
                </DataTable>
            </div>

            <Dialog visible={newProductDialog} header="Detalles del Producto" style={{ width: '450px' }} className="p-fluid" modal closable={false}  footer={newProductDialogFooter} onHide={()=>{}}>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Código (alfanumérico) </span>
                    <InputText id="codeInputText" value={inputCode} onChange={ (event) => onInputCodeChange (event) } required autoFocus className={classNames({ 'p-invalid': submitted && !inputCode })} />
                    {submitted && !inputCode && <small className="p-invalid">Requerido !</small>}
                </div>

                {/*
                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Nombre </span>
                    <InputText id="nameInputText" value={inputName} onChange={(event) => onInputNameChange(event, 'name')} />
                </div>
                */}

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Fabricante </span>
                    <InputText id="manufacturerInputText" value={inputManufacturer} onChange={ (event) => onInputManufacturerChange (event) } />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Materiales </span>
                    <InputTextarea id="detailInputText" value={inputDetail} onChange={(event) => onInputDetailChange(event, 'detail')} rows={2} cols={20} />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Marca </span>
                    <InputText id="brandInputText" value={inputBrand} onChange={ (event) => onInputBrandChange (event) } />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Modelo </span>
                    <InputText id="modelInputText" value={inputModel} onChange={ (event) => onInputModelChange (event) } />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Categoría </span>
                    <InputText id="categoryInputText" value={inputCategory} onChange={ (event) => onInputCategoryChange (event) } />
                </div>

                <br/>
                <span className="p-inputgroup-addon"> Costo </span>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"> USD </span>
                    <InputNumber id="unitPurchasePriceInputNumber" value={inputUnitPurchasePrice} onValueChange={ (event) => onInputPurchasePriceChange (event) } mode="decimal" maxFractionDigits={2} min={0} locale="es-AR" placeholder='0.00'/>
                </div>

                <br/>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"> Cant. Inicial </span>
                    <InputNumber id="initialUnitQuantityInputNumber" value={inputInitialUnitQuantity} onValueChange = { (event) => onChangeInputInitialUnitQuantity (event) } integeronly maxFractionDigits={0} min={0} placeholder='0' />
                    <span className="p-inputgroup-addon"> Cant. x Unidad </span>
                    <InputNumber id="quantityPerUnitInputNumber" value={inputQuantityPerUnit} onValueChange = { (event) => onChangeInputQuantityPerUnit (event) } integeronly maxFractionDigits={0} min={0} placeholder='0' disabled={true} />
                </div>

            </Dialog>

            <Dialog visible={viewProductDialog} header="Detalles del Producto" modal closable={false} style={{ width: '450px' }} className="p-fluid" footer={viewProductDialogFooter} onHide={()=>{}}>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Código (alfanumérico) </span>
                    <InputText id="codeInputText" value={inputCode} onChange={(event) => onInputCodeChange(event) } required autoFocus className={classNames({ 'p-invalid': submitted && !inputCode })} disabled ={true}/>
                    {submitted && !inputCode && <small className="p-invalid">Requerido !</small>}
                </div>
                {/*
                <div className="p-field">
                    <label htmlFor="nameInputText">Nombre</label>
                    <InputText id="nameInputText" value={inputName} onChange={(event) => onInputNameChange(event, 'name')} />
                </div>
                */}
                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Fabricante </span>
                    <InputText id="manufacturerInputText" value={inputManufacturer} onChange={ (event) => onInputManufacturerChange (event) } disabled ={true}/>
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Materiales </span>
                    <InputTextarea id="detailInputText" value={inputDetail} onChange={(event) => onInputDetailChange(event, 'detail')} rows={2} cols={20} disabled ={true}/>
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Marca </span>
                    <InputText id="brandInputText" value={inputBrand} onChange={ (event) => onInputBrandChange (event) } disabled ={true}/>
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Modelo </span>
                    <InputText id="modelInputText" value={inputModel} onChange={ (event) => onInputModelChange (event) } disabled ={true}/>
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Categoría </span>
                    <InputText id="categoryInputText" value={inputCategory} onChange={ (event) => onInputCategoryChange (event) } disabled ={true}/>
                </div>

                <br/>
                <span className="p-inputgroup-addon"> Costo </span>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"> USD </span>
                    <InputNumber id="unitPurchasePriceInputNumber" value={inputUnitPurchasePrice} onValueChange={ (event) => onInputPurchasePriceChange (event) } mode="decimal" maxFractionDigits={2} min={0} locale="es-AR" placeholder='0.00' disabled ={true}/>
                </div>

                <br/>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"> Cant. Inicial </span>
                    <InputNumber id="initialUnitQuantityInputNumber" value={inputInitialUnitQuantity} onValueChange = { (event) => onChangeInputInitialUnitQuantity (event) } integeronly maxFractionDigits={0} min={0} placeholder='0' disabled ={true}/>
                    <span className="p-inputgroup-addon"> Cant. x Unidad </span>
                    <InputNumber id="quantityPerUnitInputNumber" value={inputQuantityPerUnit} onValueChange = { (event) => onChangeInputQuantityPerUnit (event) } integeronly maxFractionDigits={0} min={0} placeholder='0' disabled={true} disabled ={true}/>
                </div>
                {/*
                <div className="p-formgrid p-grid">
                    <div className="p-field p-col">
                        <label htmlFor="unitPurchasePriceInputNumber">Costo</label>
                        <InputNumber id="unitPurchasePriceInputNumber" value={inputUnitPurchasePrice} onValueChange={ (event) => onInputPurchasePriceChange (event) } onFocus = {onFocus} mode="currency" currency="USD" maxFractionDigits={2} min={0} locale="es-AR" currencyDisplay="code" placeholder='0.00 USD'/>
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="quantityPerUnitInputNumber">Cant. x Unidad</label>
                        <InputNumber id="quantityPerUnitInputNumber" value={inputQuantityPerUnit} onValueChange = { (event) => onChangeInputQuantityPerUnit (event) } onFocus = {onFocus} integeronly maxFractionDigits={0} min={0} placeholder='0' disabled={true} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="initialUnitQuantityInputNumber">Cant. Inicial</label>
                        <InputNumber id="initialUnitQuantityInputNumber" value={inputInitialUnitQuantity} onValueChange = { (event) => onChangeInputInitialUnitQuantity (event) } onFocus = {onFocus} integeronly maxFractionDigits={0} min={0} placeholder='0' disabled={true} />
                    </div>
                </div>
                */}

            </Dialog>

            <Dialog visible={editProductDialog} header="Detalles del Producto" modal closable={false} style={{ width: '450px' }} className="p-fluid" footer={editProductDialogFooter} onHide={()=>{}}>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Código (alfanumérico) </span>
                    <InputText id="codeInputText" value={inputCode} onChange={(event) => onInputCodeChange(event) } required autoFocus className={classNames({ 'p-invalid': submitted && !inputCode })} />
                    {submitted && !inputCode && <small className="p-invalid">Requerido !</small>}
                </div>
                {/*
                <div className="p-field">
                    <label htmlFor="nameInputText">Nombre</label>
                    <InputText id="nameInputText" value={inputName} onChange={(event) => onInputNameChange(event, 'name')} />
                </div>
                */}
                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Fabricante </span>
                    <InputText id="manufacturerInputText" value={inputManufacturer} onChange={ (event) => onInputManufacturerChange (event) } />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Materiales </span>
                    <InputTextarea id="detailInputText" value={inputDetail} onChange={(event) => onInputDetailChange(event, 'detail')} rows={2} cols={20} />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Marca </span>
                    <InputText id="brandInputText" value={inputBrand} onChange={ (event) => onInputBrandChange (event) } />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Modelo </span>
                    <InputText id="modelInputText" value={inputModel} onChange={ (event) => onInputModelChange (event) } />
                </div>

                <br/>
                <div className="p-field">
                    <span className="p-inputgroup-addon"> Categoría </span>
                    <InputText id="categoryInputText" value={inputCategory} onChange={ (event) => onInputCategoryChange (event) } />
                </div>

                <br/>
                <span className="p-inputgroup-addon"> Costo </span>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"> USD </span>
                    <InputNumber id="unitPurchasePriceInputNumber" value={inputUnitPurchasePrice} onValueChange={ (event) => onInputPurchasePriceChange (event) } mode="decimal" maxFractionDigits={2} min={0} locale="es-AR" placeholder='0.00'/>
                </div>

                <br/>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"> Cant. Inicial </span>
                    <InputNumber id="initialUnitQuantityInputNumber" value={inputInitialUnitQuantity} onValueChange = { (event) => onChangeInputInitialUnitQuantity (event) } integeronly maxFractionDigits={0} min={0} placeholder='0' />
                    <span className="p-inputgroup-addon"> Cant. x Unidad </span>
                    <InputNumber id="quantityPerUnitInputNumber" value={inputQuantityPerUnit} onValueChange = { (event) => onChangeInputQuantityPerUnit (event) } integeronly maxFractionDigits={0} min={0} placeholder='0' disabled={true} />
                </div>
                {/*
                <div className="p-formgrid p-grid">
                    <div className="p-field p-col">
                        <label htmlFor="unitPurchasePriceInputNumber">Costo</label>
                        <InputNumber id="unitPurchasePriceInputNumber" value={inputUnitPurchasePrice} onValueChange={ (event) => onInputPurchasePriceChange (event) } onFocus = {onFocus} mode="currency" currency="USD" maxFractionDigits={2} min={0} locale="es-AR" currencyDisplay="code" placeholder='0.00 USD'/>
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="quantityPerUnitInputNumber">Cant. x Unidad</label>
                        <InputNumber id="quantityPerUnitInputNumber" value={inputQuantityPerUnit} onValueChange = { (event) => onChangeInputQuantityPerUnit (event) } onFocus = {onFocus} integeronly maxFractionDigits={0} min={0} placeholder='0' disabled={true} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="initialUnitQuantityInputNumber">Cant. Inicial</label>
                        <InputNumber id="initialUnitQuantityInputNumber" value={inputInitialUnitQuantity} onValueChange = { (event) => onChangeInputInitialUnitQuantity (event) } onFocus = {onFocus} integeronly maxFractionDigits={0} min={0} placeholder='0' disabled={true} />
                    </div>
                </div>
                */}

            </Dialog>

            <Dialog visible={deleteSingleProductDialog} header="Confirm" style={{ width: '450px' }} modal footer={deleteSingleProductDialogFooter} onHide={hideDeleteSingleProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {productEdited && <span>¿Confirma ELIMINAR <b>{productEdited.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteSelectedProductsDialog} header="Confirm" style={{ width: '450px' }} modal footer={deleteSelectedProductsDialogFooter} onHide={hideDeleteSelectedProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {productEdited && <span>¿Confirma ELIMINACIÓN de los productos seleccionados?</span>}
                </div>
            </Dialog>
        </div>
    );
}