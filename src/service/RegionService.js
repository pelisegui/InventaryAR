//import axios from 'axios'

export class RegionService {

    getRegionList(listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.regionCRUD('1', data)"; //1:list, 2:create, 3:update, 4:delete
        let expresion = 'regionCRUD.readData(data)';
        return window.apiKy.invokeApi(channel, expresion, listData);
    }
}