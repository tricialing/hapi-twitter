var Bcrypt = require('bcrypt');
var Auth = require('./auth');

exports.register = function(server, options, next){
  
  server.route([
  {
    method: 'POST',
    path: '/sessions',
    handler: function(request, reply){
      var db = request.server.plugins['hapi-mongodb'].db;

      var user = request.payload.user;

      db.collection('users').findOne({username: user.username}, function(err, userMongo){
        if (err) { return reply('Internal MongoDB error', err); }

        //1. stop if user doesn't exist
        if (userMongo === null){
          return reply({ userExists: false });
        }

        var randomKeyGenerator = function() {
          return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };

        //2. check passwork 
        Bcrypt.compare(user.password, userMongo.password, function(err, same){
            if (!same) {
              return reply({ authorized: false });
            }

            //3. create a new session in the session collection 
            var session = {
              user_id: userMongo._id,
              session_id: randomKeyGenerator()
            };

            db.collection('sessions').insert(session, function(err, writeResult){
              if (err) {return reply('Internal MongoDB error', err); }

              //4. set the same session_id in the client's cookie 
              request.session.set('happ_twitter_session', session);
            });
        });
      });
    }
  },
  {
    //definign a route to check if the user is authenticated aka logged in
    method: 'GET',
    path: '/authenticated',
    handler: function(request, reply){
      var callback = function(result){
        reply(result);
      };

      Auth.authenticated(request, callback);
    }
  }
  ])

  next();
};

exports.register.attributes = {
  name: 'sessions-routes',
  version: '0.0.1'
}