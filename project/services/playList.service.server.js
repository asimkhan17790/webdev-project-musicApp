/**
 * Created by sumitbhanwala on 4/9/17.
 */
module.exports = function (app ,listOfModel) {


    app.post("/api/playList" ,createplayList);
    app.get("/api/user/playList/song/:pid",findAllSongsForplayList);
    app.delete("/api/playList/:pid" ,deleteplayList);
    
    var albumModel = listOfModel.albumModel;
    var userModel = listOfModel.UserModel;
    var songModel = listOfModel.songModel;
    var playListModel = listOfModel.playListModel;

    function createplayList(req,res) {
        var playList = req.body;
        var response = {};
        playListModel.createplayList(playList)
            .then(function(newplayList) {
                return userModel.addplayList(newplayList);
            })
            .then(function (updatedUser) {
                if (updatedUser) {
                    response.status ="OK";
                }
                else {
                    response.status ="KO";
                }
                res.json(response);
            },function (err) {
                response.status ="KO";
                res.json(response);
            })
    }

    function findAllSongsForplayList(req,res) {

    }

    // this function is not fully completed as how to add
    // songs to the particular user as it wont make much sensee
    // to write the deletion without addition functionality
    function deleteplayList(req,res) {
        console.log("inside the server side");
        var playListId = req.params.pid;
        playListModel.deleteplayList(playListId)
            .then(function (playList) {
                var userId = playList.playListOwner ;
                    userModel.deleteplayList(userId ,playListId)
                    .then(function (user) {
                        res.send(user);
                    },function (err) {
                        res.send(err);
                    });
            },function (err) {
              res.send(err);
            });
    }
}