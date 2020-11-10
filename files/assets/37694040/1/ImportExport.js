var ImportExport = pc.createScript('importExport');

ImportExport.attributes.add('importTrigger', { type : 'string' });
ImportExport.attributes.add('exportTrigger', { type : 'string' });
ImportExport.attributes.add('filename', { type : 'string', default : 'Export.json' });

ImportExport.prototype.initialize = function() {
    this.app.on('ImportJSON:' + this.entity.name, this.onImportTrigger, this);
    this.app.on('ExportJSON:' + this.entity.name, this.onExportTrigger, this);
    
    //import test case
    /*
    var jsonString = '[{"sensivity": "100","invertMause": "true"}]';
    this.app.fire('ImportJSON:' + this.entity.name, jsonString);
    
    //export test case
    var jsonObject = [{"sensivity": "100","invertMause": "true"}];
    this.app.fire('ExportJSON:' + this.entity.name, jsonObject);
    */
};

ImportExport.prototype.onImportTrigger = function(data) {
    var parsedData = JSON.parse(data);

    if(parsedData){
        if(this.importTrigger){
            Utils.triggerParser(this.importTrigger, parsedData);   
        }else{
            console.error('Import trigger must be defined');
        }
    }
};

ImportExport.prototype.prepareDownload = function(string, filename) {
    var link = document.createElement("a");
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(string));
        link.setAttribute('download', filename);
    
    //click link
    document.body.appendChild(link);
    
    link.click();
    link.remove();
};

ImportExport.prototype.onExportTrigger = function(data) {
    var stringified = JSON.stringify(data);
    
    if(stringified){
        this.prepareDownload(stringified, this.filename);
        
        //if export trigger defined
        if(this.exportTrigger){
            Utils.triggerParser(this.exportTrigger, stringified);   
        }
    }
};