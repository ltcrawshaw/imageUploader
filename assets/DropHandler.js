function DropHandler(target, progressDialog) {
    var dragCount = 0;

    function handleUpload(file) {
        var ui = new FileUploadUI(progressDialog);
        var  handler = new FileUploadHandler(file, ui);
        
        ui.addStatus();
        if(file.type.indexOf("image") == -1) {
            ui.cancel().hide();
        }
        console.log("Name: " + file.name + ", Type:" + file.type + ", Size: " + file.size + ", Last Modified: " + file.lastModifiedDate);
    }
    
    function init() {
        target.on("dragover", function(event) {
            event.stopPropagation();
            event.preventDefault();
        });
        target.on("dragenter", function(event) {
            event.stopPropagation();
            event.preventDefault();
            dragCount++;
            if(dragCount ==1); {
                progressDialog.show();
            }
        });
        target.on("dragleave", function(event ) {
            event.stopPropagation();
            event.preventDefault();
            dragCount--;
            if(dragCount == 0) {
                progressDialog.hide();
            }
        });
        target.on("drop", function(event) {
            var files = event.originalEvent.dataTransfer.files;
            var i;

            event.stopPropagation();
            event.preventDefault();
            dragCount = 0;
            for(i = 0; i < files.length; i ++) {
                handleUpload(files[i]);
            }
        });
    }  
    init();
}