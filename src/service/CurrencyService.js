
export class CurrencyService {

    getCurrencyList(listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.currencyCRUD('1', data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "currencyCRUD.readData(data)";
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putCurrency(newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.currencyCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "currencyCRUD.createData(data)";
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateCurrency(updateData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.currencyCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "currencyCRUD.updateData(data)";
        return window.apiKy.invokeApi(channel, expresion, updateData);
    }

    deleteCurrency(deleteData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.currencyCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "currencyCRUD.deleteData(data)";
        return window.apiKy.invokeApi(channel, expresion, deleteData);
    }

    getCurrencyFind(findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.currencyCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "currencyCRUD.findData(data)";
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
}
