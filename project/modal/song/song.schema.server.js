/**
 * Created by sumitbhanwala on 4/5/17.
 */
module.exports = function () {
    var mongoose = require('mongoose');
    var songSchema = mongoose.Schema({
        id : String,
        title : String,
        artist : String ,
        genre : String ,
        spotifyID : String ,
        lyricsID : String ,
        songURL : String ,
        songThumb : String ,
        dateCreated : {type : Date , default :Date.now()},
        albums : [{type :mongoose.Schema.Types.ObjectId , ref:'albumModel'}],
        playlist : [{type :mongoose.Schema.Types.ObjectId , ref:'playListModel'}]
    },{collection: 'song'});
    return songSchema ;
};
