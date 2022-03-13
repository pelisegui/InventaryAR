/* -- Database object configuration -- */
/* sqlite3 Opening modes
    sqlite3.OPEN_READONLY: open the database for read-only.
    sqlite3.OPEN_READWRITE : open the database for reading and writting.
    sqlite3.OPEN_CREATE: open the database, if the database does not exist, create a new database.
*/

const sqlite3 = require('sqlite3');
//const sqlite3 = require('sqlite3').verbose(); // verbose = long stack traces, for development only

class DbConnection {

    constructor(path) {

        let _driver = ''; // e.g. "COM.cloudscape.core.RmiJdbcDriver";
        let _dbFilePath = path || null; //private
        let _mode = ''; //private
        let _url = ''; // e.g. "jdbc:cloudscape:rmi://localhost:1099/CoreJ2EEDB";
        let _user = ''; //private
        let _userPsw = ''; //private
        let _db = {}; //private

        // Getters & Setters
        this.getDriver = function() {return _driver};
        this.setDriver = function(driver) {_driver = driver;}
        this.getDbFilePath = function() {return _dbFilePath};
        this.setDbFilePath = function(path) {_dbFilePath = path;}
        this.getMode = function() {return _mode};
        this.setMode = function(mode) {_mode = mode;}
        this.getUser = function() {return _user};
        this.setUser = function(user) {_user = user;}
        this.getUserPsw = function() {return _userPsw};
        this.setUserPsw = function(userPsw) {_userPsw = userPsw;}
        this.getDb = function() {return _db};
        this.setDb = function(db) {_db = db};

        //Singelton Pattern (return always the same instance)
        if ( typeof DbConnection.instance === 'object') {
            return DbConnection.instance;
        }
        DbConnection.instance = this;
        return this;
        
    }

    // Methods
    openSqliteDb(mode) {
        this.setMode(mode);
        let db = new sqlite3.Database(this.getDbFilePath(),this.getMode(), (err) => {
            if (err) {
                console.log('DB Connection OPEN_FAILED ', '\n', err);
                return err;
            }
        });
        this.setDb(db);
        //console.log('DB Connection ',this.getMode(), '\n',);
        return this.getDb();     
    };

    closeSqliteDb() {
        this.getDb().close((err) => {
            if (err) {
                console.log ('DB connection CLOSE_ERROR ', '\n', err, '\n',)
                return err;
            }
        });
        //console.log('DB connection CLOSED', '\n',);
        //mainWindow.webContents.send("logMain", 'Close the database connection.');            
    };
}

module.exports = DbConnection;