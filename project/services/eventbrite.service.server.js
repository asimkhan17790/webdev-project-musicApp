module.exports = function (app) {
    app.post("/api/eventbrite/events",searchNearByEvents);
    app.get("/api/eventbrite/events/categories",searchEventCategories);

    const https = require('https');
    // TODO : Pagination for event search and other filters if needed
    // model definitions here
    //var Eventbrite = require('eventbrite');
   // var eb_client = Eventbrite('FB5EHUP6GYR5FVQNKOOQ','1438448248148271333550');

    var evnt_anon_token = process.env.EVENTBRITE_ANON_ACCESS_TOKEN;
    var host  = 'www.eventbriteapi.com';

    function searchNearByEvents (req, res) {

        // geolocation- DONE
        // date range - TODO
        // event category - DONE With Music Category 103
        var queryString = '';
        var inputFilter = req.body;
        if (inputFilter.cords) {
            queryString = queryString + '&location.latitude='
                + inputFilter.cords.latitude +
                '&location.longitude=' + inputFilter.cords.longitude;
        }

        var service_endPoint = '/v3/events/search/';
        var path =  service_endPoint + '?token=' + evnt_anon_token + '&categories=103' + queryString;
        return httpsResponse(req, res, path);
    }


    function httpsResponse(req, res, path) {

        https.get({
            host: host,
            path: path
        }, function(response) {
            var resBody = '';
            response.on('data', function(d) {
                resBody += d;
            });
            response.on('end', function() {
                resBody = JSON.parse(resBody);
                console.log(resBody);
                res.json(resBody);
                return;
            });
        });
    }



    function searchEventCategories(req,res) {
       // var queryString = '';
      //  var inputFilter = req.body;
        var service_endPoint = '/v3/categories/';
        var path =  service_endPoint + '?token=' + evnt_anon_token;
        return httpsResponse(req, res, path);
    }


}
