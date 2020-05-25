module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getArtist(res, mysql, context, id, complete){
        var sql = "SELECT CONCAT(firstName, ' ', lastName) AS artistName FROM Artists WHERE artistID=?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.artist = results[0];
            complete();
        });
    }


    function getArtistArtworks(res, mysql, context,id, complete) {
        var sql = "SELECT artworkID as id, Artworks.artistID, title, url, CONCAT(firstName, ' ', lastName) AS artistName"
        + " FROM Artworks" 
        + " LEFT JOIN Artists on Artists.artistID = Artworks.artistID"
        + " WHERE Artworks.artistID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error) {
                res.write(JSON.stringify(error));
                res.end()
            }
            context.artworks = results;
            complete();
        });
    }

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = [];
        var mysql = req.app.get('mysql');
        getArtist(res, mysql, context, req.params.id, complete);
        getArtistArtworks(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('artist-portfolio', context);
            }

        }
    });



    return router;
}();

