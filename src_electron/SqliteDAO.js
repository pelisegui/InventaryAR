//DAO objects and methods

/* -- Database object configuration -- */
/* sqlite3 Opening modes
    sqlite3.OPEN_READONLY: open the database for read-only.
    sqlite3.OPEN_READWRITE : open the database for reading and writting.
    sqlite3.OPEN_CREATE: open the database, if the database does not exist, create a new database.
*/
const DbConnection = require ('./DbConnection')
const path = require('path');
//let dbFilePath = path.join(__dirname, '../../db/invardb_test.sqlite3'); // modified path for packed app
let dbFilePath = path.join(__dirname, '../db/invardb_test.sqlite3'); //Set TEST db
// let dbFilePath = path.join(__dirname, '../db/invardb_prod.sqlite3'); //Set PRODUCTION db
console.trace(dbFilePath, ' = dbFilePath'); //Log dataBasePath current value
const invarDb = new DbConnection(dbFilePath); //Instance dbConnection obejt

class SqliteDAO {
    
    constructor() {
        this.list = [];
        this.find = {};
        this.created = {};
        this.updated = {};
        this.deleted = {};
        this.sqlSentence = '';
    };

    ///////////
    // Methods
    ///////////
    
    async getAll ( columns, 
                    tableName, 
                    columnRowDateDeleted,
                    filterColumn, filterValue ) {
        //console.trace (new Date(Date.now()).toISOString(), '----- getAll ----- \n');
        this.list = [];
        invarDb.openSqliteDb('sqlite3.OPEN_READONLY');
        (columns) ? columns : columns = '*';

        this.sqlSentence = `SELECT ${columns} 
                            FROM ${tableName} 
                            WHERE ${columnRowDateDeleted} = 0
                            AND ${filterColumn} = COALESCE(${filterValue}, 0)`;

        //console.trace ('table: ', tableName, '\n');
        //console.trace ('columns: ', columns, '\n');
        //console.trace (' this.sqlSentence: ', this.sqlSentence, '\n');

        let sqlQueryPromise = new Promise ( (resolve, reject) => { 
            invarDb.getDb().all(this.sqlSentence, [], (sqliteError , queryResult ) => {
                if (sqliteError) {
                    console.trace ('Promise resolve value (invardb.all sqliteError): ', sqliteError.message, '\n'); //log error
                    reject(sqliteError);//Resolve error
                } else {
                    //console.trace ('Promise resolve value (invardb.all queryResult): ', queryResult, '\n');//log result
                    resolve(queryResult); //Resolve query result
                };
            });
        });
        invarDb.closeSqliteDb();
        try { this.list = await sqlQueryPromise; } catch (error) { this.list = error; };
        //console.trace('Promise resolve / reject value sent back to renderer (ipcMain.handle): ',this.list, '\n');

    };

    async readEachLeftJoin2t ( columns, 
                                tableNameA, tableNameB, 
                                joinColumnA, joinColumnB, 
                                columnRowDateDeletedA, columnRowDateDeletedB, 
                                filterColumn, filterValue ) {
        //console.trace (new Date(Date.now()).toISOString(), '----- readEach ----- \n');
        this.list = [];
        invarDb.openSqliteDb ('sqlite3.OPEN_READONLY');
        (columns) ? columns : columns = '*';

        this.sqlSentence = `SELECT ${columns} 
                            FROM ${tableNameA} 
                            LEFT JOIN ${tableNameB} ON ${joinColumnA} = ${joinColumnB} 
                            WHERE ${columnRowDateDeletedA} = 0 
                            AND ${columnRowDateDeletedB} = 0 
                            AND ${filterColumn} = COALESCE(${filterValue}, 0)`;

        //console.trace ( ' tableA: ', tableNameA, '\n', 'tableB: ', tableNameB, '\n' );
        //console.trace ( ' joinColumnA: ', joinColumnA, '\n', 'joinColumnB: ', joinColumnB, '\n' );
        //console.trace ( ' this.sqlSentence: ', this.sqlSentence, '\n');

        let sqlQueryPromise = new Promise ( (resolve, reject) => {           
            let returnRows = [];     
            invarDb.getDb().each (this.sqlSentence, [], (sqliteError , queryResult ) => {
                if (sqliteError) {
                    console.trace ('Promise resolve value (invardb.each sqliteError): ', sqliteError.message, '\n');//log error
                    reject(sqliteError);
                } else {
                    //console.trace ('Promise resolve value (invardb.each queryResult): ', queryResult, '\n');//log result
                    returnRows.push(queryResult);
                };
            },  (error, param) => {
                    if (error) {
                        console.trace ('Promise reject reason: ', error, '\n'); 
                        reject (error);
                    } else {
                        //console.trace('returnRows', returnRows);
                        resolve (returnRows);
                    };
                }
            );
        });
        invarDb.closeSqliteDb();
        try { this.list = await sqlQueryPromise; } catch (error) { this.list = error; };
        console.trace('Promise resolve / reject value sent back to renderer (ipcMain.handle): ',this.list, '\n');
    };

    async readEachLeftJoin3t( columns, 
                            tableNameA, tableNameB, tableNameC, 
                            joinColumnA, joinColumnB, joinColumnC, joinColumnD,
                            columnRowDateDeletedA, columnRowDateDeletedB, columnRowDateDeletedC, 
                            filterColumn, filterValue) {
        //console.trace (new Date(Date.now()).toISOString(), '----- readEach ----- \n');
        this.list = [];
        invarDb.openSqliteDb ('sqlite3.OPEN_READONLY');
        (columns) ? columns : columns = '*';

        this.sqlSentence = `SELECT ${columns} 
                            FROM ${tableNameA} 
                                LEFT JOIN ${tableNameB} ON ${joinColumnA} = ${joinColumnB}
                                LEFT JOIN ${tableNameC} ON ${joinColumnC} = ${joinColumnD}
                            WHERE ${columnRowDateDeletedA} = 0 
                            AND ${columnRowDateDeletedB} = 0 
                            AND ${columnRowDateDeletedC} = 0 
                            AND ${filterColumn} = ${filterValue}`;

        //console.trace ( ' tableA: ', tableNameA, '\n', 'tableB: ', tableNameB, '\n', 'tableC: ', tableNameC, '\n' );
        //console.trace ( ' joinColumnA: ', joinColumnA, '\n', 'joinColumnB: ', joinColumnB, '\n', 'joinColumnC: ', joinColumnC, '\n' );
        console.trace ( ' this.sqlSentence: ', this.sqlSentence, '\n');

        let sqlQueryPromise = new Promise ( (resolve, reject) => {           
            let returnRows = [];     
            invarDb.getDb().each (this.sqlSentence, [], (sqliteError , queryResult ) => {
                if (sqliteError) {
                    console.trace ('Promise resolve value (invardb.each sqliteError): ', sqliteError.message, '\n');//log error
                    reject(sqliteError);
                } else {
                    //console.trace ('Promise resolve value (invardb.each queryResult): ', queryResult, '\n');//log result
                    returnRows.push(queryResult);
                };
            },  (error, param) => {
                    if (error) {
                        console.trace ('Promise reject reason: ', error, '\n'); 
                        reject (error);
                    } else {
                        //console.trace('returnRows', returnRows);
                        resolve (returnRows);
                    };
                }
            );
        });
        invarDb.closeSqliteDb();
        try { this.list = await sqlQueryPromise; } catch (error) { this.list = error; };
        //console.trace('Promise resolve / reject value sent back to renderer (ipcMain.handle): ',this.list, '\n');
    };

    async readEachLeftJoin3tSUM ( columns, sumColumn, sumColumnAlias, 
                            tableNameA, tableNameB, tableNameC, 
                            joinColumnA, joinColumnB, joinColumnC, joinColumnD,
                            columnRowDateDeletedA, columnRowDateDeletedB, columnRowDateDeletedC, 
                            filterColumn, filterValue, groupByColumn) {
        //console.trace (new Date(Date.now()).toISOString(), '----- readEach ----- \n');
        this.list = [];
        invarDb.openSqliteDb ('sqlite3.OPEN_READONLY');
        (columns) ? columns : columns = '*';

        this.sqlSentence = `SELECT ${columns}, SUM(COALESCE(${sumColumn},0)) AS ${sumColumnAlias}
                            FROM ${tableNameA} 
                                LEFT JOIN ${tableNameB} ON ${joinColumnA} = ${joinColumnB} 
                                LEFT JOIN ${tableNameC} ON ${joinColumnC} = ${joinColumnD} 
                            WHERE ${columnRowDateDeletedA} = 0 
                            AND ${columnRowDateDeletedB} = 0 
                            AND ${columnRowDateDeletedC} = 0 
                            AND ${filterColumn} = ${filterValue}
                            GROUP BY ${groupByColumn}`;

        //console.trace ( ' tableA: ', tableNameA, '\n', 'tableB: ', tableNameB, '\n', 'tableC: ', tableNameC, '\n' );
        //console.trace ( ' joinColumnA: ', joinColumnA, '\n', 'joinColumnB: ', joinColumnB, '\n', 'joinColumnC: ', joinColumnC, '\n' );
        console.trace ( ' this.sqlSentence: ', this.sqlSentence, '\n');

        let sqlQueryPromise = new Promise ( (resolve, reject) => {           
            let returnRows = [];     
            invarDb.getDb().each (this.sqlSentence, [], (sqliteError , queryResult ) => {
                if (sqliteError) {
                    console.trace ('Promise resolve value (invardb.each sqliteError): ', sqliteError.message, '\n');//log error
                    reject(sqliteError);
                } else {
                    //console.trace ('Promise resolve value (invardb.each queryResult): ', queryResult, '\n');//log result
                    returnRows.push(queryResult);
                };
            },  (error, param) => {
                    if (error) {
                        console.trace ('Promise reject reason: ', error, '\n'); 
                        reject (error);
                    } else {
                        //console.trace('returnRows', returnRows);
                        resolve (returnRows);
                    };
                }
            );
        });
        invarDb.closeSqliteDb();
        try { this.list = await sqlQueryPromise; } catch (error) { this.list = error; };
        console.trace('Promise resolve / reject value sent back to renderer (ipcMain.handle): ',this.list, '\n');
    };

    async readEachLeftJoin4t ( columns, 
                            tableNameA, tableNameB, tableNameC, tableNameD,
                            joinColumnA, joinColumnB, joinColumnC, joinColumnD, joinColumnE, joinColumnF,
                            columnRowDateDeletedA, columnRowDateDeletedB, columnRowDateDeletedC, columnRowDateDeletedD,
                            filterColumn, filterValue) {
        //console.trace (new Date(Date.now()).toISOString(), '----- readEach ----- \n');

        this.list = [];

        invarDb.openSqliteDb ('sqlite3.OPEN_READONLY');
        
        (columns) ? columns : columns = '*';

        this.sqlSentence = `SELECT ${columns} 
                            FROM ${tableNameA} 
                                LEFT JOIN ${tableNameB} ON ${joinColumnA} = ${joinColumnB}
                                LEFT JOIN ${tableNameC} ON ${joinColumnC} = ${joinColumnD}
                                LEFT JOIN ${tableNameD} ON ${joinColumnE} = ${joinColumnF}
                            WHERE ${columnRowDateDeletedA} = 0 
                            AND ${columnRowDateDeletedB} = 0 
                            AND ${columnRowDateDeletedC} = 0
                            AND ${columnRowDateDeletedD} = 0 
                            AND ${filterColumn} = ${filterValue}`;

        //console.trace ( ' tableA: ', tableNameA, '\n', 'tableB: ', tableNameB, '\n', 'tableC: ', tableNameC, '\n', 'tableD: ', tableNameD, '\n' );
        //console.trace ( ' joinColumnA: ', joinColumnA, '\n', 'joinColumnB: ', joinColumnB, '\n' );
        //console.trace ( ' joinColumnC: ', joinColumnC, '\n', 'joinColumnD: ', joinColumnD, '\n' );
        //console.trace ( ' joinColumnE: ', joinColumnE, '\n', 'joinColumnF: ', joinColumnF, '\n' );
        console.trace ( ' this.sqlSentence: ', this.sqlSentence, '\n');

        let sqlQueryPromise = new Promise ( (resolve, reject) => {           
            let returnRows = [];     
            invarDb.getDb().each (this.sqlSentence, [], (sqliteError , queryResult ) => {
                if (sqliteError) {
                    console.trace ('Promise resolve value (invardb.each sqliteError): ', sqliteError.message, '\n');//log error
                    reject(sqliteError);
                } else {
                    //console.trace ('Promise resolve value (invardb.each queryResult): ', queryResult, '\n');//log result
                    returnRows.push(queryResult);
                };
            },  (error, param) => {
                    if (error) {
                        console.trace ('Promise reject reason: ', error, '\n'); 
                        reject (error);
                    } else {
                        //console.trace('returnRows', returnRows);
                        resolve (returnRows);
                    };
                }
            );
        });
        invarDb.closeSqliteDb();
        try { this.list = await sqlQueryPromise; } catch (error) { this.list = error; };
        console.trace('\n Promise resolve / reject value sent back to renderer (ipcMain.handle): ', this.list);
    };

    async readEachLeftJoin4tSUM ( columns, sumColumn, sumColumnAlias,
                            tableNameA, tableNameB, tableNameC, tableNameD,
                            joinColumnA, joinColumnB, joinColumnC, joinColumnD, joinColumnE, joinColumnF,
                            columnRowDateDeletedA, columnRowDateDeletedB, columnRowDateDeletedC, columnRowDateDeletedD,
                            filterColumn, filterValue, groupByColumn) {
        //console.trace (new Date(Date.now()).toISOString(), '----- readEach ----- \n');

        this.list = [];

        invarDb.openSqliteDb ('sqlite3.OPEN_READONLY');
        
        (columns) ? columns : columns = '*';

        this.sqlSentence = `SELECT ${columns}, SUM(COALESCE(${sumColumn},0)) AS ${sumColumnAlias}
                            FROM ${tableNameA} 
                                LEFT JOIN ${tableNameB} ON ${joinColumnA} = ${joinColumnB} 
                                LEFT JOIN ${tableNameC} ON ${joinColumnC} = ${joinColumnD} 
                                LEFT JOIN ${tableNameD} ON ${joinColumnE} = ${joinColumnF} 
                            WHERE ${columnRowDateDeletedA} = 0 
                            AND ${columnRowDateDeletedB} = 0 
                            AND ${columnRowDateDeletedC} = 0 
                            AND ${columnRowDateDeletedD} = 0 
                            AND ${filterColumn} = ${filterValue}
                            GROUP BY ${groupByColumn}`;

        //console.trace ( ' tableA: ', tableNameA, '\n', 'tableB: ', tableNameB, '\n', 'tableC: ', tableNameC, '\n', 'tableD: ', tableNameD, '\n' );
        //console.trace ( ' joinColumnA: ', joinColumnA, '\n', 'joinColumnB: ', joinColumnB, '\n' );
        //console.trace ( ' joinColumnC: ', joinColumnC, '\n', 'joinColumnD: ', joinColumnD, '\n' );
        //console.trace ( ' joinColumnE: ', joinColumnE, '\n', 'joinColumnF: ', joinColumnF, '\n' );
        console.trace ( ' this.sqlSentence: ', this.sqlSentence, '\n');

        let sqlQueryPromise = new Promise ( (resolve, reject) => {           
            let returnRows = [];     
            invarDb.getDb().each (this.sqlSentence, [], (sqliteError , queryResult ) => {
                if (sqliteError) {
                    console.trace ('Promise resolve value (invardb.each sqliteError): ', sqliteError.message, '\n');//log error
                    reject(sqliteError);
                } else {
                    //console.trace ('Promise resolve value (invardb.each queryResult): ', queryResult, '\n');//log result
                    returnRows.push(queryResult);
                };
            },  (error, param) => {
                    if (error) {
                        console.trace ('Promise reject reason: ', error, '\n'); 
                        reject (error);
                    } else {
                        //console.trace('returnRows', returnRows);
                        resolve (returnRows);
                    };
                }
            );
        });
        invarDb.closeSqliteDb();
        try { this.list = await sqlQueryPromise; } catch (error) { this.list = error; };
        console.trace('Promise resolve / reject value sent back to renderer (ipcMain.handle): ',this.list, '\n');
    };

    async readEachLeftJoin5t ( columns, 
                            tableNameA, tableNameB, tableNameC, tableNameD, tableNameE,
                            joinColumnA, joinColumnB, joinColumnC, joinColumnD, joinColumnE, joinColumnF, joinColumnG, joinColumnH,
                            columnRowDateDeletedA, columnRowDateDeletedB, columnRowDateDeletedC, columnRowDateDeletedD, columnRowDateDeletedE,
                            filterColumn, filterValue) {
        //console.trace (new Date(Date.now()).toISOString(), '----- readEach ----- \n');
        this.list = [];
        invarDb.openSqliteDb ('sqlite3.OPEN_READONLY');
        (columns) ? columns : columns = '*';

        this.sqlSentence = `SELECT ${columns} 
                            FROM ${tableNameA} 
                                LEFT JOIN ${tableNameB} ON ${joinColumnA} = ${joinColumnB} 
                                LEFT JOIN ${tableNameC} ON ${joinColumnC} = ${joinColumnD} 
                                LEFT JOIN ${tableNameD} ON ${joinColumnE} = ${joinColumnF}
                                LEFT JOIN ${tableNameE} ON ${joinColumnG} = ${joinColumnH} 
                            WHERE ${columnRowDateDeletedA} = 0 
                            AND ${columnRowDateDeletedB} = 0 
                            AND ${columnRowDateDeletedC} = 0 
                            AND ${columnRowDateDeletedD} = 0 
                            AND ${columnRowDateDeletedE} = 0 
                            AND ${filterColumn} = ${filterValue}`;

        //console.trace ( ' tableA: ', tableNameA, '\n', 'tableB: ', tableNameB, '\n', 'tableC: ', tableNameC, '\n', 'tableD: ', tableNameD, '\n', 'tableE: ', tableNameE, '\n'  );
        //console.trace ( ' joinColumnA: ', joinColumnA, '\n', 'joinColumnB: ', joinColumnB, '\n' );
        //console.trace ( ' joinColumnC: ', joinColumnC, '\n', 'joinColumnD: ', joinColumnD, '\n' );
        //console.trace ( ' joinColumnE: ', joinColumnE, '\n', 'joinColumnF: ', joinColumnF, '\n' );
        //console.trace ( ' joinColumnG: ', joinColumnG, '\n', 'joinColumnH: ', joinColumnH, '\n' );
        //console.trace ( ' this.sqlSentence: ', this.sqlSentence, '\n');

        let sqlQueryPromise = new Promise ( (resolve, reject) => {           
            let returnRows = [];     
            invarDb.getDb().each (this.sqlSentence, [], (sqliteError , queryResult ) => {
                if (sqliteError) {
                    console.trace ('Promise resolve value (invardb.each sqliteError): ', sqliteError.message, '\n');//log error
                    reject(sqliteError);
                } else {
                    //console.trace ('Promise resolve value (invardb.each queryResult): ', queryResult, '\n');//log result
                    returnRows.push(queryResult);
                };
            },  (error, param) => {
                    if (error) {
                        console.trace ('Promise reject reason: ', error, '\n'); 
                        reject (error);
                    } else {
                        //console.trace('returnRows', returnRows);
                        resolve (returnRows);
                    };
                }
            );
        });
        invarDb.closeSqliteDb();
        try { this.list = await sqlQueryPromise; } catch (error) { this.list = error; };
        console.trace('\n Promise resolve / reject value sent back to renderer (ipcMain.handle): ',this.list);
    };

    async readEachLeftJoin5tSUM ( columns, sumColumn, sumColumnAlias,
                                tableNameA, tableNameB, tableNameC, tableNameD, tableNameE,
                                joinColumnA, joinColumnB, joinColumnC, joinColumnD, joinColumnE, joinColumnF, joinColumnG, joinColumnH,
                                columnRowDateDeletedA, columnRowDateDeletedB, columnRowDateDeletedC, columnRowDateDeletedD, columnRowDateDeletedE,
                                filterColumn, filterValue, groupByColumn) {
        //console.trace (new Date(Date.now()).toISOString(), '----- readEach ----- \n');

        this.list = [];

        invarDb.openSqliteDb ('sqlite3.OPEN_READONLY');
        
        (columns) ? columns : columns = '*';

        this.sqlSentence = `SELECT ${columns}, SUM(COALESCE(${sumColumn},0)) AS ${sumColumnAlias}
                            FROM ${tableNameA} 
                                LEFT JOIN ${tableNameB} ON ${joinColumnA} = ${joinColumnB} 
                                LEFT JOIN ${tableNameC} ON ${joinColumnC} = ${joinColumnD} 
                                LEFT JOIN ${tableNameD} ON ${joinColumnE} = ${joinColumnF}
                                LEFT JOIN ${tableNameE} ON ${joinColumnG} = ${joinColumnH} 
                            WHERE ${columnRowDateDeletedA} = 0 
                            AND ${columnRowDateDeletedB} = 0 
                            AND ${columnRowDateDeletedC} = 0 
                            AND ${columnRowDateDeletedD} = 0 
                            AND ${columnRowDateDeletedE} = 0 
                            AND ${filterColumn} = ${filterValue}
                            GROUP BY ${groupByColumn}`;

        //console.trace ( ' tableA: ', tableNameA, '\n', 'tableB: ', tableNameB, '\n', 'tableC: ', tableNameC, '\n', 'tableD: ', tableNameD, '\n', 'tableE: ', tableNameE, '\n'  );
        //console.trace ( ' joinColumnA: ', joinColumnA, '\n', 'joinColumnB: ', joinColumnB, '\n' );
        //console.trace ( ' joinColumnC: ', joinColumnC, '\n', 'joinColumnD: ', joinColumnD, '\n' );
        //console.trace ( ' joinColumnE: ', joinColumnE, '\n', 'joinColumnF: ', joinColumnF, '\n' );
        //console.trace ( ' joinColumnG: ', joinColumnG, '\n', 'joinColumnH: ', joinColumnH, '\n' );
        console.trace ( ' this.sqlSentence: ', this.sqlSentence, '\n');

        let sqlQueryPromise = new Promise ( (resolve, reject) => {           
            let returnRows = [];     
            invarDb.getDb().each (this.sqlSentence, [], (sqliteError , queryResult ) => {
                if (sqliteError) {
                    console.trace ('Promise resolve value (invardb.each sqliteError): ', sqliteError.message, '\n');//log error
                    reject(sqliteError);
                } else {
                    //console.trace ('Promise resolve value (invardb.each queryResult): ', queryResult, '\n');//log result
                    returnRows.push(queryResult);
                };
            },  (error, param) => {
                    if (error) {
                        console.trace ('Promise reject reason: ', error, '\n'); 
                        reject (error);
                    } else {
                        //console.trace('returnRows', returnRows);
                        resolve (returnRows);
                    };
                }
            );
        });
        invarDb.closeSqliteDb();
        try { this.list = await sqlQueryPromise; } catch (error) { this.list = error; };
        console.trace('Promise resolve / reject value sent back to renderer (ipcMain.handle): ',this.list, '\n');
    };    

    async readEachLeftJoin6t ( columns, 
                            tableNameA, tableNameB, tableNameC, tableNameD, tableNameE, tableNameF,
                            joinColumnA, joinColumnB, joinColumnC, joinColumnD, joinColumnE, joinColumnF, joinColumnG, joinColumnH, joinColumnI, joinColumnJ,
                            columnRowDateDeletedA, columnRowDateDeletedB, columnRowDateDeletedC, columnRowDateDeletedD, columnRowDateDeletedE, columnRowDateDeletedF,
                            filterColumn, filterValue) {
        //console.trace (new Date(Date.now()).toISOString(), '----- readEach ----- \n');
        this.list = [];
        invarDb.openSqliteDb ('sqlite3.OPEN_READONLY');
        (columns) ? columns : columns = '*';

        this.sqlSentence = `SELECT ${columns} 
                            FROM ${tableNameA} 
                                LEFT JOIN ${tableNameB} ON ${joinColumnA} = ${joinColumnB} 
                                LEFT JOIN ${tableNameC} ON ${joinColumnC} = ${joinColumnD} 
                                LEFT JOIN ${tableNameD} ON ${joinColumnE} = ${joinColumnF}
                                LEFT JOIN ${tableNameE} ON ${joinColumnG} = ${joinColumnH}
                                LEFT JOIN ${tableNameF} ON ${joinColumnI} = ${joinColumnJ} 
                            WHERE ${columnRowDateDeletedA} = 0 
                            AND ${columnRowDateDeletedB} = 0 
                            AND ${columnRowDateDeletedC} = 0 
                            AND ${columnRowDateDeletedD} = 0 
                            AND ${columnRowDateDeletedE} = 0 
                            AND ${columnRowDateDeletedF} = 0 
                            AND ${filterColumn} = ${filterValue}`;

        //console.trace ( ' tableA: ', tableNameA, '\n', 'tableB: ', tableNameB, '\n', 'tableC: ', tableNameC, '\n', 'tableD: ', tableNameD, '\n', 'tableE: ', tableNameE, '\n'  );
        //console.trace ( ' joinColumnA: ', joinColumnA, '\n', 'joinColumnB: ', joinColumnB, '\n' );
        //console.trace ( ' joinColumnC: ', joinColumnC, '\n', 'joinColumnD: ', joinColumnD, '\n' );
        //console.trace ( ' joinColumnE: ', joinColumnE, '\n', 'joinColumnF: ', joinColumnF, '\n' );
        //console.trace ( ' joinColumnG: ', joinColumnG, '\n', 'joinColumnH: ', joinColumnH, '\n' );
        console.trace ( ' this.sqlSentence: ', this.sqlSentence, '\n');

        let sqlQueryPromise = new Promise ( (resolve, reject) => {           
            let returnRows = [];     
            invarDb.getDb().each (this.sqlSentence, [], (sqliteError , queryResult ) => {
                if (sqliteError) {
                    console.trace ('Promise resolve value (invardb.each sqliteError): ', sqliteError.message, '\n');//log error
                    reject(sqliteError);
                } else {
                    //console.trace ('Promise resolve value (invardb.each queryResult): ', queryResult, '\n');//log result
                    returnRows.push(queryResult);
                };
            },  (error, param) => {
                    if (error) {
                        console.trace ('Promise reject reason: ', error, '\n'); 
                        reject (error);
                    } else {
                        //console.trace('returnRows', returnRows);
                        resolve (returnRows);
                    };
                }
            );
        });
        invarDb.closeSqliteDb();
        try { this.list = await sqlQueryPromise; } catch (error) { this.list = error; };
        console.trace('Promise resolve / reject value sent back to renderer (ipcMain.handle): ',this.list, '\n');
    };

    async readEachLeftJoin6tSUM ( columns, sumColumn, sumColumnAlias, 
                            tableNameA, tableNameB, tableNameC, tableNameD, tableNameE, tableNameF,
                            joinColumnA, joinColumnB, joinColumnC, joinColumnD, joinColumnE, joinColumnF, joinColumnG, joinColumnH, joinColumnI, joinColumnJ,
                            columnRowDateDeletedA, columnRowDateDeletedB, columnRowDateDeletedC, columnRowDateDeletedD, columnRowDateDeletedE, columnRowDateDeletedF,
                            filterColumn, filterValue, groupByColumn) {
        //console.trace (new Date(Date.now()).toISOString(), '----- readEach ----- \n');
        this.list = [];
        invarDb.openSqliteDb ('sqlite3.OPEN_READONLY');
        (columns) ? columns : columns = '*';

        this.sqlSentence = `SELECT ${columns}, SUM(COALESCE(${sumColumn},0)) AS ${sumColumnAlias}
                            FROM ${tableNameA} 
                                LEFT JOIN ${tableNameB} ON ${joinColumnA} = ${joinColumnB} 
                                LEFT JOIN ${tableNameC} ON ${joinColumnC} = ${joinColumnD} 
                                LEFT JOIN ${tableNameD} ON ${joinColumnE} = ${joinColumnF}
                                LEFT JOIN ${tableNameE} ON ${joinColumnG} = ${joinColumnH}
                                LEFT JOIN ${tableNameF} ON ${joinColumnI} = ${joinColumnJ} 
                            WHERE ${columnRowDateDeletedA} = 0 
                            AND ${columnRowDateDeletedB} = 0 
                            AND ${columnRowDateDeletedC} = 0 
                            AND ${columnRowDateDeletedD} = 0 
                            AND ${columnRowDateDeletedE} = 0 
                            AND ${columnRowDateDeletedF} = 0 
                            AND ${filterColumn} = ${filterValue}
                            GROUP BY ${groupByColumn}`;

        //console.trace ( ' tableA: ', tableNameA, '\n', 'tableB: ', tableNameB, '\n', 'tableC: ', tableNameC, '\n', 'tableD: ', tableNameD, '\n', 'tableE: ', tableNameE, '\n'  );
        //console.trace ( ' joinColumnA: ', joinColumnA, '\n', 'joinColumnB: ', joinColumnB, '\n' );
        //console.trace ( ' joinColumnC: ', joinColumnC, '\n', 'joinColumnD: ', joinColumnD, '\n' );
        //console.trace ( ' joinColumnE: ', joinColumnE, '\n', 'joinColumnF: ', joinColumnF, '\n' );
        //console.trace ( ' joinColumnG: ', joinColumnG, '\n', 'joinColumnH: ', joinColumnH, '\n' );
        //console.trace ( ' this.sqlSentence: ', this.sqlSentence, '\n');

        let sqlQueryPromise = new Promise ( (resolve, reject) => {           
            let returnRows = [];     
            invarDb.getDb().each (this.sqlSentence, [], (sqliteError , queryResult ) => {
                if (sqliteError) {
                    console.trace ('Promise resolve value (invardb.each sqliteError): ', sqliteError.message, '\n');//log error
                    reject(sqliteError);
                } else {
                    //console.trace ('Promise resolve value (invardb.each queryResult): ', queryResult, '\n');//log result
                    returnRows.push(queryResult);
                };
            },  (error, param) => {
                    if (error) {
                        console.trace ('Promise reject reason: ', error, '\n'); 
                        reject (error);
                    } else {
                        //console.trace('returnRows', returnRows);
                        resolve (returnRows);
                    };
                }
            );
        });
        invarDb.closeSqliteDb();
        try { this.list = await sqlQueryPromise; } catch (error) { this.list = error; };
        console.trace('Promise resolve / reject value sent back to renderer (ipcMain.handle): ',this.list, '\n');
    };

    async readEachLeftJoin7tSUM ( columns, sumColumn, sumColumnAlias, 
                            tableNameA, tableNameB, tableNameC, tableNameD, tableNameE, tableNameF, tableNameG,
                            joinColumnA, joinColumnB, joinColumnC, joinColumnD, joinColumnE, joinColumnF, joinColumnG, joinColumnH, joinColumnI, joinColumnJ, joinColumnK, joinColumnL,
                            columnRowDateDeletedA, columnRowDateDeletedB, columnRowDateDeletedC, columnRowDateDeletedD, columnRowDateDeletedE, columnRowDateDeletedF, columnRowDateDeletedG,
                            filterColumn, filterValue, groupByColumn) {
        //console.trace (new Date(Date.now()).toISOString(), '----- readEach ----- \n');
        this.list = [];
        invarDb.openSqliteDb ('sqlite3.OPEN_READONLY');
        (columns) ? columns : columns = '*';

        this.sqlSentence = `SELECT ${columns}, SUM(COALESCE(${sumColumn},0)) AS ${sumColumnAlias}
                            FROM ${tableNameA} 
                                LEFT JOIN ${tableNameB} ON ${joinColumnA} = ${joinColumnB} 
                                LEFT JOIN ${tableNameC} ON ${joinColumnC} = ${joinColumnD} 
                                LEFT JOIN ${tableNameD} ON ${joinColumnE} = ${joinColumnF}
                                LEFT JOIN ${tableNameE} ON ${joinColumnG} = ${joinColumnH}
                                LEFT JOIN ${tableNameF} ON ${joinColumnI} = ${joinColumnJ}
                                LEFT JOIN ${tableNameG} ON ${joinColumnK} = ${joinColumnL} 
                            WHERE ${columnRowDateDeletedA} = 0 
                            AND ${columnRowDateDeletedB} = 0 
                            AND ${columnRowDateDeletedC} = 0 
                            AND ${columnRowDateDeletedD} = 0 
                            AND ${columnRowDateDeletedE} = 0 
                            AND ${columnRowDateDeletedF} = 0
                            AND ${columnRowDateDeletedG} = 0  
                            AND ${filterColumn} = ${filterValue}
                            GROUP BY ${groupByColumn}`;

        console.trace ( ' tableA: ', tableNameA, '\n', 'tableB: ', tableNameB, '\n', 'tableC: ', tableNameC, '\n', 'tableD: ', tableNameD, '\n', 'tableE: ', tableNameE, '\n', 'tableF: ', tableNameF, '\n', 'tableG: ', tableNameG, '\n'  );
        //console.trace ( ' joinColumnA: ', joinColumnA, '\n', 'joinColumnB: ', joinColumnB, '\n' );
        //console.trace ( ' joinColumnC: ', joinColumnC, '\n', 'joinColumnD: ', joinColumnD, '\n' );
        //console.trace ( ' joinColumnE: ', joinColumnE, '\n', 'joinColumnF: ', joinColumnF, '\n' );
        //console.trace ( ' joinColumnG: ', joinColumnG, '\n', 'joinColumnH: ', joinColumnH, '\n' );
        //console.trace ( ' joinColumnI: ', joinColumnI, '\n', 'joinColumnJ: ', joinColumnJ, '\n' );
        console.trace ( ' joinColumnK: ', joinColumnK, '\n', 'joinColumnL: ', joinColumnL, '\n' );
        console.trace ( ' this.sqlSentence: ', this.sqlSentence, '\n');

        let sqlQueryPromise = new Promise ( (resolve, reject) => {           
            let returnRows = [];     
            invarDb.getDb().each (this.sqlSentence, [], (sqliteError , queryResult ) => {
                if (sqliteError) {
                    console.trace ('Promise resolve value (invardb.each sqliteError): ', sqliteError.message, '\n');//log error
                    reject(sqliteError);
                } else {
                    //console.trace ('Promise resolve value (invardb.each queryResult): ', queryResult, '\n');//log result
                    returnRows.push(queryResult);
                };
            },  (error, param) => {
                    if (error) {
                        console.trace ('Promise reject reason: ', error, '\n'); 
                        reject (error);
                    } else {
                        //console.trace('returnRows', returnRows);
                        resolve (returnRows);
                    };
                }
            );
        });
        invarDb.closeSqliteDb();
        try { this.list = await sqlQueryPromise; } catch (error) { this.list = error; };
        console.trace('Promise resolve / reject value sent back to renderer (ipcMain.handle): ',this.list, '\n');
    };
   
    async getFirstBySearchedValue ( columns, 
                                    tableName, 
                                    columnRowDateDeleted, 
                                    searchedColumn, searchedValue){
        //console.trace (new Date(Date.now()).toISOString(), '----- findFirstById ----- \n');
        invarDb.openSqliteDb('sqlite3.OPEN_READONLY');
        (columns) ? columns : columns = '*';
        this.sqlSentence = `SELECT ${columns} 
                            FROM ${tableName} 
                            WHERE ${searchedColumn} = ${searchedValue} 
                            AND ${columnRowDateDeleted} = 0`;
        //console.trace (' table: ', tableName, '\n');
        //console.trace (' this.sqlSentence: ', this.sqlSentence, '\n');
        let sqlQueryPromise = new Promise ( (resolve, reject) => { 
            invarDb.getDb().get(this.sqlSentence, [], (sqliteError , queryResult ) => {
                if (sqliteError) {
                    console.trace ('Promise resolve value (invardb.get sqliteError): ', sqliteError.message, '\n');//log error
                    reject(sqliteError);//Resolve error
                } else {
                    //console.trace ('Promise resolve value (invardb.get queryResult): ', queryResult, '\n');//log result
                    resolve(queryResult);//Resolve query result
                };
            });
        });

        invarDb.closeSqliteDb();
        try { this.find = await sqlQueryPromise; } catch (error) { this.find = error; };
        //console.trace('Promise resolve / reject value sent back to renderer (ipcMain.handle): ',this.list, '\n');
    };

    async getAllBySearchedValue ( columns, 
                                tableName, 
                                columnRowDateDeleted, 
                                searchedColumn, searchedValue) {
        //console.trace (new Date(Date.now()).toISOString(), '----- findAllByID ----- \n');
        invarDb.openSqliteDb('sqlite3.OPEN_READONLY');
        (columns) ? columns : columns = '*';
        this.sqlSentence = `SELECT ${columns} 
                            FROM ${tableName} 
                            WHERE ${columnRowDateDeleted} = 0 
                            AND ${searchedColumn} = ${searchedValue}`;
        //console.trace ('table: ', tableName, '\n');
        console.trace (' this.sqlSentence: ', this.sqlSentence, '\n');
        let sqlQueryPromise = new Promise ( (resolve, reject) => { 
            invarDb.getDb().all(this.sqlSentence, [], (sqliteError , queryResult ) => {
                if (sqliteError) {
                    console.trace ('Promise resolve value (invardb.all sqliteError): ', sqliteError.message, '\n');//log error
                    reject(sqliteError);//Resolve error
                } else {
                     //console.trace ('Promise resolve value (invardb.all queryResult): ', queryResult, '\n');//log result
                    resolve(queryResult);//Resolve query result
                };
            });
        });
        invarDb.closeSqliteDb();
        try { this.list = await sqlQueryPromise; } catch (error) { this.list = error; };
        //console.trace('Promise resolve / reject value sent back to renderer (ipcMain.handle): ',this.list, '\n');
    };

    async createRow ( tableName, columns, row, values ) {
        console.trace (new Date(Date.now()).toISOString(), '----- createRow ----- \n');
        invarDb.openSqliteDb ('sqlite3.OPEN_READWRITE');

        this.sqlSentence = `INSERT INTO ${tableName}(${columns}) VALUES(${values})`;

        console.trace (' table: ', tableName, '\n', 'columns: ', columns, '\n', );
        console.trace (' row = ', row);
        console.trace ('this.sqlSentence: ', this.sqlSentence, '\n');

        let sqlQueryPromise = new Promise ( (resolve, reject) => {
            invarDb.getDb().run(this.sqlSentence, row, function (sqliteError , queryResult ) {
                if (sqliteError) {
                    console.trace ('Promise resolve value (invardb.run sqliteError): ', sqliteError.message, '\n');//log error
                    reject(sqliteError);//Resolve error
                } else {
                    let callBackProps = JSON.parse(JSON.stringify(this)); //callback props
                    //console.trace('Last row been inserted with rowid: ', callBackProps.lastID);
                    //console.trace ('ceateRow queryResult: ', queryResult, '\n'); // because its an insertion queryResult is undefined
                    console.trace('New rows inserted (callBackProps.changes): ', callBackProps.changes, '\n');
                    resolve(callBackProps); //Resolve query result
                };
            });
        });
        invarDb.closeSqliteDb();
        try { this.created = await sqlQueryPromise } catch (error) { this.created = error; };
        console.trace('Promise resolve / reject value sent back to renderer (ipcMain.handle):',this.created, '\n');
    };
    
    async updateRow (tableName, row) {
        console.trace (new Date(Date.now()).toISOString(), '----- updateRow ----- \n');
        invarDb.openSqliteDb ('sqlite3.OPEN_READWRITE');
        let arrayOfValues = row;
        let columnNameToChangeValue = arrayOfValues.shift();
        let columnNameRowId = arrayOfValues.shift();
        let newValueAndRowId = arrayOfValues;

        this.sqlSentence = `UPDATE ${tableName} 
                            SET ${columnNameToChangeValue} = ? 
                            WHERE  ${columnNameRowId} = ?`;

        console.trace (' table: ', tableName, '\n', 'column: ', columnNameToChangeValue, '\n', 'columnRowID: ', columnNameRowId);
        console.trace (' newValueAndRowId = ', newValueAndRowId, '\n');
        console.trace ('row: ', row, '\n');
        //console.trace (' this.sqlSentence: ', this.sqlSentence, '\n');
    
        let sqlQueryPromise = new Promise ( (resolve, reject) => { 
            invarDb.getDb().run(this.sqlSentence, newValueAndRowId, function (sqliteError , queryResult ) {
                if (sqliteError) {
                    console.trace ('Promise resolve value (invardb.run sqliteError): ', sqliteError.message, '\n');//log error
                    reject(sqliteError);//Resolve error
                } else {
                    let callBackProps = JSON.parse(JSON.stringify(this)); //callback props
                    //console.trace('updateRow: ', queryResult, '\n'); // queryResult is undefined for Insertion, Update and Delete
                    console.trace('Rows updated (callBackProps.changes): ', callBackProps.changes, '\n');
                    resolve(callBackProps);//Resolve query result
                };
            });
        });
        invarDb.closeSqliteDb();    
        try { this.updated = await sqlQueryPromise } catch (error) { this.updated = error; console.error(error) };
        //console.trace('Promise resolve / reject value sent back to renderer (ipcMain.handle): ',this.updated, '\n');
    };
    
    async deleteRow (tableName, row) {
        console.trace (new Date(Date.now()).toISOString(), '----- deleteRow ----- \n');
        invarDb.openSqliteDb('sqlite3.OPEN_READWRITE');
        let arrayOfValues = row.shift();
        let idColumn = arrayOfValues.shift();
        let idsToErase = arrayOfValues;

        this.sqlSentence = `DELETE FROM ${tableName} WHERE ${idColumn}=?`;

        //console.trace (' table: ', tableName, '\n', 'column: ', idColumn, '\n', 'rowIds = ', idsToErase, '\n');
        console.trace ('this.sqlSentence: ', this.sqlSentence, '\n');

        let sqlQueryPromise = new Promise ( (resolve, reject) => { 
            idsToErase.forEach(function(item, index, array) {
                console.trace(item, index, array, '\n');             
                invarDb.getDb().run(this.sqlSentence, item, function (sqliteError , queryResult ) {
                    if (sqliteError) {
                        console.trace ('Promise resolve value (invardb.run sqliteError): ', sqliteError.message, '\n');//log error
                        reject(sqliteError);//Resolve error
                    } else {
                        let callBackProps = JSON.parse(JSON.stringify(this)); //callback props
                        //console.trace('Last row been inserted with rowid: ', this.lastID);
                        //console.trace('deleteRow: ', queryResult, '\n'); queryResult is undefined for Insertion, Update and Delete
                        console.trace('Rows deleted (callBackProps.changes): ', callBackProps.changes, '\n');
                        resolve(callBackProps);//Resolve query result
                    };
                });
            });
        });
        invarDb.closeSqliteDb();
        try { this.deleted = await sqlQueryPromise; } catch (error) { this.deleted = error; };
        //console.trace('Promise resolve / reject value sent back to renderer (ipcMain.handle): ', this.deleted, '\n');
    };
   
};


///////////////////////
// Link Tables
///////////////////////

class ProductPriceListDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'linkProductPriceList';
        this.rowId = 'lnkProductPriceListId';
        this.foreignKey1 = 'lnkProductPriceListPriceListId';
        this.foreignKey2 = 'lnkProductPriceListProductId';
        //this.foreignKey3 = 'lnkProductPriceListSellPriceCurrencyId';
        //this.foreignKey4 = 'lnkProductPriceListNetPriceCurrencyId';
        this.regularColumns = 'lnkProductPriceListMarkup, lnkProductPriceListSellPrice, lnkProductPriceListNetPrice';
        this.columnRowDateCreated = 'lnkProductPriceListRowDateCreated';
        this.columnRowDateUpdated = 'lnkProductPriceListRowDateUpdated';
        this.columnRowDateDeleted = 'lnkProductPriceListRowDateDeleted';
        //this.dbViewName = 'viewProdcutPriceListDto';
    }
};

class ProductSaleOrderDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'linkProductSaleOrder';
        this.rowId = 'lnkProductSaleOrderId';
        this.foreignKey1 = 'lnkProductSaleOrderSaleOrderId';
        this.foreignKey2 = 'lnkProductSaleOrderProductId';
        this.foreignKey3 = 'lnkProductSaleOrderUnitTypeId';
        //this.foreignKey4 = 'lnkProductSaleOrderUnitSellPriceCurrencyId';
        this.regularColumns = 'lnkProductSaleOrderQuantity, lnkProductSaleOrderUnitSellPrice, lnkProductSaleOrderDiscount, lnkProductSaleOrderSubTotal, lnkProductSaleOrderVATax, lnkProductSaleOrderSubTotalWithVATax';
        this.columnRowDateCreated = 'lnkProductSaleOrderRowDateCreated';
        this.columnRowDateUpdated = 'lnkProductSaleOrderRowDateUpdated';
        this.columnRowDateDeleted = 'lnkProductSaleOrderRowDateDeleted';
        //this.dbViewName = 'viewProdcutSaleOrderDto';
    }
};


/////////////////////////
// Pick List Tables
/////////////////////////

class CurrencyDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'pltblCurrency';
        this.rowId = 'plCurrencyId';
        this.regularColumns = 'plCurrencyCode, plCurrencyNumericCode, plCurrencyName, plCurrencyLiteral, plCurrencySymbol';
        this.columnRowDateCreated = 'plCurrencyRowDateCreated';
        this.columnRowDateUpdated = 'plCurrencyRowDateUpdated';
        this.columnRowDateDeleted = 'plCurrencyRowDateDeleted';
        //this.dbViewName = 'viewCurrencyDto';
    }
};

class ExchangeRateDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'pltblExchangeRate';
        this.rowId = 'plExchangeRateId';
        this.foreignKey1 = 'plExchangeRateFromCurrencyId';
        this.foreignKey2 = 'plExchangeRateToCurrencyId';
        this.regularColumns = 'plExchangeRateRate';
        this.columnRowDateCreated = 'plExchangeRateRowDateCreated';
        this.columnRowDateUpdated = 'plExchangeRateRowDateUpdated';
        this.columnRowDateDeleted = 'plExchangeRateRowDateDeleted';
        //this.dbViewName = 'viewExchangeRateDto';
    }
};

class LocalityDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'pltblLocality';
        this.rowId = 'plLocalityId';
        this.foreignKey1 = 'plLocalityDepartmentId';
        this.foreignKey2 = 'plLocalityTownId';
        this.foreignKey3 = 'plLocalityProvinceId';
        this.regularColumns = 'plLocalityName';
        this.columnRowDateCreated = 'plLocalityRowDateCreated';
        this.columnRowDateUpdated = 'plLocalityRowDateUpdated';
        this.columnRowDateDeleted = 'plLocalityRowDateDeleted';
        //this.dbViewName = 'viewLocalityDto';
    }
};

class PaymentMethodDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'pltblPaymentMethod';
        this.rowId = 'plPaymentMethodId';
        this.regularColumns = 'plPaymentMethodType';
        this.columnRowDateCreated = 'plPaymentMethodRowDateCreated';
        this.columnRowDateUpdated = 'plPaymentMethodRowDateUpdated';
        this.columnRowDateDeleted = 'plPaymentMethodRowDateDeleted';
        //this.dbViewName = 'viewRegionDto';
    }
};

class RegionDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'pltblRegion';
        this.rowId = 'plRegionId';
        this.regularColumns = 'plRegionName';
        this.columnRowDateCreated = 'plRegionRowDateCreated';
        this.columnRowDateUpdated = 'plRegionRowDateUpdated';
        this.columnRowDateDeleted = 'plRegionRowDateDeleted';
        //this.dbViewName = 'viewRegionDto';
    }
};

class StatusDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'pltblStatus';
        this.rowId = 'plStatusId';
        this.regularColumns = 'plStatusCode, plStatusName, plStatusGroup';
        this.columnRowDateCreated = 'plStatusRowDateCreated';
        this.columnRowDateUpdated = 'plStatusRowDateUpdated';
        this.columnRowDateDeleted = 'plStatusRowDateDeleted';
        //this.dbViewName = 'viewStatusDto';
    }
};


////////////////////
// Entity Tables
///////////////////

class CheckingAccountDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'tblCheckingAccount';
        this.rowId = 'cacCheckingAccountId';
        this.foreignKey1 = 'cacCurrencyId';
        this.regularColumns = 'cacCheckingAccountName, cacCheckingAccountBalance, cacCheckingAccountLastTransactionDate';
        this.columnRowDateCreated = 'cacCheckingAccountRowDateCreated';
        this.columnRowDateUpdated = 'cacCheckingAccountRowDateUpdated';
        this.columnRowDateDeleted = 'cacCheckingAccountRowDateDeleted';
        //this.dbViewName = 'viewCheckingAccountDto';
    }
};

class CheckAccTransactionDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'tblCheckAccTransaction';
        this.rowId = 'catCheckAccTransactionId';
        this.foreignKey1 = 'catCheckingAccountId';
        this.foreignKey2 = 'catPaymentMethodId';
        this.foreignKey3 = 'catSaleOrderId';
        this.regularColumns = 'catCheckAccTransactionAmount, catCheckAccTransactionDescription, catCheckAccTransactionType';
        this.columnRowDateCreated = 'catCheckAccTransactionRowDateCreated';
        this.columnRowDateUpdated = 'catCheckAccTransactionRowDateUpdated';
        this.columnRowDateDeleted = 'catCheckAccTransactionRowDateDeleted';
        //this.dbViewName = 'viewChecAccTransactionDto';
    }
};

class CustomerDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'tblCustomer';
        this.rowId = 'cusCustomerId';
        this.foreignKey1 = 'cusCheckingAccountId';
        this.foreignKey2 = 'cusLocalityId';
        this.foreignKey3 = 'cusRegionId';
        this.foreignKey4 = 'cusSalesRepId';
        this.regularColumns = 'cusCustomerName, cusCustomerCUIT, cusCustomerAddress, cusCustomerEmail, cusCustomerPhone1, cusCustomerContact, cusCustomerContactPhone1';
        this.columnRowDateCreated = 'cusCustomerRowDateCreated';
        this.columnRowDateUpdated = 'cusCustomerRowDateUpdated';
        this.columnRowDateDeleted = 'cusCustomerRowDateDeleted';
        //this.dbViewName = 'viewCustomerDto';
    }
};

class EmployeeDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'tblEmployee';
        this.rowId = 'empEmployeeId';
        this.foreignKey1 = 'empCountryId'
        this.foreignKey2 = 'empLocalityId';
        this.foreignKey3 = 'empPriceListId';
        this.foreignKey4 = 'empRegionId';
        this.regularColumns = 'empEmployeeDNI, empEmployeeEmail, empEmployeeFirstName, empEmployeeLastName, empEmployeeFullName, empEmployeeAddress, empEmployeePhone1';
        this.columnRowDateCreated = 'empEmployeeRowDateCreated';
        this.columnRowDateUpdated = 'empEmployeeRowDateUpdated';
        this.columnRowDateDeleted = 'empEmployeeRowDateDeleted';
        //this.dbViewName = 'viewEmployeeDto';
    }
};

class InventoryIndexCardDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'tblInventoryIndexCard';
        this.rowId = 'invInventoryIndexCardId';
        this.foreignKey1 = 'invProductId';
        this.foreignKey2 = 'invStatusId';
        this.regularColumns = 'invInventoryIndexCardPartNumber, invInventoryIndexCardName, invInventoryMinimumStock, invInventoryMaximumStock, invInventoryQuantityBalance, invInventoryMethod, invInventoryIndexCardCreationDate, invInventoryLastTransactionDate';
        this.columnRowDateCreated = 'invInventoryRowDateCreated';
        this.columnRowDateUpdated = 'invInventoryRowDateUpdated';
        this.columnRowDateDeleted = 'invInventoryRowDateDeleted';
        //this.dbViewName = 'viewInventoryDto';
    }
}

class InventoryIndexCardTransactionDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'tblInventoryIndexCardTransaction';
        this.rowId = 'invtInventoryTransactionId';
        this.foreignKey1 = 'invtInventoryIndexCardId';
        this.foreignKey2 = 'invtPurchaseOrderId';
        this.foreignKey3 = 'invtSaleOrderId';
        this.foreignKey4 = 'invtWarehouseSlotId';
        this.regularColumns = 'invtInventoryTransactionUnitQuantity, invtInventoryTransactionType, invtInventoryTransactionDescription';
        this.columnRowDateCreated = 'invtInventoryTransactionRowDateCreated';
        this.columnRowDateUpdated = 'invtInventoryTransactionRowDateUpdated';
        this.columnRowDateDeleted = 'invtInventoryTransactionRowDateDeleted';
        //this.dbViewName = 'viewInventoryTransactionDto';
    }
}

class PriceListDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'tblPriceList';
        this.rowId = 'plisPriceListId';
        this.foreignKey1 = 'plisCurrencyId';
        this.foreignKey2 = 'plisExchangeRateId';
        this.regularColumns = 'plisPriceListCode, plisPriceListName, plisPriceListMarkup, plisPriceListDollarLinked, plisPriceListModifiedDate';
        this.columnRowDateCreated = 'plisPriceListRowDateCreated';
        this.columnRowDateUpdated = 'plisPriceListRowDateUpdated';
        this.columnRowDateDeleted = 'plisPriceListRowDateDeleted';
        //this.dbViewName = 'viewPriceListDto';
    }
};

class ProductDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'tblProduct';
        this.rowId = 'prdProductId';
        this.foreignKey1 = 'prdCurrencyId';
        this.regularColumns = 'prdProductCode, prdProductName, prdProductDetail, prdProductBrand, prdProductModel, prdProductCategory, prdProductManufacturer, prdProductInitialUnitQuantity, prdProductQuantityPerUnit, prdProductUnitPurchasePrice';
        this.columnRowDateCreated = 'prdProductRowDateCreated';
        this.columnRowDateUpdated = 'prdProductRowDateUpdated';
        this.columnRowDateDeleted = 'prdProductRowDateDeleted';
        //this.dbViewName = 'viewProductDto';
    }
};

class PurchaseOrderDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'tblPurchaseOrder';
        this.rowId = 'puroPurchaseOrderId';
        this.foreignKey1 = 'puroSupplierId';
        this.regularColumns = 'puroPurchaseOrderDateRequested, puroPurchaseOrderDateReceived, puroPurchaseOrderTotalCost, puroPurchaseOrderTotalCost';
        this.columnRowDateCreated = 'puroPurchaseOrderRowDateCreated';
        this.columnRowDateUpdated = 'puroPurchaseOrderRowDateUpdated';
        this.columnRowDateDeleted = 'puroPurchaseOrderRowDateDeleted';
        //this.dbViewName = 'viewPurchaseOrderDto';
    }
};

class SaleOrderDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'tblSaleOrder';
        this.rowId = 'saloSaleOrderId';
        this.foreignKey1 = 'saloCurrencyId';
        this.foreignKey2 = 'saloCustomerId';
        this.foreignKey3 = 'saloEmployeeId';
        this.foreignKey4 = 'saloStatusId';
        this.foreignKey5 = 'saloPaymentMethodId';
        this.regularColumns = 'saloSaleOrderNumber, saloSaleOrderDate, saloSaleOrderAmountSubTotal, saloSaleOrderVATax, saloSaleOrderOtherTaxes, saloSaleOrderAmountTotal, saloSaleOrderConfirmationDate';
        this.columnRowDateCreated = 'saloSaleOrderRowDateCreated';
        this.columnRowDateUpdated = 'saloSaleOrderRowDateUpdated';
        this.columnRowDateDeleted = 'saloSaleOrderRowDateDeleted';
        //this.dbViewName = 'viewSaleOrderDto';
    }
};

class WarehouseDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'tblWarehouse';
        this.rowId = 'wrhWarehouseId';
        this.regularColumns = 'wrhWarehouseCode, wrhWarehouseName, wrhWarehouseDescription, wrhWarehouseAddress';
        this.columnRowDateCreated = 'wrhWarehouseRowDateCreated';
        this.columnRowDateUpdated = 'wrhWarehouseRowDateUpdated';
        this.columnRowDateDeleted = 'wrhWarehouseRowDateDeleted';
        //this.dbViewName = 'viewWarehouseDto';
    }
};

class WarehouseAreaDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'tblWarehouseArea';
        this.rowId = 'areaWarehouseAreaId';
        this.foreignKey1 = 'areaWarehouseId';
        this.regularColumns = 'areaWarehouseCode, areaWarehouseName, areaWarehouseDescription';
        this.columnRowDateCreated = 'areaWarehouseAreaRowDateCreated';
        this.columnRowDateUpdated = 'areaWarehouseAreaRowDateUpdated';
        this.columnRowDateDeleted = 'areaWarehouseAreaRowDateDeleted';
        //this.dbViewName = 'viewWarehouseAreaDto';
    }
};

class WarehouseSlotDAO extends SqliteDAO {
    constructor(){
        super();
        this.dbTableName = 'tblWarehouseSlot';
        this.rowId = 'slotWarehouseSlotId';
        this.foreignKey1 = 'slotWarehouseAreaId';
        this.regularColumns = 'slotWarehouseSlotCode, slotWarehouseSlotDescription, slotWarehouseSlotWidth, slotWarehouseSlotLength, slotWarehouseSlotHeigth';
        this.columnRowDateCreated = 'slotWarehouseSlotRowDateCreated';
        this.columnRowDateUpdated = 'slotWarehouseSlotRowDateUpdated';
        this.columnRowDateDeleted = 'slotWarehouseSlotRowDateDeleted';
        //this.dbViewName = 'viewWarehouseDto';
    }
};





/////////////////////
// Modules to export
/////////////////////

module.exports = {
    CheckingAccountDAO,
    CheckAccTransactionDAO,
    CustomerDAO,
    EmployeeDAO,
    ExchangeRateDAO,
    InventoryIndexCardDAO,
    InventoryIndexCardTransactionDAO,
    PriceListDAO,
    ProductDAO,
    PurchaseOrderDAO,
    SaleOrderDAO,
    WarehouseDAO,
    WarehouseAreaDAO,
    WarehouseSlotDAO,
    CurrencyDAO,
    LocalityDAO,
    PaymentMethodDAO,
    RegionDAO,
    StatusDAO,
    ProductPriceListDAO,
    ProductSaleOrderDAO,
};