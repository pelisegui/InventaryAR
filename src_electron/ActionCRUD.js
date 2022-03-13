//DAO
const DAOFactory = require("./DAOFactory");
let daoFactory = new DAOFactory();
let sqliteDAOFactory = daoFactory.newDAOFactory(daoFactory._SQLITE); // Creates an SQLite DAO factory

//console.trace ('daoFactory: ', daoFactory, '\n', 'sqliteDAOFactory: ', sqliteDAOFactory, '\n' );

// let sqliteWarehouseDao = sqliteDAOFactory.newWarehouseDAO();
// let sqliteWarehouseAreaDao = sqliteDAOFactory.newWarehouseAreaDAO();
// let sqliteWarehouseSlotDao = sqliteDAOFactory.newWarehouseSlotDAO();

//DTO
const DTOFactory = require("./DTOFactory");
let dtoFactory = new DTOFactory();
let sqliteDTOFactory = dtoFactory.newDTOFactory(dtoFactory._SQLITE); // creates an SQLite DTO factory

// let warehouseDTO = sqliteDTOFactory.newWarehouseDTO();
// let warehouseAreaDTO = sqliteDTOFactory.newWarehouseAreaDTO();
// let warehouseSlotDTO = sqliteDTOFactory.newWarehouseSlotDTO();


class ActionCRUD {

    constructor() {
        this.reply = null;
        this.requiredFields = '';
        this.requiredFieldsB = '';
        this.requiredFieldsC = '';
        this.requiredFieldsD = '';
        this.requiredFieldsE = '';
        this.sumColumn = '';
        this.sumColumnAlias = '';
        this.filterColumn = '';
        this.filterValue = null;
        this.groupByColumn = '';
        this.objectDTO = null;
        this.objectDAO = null;

    };


    ////////////////
    // CRUD Methods
    ////////////////

    async testMethod (data) {
        console.trace ('Testing Method in ActionCRUD object. Argument data:', data);
    }

    async createData (data) {
        console.trace( '# createData #' );
        console.trace('data: ', data, '\n');
        //loggerService.sendToLog (`data: ${data}`)
    
        let row, columns, values = [];
        let rowId = null;
        let idColumnName = '';
        
        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
    
        this.objectDTO.getDTO(data);
    
        if (this.objectDTO.dbEntityList.length > 0) {
            for (const element of this.objectDTO.dbEntityList) {
                //console.trace('this.objectDTO.dbEntityList element: ', element);
                columns = Object.getOwnPropertyNames (element); // gets array with properties names
                idColumnName = columns.shift(); //IdColumnName property removed (asuming is the first one) to allow DB PK autoincrement
                row = Object.values (element); // Returns an array of values of the enumerable properties of an object
                rowId = row.shift(); //id value removed (asuming id property is the first one)  to allow DB PK autoincrement
                //console.trace ('columns:', columns)
                //console.trace ('idColumnName:', idColumnName)
                //console.trace ('row:', row)
                //console.trace ('rowId:', rowId)
                values = columns.map ( (column) => { return column = '?' } );
                await this.objectDAO.createRow (this.objectDAO.dbTableName,columns,row,values);
            }
        } else {
                columns = Object.getOwnPropertyNames(this.objectDTO.dbEntity); //gets array with properties names
                idColumnName = columns.shift(); //IdColumnName property removed (asuming is the first one)  to allow DB PK autoincrement
                row = Object.values (this.objectDTO.dbEntity); //Returns an array of values of the enumerable properties of an object
                rowId = row.shift(); //id value removed (asuming id property is the first one)  to allow DB PK autoincrement
                values = columns.map( (column) => {return column='?'} );
                await this.objectDAO.createRow(this.objectDAO.dbTableName,columns,row,values);
        };

        console.trace (`Number of inserted rows: ${this.objectDAO.created.changes}`);
        console.trace (`Last ID created: ${this.objectDAO.created.lastID}`); 
        //this.replay = this.objectDAO.created.lastID;
        //return this.replay
        return this.objectDAO.created.lastID;
    }

    async readData (data) {
        console.trace ( ' # readData # ' );
        //console.trace('data: ', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';

        //this.filterValue = (data) ? data : data = 0; // If data is empty assigns 0 as default value
        //(data) ? this.filterColumn = this.objectDAO.rowId || -1 : this.filterColumn = this.objectDAO.columnRowDateDeleted || 0; // Value to be used to filter query

        if (data) {
            this.filterValue = data
            this.filterColumn = this.objectDAO.rowId || 0
        } else {
            this.filterValue = 0
            this.filterColumn = this.objectDAO.columnRowDateDeleted || 0
        }

        //console.trace ('data: ', data)
        //console.trace ('this.filterValue: ', this.filterValue)
        //console.trace ('this.filterColumn: ', this.filterColumn)

        await this.objectDAO.getAll(this.requiredFields, 
                                    this.objectDAO.dbTableName, 
                                    this.objectDAO.columnRowDateDeleted,
                                    this.filterColumn, this.filterValue );
        
        //console.trace ('this.objectDAO.list: ', this.objectDAO.list, '\n');
        
        for (const row of this.objectDAO.list){
            this.objectDTO.setDTO(row);           
            this.objectDTO.dtoList.push (JSON.parse (JSON.stringify (this.objectDTO.dto) ) );                    
        };
        //console.trace ('this.objectDTO.dtoList: ', this.objectDTO.dtoList, '\n');
        return this.objectDTO.dtoList;
    }

    async updateData (data) {
        console.trace( ' # updateData # ' );
        console.trace('data: ', data, '\n');
    
        let rowId, columnNewValue = null;
        let row, pkEntrie, objEntries = [];
        let columnToUpdateValue, idColumnName = '';

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
    
        await this.objectDTO.getDTO(data);
    
        if (this.objectDTO.dbEntityList.length > 0) {
            console.trace ('this.objectDTO.dbEntityList', this.objectDTO.dbEntityList)
            for (const element of this.objectDTO.dbEntityList) {
                objEntries = Object.entries (element); // Returns an array of [key, value] elements of the enumerable properties of the object
                pkEntrie = objEntries.shift(); // Removes the first element from an array and returns it. Assuming [idColumn, idValue] is the first element of the array.
                idColumnName = pkEntrie.shift() // get idColumn property Name
                rowId = pkEntrie.shift(); // get row id
                //console.trace ('objEntries:', objEntries)
                //console.trace ('pkEntrie:', pkEntrie)
                //console.trace ('idColumnName:', idColumnName)
                //console.trace ('rowId:', rowId)
                objEntries.forEach( async (pkEntrie) => {
                    row = [];
                    columnToUpdateValue = pkEntrie.shift();
                    columnNewValue = pkEntrie.shift();
                    row.push(columnToUpdateValue, idColumnName, columnNewValue, rowId)
                    console.trace ('row to Update: ',row);
                    await this.objectDAO.updateRow (this.objectDAO.dbTableName,row);
                    this.objectDAO.updated.changes ++;
                });
            }
        } else {    
            objEntries = Object.entries(this.objectDTO.dbEntity); // Returns an array of [key, value] elements of the enumerable properties of the object
            pkEntrie = objEntries.shift(); // Removes the first element from an array and returns it. Assuming [idColumn, idValue] is the first element of the array.
            idColumnName = pkEntrie.shift() // get idColumn property Name
            rowId = pkEntrie.shift(); // get row id
            console.trace ('objEntries:', objEntries)
            console.trace ('pkEntrie:', pkEntrie)
            console.trace ('idColumnName:', idColumnName)
            console.trace ('rowId:', rowId)
            objEntries.forEach( async (pkEntrie) => {
                row = [];
                columnToUpdateValue = pkEntrie.shift();
                columnNewValue = pkEntrie.shift();
                row.push(columnToUpdateValue,idColumnName,columnNewValue,rowId)
                console.trace ('row to Update: ',row);
                await this.objectDAO.updateRow(this.objectDAO.dbTableName,row);
                this.objectDAO.updated.changes ++;
            });
        };

        console.trace ('Number of changed attributes: ',this.objectDAO.updated.changes);
        // console.trace (`Last ID updated: ${objectDAO.updated.lastID}`); // only works on insert
        //console.trace(`Id: ${this.objectDTO.dbEntity.lnkProductSaleOrderId}`);
        return this.objectDAO.updated.lastID;
    };
    
    async deleteData (data) { //hard delete !! NOT IN USE !!
        console.trace( ' # deleteData # ' );
        //console.trace('data: ', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];

        await this.objectDTO.getDTO(data);

        if (this.objectDTO.dbEntityList.length > 0) {
            for (const element of this.objectDTO.dbEntityList) {
                objEntries = Object.entries(element); //gets [key, value] pair array
                pkEntrie = objEntries.shift(); // cut [idColumn, idValue] pair
                idColumnName = pkEntrie.shift() // get idColumn property Name
                rowId = pkEntrie.shift(); // get row id
                objEntries.forEach( async (pkEntrie) => {
                    row = [];
                    columnToUpdateValue = pkEntrie.shift();
                    columnNewValue = pkEntrie.shift();
                    row.push(columnToUpdateValue,idColumnName,columnNewValue,rowId)
                    await this.objectDAO.deleteRow(this.objectDAO.dbTableName,row);
                    this.objectDAO.updated.changes ++;
                });
            }
        } else { 
            objEntries = Object.entries(this.objectDTO.dbEntity); //gets [key, value] pair array
            pkEntrie = objEntries.shift(); // cut [idColumn, idValue] pair
            idColumnName = entrie.shift() // get idColumn property Name
            rowId = pkEntrie.shift(); // get row id
            let sliced = objEntries.slice(objEntries.length-1); // get array with last entrie pair
            pkEntrie = sliced.shift(); // cut [columnToUpdateValue, newValue] pair
            columnToUpdateValue = pkEntrie.shift(); // get column to update (logical delete)
            columnNewValue = pkEntrie.shift(); // get new value
            row.push(columnToUpdateValue,idColumnName,columnNewValue,rowId);
            await this.objectDAO.deleteRow(this.objectDAO.dbTableName,row);
        }

        console.trace (`Succesfully deleted: ${this.objectDAO.deleted.changes}`);
        //console.trace (`Last ID deleted: ${this.objectDAO.deleted.lastID}`); // only works on insert
        //console.trace(`lnkProductSaleOrderId: ${this.objectDTO.dbEntity.lnkProductSaleOrderId}`);
        return this.objectDAO.deleted.lastID;
    }

    async findData (data) {
        console.trace( ' # findData # ' );
        //console.trace('data: ', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';
        
        if (data) {
            this.filterValue = data
            this.filterColumn = this.objectDAO.foreignKey1
        } else {
            this.filterValue = 0
            this.filterColumn = this.objectDAO.columnRowDateDeleted || 0
        }

        console.trace ('data: ', data)
        console.trace ('this.filterValue: ', this.filterValue)
        console.trace ('this.filterColumn: ', this.filterColumn)

        await this.objectDAO.getAllBySearchedValue (this.requiredFields, 
                                                    this.objectDAO.dbTableName, 
                                                    this.objectDAO.columnRowDateDeleted, 
                                                    this.filterColumn, this.filterValue); //generates a list of all rows in linkProductPriceList matching Data.PriceListId
        
        //console.trace ('this.objectDAO.list: ', this.objectDAO.list);
        
        for (const row of this.objectDAO.list ){
            this.objectDTO.setDTO(row);           
            this.objectDTO.dtoList.push( JSON.parse ( JSON.stringify ( this.objectDTO.dto || null) ) );                    
        };
        //console.trace ('this.objectDTO.dtoList', this.objectDTO.dtoList, '\n');
        //this.reply = this.objectDTO.dtoList;
        //this.objectDTO.dtoList = [];
        return this.objectDTO.dtoList;
    }

    //////////////////////////
    // Other Methods
    //////////////////////////

    async printPDF (data) {
        console.trace ('# printPDF #', '\n');

        console.trace('data: ', data, '\n', 'event: ', '\n');

        let replay = null;
             
        return replay;
    };

};


//////////////////////////////
// CRUD Classes
//////////////////////////////



////////////////////
// Link tables
////////////////////

class ProductPriceListCRUD extends ActionCRUD {

    constructor(){
        super();

        this.objectDAO = sqliteDAOFactory.newProductPriceListDAO();
        this.sqliteProductPriceListDao =  this.objectDAO;
        this.sqliteProductDao = sqliteDAOFactory.newProductDAO();
        this.sqliteCurrencyDao = sqliteDAOFactory.newCurrencyDAO();

        this.objectDTO = sqliteDTOFactory.newProductPriceListDTO();
        //this.priceListDto = sqliteDTOFactory.newPriceListDTO();

        console.trace ('this.sqliteProductPriceListDao: ', this.sqliteProductPriceListDao);
    }

    async readProductPriceListData (data) {
        console.trace ('# readProductPriceListData #', '\n');
        //console.trace ('data:', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';
        let currencyCRUD = new CurrencyCRUD(); // Required to get purchase currency for each product

        if (data) {
            this.filterValue = data
            this.filterColumn = this.sqliteProductPriceListDao.foreignKey1 || -1 
        } else {
            this.filterValue = 0
            this.filterColumn = this.objectDAO.columnRowDateDeleted || 0
        }

        //this.filterColumn = this.sqliteProductPriceListDao.foreignKey1 || null; // Value to be used to filter query
        //this.filterValue = (data) ? data : data = 0; // If data is empty assigns 0 as default value
        //console.trace ('filterValue', filterValue, '\n');

        // Get Product, Currency for every PriceList Product
        // 3 tables
        this.requiredFields = `${this.sqliteProductPriceListDao.rowId}, ${this.sqliteProductPriceListDao.regularColumns}, ${this.sqliteProductPriceListDao.foreignKey1}, ${this.sqliteProductPriceListDao.foreignKey2},
                               ${this.sqliteProductDao.rowId}, ${this.sqliteProductDao.regularColumns}, ${this.sqliteProductDao.foreignKey1}`;

        await this.sqliteProductPriceListDao.readEachLeftJoin3t ( this.requiredFields,
            this.sqliteProductPriceListDao.dbTableName, this.sqliteProductDao.dbTableName, this.sqliteCurrencyDao.dbTableName,
            this.sqliteProductPriceListDao.foreignKey2, this.sqliteProductDao.rowId, this.sqliteProductDao.foreignKey1, this.sqliteCurrencyDao.rowId,
            this.sqliteProductPriceListDao.columnRowDateDeleted, this.sqliteProductDao.columnRowDateDeleted, this.sqliteCurrencyDao.columnRowDateDeleted,
            this.filterColumn, this.filterValue );

        console.trace ('this.sqliteProductPriceListDao.list: ', this.sqliteProductPriceListDao.list);

        /*
        for (let row of this.sqliteProductPriceListDao.list) { // First get each price list products' list. It can be done in same for loop of setDTO because await generates duplicates
            console.trace ('productPriceList this.sqliteProductPriceListDao.list row', row, '\n');
            let returnedArray = []
            returnedArray = await currencyCRUD.readData (row.prdCurrencyId) // To get producst of each sale order
            row.currency = returnedArray[0]
        };
        */

        for (const row of this.sqliteProductPriceListDao.list){
            this.objectDTO.setDTO(row);           
            this.objectDTO.dtoList.push(JSON.parse(JSON.stringify(this.objectDTO.dto || null)));                
        };

        console.trace ('this.objectDTO.dtoList: ', this.objectDTO.dtoList, '\n');
        this.replay = this.objectDTO.dtoList;
        this.objectDTO.dtoList = [];
        return this.replay;
    };
}

class ProductSaleOrderCRUD extends ActionCRUD {

    constructor() {
        super();

        this.objectDAO = sqliteDAOFactory.newProductSaleOrderDAO();
        this.sqliteProductSaleOrderDao = this.objectDAO;
        this.sqliteProductDao = sqliteDAOFactory.newProductDAO();
        this.sqliteInventoryIndexCardDao = sqliteDAOFactory.newInventoryIndexCardDAO();
        this.sqliteInventoryIndexCardTransactionDao = sqliteDAOFactory.newInventoryIndexCardTransactionDAO();
        this.sqliteStatusDao = sqliteDAOFactory.newStatusDAO();

        this.objectDTO = sqliteDTOFactory.newProductSaleOrderDTO();

        //console.trace ('this.sqliteProductSaleOrderDao: ', this.sqliteProductSaleOrderDao);        
    }

    async readProductSalOrderData (data) {
        console.trace( ' # readProductSalOrderData # ' );
        //console.trace('data: ', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';

        if (data) {
            this.filterValue = data
            this.filterColumn = this.sqliteProductSaleOrderDao.foreignKey1 || -1 
        } else {
            this.filterValue = 0
            this.filterColumn = this.objectDAO.columnRowDateDeleted || 0
        }
        //this.filterColumn = this.sqliteProductSaleOrderDao.foreignKey1 || null; // Value to be used to filter query
        //this.filterValue = (data) ? data : data = '0'; // If data is empty assigns 0 as default value
        this.sumColumn = 'invtInventoryTransactionUnitQuantity';
        this.sumColumnAlias = 'invInventoryCalculatedQuantityBalance';
        this.groupByColumn = `${this.sqliteInventoryIndexCardDao.rowId}`;
        //console.trace ('filterValue', filterValue, '\n');
        
        // Get Inventory, Product and Status for every product in Sale Order
        // 4 tables
        this.requiredFields = `${this.sqliteProductSaleOrderDao.rowId}, ${this.sqliteProductSaleOrderDao.regularColumns}, ${this.sqliteProductSaleOrderDao.foreignKey1}, ${this.sqliteProductSaleOrderDao.foreignKey2},
                               ${this.sqliteProductDao.regularColumns}, ${this.sqliteProductDao.foreignKey1},
                               ${this.sqliteInventoryIndexCardDao.rowId}, ${this.sqliteInventoryIndexCardDao.regularColumns}, ${this.sqliteInventoryIndexCardDao.foreignKey2},
                               ${this.sqliteStatusDao.rowId}, ${this.sqliteStatusDao.regularColumns},
                               ${this.sqliteInventoryIndexCardTransactionDao.regularColumns}`;

        await this.sqliteProductSaleOrderDao.readEachLeftJoin5tSUM ( this.requiredFields, this.sumColumn, this.sumColumnAlias,
           this.sqliteProductSaleOrderDao.dbTableName, this.sqliteProductDao.dbTableName, this.sqliteInventoryIndexCardDao.dbTableName, this.sqliteStatusDao.dbTableName, this.sqliteInventoryIndexCardTransactionDao.dbTableName,
           this.sqliteProductSaleOrderDao.foreignKey2, this.sqliteProductDao.rowId, this.sqliteInventoryIndexCardDao.foreignKey1, this.sqliteProductDao.rowId, this.sqliteInventoryIndexCardDao.foreignKey2, this.sqliteStatusDao.rowId, this.sqliteInventoryIndexCardDao.rowId, this.sqliteInventoryIndexCardTransactionDao.foreignKey1,
           this.sqliteProductSaleOrderDao.columnRowDateDeleted, this.sqliteProductDao.columnRowDateDeleted, this.sqliteInventoryIndexCardDao.columnRowDateDeleted, this.sqliteStatusDao.columnRowDateDeleted, this.sqliteInventoryIndexCardTransactionDao.columnRowDateDeleted,
           this.filterColumn, this.filterValue, this.groupByColumn );

        console.trace ('productSaleOrder this.sqliteProductSaleOrderDao.list: ', this.sqliteProductSaleOrderDao.list);

        for (const row of this.sqliteProductSaleOrderDao.list){
           this.objectDTO.setDTO(row);           
           this.objectDTO.dtoList.push(JSON.parse(JSON.stringify(this.objectDTO.dto || null)));                
        };

        //console.trace ('this.objectDTO.dtoList: ', this.objectDTO.dtoList, '\n');
        this.replay = this.objectDTO.dtoList;
        this.objectDTO.dtoList = [];
        return this.replay;
    }
};

////////////////////
// Pick List tables
////////////////////

class CurrencyCRUD extends ActionCRUD {

    constructor(){
        super();

        this.objectDAO = sqliteDAOFactory.newCurrencyDAO();
        this.sqliteCurrencyDao = this.objectDAO;

        this.objectDTO = sqliteDTOFactory.newCurrencyDTO();

        console.trace ('this.sqliteCurrencyDao: ', this.sqliteCurrencyDao);
    }

    async readCurrencyData (data) {
        console.trace ('# readCurrencyData #', '\n');
        //console.trace ('data:', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';

        //return this.replay;
    };
}

class ExchangeRateCRUD extends ActionCRUD {

    constructor(){
        super();

        this.objectDAO = sqliteDAOFactory.newExchangeRateDAO();
        this.sqliteExchangeRateDao = this.objectDAO;
        this.objectDTO = sqliteDTOFactory.newExchangeRateDTO();

        console.trace ('this.sqliteExchangeRateDao: ', this.sqliteExchangeRateDao);
    }

    async readExchangeRateData (data) {
        console.trace ('# readExchangeRateData #', '\n');
        //console.trace ('data:', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';

        //return this.replay;
    };
}

class LocalityCRUD extends ActionCRUD {

    constructor(){
        super();

        this.objectDAO = sqliteDAOFactory.newLocalityDAO();
        this.sqliteLocalityDao = this.objectDAO;

        this.objectDTO = sqliteDTOFactory.newLocalityDTO();

        console.trace ('this.sqliteLocalityDao: ', this.sqliteLocalityDao);
    }

    async readLocalityData (data) {
        console.trace ('# readLocalityData #', '\n');
        //console.trace ('data:', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';

        //return this.replay;
    };
}

class PaymentMethodCRUD extends ActionCRUD {

    constructor(){
        super();

        this.objectDAO = sqliteDAOFactory.newPaymentMethodDAO();
        this.sqlitePaymentMethodDao = this.objectDAO;

        this.objectDTO = sqliteDTOFactory.newPaymentMethodDTO();

        console.trace ('this.sqlitePaymentMethodDao: ', this.sqlitePaymentMethodDao);
    }

    async readPaymentMethodData (data) {
        console.trace ('# paymentMethodCRUD #', '\n');
        //console.trace ('data:', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';

        //return this.replay;
    };
}

class RegionCRUD extends ActionCRUD {

    constructor(){
        super();

        this.objectDAO = sqliteDAOFactory.newRegionDAO();
        this.sqliteRegionDao = this.objectDAO;

        this.objectDTO = sqliteDTOFactory.newRegionDTO();

        console.trace ('this.sqliteRegionDao: ', this.sqliteRegionDao);
    }

    async readRegionData (data) {
        console.trace ('# readRegionData #', '\n');
        //console.trace ('data:', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';

        //return this.replay;
    };
}

class StatusCRUD extends ActionCRUD {

    constructor(){
        super();

        this.objectDAO = sqliteDAOFactory.newStatusDAO();
        this.sqliteStatusDao = this.objectDAO;

        this.objectDTO = sqliteDTOFactory.newStatusDTO();

        console.trace ('this.sqliteStatusDao: ', this.sqliteStatusDao);
    }

    async readStatusData (data) {
        console.trace ('# readStatusData #', '\n');
        console.trace ('data:', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';

        if (data) {
            this.filterValue = data
            this.filterColumn = 'plStatusGroup'
        } else {
            this.filterValue = 0
            this.filterColumn = this.objectDAO.columnRowDateDeleted || 0
        }

        console.trace ('data: ', data)
        console.trace ('this.filterValue: ', this.filterValue)
        console.trace ('this.filterColumn: ', this.filterColumn)

        await this.sqliteStatusDao.getAllBySearchedValue (this.requiredFields, 
                                                            this.sqliteStatusDao.dbTableName, 
                                                            this.sqliteStatusDao.columnRowDateDeleted, 
                                                            this.filterColumn, this.filterValue); //generates a list of all rows in plStatus matching value of group

        //let statusList = JSON.parse( JSON.stringify (this.sqliteStatusDao.list || null) );
        console.trace ('this.sqliteStatusDao.list: ', this.sqliteStatusDao.list);
    
        for (const row of this.sqliteStatusDao.list){
            this.objectDTO.setDTO(row );           
            this.objectDTO.dtoList.push( JSON.parse ( JSON.stringify ( this.objectDTO.dto || null) ) );                    
        };
        //console.trace ('objectDTO.dtoList: ', objectDTO.dtoList, '\n');

        //this.replay = objectDTO.dtoList;
        //return this.replay;
        return this.objectDTO.dtoList;
    }
}


////////////////////
// Regular tables
////////////////////

class CheckingAccountCRUD extends ActionCRUD {

    constructor(){
        super();

        this.objectDAO = sqliteDAOFactory.newCheckingAccountDAO();
        this.sqliteCheckingAccountDao = this.objectDAO;
        this.sqliteCheckAccTransactionDao = sqliteDAOFactory.newCheckAccTransactionDAO();
        this.sqliteCurrencyDao = sqliteDAOFactory.newCurrencyDAO();
        //this.sqlitePaymentMethodDao = sqliteDAOFactory.newPaymentMethodDAO();

        this.objectDTO = sqliteDTOFactory.newCheckingAccountDTO();
        //this.checkAccTransactionDto = sqliteDTOFactory.newCheckAccTransactionDTO();

        console.trace ('this.sqliteCheckingAccountDao: ', this.sqliteCheckingAccountDao);
    }

    async readCheckingAccountData (data) {
        console.trace ('# readCehckingAccountData #', '\n');
        //console.trace ('data:', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';

        let checkAccTransactionCRUD = new CheckAccTransactionCRUD(); // Required to get products for each price list

        if (data) {
            this.filterValue = data
            this.filterColumn = this.sqliteCheckAccTransactionDao.rowId || -1 
        } else {
            this.filterValue = 0
            this.filterColumn = this.objectDAO.columnRowDateDeleted || 0
        }
        //this.filterColumn = this.sqliteCheckingAccountDao.columnRowDateDeleted || null; // Value to be used to filter query
        //this.filterValue = (data) ? data : data = 0; // If data is empty assigns 0 as default value
        this.sumColumn = 'catCheckAccTransactionAmount';
        this.sumColumnAlias = 'cacCheckingAccountBalance';
        this.groupByColumn = `${this.sqliteCheckingAccountDao.rowId}`

        // Get Currency and total account balance for every Checking Account
        // 3 tables
        this.requiredFields = `${this.sqliteCheckingAccountDao.rowId}, ${this.sqliteCheckingAccountDao.regularColumns}, ${this.sqliteCheckingAccountDao.columnRowDateCreated}, ${this.sqliteCheckingAccountDao.foreignKey1}, 
                                ${this.sqliteCurrencyDao.rowId}, ${this.sqliteCurrencyDao.regularColumns}, 
                                ${this.sqliteCheckAccTransactionDao.rowId}, ${this.sqliteCheckAccTransactionDao.regularColumns}, ${this.sqliteCheckAccTransactionDao.foreignKey1}`;

        await this.sqliteCheckingAccountDao.readEachLeftJoin3tSUM ( this.requiredFields, this.sumColumn, this.sumColumnAlias,
            this.sqliteCheckingAccountDao.dbTableName, this.sqliteCurrencyDao.dbTableName, this.sqliteCheckAccTransactionDao.dbTableName, 
            this.sqliteCheckingAccountDao.foreignKey1, this.sqliteCurrencyDao.rowId, this.sqliteCheckingAccountDao.rowId, this.sqliteCheckAccTransactionDao.foreignKey1,
            this.sqliteCheckingAccountDao.columnRowDateDeleted, this.sqliteCurrencyDao.columnRowDateDeleted, this.sqliteCheckAccTransactionDao.columnRowDateDeleted, 
            this.filterColumn, this.filterValue, this.groupByColumn );

        console.trace ('this.sqliteCheckingAccountDao.list: ', this.sqliteCheckingAccountDao.list);

        for (let row of this.sqliteCheckingAccountDao.list) { // First get each price list products' list. It can be done in same for loop of setDTO because await generates duplicates
            console.trace ('checking account this.sqliteCheckingAccountDao.list row', row, '\n');
            row.transactions = await checkAccTransactionCRUD.readCheckAccTransactionData (row.cacCheckingAccountId) // To get producst of each sale order
        };

        for (const row of this.sqliteCheckingAccountDao.list){
            this.objectDTO.setDTO(row);           
            this.objectDTO.dtoList.push (JSON.parse (JSON.stringify (this.objectDTO.dto || null) ) );
        };

        console.trace ('this.objectDTO.dtoList: ', this.objectDTO.dtoList, '\n');
        this.replay = this.objectDTO.dtoList;
        this.objectDTO.dtoList = [];
        return this.replay;

    };

}

class CheckAccTransactionCRUD extends ActionCRUD {

    constructor() {
        super();
        
        this.objectDAO = sqliteDAOFactory.newCheckAccTransactionDAO();
        this.sqliteCheckAccTransactionDao = this.objectDAO;
        //this.sqliteCheckingAccountDao = sqliteDAOFactory.newCheckingAccountDAO();
        this.sqlitePaymentMethodDao = sqliteDAOFactory.newPaymentMethodDAO();
        this.sqliteSaleOrderDao = sqliteDAOFactory.newSaleOrderDAO();

        this.objectDTO = sqliteDTOFactory.newCheckAccTransactionDTO();
        //this.checkingAccountDto = sqliteDTOFactory.newCheckingAccountDTO();

        console.trace ('this.sqliteCheckAccTransactionDao: ', this.sqliteCheckAccTransactionDao);
    }

    async readCheckAccTransactionData (data) {
        console.trace ('# readCheckAccTransactionData #', '\n');
        //console.trace ('data:', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';

        if (data) {
            this.filterValue = data
            this.filterColumn = this.sqliteCheckAccTransactionDao.foreignKey1 
        } else {
            this.filterValue = 0
            this.filterColumn = this.objectDAO.columnRowDateDeleted || 0
        }

        //this.filterValue = (data) ? data : data = 0; // If data is empty assigns 0 as default value
        //this.filterColumn = this.sqliteCheckAccTransactionDao.columnRowDateDeleted || null; // Value to be used to filter query

        // Get Payment Method for every Checking Account Transaction.
        // 3 tables
        this.requiredFields = `${this.sqliteCheckAccTransactionDao.rowId}, ${this.sqliteCheckAccTransactionDao.regularColumns}, ${this.sqliteCheckAccTransactionDao.foreignKey1}, ${this.sqliteCheckAccTransactionDao.foreignKey2}, ${this.sqliteCheckAccTransactionDao.columnRowDateCreated},
                                ${this.sqlitePaymentMethodDao.rowId}, ${this.sqlitePaymentMethodDao.regularColumns},
                                ${this.sqliteSaleOrderDao.rowId}, ${this.sqliteSaleOrderDao.regularColumns}`;

        await this.sqliteCheckAccTransactionDao.readEachLeftJoin3t ( this.requiredFields,
            this.sqliteCheckAccTransactionDao.dbTableName, this.sqlitePaymentMethodDao.dbTableName, this.sqliteSaleOrderDao.dbTableName, 
            this.sqliteCheckAccTransactionDao.foreignKey2, this.sqlitePaymentMethodDao.rowId, this.sqliteCheckAccTransactionDao.foreignKey3, this.sqliteSaleOrderDao.rowId,
            this.sqliteCheckAccTransactionDao.columnRowDateDeleted, this.sqlitePaymentMethodDao.columnRowDateDeleted, this.sqliteSaleOrderDao.columnRowDateDeleted,
            this.filterColumn, this.filterValue );

        console.trace ('this.sqliteCheckAccTransactionDao.list: ', this.sqliteCheckAccTransactionDao.list);

        for (const row of this.sqliteCheckAccTransactionDao.list){
            this.objectDTO.setDTO(row);           
            this.objectDTO.dtoList.push(JSON.parse(JSON.stringify(this.objectDTO.dto || null)));                
        };

        console.trace ('this.objectDTO.dtoList', this.objectDTO.dtoList, '\n');
        this.replay = this.objectDTO.dtoList;
        this.objectDTO.dtoList = [];
        return this.replay;
    };

}

class CustomerCRUD extends ActionCRUD {

    constructor(){
        super();
        
        this.objectDAO = sqliteDAOFactory.newCustomerDAO();
        this.sqliteCustomerDao = this.objectDAO;
        this.sqliteCheckingAccountDao = sqliteDAOFactory.newCheckingAccountDAO();
        this.sqliteEmployeeDao = sqliteDAOFactory.newEmployeeDAO();
        this.sqliteLocalityDao = sqliteDAOFactory.newLocalityDAO();
        this.sqliteRegionDao = sqliteDAOFactory.newRegionDAO();

        this.objectDTO = sqliteDTOFactory.newCustomerDTO();

        console.trace ('this.sqliteCustomerDao: ', this.sqliteCustomerDao);
    }

    async readCustomerData (data) {
        console.trace ('# readCustomerData #', '\n');
        //console.trace ('data:', data, '\n');

        this.objectDTO .dtoList = [];
        this.objectDTO .dbEntityList = [];
        this.requiredFields = '';

        if (data) {
            this.filterValue = data
            this.filterColumn = this.objectDAO.rowId || -1 
        } else {
            this.filterValue = 0
            this.filterColumn = this.objectDAO.columnRowDateDeleted || 0
        }
        //this.filterColumn = this.sqliteCustomerDao.columnRowDateDeleted || null; // Value to be used to filter query
        //this.filterValue = (data) ? data : data = 0; // If data is empty assigns 0 as default value
        //console.trace ('filterValue', filterValue, '\n');

        /*
        // 3 tables
        this.requiredFieldsD = `${this.sqliteCustomerDao.rowId}, ${this.sqliteCustomerDao.regularColumns}, ${this.sqliteCustomerDao.foreignKey1}, 
                                ${this.sqliteCheckAccTransactionDao.rowId}, ${this.sqliteCheckAccTransactionDao.regularColumns}, ${this.sqliteCheckAccTransactionDao.foreignKey1}, ${this.sqliteCheckAccTransactionDao.foreignKey2},
                                ${this.sqliteCurrencyDao.rowId}, ${this.sqliteCurrencyDao.regularColumns}`;

        //  4 tables
        this.requiredFieldsE = `${this.sqliteCustomerDao.rowId}, ${this.sqliteCustomerDao.regularColumns}, ${this.sqliteCustomerDao.foreignKey1}, 
                                ${this.sqliteCheckAccTransactionDao.rowId}, ${this.sqliteCheckAccTransactionDao.regularColumns}, ${this.sqliteCheckAccTransactionDao.foreignKey1}, ${this.sqliteCheckAccTransactionDao.foreignKey2},
                                ${this.sqliteCurrencyDao.rowId}, ${this.sqliteCurrencyDao.regularColumns},
                                ${this.sqlitePaymentMethodDao.rowId}, ${this.sqlitePaymentMethodDao.regularColumns}`;
        */
        //  5 tables
        this.requiredFields =   `${this.sqliteCustomerDao.rowId}, ${this.sqliteCustomerDao.regularColumns}, ${this.sqliteCustomerDao.foreignKey1}, ${this.sqliteCustomerDao.foreignKey2}, ${this.sqliteCustomerDao.foreignKey3}, ${this.sqliteCustomerDao.foreignKey4},
                                ${this.sqliteCheckingAccountDao.rowId}, ${this.sqliteCheckingAccountDao.regularColumns},
                                ${this.sqliteEmployeeDao.rowId}, ${this.sqliteEmployeeDao.regularColumns},
                                ${this.sqliteLocalityDao.rowId}, ${this.sqliteLocalityDao.regularColumns},
                                ${this.sqliteRegionDao.rowId}, ${this.sqliteRegionDao.regularColumns}`;
                                
        //console.trace('this.requiredFields: ', this.requiredFields);
        
        await this.sqliteCustomerDao.readEachLeftJoin5t( this.requiredFields,
            this.sqliteCustomerDao.dbTableName, this.sqliteCheckingAccountDao.dbTableName, this.sqliteEmployeeDao.dbTableName, this.sqliteLocalityDao.dbTableName, this.sqliteRegionDao.dbTableName, 
            this.sqliteCustomerDao.foreignKey1, this.sqliteCheckingAccountDao.rowId, this.sqliteCustomerDao.foreignKey2, this.sqliteLocalityDao.rowId, this.sqliteCustomerDao.foreignKey3, this.sqliteRegionDao.rowId, this.sqliteCustomerDao.foreignKey4, this.sqliteEmployeeDao.rowId,
            this.sqliteCustomerDao.columnRowDateDeleted, this.sqliteCheckingAccountDao.columnRowDateDeleted, this.sqliteLocalityDao.columnRowDateDeleted, this.sqliteRegionDao.columnRowDateDeleted, this.sqliteEmployeeDao.columnRowDateDeleted,
            this.filterColumn, this.filterValue );
        
        console.trace ('this.sqliteCustomerDao.list: ', this.sqliteCustomerDao.list, '\n');

        for (const row of this.sqliteCustomerDao.list) {
            this.objectDTO.setDTO(row);           
            this.objectDTO.dtoList.push(JSON.parse(JSON.stringify(this.objectDTO.dto || null)));                
        };

        console.trace (' this.objectDTO.dtoList: ',  this.objectDTO.dtoList, '\n');
        this.replay =  this.objectDTO.dtoList;
        return this.replay;
    };
}

class EmployeeCRUD extends ActionCRUD {

    constructor() {
        super();

        this.objectDAO = sqliteDAOFactory.newEmployeeDAO();
        this.sqliteEmployeeDao = this.objectDAO;
        this.sqliteLocalityDao = sqliteDAOFactory.newLocalityDAO();
        this.sqlitePriceListDao = sqliteDAOFactory.newPriceListDAO();
        this.sqliteRegionDao = sqliteDAOFactory.newRegionDAO();

        this.objectDTO = sqliteDTOFactory.newEmployeeDTO();

        console.trace ('this.sqliteEmployeeDao: ', this.sqliteEmployeeDao);
    }

    async readEmployeeData (data) {
        console.trace('# employeeCRUD #', '\n');
        //console.trace ('data:', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';

        if (data) {
            this.filterValue = data
            this.filterColumn = this.objectDAO.rowId || -1 
        } else {
            this.filterValue = 0
            this.filterColumn = this.objectDAO.columnRowDateDeleted || 0
        }

        //this.filterColumn = this.sqliteEmployeeDao.columnRowDateDeleted || null; // Value to be used to filter query
        //this.filterValue = (data) ? data : data = 0; // If data is empty assigns 0 as default value
        
        //  4 tables
        this.requiredFields =  `${this.sqliteEmployeeDao.rowId}, ${this.sqliteEmployeeDao.regularColumns}, ${this.sqliteEmployeeDao.foreignKey1}, ${this.sqliteEmployeeDao.foreignKey2}, ${this.sqliteEmployeeDao.foreignKey3}, ${this.sqliteEmployeeDao.foreignKey4},
                                ${this.sqliteLocalityDao.rowId}, ${this.sqliteLocalityDao.regularColumns},
                                ${this.sqlitePriceListDao.rowId}, ${this.sqlitePriceListDao.regularColumns},
                                ${this.sqliteRegionDao.rowId}, ${this.sqliteRegionDao.regularColumns}`;

        await this.sqliteEmployeeDao.readEachLeftJoin4t ( this.requiredFields,
            this.sqliteEmployeeDao.dbTableName, this.sqliteLocalityDao.dbTableName, this.sqlitePriceListDao.dbTableName, this.sqliteRegionDao.dbTableName,  
            this.sqliteEmployeeDao.foreignKey2, this.sqliteLocalityDao.rowId, this.sqliteEmployeeDao.foreignKey3, this.sqlitePriceListDao.rowId, this.sqliteEmployeeDao.foreignKey4, this.sqliteRegionDao.rowId, 
            this.sqliteEmployeeDao.columnRowDateDeleted, this.sqliteLocalityDao.columnRowDateDeleted, this.sqlitePriceListDao.columnRowDateDeleted, this.sqliteRegionDao.columnRowDateDeleted, 
            this.filterColumn, this.filterValue );

        //console.trace ('this.sqliteEmployeeDao.list: ', this.sqliteEmployeeDao.list);

        for (const row of this.sqliteEmployeeDao.list) {
            this.objectDTO.setDTO(row);           
            this.objectDTO.dtoList.push(JSON.parse(JSON.stringify(this.objectDTO.dto || null)));                
        };

        //console.trace ('this.objectDTO.dtoList: ', this.objectDTO.dtoList, '\n');
        this.replay = this.objectDTO.dtoList;
        return this.replay;
        
    };
        
}

class InventoryIndexCardCRUD extends ActionCRUD {

    constructor(){
        super();

        this.objectDAO = sqliteDAOFactory.newInventoryIndexCardDAO();
        this.sqliteInventoryIndexCardDao = this.objectDAO;
        this.sqliteInventoryIndexCardTransactionDao = sqliteDAOFactory.newInventoryIndexCardTransactionDAO();
        this.sqliteProductDao = sqliteDAOFactory.newProductDAO();
        this.sqliteStatusDao = sqliteDAOFactory.newStatusDAO();
        //this.sqliteWarehouseSlotDao = sqliteDAOFactory.newWarehouseSlotDAO();

        this.objectDTO = sqliteDTOFactory.newInventoryIndexCardDTO();
        //this.inventoryTransactionDto = sqliteDTOFactory.newInventoryIndexCardTransactionDTO();

        console.trace ('this.sqliteInventoryIndexCardDao: ', this.sqliteInventoryIndexCardDao);
    }

    async readInventoryIndexCardData (data) {
        console.trace ('# readInventoryIndexCardData #', '\n');
        //console.trace ('data:', data, '\n');

         this.objectDTO.dtoList = [];
         this.objectDTO.dbEntityList = [];
         this.requiredFields = '';

         let inventoryIndexCardTransactionCRUD = new InventoryIndexCardTransactionCRUD(); // Required to get products for each sale order

         if (data) {
            this.filterValue = data
            this.filterColumn = this.objectDAO.rowId || -1
        } else {
            this.filterValue = 0
            this.filterColumn = this.objectDAO.columnRowDateDeleted || 0
        }
        //this.filterValue = (data) ? data : data = 0; // If data is empty assigns 0 as default value
        //this.filterColumn = this.sqliteInventoryIndexCardDao.columnRowDateDeleted || null; // Value to be used to filter query
        this.sumColumn = 'invtInventoryTransactionUnitQuantity';
        this.sumColumnAlias = 'invInventoryCalculatedQuantityBalance';
        //this.groupByColumn = `${this.sqliteInventoryIndexCardDao.rowId}`; // Grouped by index card
        this.groupByColumn = `${this.sqliteInventoryIndexCardDao.foreignKey1}`; // Grouped by index card
        //console.trace ('this.filterValue', this.filterValue, '\n');
        //console.trace ('this.filterColumn', this.filterColumn, '\n');

        // Get Product, Status and total stock balance for every inventory item
        // 4 tables
        this.requiredFields = `${this.sqliteInventoryIndexCardDao.rowId}, ${this.sqliteInventoryIndexCardDao.regularColumns}, ${this.sqliteInventoryIndexCardDao.foreignKey1}, ${this.sqliteInventoryIndexCardDao.foreignKey2},
                                ${this.sqliteProductDao.rowId}, ${this.sqliteProductDao.regularColumns}, 
                                ${this.sqliteStatusDao.rowId}, ${this.sqliteStatusDao.regularColumns}, 
                                ${this.sqliteInventoryIndexCardTransactionDao.rowId}, ${this.sqliteInventoryIndexCardTransactionDao.regularColumns}`;

        await this.sqliteInventoryIndexCardDao.readEachLeftJoin4tSUM ( this.requiredFields, this.sumColumn, this.sumColumnAlias,
            this.sqliteInventoryIndexCardDao.dbTableName, this.sqliteProductDao.dbTableName, this.sqliteStatusDao.dbTableName, this.sqliteInventoryIndexCardTransactionDao.dbTableName,
            this.sqliteInventoryIndexCardDao.foreignKey1, this.sqliteProductDao.rowId, this.sqliteInventoryIndexCardDao.foreignKey2, this.sqliteStatusDao.rowId, this.sqliteInventoryIndexCardDao.rowId, this.sqliteInventoryIndexCardTransactionDao.foreignKey1,
            this.sqliteInventoryIndexCardDao.columnRowDateDeleted, this.sqliteProductDao.columnRowDateDeleted, this.sqliteStatusDao.columnRowDateDeleted,  this.sqliteInventoryIndexCardTransactionDao.columnRowDateDeleted, 
            this.filterColumn, this.filterValue, this.groupByColumn );

        console.trace ('this.sqliteInventoryIndexCardDao.list: ', this.sqliteInventoryIndexCardDao.list);

        for (let row of this.sqliteInventoryIndexCardDao.list) { // First get each price list products' list. It can be done in same for loop of setDTO because await generates duplicates
            console.trace ('inventory this.sqliteInventoryIndexCardDao.list row', row, '\n');
            row.transactions = await inventoryIndexCardTransactionCRUD.readInventoryIndexCardTransactionData (row.invInventoryIndexCardId) // To get producst of each sale order
        }

        for (const row of this.sqliteInventoryIndexCardDao.list){
            this.objectDTO.setDTO(row);           
            this.objectDTO.dtoList.push(JSON.parse(JSON.stringify(this.objectDTO.dto || null)));                
        };

        console.trace ('this.objectDTO.dtoList: ', this.objectDTO.dtoList, '\n');
        this.replay = this.objectDTO.dtoList;
        this.objectDTO.dtoList = [];
        return this.replay;
    };
}

class InventoryIndexCardTransactionCRUD extends ActionCRUD {

    constructor(){
        super();

        this.objectDAO = sqliteDAOFactory.newInventoryIndexCardTransactionDAO();
        this.sqliteInventoryIndexCardTransactionDao = this.objectDAO;
        this.sqliteInventoryIndexCardDao = sqliteDAOFactory.newInventoryIndexCardDAO();
        this.sqlitePurchaseOrderDao = sqliteDAOFactory.newPurchaseOrderDAO();
        this.sqliteSaleOrderDao = sqliteDAOFactory.newSaleOrderDAO();
        this.sqliteWarehouseSlotDao = sqliteDAOFactory.newWarehouseSlotDAO();

        this.objectDTO = sqliteDTOFactory.newInventoryIndexCardTransactionDTO();

        console.trace ('this.sqliteInventoryIndexCardTransactionDao: ', this.sqliteInventoryIndexCardTransactionDao);
    }

    async readInventoryIndexCardTransactionData (data) {
        console.trace ('# readInventoryIndexCardTransactionData #', '\n');
        //console.trace ('data:', data, '\n');
        
        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';

        if (data) {
            this.filterValue = data
            this.filterColumn = this.sqliteInventoryIndexCardTransactionDao.foreignKey1
        } else {
            this.filterValue = 0
            this.filterColumn = this.objectDAO.columnRowDateDeleted || 0
        }

        //this.filterColumn = this.sqliteInventoryIndexCardTransactionDao.foreignKey1 || null; // Value to be used to filter query
        //this.filterValue = (data) ? data : data = 0; // If data is empty assigns 0 as default value

        // Get PurchaseOrder and WarehouseSlot for every inventory transaction.
        // 4 tables
        
        this.requiredFields = `${this.sqliteInventoryIndexCardTransactionDao.rowId}, ${this.sqliteInventoryIndexCardTransactionDao.regularColumns}, ${this.sqliteInventoryIndexCardTransactionDao.foreignKey1}, ${this.sqliteInventoryIndexCardTransactionDao.foreignKey2}, ${this.sqliteInventoryIndexCardTransactionDao.foreignKey3}, ${this.sqliteInventoryIndexCardTransactionDao.foreignKey4}, ${this.sqliteInventoryIndexCardTransactionDao.columnRowDateCreated},
                                ${this.sqlitePurchaseOrderDao.regularColumns}, 
                                ${this.sqliteSaleOrderDao.regularColumns}, 
                                ${this.sqliteWarehouseSlotDao.regularColumns}`;

        // Purchase order table in database need to have a default record to prevent empty join.
        await this.sqliteInventoryIndexCardTransactionDao.readEachLeftJoin4t ( this.requiredFields,
            this.sqliteInventoryIndexCardTransactionDao.dbTableName, this.sqlitePurchaseOrderDao.dbTableName, this.sqliteSaleOrderDao.dbTableName, this.sqliteWarehouseSlotDao.dbTableName,
            this.sqliteInventoryIndexCardTransactionDao.foreignKey2, this.sqlitePurchaseOrderDao.rowId, this.sqliteInventoryIndexCardTransactionDao.foreignKey3, this.sqliteSaleOrderDao.rowId, this.sqliteInventoryIndexCardTransactionDao.foreignKey4, this.sqliteWarehouseSlotDao.rowId, 
            this.sqliteInventoryIndexCardTransactionDao.columnRowDateDeleted, this.sqlitePurchaseOrderDao.columnRowDateDeleted, this.sqliteSaleOrderDao.columnRowDateDeleted, this.sqliteWarehouseSlotDao.columnRowDateDeleted,
            this.filterColumn, this.filterValue );

        console.trace ('this.sqliteInventoryIndexCardTransactionDao.list: ', this.sqliteInventoryIndexCardTransactionDao.list);

        for (const row of this.sqliteInventoryIndexCardTransactionDao.list) {
            this.objectDTO.setDTO(row);           
            this.objectDTO.dtoList.push(JSON.parse(JSON.stringify(this.objectDTO.dto || null)));                
        };

        console.trace ('this.objectDTO.dtoList', this.objectDTO.dtoList, '\n');
        this.replay = this.objectDTO.dtoList;
        this.objectDTO.dtoList = [];
        return this.replay;
    }
}

class PriceListCRUD extends ActionCRUD {

    constructor(){
        super();

        this.objectDAO = sqliteDAOFactory.newPriceListDAO();
        this.sqlitePriceListDao = this.objectDAO;
        this.sqliteCurrencyDao = sqliteDAOFactory.newCurrencyDAO();
        this.sqliteExchangeRateDao = sqliteDAOFactory.newExchangeRateDAO();

        this.objectDTO = sqliteDTOFactory.newPriceListDTO();

        console.trace ('this.sqlitePriceListDao: ', this.sqlitePriceListDao);
    }

    async readPriceListData (data) {
        console.trace ('# readPriceListData #', '\n');
        //console.trace ('data:', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';

        let productPriceListCRUD = new ProductPriceListCRUD(); // Required to get products for each price list

        if (data) {
            this.filterValue = data
            this.filterColumn = this.objectDAO.rowId || -1
        } else {
            this.filterValue = 0
            this.filterColumn = this.objectDAO.columnRowDateDeleted || 0
        }
        //this.filterColumn = this.sqlitePriceListDao.columnRowDateDeleted || null; // Value to be used to filter query
        //this.filterValue = (data) ? data : data = 0; // If data is empty assigns 0 as default value
        //console.trace ('filterValue', filterValue, '\n');

        // Get Currency and ExchangeRate for every price list
        // 3 tables Join
        
        //this.requiredFields = `${this.sqlitePriceListDao.rowId}, ${this.sqlitePriceListDao.regularColumns}, ${this.sqlitePriceListDao.foreignKey1}, ${this.sqlitePriceListDao.foreignKey2}, 
        //                        ${this.sqliteCurrencyDao.regularColumns}, 
        //                        ${this.sqliteExchangeRateDao.regularColumns}`;

        await this.sqlitePriceListDao.readEachLeftJoin3t ( this.requiredFields,
            this.sqlitePriceListDao.dbTableName, this.sqliteCurrencyDao.dbTableName, this.sqliteExchangeRateDao.dbTableName,
            this.sqlitePriceListDao.foreignKey1, this.sqliteCurrencyDao.rowId, this.sqlitePriceListDao.foreignKey2, this.sqliteExchangeRateDao.rowId, 
            this.sqlitePriceListDao.columnRowDateDeleted, this.sqliteCurrencyDao.columnRowDateDeleted, this.sqliteExchangeRateDao.columnRowDateDeleted,
            this.filterColumn, this.filterValue );
        
        console.trace ('this.sqlitePriceListDao.list: ', this.sqlitePriceListDao.list);

        for (let row of this.sqlitePriceListDao.list) { // First get each price list products' list. It can be done in same for loop of setDTO because await generates duplicates
            console.trace ('priceList this.sqlitePriceListDao.list row', row, '\n');
            row.priceListProducts = await productPriceListCRUD.readProductPriceListData (row.plisPriceListId) // To get producst of each sale order
        }

        for (const row of this.sqlitePriceListDao.list) {
            this.objectDTO.setDTO(row);           
            this.objectDTO.dtoList.push(JSON.parse(JSON.stringify(this.objectDTO.dto || null)));                
        };

        console.trace ('this.objectDTO.dtoList', this.objectDTO.dtoList, '\n');
        this.replay = this.objectDTO.dtoList;
        this.objectDTO.dtoList = [];
        return this.replay;
    };

}

class ProductCRUD extends ActionCRUD {

    constructor(){
        super();

        this.objectDAO = sqliteDAOFactory.newProductDAO();
        this.sqliteProductDao = this.objectDAO;
        this.sqliteCurrencyDao = sqliteDAOFactory.newCurrencyDAO();
        this.sqliteInventoryIndexCardDao = sqliteDAOFactory.newInventoryIndexCardDAO();
        this.sqlitePriceListDao = sqliteDAOFactory.newPriceListDAO();
        this.sqliteProductPriceListDao = sqliteDAOFactory.newProductPriceListDAO();
        this.sqliteStatusDao = sqliteDAOFactory.newStatusDAO();

        this.objectDTO = sqliteDTOFactory.newProductDTO();

        console.trace ('this.sqliteProductDao: ', this.sqliteProductDao);
    }

    async readProductData (data) {
        console.trace (' # ProductCRUD readProductData #', '\n');
        //console.trace ('data:', data, '\n');

        let productListType = '';
        //let valueToFilter = null;

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';
        this.filterValue = null;

        let currencyCRUD = new CurrencyCRUD(); // Required to get products for each price list
        let inventoryIndexCardCRUD = new InventoryIndexCardCRUD(); // Required to get products for each price list
        let statusCRUD = new StatusCRUD(); // Required to get products for each sale order

        //this.objectDTO.priceListProductListDtoList = [];
        //this.objectDTO.saleOrderProductListDtoList = [];

        // because Object.keys(new Date()).length === 0; we have to do some additional checks
        // obj --> checks null and undefined
        // Object.keys(obj).length === 0 --> checks keys
        // obj.constructor === Object --> checks obj type: __proto__.constructor property equals f Object
        // return obj && Object.keys(obj).length === 0 && obj.constructor === Object
        
        if (data) {
            console.trace('data: ', data)
            console.trace ('typeof data: ', typeof data );
            console.trace('Object.keys(data).length === 0: ', (Object.keys(data).length === 0) )
            console.trace('data.constructor: ', data.constructor)
        }

        if (typeof data === 'object') {
            productListType = data.shift() || '';
            this.filterValue = data.shift() || null;
            console.trace ('productListType: ', productListType, '\n');
            console.trace ('this.filterValue: ', this.filterValue);
        };

        switch (productListType) {

            case 'priceList': // set product list for price list pick

                // Get Payment Method for every Checking Account Transaction.
                // 2 tables
                //this.requiredFields = `${this.sqliteProductDao.rowId}, ${this.sqliteProductDao.regularColumns}, ${this.sqliteProductDao.foreignKey1}, 
                //                        ${this.sqliteCurrencyDao.regularColumns}`;

                this.filterColumn = this.sqliteProductDao.columnRowDateDeleted || null; // Value to be used to filter query
                //this.filterValue = (data) ? data : data = 0; // If data is empty assigns 0 as default value

                await this.sqliteProductDao.readEachLeftJoin2t ( this.requiredFields,
                    this.sqliteProductDao.dbTableName, this.sqliteCurrencyDao.dbTableName, 
                    this.sqliteProductDao.foreignKey1, this.sqliteCurrencyDao.rowId, 
                    this.sqliteProductDao.columnRowDateDeleted, this.sqliteCurrencyDao.columnRowDateDeleted, 
                    this.filterColumn, this.filterValue );

                console.trace ('this.sqliteProductDao.list: ', this.sqliteProductDao.list);
                //console.trace ('this.sqlitePriceListDao.list: ', this.sqlitePriceListDao.list);

                for (const row of this.sqliteProductDao.list){
                    this.objectDTO.setDTO('priceList', row);           
                    this.objectDTO.dtoList.push(JSON.parse(JSON.stringify(this.objectDTO.dto || null)));                
                };

                this.replay = this.objectDTO.dtoList;

                break;
                    
            case 'saleOrder': // sets product list according to salesRep.priceListId for sale order pick

                this.filterColumn = this.sqliteProductPriceListDao.foreignKey1 || -1; // Value to be used to filter query
                this.sumColumn = 'invInventoryQuantityBalance';
                this.sumColumnAlias = 'invInventoryCalculatedQuantityBalance';
                this.groupByColumn = `${this.sqliteProductPriceListDao.foreignKey2}` // Group by product to obtain total stock

                //// Get Products List customized (DTO Setter specific for Price List) to be used in sale order product selection
                /*
                this.requiredFields = `${this.sqliteProductPriceListDao.rowId}, ${this.sqliteProductPriceListDao.regularColumns}, ${this.sqliteProductPriceListDao.foreignKey1}, ${this.sqliteProductPriceListDao.foreignKey2}, 
                                        ${this.sqlitePriceListDao.rowId}, ${this.sqlitePriceListDao.regularColumns}, ${this.sqlitePriceListDao.foreignKey1}, 
                                        ${this.sqliteInventoryIndexCardDao.rowId}, ${this.sqliteInventoryIndexCardDao.regularColumns}, ${this.sqliteInventoryIndexCardDao.foreignKey1}`;

                await this.sqliteProductPriceListDao.readEachLeftJoin5t ( this.requiredFields,
                    this.sqliteProductPriceListDao.dbTableName, this.sqliteProductDao.dbTableName, this.sqliteCurrencyDao.dbTableName, this.sqliteInventoryIndexCardDao.dbTableName, this.sqliteStatusDao.dbTableName, 
                    this.sqliteProductPriceListDao.foreignKey2, this.sqliteProductDao.rowId, this.sqliteProductDao.foreignKey1, this.sqliteCurrencyDao.rowId, this.sqliteProductPriceListDao.foreignKey2, this.sqliteInventoryIndexCardDao.foreignKey1, this.sqliteInventoryIndexCardDao.foreignKey2, this.sqliteStatusDao.rowId,
                    this.sqliteProductPriceListDao.columnRowDateDeleted, this.sqliteProductDao.columnRowDateDeleted, this.sqliteCurrencyDao.columnRowDateDeleted, this.sqliteInventoryIndexCardDao.columnRowDateDeleted, this.sqliteStatusDao.columnRowDateDeleted, 
                    this.filterColumn, this.filterValue );

                await this.sqliteProductPriceListDao.readEachLeftJoin3t ( this.requiredFields,
                    this.sqliteProductPriceListDao.dbTableName, this.sqliteProductDao.dbTableName, this.sqliteInventoryIndexCardDao.dbTableName,
                    this.sqliteProductPriceListDao.foreignKey2, this.sqliteProductDao.rowId, this.sqliteProductPriceListDao.foreignKey2, this.sqliteInventoryIndexCardDao.foreignKey1,
                    this.sqliteProductPriceListDao.columnRowDateDeleted, this.sqliteProductDao.columnRowDateDeleted, this.sqliteInventoryIndexCardDao.columnRowDateDeleted,
                    this.filterColumn, this.filterValue );
               */

                this.requiredFields = `${this.sqliteProductPriceListDao.rowId}, ${this.sqliteProductPriceListDao.regularColumns}, ${this.sqliteProductPriceListDao.foreignKey1}, ${this.sqliteProductPriceListDao.foreignKey2}, 
                                        ${this.sqliteInventoryIndexCardDao.rowId}, ${this.sqliteInventoryIndexCardDao.regularColumns}, ${this.sqliteInventoryIndexCardDao.foreignKey1}, ${this.sqliteInventoryIndexCardDao.foreignKey2},
                                        ${this.sqliteProductDao.rowId}, ${this.sqliteProductDao.regularColumns}, ${this.sqliteProductDao.foreignKey1}`;

                //console.trace ('ProductCRUD saleOrder this.requiredFields: ', this.requiredFields);

                await this.sqliteProductPriceListDao.readEachLeftJoin3tSUM ( this.requiredFields, this.sumColumn, this.sumColumnAlias,
                    this.sqliteProductPriceListDao.dbTableName, this.sqliteInventoryIndexCardDao.dbTableName, this.sqliteProductDao.dbTableName,
                    this.sqliteProductPriceListDao.foreignKey2, this.sqliteInventoryIndexCardDao.foreignKey1, this.sqliteProductPriceListDao.foreignKey2, this.sqliteProductDao.rowId,
                    this.sqliteProductPriceListDao.columnRowDateDeleted, this.sqliteInventoryIndexCardDao.columnRowDateDeleted, this.sqliteProductDao.columnRowDateDeleted,
                    this.filterColumn, this.filterValue, this.groupByColumn );

                console.trace ('ProductCRUD saleOrder this.sqliteProductPriceListDao.list: ', this.sqliteProductPriceListDao.list);

                for (let row of this.sqliteProductPriceListDao.list) { // First get each price list products' list. It can be done in same for loop of setDTO because await generates duplicates
                    console.trace ('ProductCRUD saleOrder this.sqliteProductPriceListDao.list row', row, '\n');
                    let returnedArray = []
                    returnedArray = await currencyCRUD.readData (row.prdCurrencyId) // To get producst of each sale order
                    row.currency = returnedArray[0]
                    //row.inventory = await inventoryIndexCardCRUD.readInventoryIndexCardData (row.prdProductId) // To get producst of each sale order
                    returnedArray = await statusCRUD.readData (row.invStatusId) // To get producst of each sale order
                    row.status = returnedArray[0]
                };

                for (const row of this.sqliteProductPriceListDao.list) {
                    this.objectDTO.setDTO('saleOrder', row);           
                    this.objectDTO.dtoList.push(JSON.parse(JSON.stringify(this.objectDTO.dto || null)));                
                };

                this.replay =  this.objectDTO.dtoList;

                break;

            default:

                // Get Payment Method for every Checking Account Transaction.
                // 2 tables
                //this.requiredFields = `${this.sqliteProductDao.rowId}, ${this.sqliteProductDao.regularColumns}, ${this.sqliteProductDao.foreignKey1}, 
                //                        ${this.sqliteCurrencyDao.regularColumns}`;

                this.filterColumn = this.sqliteProductDao.columnRowDateDeleted || null; // Value to be used to filter query
                //this.filterValue = (data) ? data : data = 0; // If data is empty assigns 0 as default value

                await this.sqliteProductDao.readEachLeftJoin2t ( this.requiredFields,
                    this.sqliteProductDao.dbTableName, this.sqliteCurrencyDao.dbTableName, 
                    this.sqliteProductDao.foreignKey1, this.sqliteCurrencyDao.rowId, 
                    this.sqliteProductDao.columnRowDateDeleted, this.sqliteCurrencyDao.columnRowDateDeleted, 
                    this.filterColumn, this.filterValue );

                console.trace ('this.sqliteProductDao.list: ', this.sqliteProductDao.list);

                for (const row of this.sqliteProductDao.list){
                    this.objectDTO.setDTO('', row);           
                    this.objectDTO.dtoList.push(JSON.parse(JSON.stringify(this.objectDTO.dto || null)));                
                };

                this.replay = this.objectDTO.dtoList;

                break;
        }
        console.trace ('this.objectDTO.dtoList', this.objectDTO.dtoList, '\n');
        this.objectDTO.dtoList = [];
        return this.replay;
    };
}

class SaleOrderCRUD extends ActionCRUD {

    constructor(){
        super();

        this.objectDAO = sqliteDAOFactory.newSaleOrderDAO();
        this.sqliteSaleOrderDao = this.objectDAO;
        this.sqliteCurrencyDao = sqliteDAOFactory.newCurrencyDAO();
        this.sqliteCustomerDao = sqliteDAOFactory.newCustomerDAO();
        this.sqliteEmployeeDao = sqliteDAOFactory.newEmployeeDAO();
        this.sqlitePaymentMethodDao = sqliteDAOFactory.newPaymentMethodDAO();
        this.sqliteProductSaleOrderDao = sqliteDAOFactory.newProductSaleOrderDAO();
        this.sqliteStatusDao = sqliteDAOFactory.newStatusDAO();

        this.objectDTO = sqliteDTOFactory.newSaleOrderDTO();

        console.trace ('this.sqliteSaleOrderDao: ', this.sqliteSaleOrderDao);
    }

    async readSaleOrderData (data) {
        console.trace ('# readSaleOrderData #', '\n');
        //console.trace ('data:', data, '\n');

        this.objectDTO.dtoList = [];
        this.objectDTO.dbEntityList = [];
        this.requiredFields = '';

        let productSaleOrderCRUD = new ProductSaleOrderCRUD(); // Required to get products for each sale order

        if (data) {
            this.filterValue = data
            this.filterColumn = this.objectDAO.rowId || 0
        } else {
            this.filterValue = 0
            this.filterColumn = this.objectDAO.columnRowDateDeleted || 0
        }
        //this.filterColumn = this.sqliteSaleOrderDao.columnRowDateDeleted || null; // Value to be used to filter query
        //this.filterValue = (data) ? data : data = 0; // If data is empty assigns 0 as default value
        //this.sumColumn = 'invtInventoryTransactionUnitQuantity';
        //this.sumColumnAlias = 'invInventoryCalculatedQuantityBalance';
        //this.groupByColumn = `${this.sqliteInventoryIndexCardDao.rowId}`;
        //console.trace ('this.filterValue', this.filterValue, '\n');
        //console.trace ('this.filterColumn', this.filterColumn, '\n');

        // Get Currency, Customer, Employee, Status and PaymentMethod for every sale order
        // 6 tables
        
        this.requiredFields = `${this.sqliteSaleOrderDao.rowId}, ${this.sqliteSaleOrderDao.regularColumns}, ${this.sqliteSaleOrderDao.foreignKey1}, ${this.sqliteSaleOrderDao.foreignKey2}, ${this.sqliteSaleOrderDao.foreignKey3}, ${this.sqliteSaleOrderDao.foreignKey4}, ${this.sqliteSaleOrderDao.foreignKey5},
                                ${this.sqliteCurrencyDao.rowId}, ${this.sqliteCurrencyDao.regularColumns}, 
                                ${this.sqliteCustomerDao.rowId}, ${this.sqliteCustomerDao.regularColumns}, ${this.sqliteCustomerDao.foreignKey1},
                                ${this.sqliteEmployeeDao.rowId}, ${this.sqliteEmployeeDao.regularColumns}, ${this.sqliteEmployeeDao.foreignKey3},
                                ${this.sqliteStatusDao.rowId}, ${this.sqliteStatusDao.regularColumns},
                                ${this.sqlitePaymentMethodDao.rowId}, ${this.sqlitePaymentMethodDao.regularColumns}`;

        await this.sqliteSaleOrderDao.readEachLeftJoin6t ( this.requiredFields,
            this.sqliteSaleOrderDao.dbTableName, this.sqliteCurrencyDao.dbTableName, this.sqliteCustomerDao.dbTableName, this.sqliteEmployeeDao.dbTableName, this.sqliteStatusDao.dbTableName, this.sqlitePaymentMethodDao.dbTableName,
            this.sqliteSaleOrderDao.foreignKey1, this.sqliteCurrencyDao.rowId, this.sqliteSaleOrderDao.foreignKey2, this.sqliteCustomerDao.rowId, this.sqliteSaleOrderDao.foreignKey3, this.sqliteEmployeeDao.rowId, this.sqliteSaleOrderDao.foreignKey4, this.sqliteStatusDao.rowId, this.sqliteSaleOrderDao.foreignKey5, this.sqlitePaymentMethodDao.rowId,
            this.sqliteSaleOrderDao.columnRowDateDeleted, this.sqliteCurrencyDao.columnRowDateDeleted, this.sqliteCustomerDao.columnRowDateDeleted, this.sqliteEmployeeDao.columnRowDateDeleted, this.sqliteStatusDao.columnRowDateDeleted, this.sqlitePaymentMethodDao.columnRowDateDeleted,
            this.filterColumn, this.filterValue);

        console.trace ('saleOrder this.sqliteSaleOrderDao.list: ', this.sqliteSaleOrderDao.list);

        for (let row of this.sqliteSaleOrderDao.list) { // First get each sale order products' list. It can be done in same for loop of setDTO because await generates duplicates
            //console.trace ('saleOrder this.sqliteSaleOrderDao.list row', row, '\n');
            row.saleOrderProducts  = await productSaleOrderCRUD.readProductSalOrderData (row.saloSaleOrderId) // To get producst of each sale order
        };

        for (const row of this.sqliteSaleOrderDao.list) { // Second, sets DTO to be passed to UI
            //console.trace ('saleOrder this.sqliteSaleOrderDao.list row', row, '\n');
            this.objectDTO.setDTO(row);
            //console.trace ('saleOrder this.objectDTO.dto', this.objectDTO.dto, '\n');
            this.objectDTO.dtoList.push (JSON.parse (JSON.stringify ( this.objectDTO.dto )));
        };

        //console.trace ('saleOrder this.objectDTO.dtoList', this.objectDTO.dtoList, '\n');
        this.replay = this.objectDTO.dtoList;
        this.objectDTO.dtoList = [];
        return this.replay;
 
    };
}



////////////////////
// Exported objects
////////////////////


module.exports = { 
    ActionCRUD,
    CheckingAccountCRUD,
    CheckAccTransactionCRUD,
    CustomerCRUD,
    EmployeeCRUD,
    InventoryIndexCardCRUD,
    InventoryIndexCardTransactionCRUD,
    PriceListCRUD,
    ProductCRUD,
    SaleOrderCRUD,
    CurrencyCRUD,
    ExchangeRateCRUD,
    LocalityCRUD,
    PaymentMethodCRUD,
    StatusCRUD,
    RegionCRUD,
    ProductPriceListCRUD,
    ProductSaleOrderCRUD
}