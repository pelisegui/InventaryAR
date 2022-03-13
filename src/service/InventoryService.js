
export class InventoryIndexCardService {

    getInventoryIndexCardList (listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.inventoryIndexCardCRUD('1', data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'inventoryIndexCardCRUD.readInventoryIndexCardData(data)';
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putInventoryIndexCard (newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.inventoryIndexCardCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'inventoryIndexCardCRUD.createData(data)';        
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateInventoryIndexCard (updatedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.inventoryIndexCardCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'inventoryIndexCardCRUD.updateData(data)';   
        return window.apiKy.invokeApi(channel, expresion, updatedData);
    }

    deleteInventoryIndexCard (deletedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.inventoryIndexCardCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'inventoryIndexCardCRUD.deleteData(data)';   
        return window.apiKy.invokeApi(channel, expresion, deletedData);
    }

    
    findInventoryIndexCard (findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.inventoryIndexCardCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'inventoryIndexCardCRUD.findData(data)'; 
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
    
}

export class InventoryIndexCardTransactionService {

    getInventoryIndexCardTransactionList (listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.inventoryIndexCardTransactionCRUD('1', data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "inventoryIndexCardTransactionCRUD.readInventoryIndexCardTransactionData(data)";      
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putInventoryIndexCardTransaction (newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.inventoryIndexCardTransactionCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "inventoryIndexCardTransactionCRUD.createData(data)";      
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateInventoryIndexCardTransaction (updatedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.inventoryIndexCardTransactionCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "inventoryIndexCardTransactionCRUD.updateData(data)";      
        return window.apiKy.invokeApi(channel, expresion, updatedData);
    }

    deleteInventoryIndexCardTransaction (deletedData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.inventoryIndexCardTransactionCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "inventoryIndexCardTransactionCRUD.deleteData(data)";      
        return window.apiKy.invokeApi(channel, expresion, deletedData);
    }
    
    findInventoryIndexCardTransactionList (findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.inventoryIndexCardTransactionCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = "inventoryIndexCardTransactionCRUD.findData(data)";      
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
    
}
