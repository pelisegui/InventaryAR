
export class LoggerService {
    
  sendToLog (logData) {
      //console.log('logData', logData);
      let channel= 'electronLogger';
      return window.apiKy.sendApi(channel, logData);
  }

}