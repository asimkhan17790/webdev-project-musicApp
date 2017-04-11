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
    app.get("/api/user/followers/:userId",findFollowersById);
    app.get("/api/user/following/:userId",findFollowingById);
    app.get("/api/user/isfollowing/:userId1/:userId2",findIsFollowing);
    // not sure about the syntax of the second
    app.get("/api/user/follow/:userId1/:userId2",followUser);

    app.get("/api/user/unfollow/:userId1/:userId2",unfollowUser);

    var userModel = listOfModel.UserModel;
    var albumModel = listOfModel.albumModel;
    var playListModel = listOfModel.playListModel;



    // userID1 is the main follower
    // userID2 is the second follower and which we have to unfollow
    function unfollowUser(req ,res) {
        var userId1 = req.params.userId1;
        var userId2 = req.params.userId2;
        userModel
            .unfollowUser(userId1 , userId2)
            .then(function (user) {
                userModel
                    .unfollowingUser(userId2 , userId1)
                    .then(function (fake) {
                        res.send(user);
                    },function (err) {
                        response.status="KO";
                        response.description="Unable to un follow the given user";
                        res.json(response);
                    });
            } , function (err) {
                response.status="KO";
                response.description="Unable to unfollow the given user";
                res.json(response);
            });
    }

    // checked and tested and working fine
    function followUser(req ,res) {
        var userId1 = req.params.userId1;
        var userId2 = req.params.userId2;
        userModel
            .followUser(userId1 , userId2)
            .then(function (user) {
                userModel
                    .followingUser(userId2 , userId1)
                    .then(function (fake) {
                        res.send(user);
                    },function (err) {
                        response.status="KO";
                        response.description="Unable to follow the given user";
                        res.json(response);
                    });
            } , function (err) {
                response.status="KO";
                response.description="Unable to follow the given user";
                res.json(response);
            });
    }

    function findUserById(req , res) {
        var userId = req.params.userId;
        userModel
            .findUserById(userId)
            .then(function (user) {
                res.send(user);
            } , function (err) {
                res.send(400);
            });
    }

    // below service will check if the second user(userId2) is following the
    // first user (userId1)
    function findIsFollowing (req ,res) {
        var userId1 = req.params.userId1;
        var userId2 = req.params.userId2;
        userModel
            .findIsFollowing(userId1 , userId2)
            .then(function (status) {
                res.send(status);
            } , function (err) {
                response.status="KO";
                response.description="Some error occured while checking";
                res.json(response);
            });
    }
   // manipulate to send the entire user object rather that the array of ID
    function findFollowersById(req , res)
    {
        var userId = req.params.userId;
        userModel
            .findFollowersById(userId)
            .then(function (user) {
                res.send(user);
            },function (err) {
                response.status="KO";
                response.description="Unable to find follwers for the user";
                res.json(response);
            });
    }

    // manipulate to send the entire user object rather that the array of ID

    function findFollowingById(req , res)
    {
        var userId = req.params.userId;
        userModel
            .findFollowingById(userId)
            .then(function (users) {
                console.log(users);
                res.send(users);
            },function (err) {
                response.status="KO";
                response.description="Unable to find the users which this user is following";
                res.json(response);
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