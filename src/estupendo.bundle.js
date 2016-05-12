(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {
  }

  // Use polyfill for setImmediate for performance gains
  var asap = (typeof setImmediate === 'function' && setImmediate) ||
    function (fn) {
      setTimeoutFunc(fn, 1);
    };

  var onUnhandledRejection = function onUnhandledRejection(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    asap(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      setTimeout(function() {
        if (!self._handled) {
          onUnhandledRejection(self._value);
        }
      }, 1);
    }
    
    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new Promise(noop);
    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @private
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    asap = fn;
  };
  
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    onUnhandledRejection = fn;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(this);

},{}],3:[function(require,module,exports){
(function (process,global){
(function (thisVar, undefined) {
	'use strict';
	var main = (typeof window === 'object' && window) || (typeof global === 'object' && global) ||
		typeof self === 'object' && self || thisVar;

	var hasSetImmediate = typeof setImmediate === 'function';
	var hasNextTick = typeof process === 'object' && !!process && typeof process.nextTick === 'function';
	var index = 0;

	function getNewIndex() {
		if (index === 9007199254740991) {
			return 0;
		}
		return ++index;
	}

	var setAsap = (function () {
		var hiddenDiv, scriptEl, timeoutFn, callbacks;

		// Modern browsers, fastest async
		if (main.MutationObserver) {
			return function setAsap(callback) {
				hiddenDiv = document.createElement("div");
				(new MutationObserver(function() {
					callback();
					hiddenDiv = null;
				})).observe(hiddenDiv, { attributes: true });
				hiddenDiv.setAttribute('i', '1');
			};

		// Browsers that support postMessage
		} else if (!hasSetImmediate && main.postMessage && !main.importScripts && main.addEventListener) {

			var MESSAGE_PREFIX = "com.setImmediate" + Math.random();
			callbacks = {};

			var onGlobalMessage = function (event) {
				if (event.source === main && event.data.indexOf(MESSAGE_PREFIX) === 0) {
					var i = event.data.split(':')[1];
					callbacks[i]();
					delete callbacks[i];
				}
			};

			main.addEventListener("message", onGlobalMessage, false);

			return function setAsap(callback) {
				var i = getNewIndex();
				callbacks[i] = callback;
				main.postMessage(MESSAGE_PREFIX + ':' + i, "*");
			};

			// IE browsers without postMessage
		} else if (!hasSetImmediate && main.document && 'onreadystatechange' in document.createElement('script')) {

			return function setAsap(callback) {
				scriptEl = document.createElement("script");
				scriptEl.onreadystatechange = function onreadystatechange() {
					scriptEl.onreadystatechange = null;
					scriptEl.parentNode.removeChild(scriptEl);
					scriptEl = null;
					callback();
				};
				document.body.appendChild(scriptEl);
			};

		// All other browsers and node
		} else {

			timeoutFn = (hasSetImmediate && setImmediate) || (hasNextTick && process.nextTick) || setTimeout;
			return function setAsap(callback) {
				timeoutFn(callback);
			};
		}

	})();

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = setAsap;
	} else if (typeof require !== 'undefined' && require.amd) {
		define(function () {
			return setAsap;
		});
	} else {
		main.setAsap = setAsap;
	}
})(this);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":1}],4:[function(require,module,exports){

(function(){
    "use strict";

    // Get dependencies
    var _legacy    = require('./lib/legacy');
    var _worker    = require('./lib/worker');
    var _estupendo;


    // Abort if require is already defined
    if( 'require' in window ){
        throw new Error('Estupendo ERROR: window.require is already defined');
    }

    // Abort if require is already defined
    if( 'estupendo' in window ){
        throw new Error('Estupendo ERROR: window.estupendo is already defined');
    }


    // Define global estupendo object
    if(window.Worker)
        _estupendo = window.estupendo = _legacy;
    else
        _estupendo = window.estupendo = _legacy;

    // Register global require function
    window.require = _estupendo.require;

})();




// DEV //////////////////////////////////////////////////////////

var arrDiff = window.require('arr-diff');

// console.log('SCRIPT:', script);

var a = ['a', 'b', 'c', 'd'];
var b = ['b', 'c'];

console.log(arrDiff(a, b));

},{"./lib/legacy":5,"./lib/worker":8}],5:[function(require,module,exports){

// Get transport utility
var _transport = require('./transport');

// Module store
var _modules = {};

module.exports = {

    require: function(modId){

        // Fetch?
        if( modId in _modules)
            return _modules[modId];

        // Fetch
        var modSrc = _transport.get(modId);

        // Wrap module
        var wrapped = "window.estupendo.run('"
            + modId
            + "',"
            + "function(module){"
            + modSrc
            + " return module; });";


        var scriptNode = document.createElement("script");
        var headNode   = document.querySelector('head');

        scriptNode.id        = modId;
        scriptNode.innerHTML = wrapped;
        scriptNode.type      = "text\/javascript";

        // Insert into DOM and run module
        headNode.appendChild(scriptNode);

        // DEV: In time?
        return _modules[modId];
    },

    run: function(modId, modFn){

        // Is module known?
        if( modId in _modules )
            return;

        // Define module object
        var module = {};

        // Run module
        var exported = modFn(module);

        // Analyze module && store pointer
        if( 'exports' in exported && exported.exports)
            _modules[modId] = exported.exports;
        else
            _modules[modId] = exported;
    }
}
},{"./transport":7}],6:[function(require,module,exports){

var status = module.exports = {
    '200': function(){
        "use strict";

        // XXX
        // console.log('<<< 200');

        try{
            return JSON.parse(this.responseText);
        }catch(e){
            return [this.responseText];
        }
    },
    '304': function(){
        "use strict";

        // XXX
        console.log('<<< 304');

        try{
            return JSON.parse(this.responseText);
        }catch(e){
            return this.responseText;
        }
    },
    '404': function(){
        "use strict";

        // XXX
        console.log('<<< 404: Not found!');

        try{
            return JSON.parse(this.responseText);
        }catch(e){
            return this.responseText;
        }
    }
};
},{}],7:[function(require,module,exports){

var status = require('./status');

module.exports = {
    get: function(target){
        "use strict";

        var _xhr    = new XMLHttpRequest();
        var _method = 'GET';
        var _url    = encodeURI('modules/' + target + '/index.js');
        var _async  = false;

        // Open sync connection
        _xhr.open(_method, _url, _async);
        _xhr.send(null);

        // Known status code?
        if( !(_xhr.status in status) )
            throw new Error('Estupendo ERROR: unknown status code');


        // Handle response
        return status[_xhr.status].call(_xhr);
    }
};
},{"./status":6}],8:[function(require,module,exports){

var Promise = require('promise-polyfill');
var setAsap = require('setasap');
    Promise._setImmediateFn(setAsap);

// Module store
var _modules = {};

module.exports = {

    require: function(modId){
        "use strict";

        // Fetch?
        if( modId in _modules)
            return _modules[modId];

        // XXX
        console.log('>>> Running worker require');
    },

    run: function(modId, modFn){
        "use strict";

    }
};
},{"promise-polyfill":2,"setasap":3}]},{},[4]);
