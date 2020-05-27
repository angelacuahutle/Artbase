module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var bodyParser = require('body-parser');
    var urlencodedParser = bodyParser.urlencoded({extended: false});


    function getArtistArtwork(res, mysql, context, id, complete){
        var sql = "SELECT CONCAT(firstName, ' ', lastName) AS artistName, artworkID AS id, Artists.artistID, title, medium, material, description, url "
        + "FROM Artworks "
        + "INNER JOIN Artists ON Artists.artistID = Artworks.artistID "
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
        + "LEFT JOIN Events e ON e.eventID = ae.eventID "
        + "LEFT JOIN Artworks aw ON aw.artworkID = ae.artworkID "
        + "LEFT JOIN Artists a ON a.artistID = aw.artistID "
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
        getEventsForArtistArtwork(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('image-user', context);
            }
        }
    });
    return router;
}();
