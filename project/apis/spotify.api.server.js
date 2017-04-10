module.exports = function () {

    var api = {
        findtrackDetails: findtrackDetails
    };
    var q = require('q');
    var SpotifyWebApi = require('spotify-web-api-node');
    // credentials are optional
    var spotifyApi = new SpotifyWebApi({
        clientId: 'd05c2a5ac5674e85b33d19c01d7cf235',
        clientSecret: '25ce06975d8b410fa17d81f5d7a28ce3'
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

    return api;
}







