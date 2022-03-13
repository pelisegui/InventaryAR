
export class PriceListService {

    getPriceList(listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.priceListCRUD('1',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'priceListCRUD.readPriceListData(data)';
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putPriceList(newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.priceListCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'priceListCRUD.createData(data)';
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updatePriceList(updateData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.priceListCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'priceListCRUD.updateData(data)';
        return window.apiKy.invokeApi(channel, expresion, updateData);
    }

    deletePriceList(deleteData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.priceListCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'priceListCRUD.deleteData(data)';
        return window.apiKy.invokeApi(channel, expresion, deleteData);
    }

    findPriceList(findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.priceListCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'priceListCRUD.findData(data)';
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
};

export class ProductPriceListService {

    getProductPriceList(listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.productPriceListCRUD('1',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'productPriceListCRUD.readProductPriceListData(data)';
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putProductPriceList(newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.productPriceListCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'productPriceListCRUD.createData(data)';
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateProductPriceList(updatedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.productPriceListCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'productPriceListCRUD.updateData(data)';
        return window.apiKy.invokeApi(channel, expresion, updatedData);
    }

    deleteProductPriceList(deletedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.productPriceListCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'productPriceListCRUD.deleteData(data)';
        return window.apiKy.invokeApi(channel, expresion, deletedData);
    }

    findProductPriceList(findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.productPriceListCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'productPriceListCRUD.findData(data)';
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
};