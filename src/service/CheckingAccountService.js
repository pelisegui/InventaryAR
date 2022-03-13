
export class CheckingAccountService {

    getCheckingAccountList (listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.checkingAccountCRUD('1',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "checkingAccountCRUD.readCheckingAccountData(data)";
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putCheckingAccount (newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.checkingAccountCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "checkingAccountCRUD.createData(data)";
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateCheckingAccount (updatedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.checkingAccountCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "checkingAccountCRUD.updateData(data)";
        return window.apiKy.invokeApi(channel, expresion, updatedData);
    }

    deleteCheckingAccount (deletedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.checkingAccountCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "checkingAccountCRUD.deleteData(data)";
        return window.apiKy.invokeApi(channel, expresion, deletedData);
    }

    
    findCheckingAccount (findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.checkingAccountCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "checkingAccountCRUD.findData(data)";
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
    
}

export class CheckAccTransactionService {

    getCheckAccTransactionList (listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.checkAccTransactionCRUD('1', data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "checkAccTransactionCRUD.readCheckAccTransactionData(data)";
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putCheckAccTransaction (newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.checkAccTransactionCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "checkAccTransactionCRUD.createData(data)";
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateCheckAccTransaction (updatedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.checkAccTransactionCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "checkAccTransactionCRUD.updateData(data)";
        return window.apiKy.invokeApi(channel, expresion, updatedData);
    }

    deleteCheckAccTransaction (deletedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.checkAccTransactionCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "checkAccTransactionCRUD.deleteData(data)";
        return window.apiKy.invokeApi(channel, expresion, deletedData);
    }
    
    findCheckAccTransactionList (findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.checkAccTransactionCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "checkAccTransactionCRUD.findData(data)";
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
    
}
