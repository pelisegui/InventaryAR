// Action CRUD Factory

const actionCRUD = require('./ActionCRUD');

class ActionCRUDFactory {

    /////////////
    // Methods
    /////////////

    //////////////////
    // Link Tables
    //////////////////

    newProductPriceListCRUD() {
        return new actionCRUD.ProductPriceListCRUD();
    }

    newProductSaleOrderCRUD() {
        return new actionCRUD.ProductSaleOrderCRUD();
    }

    
    ////////////////////
    // Pick List Tables
    ////////////////////

    newCurrencyCRUD(){
        return new actionCRUD.CurrencyCRUD();
    };

    newExchangeRateCRUD(){
        return new actionCRUD.ExchangeRateCRUD();
    };

    newLocalityCRUD(){
        return new actionCRUD.LocalityCRUD();
    };

    newPaymentMethodCRUD(){
        return new actionCRUD.PaymentMethodCRUD();
    };

    newRegionCRUD(){
        return new actionCRUD.RegionCRUD();
    };

    newStatusCRUD(){
        return new actionCRUD.StatusCRUD();
    };


    ///////////////////////
    // Entity Tables
    ////////////////////////

    newCheckingAccountCRUD(){
        return new actionCRUD.CheckingAccountCRUD();
    };

    newCheckAccTransactionCRUD(){
        return new actionCRUD.CheckAccTransactionCRUD();
    };

    newCustomerCRUD(){
        return new actionCRUD.CustomerCRUD();
    };    

    newEmployeeCRUD(){
        return new actionCRUD.EmployeeCRUD();
    };

    newExchangeRateCRUD(){
        return new actionCRUD.ExchangeRateCRUD();
    };

    newInventoryIndexCardCRUD(){
        return new actionCRUD.InventoryIndexCardCRUD();
    };

    newInventoryIndexCardTransactionCRUD(){
        return new actionCRUD.InventoryIndexCardTransactionCRUD();
    };

    newPriceListCRUD() {
        return new actionCRUD.PriceListCRUD();
    };

    newProductCRUD(){
        return new actionCRUD.ProductCRUD();
    };

    newSaleOrderCRUD(){
        return new actionCRUD.SaleOrderCRUD();
    };

    newWarehouseCRUD(){
        return new actionCRUD.WarehouseCRUD();
    };

    newWarehouseAreaCRUD(){
        return new actionCRUD.WarehouseAreaCRUD();
    };

    newWarehouseSlotCRUD(){
        return new actionCRUD.WarehouseSlotCRUD();
    };


    

};

module.exports = ActionCRUDFactory;