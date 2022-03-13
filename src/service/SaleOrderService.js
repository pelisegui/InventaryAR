
export class SaleOrderService {

    getSaleOrderList(listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.saleOrderCRUD('1',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'saleOrderCRUD.readSaleOrderData(data)';
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putSaleOrder(newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.saleOrderCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'saleOrderCRUD.createData(data)';        
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateSaleOrder(updateData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.saleOrderCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'saleOrderCRUD.updateData(data)';        
        return window.apiKy.invokeApi(channel, expresion, updateData);
    }

    deleteSaleOrder(deleteData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.saleOrderCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'saleOrderCRUD.deleteData(data)';
        return window.apiKy.invokeApi(channel, expresion, deleteData);
    }

    findSaleOrder(findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.saleOrderCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'saleOrderCRUD.findData(data)';
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
};

export class ProductSaleOrderService {

    constructor() {
        this.chanel = null;
    };

    getProductSaleOrderList(listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.productSaleOrderCRUD('1',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'productSaleOrderCRUD.readProductSalOrderData(data)';
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putProductSaleOrder(newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.productSaleOrderCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'productSaleOrderCRUD.createData(data)';
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateProductSaleOrder(updatedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.productSaleOrderCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'productSaleOrderCRUD.updateData(data)';
        return window.apiKy.invokeApi(channel, expresion, updatedData);
    }

    deleteProductSaleOrder(deletedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.productSaleOrderCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'productSaleOrderCRUD.deleteData(data)';
        return window.apiKy.invokeApi(channel, expresion, deletedData);
    }

    findProductSaleOrder(findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.productSaleOrderCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'productSaleOrderCRUD.findData(data)';
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
};