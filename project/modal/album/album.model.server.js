
/**
 * Created by sumitbhanwala on 3/10/17.
 */
module.exports = function () {

    // expsoing this particular api
    var api = {
    };

    var mongoose = require('mongoose');
    var q = require('q');
    var albumSchema = require('./album.schema.server.js')();
    var albumModel = mongoose.model('albumModel', albumSchema);
    return api;

    // create album
    // delete an album
    // delete an song from an album  are the possible crud operations


};