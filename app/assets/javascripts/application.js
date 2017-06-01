// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery-2.2.4.js
//= require moment-2.17.1.js
//= require bootstrap-3.3.7/js/bootstrap.js
//= require datatables-1.10.13/js/jquery.dataTables.js
//= require datatables-1.10.13/js/dataTables.bootstrap.js
//= require adminlte-2.3.11/js/app.js
//= require vue-2.3.2.min.js
//= require axios-0.16.1.min.js
// require angular-1.6.2/angular.js
// require angular-1.6.2/angular-resource.js
// require angular-1.6.2/angular-route.js
//= require_self
//= brv.all.js
//= require_tree .

/*
$.ajaxSetup({
  headers: {
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
  }
});
*/

axios.defaults.headers.common['X-CSRF-Token'] = $('meta[name="csrf-token"]').attr('content')

Vue.prototype.$http = axios;