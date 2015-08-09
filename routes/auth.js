module.exports = { };

module.exports.authenticated = function(request, callback){
  //return true is user is logged in
  // return false if user is not logged in


  // 1. retrieve session_id form cookie
  var cookie = request.session.get('hapi_twitter_session');

  if (!cookie){
    return callback({ authenticated: false });
  }

  var session_id = cookie.session_id;


  // 2. look into DB to find matching session_id
  var db = request.server.plugins['hapi-mongodb'].db

  db.collection('sessions').findOne( {session_id: session_id }, function(err, session){
  // 3. return true/false
    if(!session){
      return callback({ authenticated: false });
    }
    
    callback({ authenticated: true, user_id: session.user_id });
  });
};