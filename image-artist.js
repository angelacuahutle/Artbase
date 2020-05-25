module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getEvents(res, mysql, context, complete){
    	mysql.pool.query("SELECT name FROM Events ORDER BY name ASC", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Events = results; 
            complete();
        });
    }

    /*Display all events in dropdown */

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        
        var mysql = req.app.get('mysql');
        getEvents(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log(context);
                res.render('image-artist', context);
            }

        }
    });

    return router;
}();
 