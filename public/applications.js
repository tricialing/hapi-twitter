console.log('Hello World');

$.ajax({
  type: 'POST',
  url: 'users',
  data: {
    user: {
        username: 'asd',
        name: 'asd',
        email: 'asd@asd.com',
        password: 'asdasdasdasd'
    }
  },
  dataType: 'JSON',
  success: function(response, status){
      console.log('response: ', response);
  },
  error: function(xhr, status, data){
    console.log('xhr: ', xhr);
    console.log('status: ', status);
    console.log('data: ', data);
  }
})