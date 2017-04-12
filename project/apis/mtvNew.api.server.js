module.exports = function () {

    var api = {
        findLatestMusicNews: findLatestMusicNews
    };
    var q = require('q');
    const https = require('https');

    function findLatestMusicNews() {
        var defered = q.defer();
        var queryPath = '/v1/articles?source=mtv-news&sortBy=latest&apiKey=API_KEY';
        queryPath = queryPath.replace('API_KEY', process.env.MTV_API_KEY);
        https.get({
            host: 'newsapi.org',
            path: queryPath
        }, function(response) {
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {

                if (this && this.statusCode==200) {
                    if (body) {
                        body = JSON.parse(body);
                        if (body.status=='ok') {
                            defered.resolve(body);
                        }
                        else {
                            defered.reject();
                        }
                    }
                }
                else {
                    defered.reject();
                }


            });
        });
        return defered.promise;
    }
    return api;
}







