module.exports = function () {

    var api = {
        findtrackDetails: findtrackDetails,
        searchTracks : searchTracks
    };
    var q = require('q');
    var SpotifyWebApi = require('spotify-web-api-node');
    // credentials are optional
    var spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret:  process.env.SPOTIFY_SECRET
    });

    function findtrackDetails(trackId) {


        var defered = q.defer();
        spotifyApi.getTracks([trackId], function (err, data) {
            if (err) {
                console.error('Something went wrong!');
                defered.reject({status:"KO",description:"Oh Ooh!! Music not Recognised. Try again by keeping the Mic close to the Music!"});
            } else {
                console.log(data.body);
                var result = {};
                if (data &&
                    data.body &&
                    data.body.tracks &&
                    data.body.tracks.length >0) {

                    var album = data.body.tracks[0].album;
                    result.albumName = album.name;
                    result.previewURL = data.body.tracks[0].preview_url;
                    result.artists = data.body.tracks[0].artists;
                    result.trackName = data.body.tracks[0].name;
                    result.spotifyID = trackId;
                    console.log(album.images.length>0);
                    if (album.images && (album.images.length>0)) {
                        result.imageUrl = album.images[0].url;
                    }
                    result.status = "OK";
                    defered.resolve(result);

                }
                else {
                    defered.reject({status:"KO",description:"Oh Ooh!! Music not Recognised. Try again by keeping the Mic close to the Music!"});
                }
            }
        });
        return defered.promise;
    }

    function searchTracks(inputQuery) {
        var defered = q.defer();
        spotifyApi.searchTracks('track:'+inputQuery,{ limit : 50})
            .then(function(data) {
                //console.log(data.body);

                if (data &&
                    data.body &&
                    data.body.tracks && data.body.tracks.items &&
                    data.body.tracks.items.length > 0) {
                    var result = [];
                    data.body.tracks.items.forEach(function (item, index) {

                        var song = {};
                        song.albumName = item.album.name;
                        var i;
                        var ar = [];
                        for (i = 0; i < item.album.artists.length; i++) {
                            ar.push(item.album.artists[i].name);
                        }
                        song.artist = ar;
                        song.origin = 'spotify';
                        song.songURL = item.preview_url;
                        song.title = item.name;
                        song.spotifyID = item.id;
                        if (item.album.images && (item.album.images.length > 0)) {
                            song.songThumb = item.album.images[0].url;
                        }
                        result.push(song);
                    });

                }
                    defered.resolve(result);


            }, function(err) {
                defered.resolve([]);
            });

        return defered.promise;
    }

    return api;
}







