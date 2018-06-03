const express = require('express');
const cors = require('cors');
const request = require('request');
const path = require('path');

const app = express();

let server = require('http').createServer(app);

app.use('*', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

server.listen(process.env.PORT || 5000,() => {
	console.log('Express server listening on port %d', server.address().port);
});

