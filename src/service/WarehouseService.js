
export class WarehouseService {

    getWarehouseList (listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.warehouseCRUD('1', data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'warehouseCRUD.readData(data)';
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putWarehouse (newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.warehouseCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'warehouseCRUD.createData(data)';
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateWarehouse (updatedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.warehouseCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'warehouseCRUD.updateData(data)';
        return window.apiKy.invokeApi(channel, expresion, updatedData);
    }

    deleteWarehouse (deletedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.warehouseCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'warehouseCRUD.deleteData(data)';
        return window.apiKy.invokeApi(channel, expresion, deletedData);
    }
    
    findWarehouse (findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.warehouseCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'warehouseCRUD.findData(data)';
        return window.apiKy.invokeApi(channel, expresion, findData);
    }  
};

export class WarehouseAreaService {

    getWarehouseAreaList (listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.warehouseAreaCRUD('1', data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'warehouseAreaCRUD.readData(data)';
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putWarehouseArea (newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.warehouseAreaCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'warehouseAreaCRUD.createData(data)';
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateWarehouseArea (updatedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.warehouseAreaCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'warehouseAreaCRUD.updateData(data)';
        return window.apiKy.invokeApi(channel, expresion, updatedData);
    }

    deleteWarehouseArea (deletedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.warehouseAreaCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'warehouseAreaCRUD.deleteData(data)';
        return window.apiKy.invokeApi(channel, expresion, deletedData);
    }
    
    findWarehouseAreaList (findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.warehouseAreaCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'warehouseAreaCRUD.findData(data)';
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
};

export class WarehouseSlotService {

    getWarehouseSlotList (listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.warehouseSlotCRUD(data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'warehouseSlotCRUD.readData(data)';
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putWarehouseSlot (newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.warehouseSlotCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'warehouseSlotCRUD.createData(data)';
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateWarehouseSlot (updatedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.warehouseSlotCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'warehouseSlotCRUD.updateData(data)';
        return window.apiKy.invokeApi(channel, expresion, updatedData);
    }

    deleteWarehouseSlot (deletedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.warehouseSlotCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'warehouseSlotCRUD.deleteData(data)';
        return window.apiKy.invokeApi(channel, expresion, deletedData);
    }
    
    findWarehouseSlotList (findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.warehouseSlotCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'warehouseSlotCRUD.findData(data)';
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
};
