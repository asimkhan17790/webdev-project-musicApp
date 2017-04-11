/**
 * Created by sumitbhanwala on 4/4/17.
 */
/**
 * Created by sumitbhanwala on 2/21/17.
 */
module.exports = function (app ,listOfModel) {

    // find User is a generic function which will in turn call
    // findUserByCredentails and findUserByUserName
    // server is listening to the below mentioned end points
    app.post("/api/user" ,createUser);
    app.get("/api/user" ,findUser);
    app.put("/api/user/:userId",updateUser);
    app.get("/api/user/album/:userId",findAlbumsForUser);
    app.get("/api/user/playList/:userId",findPlayListForUser)
    app.get("/api/user/:userId",findUserById);

    var userModel = listOfModel.UserModel;
    var albumModel = listOfModel.albumModel;
    var playListModel = listOfModel.playListModel;


    function findUserById(req , res) {
        var userId = req.params.userId;
        userModel
            .findUserById(userId)
            .then(function (user) {
                res.send(user);
            } , function (err) {
                console.log("the particular user not found according to the given username and password");
                res.send(400);
            });
    }

    function findAlbumsForUser(req, res) {
        var userId = req.params.userId;
        userModel
            .findAllAlbums(userId)
            .then(function(user) {
                res.send(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
        // hopefully we will be sending the entire user and albums will be embedded in it
    }

    function findPlayListForUser(req, res) {
        var userId = req.params.userId;
        userModel
            .findAllplayLists(userId)
            .then(function (user) {
                res.send(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    // create a default playlist for the user of type music lover which cant be deleted
    // have to see how to make sure its not deleted ever okay creating a field called
    // default playlist which can never be deleted

    // NOTE :: creating default playlist in the particular playlist itself
    // possible bug that user gets created but the default playlist dont get cra
    function createUser(req,res) {
        var user = req.body;
        userModel
            .createUser(user)
            .then(function(user) {
                if(user.userType == "U")
                {
                    var defaultplayList = {
                        "playListName" : "Default",
                        "playListOwner" : user._id
                    }
                    playListModel
                        .createplayList(defaultplayList)
                        .then(function (createplayList) {
                            userModel
                                .addplayList(createplayList)
                                .then(function (createplayList) {
                                    res.send(createplayList);
                                },function (error) {
                                    res.sendStatus(500).send(error);
                                });
                        },function (error) {
                            res.sendStatus(500).send(error);
                        });
                }
                res.send(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findUser (req ,res) {
        var queryParams = req.query;
        var userName = queryParams.username;
        var passWord = queryParams.password;
        userModel
            .findUserByCredentials(userName, passWord)
            .then(function (user) {
                res.send(user);
            } , function (err) {
                console.log("the particular user not found according to the given username and password");
                res.send(400);
            });
    }

    function updateUser (req ,res) {
        var userId = req.params.userId;
        var newUser = req.body ;
        listOfModel.UserModel
            .updateUser(userId, newUser)
            .then(function (user) {
                res.send(user);
            }, function (err) {
                res.status(500).send("Some Error Occurred!!");
            });
    }
}