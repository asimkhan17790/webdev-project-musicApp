var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var flash = require('connect-flash');
app.use(session({
    secret: 'this is the secret', // process.env.SESSION_SECRET
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser('keyboard cat'));
app.use(passport.initialize());
app.use(passport.session({ cookie: { maxAge: 99000 }}));
app.use(flash());


require ("./project/database/music-app-database")(app);
require ("./project/app")(app);

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;
app.listen(port);