/**
 * Created by sumitbhanwala on 4/1/17.
 */

module.exports = function (app) {
    var api = {
        uploadMusicAws : uploadMusicAws
    }

    var q = require('q');
    var AWS = require('aws-sdk');
    var uuid = require('uuid');
    var mm = require('music-metadata');
    var fs = require('fs');
    const util = require('util');
    var s3 = new AWS.S3();
// Create a bucket and upload something into it
    var bucketName = 'testbucketsumittest';
    return api;

    function uploadMusicAws (musicObject , key) {
        var q1 =  q.defer() ;
        keyName =  key ;
        // console.log("Object is public at https://s3.amazonaws.com/" +
        //    params.Bucket + "/" + params.Key);
        var params = {Bucket: bucketName,
            Key: keyName,
            Body: new Buffer(musicObject),
            ACL: 'public-read'};
        s3.putObject(params, function(err, data) {
            if (err)
                q1.reject();
            else
                q1.resolve(data);
        });
        return q1.promise;
    }


}