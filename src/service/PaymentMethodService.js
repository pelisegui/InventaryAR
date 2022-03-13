
export class PaymentMethodService {

    getPaymentMethodList(listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.paymentMethodCRUD('1',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "paymentMethodCRUD.readData(data)";
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putPaymentMethod(newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.paymentMethodCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "paymentMethodCRUD.createData(data)";
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updatePaymentMethod(updateData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.paymentMethodCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "paymentMethodCRUD.updateData(data)";
        return window.apiKy.invokeApi(channel, expresion, updateData);
    }

    deletePaymentMethod(deleteData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.paymentMethodCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "paymentMethodCRUD.deleteData(data)";
        return window.apiKy.invokeApi(channel, expresion, deleteData);
    }

    findPaymentMethod(findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.paymentMethodCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "paymentMethodCRUD.findData(data)";
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
};