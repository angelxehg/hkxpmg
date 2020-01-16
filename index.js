/* Require packages */
'use strict';
var mongoose = require('mongoose');

/* Connect database */
console.log('Attempting to connect MongoDB')
mongoose.connect('mongodb://heroku_qqw6mhz5:7o0ug689i04qd2c7mdtdj1luf3@ds331568.mlab.com:31568/heroku_qqw6mhz5', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected!'))
    .catch(err => {
        console.log(err)
    });
