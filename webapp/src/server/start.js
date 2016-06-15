// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
let mqtt = require('mqtt');
let mqttClient = mqtt.connect('mqtt://iot.eclipse.org:1883');

let lastState = {}

mqttClient.on('connect', function() {

  var port = process.env.PORT || 8091;

  console.log("connected to mqtt")
  // configure app to use bodyParser()
// this will let us get the data from a POST
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
  };
  app.use(allowCrossDomain);

     // set our port

// ROUTES FOR OUR API
// =============================================================================
  var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
  router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
  });


  router.post('/config', function(req, res) {
    let {bindings, key} = req.body;

    console.log(`/config with ${JSON.stringify(req.body)}`);

    lastState = req.body;

    var channel = "actions/1567231";
    mqttClient.publish(channel, JSON.stringify(bindings));

    console.log(`sent to mqtt channel: ${JSON.stringify(channel)} config: ${JSON.stringify(bindings)}`);

    res.json({ status: 'Good' });

  });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
  app.use('/api', router);

// START THE SERVER
// =============================================================================
  app.listen(port);
  console.log('Magic happens on port ' + port);

})

