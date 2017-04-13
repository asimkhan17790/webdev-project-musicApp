module.exports = function (app) {
    app.get("/api/music/lyrics/:songTitle/:artistName",findSongLyrics);
    app.get("/api/music/musicNews", findMTVNews);


    const https = require('https');

    // model definitions here
    var mtvObject = require('../apis/mtvNew.api.server')();

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
