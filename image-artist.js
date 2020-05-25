module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getEvents(res, mysql, context, complete){
    	mysql.pool.query("SELECT eventID, name FROM Events ORDER BY name ASC", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Events = results; 
            complete();
        });
    }


    function getArtistArtwork(res, mysql, context, id, complete){
        var sql = "SELECT CONCAT(firstName, ' ', lastName) AS artistName, artworkID AS id, Artists.artistID, title, medium, material, description, url "
        + "FROM Artworks "
        + "INNER JOIN Artists on Artists.artistID = Artworks.artistID "
        + "WHERE artworkID=?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.artworks = results[0];
            complete();
        });
    }


    function getEventsForArtistArtwork(res, mysql, context, id, complete){
        var sql = "SELECT ae.artworkID AS id, e.name, aw.url, aw.title, aw.medium, aw.material, aw.description, DATE_FORMAT(e.startDate, '%a %b %e %Y') AS startDate, DATE_FORMAT(e.endDate, '%a %b %e %Y') AS endDate, TIME_FORMAT(e.time, '%h %i %p') AS time, e.location, e.city, e.state, e.zipCode "
        + "FROM Artworks_Events ae "
        + "LEFT JOIN Events e on e.eventID = ae.eventID "
        + "LEFT JOIN Artworks aw on aw.artworkID = ae.artworkID "
        + "LEFT JOIN Artists a on a.artistID = aw.artistID "
        + "WHERE ae.artworkID = ? "
        + "ORDER BY date(startDate) ASC";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.artworksEvents = results;
            complete();
        });
    }


    /* Display artwork information for specific artwork */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = [];
        var mysql = req.app.get('mysql');
        getArtistArtwork(res, mysql, context, req.params.id, complete);
        getEvents(res, mysql, context, complete);
        getEventsForArtistArtwork(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('image-artist', context);
            }

        }
    });

    /* Add a new row to Artworks_Events, redirects to the image-artist page after adding */

    router.post('/', urlencodedParser, function(req, res){
        console.log(req.body)
        console.log("INSERTING NEW EVENT")
        var mysql = req.app.get('mysql');
        var sql = 'INSERT INTO Artworks_Events (artworkID, eventID) VALUES ((SELECT Artworks.artworkID FROM Artworks LEFT JOIN Artists ON Artworks.artistID=Artists.artistID WHERE Artists.username=:sessions_username AND Artworks.url=:new_artwork_url), (SELECT Events.eventID FROM Events WHERE Events.name=:event_input));'
        var inserts = [req.body.artworkID, req.body.eventID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/image-artist/:id');
            }
        });
    });

   
    return router;
}();
