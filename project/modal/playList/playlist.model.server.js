/**
 * Created by sumitbhanwala on 4/5/17.
 */

module.exports = function () {

    // expsoing this particular api
    var api = {
    };

    var mongoose = require('mongoose');
    var q = require('q');
    var playListSchema = require('./playlist.schema.server.js')();
    var playListModel = mongoose.model('playListModel', playListSchema);
    return api;

    // create album
    // delete an album
    // delete an song from an album  are the possible crud operations


};