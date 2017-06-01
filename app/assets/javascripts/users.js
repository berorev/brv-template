$(function() {
  var users = brv.Vue.create('#users', {
    data: {
      // resources: brv.ResourceFactory.create('/users'),
      users: []
    },
    mounted: function() {
      var that = this;
      that.$http.get('/users.json')
        .then(function(resp) {
          that.users = resp.data;
        });
    }
  });
});