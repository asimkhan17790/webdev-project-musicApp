var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


require ("./project/app.js")(app);

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;
 d
app.listen(port);