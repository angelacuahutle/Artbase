function updateEvent(id){
    $.ajax({
        url: '/events/' + id,
        type: 'PUT',
        data: $('#update-event').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
};

