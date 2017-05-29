$(function() {
  if ($('#users').length > 0) {
    var users = new Vue({
      el: '#users',
      data: {
        resources: brv.ResourceFactory.create('/users'),
        users: []
      },
      mounted: function() {
        var that = this;
        that.resources.list()
          .then(function(users) {
            that.users = users;
          });
      }
    });
  }
});