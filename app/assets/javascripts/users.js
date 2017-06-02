brv.Page.initialize('users', function() {
  var users = new Vue({
    el: '#users',
    data: {
      // resources: brv.ResourceFactory.create('/users'),
      users: []
    },
    mounted: function() {
      var that = this;
      /*
      that.$http.get('/users.json')
        .then(function(resp) {
          that.users = resp.data;
        });
      */
      brv.Api.get('/users')
        .then(function(users) {
          that.users = users;
        })
    }
  });
});