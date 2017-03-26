var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




//var arcCloud  = require ("./project/apis/acr.cloud.server")();

//arcCloud.findMusicFingerPrint(null) ;

require ("./project/app.js")(app);

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;

app.listen(port);