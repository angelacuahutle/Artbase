module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var bodyParser = require('body-parser');
    var urlencodedParser = bodyParser.urlencoded({extended: false});

    /* Query for getting events for dropdown */

    function getEvents(res, mysql, context, complete){
        mysql.pool.query("SELECT name, eventID FROM Events ORDER BY name ASC", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Events = results; 
            complete();
        });
    }

    /* Query for getting events for an artwork */

    function getThisEvents(res, mysql, context, id, complete) {
        var sql="SELECT ae.artworkID AS aid, ae.eventID AS eid, CONCAT(a.firstName, ' ', a.lastName) AS artistName, e.name, aw.url, aw.title, aw.medium, aw.material, aw.description, DATE_FORMAT(e.startDate, '%a %b %e %Y') AS startDate, DATE_FORMAT(e.endDate, '%a %b %e %Y') AS endDate, TIME_FORMAT(e.time, '%h %i %p') AS time, e.location, e.city, e.state, e.zipCode FROM Artworks_Events ae LEFT JOIN Events e on e.eventID = ae.eventID LEFT JOIN Artworks aw on aw.artworkID = ae.artworkID LEFT JOIN Artists a on a.artistID = aw.artistID WHERE aw.artworkID = ? ORDER BY date(startDate) ASC;";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.thisEvents = results;
            complete();
        });
    }

    /* Query for getting artist and artwork info */

    function getThisArtworkAndArtist(res, mysql, context, id, complete) {
        var sql = "SELECT CONCAT(a.firstName, ' ', a.lastName) AS artistName, a.username, a.artistID, aw.artworkID, aw.url, aw.title, aw.medium, aw.material, aw.description FROM Artworks aw LEFT JOIN Artists a on a.artistID = aw.artistID WHERE aw.artworkID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.thisArtworkAndArtist = results[0];
            complete();
        });
    }

    /*Display image-artist page */

    router.get('/:id', function(req, res){
        if (req.session.isUser == false) {
            var callbackCount = 0;
            var context = {};
            context.jsscripts = ["deleteArtworkEvent.js"];
            var mysql = req.app.get('mysql');
            getEvents(res, mysql, context, complete);
            getThisEvents(res, mysql, context, req.params.id, complete);
            getThisArtworkAndArtist(res, mysql, context, req.params.id, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 3){
                    if (req.session.sessInfo.artistID === context.thisArtworkAndArtist.artistID) {
                        res.render('image-artist', context);
                    } else {
                        res.redirect('/image-user/' + req.params.id);
                    }
                }
            }
        } else {
            res.redirect('/image-user/' + req.params.id);
        }
    });

    /* Add new event to artwork */

    router.post('/:id', urlencodedParser, function(req, res) {
        if (req.session.isUser == false) {
            var mysql = req.app.get('mysql');
            var artworkURL = req.body.artworkURL;
            var artistUsername = req.body.artistUsername;
            var newEventInsert = req.body.eventSelected;
            var artworkID = req.body.artworkID;
            var sql = "INSERT INTO Artworks_Events (artworkID, eventID) VALUES ((SELECT Artworks.artworkID FROM Artworks LEFT JOIN Artists ON Artworks.artistID=Artists.artistID WHERE Artists.username=? AND Artworks.url=?), (SELECT Events.eventID FROM Events WHERE Events.eventID=?));";
            var inserts = [artistUsername, artworkURL, newEventInsert];
            sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    res.redirect('/error-page');
                    console.log(JSON.stringify(error))
                    res.write(JSON.stringify(error));
                } else {
                    res.redirect('/image-artist/' + artworkID);
                }
            });
        } else {
            res.redirect('/access-denied');
        }
    });

    /* Remove event from artwork */

    router.delete('/artw/:aid/event/:eid', function(req, res){
        if (!req.session.isUser) {
            console.log("Deleting artworks_events row with aid=" + req.params.aid + " and eid=" + req.params.eid);
            var mysql = req.app.get('mysql');
            var sql = "DELETE FROM Artworks_Events WHERE artworkID = ? AND eventID = ?";
            var inserts = [req.params.aid, req.params.eid];
            sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.status(400); 
                    res.end(); 
                }else{
                    res.status(202);
                    res.end();
                }
            })
        } else {
            res.redirect('/access-denied');
        }
    })

    return router;
}();