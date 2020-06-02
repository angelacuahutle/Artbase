function deleteUserEvent(uid, eid){
  $.ajax({
      url: '/user-events/id/' + uid + '/event/' + eid,
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