/**
 * Created by sumitbhanwala on 4/1/17.
 */

module.exports = function (app) {
    var api = {
        uploadMusicAws : uploadMusicAws ,
        uploadImageAws : uploadImageAws
    }

    var q = require('q');
    var AWS = require('aws-sdk');
  //  AWS.config.loadFromPath('./config.json');
    var uuid = require('uuid');

    var fs = require('fs');
    const util = require('util');
    var s31 = new AWS.S3();
    var s32 = new AWS.S3();

// Create a bucket and upload something into it
    var musicbucketName = 'testbucketsumittest';
    var imagebucketName = 'musicappimage';
    return api;

    function uploadMusicAws (musicObject , key) {
        var q1 =  q.defer() ;
        var keyName =  key ;
        // console.log("Object is public at https://s3.amazonaws.com/" +
        //    params.Bucket + "/" + params.Key);
        var params = {Bucket: musicbucketName,
            Key: keyName,
            Body: new Buffer(musicObject),
            ACL: 'public-read'};
        s31.putObject(params, function(err, data) {
            if (err)
                q1.reject();
            else
                q1.resolve(data);
        });
        return q1.promise;
    }

    function uploadImageAws (imageObject , key) {
        var q1 =  q.defer() ;
        var keyName =  key ;
        // console.log("Object is public at https://s3.amazonaws.com/" +
        //    params.Bucket + "/" + params.Key);
        var params = {Bucket: imagebucketName,
            Key: keyName,
            Body: new Buffer(imageObject),
            ACL: 'public-read'};
        s32.putObject(params, function(err, data) {
            if (err)
                q1.reject();
            else
                q1.resolve(data);
        });
        return q1.promise;
    }


}