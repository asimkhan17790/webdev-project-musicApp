var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require ("./project/database/music-app-database")(app);
require ("./project/app")(app);

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;
app.listen(port);