'use strict'
const express 	= require('express');
const cors 			= require('cors');
const request 	= require('request');
const path 			= require('path');

const app = express();

let server = require('http').createServer(app);

// Require routes
let locationRoutes = require('./server/routes/locationRoutes');

// Use routes
app.use(locationRoutes);

app.use('*', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

server.listen(process.env.PORT || 5000, () => {
	console.log('Express server listening on port %d', server.address().port);
});
