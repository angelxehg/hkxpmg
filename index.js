'use strict';
var mongoose = require('mongoose');
mongoose.connect('mongodb://'), (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log("Connected to MongoDB");
    }
}
