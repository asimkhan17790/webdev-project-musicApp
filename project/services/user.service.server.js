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
    app.get("/api/user/follow/:userId1/:userId2",followUser);
    app.get("/api/user/unfollow/:userId1/:userId2",unfollowUser);
    app.get("/api/searchUsers/:queryString" ,searchUsers);
    app.get("/api/user/forgotPassword/:emailAddress",forgotPasswordAndSendEmail);
    app.get("/api/user/follow/playList/:userId1/:userId2",findAllplayListAndFollowing);


    var userModel = listOfModel.UserModel;
    var albumModel = listOfModel.albumModel;
    var playListModel = listOfModel.playListModel;
    var emailApi = require('../apis/email.api.server')();

    // userID1 is the person whose playlists we wanna find
    // userID2 is the second person
    function findAllplayListAndFollowing(req , res) {
        var userId1 = req.params.userId1;
        var userId2 = req.params.userId2;
        var response = {};
        userModel
            .findIsFollowing(userId1 , userId2)
            .then(function (status1) {
                userModel
                    .findAllplayLists(userId1)
                    .then(function (users) {
                        response.status = "OK";
                        response.data = users;
                        res.send(response);
                    }, function (error) {
                        response.status="KO";
                        response.description="Some error occurred while finding the playlists";
                        res.json(response);
                    })
            }, function (err) {
                response.status="KO";
                response.description="Some error occurred while finding the playlists";
                res.json(response);
            });
    }

    // if no input is coming than the search will fail
    function searchUsers(req , res) {
        var response = {};
    var searchTerm = req.params.queryString;
    userModel
        .searchUsers(searchTerm)
        .then(function (users) {
            response.status = "OK";
            response.data = users;
            res.send(response);
        },function (err) {
           res.send(err);
        });
    }

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
    // userID1 is the main person
    // userID2 is the person which we have to add to the followers list
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
            .then(function (User) {
                res.json({status:'OK',data:User});
            } , function (err) {
                res.json({status:'KO',data:err});
            });
    }

    // below service will check if the second user(userId2) is following the
    // first user (userId1)
    function findIsFollowing (req ,res) {
        var userId1 = req.params.userId1;
        var userId2 = req.params.userId2;
        userModel
            .findIsFollowing(userId1 , userId2)
            .then(function (status1) {
                res.json({status:'OK',data:status1});
            } , function (err) {
                response.status="KO";
                response.description="Some error occurred while checking";
                res.json(response);
            });
    }
    // manipulate to send the entire user object rather that the array of ID
    function findFollowersById(req , res)
    {
        var response = {};
        var userId = req.params.userId;
        userModel
            .findFollowersById(userId)
            .then(function (users) {
                response.status = "OK";
                response.data = users;
                res.send(response);
            },function (err) {
                response.status="KO";
                response.description="Some error occurred!!";
                res.json(response);
            });
    }

    // manipulate to send the entire user object rather that the array of ID

    function findFollowingById(req , res)
    {
        var response = {};
        var userId = req.params.userId;
        userModel
            .findFollowingById(userId)
            .then(function (users) {
                response.status = "OK";
                response.data = users;
                res.send(response);
            },function (err) {
                response.status="KO";
                response.description="Some error occurred!!";
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
        var response = {};
        userModel
            .findAllplayLists(userId)
            .then(function (user) {
                if (user && user.playList && user.playList.length > 0) {
                    response.status = "OK";
                    response.data = user.playList;
                    res.json(response);
                }
                else {
                    response.status = "KO";
                    response.description = "No playlist created yet!";
                    res.json(response);
                }

            }, function (error) {
                response.status = "KO";
                response.description = "Some Error Occurred!!";
                res.status(500).send(response);
            })
    }

    // create a default playlist for the user of type music lover which cant be deleted
    // have to see how to make sure its not deleted ever okay creating a field called
    // default playlist which can never be deleted

    // NOTE :: creating default playlist in the particular playlist itself
    // possible bug that user gets created but the default playlist dont get cra
    function createUser(req,res) {
        var user = req.body;
        var response = {};
        userModel
            .createUser(user)
            .then(function(user) {

                if (user) {
                    var emailObject = {
                        to: user.email,
                        from: 'asim.khan17790@gmail.com',
                        subject: 'Welcome to MyMusic',
                        message: 'Hi <strong>'+ user.firstName+'</strong>,<br><br>'
                        + 'Welcome to <strong>My Music</strong>,<br><br> Your username is :<strong>'+ user.username+ '</strong><br><br> <h2>Enjoy your musical Journey!!</h2>',
                    };
                    emailApi.sendEmailAsync(emailObject);
                }
                if(user && user.userType === "U")
                {
                    var defaultplayList = {
                        "playListName" : "Favorites",
                        "playListOwner" : user._id
                    }
                    playListModel
                        .createplayList(defaultplayList)
                        .then(function (createdplayList) {
                            userModel
                                .addplayList(createdplayList)
                                .then(function (updatedUser) {
                                    if (updatedUser) {
                                        response.status="OK";
                                        response.description="User successfully created";
                                        response.user = updatedUser;
                                        res.json(response);
                                    }
                                    else {
                                        response.status="KO";
                                        response.description="Some Error Occurred!! Please try again";
                                        // res.json(response);
                                        res.status(500).send(response);
                                        return;
                                    }

                                },function (error) {
                                    response.status="KO";
                                    response.description="Some Error Occurred!! Please try again";
                                    // res.json(response);
                                    res.status(500).send(response);
                                    return;
                                });
                        },function (error) {

                            response.status="KO";
                            response.description="Some Error Occurred!! Please try again";
                            // res.json(response);
                            res.status(500).send(response);
                            return;
                        });
                }
                else {
                    if (user) {
                        response.status="OK";
                        response.description="User successfully created";
                        response.user = user;
                        res.json(response);
                    }
                    else {
                        response.status="KO";
                        response.description="Some Error Occurred!! Please try again";
                        // res.json(response);
                        res.status(500).send(response);
                        return;
                    }
                }

            }, function (err) {
                response.status="KO";
                if (err.code && err.code === 11000) {
                    response.description="Username or Email already exists";
                }
                else {
                    response.description="Some Error Occurred!! Please try again";
                }
                res.json(response);
                return;

            });
    }

    function findUser (req ,res) {
        var queryParams = req.query;
        var userName = queryParams.username;
        var passWord = queryParams.password;
        var response = {};
        userModel
            .findUserByCredentials(userName, passWord)
            .then(function (user) {
                if (user) {
                    response.status = "OK";
                    response.user = user;
                    response.description = "User Found";
                }
                else {
                    response.status = "KO";
                    response.description = "Username or password is incorrect";
                }
                res.json(response);
                return;

            } , function (err) {
                response.status = "KO";
                response.description = "Some Error Occurred!";
                res.status(500).send(response);
                return;
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

    function forgotPasswordAndSendEmail(req, res) {
        var emailAddress = req.params.emailAddress;
        var response = {};
        listOfModel.UserModel
            .findUserByEmail(emailAddress)
            .then(function (user) {
                if (user) {
                    var emailObject = {
                        to: emailAddress,
                        from: 'asim.khan17790@gmail.com',
                        subject: 'Password Recovery',
                        message: 'Your password is : <strong>' + user.password+ '</strong>',
                    };
                    return emailApi.sendEmail(emailObject);
                }
                else {
                    response.status = "KO";
                    response.description = "Email is not registered with us! Please enter correct Email.";
                    res.json(response);
                }

            }).then(function () {
                response.status = "OK";
                response.description = "Your password has been sent to your registered Email. Please login again!";
                res.json(response);
        }, function (err) {
            response.status = "KO";
            response.description = "Some Error Occurred!!";
            res.status(500).send(response);
        });
    }
}