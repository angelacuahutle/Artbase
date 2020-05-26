module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var bodyParser = require('body-parser');
    var urlencodedParser = bodyParser.urlencoded({extended: false});

    function getUser(res, mysql, context, complete){
        mysql.pool.query("SELECT username FROM Users WHERE userID=1", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.user = results[0];
            complete();
        });
    }

    function getUserEvents(res, mysql, context, complete){
    	mysql.pool.query("SELECT e.name, DATE_FORMAT(e.startDate, '%a %b %e %Y') AS startDate, DATE_FORMAT(e.endDate, '%a %b %e %Y') AS endDate, e.time, e.location, e.city, e.state, e.zipCode "
        + "FROM Events e " 
        + "RIGHT JOIN Users_Events ue ON ue.eventID = e.eventID "
        + "RIGHT JOIN Users u ON u.userID = ue.userID "
        + "WHERE u.userID = 1 "
        + "ORDER BY date(startDate) ASC;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.userEvents = results; 
            complete();
        });
    }


    /* Display a user's events */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = [];
        var mysql = req.app.get('mysql');
        getUser(res, mysql, context, complete);
        getUserEvents(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('user-events', context);
            }

        }
    });

   
    return router;
}();
