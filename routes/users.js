// defining the plugin
var Joi = require('joi'); // What do JOI do? Object schema validation
var Bcrypt = require('bcrypt'); // What is Bcrypt? Encryption / Hashing function

exports.register = function(server, options, next){
  //define routes
  server.route([
      {
        // Create a new user
        method: 'POST',
        path: '/users',

        config: {
          handler: function(request, reply) {
            var db = request.server.plugins['hapi-mongodb'].db;

            // Get user input parameters (username, email, password)
            var user = {
              username: request.payload.user.username,
              email:    request.payload.user.email,
              password: request.payload.user.password
            };

            // Check if there is an existing user with the same username or the same email address
            var uniqUserQuery = {
              $or: [
                {username: user.username},
                {email: user.email}
              ]
            };

            db.collection('users').count(uniqUserQuery, function(err, userExist){
              if (userExist) {
                return reply('Error: Username already exist', err);
              }

              //encrypt my password 
              Bcrypt.genSalt(10, function(err, salt){
                Bcrypt.hash(user.password, salt, function(err,encrypted){
                  user.password = encrypted;

                  //inserting a user doc into DB 
                  db.collection('users').insert(user, function(err, writeResult){
                    if (err) {return reply("Internal MongoDB error", err)}

                    reply (writeResult);
                  });
                });
              });

            });
          },
          validate: {
            payload: {
              user: {
                email: Joi.string().email().max(50).required(),
                password: Joi.string().min(5).max(20).required(),
                username: Joi.string().min(3).max(20).required(),
                name: Joi.string().min(3).max(20)
              }
            }
          }
        }

      }, 
      {
        method: 'GET',
        path: '/users',
        handler: function(request, reply) {
          var db = request.server.plugins['hapi-mongodb'].db

          db.collection('users').find().toArray(function(err, users){
            if (err) { return reply ('Internal MongoDB error', err); }

            reply(users);
          })
        }
      }
    ]);

  next(); //for node to go to the next library
};


exports.register.attributes = {
  name: 'users-routes',
  version: '0.0.1'
}; 