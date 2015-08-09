var Joi = require('joi');
var Auth = require('./auth'); 

exports.register = function(server, options, next) {
  server.route([

    {
      // Retrieve all tweets
      method: 'GET',
      path: '/tweets',
      handler: function(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;

        db.collection('tweets').find().toArray(function(err, tweets) {
          if (err) { return reply('Internal MongoDB error', err); }

          reply(tweets);
        });
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'tweets-route',
  version: '0.0.1'
};