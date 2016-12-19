require('mongoose-pagination');
var songController = function(Song){

    var newPageNext, newPagePrev;

    var post = function(req,res){
        var song = new Song(req.body);

        if(!req.body.title){
            res.status(400);
            res.send('Title is required');
        }
        else {
            song.save();
            res.status(201);
            res.send(song);
        }
    };

    var options = function(req,res){
        res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.header('Allow', 'POST, GET, OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.end();
    };

    var songOptions = function(req,res){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
        res.header('Allow', 'GET, PUT, PATCH, DELETE, OPTIONS');
        res.end();
    };

    var get = function(req,res){

        if (!req.accepts('json')) {
            res.status(404)
        }

        var query = {};

        if (req.query.genre)
        {
            query.genre = req.query.genre;
        }



        Song.find(query, function(err,songs){
            if(err)
                res.status(500).send(err);
            else {

                var items = query.items = [];
                songs.forEach(function(element, index, array){
                    var newSong = element.toJSON();
                    newSong._links = {};

                    newSong._links.self = {};
                    newSong._links.self.href = 'http://' + req.headers.host + '/api/songs/' + newSong._id;

                    newSong._links.collection = {};
                    newSong._links.collection.href = 'http://' + req.headers.host + '/api/songs';

                    items.push(newSong);
                });

                var links = query._links = {};
                links.self = {};
                links.self.href = 'http://' + req.headers.host + '/api/songs/';

                var pagination = query.pagination = {};
                pagination.currentPage = 1;
                pagination.currentItems = 2;
                pagination.totalPages = 1;
                pagination.totalItems = 2;

                pagination._links = {};

                pagination._links.first = {};
                pagination._links.first.page = 1;
                pagination._links.first.href = 'http://' + req.headers.host + 'api/songs/?start=1&limit=2';

                pagination._links.last = {};
                pagination._links.last.page = 1;
                pagination._links.last.href = 'http://' + req.headers.host + 'api/songs/?start=1&limit=2';

                pagination._links.previous = {};
                pagination._links.previous.page = 1;
                pagination._links.previous.href = 'http://' + req.headers.host + 'api/songs/?start=1&limit=2';

                pagination._links.next = {};
                pagination._links.next.page = 1;
                pagination._links.next.href = 'http://' + req.headers.host + 'api/songs/?start=1&limit=2';
                res.json(query);
            }
        });
    };

    return {
        post: post,
        get: get,
        options: options,
        songOptions: songOptions
    }
};

module.exports = songController;
