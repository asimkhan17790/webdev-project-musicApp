module.exports = function () {

    var api = {
        findMusicFingerPrint : findMusicFingerPrint
    }

    var q = require('q');
    var url = require('url');
    var fs = require('fs');
    var crypto = require('crypto');
//npm install request
    var request = require('request');

// Replace "###...###" below with your project's host, access_key and access_secret.
    var defaultOptions = {
        host: 'us-west-2.api.acrcloud.com',
        endpoint: '/v1/identify',
        signature_version: '1',
        data_type:'audio',
        secure: true,
        access_key: '427349855346bc8c08be334f3772c770',
        access_secret: 'FWrxRoVHVbb8F9HhyCkQVAyrQ441DfwRG1jfk6zO'
    };

    function buildStringToSign(method, uri, accessKey, dataType, signatureVersion, timestamp) {
        return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
    }

    function sign(signString, accessSecret) {
        return crypto.createHmac('sha1', accessSecret)
            .update(new Buffer(signString, 'utf-8'))
            .digest().toString('base64');
    }

    /**
     * Identifies a sample of bytes
     */
    function identify(data, options, cb) {

        var current_data = new Date();
        var timestamp = current_data.getTime()/1000;

        var stringToSign = buildStringToSign('POST',
            options.endpoint,
            options.access_key,
            options.data_type,
            options.signature_version,
            timestamp);

        var signature = sign(stringToSign, options.access_secret);

        var formData = {
            sample: data,
            access_key:options.access_key,
            data_type:options.data_type,
            signature_version:options.signature_version,
            signature:signature,
            sample_bytes:data.length,
            timestamp:timestamp,
        }
        request.post({
            url: "http://"+options.host + options.endpoint,
            method: 'POST',
            formData: formData
        }, cb);
    }
    return api;


    function findMusicFingerPrint (musicObject) {
       // var bitmap = fs.readFileSync('./sample_bad.wav');
        var defered = q.defer();
        identify(new Buffer(musicObject), defaultOptions, function (err, httpResponse, body) {
            if (err)
            {
                console.log(err);
                defered.reject(err);
            }
            else {

                defered.resolve(body);
            }
        });
        return defered.promise;
    }
}







