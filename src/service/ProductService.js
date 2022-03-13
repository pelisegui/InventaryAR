import axios from 'axios';

export class ProductService {


    getProductsSmall() {
        return axios.get('assets/demo/data/products-small.json').then(res => res.data.data);
    }

    getProducts() {
        return axios.get('assets/demo/data/products.json').then(res => res.data.data);
    }

    getProductsWithOrdersSmall() {
        return axios.get('assets/demo/data/products-orders-small.json').then(res => res.data.data);
    }

    getProductList(listData) {
        //console.log('listData', listData);
        let channel= 'invokeMain';
        //let expresion = "actionCrud.productCRUD('1', data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'productCRUD.readProductData(data)';
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putProduct(newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.productCRUD('2', data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'productCRUD.createData(data)';
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateProduct(updateData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.productCRUD('3', data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'productCRUD.updateData(data)';
        return window.apiKy.invokeApi(channel, expresion, updateData);
    }

    deleteProduct(deleteData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.productCRUD('4', data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'productCRUD.deleteData(data)';
        return window.apiKy.invokeApi(channel, expresion, deleteData);
    }

    getProductFind(findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.productCRUD('5', data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'productCRUD.findData(data)';
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
}