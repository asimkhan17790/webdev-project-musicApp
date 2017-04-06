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

    var userModel = listOfModel.UserModel;

    function createUser(req,res) {
        var user = req.body;
        userModel
            .createUser(user)
            .then(function(user) {
                res.send(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findUser (req ,res) {
        var queryParams = req.query;
        var userName = queryParams.username;
        var passWord = queryParams.password;
        console.log("username is from server " + userName);
        console.log("password is  from server" + passWord);
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
                console.log(err);
                res.send(400);
            });
    }
}