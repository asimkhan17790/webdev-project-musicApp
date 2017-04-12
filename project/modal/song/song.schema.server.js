/**
 * Created by sumitbhanwala on 4/5/17.
 */
module.exports = function () {
    var mongoose = require('mongoose');
    var songSchema = mongoose.Schema({
        title : String,
        artist : String ,
        genre : String ,
        spotifyID : String ,
        lyricsID : String ,
        songURL : String ,
        songThumb : String ,
        dateCreated : {type : Date , default :Date.now()}
    },{collection: 'song'});
    return songSchema ;
};
