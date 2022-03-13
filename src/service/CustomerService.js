import axios from 'axios'

export class CustomerService {
    getCustomersSmall() {
        return axios.get('assets/demo/data/customers-small.json')
            .then(res => res.data.data);
    }

    getCustomersMedium() {
        return axios.get('assets/demo/data/customers-medium.json')
            .then(res => res.data.data);
    }

    getCustomersLarge() {
        return axios.get('assets/demo/data/customers-large.json')
                .then(res => res.data.data);
    }

    getCustomerList(listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.customerCRUD('1', data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "customerCRUD.readCustomerData(data)";
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putCustomer(newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.customerCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "customerCRUD.createData(data)";
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateCustomer(updatedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.customerCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "customerCRUD.updateData(data)";
        return window.apiKy.invokeApi(channel, expresion, updatedData);
    }

    deleteCustomer(deletedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.customerCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "customerCRUD.deleteData(data)";
        return window.apiKy.invokeApi(channel, expresion, deletedData);
    }

    getCustomerFind(findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.customerCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "customerCRUD.findData(data)";
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
}
