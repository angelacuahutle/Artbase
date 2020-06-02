function deleteArtworkEvent(aid, eid){
  $.ajax({
      url: '/user-events/id/' + aid + '/event/' + eid,
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