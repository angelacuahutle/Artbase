module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var bodyParser = require('body-parser');
    var urlencodedParser = bodyParser.urlencoded({extended: false});

    function getUser(res, mysql, id, context, complete){
        var sql = "SELECT username FROM Users WHERE userID=?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.user = results[0];
            complete();
        });
    }

    function getUserEvents(res, mysql, id, context, complete){
        var sql = "SELECT e.name, DATE_FORMAT(e.startDate, '%a %b %e %Y') AS startDate, DATE_FORMAT(e.endDate, '%a %b %e %Y') AS endDate, e.time, e.location, e.city, e.state, e.zipCode "
        + "FROM Events e " 
        + "RIGHT JOIN Users_Events ue ON ue.eventID = e.eventID "
        + "RIGHT JOIN Users u ON u.userID = ue.userID "
        + "WHERE u.userID = ? "
        + "ORDER BY date(startDate) ASC;";
        var inserts = [id];
    	mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.userEvents = results; 
            console.log(context.userEvents);
            complete();
        });
    }


    /* Display a user's events */

    router.get('/:id', function(req, res){
        if (req.session.isUser == true) {
            callbackCount = 0;
            var context = {};
            context.jsscripts = [];
            var id = req.session.sessInfo.userID;
            var mysql = req.app.get('mysql');
            getUser(res, mysql, id, context, complete);
            getUserEvents(res, mysql, id, context, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 2){
                    res.render('user-events', context);
                }
            }
        } else {
            res.redirect('/access-denided');
        }
    });

    return router;
}();
