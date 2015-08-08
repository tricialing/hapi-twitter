// the main and only that config the server. link to all node librarys and all of our own plugins (defines our routes)

//1. Hapi is a class 
var Hapi = require('hapi'); //the official name is hapi
var Path =  require('path');
//2. instanciate
var server = new Hapi.Server();

//3. configer server connection 
server.connection({
  host: '0.0.0.0', //aka localhost 
  port: 3000, //also use by rails
  routes: {
    cors: { //cross origin resouce sharing
      headers: ["Access-Control-Allow-Credentials"], //allow someone not on your website to use your app 
      credentials: true,
    }
  }
});

server.views({
  engines: {
    html: require('handlebars')
  },
  path: Path.join(__dirname, 'templates')
});

//4. require mongoDB 
//any other dependencies
var plugins = [
  { register: require('./routes/users.js')},
  { register: require('./routes/static-pages.js') },
  { register: require('./routes/sessions.js') },
  { 
    register: require( 'yar'),
    options: {
      cookieOptions: {
        password: 'asdasdasd',
        isSecure: false
      }
    }
  },
  // require mongo
  {
    register: require('hapi-mongodb'),
    options: {
      url: 'mongodb://127.0.0.1:27017/hapi-twitter',
      settings: {
        db :{
          native_parser: false //how mongodb do querying (getting post), so we rely on hapi
        }
      }
    }
  }
];

//5. start server 
server.register(plugins, function (err){
  //check error
  if (err){
    throw err; //raising the error, stop the server and print error message. 
  };
  // if ok, start server 
  server.start(function(){
    console.log('info', 'Server running at: ' + server.info.uri);
  });
});


