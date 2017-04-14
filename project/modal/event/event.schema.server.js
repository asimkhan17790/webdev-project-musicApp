
module.exports = function () {
    var mongoose = require('mongoose');
    var eventSchema = mongoose.Schema({
        eventName : {type : String , required: true},
        description: {type : String},
        startDate : {type : Date , default :Date.now()},
        endDate : {type : Date , default :Date.now()},
        venue: {type : String},
        longitude : {type : String},
        latitude : {type : String},
        dateCreated : {type : Date , default :Date.now()},
        imageUrl : String,
        _user : {type :mongoose.Schema.Types.ObjectId , ref:'UserModel'}

    },{collection: 'event'});
    return eventSchema;
};
// have to add album owner in this album and the same albub for that particular use
// and have to close the popup for the modal after a album have been created