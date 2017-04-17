module.exports = function (app, listOfModel) {
    app.get("/api/music/lyrics/:songTitle/:artistName",findSongLyrics);
    app.get("/api/music/musicNews", findMTVNews);
    app.get("/api/music/searchSongs/:inputQuery", searchSongs);
    app.get("/api/music/findasong/:songid", findSongById);

    const https = require('https');

    // model definitions here
    var mtvObject = require('../apis/mtvNew.api.server')();
    var songModel = listOfModel.songModel;


    function findSongById (req,res) {
        var response = {};
        var songid = req.params.songid;
        songModel
            .findSongById(songid)
            .then(function (song) {
                if (song) {
                    response = {status:'KO',data:song}
                }
                else {
                 response =  {status:'KO',data:"Song not Found"}
                }
                res.json(response);
            } , function (err) {
                res.json({status:'KO',data:err});
            });
    }

    function searchSongs (req,res) {

        var response = {};
        var results =[];
        var songQuery = req.params.inputQuery;
        songModel
            .searchSongs(songQuery)
            .then(function (songs) {
                response.status = "OK";
                results = results.concat(songs);
                response.data = results;
                res.send(response);
            },function (err) {
                res.send(err);
            });
    }




    function findSongLyrics (req,res) {
        var songTitle = req.params.songTitle;
        var artistName = req.params.artistName;
        var apiKey    = process.env.LYRICS_API_KEY;
        var endpoint  = '/ws/1.1/matcher.lyrics.get?q_track=Q_TRACK&q_artist=Q_ARTIST&apikey='+apiKey;
        var encodedSongTitle = encodeURI(songTitle);
        var encodedArtistName = encodeURI(artistName);
        var path = endpoint.replace('Q_TRACK', encodedSongTitle);
        path = path.replace('Q_ARTIST', encodedArtistName);
        //http://api.musixmatch.com/ws/
        return httpsResponse(req, res, path);
    }
    function httpsResponse(req, res, path) {

        https.get({
            host: 'api.musixmatch.com',
            path: path
        }, function(response) {
            var resbody = '';
            response.on('data', function(d) {
                resbody += d;
            });
            response.on('end', function() {
               // resbody = body.replace('jsonFlickrApi(', '');
               // resbody = body.substr(0, body.length-1);
                resbody = JSON.parse(resbody);
                if (resbody.message && resbody.message.header
                    && resbody.message.header.status_code && resbody.message.header.status_code === 200) {
                    resbody.message.body.lyrics.lyrics_body = resbody.message.body.lyrics.lyrics_body.replace(/\n/g, "<br/>");
                }
                res.json(resbody);
            });
        });
    }


    function findMTVNews (req, res) {

        mtvObject.findLatestMusicNews()
            .then(function(result) {
                res.json(result);
                return;
            },function () {
                res.json({status:'ko'});
                return;
            })

    }
}
