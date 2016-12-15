var express = require('express');
console.log("test");

var routes = function(Song){
    var songRouter = express.Router();

    songRouter.route('/')
        .post(function(req,res){
            var song = new Song(req.body);

            song.save();
            res.status(201).send(song);
        })
        .get(function(req,res){

            var query = [];

            if (req.query.genre)
            {
                query.genre = req.query.genre;
            }
            Song.find(query, function(err,songs){
                if(err)
                    res.status(500).send(err);
                else
                    res.json(songs);
            });
        });

    songRouter.use('/:songId', function(req,res,next){
        Song.findById(req.params.songId, function(err,song){
            if(err)
                res.status(500).send(err);
            else if(song)
            {
                req.song = song;
                next();
            }
            else
            {
                res.status(404).send('no song found');
            }
        });
    });
    songRouter.route('/:songId')
        .get(function(req,res){
            res.json(req.song);
        })
        .put(function(req,res){
            req.song.title = req.body.title;
            req.song.artist = req.body.artist;
            req.song.genre = req.body.genre;
            req.song.save();
            res.json(req.song);
        })
        .patch(function(req,res){
            if(req.body._id)
            {
                delete req.body._id;
            }
            for(var p in req.body)
            {
                req.song[p] = req.body[p];
            }

            req.song.save(function(err){
                if(err) {
                    res.status(500).send(err);
                }
                else
                {
                    res.json(req.song);
                }
            });
        })
        .delete(function(req,res){
            req.song.remove(function(err){
                if(err) {
                    res.status(500).send(err);
                }
                else
                {
                    res.status(204).send("Removed");
                }
            });
        });
    return songRouter;
};

module.exports = routes;
