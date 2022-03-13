//Build DTOs objects
class SqliteDTO {

    constructor() {
        this.dtoInit = {};
        this.dto = {};
        this.dbEntityInit = {};
        this.dbEntity = {};

        this.dtoList = [];
        this.dbEntityList = [];
    };
};


/////////////////
// Methods
/////////////////



////////////////////////
// Link Tables
/////////////////////////

class ProductPriceListDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbEntityInit = {};
    };
    
    getDTO (obj) {     // Sets ProductPriceList Entity to impact productPriceList table.
        console.log('# getPriceListProductsDto #', '\n');
        //console.log('products array (obj): ', obj, '\n');

        for (const product of obj.priceListProducts) {
            this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization
            this.dbEntity.lnkProductPriceListId = product.productPriceListId; // Field must exist even if its null, and must be first column always
            if (product.id != null) { this.dbEntity.lnkProductPriceListProductId = product.id };
            if (obj.id != null) { this.dbEntity.lnkProductPriceListPriceListId = obj.id };
            if (product.markUp != null) { this.dbEntity.lnkProductPriceListMarkUp = product.markUp};
            if (product.sellPrice != null) { this.dbEntity.lnkProductPriceListSellPrice = product.sellPrice};
            //if (product.sellPriceCurrency != null) { this.dbEntity.lnkProductPriceListSellPriceCurrencyId = product.sellPriceCurrency.id || null };
            if (product.netPrice != null) { this.dbEntity.lnkProductPriceListNetPrice = product.netPrice};
            //if (product.netPriceCurrency != null) { this.dbEntity.lnkProductPriceListNetPriceCurrencyId = product.netPriceCurrency.id || null };
            if (product.dateCreated != null) { this.dbEntity.lnkProductPriceListRowDateCreated = product.dateCreated };
            if (product.dateUpdated != null) this.dbEntity.lnkProductPriceListRowDateUpdated = product.dateUpdated;
            if (product.dateDeleted != null) { this.dbEntity.lnkProductPriceListRowDateDeleted = product.dateDeleted }; //must be always last column
            this.dbEntityList.push (JSON.parse(JSON.stringify(this.dbEntity)));
            //console.log('this.dbEntity: ', this.dbEntity, '\n');
        };
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        console.log('this.dbEntityList: ', this.dbEntityList, '\n');
    };

    // Sets product object belonging to an existent Price List to be used in UI
    setDTO (obj) {
        console.log('# setPriceListProductsDto #', '\n');
        //console.log('obj', obj, '\n');        
        this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
        this.dto.id = obj.prdProductId || 0;
        this.dto.code = obj.prdProductCode || '';
        this.dto.name = obj.prdProductName || '';
        this.dto.detail = obj.prdProductDetail || '';
        this.dto.brand = obj.prdProductBrand || '';
        this.dto.model = obj.prdProductModel || '';
        this.dto.category = obj.prdProductCategory || '';
        this.dto.manufacturer = obj.prdProductManufacturer || '';
        this.dto.initialUnitQuantity = obj.prdProductInitialUnitQuantity || 0;
        this.dto.quantityPerUnit = obj.prdProductQuantityPerUnit || 1;
        this.dto.unitPurchasePrice = obj.prdProductUnitPurchasePrice || 0;
        this.dto.purchasePriceCurrency = {id: obj.prdCurrencyId || 0 , code: obj.plCurrencyCode || ''};
        this.dto.priceListId = obj.lnkProductPriceListPriceListId || 0;
        this.dto.productPriceListId = obj.lnkProductPriceListId || 0;
        this.dto.markUp = obj.lnkProductPriceListMarkUp || 0;
        this.dto.sellPrice = obj.lnkProductPriceListSellPrice || 0;
        //this.dto.sellPriceCurrency = {id: obj.lnkProductPriceListSellPriceCurrencyId || null, code: obj.plCurrencyCode || ''};
        this.dto.netPrice = obj.lnkProductPriceListNetPrice || 0;
        //this.dto.netPriceCurrency = {id: obj.lnkProductPriceListNetPriceCurrencyId || null, code: obj.plCurrencyCode || ''}; //related to netPrice field.
        this.dto.dateCreated = obj.lnkProductPriceListRowDateCreated;
        this.dto.dateUpdated = obj.lnkProductPriceListRowDateUpdated;
        this.dto.dateDeleted = obj.lnkProductPriceListRowDateDeleted; //must be always last column
    };

};

class ProductSaleOrderDTO extends SqliteDTO {

    constructor() {
        super();
    };
    
    // Sets ProductSaleOrder Entity to impact productSaleOrder table.
    getDTO (obj) {
        console.log('# getSaleOrderProductsDto #', '\n');
        console.log('products array (obj): ', obj, '\n');

        for (const product of obj.saleOrderProducts) {
            this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization
            this.dbEntity.lnkProductSaleOrderId = product.productSaleOrderId; // Field must exist even if its null, and must be first column always
            if (product.id != null) { this.dbEntity.lnkProductSaleOrderProductId = product.id };
            if (obj.id != null) { this.dbEntity.lnkProductSaleOrderSaleOrderId = obj.id };
            if (product.unitQuantity != null) { this.dbEntity.lnkProductSaleOrderQuantity = product.unitQuantity };
            if (product.unitType != null) { this.dbEntity.lnkProductSaleOrderUnitTypeId = product.unitTypeId };
            if (product.unitSellPrice != null) { this.dbEntity.lnkProductSaleOrderUnitSellPrice = product.unitSellPrice };
            //if (product.unitSellPriceCurrency != null) { this.dbEntity.lnkProductSaleOrderUnitSellPriceCurrencyId = product.unitSellPriceCurrency.id || null };
            if (product.discount != null) { this.dbEntity.lnkProductSaleOrderDiscount = product.discount };
            if (product.subTotal != null) { this.dbEntity.lnkProductSaleOrderSubTotal = product.subTotal };
            if (product.VATax != null) { this.dbEntity.lnkProductSaleOrderVATax = product.VATax }; //IVA
            if (product.subTotalWithVATax != null) { this.dbEntity.lnkProductSaleOrderSubTotalWithVATax = product.subTotalWithVATax };
            if (product.dateCreated != null) { this.dbEntity.lnkProductSaleOrderRowDateCreated = product.dateCreated };
            if (product.dateUpdated != null) this.dbEntity.lnkProductSaleOrderRowDateUpdated = product.dateUpdated;
            if (product.dateDeleted != null) { this.dbEntity.lnkProductSaleOrderRowDateDeleted = product.dateDeleted }; //must be always last column
            this.dbEntityList.push (JSON.parse(JSON.stringify(this.dbEntity)));
            //console.log('this.dbEntity: ', this.dbEntity, '\n');
        };
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        console.log('this.dbEntityList: ', this.dbEntityList, '\n');
    };
 
    
    // Sets product object belonging to an existent Sale Order to be used in the UI
    setDTO (obj) {
        console.log('# ProductSaleOrderDTO.setDTO #', '\n');
        console.log('obj', obj, '\n');
        this.dto.id = obj.prdProductId || obj.lnkProductSaleOrderProductId;
        this.dto.code = obj.prdProductCode || '';
        this.dto.name = obj.prdProductName || '';
        this.dto.detail = obj.prdProductDetail || '';
        this.dto.brand = obj.prdProductBrand || '';
        this.dto.model = obj.prdProductModel || '';
        this.dto.category = obj.prdProductCategory || '';
        this.dto.manufacturer = obj.prdProductManufacturer || '';
        this.dto.initialUnitQuantity = obj.prdProductInitialUnitQuantity || 0;
        this.dto.quantityPerUnit = obj.prdProductQuantityPerUnit || 1;
        this.dto.unitPurchasePrice = obj.prdProductUnitPurchasePrice || 0;
        this.dto.purchasePriceCurrency = {id: obj.prdCurrencyId || 0 , code: obj.plCurrencyCode || ''};
        this.dto.productSaleOrderId = obj.lnkProductSaleOrderId || 0;
        this.dto.saleOrderId = obj.lnkProductSaleOrderSaleOrderId || 0;
        //this.dto.productId = obj.lnkProductSaleOrderProductId || null; // already assigned in dto.id
        this.dto.unitQuantity = obj.lnkProductSaleOrderQuantity || 0;
        this.dto.unitType = {id: obj.lnkProductSaleOrderUnitTylnkProductSaleOrderQuantitype || 0, name: ''};
        this.dto.unitSellPrice = obj.lnkProductSaleOrderUnitSellPrice || 0;        
        this.dto.unitSellPriceCurrency = { id: 0, code: ''}; // Added to be used in UI
        this.dto.discount = obj.lnkProductSaleOrderDiscount || 0;
        this.dto.subTotal = obj.lnkProductSaleOrderSubTotal || 0;
        this.dto.VATax = obj.lnkProductSaleOrderVATax || 0;
        this.dto.subTotalWithVATax = obj.lnkProductSaleOrderSubTotalWithVATax || 0;
        this.dto.productInventory = { indexCardId: obj.invInventoryIndexCardId || 0, indexCardName: obj.invInventoryIndexCardName || '', 
                                    minimumStock: obj.invInventoryMinimumStock || 0, calculatedQuantityBalance: obj.invInventoryQuantityBalance || 0 };
        this.dto.inventoryStatus = { id: obj.invStatusId || obj.plStatusId, code: obj.plStatusCode || 0, name: obj.plStatusName, group: obj.plStatusGroup};
        this.dto.dateCreated = obj.lnkProductSaleOrderRowDateCreated;
        this.dto.dateUpdated = obj.lnkProductSaleOrderRowDateUpdated;
        this.dto.dateDeleted = obj.lnkProductSaleOrderRowDateDeleted; //must be always last column
    };

};


///////////////////////////
// Pick List Tables
/////////////////////////

class CurrencyDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbCurrencyEntity = {};
    };

    getDTO (obj) {
        console.log('# getCurrencyDto #', '\n');
        //console.log('obj', obj )
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        this.dbEntity.plCurrencyId = obj.id || 0; // Field must exist even if its null, and must be first column always
        this.dbEntity.plCurrencyCode = obj.code;
        this.dbEntity.plCurrencyNumericCode = obj.numericCode;
        this.dbEntity.plCurrencyName = obj.name;
        this.dbEntity.plCurrencyLiteral = obj.literal;
        this.dbEntity.plCurrencySymbol = obj.symbol;
        this.dbEntity.plCurrencyRowDateCreated = obj.dateCreated;
        this.dbEntity.plCurrencyRowDateUpdated = obj.dateUpdated;
        this.dbEntity.plCurrencyRowDateDeleted = obj.dateDeleted; //must be always last column
    };
    
    setDTO (obj) {
        //console.log('# setCurrencyDto #', '\n');
        this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
        this.dto.id = obj.plCurrencyId || 0;
        this.dto.code = obj.plCurrencyCode || '';
        this.dto.numericCode = obj.plCurrencyNumericCode || '';
        this.dto.name = obj.plCurrencyName || '';
        this.dto.literal = obj.plCurrencyLiteral || '';
        this.dto.symbol = obj.plCurrencySymbol || 0;
        this.dto.dateCreated = obj.plCurrencyRowDateCreated;
        this.dto.dateUpdated = obj.plCurrencyRowDateUpdated;
        this.dto.dateDeleted = obj.plCurrencyRowDateDeleted; //must be always last column
    };
};

class ExchangeRateDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbExchangeRateEntity = {};
    };

    getDTO (obj) {
        console.log('# getExchangeRateDto #', '\n');
        //console.log('obj', obj )
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        this.dbEntity.plExchangeRateId = obj.id || 0; // Field must exist even if its null, and must be first column always
        if (obj.rate != null) { this.dbEntity.plExchangeRateRate = obj.rate || 0 };
        if (obj.fromCurrencyId != null) { this.dbEntity.plExchangeRateFromCurrencyId = obj.fromCurrencyId };
        if (obj.toCurrencyId != null) { this.dbEntity.plExchangeRateToCurrencyId = obj.toCurrencyId };
        if (obj.dateCreated != null) { this.dbEntity.plExchangeRateRowDateCreated = obj.dateCreated };
        if (obj.dateUpdated != null) { this.dbEntity.plExchangeRateRowDateUpdated = obj.dateUpdated };
        if (obj.dateDeleted != null) { this.dbEntity.plExchangeRateRowDateDeleted = obj.dateDeleted }; //must be always last column
    };
    
    setDTO (obj) {
        //console.log('# setExchangeRateDto #', '\n');
        this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
        this.dto.id = obj.plExchangeRateId || 0;
        this.dto.rate = obj.plExchangeRateRate || 0;
        this.dto.fromCurrencyId = obj.plExchangeRateFromCurrencyId || 0;
        this.dto.toCurrencyId = obj.plExchangeRateToCurrencyId || 0;
        this.dto.dateCreated = obj.plExchangeRateRowDateCreated;
        this.dto.dateUpdated = obj.plExchangeRateRowDateUpdated;
        this.dto.dateDeleted = obj.plExchangeRateRowDateDeleted; //must be always last column
    };
};

class LocalityDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbLocalityEntity = {};
    };

    getDTO (obj) {
        console.log('# getLocalityDto #', '\n');
        //console.log('obj', obj )
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        this.dbEntity.plLocalityId = obj.id || 0; // Field must exist even if its null, and must be first column always
        this.dbEntity.plLocalityName = obj.name || '';
        this.dbEntity.plLocalityDepartmentId = obj.departmentId;
        this.dbEntity.plLocalityTownId = obj.townId;
        this.dbEntity.plLocalityProvinceId = obj.provinceId;
        this.dbEntity.plLocalityRowDateCreated = obj.dateCreated;
        this.dbEntity.plLocalityRowDateUpdated = obj.dateUpdated;
        this.dbEntity.plLocalityRowDateDeleted = obj.dateDeleted; //must be always last column
    };
    
    setDTO (obj) {
        //console.log('# setLocalityDto #', '\n');
        this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
        this.dto.id = obj.plLocalityId || 0;
        this.dto.name = obj.plLocalityName || '';
        this.dto.departmentId = obj.plLocalityDepartmentId || 0;
        this.dto.townId = obj.plLocalityTownId || 0;
        this.dto.provinceId = obj.plLocalityProvinceId || 0;
        this.dto.dateCreated = obj.plLocalityRowDateCreated;
        this.dto.dateUpdated = obj.plLocalityRowDateUpdated;
        this.dto.dateDeleted = obj.plLocalityRowDateDeleted; //must be always last column
    };
};

class PaymentMethodDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbPaymentMethodEntity = {};
    };

    getDTO (obj) {
        console.log('# getPaymentMethodDto #', '\n');
        //console.log('obj', obj )
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        this.dbEntity.plPaymentMethodId = obj.id || 0; // Field must exist even if its null, and must be first column always
        this.dbEntity.plPaymentMethodType = obj.type;
        this.dbEntity.plPaymentMethodRowDateCreated = obj.dateCreated;
        this.dbEntity.plPaymentMethodRowDateUpdated = obj.dateUpdated;
        this.dbEntity.plPaymentMethodRowDateDeleted = obj.dateDeleted; //must be always last column
    };
    
    setDTO (obj) {
        //console.log('# setPaymentMethodDto #', '\n');
        this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
        this.dto.id = obj.plPaymentMethodId || 0;
        this.dto.type = obj.plPaymentMethodType || '';
        this.dto.dateCreated = obj.plPaymentMethodRowDateCreated;
        this.dto.dateUpdated = obj.plPaymentMethodRowDateUpdated;
        this.dto.dateDeleted = obj.plPaymentMethodRowDateDeleted; //must be always last column
    };
};

class RegionDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbRegionEntity = {};
    };

    getDTO (obj) {
        console.log('# getRegionDto #', '\n');
        //console.log('obj', obj )
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        this.dbEntity.plRegionId = obj.id || 0; // Field must exist even if its null, and must be first column always
        this.dbEntity.plRegionName = obj.name;
        this.dbEntity.plRegionRowDateCreated = obj.dateCreated;
        this.dbEntity.plRegionRowDateUpdated = obj.dateUpdated;
        this.dbEntity.plRegionRowDateDeleted = obj.dateDeleted; //must be always last column
    };
    
    setDTO (obj) {
        //console.log('# setRegionDto #', '\n');
        this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
        this.dto.id = obj.plRegionId || 0;
        this.dto.name = obj.plRegionName || '';
        this.dto.dateCreated = obj.plRegionRowDateCreated;
        this.dto.dateUpdated = obj.plRegionRowDateUpdated;
        this.dto.dateDeleted = obj.plRegionRowDateDeleted; //must be always last column
    };
};

class StatusDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbStatusEntity = {};
    };

    getDTO (obj) {
        console.log('# getStatusDto #', '\n');
        //console.log('obj', obj )
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        this.dbEntity.plStatusId = obj.id || 0; // Field must exist even if its null, and must be first column always
        this.dbEntity.plStatusCode = obj.code;
        this.dbEntity.plStatusName = obj.name;
        this.dbEntity.plStatusGroup = obj.group;
        this.dbEntity.plStatusRowDateCreated = obj.dateCreated;
        this.dbEntity.plStatusRowDateUpdated = obj.dateUpdated;
        this.dbEntity.plStatusRowDateDeleted = obj.dateDeleted; //must be always last column
    };
    
    setDTO (obj) {
        console.log('# setStatusDto #', '\n');
        //console.log('# setStatusDto #', '\n');
        this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
        this.dto.id = obj.plStatusId || 0;
        this.dto.code = obj.plStatusCode || 0;
        this.dto.name = obj.plStatusName || '';
        this.dto.group = obj.plStatusGroup || '';
        this.dto.dateCreated = obj.plStatusRowDateCreated;
        this.dto.dateUpdated = obj.plStatusRowDateUpdated;
        this.dto.dateDeleted = obj.plStatusRowDateDeleted; //must be always last column
    };
};




///////////////////
// Entity Tables
///////////////////

class CheckingAccountDTO extends SqliteDTO {

    constructor() {
        super();
        this.checkingAccountDtoList = [];
        this.checkingAccountWithTransactionsDtoList = []; //used in TaskSelector.js
        //this.dbCheckingAccountEntity = {};
    };

    getDTO (obj) {
        console.log('# getCheckingAccountDto #', '\n');
        //console.log('obj: ', obj, '\n');
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        this.dbEntity.cacCheckingAccountId = obj.id || 0; // Field must exist even if its null, and must be first column always
        if (obj.name != null) { this.dbEntity.cacCheckingAccountName = obj.name };
        if (obj.balance != null) { this.dbEntity.cacCheckingAccountBalance =  obj.balance };
        if (obj.lastTransactionDate != null) { this.dbEntity.cacCheckingAccountLastTransactionDate =  obj.lastTransactionDate };        
        if (obj.currency != null) { this.dbEntity.cacCurrencyId = obj.currency.id };
        if (obj.dateCreated != null) { this.dbEntity.cacCheckingAccountRowDateCreated = obj.dateCreated };
        if (obj.dateUpdated != null) { this.dbEntity.cacCheckingAccountRowDateUpdated = obj.dateUpdated };
        if (obj.dateDeleted != null) { this.dbEntity.cacCheckingAccountRowDateDeleted = obj.dateDeleted }; //must be always last column
    };

    setDTO (obj) {
        //console.log('# setCheckingAccountDto #', '\n');
        this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
        this.dto.id = obj.cacCheckingAccountId || 0;
        this.dto.name = obj.cacCheckingAccountName || '';
        this.dto.balance = obj.cacCheckingAccountBalance || 0.0;
        this.dto.lastTransactionDate = obj.cacCheckingAccountLastTransactionDate || 0;
        this.dto.currency = {id: obj.cacCurrencyId || 0, code: obj.plCurrencyCode || ''};
        this.dto.transactions= obj.transactions || []; // Required to add linked transactions and have a single Checking Account object.
        this.dto.dateCreated = obj.cacCheckingAccountRowDateCreated;
        this.dto.dateUpdated = obj.cacCheckingAccountRowDateUpdated;
        this.dto.dateDeleted = obj.cacCheckingAccountRowDateDeleted; //must be always last column
    };
};

class CheckAccTransactionDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbEntityInit = {};
        //this.dbCheckingAccountEntity = {};
    };

    getDTO (obj) {
        console.log('# getCheckAccTransactionDto #', '\n');
        //console.log('obj: ', obj, '\n');
        for (const item of obj.transactions) {
            this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
            this.dbEntity.catCheckAccTransactionId = item.id; // Field must exist even if its null, and must be first column always
            if (item.amount != null) { this.dbEntity.catCheckAccTransactionAmount =  item.amount };
            if (item.description != null) { this.dbEntity.catCheckAccTransactionDescription = item.description };
            if (item.type != null) { this.dbEntity.catCheckAccTransactionType =  item.type };
            //if (item.transactionDate != null) { this.dbEntity.catCheckAccTransactionTransDate = item.dateCreated }; // transaction date only used as mask to display dateCreated in UI
            //if (item.checkingAccount != null) { this.dbEntity.catCheckingAccountId = item.checkingAccount.id }; // it must have an asociated checking account
            if (item.checkingAccountId != null) { this.dbEntity.catCheckingAccountId = item.checkingAccountId }; // it must have an asociated checking account
            if (item.paymentMethod != null) { this.dbEntity.catPaymentMethodId = item.paymentMethod.id };
            if (item.saleOrder != null) { this.dbEntity.catSaleOrderId = item.saleOrder.id };
            if (item.dateCreated != null) { this.dbEntity.catCheckAccTransactionRowDateCreated = item.dateCreated };
            if (item.dateUpdated != null) { this.dbEntity.catCheckAccTransactionRowDateUpdated = item.dateUpdated };
            if (item.dateDeleted != null) { this.dbEntity.catCheckAccTransactionRowDateDeleted = item.dateDeleted }; //must be always last column
            this.dbEntityList.push (JSON.parse(JSON.stringify(this.dbEntity)));
            //console.log('this.dbEntity: ', this.dbEntity, '\n');
        };
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        console.log('this.dbEntityList: ', this.dbEntityList, '\n');
    };

    setDTO (obj) {
        console.log('# setCheckAccTransactionDto #', '\n');
        console.log('obj: ', obj, '\n');
        this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
        this.dto.id = obj.catCheckAccTransactionId || 0;
        this.dto.amount = obj.catCheckAccTransactionAmount || 0.0;
        this.dto.description = obj.catCheckAccTransactionDescription || '';
        this.dto.type = obj.catCheckAccTransactionType || 0;
        this.dto.transactionDate = obj.catCheckAccTransactionRowDateCreated; // transaction date only used as mask to display dateCreated in UI
        this.dto.checkingAccountId = obj.catCheckingAccountId; //must have an asociated checking account
        this.dto.paymentMethod = {id: obj.catPaymentMethodId || 0, type: obj.plPaymentMethodType || ''};
        this.dto.saleOrder = {id: obj.catSaleOrderId || 0, number: obj.saloSaleOrderNumber || ''};
        this.dto.dateCreated = obj.catCheckAccTransactionRowDateCreated;
        this.dto.dateUpdated = obj.catCheckAccTransactionRowDateUpdated;
        this.dto.dateDeleted = obj.catCheckAccTransactionRowDateDeleted; //must be always last column
    };
};

class CustomerDTO extends SqliteDTO {

    constructor() {
        super();
    };

    getDTO (obj) {
        console.log('# getCustomerDto #', '\n');
        //console.log('obj: ', obj, '\n');
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        this.dbEntity.cusCustomerId = obj.id; // Field must exist even if its null, and must be first column always
        if (obj.name != null) { this.dbEntity.cusCustomerName = obj.name };
        if (obj.cuit != null) { this.dbEntity.cusCustomerCUIT =  obj.cuit };
        if (obj.streetAddress != null) { this.dbEntity.cusCustomerAddress = obj.streetAddress };
        if (obj.email != null) { this.dbEntity.cusCustomerEmail = obj.email };
        if (obj.customerPhone1 != null) { this.dbEntity.cusCustomerPhone1 = obj.customerPhone1 };
        if (obj.contact != null) { this.dbEntity.cusCustomerContact = obj.contact };
        if (obj.contactPhone1 != null) { this.dbEntity.cusCustomerContactPhone1 = obj.contactPhone1 };
        if (obj.locality != null) { this.dbEntity.cusLocalityId = obj.locality.id };
        if (obj.region != null) { this.dbEntity.cusRegionId = obj.region.id };
        if (obj.salesRep != null) { this.dbEntity.cusSalesRepId = obj.salesRep.id };
        if (obj.checkingAccount != null) { this.dbEntity.cusCheckingAccountId = obj.checkingAccount.id };
        if (obj.dateCreated != null) { this.dbEntity.cusCustomerRowDateCreated = obj.dateCreated };
        if (obj.dateUpdated != null) { this.dbEntity.cusCustomerRowDateUpdated = obj.dateUpdated };
        if (obj.dateDeleted != null) { this.dbEntity.cusCustomerRowDateDeleted = obj.dateDeleted }; //must be always last column
    };

    setDTO (obj) {
        //console.log('# setCustomerDto #', '\n');
        this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
        this.dto.id = obj.cusCustomerId || 0;
        this.dto.name = obj.cusCustomerName || '';
        this.dto.cuit = obj.cusCustomerCUIT || '';
        this.dto.streetAddress = obj.cusCustomerAddress || '';
        this.dto.email = obj.cusCustomerEmail || '';
        this.dto.customerPhone1 = obj.cusCustomerPhone1 || '';
        this.dto.contact = obj.cusCustomerContact || '';
        this.dto.contactPhone1 = obj.cusCustomerContactPhone1 || '';
        this.dto.checkingAccount = {id: obj.cusCheckingAccountId || 0, name: obj.cacCheckingAccountName || ''};
        this.dto.locality = {id: obj.cusLocalityId || 0, name: obj.plLocalityName || ''};
        this.dto.region = {id: obj.cusRegionId || 0, name: obj.plRegionName || ''};
        this.dto.salesRep = {id: obj.cusSalesRepId || 0, name: obj.empEmployeeFullName || ''};
        this.dto.dateCreated = obj.cusCustomerRowDateCreated;
        this.dto.dateUpdated = obj.cusCustomerRowDateUpdated;
        this.dto.dateDeleted = obj.cusCustomerRowDateDeleted; //must be always last column
    };
};

class EmployeeDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbRegionEntity = {};
    };

    getDTO (obj) {
        console.log('# getEmployeeDto #', '\n');
        //console.log('obj: ', obj, '\n');
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        this.dbEntity.empEmployeeId = obj.id; // Field must exist even if its null, and must be first column always
        if (obj.dni != null) { this.dbEntity.empEmployeeDNI = obj.dni };
        if (obj.email != null) { this.dbEntity.empEmployeeEmail = obj.email };
        if (obj.firstName != null) { this.dbEntity.empEmployeeFirstName = obj.firstName };
        if (obj.lastName != null) { this.dbEntity.empEmployeeLastName = obj.lastName };
        //if ( (obj.firstName != null) && (obj.lastName != null) ) { this.dbEntity.empEmployeeFullName = (obj.firstName) + ' ' + (obj.lastName) };
        if (obj.fullName != null ) { this.dbEntity.empEmployeeFullName = obj.fullName };
        if (obj.streetAddress != null) { this.dbEntity.empEmployeeAddress = obj.streetAddress };
        if (obj.phone1 != null) { this.dbEntity.empEmployeePhone1 = obj.phone1 };
        if (obj.country != null) { this.dbEntity.empCountryId = obj.country.id };
        if (obj.locality != null) { this.dbEntity.empLocalityId = obj.locality.id };
        if (obj.priceList != null) { this.dbEntity.empPriceListId = obj.priceList.id };        
        if (obj.region != null) { this.dbEntity.empRegionId = obj.region.id };
        if (obj.dateCreated != null) { this.dbEntity.empEmployeeRowDateCreated = obj.dateCreated };
        if (obj.dateUpdated != null) { this.dbEntity.empEmployeeRowDateUpdated = obj.dateUpdated }; // no 'if' because it's a must
        if (obj.dateDeleted != null) { this.dbEntity.empEmployeeRowDateDeleted = obj.dateDeleted }; //must be always last column
    };
    
    setDTO (obj) {
        //console.log('# setEmployeeDto #', '\n');
        //console.log('obj', obj, '\n');

        this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
        this.dto.id = obj.empEmployeeId || 0;
        this.dto.dni = obj.empEmployeeDNI || '';
        this.dto.email = obj.empEmployeeEmail || '';
        this.dto.firstName = obj.empEmployeeFirstName || '';
        this.dto.lastName = obj.empEmployeeLastName || '';
        this.dto.fullName = obj.empEmployeeFullName || '';
        this.dto.streetAddress = obj.empEmployeeAddress || '';
        this.dto.phone1 = obj.empEmployeePhone1 || '';
        this.dto.country = {id: 0};
        this.dto.locality = {id: obj.empLocalityId || 0, name: obj.plLocalityName || ''};
        this.dto.priceList = {id: obj.empPriceListId || 0, name: obj.plisPriceListName || ''}        
        this.dto.region = {id: obj.empRegionId || 0, name: obj.plRegionName || ''};
        this.dto.dateCreated = obj.empEmployeeRowDateCreated;
        this.dto.dateUpdated = obj.empEmployeeRowDateUpdated;
        this.dto.dateDeleted = obj.empEmployeeRowDateDeleted; //must be always last column
    };
};

class InventoryIndexCardDTO extends SqliteDTO {

    constructor() {
        super();
        //this.productListDto = {};
        //this.productListDtoList = [];
        //this.inventoryDtoList = [];
        //this.inventoryWithTransactionsDtoList = []; //used in TaskSelector.js
        //this.dbInventoryEntity = {};
    };

    getDTO (obj) {
        console.log('# getInventoryIndexCardDto #', '\n');
        console.log ('InventoryIndexCardDTO obj', obj);
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        this.dbEntity.invInventoryIndexCardId = obj.id; // Field must exist even if its null, and must be first column always
        if (obj.indexCardPartNumber != null) { this.dbEntity.invInventoryIndexCardPartNumber = obj.indexCardPartNumber };
        if (obj.indexCardName != null) { this.dbEntity.invInventoryIndexCardName =  obj.indexCardName };
        if (obj.minimumStock != null) { this.dbEntity.invInventoryMinimumStock =  obj.minimumStock };
        if (obj.maximumStock != null) { this.dbEntity.invInventoryMaximumStock =  obj.maximumStock };
        if (obj.calculatedQuantityBalance != null) { this.dbEntity.invInventoryQuantityBalance =  obj.calculatedQuantityBalance };
        if (obj.method != null) { this.dbEntity.invInventoryMethod =  obj.method };
        if (obj.indexCardCreationDate != null) { this.dbEntity.invInventoryIndexCardCreationDate =  obj.indexCardCreationDate };
        if (obj.lastTransactionDate != null) { this.dbEntity.invInventoryLastTransactionDate =  obj.lastTransactionDate };
        if (obj.product != null) { this.dbEntity.invProductId =  obj.product.id };
        if (obj.status != null) { this.dbEntity.invStatusId =  obj.status.id };
        if (obj.dateCreated != null) { this.dbEntity.invInventoryRowDateCreated = obj.dateCreated };
        if (obj.dateUpdated != null) { this.dbEntity.invInventoryRowDateUpdated = obj.dateUpdated };
        if (obj.dateDeleted != null) { this.dbEntity.invInventoryRowDateDeleted = obj.dateDeleted }; //must be always last column
    };

    setDTO (obj) {
        //console.log('# setInventoryIndexCardDto #', '\n');
        this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
        this.dto.id = obj.invInventoryIndexCardId || 0 ; // Field must exist even if its null, and must be first column always
        this.dto.indexCardPartNumber = obj.invInventoryIndexCardPartNumber || '';
        this.dto.indexCardName = obj.invInventoryIndexCardName || '';
        this.dto.minimumStock = obj.invInventoryMinimumStock || 0;
        this.dto.maximumStock = obj.invInventoryMaximumStock || 0;
        //this.dto.quantityBalance = obj.invInventoryQuantityBalance || 0;
        this.dto.calculatedQuantityBalance = obj.invInventoryCalculatedQuantityBalance || 0;  
        this.dto.method = obj.invInventoryMethod || 0;
        this.dto.indexCardCreationDate = obj.invInventoryIndexCardCreationDate || 0;
        this.dto.lastTransactionDate = obj.invInventoryLastTransactionDate || 0;
        this.dto.product = {id: obj.invProductId || 0, code: obj.prdProductCode || '', model: obj.prdProductModel || ''};
        this.dto.status = {id: obj.invStatusId || 0, code: obj.plStatusCode || 0, name: obj.plStatusName || '', group: obj.plStatusGroup || ''};
        this.dto.transactions = obj.transactions || []; // Required to add linked transactions and have a single Inventory object.
        this.dto.dateCreated = obj.invInventoryRowDateCreated;
        this.dto.dateUpdated = obj.invInventoryRowDateUpdated;
        this.dto.dateDeleted = obj.invInventoryRowDateDeleted; //must be always last column
    };
};

class InventoryIndexCardTransactionDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbEntityInit = {};
        //this.dbCheckingAccountEntity = {};
    };

    getDTO (obj) {
        console.log('# getInventoryIndexCardTransactionDto #', '\n');
        console.log('obj: ', obj, '\n');
        for (const item of obj.transactions) {
            //console.log('item: ', item, '\n');
            this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
            this.dbEntity.invtInventoryTransactionId = item.id; // Field must exist even if its null, and must be first column always
            if (item.unitQuantity != null) { this.dbEntity.invtInventoryTransactionUnitQuantity =  item.unitQuantity };
            if (item.type != null) { this.dbEntity.invtInventoryTransactionType =  item.type };
            if (item.description != null) { this.dbEntity.invtInventoryTransactionDescription = item.description };
            //if (item.inventoryIndexCard.id != null) { this.dbEntity.invtInventoryIndexCardId = item.inventoryIndexCard.id };
            if (item.inventoryIndexCardId != null) { this.dbEntity.invtInventoryIndexCardId = item.inventoryIndexCardId};
            if (item.purchaseOrder != null) { this.dbEntity.invtPurchaseOrderId = item.purchaseOrder.id };
            if (item.saleOrder != null) { this.dbEntity.invtSaleOrderId = item.saleOrder.id };        
            if (item.warehouseSlot != null) { this.dbEntity.invtWarehouseSlotId = item.warehouseSlot.id };
            if (item.dateCreated != null) { this.dbEntity.invtInventoryTransactionRowDateCreated = item.dateCreated };
            if (item.dateUpdated != null) { this.dbEntity.invtInventoryTransactionRowDateUpdated = item.dateUpdated };
            if (item.dateDeleted != null) { this.dbEntity.invtInventoryTransactionRowDateDeleted = item.dateDeleted }; //must be always last column
            this.dbEntityList.push (JSON.parse(JSON.stringify(this.dbEntity)));
            //console.log('this.dbEntity: ', this.dbEntity, '\n');
        };
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        console.log('this.dbEntityList: ', this.dbEntityList, '\n');
    };

    setDTO (obj) {
        //console.log ('# setInventoryIndexCardTransactionDto #');
        this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
        this.dto.id = obj.invtInventoryTransactionId || 0;
        this.dto.unitQuantity = obj.invtInventoryTransactionUnitQuantity || 0;
        this.dto.type = obj.invtInventoryTransactionType || 0;
        this.dto.description = obj.invtInventoryTransactionDescription || '';
        this.dto.inventoryIndexCardId = obj.invtInventoryIndexCardId || 0;
        this.dto.purchaseOrder = {id: obj.invtPurchaseOrderId || 0, number: obj.number || ''};
        this.dto.saleOrder = {id: obj.invtSaleOrderId || 0, number: obj.number || ''};        
        this.dto.warehouseSlot = {id: obj.invtWarehouseSlotId || 0, code: obj.code || ''};
        this.dto.dateCreated = obj.invtInventoryTransactionRowDateCreated;
        this.dto.dateUpdated = obj.invtInventoryTransactionRowDateUpdated;
        this.dto.dateDeleted = obj.invtInventoryTransactionRowDateDeleted; //must be always last column
    };
};

class PriceListDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbPriceListEntity = {};
    };
    
    getDTO (obj) {
        console.log ('# getPriceListDto #');
        //console.log('obj: ', obj, '\n');
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        this.dbEntity.plisPriceListId = obj.id; // Field must exist even if its null, and must be first column always
        if (obj.code != null) { this.dbEntity.plisPriceListCode =  obj.code };
        if (obj.name != null) { this.dbEntity.plisPriceListName =  obj.name };
        if (obj.markup != null) { this.dbEntity.plisPriceListMarkup = obj.markup };
        if (obj.dollarLinked != null) { this.dbEntity.plisPriceListDollarLinked = obj.dollarLinked };
        if (obj.modifiedDate != null) { this.dbEntity.plisPriceListModifiedDate = obj.dateUpdated }; // used same date in control field
        if (obj.currency != null) { this.dbEntity.plisCurrencyId = obj.currency.id };
        if (obj.exchangeRate != null) { this.dbEntity.plisExchangeRateId = obj.exchangeRate.id };
        if (obj.dateCreated != null) { this.dbEntity.plisPriceListRowDateCreated = obj.dateCreated };
        if (obj.dateUpdated != null) { this.dbEntity.plisPriceListRowDateUpdated = obj.dateUpdated };
        if (obj.dateDeleted != null) { this.dbEntity.plisPriceListRowDateDeleted = obj.dateDeleted }; //must be always last column
    };

    setDTO (obj) {
        console.log ('# setPriceListDto #');
        //console.log('obj: ', obj, '\n');
        this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
        this.dto.id = obj.plisPriceListId || 0;
        this.dto.code = obj.plisPriceListCode || '';
        this.dto.name = obj.plisPriceListName || '';
        this.dto.markup = obj.plisPriceListMarkup || 1;
        this.dto.dollarLinked = obj.plisPriceListDollarLinked || false;
        this.dto.modifiedDate = obj.plisPriceListModifiedDate || 0;
        this.dto.exchangeRate = {id: obj.plisExchangeRateId || 0, rate: obj.plExchangeRateRate || 1};
        this.dto.currency = {id: obj.plisCurrencyId || 0 , code: obj.plCurrencyCode || ''};
        this.dto.priceListProducts = obj.priceListProducts || []; // Added for use in UI
        this.dto.dateCreated = obj.plisPriceListRowDateCreated;
        this.dto.dateUpdated = obj.plisPriceListRowDateUpdated;
        this.dto.dateDeleted = obj.plisPriceListRowDateDeleted; //must be always last column
    };

};

class ProductDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbProductEntity = {};
    };
    
    getDTO (objArray) {
        console.log('# getProductDto #', '\n');
        //console.log('objArray: ', objArray, '\n');
        for (const obj of objArray) {
            console.log ('obj', obj);
            this.dbEntity = JSON.parse (JSON.stringify (this.dbEntityInit) );
            this.dbEntity.prdProductId = obj.id; // Field must exist even if its null, and must be first column always
            if (obj.code != null) { this.dbEntity.prdProductCode = obj.code };
            if (obj.name != null) { this.dbEntity.prdProductName =  obj.name };
            if (obj.detail != null) { this.dbEntity.prdProductDetail = obj.detail };
            if (obj.brand != null) { this.dbEntity.prdProductBrand = obj.brand };
            if (obj.model != null) { this.dbEntity.prdProductModel = obj.model };
            if (obj.category != null) { this.dbEntity.prdProductCategory = obj.category };
            if (obj.manufacturer != null) { this.dbEntity.prdProductManufacturer = obj.manufacturer };
            if (obj.initialUnitQuantity != null) { this.dbEntity.prdProductInitialUnitQuantity = obj.InitialUnitQuantity };
            if (obj.quantityPerUnit != null) { this.dbEntity.prdProductQuantityPerUnit = obj.quantityPerUnit };
            if (obj.unitPurchasePrice != null) { this.dbEntity.prdProductUnitPurchasePrice = obj.unitPurchasePrice };
            if (obj.purchasePriceCurrency != null) { this.dbEntity.prdCurrencyId = obj.purchasePriceCurrency.id };
            if (obj.dateCreated != null) { this.dbEntity.prdProductRowDateCreated = obj.dateCreated };
            if (obj.dateUpdated != null) { this.dbEntity.prdProductRowDateUpdated = obj.dateUpdated };
            if (obj.dateDeleted != null) { this.dbEntity.prdProductRowDateDeleted = obj.dateDeleted }; //must be always last column
            this.dbEntityList.push (JSON.parse(JSON.stringify(this.dbEntity)));
            //console.log('this.dbEntity: ', this.dbEntity, '\n');
        };
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        console.log('this.dbEntityList: ', this.dbEntityList, '\n');
    };

    setDTO (table, obj) {
        console.log('# ProductDTO.setDTO #', '\n');
        console.log ('table: ', table, '\n', 'obj: ', obj, '\n')
        switch (table) {
            case ('priceList'): // Customized Product List to be used during Price List product addition in UI
                console.log('# setPriceListProductListDto #', '\n');
                this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
                this.dto.id = obj.prdProductId || 0;
                this.dto.code = obj.prdProductCode || '';
                this.dto.name = obj.prdProductName || '';
                this.dto.detail = obj.prdProductDetail || '';
                this.dto.brand = obj.prdProductBrand || '';
                this.dto.model = obj.prdProductModel || '';
                this.dto.category = obj.prdProductCategory || '';
                this.dto.manufacturer = obj.prdProductManufacturer || '';
                this.dto.initialUnitQuantity = obj.prdProductInitialUnitQuantity || 0;
                this.dto.quantityPerUnit = obj.prdProductQuantityPerUnit || 1;
                this.dto.unitPurchasePrice = obj.prdProductUnitPurchasePrice || 0;
                this.dto.purchasePriceCurrency = {id: obj.prdCurrencyId || 0 , code: obj.plCurrencyCode || ''};
                this.dto.productPriceListId = 0;
                this.dto.sellPrice = 0;
                this.dto.netPrice = 0;
                this.dto.sellPriceCurrency = {id: 0, code: ''};
                this.dto.netPriceCurrency = {id: 0, code: ''};
                break;        
            case ('saleOrder'): // Customized Product List to be used during Sale Order product addition in the UI
                console.log('# setSaleOrderProductListDto #', '\n');
                this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
                this.dto.id = obj.prdProductId || 0;
                this.dto.code = obj.prdProductCode || '';
                this.dto.name = obj.prdProductName || '';
                this.dto.detail = obj.prdProductDetail || '';
                this.dto.brand = obj.prdProductBrand || '';
                this.dto.model = obj.prdProductModel || '';
                this.dto.category = obj.prdProductCategory || '';
                this.dto.manufacturer = obj.prdProductManufacturer || '';
                this.dto.initialUnitQuantity = obj.prdProductInitialUnitQuantity || 0;
                this.dto.quantityPerUnit = obj.prdProductQuantityPerUnit || 1;
                this.dto.unitPurchasePrice = obj.prdProductUnitPurchasePrice || 0;
                //this.dto.purchasePriceCurrency = {id: obj.prdCurrencyId || 0 , code: obj.plCurrencyCode || ''};
                this.dto.purchasePriceCurrency = obj.currency || {id: -1, code: ''};
                this.dto.productPriceListId = obj.lnkProductPriceListId;
                this.dto.priceListId = obj.lnkProductPriceListPriceListId;
                this.dto.unitSellPrice = obj.lnkProductPriceListNetPrice || 0;
                this.dto.unitQuantity = 0;
                this.dto.productInventory = { indexCardId: obj.invInventoryIndexCardId || 0, indexCardName: obj.invInventoryIndexCardName || '', 
                                            minimumStock: obj.invInventoryMinimumStock || '0', calculatedQuantityBalance: obj.invInventoryQuantityBalance || '0'};
                //this.dto.productInventory = obj.inventory || { indexCardId: -1, indexCardName: '', minimumStock: '0', quantityBalance: '0'};
                //this.dto.inventoryStatus = {id: obj.invStatusId || 0 , code: obj.plStatusCode || 0, name: obj.plStatusName || '', group: obj.plStatusGroup || '' };
                this.dto.inventoryStatus = obj.status || {id: -1, code: '0', name: '', group: '' };
                this.dto.discount = 0; //added for saleOrder
                this.dto.subTotal = 0; //added for saleOrder
                this.dto.VATax = 0; //added for saleOrder
                this.dto.subTotalWithVATax = 0; //added for saleOrder
                this.dto.unitSellPriceCurrency = {id: 0, code: ''};
                break;
            default: // Product List
                console.log('# setProductDto #', '\n');
                this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
                this.dto.id = obj.prdProductId || 0;
                this.dto.code = obj.prdProductCode || '';
                this.dto.name = obj.prdProductName || '';
                this.dto.detail = obj.prdProductDetail || '';
                this.dto.brand = obj.prdProductBrand || '';
                this.dto.model = obj.prdProductModel || '';
                this.dto.category = obj.prdProductCategory || '';
                this.dto.manufacturer = obj.prdProductManufacturer || '';
                this.dto.initialUnitQuantity = obj.prdProductInitialUnitQuantity || 0;
                this.dto.quantityPerUnit = obj.prdProductQuantityPerUnit || 1;
                this.dto.unitPurchasePrice = obj.prdProductUnitPurchasePrice || 0;
                this.dto.purchasePriceCurrency = {id: obj.prdCurrencyId || 0 , code: obj.plCurrencyCode || ''};
                this.dto.dateCreated = obj.prdProductRowDateCreated;
                this.dto.dateUpdated = obj.prdProductRowDateUpdated;
                this.dto.dateDeleted = obj.prdProductRowDateDeleted; //must be always last column
                break;

        };
    };
};

class SaleOrderDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbSaleOrderEntity = {};        
    };
    
    getDTO (obj) {
        console.log('# getSaleOrderDto #', '\n');
        console.log('obj', obj )
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        this.dbEntity.saloSaleOrderId = obj.id; // Field must exist even if its null, and must be first column always
        if (obj.number != null) { this.dbEntity.saloSaleOrderNumber = obj.number };
        if (obj.date != null) { this.dbEntity.saloSaleOrderDate =  obj.dateCreated }; // We use same date used in control field
        if (obj.amountSubTotal != null) { this.dbEntity.saloSaleOrderAmountSubTotal =  obj.amountSubTotal };
        if (obj.VATax != null) { this.dbEntity.saloSaleOrderVATax =  obj.VATax }; //IVA
        if (obj.otherTaxes != null) { this.dbEntity.saloSaleOrderOtherTaxes =  obj.otherTaxes }; //IVA
        if (obj.amountTotal != null) { this.dbEntity.saloSaleOrderAmountTotal =  obj.amountTotal };
        if (obj.confirmationDate != null) { this.dbEntity.saloSaleOrderConfirmationDate =  obj.confirmationDate };
        if (obj.currency != null) { this.dbEntity.saloCurrencyId = obj.currency.id };
        if (obj.customer != null) { this.dbEntity.saloCustomerId = obj.customer.id };
        if (obj.employee != null) { this.dbEntity.saloEmployeeId = obj.employee.id };
        if (obj.paymentMethod != null) { this.dbEntity.saloPaymentMethodId = obj.paymentMethod.id };
        if (obj.status != null) { this.dbEntity.saloStatusId = obj.status.id };
        if (obj.dateCreated != null) { this.dbEntity.saloSaleOrderRowDateCreated = obj.dateCreated };
        if (obj.dateUpdated != null) { this.dbEntity.saloSaleOrderRowDateUpdated = obj.dateUpdated };
        if (obj.dateDeleted != null) { this.dbEntity.saloSaleOrderRowDateDeleted = obj.dateDeleted }; //must be always last column
        console.log('this.dbEntity: ', this.dbEntity, '\n');
    };
    
    setDTO (obj) {
        console.log('# setSaleOrderDto #', '\n');
        this.dto = JSON.parse(JSON.stringify(this.dtoInit)); // dto object initialization.
        this.dto.id = obj.saloSaleOrderId || 0;
        this.dto.number = obj.saloSaleOrderNumber || 0;
        this.dto.date = obj.saloSaleOrderDate || 0;
        this.dto.amountSubTotal = obj.saloSaleOrderAmountSubTotal || 0;
        this.dto.VATax = obj.saloSaleOrderVATax || 0;
        this.dto.otherTaxes = obj.saloSaleOrderOtherTaxes || 0;
        this.dto.amountTotal = obj.saloSaleOrderAmountTotal || 0;
        this.dto.confirmationDate = obj.saloSaleOrderConfirmationDate || 0;
        this.dto.currency = {id: obj.saloCurrencyId || 0, code: obj.plCurrencyCode || ''};
        this.dto.customer = {id: obj.saloCustomerId || 0, name: obj.cusCustomerName || '', checkingAccountId: obj.cusCheckingAccountId || 0};
        this.dto.employee = {id: obj.saloEmployeeId || 0, name: obj.empEmployeeFullName || '', priceListId: obj.empPriceListId || 0};
        this.dto.status = {id: obj.saloStatusId || 0, code: obj.plStatusCode, name: obj.plStatusName || '', group: obj.plStatusGroup || ''};
        this.dto.paymentMethod = {id: obj.saloPaymentMethodId || 0, type: obj.plPaymentMethodType || ''};
        this.dto.saleOrderProducts = obj.saleOrderProducts || []; // Added for use in UI
        this.dto.dateCreated = obj.saloSaleOrderRowDateCreated;
        this.dto.dateUpdated = obj.saloSaleOrderRowDateUpdated;
        this.dto.dateDeleted = obj.saleSaleOrderRowDateDeleted; //must be always last column
    };
};

class WarehouseDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbWarehouseEntity = {};        
    };

    getDTO (obj) {
        console.log('# getWarehouseDto #', '\n');
        //console.log('obj', obj )
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        this.dbEntity.wrhWarehouseId = obj.id; // Field must exist even if its null, and must be first column always
        if (obj.code != null) { this.dbEntity.wrhWarehouseCode =  obj.code };
        if (obj.name != null) { this.dbEntity.wrhWarehouseName =  obj.name };
        if (obj.description != null) { this.dbEntity.wrhWarehouseDescription = obj.description };
        if (obj.address != null) { this.dbEntity.wrhWarehouseAddress = obj.address };
        if (obj.dateCreated != null) { this.dbEntity.wrhWarehouseRowDateCreated = obj.dateCreated };
        if (obj.dateUpdated != null) { this.dbEntity.wrhWarehouseRowDateUpdated = obj.dateUpdated };
        if (obj.dateDeleted != null) { this.dbEntity.wrhWarehouseRowDateDeleted = obj.dateDeleted }; //must be always last column
    };
    
    setDTO (obj) {
        //console.log('# setWarehouseDto #', '\n');
        this.dto.id = obj.wrhWarehouseId || 0;
        this.dto.code = obj.wrhWarehouseCode || '';
        this.dto.name = obj.wrhWarehouseName || '';
        this.dto.description = obj.wrhWarehouseDescription || '';
        this.dto.address = obj.wrhWarehouseAddress || '';
        this.dto.dateCreated = obj.wrhWarehouseRowDateCreated;
        this.dto.dateUpdated = obj.wrhWarehouseRowDateUpdated;
        this.dto.dateDeleted = obj.wrhWarehouseRowDateDeleted; //must be always last column
    };
};

class WarehouseAreaDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbWarehouseAreaEntity = {};        
    };

    getDTO (obj) {
        console.log('# getWarehouseAreaDto #', '\n');
        //console.log('obj', obj )
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        this.dbEntity.areaWarehouseAreaId = obj.id; // Field must exist even if its null, and must be first column always
        if (obj.code != null) { this.dbEntity.areaWarehouseAreaCode =  obj.code };
        if (obj.name != null) { this.dbEntity.areaWarehouseAreaName =  obj.name };
        if (obj.description != null) { this.dbEntity.areaWarehouseAreaDescription =  obj.description };
        if (obj.warehouse.id != null) { this.dbEntity.areaWarehouseId = obj.warehouse.id };
        if (obj.dateCreated != null) { this.dbEntity.areaWarehouseAreaRowDateCreated = obj.dateCreated };
        if (obj.dateUpdated != null) { this.dbEntity.areaWarehouseAreaRowDateUpdated = obj.dateUpdated };
        if (obj.dateDeleted != null) { this.dbEntity.areaWarehouseAreaRowDateDeleted = obj.dateDeleted }; //must be always last column
    };
    
    setDTO (obj) {
        //console.log('# setWarehouseAreaDto #', '\n');
        this.dto.id = obj.areaWarehouseAreaId || 0;
        this.dto.code = obj.areaWarehouseAreaCode || '';
        this.dto.name = obj.areaWarehouseAreaName || '';
        this.dto.description = obj.areaWarehouseAreaDescription || '';
        this.dto.warehouse = {id: obj.areaWarehouseId || 0, name: objB.wrhWarehouseName || ''};
        this.dto.dateCreated = obj.areaWarehouseAreaRowDateCreated;
        this.dto.dateUpdated = obj.areaWarehouseAreaRowDateUpdated;
        this.dto.dateDeleted = obj.areaWarehouseAreaRowDateDeleted; //must be always last column
    };
};

class WarehouseSlotDTO extends SqliteDTO {

    constructor() {
        super();
        //this.dbWarehouseEntity = {};        
    };

    getDTO (obj) {
        console.log('# getWarehouseSlotDto #', '\n');
        //console.log('obj', obj )
        this.dbEntity = JSON.parse(JSON.stringify(this.dbEntityInit)); // dbEntity object initialization.
        this.dbEntity.slotWarehouseSlotId = obj.id; // Field must exist even if its null, and must be first column always
        if (obj.code != null) { this.dbEntity.slotWarehouseSlotCode =  obj.code };
        if (obj.desciprion != null) { this.dbEntity.slotWarehouseSlotDescription =  obj.description };
        if (obj.width != null) { this.dbEntity.slotWarehouseSlotWidth =  obj.width };
        if (obj.length != null) { this.dbEntity.slotWarehouseSlotLength = obj.length };
        if (obj.heigth != null) { this.dbEntity.slotWarehouseSlotHeigth = obj.heigth };
        if (obj.warehouseArea.id != null) { this.dbEntity.slotWarehouseAreaId = obj.warehouseArea.id };
        if (obj.dateCreated != null) { this.dbEntity.slotWarehouseSlotRowDateCreated = obj.dateCreated };
        if (obj.dateUpdated != null) { this.dbEntity.slotWarehouseSlotRowDateUpdated = obj.dateUpdated };
        if (obj.dateDeleted != null) { this.dbEntity.slotWarehouseSlotRowDateDeleted = obj.dateDeleted }; //must be always last column
    };
    
    setDTO (objA, objB) {
        //console.log('# setWarehouseSlotDto #', '\n');
        this.dto.id = objA.slotWarehouseSlotId || 0;
        this.dto.code = objA.slotWarehouseSlotCode || '';
        this.dto.description = objA.slotWarehouseSlotDescription || '';
        this.dto.width = objA.slotWarehouseSlotWidth || 0;
        this.dto.length = objA.slotWarehouseSlotLength || 0;
        this.dto.heigth = objA.slotWarehouseSlotHeigth || 0;
        this.dto.warehouseArea = {id: objA.slotWarehouseAreaId || 0, name: objB.areaWarehouseAreaName || ''};
        this.dto.dateCreated = objA.slotWarehouseSlotRowDateCreated;
        this.dto.dateUpdated = objA.slotWarehouseSlotRowDateUpdated;
        this.dto.dateDeleted = objA.slotWarehouseSlotRowDateDeleted; //must be always last column
    };
};



///////////////////
// Exported Modules
///////////////////

module.exports = {
    CheckingAccountDTO,
    CheckAccTransactionDTO,
    CustomerDTO,
    EmployeeDTO,
    InventoryIndexCardDTO,
    InventoryIndexCardTransactionDTO,
    PriceListDTO,
    ProductDTO,
    SaleOrderDTO,
    WarehouseDTO,
    WarehouseAreaDTO,
    WarehouseSlotDTO,
    CurrencyDTO,
    ExchangeRateDTO,
    LocalityDTO,
    PaymentMethodDTO,
    RegionDTO,
    StatusDTO,
    ProductPriceListDTO,
    ProductSaleOrderDTO
};