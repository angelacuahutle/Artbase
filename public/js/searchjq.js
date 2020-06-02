function searchInput() {
    //get the first name 
    var searchTag  = document.getElementById('searchTag').value
    //construct the URL and redirect to it
    window.location = '/search/' + encodeURI(searchTag)
}
