/**
 * Created by sumitbhanwala on 4/5/17.
 */
module.exports = function () {

    // expsoing this particular api
    var api = {
    };

    var mongoose = require('mongoose');
    var q = require('q');
    var songSchema = require('./song.schema.server.js')();
    var songModel = mongoose.model('songModel', songSchema);
    return api;

    // create album
    // delete an album
    // delete an song from an album  are the possible crud operations


};