
const SqliteDAOFactory = require ('./SqliteDAOFactory');

// DAO Factory
class DAOFactory {
    
    constructor() {
        // List of DAO types supported by the factory
        this._SQLITE = '1';
        //this.XML = '2';
        this._newFactory = null;
        // Getters & Setters
        //this.getSQLITE = function () { return _SQLITE };
        //this.setSQLITE = function (sqlite) { _SQLITE = sqlite };
    };

    // Methods
    newDAOFactory (whichFactory) {
        switch (whichFactory) {
            case this._SQLITE:
                this._newFactory = new SqliteDAOFactory();
                break;
            //case this.XML:
            //    this.newFactory = new XmlDAOFactory();
            //    break;
            default:
                this._newFactory = null;
                break;
        };
        return this._newFactory;
    };
};
module.exports = DAOFactory;