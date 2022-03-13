//import axios from 'axios'

export class LocalityService {

    getLocalityList(listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.localityCRUD('1', data)"; //1:list, 2:create, 3:update, 4:delete
        let expresion = "localityCRUD.readData(data)";
        return window.apiKy.invokeApi(channel, expresion, listData);
    }
}