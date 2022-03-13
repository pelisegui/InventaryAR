
export class ExchangeRateService {

    getExchangeRateList(listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.exchangeRateCRUD('1', data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "exchangeRateCRUD.readData(data)";
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putExchangeRate(newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.exchangeRateCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "exchangeRateCRUD.createData(data)";
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateExchangeRate(updateData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.exchangeRateCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "exchangeRateCRUD.updateData(data)";
        return window.apiKy.invokeApi(channel, expresion, updateData);
    }

    deleteExchangeRate(deleteData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.exchangeRateCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "exchangeRateCRUD.deleteData(data)";
        return window.apiKy.invokeApi(channel, expresion, deleteData);
    }

    getExchangeRateFind(findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.exchangeRateCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "exchangeRateCRUD.findData(data)";
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
}
