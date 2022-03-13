// Sqlite DAO Factory

const sqliteDao = require('./SqliteDAO');

class SqliteDAOFactory {

    /////////////
    // Methods
    /////////////

    ///////////////////////
    // Entity Tables
    ////////////////////////

    newCheckingAccountDAO(){
        return new sqliteDao.CheckingAccountDAO();
    };

    newCheckAccTransactionDAO(){
        return new sqliteDao.CheckAccTransactionDAO();
    };

    newCustomerDAO(){
        return new sqliteDao.CustomerDAO();
    };    

    newEmployeeDAO(){
        return new sqliteDao.EmployeeDAO();
    };

    newExchangeRateDAO(){
        return new sqliteDao.ExchangeRateDAO();
    };

    newInventoryIndexCardDAO(){
        return new sqliteDao.InventoryIndexCardDAO();
    };

    newInventoryIndexCardTransactionDAO(){
        return new sqliteDao.InventoryIndexCardTransactionDAO();
    };

    newPriceListDAO() {
        return new sqliteDao.PriceListDAO();
    };

    newProductDAO(){
        return new sqliteDao.ProductDAO();
    };

    newPurchaseOrderDAO(){
        return new sqliteDao.PurchaseOrderDAO();
    };

    newSaleOrderDAO(){
        return new sqliteDao.SaleOrderDAO();
    };

    newWarehouseDAO(){
        return new sqliteDao.WarehouseDAO();
    };

    newWarehouseAreaDAO(){
        return new sqliteDao.WarehouseAreaDAO();
    };

    newWarehouseSlotDAO(){
        return new sqliteDao.WarehouseSlotDAO();
    };

    ////////////////////
    // Pick List Tables
    ////////////////////

    newCurrencyDAO(){
        return new sqliteDao.CurrencyDAO();
    };

    newExchangeRateDAO(){
        return new sqliteDao.ExchangeRateDAO();
    };

    newLocalityDAO(){
        return new sqliteDao.LocalityDAO();
    };

    newPaymentMethodDAO(){
        return new sqliteDao.PaymentMethodDAO();
    };

    newRegionDAO(){
        return new sqliteDao.RegionDAO();
    };

    newStatusDAO(){
        return new sqliteDao.StatusDAO();
    };
    
    //////////////////
    // Link Tables
    //////////////////

    newProductPriceListDAO() {
        return new sqliteDao.ProductPriceListDAO();
    }

    newProductSaleOrderDAO() {
        return new sqliteDao.ProductSaleOrderDAO();
    }

};

module.exports = SqliteDAOFactory;