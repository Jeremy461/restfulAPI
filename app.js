var express = require('express'),
    mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/songAPI');

var Song = require('./models/songModel');

var app = express();

var port = process.env.PORT || 3000;

var songRouter = express.Router();

songRouter.route('/Songs')
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

songRouter.route('/Songs/:songId')
    .get(function(req,res){

        Song.findById(req.params.bookId, function(err,song){
            if(err)
                res.status(500).send(err);
            else
                res.json(song);
        });
    });

app.use('/api', songRouter);

app.get('/', function(req, res){
    res.send('welcome to my API!');
});

app.listen(port, function(){
    console.log('Gulp is running my app on port: ' + port);
});
