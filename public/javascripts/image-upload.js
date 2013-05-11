function selectChange() {
	var file = document.getElementById("fileupload").files[0];
	 var filter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
    if (! filter.test(file.type)) {
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
    	viewImage(e.target.result);
    	viewImage128(e.target.result);
    	viewImage64(e.target.result);
    };
	reader.readAsDataURL(file);
}

function viewImage(imgPath) {
	var canvas = document.getElementById("view-image");
	var context = canvas.getContext("2d");
		
	var image = new Image();
	image.src = imgPath;
	image.onload = function() {
		context.drawImage(image, 0, 0, canvas.width, canvas.height);
	};
}

function viewImage128(imgPath) {
	var canvas = document.getElementById("view-image-128");
	var context = canvas.getContext("2d");
		
	var image = new Image();
	image.src = imgPath;
	image.onload = function() {
		context.drawImage(image, 0, 0, 128, 128);
	};
}

function viewImage64(imgPath) {
	var canvas = document.getElementById("view-image-64");
	var context = canvas.getContext("2d");
		
	var image = new Image();
	image.src = imgPath;
	image.onload = function() {
		context.drawImage(image, 0, 0, 64, 64);
		canvas.toDataUrl()
	};
}