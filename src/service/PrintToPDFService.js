

export class PrintToPDFService {
    
    sendPrintRequest (printData) {
        console.log('printData', printData);
        let channel= 'printToPDF';
        return window.apiKy.invokeApi(channel, printData);
    }

}