
const sqliteDTO = require('./SqliteDTO');

class SqliteDTOFactory {

    ///////////
    // Methods
    ///////////
    
    //////////////////////
    // Entity Tables
    //////////////////////

    newCheckingAccountDTO(){
        return new sqliteDTO.CheckingAccountDTO();
    };

    newCheckAccTransactionDTO(){
        return new sqliteDTO.CheckAccTransactionDTO();
    };

    newCustomerDTO(){
        return new sqliteDTO.CustomerDTO();
    };    

    newEmployeeDTO(){
        return new sqliteDTO.EmployeeDTO();
    };

    newExchangeRateDTO(){
        return new sqliteDTO.ExchangeRateDTO();
    };

    newInventoryIndexCardDTO(){
        return new sqliteDTO.InventoryIndexCardDTO();
    };

    newInventoryIndexCardTransactionDTO(){
        return new sqliteDTO.InventoryIndexCardTransactionDTO();
    };

    newPriceListDTO() {
        return new sqliteDTO.PriceListDTO();
    };

    newProductDTO(){
        return new sqliteDTO.ProductDTO();
    };

    newSaleOrderDTO(){
        return new sqliteDTO.SaleOrderDTO();
    };

    newWarehouseDTO(){
        return new sqliteDTO.WarehouseDTO();
    };

    newWarehouseAreaDTO(){
        return new sqliteDTO.WarehouseAreaDTO();
    };

    newWarehouseSlotDTO(){
        return new sqliteDTO.WarehouseSlotDTO();
    };

    ////////////////////
    // Pick List Tables
    ////////////////////

    newCurrencyDTO(){
        return new sqliteDTO.CurrencyDTO();
    };

    newExchangeRateDTO(){
        return new sqliteDTO.ExchangeRateDTO();
    };

    newLocalityDTO(){
        return new sqliteDTO.LocalityDTO();
    };

    newPaymentMethodDTO(){
        return new sqliteDTO.PaymentMethodDTO();
    };

    newRegionDTO(){
        return new sqliteDTO.RegionDTO();
    };

    newStatusDTO(){
        return new sqliteDTO.StatusDTO();
    };
    
    //////////////////
    // Link Tables
    //////////////////

    newProductPriceListDTO() {
        return new sqliteDTO.ProductPriceListDTO();
    }

    newProductSaleOrderDTO() {
        return new sqliteDTO.ProductSaleOrderDTO();
    }

};

module.exports = SqliteDTOFactory;