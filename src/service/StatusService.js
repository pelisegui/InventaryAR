//import axios from 'axios'

export class StatusService {

    getStatusList(listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.statusCRUD('1')"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "statusCRUD.readStatusData(data)";
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putStatus(newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.statusCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "statusCRUD.createData(data)";
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateStatus(updatedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.statusCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "statusCRUD.updateData(data)";
        return window.apiKy.invokeApi(channel, expresion, updatedData);
    }

    deleteStatus(deletedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.statusCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "statusCRUD.deleteData(data)";
        return window.apiKy.invokeApi(channel, expresion, deletedData);
    }

    getStatusFind(findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.statusCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "statusCRUD.findData(data)";        
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
}
