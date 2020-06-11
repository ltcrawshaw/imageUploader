function ProgressDialog(imageUI) {
    var uploadDialog = $("#upload_dialog");
    var uploadAll = $("<button class='upload_button'>Upload All Files...</button>");
    var cancelAll = $("<button class='upload_button'>Cancel All Files...</button>");
    var closeProgress = $("<button class='upload_button'>Close Progress Dialog...</button>");
    var uploadStatus = $("<div id='upload_status'></div>");
    var dropHandlers = [];

    this.addStatus = function (status) {
        uploadStatus.append(status);
        uploadDialog.dialog({
            position: {my: "center", at: "center", of: window }
        });
        this.updateStatus();
    }
    
    this.removeStatus = function (status) {
        status.remove();
        uploadDialog.dialog({
            position: {my: "center", at: "center", of: window }
        });
        this.updateStatus();
    }
    
    this.addHandler = function(handler) {
        dropHandlers.push(handler);
        this.updateStatus();
    }
    
    this.updateStatus = function() {
        var pending = 0;
        var succeeded = 0;

        dropHandlers.forEach(function(handler){
            console.log("Name:" + handler.getName() + ", Status: " + handler.getStatus());
            if(handler.getStatus() == FileUploadHandler.Status.PENDING){
                pending++;
            } else if(handler.getStatus() == FileUploadHandler.Status.SUCCEEDED) {
                succeeded++;
            }
        });
        if(pending > 0){
           uploadAll.show(); 
           cancelAll.show(); 
           closeProgress.hide();
        } else {
            uploadAll.hide(); 
            cancelAll.hide(); 
            closeProgress.show();
        }
    }
    
    function init() {
        uploadDialog.dialog({
            autoOpen: false,
            dialogClass: "no-close",
            modal: true,
            width: 600
        });
        
        this.show = function() {
            uploadDialog.dialog("open");
        
        }
        this.hide = function() {
            uploadDialog.dialog("close");
        }
        
        uploadAll.button().click(function() {
            dropHandlers.forEach(function(handler) {
                if(handler.getStatus() == FileUploadHandler.Status.PENDING){
                    handler.upload();
                }
            });
        }).hide();
        cancelAll.button().click(function() {
            dropHandlers.forEach(function(handler) {
                if(handler.getStatus() == FileUploadHandler.Status.PENDING){
                    handler.cancel();
                }
            });  
        }).hide();
        closeProgress.button().click(function(){
           this.hide();
           dropHandlers = [];
           uploadStatus.empty();
           imageUI.fetchImages();
       }.bind(this));
       
       uploadDialog.append(uploadStatus);
       uploadDialog.append(cancelAll, uploadAll, closeProgress);
    
     }
    init.call(this);
}