//1. Hapi is a class 
var Hapi = require('hapi'); //the official name is hapi

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

//4. require mongoDB 
//any other dependencies
var plugins = [
  // require mongo
  {register: require('hapi-mongodb'),
    options: {
      url: 'mongodb://127.0.0.1:27017/hapi-twitter',
      setting: {
        native_parser: false; //how mongodb do querying (getting post), so we rely on hapi
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