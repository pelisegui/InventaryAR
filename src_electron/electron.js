const { app, BrowserWindow, ipcMain, dialog, session } = require('electron'); //Added ipcMain to communicate with Renderer Process
//const mainLogger = require('./mainLogger.js')
const electronLogger = require('electron-log');
electronLogger.transports.file.resolvePath = () => __dirname + "/electronLog.log";

//const { autoUpdater } = require('update-electron-app');
class AppUpdater {
  constructor() {
    electronLogger.transports.file.level = 'info';
    autoUpdater.logger = electronLog;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const path = require('path');
const fs = require('fs');
const os = require('os');

let mainWindow = null;

function createWindow () {
    mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      worldSafeExecuteJavaScript:true,
      enableRemoteModule: false,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      
    }
  })

  try{
    let htmlPath = path.join(__dirname, '../build/index.html');

    if (fs.existsSync(htmlPath)) {
      console.trace(htmlPath, 'exist', '\n');

      //Need to run npm build scirpt before to use this
      mainWindow.loadFile (htmlPath);
      //mainWindow.webContents.openDevTools();
    } else {
      console.trace(htmlPath, ' does not exist', '\n');

      //Runs without need of building with react-script-build. Delete "./build directory" before use it
      mainWindow.loadURL('http://localhost:3000');
      mainWindow.webContents.openDevTools();
    }
  }catch (error) {
    console.trace('fs.existsSync: ', error, '\n');  
  };

  mainWindow.setMenu(null);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);



//System Notification example (tested in linux, works!)
/*
if (Notification.isSupported()) {
  let notif = new Notification({
    title: 'DB Connection',
    body: arg
  });
  notif.show();
};
*/

//CRUD

const ActionCRUDFactory = require("./ActionCRUDFactory");
let actionCRUD = new ActionCRUDFactory(); //Will be used by "return eval(expresion);"

// Following are needed because are used inside eval expresion
let checkingAccountCRUD = actionCRUD.newCheckingAccountCRUD();
let checkAccTransactionCRUD = actionCRUD.newCheckAccTransactionCRUD();
let customerCRUD = actionCRUD.newCustomerCRUD();
let employeeCRUD = actionCRUD.newEmployeeCRUD();
let inventoryIndexCardCRUD = actionCRUD.newInventoryIndexCardCRUD();
let inventoryIndexCardTransactionCRUD = actionCRUD.newInventoryIndexCardTransactionCRUD();
let priceListCRUD = actionCRUD.newPriceListCRUD();
let productCRUD = actionCRUD.newProductCRUD();
let saleOrderCRUD = actionCRUD.newSaleOrderCRUD();
let currencyCRUD = actionCRUD.newCurrencyCRUD();
let exchangeRateCRUD = actionCRUD.newExchangeRateCRUD();
let localityCRUD = actionCRUD.newLocalityCRUD();
let paymentMethodCRUD = actionCRUD.newPaymentMethodCRUD();
let regionCRUD = actionCRUD.newRegionCRUD();
let statusCRUD = actionCRUD.newStatusCRUD();
let productPriceListCRUD = actionCRUD.newProductPriceListCRUD();
let productSaleOrderCRUD = actionCRUD.newProductSaleOrderCRUD(); //Will be used by "return eval(expresion);"

let channel = '';

//IPC invokeMain
channel= 'invokeMain';
ipcMain.handle ( channel, (event, ...arg) => {  // first, ipcMain gets a REST parameter: (channel, expresion, data)
  let expresion = arg.shift(); // second, gets expresion in the form: actionCrud.functionName('mode',data);
  let data = arg.shift(); // third, gets data that will be used inside expresion
  console.trace('expresion: ', expresion, '\n')
  console.trace('invokeMain data: ', data, '\n');
  return eval(expresion); // expresion gets evaluated. Final instruction will looks like: eval(actionCrud[functionName](mode,data));
});

//IPC Logger
channel= 'electronLogger'
ipcMain.addListener (channel, (...arg) => {
  electronLogger.log ('# IPC Logger #')
  let log = arg.pop(); // Removes the last element from an array and returns that element.
  electronLogger.log (log)

});

//IPC prinToPDF
channel= 'printToPDF';
ipcMain.handle ( channel, (event, ...arg) => {
  
  console.trace('channel: ', channel, '\n', 'event: ', event,'\n');

  const contents = mainWindow.webContents

  //var filepath1 = path.join(__dirname, '../assets/print1.pdf'); 
  const pdfPath = path.join(os.homedir(), 'Desktop', 'elctronPDF.pdf')
  console.trace('pdfPath; ', pdfPath);

  const options = {
      landscape: false,
      marginsType: 1,             // marginsType: Integer (Optional),  0 – Default Margins, 1 – No Margins, 2 – Minimum Margins
      pageSize: 'A4',             // pageSize: Object/String (Optional), page size of the generated PDF files. Values: A3, A4, A5, Legal, Letter, Tabloid. It can also hold an Object {height: 0, width:0} defined in microns.
      printBackground: false,     // printBackground: Boolean (Optional)
      printSelectionOnly: false,  // printSelectionOnly: Boolean (Optional) Whether to print Selections or Highlights only 
      scaleFactor: 60
  }

  mainWindow.webContents.printToPDF (options).then (data => {    
    fs.writeFile(pdfPath, data, (error) => {      
      if (error) throw error      
      console.trace(`Wrote PDF successfully to ${pdfPath}`)
      return  pdfPath
    })  }).catch(error => {    
      console.trace(`Failed to write PDF to ${pdfPath}: `, error)
      return  pdfPath
  })

});


app.on ('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on ('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})