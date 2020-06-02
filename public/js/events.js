module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var bodyParser = require('body-parser');
    var urlencodedParser = bodyParser.urlencoded({extended: false});

    /* Query for getting all events */

    function getEvents(res, mysql, context, complete){
    	mysql.pool.query("SELECT eventID, name, DATE_FORMAT(startDate, '%a %b %e %Y') startDate, DATE_FORMAT(endDate, '%a %b %e %Y') endDate, TIME_FORMAT(time, '%h %i %p') time, location, city, state, zipCode FROM Events ORDER BY date(startDate) ASC", function(error, results, fields){
    		if(error){
                console.log(error);
    			res.write(JSON.stringify(error));
    			res.end();
    		}
    		context.Events = results;
    		complete();
    	});
    }

    /* Query for getting a single event to edit */

    function getOneEvent(res, mysql, context, id, complete){
        var sql = "SELECT eventID, name, DATE_FORMAT(startDate, '%Y-%m-%d') startDate, DATE_FORMAT(endDate, '%Y-%m-%d') endDate, time, location, city, state, zipCode FROM Events WHERE eventID=?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, result, fields){
            if(error){
                console.log(error);
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Events = result[0];
            complete();
        });
    }

    /* Request for events */

    router.get('/', function(req, res){
        if (req.session.isUser == false) {
            var callbackCount = 0;
            var context = {};
            var eventName = req.query.name_search_string;
            var mysql = req.app.get('mysql');
            if (eventName == undefined || eventName == "") {
                getEvents(res, mysql, context, complete);
            } else {
                mysql.pool.query("SELECT eventID, name, DATE_FORMAT(startDate, '%a %b %e %Y') startDate, DATE_FORMAT(endDate, '%a %b %e %Y') endDate, TIME_FORMAT(time, '%h %i %p') time, location, city, state, zipCode FROM Events WHERE name LIKE '%" + req.query.name_search_string + "%'", function(error, results, fields){
                    if(error){
                        res.write(JSON.stringify(error));
                        res.end();
                    }
                    context.Events = results;
                    complete();
                })
            }
            function complete(){
                callbackCount++;
                if(callbackCount >= 1){
                    res.render('events', context);
                }
            }
        } else {
            res.redirect('/access-denied');
        }
    });

    /* Render update page with record to update */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateEvent.js"];
        var mysql = req.app.get('mysql');
        getOneEvent(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-event', context);
            }
        }
    });

    /* Add a new event, redirects to the events page after adding */

    router.post('/', urlencodedParser, function(req, res){
        var mysql = req.app.get('mysql');
        var sql = 'INSERT INTO Events (name, startDate, endDate, time, location, city, state, zipCode) VALUES (?,?,?,?,?,?,?,?)';
        var inserts = [req.body.name, req.body.startDate, req.body.endDate, req.body.time, req.body.location, req.body.city, req.body.state, req.body.zipCode];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/events');
            }
        });
    });

    /* The URI that update data is sent to in order to update an event */

    router.put('/:id', urlencodedParser, function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Events SET name=?, startDate=?, endDate=?, time=?, location=?, city=?, state=?, zipCode=? WHERE eventID=?";
        var inserts = [req.body.name, req.body.startDate, req.body.endDate, req.body.time, req.body.location, req.body.city, req.body.state, req.body.zipCode, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    return router;
}();