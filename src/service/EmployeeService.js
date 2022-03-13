
export class EmployeeService {

    getEmployeeList(listData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.employeeCRUD('1', data)"; //1:list, 2:create, 3:update, 4:delete
        let expresion = 'employeeCRUD.readEmployeeData(data)';
        return window.apiKy.invokeApi(channel, expresion, listData);
    }

    putEmployee(newData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.employeeCRUD('2',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'employeeCRUD.createData(data)';
        return window.apiKy.invokeApi(channel, expresion, newData);
    }

    updateEmployee(updateData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.employeeCRUD('3',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'employeeCRUD.updateData(data)';
        return window.apiKy.invokeApi(channel, expresion, updateData);
    }

    deleteEmployee(deleteData){
        let channel= 'invokeMain';
        //let expresion = "actionCrud.employeeCRUD('4',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'employeeCRUD.deleteData(data)';
        return window.apiKy.invokeApi(channel, expresion, deleteData);
    }

    getEmployeeFind(findData) {
        let channel= 'invokeMain';
        //let expresion = "actionCrud.employeeCRUD('5',data)"; //1:list, 2:find, 3:create, 4:update, 5:delete
        let expresion = 'employeeCRUD.findData(data)';
        return window.apiKy.invokeApi(channel, expresion, findData);
    }
}