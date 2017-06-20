/// <reference path="vendor.d.ts"/>

import * as $ from 'jquery';

namespace brv {

  interface PathVariable {
    [propName: string]: string;
  }

  let urlReplacer = function(url: string, data: PathVariable): string {
    if (data) {
      return url.replace(/(:[^\/]+)/g, function(matched) {
        return encodeURIComponent(data[matched.substring(1)]);
      });
    } else {
      return url;
    }
  };

  export class Api {
    static get(url: string, request) {
      return this.call('GET', url, request);
    }

    static call(method: string, url: string, request) {
      request = request || {};
      
      if (url.endsWith('/')) {
        url = url.slice(0, -1);
      }
      if (request.pathVariables) {
        url = urlReplacer(url, request.pathVariables);
      }
      
      var settings = {
        type: method,
        url: url + '.json',
        dataType: 'json',
        headers: {
          'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        },
        cache: false
      };
      if (request.data) {
        if (method.toUpperCase() == 'GET') {
          settings.data = request.data;
        } else {
          settings.contentType = 'application/json';
          settings.data = JSON.stringify(request.data);
        }
      }
      
      return $.ajax(settings);
    };
  }

}

(function(brv) {

  /*
  brv.Controller = function(controllerName, fnController) {
    if (fnController) {
      var $controller = $('[data-controller="'+controllerName+'"]');
      if ($controller.length) {
        base._controllers[controllerName] = fnController($controller);
      }
    }
    return base._controllers[controllerName];
  }
  */
  
  var urlReplacer = function(url, data) {
    if (data) {
      return url.replace(/(:[^\/]+)/g, function(matched) {
        return encodeURIComponent(data[matched.substring(1)]);
      });
    } else {
      return url;
    }
  };

  /*
   * Define brv.Api
   */
  brv.Api = (function() {
    var get = function(url, request) {
      return this.call('GET', url, request);
    };
    
    var create = function(url, request) {
      return this.call('POST', url, request);
    };
    
    var update = function(url, request) {
      return this.call('PUT', url, request);
    };
    
    var destroy = function(url, request) {
      return this.call('DELETE', url, request);
    };
    
    var call = function(method, url, request) {
      request = request || {};
      
      if (url.endsWith('/')) {
        url = url.slice(0, -1);
      }
      if (request.pathVariables) {
        url = urlReplacer(url, request.pathVariables);
      }
      
      var settings = {
        type: method,
        url: url + '.json',
        dataType: 'json',
        headers: {
          'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        },
        cache: false
      };
      if (request.data) {
        if (method.toUpperCase() == 'GET') {
          settings.data = request.data;
        } else {
          settings.contentType = 'application/json';
          settings.data = JSON.stringify(request.data);
        }
      }
      
      return $.ajax(settings);
    };
    
    return {
      get: get,
      create: create,
      update: update,
      destroy: destroy,
      call: call
    };
  })();
  
  /*
   * Define brv.Controllers
   */
  brv.Controllers = (function() {
    var _controllers = {};
    
    var create = function(controllerName, fnController) {
      if (fnController) {
        var $controller = $('[data-controller="'+controllerName+'"]');
        if ($controller.length) {
          _controllers[controllerName] = fnController($controller);
        }
      }
      return _controllers[controllerName];
    }
    
    return {
      create: create
    };
  })();

  /*
   * Define brv.Resource
   fs.RestfulUrl = function(url) {
    this.type = '.json';
    this.url = url;
  };
  fs.RestfulUrl.prototype.index = function() { return this.url + this.type; };
  fs.RestfulUrl.prototype.show = function(id) { return this.url + '/' + id + this.type; };
  fs.RestfulUrl.prototype.newForm = function() { return this.url + '/new;' };
  fs.RestfulUrl.prototype.editForm = function(id) { return this.url + '/' + id + '/edit'; };
  fs.RestfulUrl.prototype.create = function() { return this.url + this.type; };
  fs.RestfulUrl.prototype.createForm = function() { return this.url; };
  fs.RestfulUrl.prototype.update = function(id) { return this.url + '/' + id + this.type; };
  fs.RestfulUrl.prototype.updateForm = function(id) { return this.url + '/' + id; };
  fs.RestfulUrl.prototype.delete = function(id) { return this.url + '/' + id + this.type; };
   */
  brv.ResourceFactory = (function() {
    var Resource = function(urlTemplate) {
      this.urlTemplate = urlTemplate;
    };

    Resource.prototype.indexPage = function(request) {
      return urlReplacer(this.urlTemplate, request);
    };
    Resource.prototype.showPage = function(request) {
      return urlReplacer(this.urlTemplate + '/:id', request);
    };
    Resource.prototype.newForm = function(request) {
      return urlReplacer(this.urlTemplate + '/new', request);
    };
    Resource.prototype.editForm = function(request) {
      return urlReplacer(this.urlTemplate + '/:id/edit', request);
    };
    Resource.prototype.list = function(request) {
      return brv.Api.get(this.urlTemplate, request);
    };
    Resource.prototype.show = function(request) {
      return brv.Api.get(this.urlTemplate + '/:id', request);
    };
    Resource.prototype.create = function(request) {
      return brv.Api.create(this.urlTemplate, request);
    };
    Resource.prototype.update = function(request) {
      return brv.Api.update(this.urlTemplate + '/:id', request);
    };
    Resource.prototype.delete = function(request) {
      return brv.Api.destroy(this.urlTemplate, request);
    };

    var create = function(urlTemplate) {
      return new Resource(urlTemplate);
    };

    return {
      create: create
    };
  })();

  /*
   * Define brv.Utils
   */
  brv.Utils = (function() {
    var escapeHtml = function(str, options) {
      var defaultOptions = {
        defaultStr: "",
        nl2br: false
      };
  
      options = $.extend({}, defaultOptions, options);
  
      if (str == null || $.trim(str) == "") {
        return options.defaultStr;
      }
      
      if ($.isNumeric(str)) { // 숫자는 escape할 것이 없으니 패스
        return str;
      }
  
      str = str.replace(/&/gi, "&amp;")
          .replace(/"/gi, "&quot;")
          .replace(/</gi, "&lt;")
          .replace(/>/gi, "&gt;");
  
      if (options.nl2br) {
        str = str.replace(/\r\n|\n/gi, "<br />");
      }
  
      return str;
    };
    
    var eachOrEmpty = function(arr, fnEachCallback, fnEmptyCallback) {
      if (arr != null && arr.length > 0) {
        $.each(arr, fnEachCallback);
      } else {
        fnEmptyCallback();
      }
    };
    
    return {
      escapeHtml: escapeHtml,
      eachOrEmpty: eachOrEmpty
    };
  })();

  brv.Form = (function() {
    var bind = function($frm, data, options) {
      if (typeof(options) !== 'object') {
        options = {};
      }
      
      var excludes = _optionArrToSet(options.excludes);
      
      var flattened = _flatten(data, '', {});
      $frm.find('[name!=""]').each(function() {
        var $ipt = $(this);
        var name = $ipt.attr('name');
        if (excludes[name]) {
          return true; // continue;
        }
        if (name in flattened) {
          var type = $ipt.attr('type');
          if (type == 'checkbox' || type == 'radio') {
            $ipt.val(_toArray(flattened[name]));
          } else {
            $ipt.val(flattened[name]);
          }
        }
      });
    };
    
    var _toArray = function(obj) {
      if (!Array.isArray(obj)) {
        return [obj];
      } else {
        return obj;
      }
    };
    
    /*
     * reference: http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
     */
    var _flatten = function(cur, prop, result) {
      if (!_isObject(cur)) {
        result[prop] = cur;
      } else if (Array.isArray(cur)) {
        if (_containsObject(cur)) {
          for (var i = 0, l = cur.length; i < l; i++)
            _flatten(cur[i], prop + "[" + i + "]", result);
          if (l == 0)
            result[prop] = [];
        } else {
          result[prop] = cur;
        }
      } else {
        var isEmpty = true;
        for (var p in cur) {
          isEmpty = false;
          _flatten(cur[p], prop ? prop + "." + p : p, result);
        }
        if (isEmpty && prop)
          result[prop] = {};
      }
      return result;
    };
    
    var _isObject = function(obj) {
      return Object(obj) === obj;
    };
    
    var _containsObject = function(arr) {
      var objectElements = $.grep(arr, function(v, i) {
        return _isObject(v);
      });
      return objectElements.length > 0;
    };
    
    var serializeObject = function($frm, options) {
      if (typeof(options) !== 'object') {
        options = {};
      }
      
      var excludes = _optionArrToSet(options.excludes);
        
      var o = {};
      var a = $frm.serializeArray();
      $.each(a, function() {
        if (excludes[this.name]) {
          return true; // continue;
        }
        _serialize(o, this.name, this.value);
      });
      return o;
    };
    
    var _serialize = function(o, name, value) {
      var p = name.indexOf('.');
      if (p > 0) {
        var ns = name.substring(0, p);
        if (!o[ns]) {
          o[ns] = {};
        }
        _serialize(o[ns], name.substring(p + 1), value);
        return;
      }

      // pure name
      if (o[name]) {
        if (!o[name].push) {
          o[name] = [ o[name] ];
        }
        o[name].push(value || '');
      } else {
        o[name] = value || '';
      }
    };
    
    var reset = function($frm) {
      $frm.find('[name!=""]').each(function() {
        var $this = $(this);
        // TODO checkbox, radio, etc...
        var tagName = $this[0].tagName.toLowerCase();
        if (tagName == 'input') {
          $this.val($this.attr('value') || '');
        } else if (tagName == 'textarea') {
          $this.val('');
        }
      });
    };
    
    var disableSubmit = function($frm) {
      $frm.submit(function() {
        e.preventDefault();
      });
    };
    
    var _optionArrToSet = function(obj) {
      var set = {};
      if (typeof obj === 'string') {
        set[obj] = true;
      } else if (Array.isArray(obj)) {
        $.each(obj, function(i, v) {
          set[v] = true;
        });
      }
      return set;
    }
    
    return {
      bind: bind,
      serializeObject: serializeObject,
      reset: reset,
      disableSubmit: disableSubmit
    };
  })();
  /*
  brv.Vue = (function() {
    var create = function(el, options) {
      if ($(el).length > 0) {
        return new Vue($.extend({ el: el }, options));
      } else {
        return null;
      }
    };

    return {
      create: create
    };
  })();
  */
  brv.Page = (function() {
    var initialize = function(controllerName, fnInit) {
      $(function() {
        var $controller = $('[data-controller="'+controllerName+'"]');
        if ($controller.length > 0) {
          fnInit();
        }
      });
    };
    return {
      initialize: initialize
    };
  })();
})(window.brv);