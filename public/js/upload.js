/*---------------DOM declarations---------------*/
var title = document.getElementById('title-input');
var medium = document.getElementById('medium-input');
var materials = document.getElementById('materials-input');
var description = document.getElementById('desc-input');
var url = document.getElementById('url-input');
var image = document.getElementById('file-input');
var postArtworkButton = document.getElementById('upload-submit');
var artwork = document.getElementById('artwork');

var loadFile = function(event) {
    image.src = URL.createObjectURL(event.target.files[0]);
};

function submitParamCheck() {
    if (title.value=="" || medium.value=="" || materials.value=="" || description.value=="" || (url.value=="" && image.src=="")) {
        return false;
    }
    //If URL is given, replace any potential uploaded image with given URL to prevent image conflict
    if (url.value!="") {
        image.src = url.value;
    }

    return true;
};

postArtworkButton.addEventListener('click', function(event) {
    if(submitParamCheck()) {
        var postRequest = new XMLHttpRequest();
        var requestURL = '/upload';
        postRequest.open('POST', requestURL);
        var requestBody = JSON.stringify({
            title: title.value,
            medium: medium.value,
            materials: materials.value,
            description: description.value,
            url: image.src
        });
        postRequest.setRequestHeader('Content-type', 'application/json');
        postRequest.addEventListener('load', function(e){});
        postRequest.send(requestBody);
        console.log('sent to fakeArtdb');
    }
    else {
        window.alert("All entries must be filled!");
    }
});