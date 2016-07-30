'use strict';

let express = require('express'),
    bodyParser = require('body-parser'),
    ask = require('./ask');

let app = express();

app.set('port', process.env.PORT || 3000);
app.set('version', '1.0');

app.use(bodyParser.json({
    verify: function getRawBody(req, res, buf) {
        req.rawBody = buf.toString();
    }
}));


app.use('/', function(req, res) {
    res.json({ message: 'There it is! The Bridge of Death!', timestamp: (new Date()).toString() });
});
app.use('/ask', ask(app));


app.listen(app.get('port'), function() {
    console.log('Bridge keeper is up and running on port %d', app.get('port'));
});
