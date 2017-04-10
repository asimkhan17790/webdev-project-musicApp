module.exports = function () {

    var api = {
        findtrackDetails: findtrackDetails
    };

    var SpotifyWebApi = require('spotify-web-api-node');
    // credentials are optional
    var spotifyApi = new SpotifyWebApi({
        clientId: 'd05c2a5ac5674e85b33d19c01d7cf235',
        clientSecret: '25ce06975d8b410fa17d81f5d7a28ce3'
    });

    function findtrackDetails(trackId) {
       // spotifyApi.getTracks(trackIds);


        spotifyApi.getTracks(['0q0Bw5JKm8GUP5HM1H9FLx'], function (err, data) {
            if (err) {
                console.error('Something went wrong!');
            } else {
                console.log(data.body);
            }
        });
    }

    return api;
}







