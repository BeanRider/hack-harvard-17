const express = require('express');
const app = express();

// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');
const Speech = require('@google-cloud/speech');
const Nlp = require('@google-cloud/language');

const fs = require('fs');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
    secret: 'this is the secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

require ("./server/app.js")(app, Vision, Speech, fs, Nlp);


var port = process.env.PORT || 3000;

app.listen(port);