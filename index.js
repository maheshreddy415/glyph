/* Default stuff starts here */
var express = require('express');
var app     = express();

var bodyParser = require('body-parser');

//View engine setup
app.set('views', __dirname + '/views');
app.set("view options", { layout: false });

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


var http   = require('http'),
    server = http.createServer(app).listen(3000, function(){console.log('listening to port: 3000\n');});
/* Default stuff ends here */

require('./routes/main')({app:app});
