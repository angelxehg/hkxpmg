'use strict';
var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_qqw6mhz5:7o0ug689i04qd2c7mdtdj1luf3@ds331568.mlab.com:31568/heroku_qqw6mhz5'), (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log("Connected to MongoDB");
    }
}
