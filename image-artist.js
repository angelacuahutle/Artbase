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

    function getThisEvents(res, mysql, context, id, complete) {
        var sql="SELECT CONCAT(a.firstName, ' ', a.lastName) AS artistName, e.name, aw.url, aw.title, aw.medium, aw.material, aw.description, DATE_FORMAT(e.startDate, '%a %b %e %Y') AS startDate, DATE_FORMAT(e.endDate, '%a %b %e %Y') AS endDate, e.time, e.location, e.city, e.state, e.zipCode FROM Artworks_Events ae LEFT JOIN Events e on e.eventID = ae.eventID LEFT JOIN Artworks aw on aw.artworkID = ae.artworkID LEFT JOIN Artists a on a.artistID = aw.artistID WHERE ae.artworkID = ? ORDER BY date(startDate) ASC;";
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

    function getThisArtworkAndArtist(res, mysql, context, id, complete) {
        var sql = "SELECT CONCAT(a.firstName, ' ', a.lastName) AS artistName, aw.url, aw.title, aw.medium, aw.material, aw.description FROM Artworks_Events ae LEFT JOIN Artworks aw on aw.artworkID = ae.artworkID LEFT JOIN Artists a on a.artistID = aw.artistID WHERE ae.artworkID = ?";
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

    /*Display all events in dropdown */

    router.get('/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        console.log(context);
        var mysql = req.app.get('mysql');
        getEvents(res, mysql, context, complete);
        getThisEvents(res, mysql, context, req.params.id, complete);
        getThisArtworkAndArtist(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                console.log(context);
                res.render('image-artist', context);
            }

        }
    });
    

    return router;
}();
 