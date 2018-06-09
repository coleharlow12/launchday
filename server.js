'use strict'
const express 	= require('express');
const cors 			= require('cors');
const request 	= require('request');
const logger            = require('morgan');
const path              = require('path');
const bodyParser        = require('body-parser');

const app = express();

let server = require('http').createServer(app);

// Require routes
let locationRoutes = require('./server/routes/locationRoutes');

// Use routes
app.use(locationRoutes);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('*', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

server.listen(process.env.PORT || 5000, () => {
	console.log('Express server listening on port %d', server.address().port);
});
