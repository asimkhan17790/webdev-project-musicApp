/**
 * Created by sumitbhanwala on 4/5/17.
 */
module.exports = function () {
    var mongoose = require('mongoose');
    var songSchema = mongoose.Schema({
        title : String,
        artist : [String] ,
        genre : String ,
        spotifyID : String ,
        lyricsID : String ,
        songURL : String ,
        songThumb : String ,
        albumName : String,
        album :{type :mongoose.Schema.Types.ObjectId , ref:'albumModel'},
        origin : {type : String , default :'mymusic'},
        dateCreated : {type : Date , default :Date.now()}
    },{collection: 'song'});

    songSchema.index({ title: 'text', genre: 'text'});
    return songSchema ;
};
