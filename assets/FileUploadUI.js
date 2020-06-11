function FileUploadUI(progressDialog) {
    var uploadDiv = $("<div class='upload_div'>");
    var imgDiv = $("<div class='upload_img_div'>");
    var img = $("<img class='upload_img'>");
    var imgBr = $("<br style='clear: both;'>");
    var contentDiv = $("<div class='upload_content'>");
    var title = $("<div class='upload_title'>");
    var pb = $("<div>");
    var progressLabel = $("<div class='upload_progress_label'>");
    var contentBr = $("<br style='clear: both;'>");
    var upload = $("<button class='upload_button'>Upload...</button>");
    var cancel = $("<button class='upload_button'>Cancel</button>");
    var close = $("<button class='upload_button'>Close</button>");
    var handler;

    this.setHandler = function(value) {
        handler = value;
        progressDialog.addHandler(handler)
    }
    
     this.setTitle = function(value) {
        title.append(value);
    }
    
    this.setImage = function(src) {
        img.attr("src", src);
    }
    
    this.setProgress = function(progress) {
        pb.progressbar({value: progress});
    }
    
    this.statusChanged = function(){
        progressDialog.updateStatus();
    }

    this.setProgressLabel = function(label) {
        progressLabel.text(label);
    }
    
    this.setProgressTip = function(tip) {
        progressLabel.attr("title", tip);
    }
    this.cancel = function() {
        close.show();
        upload.hide();
        cancel.hide();
        
    }

    this.upload = function() {
        close.show();
        upload.hide();
        cancel.hide();
    }
    this.addStatus = function() {

        imgDiv.append(img, imgBr);
        pb.append(progressLabel);
        contentDiv.append(title, pb, cancel, upload, close);
        uploadDiv.append(imgDiv, contentDiv);
        
        pb.progressbar({value: 0});
        upload.button().click(function() {
            handler.upload();
        });
        cancel.button().click(function() {
            handler.cancel();
        });;
        close.button().click(function() {
            progressDialog.removeStatus(uploadDiv);
        }).hide();
       
        progressDialog.addStatus(uploadDiv);
    }
} 