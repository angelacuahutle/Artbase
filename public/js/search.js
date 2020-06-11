function searchInput() {
    var searchTag  = document.getElementById('searchTag').value
    window.location = '/search/' + encodeURI(searchTag)
}
