/**
 * Created by sumitbhanwala on 4/4/17.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var bcrypt = require("bcrypt-nodejs");


 var googleConfig = {
     clientID     : "464567587492-nkq89la1rppp979b74md6k39iiekai40.apps.googleusercontent.com",
     clientSecret : "OPtM9n-FOWo-Y5IRg1xrk-lW",
     callbackURL  : "http://localhost:3000/auth/google/callback"
 };

module.exports = function (app ,listOfModel) {

    // app.use(function(req, res, next) { //allow cross origin requests
    //     res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    //     res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
    //     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
    //     next();
    // });

    app.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        next();
    });

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    /*  app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });
     */
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/#/user/userHomePage',
            failureRedirect: '/#/landingPage'
        }));



    app.post("/api/user" ,createUser);
    app.post("/api/user/login" ,passport.authenticate('local'),findUser);
    app.post("/api/user/loggedin",loggedin);
    app.post('/api/user/logout', logout);
    app.post('/api/user/isAdmin', isAdmin);
    app.put("/api/user/:userId",updateUser);
    app.delete("/api/user/:userId",deleteUser);
    app.get("/api/user/album/:userId",findAlbumsForUser);
    app.get("/api/user/playList/:userId",findPlayListForUser)
    app.get("/api/user/:userId",findUserById);
    app.get("/api/user/followers/:userId",findFollowersById);
    app.get("/api/user/following/:userId",findFollowingById);
    app.get("/api/user/isfollowing/:userId1/:userId2",findIsFollowing);
    app.get("/api/user/follow/:userId1/:userId2",followUser);
    app.get("/api/user/unfollow/:userId1/:userId2",unfollowUser);
    app.get("/api/searchUsers/:queryString/:userId" ,searchUsers);
    app.get("/api/NonAdminUsers/:queryString" ,searchNonAdminUsers);
    app.get("/api/user/forgotPassword/:emailAddress",forgotPasswordAndSendEmail);
    app.get("/api/user/follow/playList/:userId1/:userId2",findAllplayListAndFollowing);
    app.get("/api/user/findAllEventsOfUser/:uid", findAllEventsOfUser);
    app.post("/api/user/sendInvite/", sendInvitationToNonUsers);


    passport.use('local',new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    var userModel = listOfModel.UserModel;
    var albumModel = listOfModel.albumModel;
    var playListModel = listOfModel.playListModel;
    var emailApi = require('../apis/email.api.server')();

    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    function googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id,profile.emails[0].value)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return userModel.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
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
                                    .addplayList(createdplayList,'C')
                                    .then(function (updatedUser) {
                                        if (updatedUser) {
                                            // response.status="OK";
                                            // response.description="User successfully created";
                                            // response.user = updatedUser;
                                            // res.json(response);
                                            // req.login(user, function (err) {
                                            //     res.json(user);
                                            // });
                                            return done(null, user);
                                        }
                                        else {
                                            response.status="KO";
                                            response.description="Some Error Occurred!! Please try again";
                                            // res.json(response);
                                            // res.status(500).send(response);
                                            return done(response);
                                        }

                                    },function (error) {
                                        response.status="KO";
                                        response.description="Some Error Occurred!! Please try again";
                                        // res.json(response);
                                        // res.status(500).send(response);
                                        return done(response);
                                    });
                            },function (error) {

                                response.status="KO";
                                response.description="Some Error Occurred!! Please try again";
                                // res.json(response);
                                // res.status(500).send(response);
                                return done(response);
                            });
                    }
                    // return done(null, user);
                },
                function(err){
                    if (err) {
                        console.log('Error:'+err);
                        return done(null, false);
                      //  return done(null, );
                    }
                }
            );
    }

    function logout(req, res) {
        req.logout();
        res.send(200);
    }

    function isAdmin(req, res) {
        if(req.isAuthenticated() && req.user.userType == 'A') {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }

    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user && bcrypt.compareSync(password, user.password)){
                        done(null,user);
                    }
                    else {
                        done(null, true);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function loggedin(req, res) {
        if(req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function findUser (req ,res) {
        var user = req.user;
        res.json(user);
    }

    function deleteUser(req , res) {
        var userId = req.params.userId;
        userModel.deleteUser(userId)
            .then(function (user) {
                    var followers = user.followers;
                    var following = user.following ;
                    var playLists = user.playList;
                    var albums = user.album ;
                    if(user.userType === "U")
                    {
                        playListModel.deleteallplayLists(playLists)
                            .then(function (playLists) {
                                res.status(200).send("OK");
                            },function (err) {
                                res.status(500).send("Some Error Occurred!!");
                            });
                    }
                    else if(user.userType === "M")
                    {
                        albumModel.deleteallalbums(albums)
                            .then(function (albums) {
                                res.status(200).send("OK");
                            },function (err) {
                                res.status(500).send("Some Error Occurred!!");
                            });
                    }

                },
                function(err) {
                    res.status(500).send("Some Error Occurred!!");
                });

    }


    function sendInvitationToNonUsers (req, res) {
        var requestObject = req.body;
        var response = {};

        var emailObject = {
            to: requestObject.emailAddress,
            from: 'asim.khan17790@gmail.com',
            subject: 'MyMusic Invitation',
            message: 'Hi,<br><br>' + requestObject.firstName + ' has sent you an invite to join <strong>MyMusic</strong>. Please follow the link provided below to sign up<br><br><a href="https://mymusicapp-webdev.herokuapp.com/#/"> MyMusic App </a>'
        };
        emailApi.sendEmail(emailObject)
            .then(function () {
                if (emailObject) {
                    response.status = "OK";
                    response.description = "Congrats...Your invitation has been sent successfully";
                    res.json(response);
                }
                else {
                    response.status = "KO";
                    response.description = "Some Error Occured!!";
                    res.json(response);
                }

            }, function (err) {
            response.status = "KO";
            response.description = "Some Error Occurred!!";
            res.status(500).send(response);
        });
    }

    function findAllEventsOfUser (req, res) {

        var response = {};
        var userId = req.params.uid;
        userModel
            .findAllEventsOfUser(userId)
            .then(function (events) {
                if (events) {
                    response.status = "OK";
                    response.data = events;
                    res.send(response);
                }
                else {
                    res.send({status:"KO",description:"No Events created yet!"});
                }

            },function (err) {
                response.status="KO";
                response.description="Some error occurred!!";
                res.json(response);
            });
    }

    function findAllplayListAndFollowing(req , res) {
        var userId1 = req.params.userId1;
        var userId2 = req.params.userId2;
        var response = {};
        userModel
            .findIsFollowing(userId1 , userId2)
            .then(function (status1) {
                if(status1.isPresent)
                {
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
                }
                else
                {
                response.status = "OK";
                response.data = null;
                response.description="Please follow the user to see the playlist";
                res.send(response);
                }
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
        var userId = req.params.userId;
    userModel
        .searchUsers(searchTerm , userId)
        .then(function (users) {
            response.status = "OK";
            response.data = users;
            res.send(response);
        },function (err) {
           res.send(err);
        });
    }

    function searchNonAdminUsers(req , res) {
        var response = {};
        var searchTerm = req.params.queryString;
        if(req.user && req.user.userType =='A') {
            userModel
                .searchNonAdminUsers(searchTerm)
                .then(function (users) {
                    response.status = "OK";
                    response.data = users;
                    res.send(response);
                }, function (err) {
                    res.send(err);
                });
        }
        else
        {
            response.status = 401;
            response.data = {};
            res.send(response);
        }
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
        var response = {};
        userModel
            .findAllAlbums(userId)
            .then(function (user) {
                if (user && user.album && user.album.length > 0) {
                    response.status = "OK";
                    response.data = user.album;
                    res.json(response);
                }
                else {
                    response.status = "KO";
                    response.description = "No albums created yet!";
                    response.data = user.album;
                    res.json(response);
                }
            }, function (error) {
                response.status = "KO";
                response.description = "Some Error Occurred!!";
                res.status(500).send(response);
            })
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


    function createUser(req,res) {
        var user = req.body;
        var response = {};
        user.password = bcrypt.hashSync(user.password);
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
                                .addplayList(createdplayList,'C')
                                .then(function (updatedUser) {
                                    if (updatedUser) {
                                        // response.status="OK";
                                        // response.description="User successfully created";
                                        // response.user = updatedUser;
                                        // res.json(response);
                                        req.login(user, function (err) {
                                            res.json(user);
                                        });

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
                        req.login(user, function (err) {
                            res.json(user);
                        });
                        // response.status="OK";
                        // response.description="User successfully created";
                        // response.user = user;
                        // res.json(response);
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
                        message:'Hi ' + user.firstName +',<br><br>Your username is : <strong>' + user.username + '</strong>' +'<br>Your password is : <strong>' + user.password+ '</strong>',
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