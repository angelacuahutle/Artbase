function deleteArtworkEvent(aid, eid){
  $.ajax({
      url: '/image-artist/artw/' + aid + '/event/' + eid,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};