/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 126);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ },
/* 1 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;
	var sourceMap = obj.sourceMap;

	if (media) {
		styleElement.setAttribute("media", media);
	}

	if (sourceMap) {
		// https://developer.chrome.com/devtools/docs/javascript-debugging
		// this makes source maps inside style tags work properly in Chrome
		css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */';
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

/**
 * vuex v2.0.0
 * (c) 2016 Evan You
 * @license MIT
 */
(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Vuex = factory());
}(this, (function () { 'use strict';

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook

  devtoolHook.emit('vuex:init', store)

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState)
  })

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state)
  })
}

function applyMixin (Vue) {
  var version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    var usesInit = Vue.config._lifecycleHooks.indexOf('init') > -1
    Vue.mixin(usesInit ? { init: vuexInit } : { beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options
    // store injection
    if (options.store) {
      this.$store = options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}

function mapState (states) {
  var res = {}
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      return typeof val === 'function'
        ? val.call(this, this.$store.state, this.$store.getters)
        : this.$store.state[val]
    }
  })
  return res
}

function mapMutations (mutations) {
  var res = {}
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return this.$store.commit.apply(this.$store, [val].concat(args))
    }
  })
  return res
}

function mapGetters (getters) {
  var res = {}
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedGetter () {
      if (!(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val))
      }
      return this.$store.getters[val]
    }
  })
  return res
}

function mapActions (actions) {
  var res = {}
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return this.$store.dispatch.apply(this.$store, [val].concat(args))
    }
  })
  return res
}

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Vue // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  assert(Vue, "must call Vue.use(Vuex) before creating a store instance.")
  assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.")

  var state = options.state; if ( state === void 0 ) state = {};
  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  // store internal state
  this._options = options
  this._committing = false
  this._actions = Object.create(null)
  this._mutations = Object.create(null)
  this._wrappedGetters = Object.create(null)
  this._runtimeModules = Object.create(null)
  this._subscribers = []
  this._watcherVM = new Vue()

    // bind commit and dispatch to self
  var store = this
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  }

  // strict mode
  this.strict = strict

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], options)

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state)

  // apply plugins
  plugins.concat(devtoolPlugin).forEach(function (plugin) { return plugin(this$1); })
};

var prototypeAccessors = { state: {} };

prototypeAccessors.state.get = function () {
  return this._vm.state
};

prototypeAccessors.state.set = function (v) {
  assert(false, "Use store.replaceState() to explicit replace store state.")
};

Store.prototype.commit = function commit (type, payload, options) {
    var this$1 = this;

  // check object-style commit
  if (isObject(type) && type.type) {
    options = payload
    payload = type
    type = type.type
  }
  var mutation = { type: type, payload: payload }
  var entry = this._mutations[type]
  if (!entry) {
    console.error(("[vuex] unknown mutation type: " + type))
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload)
    })
  })
  if (!options || !options.silent) {
    this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); })
  }
};

Store.prototype.dispatch = function dispatch (type, payload) {
  // check object-style dispatch
  if (isObject(type) && type.type) {
    payload = type
    type = type.type
  }
  var entry = this._actions[type]
  if (!entry) {
    console.error(("[vuex] unknown action type: " + type))
    return
  }
  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  var subs = this._subscribers
  if (subs.indexOf(fn) < 0) {
    subs.push(fn)
  }
  return function () {
    var i = subs.indexOf(fn)
    if (i > -1) {
      subs.splice(i, 1)
    }
  }
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  assert(typeof getter === 'function', "store.watch only accepts a function.")
  return this._watcherVM.$watch(function () { return getter(this$1.state); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm.state = state
  })
};

Store.prototype.registerModule = function registerModule (path, module) {
  if (typeof path === 'string') { path = [path] }
  assert(Array.isArray(path), "module path must be a string or an Array.")
  this._runtimeModules[path.join('.')] = module
  installModule(this, this.state, path, module)
  // reset store to update getters...
  resetStoreVM(this, this.state)
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path] }
  assert(Array.isArray(path), "module path must be a string or an Array.")
    delete this._runtimeModules[path.join('.')]
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1))
    Vue.delete(parentState, path[path.length - 1])
  })
  resetStore(this)
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  updateModule(this._options, newOptions)
  resetStore(this)
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing
  this._committing = true
  fn()
  this._committing = committing
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function updateModule (targetModule, newModule) {
  if (newModule.actions) {
    targetModule.actions = newModule.actions
  }
  if (newModule.mutations) {
    targetModule.mutations = newModule.mutations
  }
  if (newModule.getters) {
    targetModule.getters = newModule.getters
  }
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!(targetModule.modules && targetModule.modules[key])) {
        console.warn(
          "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
          'manual reload is needed'
        )
        return
      }
      updateModule(targetModule.modules[key], newModule.modules[key])
    }
  }
}

function resetStore (store) {
  store._actions = Object.create(null)
  store._mutations = Object.create(null)
  store._wrappedGetters = Object.create(null)
  var state = store.state
  // init root module
  installModule(store, state, [], store._options, true)
  // init all runtime modules
  Object.keys(store._runtimeModules).forEach(function (key) {
    installModule(store, state, key.split('.'), store._runtimeModules[key], true)
  })
  // reset vm
  resetStoreVM(store, state)
}

function resetStoreVM (store, state) {
  var oldVm = store._vm

  // bind store public getters
  store.getters = {}
  var wrappedGetters = store._wrappedGetters
  var computed = {}
  Object.keys(wrappedGetters).forEach(function (key) {
    var fn = wrappedGetters[key]
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); }
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; }
    })
  })

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent
  Vue.config.silent = true
  store._vm = new Vue({
    data: { state: state },
    computed: computed
  })
  Vue.config.silent = silent

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store)
  }

  if (oldVm) {
    // dispatch changes in all subscribed watchers
    // to force getter re-evaluation.
    store._withCommit(function () {
      oldVm.state = null
    })
    Vue.nextTick(function () { return oldVm.$destroy(); })
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length
  var state = module.state;
  var actions = module.actions;
  var mutations = module.mutations;
  var getters = module.getters;
  var modules = module.modules;

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1))
    var moduleName = path[path.length - 1]
    store._withCommit(function () {
      Vue.set(parentState, moduleName, state || {})
    })
  }

  if (mutations) {
    Object.keys(mutations).forEach(function (key) {
      registerMutation(store, key, mutations[key], path)
    })
  }

  if (actions) {
    Object.keys(actions).forEach(function (key) {
      registerAction(store, key, actions[key], path)
    })
  }

  if (getters) {
    wrapGetters(store, getters, path)
  }

  if (modules) {
    Object.keys(modules).forEach(function (key) {
      installModule(store, rootState, path.concat(key), modules[key], hot)
    })
  }
}

function registerMutation (store, type, handler, path) {
  if ( path === void 0 ) path = [];

  var entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    handler(getNestedState(store.state, path), payload)
  })
}

function registerAction (store, type, handler, path) {
  if ( path === void 0 ) path = [];

  var entry = store._actions[type] || (store._actions[type] = [])
  var dispatch = store.dispatch;
  var commit = store.commit;
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler({
      dispatch: dispatch,
      commit: commit,
      getters: store.getters,
      state: getNestedState(store.state, path),
      rootState: store.state
    }, payload, cb)
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}

function wrapGetters (store, moduleGetters, modulePath) {
  Object.keys(moduleGetters).forEach(function (getterKey) {
    var rawGetter = moduleGetters[getterKey]
    if (store._wrappedGetters[getterKey]) {
      console.error(("[vuex] duplicate getter key: " + getterKey))
      return
    }
    store._wrappedGetters[getterKey] = function wrappedGetter (store) {
      return rawGetter(
        getNestedState(store.state, modulePath), // local state
        store.getters, // getters
        store.state // root state
      )
    }
  })
}

function enableStrictMode (store) {
  store._vm.$watch('state', function () {
    assert(store._committing, "Do not mutate vuex store state outside mutation handlers.")
  }, { deep: true, sync: true })
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function install (_Vue) {
  if (Vue) {
    console.error(
      '[vuex] already installed. Vue.use(Vuex) should be called only once.'
    )
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

var index = {
  Store: Store,
  install: install,
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions
}

return index;

})));

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(108)

/* script */
__vue_exports__ = __webpack_require__(17)

/* template */
var __vue_template__ = __webpack_require__(87)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "ico.png?3164bb6ebb33928f5049323b083c39e4";

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

/*!
 * Vue.js v2.0.3
 * (c) 2014-2016 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Vue = factory());
}(this, (function () { 'use strict';

/*  */

/**
 * Convert a value to a string that is actually rendered.
 */
function _toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val, 10);
  return (n || n === 0) ? n : val
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Remove an item from an array
 */
function remove$1 (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  }
}

/**
 * Camelize a hyphen-delmited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind$1 (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 */
function noop () {}

/**
 * Always return false.
 */
var no = function () { return false; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  /* eslint-disable eqeqeq */
  return a == b || (
    isObject(a) && isObject(b)
      ? JSON.stringify(a) === JSON.stringify(b)
      : false
  )
  /* eslint-enable eqeqeq */
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/*  */

var config = {
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: null,

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * List of asset types that a component can own.
   */
  _assetTypes: [
    'component',
    'directive',
    'filter'
  ],

  /**
   * List of lifecycle hooks.
   */
  _lifecycleHooks: [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated'
  ],

  /**
   * Max circular updates allowed in a scheduler flush cycle.
   */
  _maxUpdateCount: 100,

  /**
   * Server rendering?
   */
  _isServer: "client" === 'server'
};

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w\.\$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  } else {
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]];
      }
      return obj
    }
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser =
  typeof window !== 'undefined' &&
  Object.prototype.toString.call(window) !== '[object Object]';

var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return /native code/.test(Ctor.toString())
}

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(nextTickHandler);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var func = ctx
      ? function () { cb.call(ctx); }
      : cb;
    callbacks.push(func);
    if (!pending) {
      pending = true;
      timerFunc();
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] !== undefined
    };
    Set.prototype.add = function add (key) {
      this.set[key] = 1;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/* not type checking this file because flow doesn't play well with Proxy */

var hasProxy;
var proxyHandlers;
var initProxy;

{
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  proxyHandlers = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warn(
          "Property or method \"" + key + "\" is not defined on the instance but " +
          "referenced during render. Make sure to declare reactive data " +
          "properties in the data option.",
          target
        );
      }
      return has || !isAllowed
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      vm._renderProxy = new Proxy(vm, proxyHandlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */


var uid$2 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid$2++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove$1(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stablize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */


var queue = [];
var has$1 = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  queue.length = 0;
  has$1 = {};
  {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    var watcher = queue[index];
    var id = watcher.id;
    has$1[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("development" !== 'production' && has$1[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > config._maxUpdateCount) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }

  resetSchedulerState();
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has$1[id] == null) {
    has$1[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i >= 0 && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$1 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  if ( options === void 0 ) options = {};

  this.vm = vm;
  vm._watchers.push(this);
  // options
  this.deep = !!options.deep;
  this.user = !!options.user;
  this.lazy = !!options.lazy;
  this.sync = !!options.sync;
  this.expression = expOrFn.toString();
  this.cb = cb;
  this.id = ++uid$1; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "development" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value = this.getter.call(this.vm, this.vm);
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value);
  }
  popTarget();
  this.cleanupDeps();
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
      if (
        value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          "development" !== 'production' && warn(
            ("Error in watcher \"" + (this.expression) + "\""),
            this.vm
          );
          /* istanbul ignore else */
          if (config.errorHandler) {
            config.errorHandler.call(null, e, this.vm);
          } else {
            throw e
          }
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subcriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed or is performing a v-for
    // re-render (the watcher list is then filtered by v-for).
    if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
      remove$1(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val, seen) {
  var i, keys;
  if (!seen) {
    seen = seenObjects;
    seen.clear();
  }
  var isA = Array.isArray(val);
  var isO = isObject(val);
  if ((isA || isO) && Object.isExtensible(val)) {
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return
      } else {
        seen.add(depId);
      }
    }
    if (isA) {
      i = val.length;
      while (i--) { traverse(val[i], seen); }
    } else if (isO) {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) { traverse(val[keys[i]], seen); }
    }
  }
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var arguments$1 = arguments;

    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length;
    var args = new Array(i);
    while (i--) {
      args[i] = arguments$1[i];
    }
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
        inserted = args;
        break
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true,
  isSettingProps: false
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 *
 * istanbul ignore next
 */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !config._isServer &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      if (newVal === value) {
        return
      }
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (obj, key, val) {
  if (Array.isArray(obj)) {
    obj.splice(key, 1, val);
    return val
  }
  if (hasOwn(obj, key)) {
    obj[key] = val;
    return
  }
  var ob = obj.__ob__;
  if (obj._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return
  }
  if (!ob) {
    obj[key] = val;
    return
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (obj, key) {
  var ob = obj.__ob__;
  if (obj._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(obj, key)) {
    return
  }
  delete obj[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = void 0, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

function initState (vm) {
  vm._watchers = [];
  initProps(vm);
  initData(vm);
  initComputed(vm);
  initMethods(vm);
  initWatch(vm);
}

function initProps (vm) {
  var props = vm.$options.props;
  if (props) {
    var propsData = vm.$options.propsData || {};
    var keys = vm.$options._propKeys = Object.keys(props);
    var isRoot = !vm.$parent;
    // root instance props should be converted
    observerState.shouldConvert = isRoot;
    var loop = function ( i ) {
      var key = keys[i];
      /* istanbul ignore else */
      {
        defineReactive$$1(vm, key, validateProp(key, props, propsData, vm), function () {
          if (vm.$parent && !observerState.isSettingProps) {
            warn(
              "Avoid mutating a prop directly since the value will be " +
              "overwritten whenever the parent component re-renders. " +
              "Instead, use a data or computed property based on the prop's " +
              "value. Prop being mutated: \"" + key + "\"",
              vm
            );
          }
        });
      }
    };

    for (var i = 0; i < keys.length; i++) loop( i );
    observerState.shouldConvert = true;
  }
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? data.call(vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object.',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var i = keys.length;
  while (i--) {
    if (props && hasOwn(props, keys[i])) {
      "development" !== 'production' && warn(
        "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else {
      proxy(vm, keys[i]);
    }
  }
  // observe data
  observe(data);
  data.__ob__ && data.__ob__.vmCount++;
}

var computedSharedDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function initComputed (vm) {
  var computed = vm.$options.computed;
  if (computed) {
    for (var key in computed) {
      var userDef = computed[key];
      if (typeof userDef === 'function') {
        computedSharedDefinition.get = makeComputedGetter(userDef, vm);
        computedSharedDefinition.set = noop;
      } else {
        computedSharedDefinition.get = userDef.get
          ? userDef.cache !== false
            ? makeComputedGetter(userDef.get, vm)
            : bind$1(userDef.get, vm)
          : noop;
        computedSharedDefinition.set = userDef.set
          ? bind$1(userDef.set, vm)
          : noop;
      }
      Object.defineProperty(vm, key, computedSharedDefinition);
    }
  }
}

function makeComputedGetter (getter, owner) {
  var watcher = new Watcher(owner, getter, noop, {
    lazy: true
  });
  return function computedGetter () {
    if (watcher.dirty) {
      watcher.evaluate();
    }
    if (Dep.target) {
      watcher.depend();
    }
    return watcher.value
  }
}

function initMethods (vm) {
  var methods = vm.$options.methods;
  if (methods) {
    for (var key in methods) {
      vm[key] = methods[key] == null ? noop : bind$1(methods[key], vm);
      if ("development" !== 'production' && methods[key] == null) {
        warn(
          "method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
    }
  }
}

function initWatch (vm) {
  var watch = vm.$options.watch;
  if (watch) {
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }
}

function createWatcher (vm, key, handler) {
  var options;
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  vm.$watch(key, handler, options);
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () {
    return this._data
  };
  {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

function proxy (vm, key) {
  if (!isReserved(key)) {
    Object.defineProperty(vm, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter () {
        return vm._data[key]
      },
      set: function proxySetter (val) {
        vm._data[key] = val;
      }
    });
  }
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  ns,
  context,
  componentOptions
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = ns;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.child = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
};

var emptyVNode = function () {
  var node = new VNode();
  node.text = '';
  node.isComment = true;
  return node
};

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.ns,
    vnode.context,
    vnode.componentOptions
  );
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isCloned = true;
  return cloned
}

function cloneVNodes (vnodes) {
  var res = new Array(vnodes.length);
  for (var i = 0; i < vnodes.length; i++) {
    res[i] = cloneVNode(vnodes[i]);
  }
  return res
}

/*  */

function mergeVNodeHook (def, hookKey, hook, key) {
  key = key + hookKey;
  var injectedHash = def.__injected || (def.__injected = {});
  if (!injectedHash[key]) {
    injectedHash[key] = true;
    var oldHook = def[hookKey];
    if (oldHook) {
      def[hookKey] = function () {
        oldHook.apply(this, arguments);
        hook.apply(this, arguments);
      };
    } else {
      def[hookKey] = hook;
    }
  }
}

/*  */

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, fn, event, capture;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    if (!cur) {
      "development" !== 'production' && warn(
        "Invalid handler for event \"" + name + "\": got " + String(cur),
        vm
      );
    } else if (!old) {
      capture = name.charAt(0) === '!';
      event = capture ? name.slice(1) : name;
      if (Array.isArray(cur)) {
        add(event, (cur.invoker = arrInvoker(cur)), capture);
      } else {
        if (!cur.invoker) {
          fn = cur;
          cur = on[name] = {};
          cur.fn = fn;
          cur.invoker = fnInvoker(cur);
        }
        add(event, cur.invoker, capture);
      }
    } else if (cur !== old) {
      if (Array.isArray(old)) {
        old.length = cur.length;
        for (var i = 0; i < old.length; i++) { old[i] = cur[i]; }
        on[name] = old;
      } else {
        old.fn = cur;
        on[name] = old;
      }
    }
  }
  for (name in oldOn) {
    if (!on[name]) {
      event = name.charAt(0) === '!' ? name.slice(1) : name;
      remove$$1(event, oldOn[name].invoker);
    }
  }
}

function arrInvoker (arr) {
  return function (ev) {
    var arguments$1 = arguments;

    var single = arguments.length === 1;
    for (var i = 0; i < arr.length; i++) {
      single ? arr[i](ev) : arr[i].apply(null, arguments$1);
    }
  }
}

function fnInvoker (o) {
  return function (ev) {
    var single = arguments.length === 1;
    single ? o.fn(ev) : o.fn.apply(null, arguments);
  }
}

/*  */

function normalizeChildren (
  children,
  ns,
  nestedIndex
) {
  if (isPrimitive(children)) {
    return [createTextVNode(children)]
  }
  if (Array.isArray(children)) {
    var res = [];
    for (var i = 0, l = children.length; i < l; i++) {
      var c = children[i];
      var last = res[res.length - 1];
      //  nested
      if (Array.isArray(c)) {
        res.push.apply(res, normalizeChildren(c, ns, ((nestedIndex || '') + "_" + i)));
      } else if (isPrimitive(c)) {
        if (last && last.text) {
          last.text += String(c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else if (c instanceof VNode) {
        if (c.text && last && last.text) {
          last.text += c.text;
        } else {
          // inherit parent namespace
          if (ns) {
            applyNS(c, ns);
          }
          // default key for nested array children (likely generated by v-for)
          if (c.tag && c.key == null && nestedIndex != null) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res
  }
}

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

function applyNS (vnode, ns) {
  if (vnode.tag && !vnode.ns) {
    vnode.ns = ns;
    if (vnode.children) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        applyNS(vnode.children[i], ns);
      }
    }
  }
}

/*  */

function getFirstComponentChild (children) {
  return children && children.filter(function (c) { return c && c.componentOptions; })[0]
}

/*  */

var activeInstance = null;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._mount = function (
    el,
    hydrating
  ) {
    var vm = this;
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = emptyVNode;
      {
        /* istanbul ignore if */
        if (vm.$options.template) {
          warn(
            'You are using the runtime-only build of Vue where the template ' +
            'option is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
            vm
          );
        } else {
          warn(
            'Failed to mount component: template or render function not defined.',
            vm
          );
        }
      }
    }
    callHook(vm, 'beforeMount');
    vm._watcher = new Watcher(vm, function () {
      vm._update(vm._render(), hydrating);
    }, noop);
    hydrating = false;
    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  };

  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    var prevVnode = vm._vnode;
    vm._vnode = vnode;
    if (!prevVnode) {
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating);
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    if (vm._isMounted) {
      callHook(vm, 'updated');
    }
  };

  Vue.prototype._updateFromParent = function (
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {
    var vm = this;
    var hasChildren = !!(vm.$options._renderChildren || renderChildren);
    vm.$options._parentVnode = parentVnode;
    vm.$options._renderChildren = renderChildren;
    // update props
    if (propsData && vm.$options.props) {
      observerState.shouldConvert = false;
      {
        observerState.isSettingProps = true;
      }
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        vm[key] = validateProp(key, vm.$options.props, propsData, vm);
      }
      observerState.shouldConvert = true;
      {
        observerState.isSettingProps = false;
      }
    }
    // update listeners
    if (listeners) {
      var oldListeners = vm.$options._parentListeners;
      vm.$options._parentListeners = listeners;
      vm._updateListeners(listeners, oldListeners);
    }
    // resolve slots + force update if has children
    if (hasChildren) {
      vm.$slots = resolveSlots(renderChildren, vm._renderContext);
      vm.$forceUpdate();
    }
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove$1(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
  };
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      handlers[i].call(vm);
    }
  }
  vm.$emit('hook:' + hook);
}

/*  */

var hooks = { init: init, prepatch: prepatch, insert: insert, destroy: destroy$1 };
var hooksToMerge = Object.keys(hooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (!Ctor) {
    return
  }

  if (isObject(Ctor)) {
    Ctor = Vue$3.extend(Ctor);
  }

  if (typeof Ctor !== 'function') {
    {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  if (!Ctor.cid) {
    if (Ctor.resolved) {
      Ctor = Ctor.resolved;
    } else {
      Ctor = resolveAsyncComponent(Ctor, function () {
        // it's ok to queue this on every render because
        // $forceUpdate is buffered by the scheduler.
        context.$forceUpdate();
      });
      if (!Ctor) {
        // return nothing if this is indeed an async component
        // wait for the callback to trigger parent update.
        return
      }
    }
  }

  data = data || {};

  // extract props
  var propsData = extractProps(data, Ctor);

  // functional component
  if (Ctor.options.functional) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  data.on = data.nativeOn;

  if (Ctor.options.abstract) {
    // abstract components do not keep anything
    // other than props & listeners
    data = {};
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }
  );
  return vnode
}

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  context,
  children
) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (propOptions) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData);
    }
  }
  var vnode = Ctor.options.render.call(
    null,
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    bind$1(createElement, { _self: Object.create(context) }),
    {
      props: props,
      data: data,
      parent: context,
      children: normalizeChildren(children),
      slots: function () { return resolveSlots(children, context); }
    }
  );
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (inlineTemplate) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function init (vnode, hydrating) {
  if (!vnode.child || vnode.child._isDestroyed) {
    var child = vnode.child = createComponentInstanceForVnode(vnode, activeInstance);
    child.$mount(hydrating ? vnode.elm : undefined, hydrating);
  }
}

function prepatch (
  oldVnode,
  vnode
) {
  var options = vnode.componentOptions;
  var child = vnode.child = oldVnode.child;
  child._updateFromParent(
    options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
  );
}

function insert (vnode) {
  if (!vnode.child._isMounted) {
    vnode.child._isMounted = true;
    callHook(vnode.child, 'mounted');
  }
  if (vnode.data.keepAlive) {
    vnode.child._inactive = false;
    callHook(vnode.child, 'activated');
  }
}

function destroy$1 (vnode) {
  if (!vnode.child._isDestroyed) {
    if (!vnode.data.keepAlive) {
      vnode.child.$destroy();
    } else {
      vnode.child._inactive = true;
      callHook(vnode.child, 'deactivated');
    }
  }
}

function resolveAsyncComponent (
  factory,
  cb
) {
  if (factory.requested) {
    // pool callbacks
    factory.pendingCallbacks.push(cb);
  } else {
    factory.requested = true;
    var cbs = factory.pendingCallbacks = [cb];
    var sync = true;

    var resolve = function (res) {
      if (isObject(res)) {
        res = Vue$3.extend(res);
      }
      // cache resolved
      factory.resolved = res;
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        for (var i = 0, l = cbs.length; i < l; i++) {
          cbs[i](res);
        }
      }
    };

    var reject = function (reason) {
      "development" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
    };

    var res = factory(resolve, reject);

    // handle promise
    if (res && typeof res.then === 'function' && !factory.resolved) {
      res.then(resolve, reject);
    }

    sync = false;
    // return in case resolved synchronously
    return factory.resolved
  }
}

function extractProps (data, Ctor) {
  // we are only extrating raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (!propOptions) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  var domProps = data.domProps;
  if (attrs || props || domProps) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey) ||
      checkProp(res, domProps, key, altKey);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (hash) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = hooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (a, b) {
  // since all hooks have at most two args, use fixed args
  // to avoid having to use fn.apply().
  return function (_, __) {
    a(_, __);
    b(_, __);
  }
}

/*  */

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  tag,
  data,
  children
) {
  if (data && (Array.isArray(data) || typeof data !== 'object')) {
    children = data;
    data = undefined;
  }
  // make sure to use real instance instead of proxy as context
  return _createElement(this._self, tag, data, children)
}

function _createElement (
  context,
  tag,
  data,
  children
) {
  if (data && data.__ob__) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return emptyVNode()
  }
  if (typeof tag === 'string') {
    var Ctor;
    var ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      return new VNode(
        tag, data, normalizeChildren(children, ns),
        undefined, undefined, ns, context
      )
    } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      return createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      return new VNode(
        tag, data, normalizeChildren(children, ns),
        undefined, undefined, ns, context
      )
    }
  } else {
    // direct component options / constructor
    return createComponent(tag, data, context, children)
  }
}

/*  */

function initRender (vm) {
  vm.$vnode = null; // the placeholder node in parent tree
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  vm._renderContext = vm.$options._parentVnode && vm.$options._parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, vm._renderContext);
  // bind the public createElement fn to this instance
  // so that we get proper render context inside it.
  vm.$createElement = bind$1(createElement, vm);
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
}

function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    nextTick(fn, this);
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
      }
    }

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      {
        warn(("Error when rendering " + (formatComponentName(vm)) + ":"));
      }
      /* istanbul ignore else */
      if (config.errorHandler) {
        config.errorHandler.call(null, e, vm);
      } else {
        if (config._isServer) {
          throw e
        } else {
          setTimeout(function () { throw e }, 0);
        }
      }
      // return previous vnode to prevent render error causing blank component
      vnode = vm._vnode;
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = emptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };

  // shorthands used in render functions
  Vue.prototype._h = createElement;
  // toString for mustaches
  Vue.prototype._s = _toString;
  // number conversion
  Vue.prototype._n = toNumber;
  // empty vnode
  Vue.prototype._e = emptyVNode;
  // loose equal
  Vue.prototype._q = looseEqual;
  // loose indexOf
  Vue.prototype._i = looseIndexOf;

  // render static tree by index
  Vue.prototype._m = function renderStatic (
    index,
    isInFor
  ) {
    var tree = this._staticTrees[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree by doing a shallow clone.
    if (tree && !isInFor) {
      return Array.isArray(tree)
        ? cloneVNodes(tree)
        : cloneVNode(tree)
    }
    // otherwise, render a fresh tree.
    tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(this._renderProxy);
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (typeof tree[i] !== 'string') {
          tree[i].isStatic = true;
          tree[i].key = "__static__" + index + "_" + i;
        }
      }
    } else {
      tree.isStatic = true;
      tree.key = "__static__" + index;
    }
    return tree
  };

  // filter resolution helper
  var identity = function (_) { return _; };
  Vue.prototype._f = function resolveFilter (id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  };

  // render v-for
  Vue.prototype._l = function renderList (
    val,
    render
  ) {
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
    return ret
  };

  // renderSlot
  Vue.prototype._t = function (
    name,
    fallback
  ) {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && "development" !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  };

  // apply v-bind object
  Vue.prototype._b = function bindProps (
    data,
    value,
    asProp
  ) {
    if (value) {
      if (!isObject(value)) {
        "development" !== 'production' && warn(
          'v-bind without argument expects an Object or Array value',
          this
        );
      } else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        for (var key in value) {
          if (key === 'class' || key === 'style') {
            data[key] = value[key];
          } else {
            var hash = asProp || config.mustUseProp(key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
            hash[key] = value[key];
          }
        }
      }
    }
    return data
  };

  // expose v-on keyCodes
  Vue.prototype._k = function getKeyCodes (key) {
    return config.keyCodes[key]
  };
}

function resolveSlots (
  renderChildren,
  context
) {
  var slots = {};
  if (!renderChildren) {
    return slots
  }
  var children = normalizeChildren(renderChildren) || [];
  var defaultSlot = [];
  var name, child;
  for (var i = 0, l = children.length; i < l; i++) {
    child = children[i];
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
        child.data && (name = child.data.slot)) {
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore single whitespace
  if (defaultSlot.length && !(
    defaultSlot.length === 1 &&
    (defaultSlot[0].text === ' ' || defaultSlot[0].isComment)
  )) {
    slots.default = defaultSlot;
  }
  return slots
}

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  var on = bind$1(vm.$on, vm);
  var off = bind$1(vm.$off, vm);
  vm._updateListeners = function (listeners, oldListeners) {
    updateListeners(listeners, oldListeners || {}, on, off, vm);
  };
  if (listeners) {
    vm._updateListeners(listeners);
  }
}

function eventsMixin (Vue) {
  Vue.prototype.$on = function (event, fn) {
    var vm = this;(vm._events[event] || (vm._events[event] = [])).push(fn);
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        cbs[i].apply(vm, args);
      }
    }
    return vm
  };
}

/*  */

var uid = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid++;
    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      initProxy(vm);
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    callHook(vm, 'beforeCreate');
    initState(vm);
    callHook(vm, 'created');
    initRender(vm);
  };

  function initInternalComponent (vm, options) {
    var opts = vm.$options = Object.create(resolveConstructorOptions(vm));
    // doing this because it's faster than dynamic enumeration.
    opts.parent = options.parent;
    opts.propsData = options.propsData;
    opts._parentVnode = options._parentVnode;
    opts._parentListeners = options._parentListeners;
    opts._renderChildren = options._renderChildren;
    opts._componentTag = options._componentTag;
    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions (vm) {
    var Ctor = vm.constructor;
    var options = Ctor.options;
    if (Ctor.super) {
      var superOptions = Ctor.super.options;
      var cachedSuperOptions = Ctor.superOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed
        Ctor.superOptions = superOptions;
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
        if (options.name) {
          options.components[options.name] = Ctor;
        }
      }
    }
    return options
  }
}

function Vue$3 (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue$3)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

var warn = noop;
var formatComponentName;

{
  var hasConsole = typeof console !== 'undefined';

  warn = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.error("[Vue warn]: " + msg + " " + (
        vm ? formatLocation(formatComponentName(vm)) : ''
      ));
    }
  };

  formatComponentName = function (vm) {
    if (vm.$root === vm) {
      return 'root instance'
    }
    var name = vm._isVue
      ? vm.$options.name || vm.$options._componentTag
      : vm.name;
    return (
      (name ? ("component <" + name + ">") : "anonymous component") +
      (vm._isVue && vm.$options.__file ? (" at " + (vm.$options.__file)) : '')
    )
  };

  var formatLocation = function (str) {
    if (str === 'anonymous component') {
      str += " - use the \"name\" option for better debugging messages.";
    }
    return ("\n(found in " + str + ")")
  };
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
{
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  var key, toVal, fromVal;
  for (key in from) {
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isObject(toVal) && isObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (typeof childVal !== 'function') {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        childVal.call(this),
        parentVal.call(this)
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
};

/**
 * Hooks and param attributes are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

config._lifecycleHooks.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

config._assetTypes.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  /* istanbul ignore if */
  if (!childVal) { return parentVal }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.computed = function (parentVal, childVal) {
  if (!childVal) { return parentVal }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  extend(ret, childVal);
  return ret
};

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Make sure component options get converted to actual
 * constructors.
 */
function normalizeComponents (options) {
  if (options.components) {
    var components = options.components;
    var def;
    for (var key in components) {
      var lower = key.toLowerCase();
      if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
        "development" !== 'production' && warn(
          'Do not use built-in or reserved HTML elements as component ' +
          'id: ' + key
        );
        continue
      }
      def = components[key];
      if (isPlainObject(def)) {
        components[key] = Vue$3.extend(def);
      }
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  normalizeComponents(child);
  normalizeProps(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = typeof extendsFrom === 'function'
      ? mergeOptions(parent, extendsFrom.options, vm)
      : mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      var mixin = child.mixins[i];
      if (mixin.prototype instanceof Vue$3) {
        mixin = mixin.options;
      }
      parent = mergeOptions(parent, mixin, vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  var res = assets[id] ||
    // camelCase ID
    assets[camelize(id)] ||
    // Pascal Case ID
    assets[capitalize(camelize(id))];
  if ("development" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isBooleanType(prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, name) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (isObject(def)) {
    "development" !== 'production' && warn(
      'Invalid default value for prop "' + name + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // call factory function for non-Function types
  return typeof def === 'function' && prop.type !== Function
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType);
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      'Invalid prop: type check failed for prop "' + name + '".' +
      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

/**
 * Assert the type of a value
 */
function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (expectedType === 'String') {
    valid = typeof value === (expectedType = 'string');
  } else if (expectedType === 'Number') {
    valid = typeof value === (expectedType = 'number');
  } else if (expectedType === 'Boolean') {
    valid = typeof value === (expectedType = 'boolean');
  } else if (expectedType === 'Function') {
    valid = typeof value === (expectedType = 'function');
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match && match[1]
}

function isBooleanType (fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === 'Boolean'
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === 'Boolean') {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}



var util = Object.freeze({
	defineReactive: defineReactive$$1,
	_toString: _toString,
	toNumber: toNumber,
	makeMap: makeMap,
	isBuiltInTag: isBuiltInTag,
	remove: remove$1,
	hasOwn: hasOwn,
	isPrimitive: isPrimitive,
	cached: cached,
	camelize: camelize,
	capitalize: capitalize,
	hyphenate: hyphenate,
	bind: bind$1,
	toArray: toArray,
	extend: extend,
	isObject: isObject,
	isPlainObject: isPlainObject,
	toObject: toObject,
	noop: noop,
	no: no,
	genStaticKeys: genStaticKeys,
	looseEqual: looseEqual,
	looseIndexOf: looseIndexOf,
	isReserved: isReserved,
	def: def,
	parsePath: parsePath,
	hasProto: hasProto,
	inBrowser: inBrowser,
	UA: UA,
	isIE: isIE,
	isIE9: isIE9,
	isEdge: isEdge,
	isAndroid: isAndroid,
	isIOS: isIOS,
	devtools: devtools,
	nextTick: nextTick,
	get _Set () { return _Set; },
	mergeOptions: mergeOptions,
	resolveAsset: resolveAsset,
	get warn () { return warn; },
	get formatComponentName () { return formatComponentName; },
	validateProp: validateProp
});

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    /* istanbul ignore if */
    if (plugin.installed) {
      return
    }
    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else {
      plugin.apply(null, args);
    }
    plugin.installed = true;
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    Vue.options = mergeOptions(Vue.options, mixin);
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var isFirstExtend = Super.cid === 0;
    if (isFirstExtend && extendOptions._Ctor) {
      return extendOptions._Ctor
    }
    var name = extendOptions.name || Super.options.name;
    {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characaters and the hyphen.'
        );
        name = null;
      }
    }
    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;
    // allow further extension
    Sub.extend = Super.extend;
    // create asset registers, so extended classes
    // can have their private assets too.
    config._assetTypes.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }
    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    // cache constructor
    if (isFirstExtend) {
      extendOptions._Ctor = Sub;
    }
    return Sub
  };
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  config._assetTypes.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = Vue.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,
  created: function created () {
    this.cache = Object.create(null);
  },
  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    if (vnode && vnode.componentOptions) {
      var opts = vnode.componentOptions;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? opts.Ctor.cid + '::' + opts.tag
        : vnode.key;
      if (this.cache[key]) {
        vnode.child = this.cache[key].child;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode
  },
  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this.cache) {
      var vnode = this$1.cache[key];
      callHook(vnode.child, 'deactivated');
      vnode.child.$destroy();
    }
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);
  Vue.util = util;
  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  config._assetTypes.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: function () { return config._isServer; }
});

Vue$3.version = '2.0.3';

/*  */

// attributes that should be using props for binding
var mustUseProp = makeMap('value,selected,checked,muted');

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var isAttr = makeMap(
  'accept,accept-charset,accesskey,action,align,alt,async,autocomplete,' +
  'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,' +
  'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,' +
  'name,contenteditable,contextmenu,controls,coords,data,datetime,default,' +
  'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,' +
  'form,formaction,headers,<th>,height,hidden,high,href,hreflang,http-equiv,' +
  'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,' +
  'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,' +
  'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,' +
  'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,' +
  'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,' +
  'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,' +
  'target,title,type,usemap,value,width,wrap'
);



var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (childNode.child) {
    childNode = childNode.child._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return genClassFromData(data)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: child.class
      ? [child.class, parent.class]
      : parent.class
  }
}

function genClassFromData (data) {
  var dynamicClass = data.class;
  var staticClass = data.staticClass;
  if (staticClass || dynamicClass) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  var res = '';
  if (!value) {
    return res
  }
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (value[i]) {
        if ((stringified = stringifyClass(value[i]))) {
          res += stringified + ' ';
        }
      }
    }
    return res.slice(0, -1)
  }
  if (isObject(value)) {
    for (var key in value) {
      if (value[key]) { res += key + ' '; }
    }
    return res.slice(0, -1)
  }
  /* istanbul ignore next */
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template'
);

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr',
  true
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source',
  true
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track',
  true
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font,' +
  'font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selector = el;
    el = document.querySelector(el);
    if (!el) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + selector
      );
      return document.createElement('div')
    }
  }
  return el
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  if (vnode.data && vnode.data.attrs && 'multiple' in vnode.data.attrs) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function childNodes (node) {
  return node.childNodes
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	childNodes: childNodes,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.child || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove$1(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (Array.isArray(refs[key])) {
        refs[key].push(ref);
      } else {
        refs[key] = [ref];
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks$1 = ['create', 'update', 'remove', 'destroy'];

function isUndef (s) {
  return s == null
}

function isDef (s) {
  return s != null
}

function sameVnode (vnode1, vnode2) {
  return (
    vnode1.key === vnode2.key &&
    vnode1.tag === vnode2.tag &&
    vnode1.isComment === vnode2.isComment &&
    !vnode1.data === !vnode2.data
  )
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks$1.length; ++i) {
    cbs[hooks$1[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (modules[j][hooks$1[i]] !== undefined) { cbs[hooks$1[i]].push(modules[j][hooks$1[i]]); }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeElement(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeElement (el) {
    var parent = nodeOps.parentNode(el);
    nodeOps.removeChild(parent, el);
  }

  function createElm (vnode, insertedVnodeQueue, nested) {
    var i;
    var data = vnode.data;
    vnode.isRootInsert = !nested;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode); }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(i = vnode.child)) {
        initComponent(vnode, insertedVnodeQueue);
        return vnode.elm
      }
    }
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      {
        if (
          !vnode.ns &&
          !(config.ignoredElements && config.ignoredElements.indexOf(tag) > -1) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);
      createChildren(vnode, children, insertedVnodeQueue);
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
      }
    } else if (vnode.isComment) {
      vnode.elm = nodeOps.createComment(vnode.text);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
    }
    return vnode.elm
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        nodeOps.appendChild(vnode.elm, createElm(children[i], insertedVnodeQueue, true));
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.child) {
      vnode = vnode.child._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (i.create) { i.create(emptyNode, vnode); }
      if (i.insert) { insertedVnodeQueue.push(vnode); }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (vnode.data.pendingInsert) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
    }
    vnode.elm = vnode.child.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.context) && isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
    if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      nodeOps.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          nodeOps.removeChild(parentElm, ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (rm || isDef(vnode.data)) {
      var listeners = cbs.remove.length + 1;
      if (!rm) {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      } else {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.child) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeElement(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) { // New element
          nodeOps.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if ("development" !== 'production' && !elmToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (elmToMove.tag !== newStartVnode.tag) {
            // same key but different element. treat as new element
            nodeOps.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }
    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (vnode.isStatic &&
        oldVnode.isStatic &&
        vnode.key === oldVnode.key &&
        vnode.isCloned) {
      vnode.elm = oldVnode.elm;
      return
    }
    var i;
    var data = vnode.data;
    var hasData = isDef(data);
    if (hasData && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }
    var elm = vnode.elm = oldVnode.elm;
    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (hasData && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (hasData) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (initial && vnode.parent) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  function hydrate (elm, vnode, insertedVnodeQueue) {
    {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.child)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        var childNodes = nodeOps.childNodes(elm);
        // empty element, allow client to pick up and populate children
        if (!childNodes.length) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          var childrenMatch = true;
          if (childNodes.length !== children.length) {
            childrenMatch = false;
          } else {
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!hydrate(childNodes[i$1], children[i$1], insertedVnodeQueue)) {
                childrenMatch = false;
                break
              }
            }
          }
          if (!childrenMatch) {
            if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !bailed) {
              bailed = true;
              console.warn('Parent: ', elm);
              console.warn('Mismatching childNodes vs. VNodes: ', childNodes, children);
            }
            return false
          }
        }
      }
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
      }
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (vnode.tag) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag === nodeOps.tagName(node).toLowerCase()
      )
    } else {
      return _toString(vnode.text) === node.data
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (!vnode) {
      if (oldVnode) { invokeDestroyHook(oldVnode); }
      return
    }

    var elm, parent;
    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (!oldVnode) {
      // empty mount, create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute('server-rendered')) {
            oldVnode.removeAttribute('server-rendered');
            hydrating = true;
          }
          if (hydrating) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        elm = oldVnode.elm;
        parent = nodeOps.parentNode(elm);

        createElm(vnode, insertedVnodeQueue);

        // component root element replaced.
        // update parent placeholder node element.
        if (vnode.parent) {
          vnode.parent.elm = vnode.elm;
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent);
            }
          }
        }

        if (parent !== null) {
          nodeOps.insertBefore(parent, vnode.elm, nodeOps.nextSibling(elm));
          removeVnodes(parent, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (
  oldVnode,
  vnode
) {
  if (!oldVnode.data.directives && !vnode.data.directives) {
    return
  }
  var isCreate = oldVnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      dirsWithInsert.forEach(function (dir) {
        callHook$1(dir, 'inserted', vnode, oldVnode);
      });
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert, 'dir-insert');
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      dirsWithPostpatch.forEach(function (dir) {
        callHook$1(dir, 'componentUpdated', vnode, oldVnode);
      });
    }, 'dir-postpatch');
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    fn(vnode.elm, dir, vnode, oldVnode);
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  if (!oldVnode.data.attrs && !vnode.data.attrs) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (attrs.__ob__) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  for (key in oldAttrs) {
    if (attrs[key] == null) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, key);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (!data.staticClass && !data.class &&
      (!oldData || (!oldData.staticClass && !oldData.class))) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (transitionClass) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

// skip type checking this file because we need to attach private properties
// to elements

function updateDOMListeners (oldVnode, vnode) {
  if (!oldVnode.data.on && !vnode.data.on) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  var add = vnode.elm._v_add || (vnode.elm._v_add = function (event, handler, capture) {
    vnode.elm.addEventListener(event, handler, capture);
  });
  var remove = vnode.elm._v_remove || (vnode.elm._v_remove = function (event, handler) {
    vnode.elm.removeEventListener(event, handler);
  });
  updateListeners(on, oldOn, add, remove, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (!oldVnode.data.domProps && !vnode.data.domProps) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (props.__ob__) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (props[key] == null) {
      elm[key] = undefined;
    }
  }
  for (key in props) {
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if ((key === 'textContent' || key === 'innerHTML') && vnode.children) {
      vnode.children.length = 0;
    }
    cur = props[key];
    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = cur == null ? '' : String(cur);
      if (elm.value !== strCur && !elm.composing) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var prefixes = ['Webkit', 'Moz', 'ms'];

var testEl;
var normalize = cached(function (prop) {
  testEl = testEl || document.createElement('div');
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in testEl.style)) {
    return prop
  }
  var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < prefixes.length; i++) {
    var prefixed = prefixes[i] + upper;
    if (prefixed in testEl.style) {
      return prefixed
    }
  }
});

function updateStyle (oldVnode, vnode) {
  if ((!oldVnode.data || !oldVnode.data.style) && !vnode.data.style) {
    return
  }
  var cur, name;
  var el = vnode.elm;
  var oldStyle = oldVnode.data.style || {};
  var style = vnode.data.style || {};

  // handle string
  if (typeof style === 'string') {
    el.style.cssText = style;
    return
  }

  var needClone = style.__ob__;

  // handle array syntax
  if (Array.isArray(style)) {
    style = vnode.data.style = toObject(style);
  }

  // clone the style for future updates,
  // in case the user mutates the style object in-place.
  if (needClone) {
    style = vnode.data.style = extend({}, style);
  }

  for (name in oldStyle) {
    if (style[name] == null) {
      el.style[normalize(name)] = '';
    }
  }
  for (name in style) {
    cur = style[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      el.style[normalize(name)] = cur == null ? '' : cur;
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' ';
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' ';
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    el.setAttribute('class', cur.trim());
  }
}

/*  */

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

var raf = (inBrowser && window.requestAnimationFrame) || setTimeout;
function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  (el._transitionClasses || (el._transitionClasses = [])).push(cls);
  addClass(el, cls);
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove$1(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitioneDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitioneDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode) {
  var el = vnode.elm;

  // call leave callback now
  if (el._leaveCb) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (!data) {
    return
  }

  /* istanbul ignore if */
  if (el._enterCb || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var transitionNode = activeInstance.$vnode;
  var context = transitionNode && transitionNode.parent
    ? transitionNode.parent.context
    : activeInstance;

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear ? appearClass : enterClass;
  var activeClass = isAppear ? appearActiveClass : enterActiveClass;
  var beforeEnterHook = isAppear ? (beforeAppear || beforeEnter) : beforeEnter;
  var enterHook = isAppear ? (typeof appear === 'function' ? appear : enter) : enter;
  var afterEnterHook = isAppear ? (afterAppear || afterEnter) : afterEnter;
  var enterCancelledHook = isAppear ? (appearCancelled || enterCancelled) : enterCancelled;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl =
    enterHook &&
    // enterHook may be a bound method which exposes
    // the length of original fn as _length
    (enterHook._length || enterHook.length) > 1;

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    }, 'transition-insert');
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        whenTransitionEnds(el, type, cb);
      }
    });
  }

  if (vnode.data.show) {
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (el._enterCb) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (!data) {
    return rm()
  }

  /* istanbul ignore if */
  if (el._leaveCb || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl =
    leave &&
    // leave hook may be a bound method which exposes
    // the length of original fn as _length
    (leave._length || leave.length) > 1;

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          whenTransitionEnds(el, type, cb);
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    leaveClass: (name + "-leave"),
    appearClass: (name + "-enter"),
    enterActiveClass: (name + "-enter-active"),
    leaveActiveClass: (name + "-leave-active"),
    appearActiveClass: (name + "-enter-active")
  }
});

function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn();
    }
  }
}

var transition = inBrowser ? {
  create: function create (_, vnode) {
    if (!vnode.data.show) {
      enter(vnode);
    }
  },
  remove: function remove (vnode, rm) {
    /* istanbul ignore else */
    if (!vnode.data.show) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch$1 = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

var modelableTagRE = /^input|select|textarea|vue-component-[0-9]+(-[0-9a-zA-Z_\-]*)?$/;

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model = {
  inserted: function inserted (el, binding, vnode) {
    {
      if (!modelableTagRE.test(vnode.tag)) {
        warn(
          "v-model is not supported on element type: <" + (vnode.tag) + ">. " +
          'If you are working with contenteditable, it\'s recommended to ' +
          'wrap a library dedicated for that purpose inside a custom component.',
          vnode.context
        );
      }
    }
    if (vnode.tag === 'select') {
      var cb = function () {
        setSelected(el, binding, vnode.context);
      };
      cb();
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(cb, 0);
      }
    } else if (
      (vnode.tag === 'textarea' || el.type === 'text') &&
      !binding.modifiers.lazy
    ) {
      if (!isAndroid) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
      }
      /* istanbul ignore if */
      if (isIE9) {
        el.vmodel = true;
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matchig
      // option in the DOM.
      var needReset = el.multiple
        ? binding.value.some(function (v) { return hasNoMatchingOption(v, el.options); })
        : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
      if (needReset) {
        trigger(el, 'change');
      }
    }
  }
};

function setSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  for (var i = 0, l = options.length; i < l; i++) {
    if (looseEqual(getValue(options[i]), value)) {
      return false
    }
  }
  return true
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.child && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.child._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    if (value && transition && !isIE9) {
      enter(vnode);
    }
    var originalDisplay = el.style.display === 'none' ? '' : el.style.display;
    el.style.display = value ? originalDisplay : 'none';
    el.__vOriginalDisplay = originalDisplay;
  },
  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    if (transition && !isIE9) {
      if (value) {
        enter(vnode);
        el.style.display = el.__vOriginalDisplay;
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  }
};

var platformDirectives = {
  model: model,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recrusively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1].fn;
  }
  return data
}

function placeholder (h, rawChild) {
  return /\d-keep-alive$/.test(rawChild.tag)
    ? h('keep-alive')
    : null
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,
  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag; });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("development" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("development" !== 'production' &&
        mode && mode !== 'in-out' && mode !== 'out-in') {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    var key = child.key = child.key == null || child.isStatic
      ? ("__v" + (child.tag + this._uid) + "__")
      : child.key;
    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (oldChild && oldChild.data && oldChild.key !== key) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);

      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        }, key);
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave, key);
        mergeVNodeHook(data, 'enterCancelled', performLeave, key);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) {
          delayedLeave = leave;
        }, key);
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final disired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else {
          var opts = c.componentOptions;
          var name = opts
            ? (opts.Ctor.options.name || opts.tag)
            : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || (this.name + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var f = document.body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      if (this._hasMove != null) {
        return this._hasMove
      }
      addTransitionClass(el, moveClass);
      var info = getTransitionInfo(el);
      removeTransitionClass(el, moveClass);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.isUnknownElement = isUnknownElement;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.mustUseProp = mustUseProp;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = config._isServer ? noop : patch$1;

// wrap mount
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && !config._isServer ? query(el) : undefined;
  return this._mount(el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if (
      "development" !== 'production' &&
      inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)
    ) {
      console.log(
        'Download the Vue Devtools for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
}, 0);

/*  */

// check whether current browser encodes a char inside attribute values
function shouldDecode (content, encoded) {
  var div = document.createElement('div');
  div.innerHTML = "<div a=\"" + content + "\">";
  return div.innerHTML.indexOf(encoded) > 0
}

// #3663
// IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false;

/*  */

var decoder = document.createElement('div');

function decode (html) {
  decoder.innerHTML = html;
  return decoder.textContent
}

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var singleAttrIdentifier = /([^\s"'<>\/=]+)/;
var singleAttrAssign = /(?:=)/;
var singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source
];
var attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
);

// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
var startTagOpen = new RegExp('^<' + qnameCapture);
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
var doctype = /^<!DOCTYPE [^>]+>/i;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isSpecialTag = makeMap('script,style', true);

var reCache = {};

var ltRE = /&lt;/g;
var gtRE = /&gt;/g;
var nlRE = /&#10;/g;
var ampRE = /&amp;/g;
var quoteRE = /&quot;/g;

function decodeAttr (value, shouldDecodeNewlines) {
  if (shouldDecodeNewlines) {
    value = value.replace(nlRE, '\n');
  }
  return value
    .replace(ltRE, '<')
    .replace(gtRE, '>')
    .replace(ampRE, '&')
    .replace(quoteRE, '"')
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a script or style element
    if (!lastTag || !isSpecialTag(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (/^<!--/.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (/^<!\[/.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[0], endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          continue
        }
      }

      var text = void 0;
      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
        advance(textEnd);
      } else {
        text = html;
        html = '';
      }

      if (options.chars) {
        options.chars(text);
      }
    } else {
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var endTagLength = 0;
      var rest = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (stackedTag !== 'script' && stackedTag !== 'style' && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest.length;
      html = rest;
      parseEndTag('</' + stackedTag + '>', stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      throw new Error('Error parsing template:\n\n' + html)
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag('', lastTag);
      }
      if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
        parseEndTag('', tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      attrs[i] = {
        name: args[1],
        value: decodeAttr(
          value,
          options.shouldDecodeNewlines
        )
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, attrs: attrs });
      lastTag = tagName;
      unarySlash = '';
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tag, tagName, start, end) {
    var pos;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    // Find the closest opened tag of the same type
    if (tagName) {
      var needle = tagName.toLowerCase();
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].tag.toLowerCase() === needle) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (tagName.toLowerCase() === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (tagName.toLowerCase() === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      // check single quote
      if (c === 0x27 && prev !== 0x5C) { inSingle = !inSingle; }
    } else if (inDouble) {
      // check double quote
      if (c === 0x22 && prev !== 0x5C) { inDouble = !inDouble; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break // "
        case 0x27: inSingle = true; break // '
        case 0x28: paren++; break         // (
        case 0x29: paren--; break         // )
        case 0x5B: square++; break        // [
        case 0x5D: square--; break        // ]
        case 0x7B: curly++; break         // {
        case 0x7D: curly--; break         // }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});

function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue parser]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important
) {
  // check capture modifier
  if (modifiers && modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  var events;
  if (modifiers && modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }
  var newHandler = { value: value, modifiers: modifiers };
  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return dynamicValue
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

function getAndRemoveAttr (el, name) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  return val
}

/*  */

var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /\(([^,]*),([^,]*)(?:,([^,]*))?\)/;
var bindRE = /^:|^v-bind:/;
var onRE = /^@|^v-on:/;
var argRE = /:(.*)$/;
var modifierRE = /\.[^\.]+/g;
var specialNewlineRE = /\u2028|\u2029/g;

var decodeHTMLCached = cached(decode);

// configurable state
var warn$1;
var platformGetTagNamespace;
var platformMustUseProp;
var platformIsPreTag;
var preTransforms;
var transforms;
var postTransforms;
var delimiters;

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$1 = options.warn || baseWarn;
  platformGetTagNamespace = options.getTagNamespace || no;
  platformMustUseProp = options.mustUseProp || no;
  platformIsPreTag = options.isPreTag || no;
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  transforms = pluckModuleFunction(options.modules, 'transformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
  delimiters = options.delimiters;
  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;
  parseHTML(template, {
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (options.isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = {
        type: 1,
        tag: tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs, options.isIE),
        parent: currentParent,
        children: []
      };
      if (ns) {
        element.ns = ns;
      }

      if ("client" !== 'server' && isForbiddenTag(element)) {
        element.forbidden = true;
        "development" !== 'production' && warn$1(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">."
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        preTransforms[i](element, options);
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else {
        processFor(element);
        processIf(element);
        processOnce(element);
        processKey(element);

        // determine whether this is a plain element after
        // removing structural attributes
        element.plain = !element.key && !attrs.length;

        processRef(element);
        processSlot(element);
        processComponent(element);
        for (var i$1 = 0; i$1 < transforms.length; i$1++) {
          transforms[i$1](element, options);
        }
        processAttrs(element);
      }

      function checkRootConstraints (el) {
        {
          if (el.tag === 'slot' || el.tag === 'template') {
            warn$1(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes:\n' + template
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warn$1(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements:\n' + template
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if ("development" !== 'production' && !stack.length && !warned) {
        // allow 2 root elements with v-if and v-else
        if (root.if && element.else) {
          checkRootConstraints(element);
          root.elseBlock = element;
        } else {
          warned = true;
          warn$1(
            ("Component template should contain exactly one root element:\n\n" + template)
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.else) {
          processElse(element, currentParent);
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      }
      // apply post-transforms
      for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
        postTransforms[i$2](element, options);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ') {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      // check pre state
      if (element.pre) {
        inVPre = false;
      }
      if (platformIsPreTag(element.tag)) {
        inPre = false;
      }
    },

    chars: function chars (text) {
      if (!currentParent) {
        if ("development" !== 'production' && !warned && text === template) {
          warned = true;
          warn$1(
            'Component template requires a root element, rather than just text:\n\n' + template
          );
        }
        return
      }
      text = inPre || text.trim()
        ? decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && currentParent.children.length ? ' ' : '';
      if (text) {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          currentParent.children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } else {
          // #3895 special character
          text = text.replace(specialNewlineRE, '');
          currentParent.children.push({
            type: 3,
            text: text
          });
        }
      }
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if ("development" !== 'production' && el.tag === 'template') {
      warn$1("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      "development" !== 'production' && warn$1(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim();
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
  }
  if (getAndRemoveAttr(el, 'v-else') != null) {
    el.else = true;
  }
}

function processElse (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    prev.elseBlock = el;
  } else {
    warn$1(
      ("v-else used on element <" + (el.tag) + "> without corresponding v-if.")
    );
  }
}

function processOnce (el) {
  var once = getAndRemoveAttr(el, 'v-once');
  if (once != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
  } else {
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget;
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, arg, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        if (modifiers && modifiers.prop) {
          isProp = true;
          name = camelize(name);
          if (name === 'innerHtml') { name = 'innerHTML'; }
        }
        if (isProp || platformMustUseProp(name)) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        if (argMatch && (arg = argMatch[1])) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      {
        var expression = parseText(value, delimiters);
        if (expression) {
          warn$1(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been deprecated. ' +
            'Use v-bind or the colon shorthand instead.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs, isIE) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if ("development" !== 'production' && map[attrs[i].name] && !isIE) {
      warn$1('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].tag) { return children[i] }
  }
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizier: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || (function () { return false; });
  // first pass: mark all non-static nodes.
  markStatic(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic(child);
      if (!child.static) {
        node.static = false;
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.once || node.static) {
      node.staticRoot = true;
      node.staticInFor = isInFor;
      return
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: 'if($event.target !== $event.currentTarget)return;'
};

function genHandlers (events, native) {
  var res = native ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    res += "\"" + name + "\":" + (genHandler(events[name])) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  handler
) {
  if (!handler) {
    return 'function(){}'
  } else if (Array.isArray(handler)) {
    return ("[" + (handler.map(genHandler).join(',')) + "]")
  } else if (!handler.modifiers) {
    return simplePathRE.test(handler.value)
      ? handler.value
      : ("function($event){" + (handler.value) + "}")
  } else {
    var code = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        code += modifierCode[key];
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code = genKeyFilter(keys) + code;
    }
    var handlerCode = simplePathRE.test(handler.value)
      ? handler.value + '($event)'
      : handler.value;
    return 'function($event){' + code + handlerCode + '}'
  }
}

function genKeyFilter (keys) {
  var code = keys.length === 1
    ? normalizeKeyCode(keys[0])
    : Array.prototype.concat.apply([], keys.map(normalizeKeyCode));
  if (Array.isArray(code)) {
    return ("if(" + (code.map(function (c) { return ("$event.keyCode!==" + c); }).join('&&')) + ")return;")
  } else {
    return ("if($event.keyCode!==" + code + ")return;")
  }
}

function normalizeKeyCode (key) {
  return (
    parseInt(key, 10) || // number keyCode
    keyCodes[key] || // built-in alias
    ("_k(" + (JSON.stringify(key)) + ")") // custom alias
  )
}

/*  */

function bind$2 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + "," + (dir.value) + (dir.modifiers && dir.modifiers.prop ? ',true' : '') + ")")
  };
}

var baseDirectives = {
  bind: bind$2,
  cloak: noop
};

/*  */

// configurable state
var warn$2;
var transforms$1;
var dataGenFns;
var platformDirectives$1;
var staticRenderFns;
var currentOptions;

function generate (
  ast,
  options
) {
  // save previous staticRenderFns so generate calls can be nested
  var prevStaticRenderFns = staticRenderFns;
  var currentStaticRenderFns = staticRenderFns = [];
  currentOptions = options;
  warn$2 = options.warn || baseWarn;
  transforms$1 = pluckModuleFunction(options.modules, 'transformCode');
  dataGenFns = pluckModuleFunction(options.modules, 'genData');
  platformDirectives$1 = options.directives || {};
  var code = ast ? genElement(ast) : '_h("div")';
  staticRenderFns = prevStaticRenderFns;
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: currentStaticRenderFns
  }
}

function genElement (el) {
  if (el.staticRoot && !el.staticProcessed) {
    // hoist static sub-trees out
    el.staticProcessed = true;
    staticRenderFns.push(("with(this){return " + (genElement(el)) + "}"));
    return ("_m(" + (staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
  } else if (el.for && !el.forProcessed) {
    return genFor(el)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el);
    } else {
      var data = genData(el);
      var children = el.inlineTemplate ? null : genChildren(el);
      code = "_h('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < transforms$1.length; i++) {
      code = transforms$1[i](el, code);
    }
    return code
  }
}

function genIf (el) {
  var exp = el.if;
  el.ifProcessed = true; // avoid recursion
  return ("(" + exp + ")?" + (genElement(el)) + ":" + (genElse(el)))
}

function genElse (el) {
  return el.elseBlock
    ? genElement(el.elseBlock)
    : '_e()'
}

function genFor (el) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genElement(el)) +
    '})'
}

function genData (el) {
  if (el.plain) {
    return
  }

  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // slot target
  if (el.slotTarget) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // module data generation functions
  for (var i = 0; i < dataGenFns.length; i++) {
    data += dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true)) + ",";
  }
  // inline-template
  if (el.inlineTemplate) {
    var ast = el.children[0];
    if ("development" !== 'production' && (
      el.children.length > 1 || ast.type !== 1
    )) {
      warn$2('Inline-template components must have exactly one child element.');
    }
    if (ast.type === 1) {
      var inlineRenderFns = generate(ast, currentOptions);
      data += "inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  return data
}

function genDirectives (el) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = platformDirectives$1[dir.name] || baseDirectives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, warn$2);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genChildren (el) {
  if (el.children.length) {
    return '[' + el.children.map(genNode).join(',') + ']'
  }
}

function genNode (node) {
  if (node.type === 1) {
    return genElement(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : JSON.stringify(text.text)
}

function genSlot (el) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el);
  return children
    ? ("_t(" + slotName + "," + children + ")")
    : ("_t(" + slotName + ")")
}

function genComponent (el) {
  var children = el.inlineTemplate ? null : genChildren(el);
  return ("_h(" + (el.component) + "," + (genData(el)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    res += "\"" + (prop.name) + "\":" + (prop.value) + ",";
  }
  return res.slice(0, -1)
}

/*  */

/**
 * Compile a template.
 */
function compile$1 (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  optimize(ast, options);
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
}

/*  */

// operators like typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');
// check valid identifier for v-for
var identRE = /[A-Za-z_$][\w$]*/;
// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (ident, type, text, errors) {
  if (typeof ident === 'string' && !identRE.test(ident)) {
    errors.push(("- invalid " + type + " \"" + ident + "\" in expression: " + text));
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "- avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\" in expression " + text
      );
    } else {
      errors.push(("- invalid expression: " + text));
    }
  }
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("development" !== 'production' && staticClass) {
    var expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been deprecated. ' +
        'Use v-bind or the colon shorthand instead.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData$1
};

/*  */

function transformNode$1 (el) {
  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$2 (el) {
  return el.styleBinding
    ? ("style:(" + (el.styleBinding) + "),")
    : ''
}

var style$1 = {
  transformNode: transformNode$1,
  genData: genData$2
};

var modules$1 = [
  klass$1,
  style$1
];

/*  */

var warn$3;

function model$1 (
  el,
  dir,
  _warn
) {
  warn$3 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;
  {
    var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (tag === 'input' && dynamicType) {
      warn$3(
        "<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" +
        "v-model does not support dynamic input types. Use v-if branches instead."
      );
    }
  }
  if (tag === 'select') {
    genSelect(el, value);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value);
  } else {
    genDefaultModel(el, value, modifiers);
  }
  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (el, value) {
  if ("development" !== 'production' &&
    el.attrsMap.checked != null) {
    warn$3(
      "<" + (el.tag) + " v-model=\"" + value + "\" checked>:\n" +
      "inline checked attributes will be ignored when using v-model. " +
      'Declare initial values in the component\'s data option instead.'
    );
  }
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
      "?_i(" + value + "," + valueBinding + ")>-1" +
      ":_q(" + value + "," + trueValueBinding + ")"
  );
  addHandler(el, 'change',
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + valueBinding + "," +
          '$$i=_i($$a,$$v);' +
      "if($$c){$$i<0&&(" + value + "=$$a.concat($$v))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + value + "=$$c}",
    null, true
  );
}

function genRadioModel (el, value) {
  if ("development" !== 'production' &&
    el.attrsMap.checked != null) {
    warn$3(
      "<" + (el.tag) + " v-model=\"" + value + "\" checked>:\n" +
      "inline checked attributes will be ignored when using v-model. " +
      'Declare initial values in the component\'s data option instead.'
    );
  }
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, 'change', (value + "=" + valueBinding), null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  {
    if (el.tag === 'input' && el.attrsMap.value) {
      warn$3(
        "<" + (el.tag) + " v-model=\"" + value + "\" value=\"" + (el.attrsMap.value) + "\">:\n" +
        'inline value attributes will be ignored when using v-model. ' +
        'Declare initial values in the component\'s data option instead.'
      );
    }
    if (el.tag === 'textarea' && el.children.length) {
      warn$3(
        "<textarea v-model=\"" + value + "\">:\n" +
        'inline content inside <textarea> will be ignored when using v-model. ' +
        'Declare initial values in the component\'s data option instead.'
      );
    }
  }

  var type = el.attrsMap.type;
  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var event = lazy || (isIE && type === 'range') ? 'change' : 'input';
  var needCompositionGuard = !lazy && type !== 'range';
  var isNative = el.tag === 'input' || el.tag === 'textarea';

  var valueExpression = isNative
    ? ("$event.target.value" + (trim ? '.trim()' : ''))
    : "$event";
  var code = number || type === 'number'
    ? (value + "=_n(" + valueExpression + ")")
    : (value + "=" + valueExpression);
  if (isNative && needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }
  // inputs with type="file" are read only and setting the input's
  // value will throw an error.
  if ("development" !== 'production' &&
      type === 'file') {
    warn$3(
      "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
      "File inputs are read only. Use a v-on:change listener instead."
    );
  }
  addProp(el, 'value', isNative ? ("_s(" + value + ")") : ("(" + value + ")"));
  addHandler(el, event, code, null, true);
}

function genSelect (el, value) {
  {
    el.children.some(checkOptionWarning);
  }
  var code = value + "=Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){return \"_value\" in o ? o._value : o.value})" +
    (el.attrsMap.multiple == null ? '[0]' : '');
  addHandler(el, 'change', code, null, true);
}

function checkOptionWarning (option) {
  if (option.type === 1 &&
    option.tag === 'option' &&
    option.attrsMap.selected != null) {
    warn$3(
      "<select v-model=\"" + (option.parent.attrsMap['v-model']) + "\">:\n" +
      'inline selected attributes on <option> will be ignored when using v-model. ' +
      'Declare initial values in the component\'s data option instead.'
    );
    return true
  }
  return false
}

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model$1,
  text: text,
  html: html
};

/*  */

var cache = Object.create(null);

var baseOptions = {
  isIE: isIE,
  expectHTML: true,
  modules: modules$1,
  staticKeys: genStaticKeys(modules$1),
  directives: directives$1,
  isReservedTag: isReservedTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  getTagNamespace: getTagNamespace,
  isPreTag: isPreTag
};

function compile$$1 (
  template,
  options
) {
  options = options
    ? extend(extend({}, baseOptions), options)
    : baseOptions;
  return compile$1(template, options)
}

function compileToFunctions (
  template,
  options,
  vm
) {
  var _warn = (options && options.warn) || warn;
  // detect possible CSP restriction
  /* istanbul ignore if */
  {
    try {
      new Function('return 1');
    } catch (e) {
      if (e.toString().match(/unsafe-eval|CSP/)) {
        _warn(
          'It seems you are using the standalone build of Vue.js in an ' +
          'environment with Content Security Policy that prohibits unsafe-eval. ' +
          'The template compiler cannot work in this environment. Consider ' +
          'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
          'templates into render functions.'
        );
      }
    }
  }
  var key = options && options.delimiters
    ? String(options.delimiters) + template
    : template;
  if (cache[key]) {
    return cache[key]
  }
  var res = {};
  var compiled = compile$$1(template, options);
  res.render = makeFunction(compiled.render);
  var l = compiled.staticRenderFns.length;
  res.staticRenderFns = new Array(l);
  for (var i = 0; i < l; i++) {
    res.staticRenderFns[i] = makeFunction(compiled.staticRenderFns[i]);
  }
  {
    if (res.render === noop || res.staticRenderFns.some(function (fn) { return fn === noop; })) {
      _warn(
        "failed to compile template:\n\n" + template + "\n\n" +
        detectErrors(compiled.ast).join('\n') +
        '\n\n',
        vm
      );
    }
  }
  return (cache[key] = res)
}

function makeFunction (code) {
  try {
    return new Function(code)
  } catch (e) {
    return noop
  }
}

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue$3.prototype.$mount;
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "development" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      var ref = compileToFunctions(template, {
        warn: warn,
        shouldDecodeNewlines: shouldDecodeNewlines,
        delimiters: options.delimiters
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue$3.compile = compileToFunctions;

return Vue$3;

})));


/***/ },
/* 6 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ADD_NUMBER = exports.ADD_NUMBER = 'ADD_NUMBER';
var Set_indexData = exports.Set_indexData = 'Set_indexData';
var Set_user_info = exports.Set_user_info = 'Set_user_info';
var Set_user_orders = exports.Set_user_orders = 'Set_user_orders';
var Set_orders_banner = exports.Set_orders_banner = 'Set_orders_banner';
var Set_order_info = exports.Set_order_info = 'Set_order_info';
var Set_goods_info = exports.Set_goods_info = 'Set_goods_info';
var Set_waller_data = exports.Set_waller_data = 'Set_waller_data';
var Set_evnlop_data = exports.Set_evnlop_data = 'Set_evnlop_data';

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(118)

/* script */
__vue_exports__ = __webpack_require__(16)

/* template */
var __vue_template__ = __webpack_require__(97)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(125)

/* script */
__vue_exports__ = __webpack_require__(18)

/* template */
var __vue_template__ = __webpack_require__(104)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vue = __webpack_require__(5);

var _vue2 = _interopRequireDefault(_vue);

var _vueResource = __webpack_require__(105);

var _vueResource2 = _interopRequireDefault(_vueResource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueResource2.default);

exports.default = {
    data: {
        // serviceHost : 'http://192.168.0.10:8090/api/'
        serviceHost: 'http://api.udui.cn:8090/api'
    },
    getDataVue: function getDataVue(url, options) {
        return _vue2.default.http.get(url, options);
    },
    postDataVue: function postDataVue(url, data, options) {
        _vue2.default.http.options.emulateJSON = true;
        return _vue2.default.http.post(url, data, options);
    },
    patchDataVue: function patchDataVue(url, data, options) {
        _vue2.default.http.options.emulateJSON = true;
        return _vue2.default.http.patch(url, data, options);
    },
    jsonpDataVue: function jsonpDataVue(url) {
        return _vue2.default.http.jsonp(url);
    },
    makeURL: function makeURL(url, data) {
        var link = this.data.serviceHost + url;
        if (typeof data != "undefined" && data != "") {
            var paramArr = [];
            for (var attr in data) {
                paramArr.push(attr + '=' + data[attr]);
            }
            link += '?' + paramArr.join('&');
        }
        return link;
    }
};

// 请求拦截器 可以在请求发送前和发送请求后做一些处理。暂不适用
// Vue.http.interceptors.push((request, next) => {
//         // ...
//         // 请求发送前的处理逻辑
//         // ...
//     next((response) => {
//         // ...
//         // 请求发送后的处理逻辑
//         // ...
//         // 根据请求的状态，response参数会返回给successCallback或errorCallback
//         return response
//     })
// })

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "ddmd.png?80806ceeefd4ab87a0186f20f1277b07";

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(121)

/* script */
__vue_exports__ = __webpack_require__(31)

/* template */
var __vue_template__ = __webpack_require__(100)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _vue = __webpack_require__(5);

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.filter('orderState', function (str) {
      switch (str) {
            case 'WAIT_BUYER_PAY':
                  return '等待买家付款';
                  break;
            case 'WAIT_SELLER_CONFIRM':
                  return '等待卖家确认';
                  break;
            case 'SELLER_CONSIGNED_PART':
                  return '卖家部分发货';
                  break;
            case 'WAIT_SELLER_SEND_GOODS':
                  return '等待卖家发货';
                  break;
            case ' WAIT_BUYER_CONFIRM_GOODS':
                  return '等待买家确认收货';
                  break;
            case 'TRADE_BUYER_SIGNED':
                  return '买家已签收';
                  break;
            case 'TRADE_FINISHED':
                  return '交易成功';
                  break;
            case 'TRADE_CLOSED':
                  return '付款以后用户退款成功，交易自动关闭';
                  break;
            case 'TRADE_CLOSED_BY_UDUI':
                  return '付款以前，卖家或买家主动关闭交易';
                  break;
            default:
                  return '未知状态';
      }
});

_vue2.default.filter('date', function (str) {
      var myTime = {
            /**              
             * 时间戳转换日期              
             * @param <int> unixTime    待时间戳(秒)              
             * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)              
             * @param <int>  timeZone   时区              
             */
            UnixToDate: function UnixToDate(unixTime, isFull, timeZone) {
                  if (typeof timeZone == 'number') {
                        unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
                  }
                  var time = new Date(unixTime);
                  var ymdhis = "";
                  ymdhis += time.getFullYear() + "-";
                  ymdhis += time.getMonth() + 1 + "-";
                  ymdhis += time.getDate() + " ";

                  ymdhis += " " + time.getHours() + ":";
                  ymdhis += time.getMinutes() + ":";
                  ymdhis += time.getSeconds();

                  return ymdhis;
            }
      };
      return myTime.UnixToDate(str);
});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = __webpack_require__(5);

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = __webpack_require__(106);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _App = __webpack_require__(71);

var _App2 = _interopRequireDefault(_App);

var _footmenu = __webpack_require__(73);

var _footmenu2 = _interopRequireDefault(_footmenu);

var _mall = __webpack_require__(76);

var _mall2 = _interopRequireDefault(_mall);

var _tcshop = __webpack_require__(78);

var _tcshop2 = _interopRequireDefault(_tcshop);

var _shopcar = __webpack_require__(77);

var _shopcar2 = _interopRequireDefault(_shopcar);

var _userCenter = __webpack_require__(84);

var _userCenter2 = _interopRequireDefault(_userCenter);

var _userOrders = __webpack_require__(85);

var _userOrders2 = _interopRequireDefault(_userOrders);

var _detail = __webpack_require__(80);

var _detail2 = _interopRequireDefault(_detail);

var _orderInfo = __webpack_require__(83);

var _orderInfo2 = _interopRequireDefault(_orderInfo);

var _login = __webpack_require__(75);

var _login2 = _interopRequireDefault(_login);

var _myWallet = __webpack_require__(82);

var _myWallet2 = _interopRequireDefault(_myWallet);

var _myEnvlop = __webpack_require__(81);

var _myEnvlop2 = _interopRequireDefault(_myEnvlop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueRouter2.default);

// const routes = [
//     // 动态路径参数 以冒号开头
//   { path: '/user/:id', component: User }
// ]

var router = new _vueRouter2.default({
  routes: [{
    path: '/',
    components: {
      default: _App2.default,
      footerMenu: _footmenu2.default
    }
  }, {
    path: '/index',
    components: {
      default: _App2.default,
      footerMenu: _footmenu2.default
    }
  }, {
    path: '/mall',
    components: {
      default: _mall2.default,
      footerMenu: _footmenu2.default
    }
  }, {
    path: '/tcshop',
    components: {
      default: _tcshop2.default,
      footerMenu: _footmenu2.default
    }
  }, {
    path: '/shopcar',
    components: {
      default: _shopcar2.default,
      footerMenu: _footmenu2.default
    }
  }, {
    path: '/user',
    components: {
      default: _userCenter2.default,
      footerMenu: _footmenu2.default
    }
  }, {
    path: '/userOrders',
    components: {
      default: _userOrders2.default,
      footerMenu: _footmenu2.default
    }
  }, {
    path: '/orderInfo/:orderNo',
    components: {
      default: _orderInfo2.default
    }
  }, {
    path: '/detail/:goodsId',
    components: {
      default: _detail2.default
    }
  }, {
    path: '/login',
    components: {
      default: _login2.default
    }
  }, {
    path: '/myWallet',
    components: {
      default: _myWallet2.default
    }
  }, {
    path: '/myEnvlop',
    components: {
      default: _myEnvlop2.default
    }
  }
  // {
  // 	path: '/user/:id',
  // 	component: User ,
  // 	children :[
  // 		{
  //        // 当 /user/:id/profile 匹配成功，
  //        // UserProfile 会被渲染在 User 的 <router-view> 中
  //        path: 'profile',
  //        component: UserProfile
  //      },
  //      {
  //        // 当 /user/:id/posts 匹配成功
  //        // UserPosts 会被渲染在 User 的 <router-view> 中
  //        path: 'posts',
  //        component: UserPosts
  //      },
  // 		{ path: '', component: UserHome }
  // 	]
  // }
  ]
});
// router.beforeEach((to, from, next) => {
//   //console.log(to)
// })
// router.afterEach(route => {
//   console.log(route.path)
// })
// router.beforeEach((to, from, next) => {
//   // ...
// })
exports.default = {
  router: router
};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = __webpack_require__(5);

var _vue2 = _interopRequireDefault(_vue);

var _vuex = __webpack_require__(2);

var _vuex2 = _interopRequireDefault(_vuex);

var _actions = __webpack_require__(36);

var actions = _interopRequireWildcard(_actions);

var _getters = __webpack_require__(37);

var getters = _interopRequireWildcard(_getters);

var _indexComtent = __webpack_require__(38);

var _indexComtent2 = _interopRequireDefault(_indexComtent);

var _indexData = __webpack_require__(39);

var _indexData2 = _interopRequireDefault(_indexData);

var _userInfo = __webpack_require__(40);

var _userInfo2 = _interopRequireDefault(_userInfo);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 整合初始状态和变更函数，我们就得到了我们所需的 store
// 至此，这个 store 就可以连接到我们的应用中
_vue2.default.use(_vuex2.default);
exports.default = new _vuex2.default.Store({
  actions: actions,
  getters: getters,
  modules: {
    indexComtent: _indexComtent2.default,
    indexData: _indexData2.default,
    userInfo: _userInfo2.default
  },
  strict: true
});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__component_common_banner_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__component_common_banner_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__component_common_banner_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__component_indexContent_vue__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__component_indexContent_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__component_indexContent_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__component_testcontent_vue__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__component_testcontent_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__component_testcontent_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__component_common_loading_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__component_common_loading_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__component_common_loading_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__component_cover_vue__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__component_cover_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__component_cover_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






 //欢迎动画组件

const components = { banner: __WEBPACK_IMPORTED_MODULE_1__component_common_banner_vue___default.a, indexContent: __WEBPACK_IMPORTED_MODULE_2__component_indexContent_vue___default.a, testContent: __WEBPACK_IMPORTED_MODULE_3__component_testcontent_vue___default.a, loading: __WEBPACK_IMPORTED_MODULE_4__component_common_loading_vue___default.a, cover: __WEBPACK_IMPORTED_MODULE_5__component_cover_vue___default.a };
/* harmony default export */ exports["default"] = {
  data() {
    return {
      lo: false
    };
  },
  computed: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_vuex__["mapGetters"])({
    loading: 'loading',
    getCarousel: 'getCarousel'
  }),
  created() {
    this.$store.dispatch('getIndexData');
  },
  name: 'app',
  components: components
};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__static_swiper_3_4_0_min__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__static_swiper_3_4_0_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__static_swiper_3_4_0_min__);
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ exports["default"] = {
    props: ['imgArr'],
    mounted: function () {
        this.$nextTick(function () {
            let mySwiper = new Swiper('.swiper-container', {
                direction: 'horizontal',
                autoplay: 2000,
                spend: 2000,
                loop: true,
                observer: true, //修改swiper自己或子元素时，自动初始化swiper
                observeParents: true,
                //修改swiper的父元素时，自动初始化swiper
                // 如果需要分页器
                pagination: '.swiper-pagination'
            });
        });
    }
};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//

/* harmony default export */ exports["default"] = {
  data() {
    return {};
  },
  methods: {
    backfn: function () {
      this.$router.go(-1);
    }
  },
  props: ['title']
};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ exports["default"] = {
  props: ['show']
};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//

/* harmony default export */ exports["default"] = {
    props: ['show']
};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ exports["default"] = {
  data() {
    return {
      iscur: null,
      show: true
    };
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'changeiscur'
  },
  methods: {
    heiline: function (num) {
      this.iscur = num;
    },
    changeiscur: function () {
      console.log(this.$route.path);
      let path = this.$route.path;
      switch (path) {
        case '/index':
          this.iscur = 1;
          break;
        case '/mall':
          this.iscur = 2;
          break;
        case '/tcshop':
          this.iscur = 3;
          break;
        case '/shopcar':
          this.iscur = 4;
          break;
        case '/user':
          this.iscur = 5;
          break;
        default:
          break;
      }
    }
  }
};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//

//import { incrementCounter } from './../vuex/actions'
/* harmony default export */ exports["default"] = {
  data() {
    return {
      mas: "主体内容",
      num: { type: 'increment', amount: 10 }
    };
  },
  vuex: {
    actions: {
      //increment: incrementCounter
    }
  },
  // methods : {
  // 	increment : function () {
  // 		this.$store.commit('increment',1)
  // 	}
  // },
  methods: {
    increment(num) {
      this.$store.dispatch(num);
    }
  }
};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_header_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_header_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_header_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



const components = { headnav: __WEBPACK_IMPORTED_MODULE_1__common_header_vue___default.a };
/* harmony default export */ exports["default"] = {
  data() {
    return {
      pagetitle: "登录",
      userName: '',
      passWord: ''
    };
  },
  components: components,
  methods: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_vuex__["mapActions"])(['loginfn'])
};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_header_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_header_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_header_vue__);
//
//
//
//
//
//
//
//
//
//



const components = { headnav: __WEBPACK_IMPORTED_MODULE_0__common_header_vue___default.a };
/* harmony default export */ exports["default"] = {
  data() {
    return {
      pagetitle: "商城"
    };
  },
  components: components,
  methods: {
    showNum: function () {
      alert(1);
    }
  }
};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_header_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_header_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_header_vue__);
//
//
//
//
//
//
//
//
//


const components = { headnav: __WEBPACK_IMPORTED_MODULE_0__common_header_vue___default.a };
/* harmony default export */ exports["default"] = {
  data() {
    return {
      pagetitle: "购物车"
    };
  },
  components: components,
  methods: {
    showNum: function () {
      alert(1);
    }
  }
};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_header_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_header_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_header_vue__);
//
//
//
//
//
//
//
//
//
//



const components = { headnav: __WEBPACK_IMPORTED_MODULE_0__common_header_vue___default.a };
/* harmony default export */ exports["default"] = {
  data() {
    return {
      pagetitle: "同城"
    };
  },
  components: components,
  methods: {
    showNum: function () {
      alert(1);
    }
  }
};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
//
//
//
//
//



/* harmony default export */ exports["default"] = {
  computed: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_vuex__["mapGetters"])({
    counterValue: 'getCount'
  })
};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_loading_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_loading_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_loading_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_header_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_header_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__common_header_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_banner_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_banner_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__common_banner_vue__);
//
//
//
//
//
//
//
//
//






const components = { loading: __WEBPACK_IMPORTED_MODULE_1__common_loading_vue___default.a, headnav: __WEBPACK_IMPORTED_MODULE_2__common_header_vue___default.a, banner: __WEBPACK_IMPORTED_MODULE_3__common_banner_vue___default.a };
/* harmony default export */ exports["default"] = {
  data() {
    return {
      pagetitle: "商品详情",
      loading: false
    };
  },
  computed: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_vuex__["mapGetters"])({
    goodsInfoData: 'goodsInfo'
  }),
  components: components,
  methods: {},
  created() {
    let goodsId = this.$route.params.goodsId;
    console.log(goodsId);
    this.$store.dispatch('getGoodsInfo', { goodsId: goodsId });
  }
};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_header_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_header_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_header_vue__);
//
//
//
//
//
//
//




const components = { headnav: __WEBPACK_IMPORTED_MODULE_1__common_header_vue___default.a };
/* harmony default export */ exports["default"] = {
  data() {
    return {
      pagetitle: "我的红包"
    };
  },
  computed: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_vuex__["mapGetters"])({
    myEnvData: 'myEnvData'
  }),
  components: components,
  methods: {},
  created() {
    this.$store.dispatch('getEnvData', { pageNo: 1, state: 1, activityType: '' });
  }
};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_header_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_header_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_header_vue__);
//
//
//
//
//
//
//




const components = { headnav: __WEBPACK_IMPORTED_MODULE_1__common_header_vue___default.a };
/* harmony default export */ exports["default"] = {
  data() {
    return {
      pagetitle: "我的钱包"
    };
  },
  computed: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_vuex__["mapGetters"])({
    myWallerData: 'myWallerData'
  }),
  components: components,
  methods: {},
  created() {
    this.$store.dispatch('getWallerData');
  }
};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_loading_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_loading_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_loading_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_header_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_header_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__common_header_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_banner_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_banner_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__common_banner_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__order_list_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__order_list_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__order_list_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







const components = { loading: __WEBPACK_IMPORTED_MODULE_1__common_loading_vue___default.a, headnav: __WEBPACK_IMPORTED_MODULE_2__common_header_vue___default.a, banner: __WEBPACK_IMPORTED_MODULE_3__common_banner_vue___default.a, orderList: __WEBPACK_IMPORTED_MODULE_4__order_list_vue___default.a };
/* harmony default export */ exports["default"] = {
  data() {
    return {
      pagetitle: "订单详情",
      loading: false
    };
  },
  computed: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_vuex__["mapGetters"])({
    orderInfoData: 'orderInfoData'
  }),
  components: components,
  methods: {
    showNum: function () {
      console.log(this.isLogin);
    }
  },
  created() {
    let orderNo = this.$route.params.orderNo;
    this.$store.dispatch('getOrderInfo', { orderNo: orderNo });
  }
};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ exports["default"] = {
  methods: {
    cancelOrder: function (num) {
      console.log(num);
    }
  },
  props: ['orderList']
};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_header_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_header_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_header_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




const components = { headnav: __WEBPACK_IMPORTED_MODULE_1__common_header_vue___default.a };
/* harmony default export */ exports["default"] = {
  computed: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_vuex__["mapGetters"])({
    userInfo: 'userInfo'
  }),
  components: components,
  methods: {
    showNum: function () {
      console.log(this.isLogin);
    }
  },
  created() {
    if (!this.userInfo.isLogin) {
      this.$store.dispatch('getUserInfo');
    }
  }
};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_header_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_header_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_header_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_banner_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_banner_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__common_banner_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__order_list_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__order_list_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__order_list_vue__);
//
//
//
//
//
//
//
//






const components = { headnav: __WEBPACK_IMPORTED_MODULE_1__common_header_vue___default.a, banner: __WEBPACK_IMPORTED_MODULE_2__common_banner_vue___default.a, orderList: __WEBPACK_IMPORTED_MODULE_3__order_list_vue___default.a };
/* harmony default export */ exports["default"] = {
  data() {
    return {
      pagetitle: "我的订单"
    };
  },
  computed: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_vuex__["mapGetters"])({
    getOrdersCarousel: 'getOrdersCarousel',
    orderList: 'orderList'
  }),
  components: components,
  methods: {
    showNum: function () {
      console.log(this.isLogin);
    }
  },
  created() {
    this.$store.dispatch('getUserOrders');
  }
};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpVue = __webpack_require__(9);

var _httpVue2 = _interopRequireDefault(_httpVue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  getBannerList: function getBannerList(obj) {
    var str = '/v1/navmenu/getBannerList';
    var data = { regionId: -1, type: 2, appLinkId: obj.appLinkId };
    var url = _httpVue2.default.makeURL(str, data);
    var backData = null;
    return _httpVue2.default.getDataVue(url);
  }
};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpVue = __webpack_require__(9);

var _httpVue2 = _interopRequireDefault(_httpVue);

var _md = __webpack_require__(41);

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  login: function login(products) {
    var url = _httpVue2.default.makeURL('/v1/auth/login');
    products.pwd = _md2.default.hex_md5(products.pwd);
    var data = products;
    return _httpVue2.default.postDataVue(url, data, { credentials: true });
  },
  userMas: function userMas(products) {
    var url = _httpVue2.default.makeURL('/v1/user/details');
    return _httpVue2.default.getDataVue(url, { credentials: true });
  },
  userOrders: function userOrders(products) {
    var data = { pageNo: products.pageNo, pageSize: products.pageSize, orderNo: products.orderNo, orderState: products.orderState };
    var url = _httpVue2.default.makeURL('/v1/order', data);
    return _httpVue2.default.getDataVue(url, { credentials: true });
  },
  orderInfo: function orderInfo(products) {
    var link = '/v1/order/' + products.orderNo;
    var url = _httpVue2.default.makeURL(link);
    return _httpVue2.default.getDataVue(url, { credentials: true });
  },
  goodsInfo: function goodsInfo(products) {
    var link = '/v1/goods/' + products.goodsId;
    var url = _httpVue2.default.makeURL(link);
    return _httpVue2.default.getDataVue(url, { credentials: true });
  },
  myWaller: function myWaller() {
    var url = _httpVue2.default.makeURL('/v1/user/purse/get');
    return _httpVue2.default.getDataVue(url, { credentials: true });
  },
  myEnvData: function myEnvData(products) {
    var url = _httpVue2.default.makeURL('/v1/lottery/envelope/myprizes', products);
    return _httpVue2.default.getDataVue(url, { credentials: true });
  }
};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEnvData = exports.getWallerData = exports.getGoodsInfo = exports.getOrderInfo = exports.getUserOrders = exports.getUserInfo = exports.loginfn = exports.getIndexData = exports.increment = undefined;

var _index = __webpack_require__(34);

var _index2 = _interopRequireDefault(_index);

var _user = __webpack_require__(35);

var _user2 = _interopRequireDefault(_user);

var _mutationTypes = __webpack_require__(6);

var types = _interopRequireWildcard(_mutationTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var increment = exports.increment = function increment(_ref, product) {
  var commit = _ref.commit;

  commit(types.ADD_NUMBER, 1);
};

var getIndexData = exports.getIndexData = function getIndexData(_ref2, product) {
  var commit = _ref2.commit;

  _index2.default.getBannerList({ appLinkId: 'scrollPicture' }).then(function (res) {
    var arr = res.body.module[0].list;
    commit(types.Set_indexData, arr);
  });

  _user2.default.userMas().then(function (res) {
    commit(types.Set_user_info, res.body);
  });
};

var loginfn = exports.loginfn = function loginfn(_ref3, products) {
  var commit = _ref3.commit;

  _user2.default.login(products).then(function (res) {
    console.log(res);
  });
};

var getUserInfo = exports.getUserInfo = function getUserInfo(_ref4, products) {
  var commit = _ref4.commit;

  _user2.default.userMas().then(function (res) {
    commit(types.Set_user_info, res.body);
  });
};

var getUserOrders = exports.getUserOrders = function getUserOrders(_ref5, products) {
  var commit = _ref5.commit;

  _index2.default.getBannerList({ appLinkId: 'myOrderBanner' }).then(function (res) {
    var arr = res.body.module[0].list;
    commit(types.Set_orders_banner, arr);
  });
  var data = { pageNo: 1, pageSize: 10, orderNo: '', orderState: '' };
  _user2.default.userOrders(data).then(function (res) {
    commit(types.Set_user_orders, res.body.module);
  });
};

var getOrderInfo = exports.getOrderInfo = function getOrderInfo(_ref6, products) {
  var commit = _ref6.commit;

  _user2.default.orderInfo(products).then(function (res) {
    commit(types.Set_order_info, res.body.module);
  });
};

var getGoodsInfo = exports.getGoodsInfo = function getGoodsInfo(_ref7, products) {
  var commit = _ref7.commit;

  _user2.default.goodsInfo(products).then(function (res) {
    console.log(res);
    commit(types.Set_goods_info, res.body.module);
  });
};

var getWallerData = exports.getWallerData = function getWallerData(_ref8, products) {
  var commit = _ref8.commit;

  _user2.default.myWaller().then(function (res) {
    console.log(res);
    commit(types.Set_waller_data, res.body.module);
  });
};

var getEnvData = exports.getEnvData = function getEnvData(_ref9, products) {
  var commit = _ref9.commit;

  _user2.default.myEnvData(products).then(function (res) {
    console.log(res);
    commit(types.Set_evnlop_data, res.body.module);
  });
};

/***/ },
/* 37 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getCount = exports.getCount = function getCount(state) {
  return state.indexComtent.count;
};

var getCarousel = exports.getCarousel = function getCarousel(state) {
  return state.indexData.carousel;
};

var loading = exports.loading = function loading(state) {
  return state.indexData.loading;
};

var userInfo = exports.userInfo = function userInfo(state) {
  return state.userInfo;
};

var getOrdersCarousel = exports.getOrdersCarousel = function getOrdersCarousel(state) {
  return state.userInfo.carousel;
};

var orderList = exports.orderList = function orderList(state) {
  return state.userInfo.orderList;
};

var orderInfoData = exports.orderInfoData = function orderInfoData(state) {
  return state.userInfo.orderInfo;
};

var goodsInfo = exports.goodsInfo = function goodsInfo(state) {
  return state.userInfo.goodsInfo;
};

var myWallerData = exports.myWallerData = function myWallerData(state) {
  return state.userInfo.wallerData;
};

var myEnvData = exports.myEnvData = function myEnvData(state) {
  return state.userInfo.myEnvData;
};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mutationTypes = __webpack_require__(6);

var types = _interopRequireWildcard(_mutationTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// initial state
// shape: [{ id, quantity }]
var state = {
  "count": 0
};

// mutations
var mutations = _defineProperty({}, types.ADD_NUMBER, function (state, amount) {
  state.count = state.count + amount;
  console.log(state.count);
});

exports.default = {
  state: state,
  mutations: mutations
};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mutationTypes = __webpack_require__(6);

var types = _interopRequireWildcard(_mutationTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// initial state
// shape: [{ id, quantity }]
var state = {
  carousel: [],
  loading: true
};

// mutations
var mutations = _defineProperty({}, types.Set_indexData, function (state, data) {
  state.carousel = data;
  state.loading = false;
});

exports.default = {
  state: state,
  mutations: mutations
};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mutations;

var _mutationTypes = __webpack_require__(6);

var types = _interopRequireWildcard(_mutationTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// initial state
// shape: [{ id, quantity }]
var state = {
  isLogin: false,
  userName: null,
  carousel: null,
  orderList: null,
  orderInfo: { receiverName: null },
  goodsInfo: null,
  wallerData: null,
  myEnvData: null
};

// mutations
var mutations = (_mutations = {}, _defineProperty(_mutations, types.Set_user_info, function (state, amount) {
  state.isLogin = amount.success;
  if (amount.success) {
    state.userName = amount.module.userName;
  }
}), _defineProperty(_mutations, types.Set_user_orders, function (state, amount) {
  console.log(amount);
  state.orderList = amount;
}), _defineProperty(_mutations, types.Set_orders_banner, function (state, amount) {
  state.carousel = amount;
}), _defineProperty(_mutations, types.Set_order_info, function (state, amount) {
  state.orderInfo = amount;
}), _defineProperty(_mutations, types.Set_goods_info, function (state, amount) {
  state.goodsInfo = amount;
}), _defineProperty(_mutations, types.Set_waller_data, function (state, amount) {
  state.wallerData = amount;
}), _defineProperty(_mutations, types.Set_evnlop_data, function (state, amount) {
  state.myEnvData = amount;
}), _mutations);

exports.default = {
  state: state,
  mutations: mutations
};

/***/ },
/* 41 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
// function hex_md5(s){
//   var str =  binl2hex(core_md5(str2binl(s), s.length * chrsz));
//    return str.toUpperCase();
// }
function b64_md5(s) {
  return binl2b64(core_md5(str2binl(s), s.length * chrsz));
}
function str_md5(s) {
  return binl2str(core_md5(str2binl(s), s.length * chrsz));
}
function hex_hmac_md5(key, data) {
  return binl2hex(core_hmac_md5(key, data));
}
function b64_hmac_md5(key, data) {
  return binl2b64(core_hmac_md5(key, data));
}
function str_hmac_md5(key, data) {
  return binl2str(core_hmac_md5(key, data));
}

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test() {
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[(len + 64 >>> 9 << 4) + 14] = len;

  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t) {
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}
function md5_ff(a, b, c, d, x, s, t) {
  return md5_cmn(b & c | ~b & d, a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t) {
  return md5_cmn(b & d | c & ~d, a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t) {
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t) {
  return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data) {
  var bkey = str2binl(key);
  if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16),
      opad = Array(16);
  for (var i = 0; i < 16; i++) {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xFFFF;
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str) {
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for (var i = 0; i < str.length * chrsz; i += chrsz) {
    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << i % 32;
  }return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin) {
  var str = "";
  var mask = (1 << chrsz) - 1;
  for (var i = 0; i < bin.length * 32; i += chrsz) {
    str += String.fromCharCode(bin[i >> 5] >>> i % 32 & mask);
  }return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray) {
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 + 4 & 0xF) + hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray) {
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i += 3) {
    var triplet = (binarray[i >> 2] >> 8 * (i % 4) & 0xFF) << 16 | (binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4) & 0xFF) << 8 | binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4) & 0xFF;
    for (var j = 0; j < 4; j++) {
      if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;else str += tab.charAt(triplet >> 6 * (3 - j) & 0x3F);
    }
  }
  return str;
}

exports.default = {
  hex_md5: function hex_md5(s) {
    var str = binl2hex(core_md5(str2binl(s), s.length * chrsz));
    return str.toUpperCase();
  }
};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Swiper 3.4.0
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * 
 * http://www.idangero.us/swiper/
 * 
 * Copyright 2016, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 * 
 * Licensed under MIT
 * 
 * Released on: October 16, 2016
 */
!function () {
  "use strict";
  function e(e) {
    e.fn.swiper = function (a) {
      var s;return e(this).each(function () {
        var e = new t(this, a);s || (s = e);
      }), s;
    };
  }var a,
      t = function t(e, i) {
    function n(e) {
      return Math.floor(e);
    }function o() {
      var e = S.params.autoplay,
          a = S.slides.eq(S.activeIndex);a.attr("data-swiper-autoplay") && (e = a.attr("data-swiper-autoplay") || S.params.autoplay), S.autoplayTimeoutId = setTimeout(function () {
        S.params.loop ? (S.fixLoop(), S._slideNext(), S.emit("onAutoplay", S)) : S.isEnd ? i.autoplayStopOnLast ? S.stopAutoplay() : (S._slideTo(0), S.emit("onAutoplay", S)) : (S._slideNext(), S.emit("onAutoplay", S));
      }, e);
    }function l(e, t) {
      var s = a(e.target);if (!s.is(t)) if ("string" == typeof t) s = s.parents(t);else if (t.nodeType) {
        var i;return s.parents().each(function (e, a) {
          a === t && (i = t);
        }), i ? t : void 0;
      }if (0 !== s.length) return s[0];
    }function p(e, a) {
      a = a || {};var t = window.MutationObserver || window.WebkitMutationObserver,
          s = new t(function (e) {
        e.forEach(function (e) {
          S.onResize(!0), S.emit("onObserverUpdate", S, e);
        });
      });s.observe(e, { attributes: "undefined" == typeof a.attributes || a.attributes, childList: "undefined" == typeof a.childList || a.childList, characterData: "undefined" == typeof a.characterData || a.characterData }), S.observers.push(s);
    }function d(e) {
      e.originalEvent && (e = e.originalEvent);var a = e.keyCode || e.charCode;if (!S.params.allowSwipeToNext && (S.isHorizontal() && 39 === a || !S.isHorizontal() && 40 === a)) return !1;if (!S.params.allowSwipeToPrev && (S.isHorizontal() && 37 === a || !S.isHorizontal() && 38 === a)) return !1;if (!(e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || document.activeElement && document.activeElement.nodeName && ("input" === document.activeElement.nodeName.toLowerCase() || "textarea" === document.activeElement.nodeName.toLowerCase()))) {
        if (37 === a || 39 === a || 38 === a || 40 === a) {
          var t = !1;if (S.container.parents("." + S.params.slideClass).length > 0 && 0 === S.container.parents("." + S.params.slideActiveClass).length) return;var s = { left: window.pageXOffset, top: window.pageYOffset },
              i = window.innerWidth,
              r = window.innerHeight,
              n = S.container.offset();S.rtl && (n.left = n.left - S.container[0].scrollLeft);for (var o = [[n.left, n.top], [n.left + S.width, n.top], [n.left, n.top + S.height], [n.left + S.width, n.top + S.height]], l = 0; l < o.length; l++) {
            var p = o[l];p[0] >= s.left && p[0] <= s.left + i && p[1] >= s.top && p[1] <= s.top + r && (t = !0);
          }if (!t) return;
        }S.isHorizontal() ? (37 !== a && 39 !== a || (e.preventDefault ? e.preventDefault() : e.returnValue = !1), (39 === a && !S.rtl || 37 === a && S.rtl) && S.slideNext(), (37 === a && !S.rtl || 39 === a && S.rtl) && S.slidePrev()) : (38 !== a && 40 !== a || (e.preventDefault ? e.preventDefault() : e.returnValue = !1), 40 === a && S.slideNext(), 38 === a && S.slidePrev());
      }
    }function u() {
      var e = "onwheel",
          a = e in document;if (!a) {
        var t = document.createElement("div");t.setAttribute(e, "return;"), a = "function" == typeof t[e];
      }return !a && document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("", "") !== !0 && (a = document.implementation.hasFeature("Events.wheel", "3.0")), a;
    }function c(e) {
      e.originalEvent && (e = e.originalEvent);var a = 0,
          t = S.rtl ? -1 : 1,
          s = m(e);if (S.params.mousewheelForceToAxis) {
        if (S.isHorizontal()) {
          if (!(Math.abs(s.pixelX) > Math.abs(s.pixelY))) return;a = s.pixelX * t;
        } else {
          if (!(Math.abs(s.pixelY) > Math.abs(s.pixelX))) return;a = s.pixelY;
        }
      } else a = Math.abs(s.pixelX) > Math.abs(s.pixelY) ? -s.pixelX * t : -s.pixelY;if (0 !== a) {
        if (S.params.mousewheelInvert && (a = -a), S.params.freeMode) {
          var i = S.getWrapperTranslate() + a * S.params.mousewheelSensitivity,
              r = S.isBeginning,
              n = S.isEnd;if (i >= S.minTranslate() && (i = S.minTranslate()), i <= S.maxTranslate() && (i = S.maxTranslate()), S.setWrapperTransition(0), S.setWrapperTranslate(i), S.updateProgress(), S.updateActiveIndex(), (!r && S.isBeginning || !n && S.isEnd) && S.updateClasses(), S.params.freeModeSticky ? (clearTimeout(S.mousewheel.timeout), S.mousewheel.timeout = setTimeout(function () {
            S.slideReset();
          }, 300)) : S.params.lazyLoading && S.lazy && S.lazy.load(), S.emit("onScroll", S, e), S.params.autoplay && S.params.autoplayDisableOnInteraction && S.stopAutoplay(), 0 === i || i === S.maxTranslate()) return;
        } else {
          if (new window.Date().getTime() - S.mousewheel.lastScrollTime > 60) if (a < 0) {
            if (S.isEnd && !S.params.loop || S.animating) {
              if (S.params.mousewheelReleaseOnEdges) return !0;
            } else S.slideNext(), S.emit("onScroll", S, e);
          } else if (S.isBeginning && !S.params.loop || S.animating) {
            if (S.params.mousewheelReleaseOnEdges) return !0;
          } else S.slidePrev(), S.emit("onScroll", S, e);S.mousewheel.lastScrollTime = new window.Date().getTime();
        }return e.preventDefault ? e.preventDefault() : e.returnValue = !1, !1;
      }
    }function m(e) {
      var a = 10,
          t = 40,
          s = 800,
          i = 0,
          r = 0,
          n = 0,
          o = 0;return "detail" in e && (r = e.detail), "wheelDelta" in e && (r = -e.wheelDelta / 120), "wheelDeltaY" in e && (r = -e.wheelDeltaY / 120), "wheelDeltaX" in e && (i = -e.wheelDeltaX / 120), "axis" in e && e.axis === e.HORIZONTAL_AXIS && (i = r, r = 0), n = i * a, o = r * a, "deltaY" in e && (o = e.deltaY), "deltaX" in e && (n = e.deltaX), (n || o) && e.deltaMode && (1 === e.deltaMode ? (n *= t, o *= t) : (n *= s, o *= s)), n && !i && (i = n < 1 ? -1 : 1), o && !r && (r = o < 1 ? -1 : 1), { spinX: i, spinY: r, pixelX: n, pixelY: o };
    }function h(e, t) {
      e = a(e);var s,
          i,
          r,
          n = S.rtl ? -1 : 1;s = e.attr("data-swiper-parallax") || "0", i = e.attr("data-swiper-parallax-x"), r = e.attr("data-swiper-parallax-y"), i || r ? (i = i || "0", r = r || "0") : S.isHorizontal() ? (i = s, r = "0") : (r = s, i = "0"), i = i.indexOf("%") >= 0 ? parseInt(i, 10) * t * n + "%" : i * t * n + "px", r = r.indexOf("%") >= 0 ? parseInt(r, 10) * t + "%" : r * t + "px", e.transform("translate3d(" + i + ", " + r + ",0px)");
    }function g(e) {
      return 0 !== e.indexOf("on") && (e = e[0] !== e[0].toUpperCase() ? "on" + e[0].toUpperCase() + e.substring(1) : "on" + e), e;
    }if (!(this instanceof t)) return new t(e, i);var f = { direction: "horizontal", touchEventsTarget: "container", initialSlide: 0, speed: 300, autoplay: !1, autoplayDisableOnInteraction: !0, autoplayStopOnLast: !1, iOSEdgeSwipeDetection: !1, iOSEdgeSwipeThreshold: 20, freeMode: !1, freeModeMomentum: !0, freeModeMomentumRatio: 1, freeModeMomentumBounce: !0, freeModeMomentumBounceRatio: 1, freeModeMomentumVelocityRatio: 1, freeModeSticky: !1, freeModeMinimumVelocity: .02, autoHeight: !1, setWrapperSize: !1, virtualTranslate: !1, effect: "slide", coverflow: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: !0 }, flip: { slideShadows: !0, limitRotation: !0 }, cube: { slideShadows: !0, shadow: !0, shadowOffset: 20, shadowScale: .94 }, fade: { crossFade: !1 }, parallax: !1, zoom: !1, zoomMax: 3, zoomMin: 1, zoomToggle: !0, scrollbar: null, scrollbarHide: !0, scrollbarDraggable: !1, scrollbarSnapOnRelease: !1, keyboardControl: !1, mousewheelControl: !1, mousewheelReleaseOnEdges: !1, mousewheelInvert: !1, mousewheelForceToAxis: !1, mousewheelSensitivity: 1, mousewheelEventsTarged: "container", hashnav: !1, hashnavWatchState: !1, history: !1, replaceState: !1, breakpoints: void 0, spaceBetween: 0, slidesPerView: 1, slidesPerColumn: 1, slidesPerColumnFill: "column", slidesPerGroup: 1, centeredSlides: !1, slidesOffsetBefore: 0, slidesOffsetAfter: 0, roundLengths: !1, touchRatio: 1, touchAngle: 45, simulateTouch: !0, shortSwipes: !0, longSwipes: !0, longSwipesRatio: .5, longSwipesMs: 300, followFinger: !0, onlyExternal: !1, threshold: 0, touchMoveStopPropagation: !0, touchReleaseOnEdges: !1, uniqueNavElements: !0, pagination: null, paginationElement: "span", paginationClickable: !1, paginationHide: !1, paginationBulletRender: null, paginationProgressRender: null, paginationFractionRender: null, paginationCustomRender: null, paginationType: "bullets", resistance: !0, resistanceRatio: .85, nextButton: null, prevButton: null, watchSlidesProgress: !1, watchSlidesVisibility: !1, grabCursor: !1, preventClicks: !0, preventClicksPropagation: !0, slideToClickedSlide: !1, lazyLoading: !1, lazyLoadingInPrevNext: !1, lazyLoadingInPrevNextAmount: 1, lazyLoadingOnTransitionStart: !1, preloadImages: !0, updateOnImagesReady: !0, loop: !1, loopAdditionalSlides: 0, loopedSlides: null, control: void 0, controlInverse: !1, controlBy: "slide", normalizeSlideIndex: !0, allowSwipeToPrev: !0, allowSwipeToNext: !0, swipeHandler: null, noSwiping: !0, noSwipingClass: "swiper-no-swiping", passiveListeners: !0, containerModifierClass: "swiper-container-", slideClass: "swiper-slide", slideActiveClass: "swiper-slide-active", slideDuplicateActiveClass: "swiper-slide-duplicate-active", slideVisibleClass: "swiper-slide-visible", slideDuplicateClass: "swiper-slide-duplicate", slideNextClass: "swiper-slide-next", slideDuplicateNextClass: "swiper-slide-duplicate-next", slidePrevClass: "swiper-slide-prev", slideDuplicatePrevClass: "swiper-slide-duplicate-prev", wrapperClass: "swiper-wrapper", bulletClass: "swiper-pagination-bullet", bulletActiveClass: "swiper-pagination-bullet-active", buttonDisabledClass: "swiper-button-disabled", paginationCurrentClass: "swiper-pagination-current", paginationTotalClass: "swiper-pagination-total", paginationHiddenClass: "swiper-pagination-hidden", paginationProgressbarClass: "swiper-pagination-progressbar", paginationClickableClass: "swiper-pagination-clickable", paginationModifierClass: "swiper-pagination-", lazyLoadingClass: "swiper-lazy", lazyStatusLoadingClass: "swiper-lazy-loading", lazyStatusLoadedClass: "swiper-lazy-loaded", lazyPreloaderClass: "swiper-lazy-preloader", notificationClass: "swiper-notification", preloaderClass: "preloader", zoomContainerClass: "swiper-zoom-container", observer: !1, observeParents: !1, a11y: !1, prevSlideMessage: "Previous slide", nextSlideMessage: "Next slide", firstSlideMessage: "This is the first slide", lastSlideMessage: "This is the last slide", paginationBulletMessage: "Go to slide {{index}}", runCallbacksOnInit: !0 },
        v = i && i.virtualTranslate;i = i || {};var w = {};for (var y in i) {
      if ("object" != _typeof(i[y]) || null === i[y] || i[y].nodeType || i[y] === window || i[y] === document || "undefined" != typeof s && i[y] instanceof s || "undefined" != typeof jQuery && i[y] instanceof jQuery) w[y] = i[y];else {
        w[y] = {};for (var x in i[y]) {
          w[y][x] = i[y][x];
        }
      }
    }for (var T in f) {
      if ("undefined" == typeof i[T]) i[T] = f[T];else if ("object" == _typeof(i[T])) for (var b in f[T]) {
        "undefined" == typeof i[T][b] && (i[T][b] = f[T][b]);
      }
    }var S = this;if (S.params = i, S.originalParams = w, S.classNames = [], "undefined" != typeof a && "undefined" != typeof s && (a = s), ("undefined" != typeof a || (a = "undefined" == typeof s ? window.Dom7 || window.Zepto || window.jQuery : s)) && (S.$ = a, S.currentBreakpoint = void 0, S.getActiveBreakpoint = function () {
      if (!S.params.breakpoints) return !1;var e,
          a = !1,
          t = [];for (e in S.params.breakpoints) {
        S.params.breakpoints.hasOwnProperty(e) && t.push(e);
      }t.sort(function (e, a) {
        return parseInt(e, 10) > parseInt(a, 10);
      });for (var s = 0; s < t.length; s++) {
        e = t[s], e >= window.innerWidth && !a && (a = e);
      }return a || "max";
    }, S.setBreakpoint = function () {
      var e = S.getActiveBreakpoint();if (e && S.currentBreakpoint !== e) {
        var a = e in S.params.breakpoints ? S.params.breakpoints[e] : S.originalParams,
            t = S.params.loop && a.slidesPerView !== S.params.slidesPerView;for (var s in a) {
          S.params[s] = a[s];
        }S.currentBreakpoint = e, t && S.destroyLoop && S.reLoop(!0);
      }
    }, S.params.breakpoints && S.setBreakpoint(), S.container = a(e), 0 !== S.container.length)) {
      if (S.container.length > 1) {
        var C = [];return S.container.each(function () {
          C.push(new t(this, i));
        }), C;
      }S.container[0].swiper = S, S.container.data("swiper", S), S.classNames.push(S.params.containerModifierClass + S.params.direction), S.params.freeMode && S.classNames.push(S.params.containerModifierClass + "free-mode"), S.support.flexbox || (S.classNames.push(S.params.containerModifierClass + "no-flexbox"), S.params.slidesPerColumn = 1), S.params.autoHeight && S.classNames.push(S.params.containerModifierClass + "autoheight"), (S.params.parallax || S.params.watchSlidesVisibility) && (S.params.watchSlidesProgress = !0), S.params.touchReleaseOnEdges && (S.params.resistanceRatio = 0), ["cube", "coverflow", "flip"].indexOf(S.params.effect) >= 0 && (S.support.transforms3d ? (S.params.watchSlidesProgress = !0, S.classNames.push(S.params.containerModifierClass + "3d")) : S.params.effect = "slide"), "slide" !== S.params.effect && S.classNames.push(S.params.containerModifierClass + S.params.effect), "cube" === S.params.effect && (S.params.resistanceRatio = 0, S.params.slidesPerView = 1, S.params.slidesPerColumn = 1, S.params.slidesPerGroup = 1, S.params.centeredSlides = !1, S.params.spaceBetween = 0, S.params.virtualTranslate = !0, S.params.setWrapperSize = !1), "fade" !== S.params.effect && "flip" !== S.params.effect || (S.params.slidesPerView = 1, S.params.slidesPerColumn = 1, S.params.slidesPerGroup = 1, S.params.watchSlidesProgress = !0, S.params.spaceBetween = 0, S.params.setWrapperSize = !1, "undefined" == typeof v && (S.params.virtualTranslate = !0)), S.params.grabCursor && S.support.touch && (S.params.grabCursor = !1), S.wrapper = S.container.children("." + S.params.wrapperClass), S.params.pagination && (S.paginationContainer = a(S.params.pagination), S.params.uniqueNavElements && "string" == typeof S.params.pagination && S.paginationContainer.length > 1 && 1 === S.container.find(S.params.pagination).length && (S.paginationContainer = S.container.find(S.params.pagination)), "bullets" === S.params.paginationType && S.params.paginationClickable ? S.paginationContainer.addClass(S.params.paginationModifierClass + "clickable") : S.params.paginationClickable = !1, S.paginationContainer.addClass(S.params.paginationModifierClass + S.params.paginationType)), (S.params.nextButton || S.params.prevButton) && (S.params.nextButton && (S.nextButton = a(S.params.nextButton), S.params.uniqueNavElements && "string" == typeof S.params.nextButton && S.nextButton.length > 1 && 1 === S.container.find(S.params.nextButton).length && (S.nextButton = S.container.find(S.params.nextButton))), S.params.prevButton && (S.prevButton = a(S.params.prevButton), S.params.uniqueNavElements && "string" == typeof S.params.prevButton && S.prevButton.length > 1 && 1 === S.container.find(S.params.prevButton).length && (S.prevButton = S.container.find(S.params.prevButton)))), S.isHorizontal = function () {
        return "horizontal" === S.params.direction;
      }, S.rtl = S.isHorizontal() && ("rtl" === S.container[0].dir.toLowerCase() || "rtl" === S.container.css("direction")), S.rtl && S.classNames.push(S.params.containerModifierClass + "rtl"), S.rtl && (S.wrongRTL = "-webkit-box" === S.wrapper.css("display")), S.params.slidesPerColumn > 1 && S.classNames.push(S.params.containerModifierClass + "multirow"), S.device.android && S.classNames.push(S.params.containerModifierClass + "android"), S.container.addClass(S.classNames.join(" ")), S.translate = 0, S.progress = 0, S.velocity = 0, S.lockSwipeToNext = function () {
        S.params.allowSwipeToNext = !1, S.params.allowSwipeToPrev === !1 && S.params.grabCursor && S.unsetGrabCursor();
      }, S.lockSwipeToPrev = function () {
        S.params.allowSwipeToPrev = !1, S.params.allowSwipeToNext === !1 && S.params.grabCursor && S.unsetGrabCursor();
      }, S.lockSwipes = function () {
        S.params.allowSwipeToNext = S.params.allowSwipeToPrev = !1, S.params.grabCursor && S.unsetGrabCursor();
      }, S.unlockSwipeToNext = function () {
        S.params.allowSwipeToNext = !0, S.params.allowSwipeToPrev === !0 && S.params.grabCursor && S.setGrabCursor();
      }, S.unlockSwipeToPrev = function () {
        S.params.allowSwipeToPrev = !0, S.params.allowSwipeToNext === !0 && S.params.grabCursor && S.setGrabCursor();
      }, S.unlockSwipes = function () {
        S.params.allowSwipeToNext = S.params.allowSwipeToPrev = !0, S.params.grabCursor && S.setGrabCursor();
      }, S.setGrabCursor = function (e) {
        S.container[0].style.cursor = "move", S.container[0].style.cursor = e ? "-webkit-grabbing" : "-webkit-grab", S.container[0].style.cursor = e ? "-moz-grabbin" : "-moz-grab", S.container[0].style.cursor = e ? "grabbing" : "grab";
      }, S.unsetGrabCursor = function () {
        S.container[0].style.cursor = "";
      }, S.params.grabCursor && S.setGrabCursor(), S.imagesToLoad = [], S.imagesLoaded = 0, S.loadImage = function (e, a, t, s, i, r) {
        function n() {
          r && r();
        }var o;e.complete && i ? n() : a ? (o = new window.Image(), o.onload = n, o.onerror = n, s && (o.sizes = s), t && (o.srcset = t), a && (o.src = a)) : n();
      }, S.preloadImages = function () {
        function e() {
          "undefined" != typeof S && null !== S && (void 0 !== S.imagesLoaded && S.imagesLoaded++, S.imagesLoaded === S.imagesToLoad.length && (S.params.updateOnImagesReady && S.update(), S.emit("onImagesReady", S)));
        }S.imagesToLoad = S.container.find("img");for (var a = 0; a < S.imagesToLoad.length; a++) {
          S.loadImage(S.imagesToLoad[a], S.imagesToLoad[a].currentSrc || S.imagesToLoad[a].getAttribute("src"), S.imagesToLoad[a].srcset || S.imagesToLoad[a].getAttribute("srcset"), S.imagesToLoad[a].sizes || S.imagesToLoad[a].getAttribute("sizes"), !0, e);
        }
      }, S.autoplayTimeoutId = void 0, S.autoplaying = !1, S.autoplayPaused = !1, S.startAutoplay = function () {
        return "undefined" == typeof S.autoplayTimeoutId && !!S.params.autoplay && !S.autoplaying && (S.autoplaying = !0, S.emit("onAutoplayStart", S), void o());
      }, S.stopAutoplay = function (e) {
        S.autoplayTimeoutId && (S.autoplayTimeoutId && clearTimeout(S.autoplayTimeoutId), S.autoplaying = !1, S.autoplayTimeoutId = void 0, S.emit("onAutoplayStop", S));
      }, S.pauseAutoplay = function (e) {
        S.autoplayPaused || (S.autoplayTimeoutId && clearTimeout(S.autoplayTimeoutId), S.autoplayPaused = !0, 0 === e ? (S.autoplayPaused = !1, o()) : S.wrapper.transitionEnd(function () {
          S && (S.autoplayPaused = !1, S.autoplaying ? o() : S.stopAutoplay());
        }));
      }, S.minTranslate = function () {
        return -S.snapGrid[0];
      }, S.maxTranslate = function () {
        return -S.snapGrid[S.snapGrid.length - 1];
      }, S.updateAutoHeight = function () {
        var e = [],
            a = 0;if ("auto" !== S.params.slidesPerView && S.params.slidesPerView > 1) for (r = 0; r < Math.ceil(S.params.slidesPerView); r++) {
          var t = S.activeIndex + r;if (t > S.slides.length) break;e.push(S.slides.eq(t)[0]);
        } else e.push(S.slides.eq(S.activeIndex)[0]);for (r = 0; r < e.length; r++) {
          if ("undefined" != typeof e[r]) {
            var s = e[r].offsetHeight;a = s > a ? s : a;
          }
        }a && S.wrapper.css("height", a + "px");
      }, S.updateContainerSize = function () {
        var e, a;e = "undefined" != typeof S.params.width ? S.params.width : S.container[0].clientWidth, a = "undefined" != typeof S.params.height ? S.params.height : S.container[0].clientHeight, 0 === e && S.isHorizontal() || 0 === a && !S.isHorizontal() || (e = e - parseInt(S.container.css("padding-left"), 10) - parseInt(S.container.css("padding-right"), 10), a = a - parseInt(S.container.css("padding-top"), 10) - parseInt(S.container.css("padding-bottom"), 10), S.width = e, S.height = a, S.size = S.isHorizontal() ? S.width : S.height);
      }, S.updateSlidesSize = function () {
        S.slides = S.wrapper.children("." + S.params.slideClass), S.snapGrid = [], S.slidesGrid = [], S.slidesSizesGrid = [];var e,
            a = S.params.spaceBetween,
            t = -S.params.slidesOffsetBefore,
            s = 0,
            i = 0;if ("undefined" != typeof S.size) {
          "string" == typeof a && a.indexOf("%") >= 0 && (a = parseFloat(a.replace("%", "")) / 100 * S.size), S.virtualSize = -a, S.rtl ? S.slides.css({ marginLeft: "", marginTop: "" }) : S.slides.css({ marginRight: "", marginBottom: "" });var r;S.params.slidesPerColumn > 1 && (r = Math.floor(S.slides.length / S.params.slidesPerColumn) === S.slides.length / S.params.slidesPerColumn ? S.slides.length : Math.ceil(S.slides.length / S.params.slidesPerColumn) * S.params.slidesPerColumn, "auto" !== S.params.slidesPerView && "row" === S.params.slidesPerColumnFill && (r = Math.max(r, S.params.slidesPerView * S.params.slidesPerColumn)));var o,
              l = S.params.slidesPerColumn,
              p = r / l,
              d = p - (S.params.slidesPerColumn * p - S.slides.length);for (e = 0; e < S.slides.length; e++) {
            o = 0;var u = S.slides.eq(e);if (S.params.slidesPerColumn > 1) {
              var c, m, h;"column" === S.params.slidesPerColumnFill ? (m = Math.floor(e / l), h = e - m * l, (m > d || m === d && h === l - 1) && ++h >= l && (h = 0, m++), c = m + h * r / l, u.css({ "-webkit-box-ordinal-group": c, "-moz-box-ordinal-group": c, "-ms-flex-order": c, "-webkit-order": c, order: c })) : (h = Math.floor(e / p), m = e - h * p), u.css("margin-" + (S.isHorizontal() ? "top" : "left"), 0 !== h && S.params.spaceBetween && S.params.spaceBetween + "px").attr("data-swiper-column", m).attr("data-swiper-row", h);
            }"none" !== u.css("display") && ("auto" === S.params.slidesPerView ? (o = S.isHorizontal() ? u.outerWidth(!0) : u.outerHeight(!0), S.params.roundLengths && (o = n(o))) : (o = (S.size - (S.params.slidesPerView - 1) * a) / S.params.slidesPerView, S.params.roundLengths && (o = n(o)), S.isHorizontal() ? S.slides[e].style.width = o + "px" : S.slides[e].style.height = o + "px"), S.slides[e].swiperSlideSize = o, S.slidesSizesGrid.push(o), S.params.centeredSlides ? (t = t + o / 2 + s / 2 + a, 0 === e && (t = t - S.size / 2 - a), Math.abs(t) < .001 && (t = 0), i % S.params.slidesPerGroup === 0 && S.snapGrid.push(t), S.slidesGrid.push(t)) : (i % S.params.slidesPerGroup === 0 && S.snapGrid.push(t), S.slidesGrid.push(t), t = t + o + a), S.virtualSize += o + a, s = o, i++);
          }S.virtualSize = Math.max(S.virtualSize, S.size) + S.params.slidesOffsetAfter;var g;if (S.rtl && S.wrongRTL && ("slide" === S.params.effect || "coverflow" === S.params.effect) && S.wrapper.css({ width: S.virtualSize + S.params.spaceBetween + "px" }), S.support.flexbox && !S.params.setWrapperSize || (S.isHorizontal() ? S.wrapper.css({ width: S.virtualSize + S.params.spaceBetween + "px" }) : S.wrapper.css({ height: S.virtualSize + S.params.spaceBetween + "px" })), S.params.slidesPerColumn > 1 && (S.virtualSize = (o + S.params.spaceBetween) * r, S.virtualSize = Math.ceil(S.virtualSize / S.params.slidesPerColumn) - S.params.spaceBetween, S.isHorizontal() ? S.wrapper.css({ width: S.virtualSize + S.params.spaceBetween + "px" }) : S.wrapper.css({ height: S.virtualSize + S.params.spaceBetween + "px" }), S.params.centeredSlides)) {
            for (g = [], e = 0; e < S.snapGrid.length; e++) {
              S.snapGrid[e] < S.virtualSize + S.snapGrid[0] && g.push(S.snapGrid[e]);
            }S.snapGrid = g;
          }if (!S.params.centeredSlides) {
            for (g = [], e = 0; e < S.snapGrid.length; e++) {
              S.snapGrid[e] <= S.virtualSize - S.size && g.push(S.snapGrid[e]);
            }S.snapGrid = g, Math.floor(S.virtualSize - S.size) - Math.floor(S.snapGrid[S.snapGrid.length - 1]) > 1 && S.snapGrid.push(S.virtualSize - S.size);
          }0 === S.snapGrid.length && (S.snapGrid = [0]), 0 !== S.params.spaceBetween && (S.isHorizontal() ? S.rtl ? S.slides.css({ marginLeft: a + "px" }) : S.slides.css({ marginRight: a + "px" }) : S.slides.css({ marginBottom: a + "px" })), S.params.watchSlidesProgress && S.updateSlidesOffset();
        }
      }, S.updateSlidesOffset = function () {
        for (var e = 0; e < S.slides.length; e++) {
          S.slides[e].swiperSlideOffset = S.isHorizontal() ? S.slides[e].offsetLeft : S.slides[e].offsetTop;
        }
      }, S.updateSlidesProgress = function (e) {
        if ("undefined" == typeof e && (e = S.translate || 0), 0 !== S.slides.length) {
          "undefined" == typeof S.slides[0].swiperSlideOffset && S.updateSlidesOffset();var a = -e;S.rtl && (a = e), S.slides.removeClass(S.params.slideVisibleClass);for (var t = 0; t < S.slides.length; t++) {
            var s = S.slides[t],
                i = (a + (S.params.centeredSlides ? S.minTranslate() : 0) - s.swiperSlideOffset) / (s.swiperSlideSize + S.params.spaceBetween);if (S.params.watchSlidesVisibility) {
              var r = -(a - s.swiperSlideOffset),
                  n = r + S.slidesSizesGrid[t],
                  o = r >= 0 && r < S.size || n > 0 && n <= S.size || r <= 0 && n >= S.size;o && S.slides.eq(t).addClass(S.params.slideVisibleClass);
            }s.progress = S.rtl ? -i : i;
          }
        }
      }, S.updateProgress = function (e) {
        "undefined" == typeof e && (e = S.translate || 0);var a = S.maxTranslate() - S.minTranslate(),
            t = S.isBeginning,
            s = S.isEnd;0 === a ? (S.progress = 0, S.isBeginning = S.isEnd = !0) : (S.progress = (e - S.minTranslate()) / a, S.isBeginning = S.progress <= 0, S.isEnd = S.progress >= 1), S.isBeginning && !t && S.emit("onReachBeginning", S), S.isEnd && !s && S.emit("onReachEnd", S), S.params.watchSlidesProgress && S.updateSlidesProgress(e), S.emit("onProgress", S, S.progress);
      }, S.updateActiveIndex = function () {
        var e,
            a,
            t,
            s = S.rtl ? S.translate : -S.translate;for (a = 0; a < S.slidesGrid.length; a++) {
          "undefined" != typeof S.slidesGrid[a + 1] ? s >= S.slidesGrid[a] && s < S.slidesGrid[a + 1] - (S.slidesGrid[a + 1] - S.slidesGrid[a]) / 2 ? e = a : s >= S.slidesGrid[a] && s < S.slidesGrid[a + 1] && (e = a + 1) : s >= S.slidesGrid[a] && (e = a);
        }S.params.normalizeSlideIndex && (e < 0 || "undefined" == typeof e) && (e = 0), t = Math.floor(e / S.params.slidesPerGroup), t >= S.snapGrid.length && (t = S.snapGrid.length - 1), e !== S.activeIndex && (S.snapIndex = t, S.previousIndex = S.activeIndex, S.activeIndex = e, S.updateClasses(), S.updateRealIndex());
      }, S.updateRealIndex = function () {
        S.realIndex = S.slides.eq(S.activeIndex).attr("data-swiper-slide-index") || S.activeIndex;
      }, S.updateClasses = function () {
        S.slides.removeClass(S.params.slideActiveClass + " " + S.params.slideNextClass + " " + S.params.slidePrevClass + " " + S.params.slideDuplicateActiveClass + " " + S.params.slideDuplicateNextClass + " " + S.params.slideDuplicatePrevClass);var e = S.slides.eq(S.activeIndex);e.addClass(S.params.slideActiveClass), i.loop && (e.hasClass(S.params.slideDuplicateClass) ? S.wrapper.children("." + S.params.slideClass + ":not(." + S.params.slideDuplicateClass + ')[data-swiper-slide-index="' + S.realIndex + '"]').addClass(S.params.slideDuplicateActiveClass) : S.wrapper.children("." + S.params.slideClass + "." + S.params.slideDuplicateClass + '[data-swiper-slide-index="' + S.realIndex + '"]').addClass(S.params.slideDuplicateActiveClass));var t = e.next("." + S.params.slideClass).addClass(S.params.slideNextClass);S.params.loop && 0 === t.length && (t = S.slides.eq(0), t.addClass(S.params.slideNextClass));var s = e.prev("." + S.params.slideClass).addClass(S.params.slidePrevClass);if (S.params.loop && 0 === s.length && (s = S.slides.eq(-1), s.addClass(S.params.slidePrevClass)), i.loop && (t.hasClass(S.params.slideDuplicateClass) ? S.wrapper.children("." + S.params.slideClass + ":not(." + S.params.slideDuplicateClass + ')[data-swiper-slide-index="' + t.attr("data-swiper-slide-index") + '"]').addClass(S.params.slideDuplicateNextClass) : S.wrapper.children("." + S.params.slideClass + "." + S.params.slideDuplicateClass + '[data-swiper-slide-index="' + t.attr("data-swiper-slide-index") + '"]').addClass(S.params.slideDuplicateNextClass), s.hasClass(S.params.slideDuplicateClass) ? S.wrapper.children("." + S.params.slideClass + ":not(." + S.params.slideDuplicateClass + ')[data-swiper-slide-index="' + s.attr("data-swiper-slide-index") + '"]').addClass(S.params.slideDuplicatePrevClass) : S.wrapper.children("." + S.params.slideClass + "." + S.params.slideDuplicateClass + '[data-swiper-slide-index="' + s.attr("data-swiper-slide-index") + '"]').addClass(S.params.slideDuplicatePrevClass)), S.paginationContainer && S.paginationContainer.length > 0) {
          var r,
              n = S.params.loop ? Math.ceil((S.slides.length - 2 * S.loopedSlides) / S.params.slidesPerGroup) : S.snapGrid.length;if (S.params.loop ? (r = Math.ceil((S.activeIndex - S.loopedSlides) / S.params.slidesPerGroup), r > S.slides.length - 1 - 2 * S.loopedSlides && (r -= S.slides.length - 2 * S.loopedSlides), r > n - 1 && (r -= n), r < 0 && "bullets" !== S.params.paginationType && (r = n + r)) : r = "undefined" != typeof S.snapIndex ? S.snapIndex : S.activeIndex || 0, "bullets" === S.params.paginationType && S.bullets && S.bullets.length > 0 && (S.bullets.removeClass(S.params.bulletActiveClass), S.paginationContainer.length > 1 ? S.bullets.each(function () {
            a(this).index() === r && a(this).addClass(S.params.bulletActiveClass);
          }) : S.bullets.eq(r).addClass(S.params.bulletActiveClass)), "fraction" === S.params.paginationType && (S.paginationContainer.find("." + S.params.paginationCurrentClass).text(r + 1), S.paginationContainer.find("." + S.params.paginationTotalClass).text(n)), "progress" === S.params.paginationType) {
            var o = (r + 1) / n,
                l = o,
                p = 1;S.isHorizontal() || (p = o, l = 1), S.paginationContainer.find("." + S.params.paginationProgressbarClass).transform("translate3d(0,0,0) scaleX(" + l + ") scaleY(" + p + ")").transition(S.params.speed);
          }"custom" === S.params.paginationType && S.params.paginationCustomRender && (S.paginationContainer.html(S.params.paginationCustomRender(S, r + 1, n)), S.emit("onPaginationRendered", S, S.paginationContainer[0]));
        }S.params.loop || (S.params.prevButton && S.prevButton && S.prevButton.length > 0 && (S.isBeginning ? (S.prevButton.addClass(S.params.buttonDisabledClass), S.params.a11y && S.a11y && S.a11y.disable(S.prevButton)) : (S.prevButton.removeClass(S.params.buttonDisabledClass), S.params.a11y && S.a11y && S.a11y.enable(S.prevButton))), S.params.nextButton && S.nextButton && S.nextButton.length > 0 && (S.isEnd ? (S.nextButton.addClass(S.params.buttonDisabledClass), S.params.a11y && S.a11y && S.a11y.disable(S.nextButton)) : (S.nextButton.removeClass(S.params.buttonDisabledClass), S.params.a11y && S.a11y && S.a11y.enable(S.nextButton))));
      }, S.updatePagination = function () {
        if (S.params.pagination && S.paginationContainer && S.paginationContainer.length > 0) {
          var e = "";if ("bullets" === S.params.paginationType) {
            for (var a = S.params.loop ? Math.ceil((S.slides.length - 2 * S.loopedSlides) / S.params.slidesPerGroup) : S.snapGrid.length, t = 0; t < a; t++) {
              e += S.params.paginationBulletRender ? S.params.paginationBulletRender(S, t, S.params.bulletClass) : "<" + S.params.paginationElement + ' class="' + S.params.bulletClass + '"></' + S.params.paginationElement + ">";
            }S.paginationContainer.html(e), S.bullets = S.paginationContainer.find("." + S.params.bulletClass), S.params.paginationClickable && S.params.a11y && S.a11y && S.a11y.initPagination();
          }"fraction" === S.params.paginationType && (e = S.params.paginationFractionRender ? S.params.paginationFractionRender(S, S.params.paginationCurrentClass, S.params.paginationTotalClass) : '<span class="' + S.params.paginationCurrentClass + '"></span> / <span class="' + S.params.paginationTotalClass + '"></span>', S.paginationContainer.html(e)), "progress" === S.params.paginationType && (e = S.params.paginationProgressRender ? S.params.paginationProgressRender(S, S.params.paginationProgressbarClass) : '<span class="' + S.params.paginationProgressbarClass + '"></span>', S.paginationContainer.html(e)), "custom" !== S.params.paginationType && S.emit("onPaginationRendered", S, S.paginationContainer[0]);
        }
      }, S.update = function (e) {
        function a() {
          S.rtl ? -S.translate : S.translate;s = Math.min(Math.max(S.translate, S.maxTranslate()), S.minTranslate()), S.setWrapperTranslate(s), S.updateActiveIndex(), S.updateClasses();
        }if (S.updateContainerSize(), S.updateSlidesSize(), S.updateProgress(), S.updatePagination(), S.updateClasses(), S.params.scrollbar && S.scrollbar && S.scrollbar.set(), e) {
          var t, s;S.controller && S.controller.spline && (S.controller.spline = void 0), S.params.freeMode ? (a(), S.params.autoHeight && S.updateAutoHeight()) : (t = ("auto" === S.params.slidesPerView || S.params.slidesPerView > 1) && S.isEnd && !S.params.centeredSlides ? S.slideTo(S.slides.length - 1, 0, !1, !0) : S.slideTo(S.activeIndex, 0, !1, !0), t || a());
        } else S.params.autoHeight && S.updateAutoHeight();
      }, S.onResize = function (e) {
        S.params.breakpoints && S.setBreakpoint();var a = S.params.allowSwipeToPrev,
            t = S.params.allowSwipeToNext;S.params.allowSwipeToPrev = S.params.allowSwipeToNext = !0, S.updateContainerSize(), S.updateSlidesSize(), ("auto" === S.params.slidesPerView || S.params.freeMode || e) && S.updatePagination(), S.params.scrollbar && S.scrollbar && S.scrollbar.set(), S.controller && S.controller.spline && (S.controller.spline = void 0);var s = !1;if (S.params.freeMode) {
          var i = Math.min(Math.max(S.translate, S.maxTranslate()), S.minTranslate());S.setWrapperTranslate(i), S.updateActiveIndex(), S.updateClasses(), S.params.autoHeight && S.updateAutoHeight();
        } else S.updateClasses(), s = ("auto" === S.params.slidesPerView || S.params.slidesPerView > 1) && S.isEnd && !S.params.centeredSlides ? S.slideTo(S.slides.length - 1, 0, !1, !0) : S.slideTo(S.activeIndex, 0, !1, !0);S.params.lazyLoading && !s && S.lazy && S.lazy.load(), S.params.allowSwipeToPrev = a, S.params.allowSwipeToNext = t;
      }, S.touchEventsDesktop = { start: "mousedown", move: "mousemove", end: "mouseup" }, window.navigator.pointerEnabled ? S.touchEventsDesktop = { start: "pointerdown", move: "pointermove", end: "pointerup" } : window.navigator.msPointerEnabled && (S.touchEventsDesktop = { start: "MSPointerDown", move: "MSPointerMove", end: "MSPointerUp" }), S.touchEvents = { start: S.support.touch || !S.params.simulateTouch ? "touchstart" : S.touchEventsDesktop.start, move: S.support.touch || !S.params.simulateTouch ? "touchmove" : S.touchEventsDesktop.move, end: S.support.touch || !S.params.simulateTouch ? "touchend" : S.touchEventsDesktop.end }, (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) && ("container" === S.params.touchEventsTarget ? S.container : S.wrapper).addClass("swiper-wp8-" + S.params.direction), S.initEvents = function (e) {
        var a = e ? "off" : "on",
            t = e ? "removeEventListener" : "addEventListener",
            s = "container" === S.params.touchEventsTarget ? S.container[0] : S.wrapper[0],
            r = S.support.touch ? s : document,
            n = !!S.params.nested;if (S.browser.ie) s[t](S.touchEvents.start, S.onTouchStart, !1), r[t](S.touchEvents.move, S.onTouchMove, n), r[t](S.touchEvents.end, S.onTouchEnd, !1);else {
          if (S.support.touch) {
            var o = !("touchstart" !== S.touchEvents.start || !S.support.passiveListener || !S.params.passiveListeners) && { passive: !0, capture: !1 };s[t](S.touchEvents.start, S.onTouchStart, o), s[t](S.touchEvents.move, S.onTouchMove, n), s[t](S.touchEvents.end, S.onTouchEnd, o);
          }(i.simulateTouch && !S.device.ios && !S.device.android || i.simulateTouch && !S.support.touch && S.device.ios) && (s[t]("mousedown", S.onTouchStart, !1), document[t]("mousemove", S.onTouchMove, n), document[t]("mouseup", S.onTouchEnd, !1));
        }window[t]("resize", S.onResize), S.params.nextButton && S.nextButton && S.nextButton.length > 0 && (S.nextButton[a]("click", S.onClickNext), S.params.a11y && S.a11y && S.nextButton[a]("keydown", S.a11y.onEnterKey)), S.params.prevButton && S.prevButton && S.prevButton.length > 0 && (S.prevButton[a]("click", S.onClickPrev), S.params.a11y && S.a11y && S.prevButton[a]("keydown", S.a11y.onEnterKey)), S.params.pagination && S.params.paginationClickable && (S.paginationContainer[a]("click", "." + S.params.bulletClass, S.onClickIndex), S.params.a11y && S.a11y && S.paginationContainer[a]("keydown", "." + S.params.bulletClass, S.a11y.onEnterKey)), (S.params.preventClicks || S.params.preventClicksPropagation) && s[t]("click", S.preventClicks, !0);
      }, S.attachEvents = function () {
        S.initEvents();
      }, S.detachEvents = function () {
        S.initEvents(!0);
      }, S.allowClick = !0, S.preventClicks = function (e) {
        S.allowClick || (S.params.preventClicks && e.preventDefault(), S.params.preventClicksPropagation && S.animating && (e.stopPropagation(), e.stopImmediatePropagation()));
      }, S.onClickNext = function (e) {
        e.preventDefault(), S.isEnd && !S.params.loop || S.slideNext();
      }, S.onClickPrev = function (e) {
        e.preventDefault(), S.isBeginning && !S.params.loop || S.slidePrev();
      }, S.onClickIndex = function (e) {
        e.preventDefault();var t = a(this).index() * S.params.slidesPerGroup;S.params.loop && (t += S.loopedSlides), S.slideTo(t);
      }, S.updateClickedSlide = function (e) {
        var t = l(e, "." + S.params.slideClass),
            s = !1;if (t) for (var i = 0; i < S.slides.length; i++) {
          S.slides[i] === t && (s = !0);
        }if (!t || !s) return S.clickedSlide = void 0, void (S.clickedIndex = void 0);if (S.clickedSlide = t, S.clickedIndex = a(t).index(), S.params.slideToClickedSlide && void 0 !== S.clickedIndex && S.clickedIndex !== S.activeIndex) {
          var r,
              n = S.clickedIndex;if (S.params.loop) {
            if (S.animating) return;r = a(S.clickedSlide).attr("data-swiper-slide-index"), S.params.centeredSlides ? n < S.loopedSlides - S.params.slidesPerView / 2 || n > S.slides.length - S.loopedSlides + S.params.slidesPerView / 2 ? (S.fixLoop(), n = S.wrapper.children("." + S.params.slideClass + '[data-swiper-slide-index="' + r + '"]:not(.' + S.params.slideDuplicateClass + ")").eq(0).index(), setTimeout(function () {
              S.slideTo(n);
            }, 0)) : S.slideTo(n) : n > S.slides.length - S.params.slidesPerView ? (S.fixLoop(), n = S.wrapper.children("." + S.params.slideClass + '[data-swiper-slide-index="' + r + '"]:not(.' + S.params.slideDuplicateClass + ")").eq(0).index(), setTimeout(function () {
              S.slideTo(n);
            }, 0)) : S.slideTo(n);
          } else S.slideTo(n);
        }
      };var z,
          M,
          E,
          P,
          I,
          k,
          L,
          D,
          B,
          H,
          G = "input, select, textarea, button, video",
          X = Date.now(),
          Y = [];S.animating = !1, S.touches = { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 };var A, O;S.onTouchStart = function (e) {
        if (e.originalEvent && (e = e.originalEvent), A = "touchstart" === e.type, A || !("which" in e) || 3 !== e.which) {
          if (S.params.noSwiping && l(e, "." + S.params.noSwipingClass)) return void (S.allowClick = !0);if (!S.params.swipeHandler || l(e, S.params.swipeHandler)) {
            var t = S.touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX,
                s = S.touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY;if (!(S.device.ios && S.params.iOSEdgeSwipeDetection && t <= S.params.iOSEdgeSwipeThreshold)) {
              if (z = !0, M = !1, E = !0, I = void 0, O = void 0, S.touches.startX = t, S.touches.startY = s, P = Date.now(), S.allowClick = !0, S.updateContainerSize(), S.swipeDirection = void 0, S.params.threshold > 0 && (D = !1), "touchstart" !== e.type) {
                var i = !0;a(e.target).is(G) && (i = !1), document.activeElement && a(document.activeElement).is(G) && document.activeElement.blur(), i && e.preventDefault();
              }S.emit("onTouchStart", S, e);
            }
          }
        }
      }, S.onTouchMove = function (e) {
        if (e.originalEvent && (e = e.originalEvent), !A || "mousemove" !== e.type) {
          if (e.preventedByNestedSwiper) return S.touches.startX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, void (S.touches.startY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY);if (S.params.onlyExternal) return S.allowClick = !1, void (z && (S.touches.startX = S.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, S.touches.startY = S.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, P = Date.now()));if (A && S.params.touchReleaseOnEdges && !S.params.loop) if (S.isHorizontal()) {
            if (S.touches.currentX < S.touches.startX && S.translate <= S.maxTranslate() || S.touches.currentX > S.touches.startX && S.translate >= S.minTranslate()) return;
          } else if (S.touches.currentY < S.touches.startY && S.translate <= S.maxTranslate() || S.touches.currentY > S.touches.startY && S.translate >= S.minTranslate()) return;if (A && document.activeElement && e.target === document.activeElement && a(e.target).is(G)) return M = !0, void (S.allowClick = !1);if (E && S.emit("onTouchMove", S, e), !(e.targetTouches && e.targetTouches.length > 1)) {
            if (S.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, S.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, "undefined" == typeof I) {
              var t;S.isHorizontal() && S.touches.currentY === S.touches.startY || !S.isHorizontal() && S.touches.currentX !== S.touches.startX ? I = !1 : (t = 180 * Math.atan2(Math.abs(S.touches.currentY - S.touches.startY), Math.abs(S.touches.currentX - S.touches.startX)) / Math.PI, I = S.isHorizontal() ? t > S.params.touchAngle : 90 - t > S.params.touchAngle);
            }if (I && S.emit("onTouchMoveOpposite", S, e), "undefined" == typeof O && S.browser.ieTouch && (S.touches.currentX === S.touches.startX && S.touches.currentY === S.touches.startY || (O = !0)), z) {
              if (I) return void (z = !1);if (O || !S.browser.ieTouch) {
                S.allowClick = !1, S.emit("onSliderMove", S, e), e.preventDefault(), S.params.touchMoveStopPropagation && !S.params.nested && e.stopPropagation(), M || (i.loop && S.fixLoop(), L = S.getWrapperTranslate(), S.setWrapperTransition(0), S.animating && S.wrapper.trigger("webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd"), S.params.autoplay && S.autoplaying && (S.params.autoplayDisableOnInteraction ? S.stopAutoplay() : S.pauseAutoplay()), H = !1, !S.params.grabCursor || S.params.allowSwipeToNext !== !0 && S.params.allowSwipeToPrev !== !0 || S.setGrabCursor(!0)), M = !0;var s = S.touches.diff = S.isHorizontal() ? S.touches.currentX - S.touches.startX : S.touches.currentY - S.touches.startY;s *= S.params.touchRatio, S.rtl && (s = -s), S.swipeDirection = s > 0 ? "prev" : "next", k = s + L;var r = !0;if (s > 0 && k > S.minTranslate() ? (r = !1, S.params.resistance && (k = S.minTranslate() - 1 + Math.pow(-S.minTranslate() + L + s, S.params.resistanceRatio))) : s < 0 && k < S.maxTranslate() && (r = !1, S.params.resistance && (k = S.maxTranslate() + 1 - Math.pow(S.maxTranslate() - L - s, S.params.resistanceRatio))), r && (e.preventedByNestedSwiper = !0), !S.params.allowSwipeToNext && "next" === S.swipeDirection && k < L && (k = L), !S.params.allowSwipeToPrev && "prev" === S.swipeDirection && k > L && (k = L), S.params.threshold > 0) {
                  if (!(Math.abs(s) > S.params.threshold || D)) return void (k = L);if (!D) return D = !0, S.touches.startX = S.touches.currentX, S.touches.startY = S.touches.currentY, k = L, void (S.touches.diff = S.isHorizontal() ? S.touches.currentX - S.touches.startX : S.touches.currentY - S.touches.startY);
                }S.params.followFinger && ((S.params.freeMode || S.params.watchSlidesProgress) && S.updateActiveIndex(), S.params.freeMode && (0 === Y.length && Y.push({ position: S.touches[S.isHorizontal() ? "startX" : "startY"], time: P }), Y.push({ position: S.touches[S.isHorizontal() ? "currentX" : "currentY"], time: new window.Date().getTime() })), S.updateProgress(k), S.setWrapperTranslate(k));
              }
            }
          }
        }
      }, S.onTouchEnd = function (e) {
        if (e.originalEvent && (e = e.originalEvent), E && S.emit("onTouchEnd", S, e), E = !1, z) {
          S.params.grabCursor && M && z && (S.params.allowSwipeToNext === !0 || S.params.allowSwipeToPrev === !0) && S.setGrabCursor(!1);var t = Date.now(),
              s = t - P;if (S.allowClick && (S.updateClickedSlide(e), S.emit("onTap", S, e), s < 300 && t - X > 300 && (B && clearTimeout(B), B = setTimeout(function () {
            S && (S.params.paginationHide && S.paginationContainer.length > 0 && !a(e.target).hasClass(S.params.bulletClass) && S.paginationContainer.toggleClass(S.params.paginationHiddenClass), S.emit("onClick", S, e));
          }, 300)), s < 300 && t - X < 300 && (B && clearTimeout(B), S.emit("onDoubleTap", S, e))), X = Date.now(), setTimeout(function () {
            S && (S.allowClick = !0);
          }, 0), !z || !M || !S.swipeDirection || 0 === S.touches.diff || k === L) return void (z = M = !1);z = M = !1;var i;if (i = S.params.followFinger ? S.rtl ? S.translate : -S.translate : -k, S.params.freeMode) {
            if (i < -S.minTranslate()) return void S.slideTo(S.activeIndex);if (i > -S.maxTranslate()) return void (S.slides.length < S.snapGrid.length ? S.slideTo(S.snapGrid.length - 1) : S.slideTo(S.slides.length - 1));if (S.params.freeModeMomentum) {
              if (Y.length > 1) {
                var r = Y.pop(),
                    n = Y.pop(),
                    o = r.position - n.position,
                    l = r.time - n.time;S.velocity = o / l, S.velocity = S.velocity / 2, Math.abs(S.velocity) < S.params.freeModeMinimumVelocity && (S.velocity = 0), (l > 150 || new window.Date().getTime() - r.time > 300) && (S.velocity = 0);
              } else S.velocity = 0;S.velocity = S.velocity * S.params.freeModeMomentumVelocityRatio, Y.length = 0;var p = 1e3 * S.params.freeModeMomentumRatio,
                  d = S.velocity * p,
                  u = S.translate + d;S.rtl && (u = -u);var c,
                  m = !1,
                  h = 20 * Math.abs(S.velocity) * S.params.freeModeMomentumBounceRatio;if (u < S.maxTranslate()) S.params.freeModeMomentumBounce ? (u + S.maxTranslate() < -h && (u = S.maxTranslate() - h), c = S.maxTranslate(), m = !0, H = !0) : u = S.maxTranslate();else if (u > S.minTranslate()) S.params.freeModeMomentumBounce ? (u - S.minTranslate() > h && (u = S.minTranslate() + h), c = S.minTranslate(), m = !0, H = !0) : u = S.minTranslate();else if (S.params.freeModeSticky) {
                var g,
                    f = 0;for (f = 0; f < S.snapGrid.length; f += 1) {
                  if (S.snapGrid[f] > -u) {
                    g = f;break;
                  }
                }u = Math.abs(S.snapGrid[g] - u) < Math.abs(S.snapGrid[g - 1] - u) || "next" === S.swipeDirection ? S.snapGrid[g] : S.snapGrid[g - 1], S.rtl || (u = -u);
              }if (0 !== S.velocity) p = S.rtl ? Math.abs((-u - S.translate) / S.velocity) : Math.abs((u - S.translate) / S.velocity);else if (S.params.freeModeSticky) return void S.slideReset();S.params.freeModeMomentumBounce && m ? (S.updateProgress(c), S.setWrapperTransition(p), S.setWrapperTranslate(u), S.onTransitionStart(), S.animating = !0, S.wrapper.transitionEnd(function () {
                S && H && (S.emit("onMomentumBounce", S), S.setWrapperTransition(S.params.speed), S.setWrapperTranslate(c), S.wrapper.transitionEnd(function () {
                  S && S.onTransitionEnd();
                }));
              })) : S.velocity ? (S.updateProgress(u), S.setWrapperTransition(p), S.setWrapperTranslate(u), S.onTransitionStart(), S.animating || (S.animating = !0, S.wrapper.transitionEnd(function () {
                S && S.onTransitionEnd();
              }))) : S.updateProgress(u), S.updateActiveIndex();
            }return void ((!S.params.freeModeMomentum || s >= S.params.longSwipesMs) && (S.updateProgress(), S.updateActiveIndex()));
          }var v,
              w = 0,
              y = S.slidesSizesGrid[0];for (v = 0; v < S.slidesGrid.length; v += S.params.slidesPerGroup) {
            "undefined" != typeof S.slidesGrid[v + S.params.slidesPerGroup] ? i >= S.slidesGrid[v] && i < S.slidesGrid[v + S.params.slidesPerGroup] && (w = v, y = S.slidesGrid[v + S.params.slidesPerGroup] - S.slidesGrid[v]) : i >= S.slidesGrid[v] && (w = v, y = S.slidesGrid[S.slidesGrid.length - 1] - S.slidesGrid[S.slidesGrid.length - 2]);
          }var x = (i - S.slidesGrid[w]) / y;if (s > S.params.longSwipesMs) {
            if (!S.params.longSwipes) return void S.slideTo(S.activeIndex);"next" === S.swipeDirection && (x >= S.params.longSwipesRatio ? S.slideTo(w + S.params.slidesPerGroup) : S.slideTo(w)), "prev" === S.swipeDirection && (x > 1 - S.params.longSwipesRatio ? S.slideTo(w + S.params.slidesPerGroup) : S.slideTo(w));
          } else {
            if (!S.params.shortSwipes) return void S.slideTo(S.activeIndex);"next" === S.swipeDirection && S.slideTo(w + S.params.slidesPerGroup), "prev" === S.swipeDirection && S.slideTo(w);
          }
        }
      }, S._slideTo = function (e, a) {
        return S.slideTo(e, a, !0, !0);
      }, S.slideTo = function (e, a, t, s) {
        "undefined" == typeof t && (t = !0), "undefined" == typeof e && (e = 0), e < 0 && (e = 0), S.snapIndex = Math.floor(e / S.params.slidesPerGroup), S.snapIndex >= S.snapGrid.length && (S.snapIndex = S.snapGrid.length - 1);var i = -S.snapGrid[S.snapIndex];if (S.params.autoplay && S.autoplaying && (s || !S.params.autoplayDisableOnInteraction ? S.pauseAutoplay(a) : S.stopAutoplay()), S.updateProgress(i), S.params.normalizeSlideIndex) for (var r = 0; r < S.slidesGrid.length; r++) {
          -Math.floor(100 * i) >= Math.floor(100 * S.slidesGrid[r]) && (e = r);
        }return !(!S.params.allowSwipeToNext && i < S.translate && i < S.minTranslate()) && !(!S.params.allowSwipeToPrev && i > S.translate && i > S.maxTranslate() && (S.activeIndex || 0) !== e) && ("undefined" == typeof a && (a = S.params.speed), S.previousIndex = S.activeIndex || 0, S.activeIndex = e, S.updateRealIndex(), S.rtl && -i === S.translate || !S.rtl && i === S.translate ? (S.params.autoHeight && S.updateAutoHeight(), S.updateClasses(), "slide" !== S.params.effect && S.setWrapperTranslate(i), !1) : (S.updateClasses(), S.onTransitionStart(t), 0 === a || S.browser.lteIE9 ? (S.setWrapperTranslate(i), S.setWrapperTransition(0), S.onTransitionEnd(t)) : (S.setWrapperTranslate(i), S.setWrapperTransition(a), S.animating || (S.animating = !0, S.wrapper.transitionEnd(function () {
          S && S.onTransitionEnd(t);
        }))), !0));
      }, S.onTransitionStart = function (e) {
        "undefined" == typeof e && (e = !0), S.params.autoHeight && S.updateAutoHeight(), S.lazy && S.lazy.onTransitionStart(), e && (S.emit("onTransitionStart", S), S.activeIndex !== S.previousIndex && (S.emit("onSlideChangeStart", S), S.activeIndex > S.previousIndex ? S.emit("onSlideNextStart", S) : S.emit("onSlidePrevStart", S)));
      }, S.onTransitionEnd = function (e) {
        S.animating = !1, S.setWrapperTransition(0), "undefined" == typeof e && (e = !0), S.lazy && S.lazy.onTransitionEnd(), e && (S.emit("onTransitionEnd", S), S.activeIndex !== S.previousIndex && (S.emit("onSlideChangeEnd", S), S.activeIndex > S.previousIndex ? S.emit("onSlideNextEnd", S) : S.emit("onSlidePrevEnd", S))), S.params.history && S.history && S.history.setHistory(S.params.history, S.activeIndex), S.params.hashnav && S.hashnav && S.hashnav.setHash();
      }, S.slideNext = function (e, a, t) {
        if (S.params.loop) {
          if (S.animating) return !1;S.fixLoop();S.container[0].clientLeft;return S.slideTo(S.activeIndex + S.params.slidesPerGroup, a, e, t);
        }return S.slideTo(S.activeIndex + S.params.slidesPerGroup, a, e, t);
      }, S._slideNext = function (e) {
        return S.slideNext(!0, e, !0);
      }, S.slidePrev = function (e, a, t) {
        if (S.params.loop) {
          if (S.animating) return !1;S.fixLoop();S.container[0].clientLeft;return S.slideTo(S.activeIndex - 1, a, e, t);
        }return S.slideTo(S.activeIndex - 1, a, e, t);
      }, S._slidePrev = function (e) {
        return S.slidePrev(!0, e, !0);
      }, S.slideReset = function (e, a, t) {
        return S.slideTo(S.activeIndex, a, e);
      }, S.disableTouchControl = function () {
        return S.params.onlyExternal = !0, !0;
      }, S.enableTouchControl = function () {
        return S.params.onlyExternal = !1, !0;
      }, S.setWrapperTransition = function (e, a) {
        S.wrapper.transition(e), "slide" !== S.params.effect && S.effects[S.params.effect] && S.effects[S.params.effect].setTransition(e), S.params.parallax && S.parallax && S.parallax.setTransition(e), S.params.scrollbar && S.scrollbar && S.scrollbar.setTransition(e), S.params.control && S.controller && S.controller.setTransition(e, a), S.emit("onSetTransition", S, e);
      }, S.setWrapperTranslate = function (e, a, t) {
        var s = 0,
            i = 0,
            r = 0;S.isHorizontal() ? s = S.rtl ? -e : e : i = e, S.params.roundLengths && (s = n(s), i = n(i)), S.params.virtualTranslate || (S.support.transforms3d ? S.wrapper.transform("translate3d(" + s + "px, " + i + "px, " + r + "px)") : S.wrapper.transform("translate(" + s + "px, " + i + "px)")), S.translate = S.isHorizontal() ? s : i;var o,
            l = S.maxTranslate() - S.minTranslate();o = 0 === l ? 0 : (e - S.minTranslate()) / l, o !== S.progress && S.updateProgress(e), a && S.updateActiveIndex(), "slide" !== S.params.effect && S.effects[S.params.effect] && S.effects[S.params.effect].setTranslate(S.translate), S.params.parallax && S.parallax && S.parallax.setTranslate(S.translate), S.params.scrollbar && S.scrollbar && S.scrollbar.setTranslate(S.translate), S.params.control && S.controller && S.controller.setTranslate(S.translate, t), S.emit("onSetTranslate", S, S.translate);
      }, S.getTranslate = function (e, a) {
        var t, s, i, r;return "undefined" == typeof a && (a = "x"), S.params.virtualTranslate ? S.rtl ? -S.translate : S.translate : (i = window.getComputedStyle(e, null), window.WebKitCSSMatrix ? (s = i.transform || i.webkitTransform, s.split(",").length > 6 && (s = s.split(", ").map(function (e) {
          return e.replace(",", ".");
        }).join(", ")), r = new window.WebKitCSSMatrix("none" === s ? "" : s)) : (r = i.MozTransform || i.OTransform || i.MsTransform || i.msTransform || i.transform || i.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), t = r.toString().split(",")), "x" === a && (s = window.WebKitCSSMatrix ? r.m41 : 16 === t.length ? parseFloat(t[12]) : parseFloat(t[4])), "y" === a && (s = window.WebKitCSSMatrix ? r.m42 : 16 === t.length ? parseFloat(t[13]) : parseFloat(t[5])), S.rtl && s && (s = -s), s || 0);
      }, S.getWrapperTranslate = function (e) {
        return "undefined" == typeof e && (e = S.isHorizontal() ? "x" : "y"), S.getTranslate(S.wrapper[0], e);
      }, S.observers = [], S.initObservers = function () {
        if (S.params.observeParents) for (var e = S.container.parents(), a = 0; a < e.length; a++) {
          p(e[a]);
        }p(S.container[0], { childList: !1 }), p(S.wrapper[0], { attributes: !1 });
      }, S.disconnectObservers = function () {
        for (var e = 0; e < S.observers.length; e++) {
          S.observers[e].disconnect();
        }S.observers = [];
      }, S.createLoop = function () {
        S.wrapper.children("." + S.params.slideClass + "." + S.params.slideDuplicateClass).remove();var e = S.wrapper.children("." + S.params.slideClass);"auto" !== S.params.slidesPerView || S.params.loopedSlides || (S.params.loopedSlides = e.length), S.loopedSlides = parseInt(S.params.loopedSlides || S.params.slidesPerView, 10), S.loopedSlides = S.loopedSlides + S.params.loopAdditionalSlides, S.loopedSlides > e.length && (S.loopedSlides = e.length);var t,
            s = [],
            i = [];for (e.each(function (t, r) {
          var n = a(this);t < S.loopedSlides && i.push(r), t < e.length && t >= e.length - S.loopedSlides && s.push(r), n.attr("data-swiper-slide-index", t);
        }), t = 0; t < i.length; t++) {
          S.wrapper.append(a(i[t].cloneNode(!0)).addClass(S.params.slideDuplicateClass));
        }for (t = s.length - 1; t >= 0; t--) {
          S.wrapper.prepend(a(s[t].cloneNode(!0)).addClass(S.params.slideDuplicateClass));
        }
      }, S.destroyLoop = function () {
        S.wrapper.children("." + S.params.slideClass + "." + S.params.slideDuplicateClass).remove(), S.slides.removeAttr("data-swiper-slide-index");
      }, S.reLoop = function (e) {
        var a = S.activeIndex - S.loopedSlides;S.destroyLoop(), S.createLoop(), S.updateSlidesSize(), e && S.slideTo(a + S.loopedSlides, 0, !1);
      }, S.fixLoop = function () {
        var e;S.activeIndex < S.loopedSlides ? (e = S.slides.length - 3 * S.loopedSlides + S.activeIndex, e += S.loopedSlides, S.slideTo(e, 0, !1, !0)) : ("auto" === S.params.slidesPerView && S.activeIndex >= 2 * S.loopedSlides || S.activeIndex > S.slides.length - 2 * S.params.slidesPerView) && (e = -S.slides.length + S.activeIndex + S.loopedSlides, e += S.loopedSlides, S.slideTo(e, 0, !1, !0));
      }, S.appendSlide = function (e) {
        if (S.params.loop && S.destroyLoop(), "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && e.length) for (var a = 0; a < e.length; a++) {
          e[a] && S.wrapper.append(e[a]);
        } else S.wrapper.append(e);S.params.loop && S.createLoop(), S.params.observer && S.support.observer || S.update(!0);
      }, S.prependSlide = function (e) {
        S.params.loop && S.destroyLoop();var a = S.activeIndex + 1;if ("object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && e.length) {
          for (var t = 0; t < e.length; t++) {
            e[t] && S.wrapper.prepend(e[t]);
          }a = S.activeIndex + e.length;
        } else S.wrapper.prepend(e);S.params.loop && S.createLoop(), S.params.observer && S.support.observer || S.update(!0), S.slideTo(a, 0, !1);
      }, S.removeSlide = function (e) {
        S.params.loop && (S.destroyLoop(), S.slides = S.wrapper.children("." + S.params.slideClass));var a,
            t = S.activeIndex;if ("object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && e.length) {
          for (var s = 0; s < e.length; s++) {
            a = e[s], S.slides[a] && S.slides.eq(a).remove(), a < t && t--;
          }t = Math.max(t, 0);
        } else a = e, S.slides[a] && S.slides.eq(a).remove(), a < t && t--, t = Math.max(t, 0);S.params.loop && S.createLoop(), S.params.observer && S.support.observer || S.update(!0), S.params.loop ? S.slideTo(t + S.loopedSlides, 0, !1) : S.slideTo(t, 0, !1);
      }, S.removeAllSlides = function () {
        for (var e = [], a = 0; a < S.slides.length; a++) {
          e.push(a);
        }S.removeSlide(e);
      }, S.effects = { fade: { setTranslate: function setTranslate() {
            for (var e = 0; e < S.slides.length; e++) {
              var a = S.slides.eq(e),
                  t = a[0].swiperSlideOffset,
                  s = -t;S.params.virtualTranslate || (s -= S.translate);var i = 0;S.isHorizontal() || (i = s, s = 0);var r = S.params.fade.crossFade ? Math.max(1 - Math.abs(a[0].progress), 0) : 1 + Math.min(Math.max(a[0].progress, -1), 0);a.css({ opacity: r }).transform("translate3d(" + s + "px, " + i + "px, 0px)");
            }
          }, setTransition: function setTransition(e) {
            if (S.slides.transition(e), S.params.virtualTranslate && 0 !== e) {
              var a = !1;S.slides.transitionEnd(function () {
                if (!a && S) {
                  a = !0, S.animating = !1;for (var e = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], t = 0; t < e.length; t++) {
                    S.wrapper.trigger(e[t]);
                  }
                }
              });
            }
          } }, flip: { setTranslate: function setTranslate() {
            for (var e = 0; e < S.slides.length; e++) {
              var t = S.slides.eq(e),
                  s = t[0].progress;S.params.flip.limitRotation && (s = Math.max(Math.min(t[0].progress, 1), -1));var i = t[0].swiperSlideOffset,
                  r = -180 * s,
                  n = r,
                  o = 0,
                  l = -i,
                  p = 0;if (S.isHorizontal() ? S.rtl && (n = -n) : (p = l, l = 0, o = -n, n = 0), t[0].style.zIndex = -Math.abs(Math.round(s)) + S.slides.length, S.params.flip.slideShadows) {
                var d = S.isHorizontal() ? t.find(".swiper-slide-shadow-left") : t.find(".swiper-slide-shadow-top"),
                    u = S.isHorizontal() ? t.find(".swiper-slide-shadow-right") : t.find(".swiper-slide-shadow-bottom");0 === d.length && (d = a('<div class="swiper-slide-shadow-' + (S.isHorizontal() ? "left" : "top") + '"></div>'), t.append(d)), 0 === u.length && (u = a('<div class="swiper-slide-shadow-' + (S.isHorizontal() ? "right" : "bottom") + '"></div>'), t.append(u)), d.length && (d[0].style.opacity = Math.max(-s, 0)), u.length && (u[0].style.opacity = Math.max(s, 0));
              }t.transform("translate3d(" + l + "px, " + p + "px, 0px) rotateX(" + o + "deg) rotateY(" + n + "deg)");
            }
          }, setTransition: function setTransition(e) {
            if (S.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), S.params.virtualTranslate && 0 !== e) {
              var t = !1;S.slides.eq(S.activeIndex).transitionEnd(function () {
                if (!t && S && a(this).hasClass(S.params.slideActiveClass)) {
                  t = !0, S.animating = !1;for (var e = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], s = 0; s < e.length; s++) {
                    S.wrapper.trigger(e[s]);
                  }
                }
              });
            }
          } }, cube: { setTranslate: function setTranslate() {
            var e,
                t = 0;S.params.cube.shadow && (S.isHorizontal() ? (e = S.wrapper.find(".swiper-cube-shadow"), 0 === e.length && (e = a('<div class="swiper-cube-shadow"></div>'), S.wrapper.append(e)), e.css({ height: S.width + "px" })) : (e = S.container.find(".swiper-cube-shadow"), 0 === e.length && (e = a('<div class="swiper-cube-shadow"></div>'), S.container.append(e))));for (var s = 0; s < S.slides.length; s++) {
              var i = S.slides.eq(s),
                  r = 90 * s,
                  n = Math.floor(r / 360);S.rtl && (r = -r, n = Math.floor(-r / 360));var o = Math.max(Math.min(i[0].progress, 1), -1),
                  l = 0,
                  p = 0,
                  d = 0;s % 4 === 0 ? (l = 4 * -n * S.size, d = 0) : (s - 1) % 4 === 0 ? (l = 0, d = 4 * -n * S.size) : (s - 2) % 4 === 0 ? (l = S.size + 4 * n * S.size, d = S.size) : (s - 3) % 4 === 0 && (l = -S.size, d = 3 * S.size + 4 * S.size * n), S.rtl && (l = -l), S.isHorizontal() || (p = l, l = 0);var u = "rotateX(" + (S.isHorizontal() ? 0 : -r) + "deg) rotateY(" + (S.isHorizontal() ? r : 0) + "deg) translate3d(" + l + "px, " + p + "px, " + d + "px)";if (o <= 1 && o > -1 && (t = 90 * s + 90 * o, S.rtl && (t = 90 * -s - 90 * o)), i.transform(u), S.params.cube.slideShadows) {
                var c = S.isHorizontal() ? i.find(".swiper-slide-shadow-left") : i.find(".swiper-slide-shadow-top"),
                    m = S.isHorizontal() ? i.find(".swiper-slide-shadow-right") : i.find(".swiper-slide-shadow-bottom");0 === c.length && (c = a('<div class="swiper-slide-shadow-' + (S.isHorizontal() ? "left" : "top") + '"></div>'), i.append(c)), 0 === m.length && (m = a('<div class="swiper-slide-shadow-' + (S.isHorizontal() ? "right" : "bottom") + '"></div>'), i.append(m)), c.length && (c[0].style.opacity = Math.max(-o, 0)), m.length && (m[0].style.opacity = Math.max(o, 0));
              }
            }if (S.wrapper.css({ "-webkit-transform-origin": "50% 50% -" + S.size / 2 + "px", "-moz-transform-origin": "50% 50% -" + S.size / 2 + "px", "-ms-transform-origin": "50% 50% -" + S.size / 2 + "px", "transform-origin": "50% 50% -" + S.size / 2 + "px" }), S.params.cube.shadow) if (S.isHorizontal()) e.transform("translate3d(0px, " + (S.width / 2 + S.params.cube.shadowOffset) + "px, " + -S.width / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + S.params.cube.shadowScale + ")");else {
              var h = Math.abs(t) - 90 * Math.floor(Math.abs(t) / 90),
                  g = 1.5 - (Math.sin(2 * h * Math.PI / 360) / 2 + Math.cos(2 * h * Math.PI / 360) / 2),
                  f = S.params.cube.shadowScale,
                  v = S.params.cube.shadowScale / g,
                  w = S.params.cube.shadowOffset;e.transform("scale3d(" + f + ", 1, " + v + ") translate3d(0px, " + (S.height / 2 + w) + "px, " + -S.height / 2 / v + "px) rotateX(-90deg)");
            }var y = S.isSafari || S.isUiWebView ? -S.size / 2 : 0;S.wrapper.transform("translate3d(0px,0," + y + "px) rotateX(" + (S.isHorizontal() ? 0 : t) + "deg) rotateY(" + (S.isHorizontal() ? -t : 0) + "deg)");
          }, setTransition: function setTransition(e) {
            S.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), S.params.cube.shadow && !S.isHorizontal() && S.container.find(".swiper-cube-shadow").transition(e);
          } }, coverflow: { setTranslate: function setTranslate() {
            for (var e = S.translate, t = S.isHorizontal() ? -e + S.width / 2 : -e + S.height / 2, s = S.isHorizontal() ? S.params.coverflow.rotate : -S.params.coverflow.rotate, i = S.params.coverflow.depth, r = 0, n = S.slides.length; r < n; r++) {
              var o = S.slides.eq(r),
                  l = S.slidesSizesGrid[r],
                  p = o[0].swiperSlideOffset,
                  d = (t - p - l / 2) / l * S.params.coverflow.modifier,
                  u = S.isHorizontal() ? s * d : 0,
                  c = S.isHorizontal() ? 0 : s * d,
                  m = -i * Math.abs(d),
                  h = S.isHorizontal() ? 0 : S.params.coverflow.stretch * d,
                  g = S.isHorizontal() ? S.params.coverflow.stretch * d : 0;Math.abs(g) < .001 && (g = 0), Math.abs(h) < .001 && (h = 0), Math.abs(m) < .001 && (m = 0), Math.abs(u) < .001 && (u = 0), Math.abs(c) < .001 && (c = 0);var f = "translate3d(" + g + "px," + h + "px," + m + "px)  rotateX(" + c + "deg) rotateY(" + u + "deg)";if (o.transform(f), o[0].style.zIndex = -Math.abs(Math.round(d)) + 1, S.params.coverflow.slideShadows) {
                var v = S.isHorizontal() ? o.find(".swiper-slide-shadow-left") : o.find(".swiper-slide-shadow-top"),
                    w = S.isHorizontal() ? o.find(".swiper-slide-shadow-right") : o.find(".swiper-slide-shadow-bottom");0 === v.length && (v = a('<div class="swiper-slide-shadow-' + (S.isHorizontal() ? "left" : "top") + '"></div>'), o.append(v)), 0 === w.length && (w = a('<div class="swiper-slide-shadow-' + (S.isHorizontal() ? "right" : "bottom") + '"></div>'), o.append(w)), v.length && (v[0].style.opacity = d > 0 ? d : 0), w.length && (w[0].style.opacity = -d > 0 ? -d : 0);
              }
            }if (S.browser.ie) {
              var y = S.wrapper[0].style;y.perspectiveOrigin = t + "px 50%";
            }
          }, setTransition: function setTransition(e) {
            S.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e);
          } } }, S.lazy = { initialImageLoaded: !1, loadImageInSlide: function loadImageInSlide(e, t) {
          if ("undefined" != typeof e && ("undefined" == typeof t && (t = !0), 0 !== S.slides.length)) {
            var s = S.slides.eq(e),
                i = s.find("." + S.params.lazyLoadingClass + ":not(." + S.params.lazyStatusLoadedClass + "):not(." + S.params.lazyStatusLoadingClass + ")");!s.hasClass(S.params.lazyLoadingClass) || s.hasClass(S.params.lazyStatusLoadedClass) || s.hasClass(S.params.lazyStatusLoadingClass) || (i = i.add(s[0])), 0 !== i.length && i.each(function () {
              var e = a(this);e.addClass(S.params.lazyStatusLoadingClass);var i = e.attr("data-background"),
                  r = e.attr("data-src"),
                  n = e.attr("data-srcset"),
                  o = e.attr("data-sizes");S.loadImage(e[0], r || i, n, o, !1, function () {
                if (i ? (e.css("background-image", 'url("' + i + '")'), e.removeAttr("data-background")) : (n && (e.attr("srcset", n), e.removeAttr("data-srcset")), o && (e.attr("sizes", o), e.removeAttr("data-sizes")), r && (e.attr("src", r), e.removeAttr("data-src"))), e.addClass(S.params.lazyStatusLoadedClass).removeClass(S.params.lazyStatusLoadingClass), s.find("." + S.params.lazyPreloaderClass + ", ." + S.params.preloaderClass).remove(), S.params.loop && t) {
                  var a = s.attr("data-swiper-slide-index");if (s.hasClass(S.params.slideDuplicateClass)) {
                    var l = S.wrapper.children('[data-swiper-slide-index="' + a + '"]:not(.' + S.params.slideDuplicateClass + ")");S.lazy.loadImageInSlide(l.index(), !1);
                  } else {
                    var p = S.wrapper.children("." + S.params.slideDuplicateClass + '[data-swiper-slide-index="' + a + '"]');S.lazy.loadImageInSlide(p.index(), !1);
                  }
                }S.emit("onLazyImageReady", S, s[0], e[0]);
              }), S.emit("onLazyImageLoad", S, s[0], e[0]);
            });
          }
        }, load: function load() {
          var e,
              t = S.params.slidesPerView;if ("auto" === t && (t = 0), S.lazy.initialImageLoaded || (S.lazy.initialImageLoaded = !0), S.params.watchSlidesVisibility) S.wrapper.children("." + S.params.slideVisibleClass).each(function () {
            S.lazy.loadImageInSlide(a(this).index());
          });else if (t > 1) for (e = S.activeIndex; e < S.activeIndex + t; e++) {
            S.slides[e] && S.lazy.loadImageInSlide(e);
          } else S.lazy.loadImageInSlide(S.activeIndex);if (S.params.lazyLoadingInPrevNext) if (t > 1 || S.params.lazyLoadingInPrevNextAmount && S.params.lazyLoadingInPrevNextAmount > 1) {
            var s = S.params.lazyLoadingInPrevNextAmount,
                i = t,
                r = Math.min(S.activeIndex + i + Math.max(s, i), S.slides.length),
                n = Math.max(S.activeIndex - Math.max(i, s), 0);for (e = S.activeIndex + t; e < r; e++) {
              S.slides[e] && S.lazy.loadImageInSlide(e);
            }for (e = n; e < S.activeIndex; e++) {
              S.slides[e] && S.lazy.loadImageInSlide(e);
            }
          } else {
            var o = S.wrapper.children("." + S.params.slideNextClass);o.length > 0 && S.lazy.loadImageInSlide(o.index());var l = S.wrapper.children("." + S.params.slidePrevClass);l.length > 0 && S.lazy.loadImageInSlide(l.index());
          }
        }, onTransitionStart: function onTransitionStart() {
          S.params.lazyLoading && (S.params.lazyLoadingOnTransitionStart || !S.params.lazyLoadingOnTransitionStart && !S.lazy.initialImageLoaded) && S.lazy.load();
        }, onTransitionEnd: function onTransitionEnd() {
          S.params.lazyLoading && !S.params.lazyLoadingOnTransitionStart && S.lazy.load();
        } }, S.scrollbar = { isTouched: !1, setDragPosition: function setDragPosition(e) {
          var a = S.scrollbar,
              t = S.isHorizontal() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX || e.clientX : "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY || e.clientY,
              s = t - a.track.offset()[S.isHorizontal() ? "left" : "top"] - a.dragSize / 2,
              i = -S.minTranslate() * a.moveDivider,
              r = -S.maxTranslate() * a.moveDivider;s < i ? s = i : s > r && (s = r), s = -s / a.moveDivider, S.updateProgress(s), S.setWrapperTranslate(s, !0);
        }, dragStart: function dragStart(e) {
          var a = S.scrollbar;a.isTouched = !0, e.preventDefault(), e.stopPropagation(), a.setDragPosition(e), clearTimeout(a.dragTimeout), a.track.transition(0), S.params.scrollbarHide && a.track.css("opacity", 1), S.wrapper.transition(100), a.drag.transition(100), S.emit("onScrollbarDragStart", S);
        }, dragMove: function dragMove(e) {
          var a = S.scrollbar;a.isTouched && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, a.setDragPosition(e), S.wrapper.transition(0), a.track.transition(0), a.drag.transition(0), S.emit("onScrollbarDragMove", S));
        }, dragEnd: function dragEnd(e) {
          var a = S.scrollbar;a.isTouched && (a.isTouched = !1, S.params.scrollbarHide && (clearTimeout(a.dragTimeout), a.dragTimeout = setTimeout(function () {
            a.track.css("opacity", 0), a.track.transition(400);
          }, 1e3)), S.emit("onScrollbarDragEnd", S), S.params.scrollbarSnapOnRelease && S.slideReset());
        }, draggableEvents: function () {
          return S.params.simulateTouch !== !1 || S.support.touch ? S.touchEvents : S.touchEventsDesktop;
        }(), enableDraggable: function enableDraggable() {
          var e = S.scrollbar,
              t = S.support.touch ? e.track : document;a(e.track).on(e.draggableEvents.start, e.dragStart), a(t).on(e.draggableEvents.move, e.dragMove), a(t).on(e.draggableEvents.end, e.dragEnd);
        }, disableDraggable: function disableDraggable() {
          var e = S.scrollbar,
              t = S.support.touch ? e.track : document;a(e.track).off(S.draggableEvents.start, e.dragStart), a(t).off(S.draggableEvents.move, e.dragMove), a(t).off(S.draggableEvents.end, e.dragEnd);
        }, set: function set() {
          if (S.params.scrollbar) {
            var e = S.scrollbar;e.track = a(S.params.scrollbar), S.params.uniqueNavElements && "string" == typeof S.params.scrollbar && e.track.length > 1 && 1 === S.container.find(S.params.scrollbar).length && (e.track = S.container.find(S.params.scrollbar)), e.drag = e.track.find(".swiper-scrollbar-drag"), 0 === e.drag.length && (e.drag = a('<div class="swiper-scrollbar-drag"></div>'), e.track.append(e.drag)), e.drag[0].style.width = "", e.drag[0].style.height = "", e.trackSize = S.isHorizontal() ? e.track[0].offsetWidth : e.track[0].offsetHeight, e.divider = S.size / S.virtualSize, e.moveDivider = e.divider * (e.trackSize / S.size), e.dragSize = e.trackSize * e.divider, S.isHorizontal() ? e.drag[0].style.width = e.dragSize + "px" : e.drag[0].style.height = e.dragSize + "px", e.divider >= 1 ? e.track[0].style.display = "none" : e.track[0].style.display = "", S.params.scrollbarHide && (e.track[0].style.opacity = 0);
          }
        }, setTranslate: function setTranslate() {
          if (S.params.scrollbar) {
            var e,
                a = S.scrollbar,
                t = (S.translate || 0, a.dragSize);e = (a.trackSize - a.dragSize) * S.progress, S.rtl && S.isHorizontal() ? (e = -e, e > 0 ? (t = a.dragSize - e, e = 0) : -e + a.dragSize > a.trackSize && (t = a.trackSize + e)) : e < 0 ? (t = a.dragSize + e, e = 0) : e + a.dragSize > a.trackSize && (t = a.trackSize - e), S.isHorizontal() ? (S.support.transforms3d ? a.drag.transform("translate3d(" + e + "px, 0, 0)") : a.drag.transform("translateX(" + e + "px)"), a.drag[0].style.width = t + "px") : (S.support.transforms3d ? a.drag.transform("translate3d(0px, " + e + "px, 0)") : a.drag.transform("translateY(" + e + "px)"), a.drag[0].style.height = t + "px"), S.params.scrollbarHide && (clearTimeout(a.timeout), a.track[0].style.opacity = 1, a.timeout = setTimeout(function () {
              a.track[0].style.opacity = 0, a.track.transition(400);
            }, 1e3));
          }
        }, setTransition: function setTransition(e) {
          S.params.scrollbar && S.scrollbar.drag.transition(e);
        } }, S.controller = { LinearSpline: function LinearSpline(e, a) {
          this.x = e, this.y = a, this.lastIndex = e.length - 1;var t, s;this.x.length;this.interpolate = function (e) {
            return e ? (s = i(this.x, e), t = s - 1, (e - this.x[t]) * (this.y[s] - this.y[t]) / (this.x[s] - this.x[t]) + this.y[t]) : 0;
          };var i = function () {
            var e, a, t;return function (s, i) {
              for (a = -1, e = s.length; e - a > 1;) {
                s[t = e + a >> 1] <= i ? a = t : e = t;
              }return e;
            };
          }();
        }, getInterpolateFunction: function getInterpolateFunction(e) {
          S.controller.spline || (S.controller.spline = S.params.loop ? new S.controller.LinearSpline(S.slidesGrid, e.slidesGrid) : new S.controller.LinearSpline(S.snapGrid, e.snapGrid));
        }, setTranslate: function setTranslate(e, a) {
          function s(a) {
            e = a.rtl && "horizontal" === a.params.direction ? -S.translate : S.translate, "slide" === S.params.controlBy && (S.controller.getInterpolateFunction(a), r = -S.controller.spline.interpolate(-e)), r && "container" !== S.params.controlBy || (i = (a.maxTranslate() - a.minTranslate()) / (S.maxTranslate() - S.minTranslate()), r = (e - S.minTranslate()) * i + a.minTranslate()), S.params.controlInverse && (r = a.maxTranslate() - r), a.updateProgress(r), a.setWrapperTranslate(r, !1, S), a.updateActiveIndex();
          }var i,
              r,
              n = S.params.control;if (S.isArray(n)) for (var o = 0; o < n.length; o++) {
            n[o] !== a && n[o] instanceof t && s(n[o]);
          } else n instanceof t && a !== n && s(n);
        }, setTransition: function setTransition(e, a) {
          function s(a) {
            a.setWrapperTransition(e, S), 0 !== e && (a.onTransitionStart(), a.wrapper.transitionEnd(function () {
              r && (a.params.loop && "slide" === S.params.controlBy && a.fixLoop(), a.onTransitionEnd());
            }));
          }var i,
              r = S.params.control;if (S.isArray(r)) for (i = 0; i < r.length; i++) {
            r[i] !== a && r[i] instanceof t && s(r[i]);
          } else r instanceof t && a !== r && s(r);
        } }, S.hashnav = { onHashCange: function onHashCange(e, a) {
          var t = document.location.hash.replace("#", ""),
              s = S.slides.eq(S.activeIndex).attr("data-hash");t !== s && S.slideTo(S.wrapper.children("." + S.params.slideClass + '[data-hash="' + t + '"]').index());
        }, attachEvents: function attachEvents(e) {
          var t = e ? "off" : "on";a(window)[t]("hashchange", S.hashnav.onHashCange);
        }, setHash: function setHash() {
          if (S.hashnav.initialized && S.params.hashnav) if (S.params.replaceState && window.history && window.history.replaceState) window.history.replaceState(null, null, "#" + S.slides.eq(S.activeIndex).attr("data-hash") || "");else {
            var e = S.slides.eq(S.activeIndex),
                a = e.attr("data-hash") || e.attr("data-history");document.location.hash = a || "";
          }
        }, init: function init() {
          if (S.params.hashnav && !S.params.history) {
            S.hashnav.initialized = !0;var e = document.location.hash.replace("#", "");if (e) {
              for (var a = 0, t = 0, s = S.slides.length; t < s; t++) {
                var i = S.slides.eq(t),
                    r = i.attr("data-hash") || i.attr("data-history");if (r === e && !i.hasClass(S.params.slideDuplicateClass)) {
                  var n = i.index();S.slideTo(n, a, S.params.runCallbacksOnInit, !0);
                }
              }S.params.hashnavWatchState && S.hashnav.attachEvents();
            }
          }
        }, destroy: function destroy() {
          S.params.hashnavWatchState && S.hashnav.attachEvents(!0);
        } }, S.history = { init: function init() {
          if (S.params.history) {
            if (!window.history || !window.history.pushState) return S.params.history = !1, void (S.params.hashnav = !0);S.history.initialized = !0, this.paths = this.getPathValues(), (this.paths.key || this.paths.value) && (this.scrollToSlide(0, this.paths.value, S.params.runCallbacksOnInit), S.params.replaceState || window.addEventListener("popstate", this.setHistoryPopState));
          }
        }, setHistoryPopState: function setHistoryPopState() {
          S.history.paths = S.history.getPathValues(), S.history.scrollToSlide(S.params.speed, S.history.paths.value, !1);
        }, getPathValues: function getPathValues() {
          var e = window.location.pathname.slice(1).split("/"),
              a = e.length,
              t = e[a - 2],
              s = e[a - 1];return { key: t, value: s };
        }, setHistory: function setHistory(e, a) {
          if (S.history.initialized && S.params.history) {
            var t = S.slides.eq(a),
                s = this.slugify(t.attr("data-history"));window.location.pathname.includes(e) || (s = e + "/" + s), S.params.replaceState ? window.history.replaceState(null, null, s) : window.history.pushState(null, null, s);
          }
        }, slugify: function slugify(e) {
          return e.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
        }, scrollToSlide: function scrollToSlide(e, a, t) {
          if (a) for (var s = 0, i = S.slides.length; s < i; s++) {
            var r = S.slides.eq(s),
                n = this.slugify(r.attr("data-history"));if (n === a && !r.hasClass(S.params.slideDuplicateClass)) {
              var o = r.index();S.slideTo(o, e, t);
            }
          } else S.slideTo(0, e, t);
        } }, S.disableKeyboardControl = function () {
        S.params.keyboardControl = !1, a(document).off("keydown", d);
      }, S.enableKeyboardControl = function () {
        S.params.keyboardControl = !0, a(document).on("keydown", d);
      }, S.mousewheel = { event: !1, lastScrollTime: new window.Date().getTime() }, S.params.mousewheelControl && (S.mousewheel.event = navigator.userAgent.indexOf("firefox") > -1 ? "DOMMouseScroll" : u() ? "wheel" : "mousewheel"), S.disableMousewheelControl = function () {
        if (!S.mousewheel.event) return !1;var e = S.container;return "container" !== S.params.mousewheelEventsTarged && (e = a(S.params.mousewheelEventsTarged)), e.off(S.mousewheel.event, c), !0;
      }, S.enableMousewheelControl = function () {
        if (!S.mousewheel.event) return !1;var e = S.container;return "container" !== S.params.mousewheelEventsTarged && (e = a(S.params.mousewheelEventsTarged)), e.on(S.mousewheel.event, c), !0;
      }, S.parallax = { setTranslate: function setTranslate() {
          S.container.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function () {
            h(this, S.progress);
          }), S.slides.each(function () {
            var e = a(this);e.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function () {
              var a = Math.min(Math.max(e[0].progress, -1), 1);h(this, a);
            });
          });
        }, setTransition: function setTransition(e) {
          "undefined" == typeof e && (e = S.params.speed), S.container.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function () {
            var t = a(this),
                s = parseInt(t.attr("data-swiper-parallax-duration"), 10) || e;0 === e && (s = 0), t.transition(s);
          });
        } }, S.zoom = { scale: 1, currentScale: 1, isScaling: !1, gesture: { slide: void 0, slideWidth: void 0, slideHeight: void 0, image: void 0, imageWrap: void 0, zoomMax: S.params.zoomMax }, image: { isTouched: void 0, isMoved: void 0, currentX: void 0, currentY: void 0, minX: void 0, minY: void 0, maxX: void 0, maxY: void 0, width: void 0, height: void 0, startX: void 0, startY: void 0, touchesStart: {}, touchesCurrent: {} }, velocity: { x: void 0, y: void 0, prevPositionX: void 0, prevPositionY: void 0, prevTime: void 0 }, getDistanceBetweenTouches: function getDistanceBetweenTouches(e) {
          if (e.targetTouches.length < 2) return 1;var a = e.targetTouches[0].pageX,
              t = e.targetTouches[0].pageY,
              s = e.targetTouches[1].pageX,
              i = e.targetTouches[1].pageY,
              r = Math.sqrt(Math.pow(s - a, 2) + Math.pow(i - t, 2));return r;
        }, onGestureStart: function onGestureStart(e) {
          var t = S.zoom;if (!S.support.gestures) {
            if ("touchstart" !== e.type || "touchstart" === e.type && e.targetTouches.length < 2) return;t.gesture.scaleStart = t.getDistanceBetweenTouches(e);
          }return t.gesture.slide && t.gesture.slide.length || (t.gesture.slide = a(this), 0 === t.gesture.slide.length && (t.gesture.slide = S.slides.eq(S.activeIndex)), t.gesture.image = t.gesture.slide.find("img, svg, canvas"), t.gesture.imageWrap = t.gesture.image.parent("." + S.params.zoomContainerClass), t.gesture.zoomMax = t.gesture.imageWrap.attr("data-swiper-zoom") || S.params.zoomMax, 0 !== t.gesture.imageWrap.length) ? (t.gesture.image.transition(0), void (t.isScaling = !0)) : void (t.gesture.image = void 0);
        }, onGestureChange: function onGestureChange(e) {
          var a = S.zoom;if (!S.support.gestures) {
            if ("touchmove" !== e.type || "touchmove" === e.type && e.targetTouches.length < 2) return;a.gesture.scaleMove = a.getDistanceBetweenTouches(e);
          }a.gesture.image && 0 !== a.gesture.image.length && (S.support.gestures ? a.scale = e.scale * a.currentScale : a.scale = a.gesture.scaleMove / a.gesture.scaleStart * a.currentScale, a.scale > a.gesture.zoomMax && (a.scale = a.gesture.zoomMax - 1 + Math.pow(a.scale - a.gesture.zoomMax + 1, .5)), a.scale < S.params.zoomMin && (a.scale = S.params.zoomMin + 1 - Math.pow(S.params.zoomMin - a.scale + 1, .5)), a.gesture.image.transform("translate3d(0,0,0) scale(" + a.scale + ")"));
        }, onGestureEnd: function onGestureEnd(e) {
          var a = S.zoom;!S.support.gestures && ("touchend" !== e.type || "touchend" === e.type && e.changedTouches.length < 2) || a.gesture.image && 0 !== a.gesture.image.length && (a.scale = Math.max(Math.min(a.scale, a.gesture.zoomMax), S.params.zoomMin), a.gesture.image.transition(S.params.speed).transform("translate3d(0,0,0) scale(" + a.scale + ")"), a.currentScale = a.scale, a.isScaling = !1, 1 === a.scale && (a.gesture.slide = void 0));
        }, onTouchStart: function onTouchStart(e, a) {
          var t = e.zoom;t.gesture.image && 0 !== t.gesture.image.length && (t.image.isTouched || ("android" === e.device.os && a.preventDefault(), t.image.isTouched = !0, t.image.touchesStart.x = "touchstart" === a.type ? a.targetTouches[0].pageX : a.pageX, t.image.touchesStart.y = "touchstart" === a.type ? a.targetTouches[0].pageY : a.pageY));
        }, onTouchMove: function onTouchMove(e) {
          var a = S.zoom;if (a.gesture.image && 0 !== a.gesture.image.length && (S.allowClick = !1, a.image.isTouched && a.gesture.slide)) {
            a.image.isMoved || (a.image.width = a.gesture.image[0].offsetWidth, a.image.height = a.gesture.image[0].offsetHeight, a.image.startX = S.getTranslate(a.gesture.imageWrap[0], "x") || 0, a.image.startY = S.getTranslate(a.gesture.imageWrap[0], "y") || 0, a.gesture.slideWidth = a.gesture.slide[0].offsetWidth, a.gesture.slideHeight = a.gesture.slide[0].offsetHeight, a.gesture.imageWrap.transition(0));var t = a.image.width * a.scale,
                s = a.image.height * a.scale;if (!(t < a.gesture.slideWidth && s < a.gesture.slideHeight)) {
              if (a.image.minX = Math.min(a.gesture.slideWidth / 2 - t / 2, 0), a.image.maxX = -a.image.minX, a.image.minY = Math.min(a.gesture.slideHeight / 2 - s / 2, 0), a.image.maxY = -a.image.minY, a.image.touchesCurrent.x = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, a.image.touchesCurrent.y = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, !a.image.isMoved && !a.isScaling) {
                if (S.isHorizontal() && Math.floor(a.image.minX) === Math.floor(a.image.startX) && a.image.touchesCurrent.x < a.image.touchesStart.x || Math.floor(a.image.maxX) === Math.floor(a.image.startX) && a.image.touchesCurrent.x > a.image.touchesStart.x) return void (a.image.isTouched = !1);if (!S.isHorizontal() && Math.floor(a.image.minY) === Math.floor(a.image.startY) && a.image.touchesCurrent.y < a.image.touchesStart.y || Math.floor(a.image.maxY) === Math.floor(a.image.startY) && a.image.touchesCurrent.y > a.image.touchesStart.y) return void (a.image.isTouched = !1);
              }e.preventDefault(), e.stopPropagation(), a.image.isMoved = !0, a.image.currentX = a.image.touchesCurrent.x - a.image.touchesStart.x + a.image.startX, a.image.currentY = a.image.touchesCurrent.y - a.image.touchesStart.y + a.image.startY, a.image.currentX < a.image.minX && (a.image.currentX = a.image.minX + 1 - Math.pow(a.image.minX - a.image.currentX + 1, .8)), a.image.currentX > a.image.maxX && (a.image.currentX = a.image.maxX - 1 + Math.pow(a.image.currentX - a.image.maxX + 1, .8)), a.image.currentY < a.image.minY && (a.image.currentY = a.image.minY + 1 - Math.pow(a.image.minY - a.image.currentY + 1, .8)), a.image.currentY > a.image.maxY && (a.image.currentY = a.image.maxY - 1 + Math.pow(a.image.currentY - a.image.maxY + 1, .8)), a.velocity.prevPositionX || (a.velocity.prevPositionX = a.image.touchesCurrent.x), a.velocity.prevPositionY || (a.velocity.prevPositionY = a.image.touchesCurrent.y), a.velocity.prevTime || (a.velocity.prevTime = Date.now()), a.velocity.x = (a.image.touchesCurrent.x - a.velocity.prevPositionX) / (Date.now() - a.velocity.prevTime) / 2, a.velocity.y = (a.image.touchesCurrent.y - a.velocity.prevPositionY) / (Date.now() - a.velocity.prevTime) / 2, Math.abs(a.image.touchesCurrent.x - a.velocity.prevPositionX) < 2 && (a.velocity.x = 0), Math.abs(a.image.touchesCurrent.y - a.velocity.prevPositionY) < 2 && (a.velocity.y = 0), a.velocity.prevPositionX = a.image.touchesCurrent.x, a.velocity.prevPositionY = a.image.touchesCurrent.y, a.velocity.prevTime = Date.now(), a.gesture.imageWrap.transform("translate3d(" + a.image.currentX + "px, " + a.image.currentY + "px,0)");
            }
          }
        }, onTouchEnd: function onTouchEnd(e, a) {
          var t = e.zoom;if (t.gesture.image && 0 !== t.gesture.image.length) {
            if (!t.image.isTouched || !t.image.isMoved) return t.image.isTouched = !1, void (t.image.isMoved = !1);t.image.isTouched = !1, t.image.isMoved = !1;var s = 300,
                i = 300,
                r = t.velocity.x * s,
                n = t.image.currentX + r,
                o = t.velocity.y * i,
                l = t.image.currentY + o;0 !== t.velocity.x && (s = Math.abs((n - t.image.currentX) / t.velocity.x)), 0 !== t.velocity.y && (i = Math.abs((l - t.image.currentY) / t.velocity.y));var p = Math.max(s, i);t.image.currentX = n, t.image.currentY = l;var d = t.image.width * t.scale,
                u = t.image.height * t.scale;t.image.minX = Math.min(t.gesture.slideWidth / 2 - d / 2, 0), t.image.maxX = -t.image.minX, t.image.minY = Math.min(t.gesture.slideHeight / 2 - u / 2, 0), t.image.maxY = -t.image.minY, t.image.currentX = Math.max(Math.min(t.image.currentX, t.image.maxX), t.image.minX), t.image.currentY = Math.max(Math.min(t.image.currentY, t.image.maxY), t.image.minY), t.gesture.imageWrap.transition(p).transform("translate3d(" + t.image.currentX + "px, " + t.image.currentY + "px,0)");
          }
        }, onTransitionEnd: function onTransitionEnd(e) {
          var a = e.zoom;a.gesture.slide && e.previousIndex !== e.activeIndex && (a.gesture.image.transform("translate3d(0,0,0) scale(1)"), a.gesture.imageWrap.transform("translate3d(0,0,0)"), a.gesture.slide = a.gesture.image = a.gesture.imageWrap = void 0, a.scale = a.currentScale = 1);
        }, toggleZoom: function toggleZoom(e, t) {
          var s = e.zoom;if (s.gesture.slide || (s.gesture.slide = e.clickedSlide ? a(e.clickedSlide) : e.slides.eq(e.activeIndex), s.gesture.image = s.gesture.slide.find("img, svg, canvas"), s.gesture.imageWrap = s.gesture.image.parent("." + e.params.zoomContainerClass)), s.gesture.image && 0 !== s.gesture.image.length) {
            var i, r, n, o, l, p, d, u, c, m, h, g, f, v, w, y, x, T;"undefined" == typeof s.image.touchesStart.x && t ? (i = "touchend" === t.type ? t.changedTouches[0].pageX : t.pageX, r = "touchend" === t.type ? t.changedTouches[0].pageY : t.pageY) : (i = s.image.touchesStart.x, r = s.image.touchesStart.y), s.scale && 1 !== s.scale ? (s.scale = s.currentScale = 1, s.gesture.imageWrap.transition(300).transform("translate3d(0,0,0)"), s.gesture.image.transition(300).transform("translate3d(0,0,0) scale(1)"), s.gesture.slide = void 0) : (s.scale = s.currentScale = s.gesture.imageWrap.attr("data-swiper-zoom") || e.params.zoomMax, t ? (x = s.gesture.slide[0].offsetWidth, T = s.gesture.slide[0].offsetHeight, n = s.gesture.slide.offset().left, o = s.gesture.slide.offset().top, l = n + x / 2 - i, p = o + T / 2 - r, c = s.gesture.image[0].offsetWidth, m = s.gesture.image[0].offsetHeight, h = c * s.scale, g = m * s.scale, f = Math.min(x / 2 - h / 2, 0), v = Math.min(T / 2 - g / 2, 0), w = -f, y = -v, d = l * s.scale, u = p * s.scale, d < f && (d = f), d > w && (d = w), u < v && (u = v), u > y && (u = y)) : (d = 0, u = 0), s.gesture.imageWrap.transition(300).transform("translate3d(" + d + "px, " + u + "px,0)"), s.gesture.image.transition(300).transform("translate3d(0,0,0) scale(" + s.scale + ")"));
          }
        }, attachEvents: function attachEvents(e) {
          var t = e ? "off" : "on";if (S.params.zoom) {
            var s = (S.slides, !("touchstart" !== S.touchEvents.start || !S.support.passiveListener || !S.params.passiveListeners) && { passive: !0, capture: !1 });S.support.gestures ? (S.slides[t]("gesturestart", S.zoom.onGestureStart, s), S.slides[t]("gesturechange", S.zoom.onGestureChange, s), S.slides[t]("gestureend", S.zoom.onGestureEnd, s)) : "touchstart" === S.touchEvents.start && (S.slides[t](S.touchEvents.start, S.zoom.onGestureStart, s), S.slides[t](S.touchEvents.move, S.zoom.onGestureChange, s), S.slides[t](S.touchEvents.end, S.zoom.onGestureEnd, s)), S[t]("touchStart", S.zoom.onTouchStart), S.slides.each(function (e, s) {
              a(s).find("." + S.params.zoomContainerClass).length > 0 && a(s)[t](S.touchEvents.move, S.zoom.onTouchMove);
            }), S[t]("touchEnd", S.zoom.onTouchEnd), S[t]("transitionEnd", S.zoom.onTransitionEnd), S.params.zoomToggle && S.on("doubleTap", S.zoom.toggleZoom);
          }
        }, init: function init() {
          S.zoom.attachEvents();
        }, destroy: function destroy() {
          S.zoom.attachEvents(!0);
        } }, S._plugins = [];for (var N in S.plugins) {
        var W = S.plugins[N](S, S.params[N]);W && S._plugins.push(W);
      }return S.callPlugins = function (e) {
        for (var a = 0; a < S._plugins.length; a++) {
          e in S._plugins[a] && S._plugins[a][e](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }
      }, S.emitterEventListeners = {}, S.emit = function (e) {
        S.params[e] && S.params[e](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);var a;if (S.emitterEventListeners[e]) for (a = 0; a < S.emitterEventListeners[e].length; a++) {
          S.emitterEventListeners[e][a](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }S.callPlugins && S.callPlugins(e, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
      }, S.on = function (e, a) {
        return e = g(e), S.emitterEventListeners[e] || (S.emitterEventListeners[e] = []), S.emitterEventListeners[e].push(a), S;
      }, S.off = function (e, a) {
        var t;if (e = g(e), "undefined" == typeof a) return S.emitterEventListeners[e] = [], S;if (S.emitterEventListeners[e] && 0 !== S.emitterEventListeners[e].length) {
          for (t = 0; t < S.emitterEventListeners[e].length; t++) {
            S.emitterEventListeners[e][t] === a && S.emitterEventListeners[e].splice(t, 1);
          }return S;
        }
      }, S.once = function (e, a) {
        e = g(e);var t = function t() {
          a(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]), S.off(e, t);
        };return S.on(e, t), S;
      }, S.a11y = { makeFocusable: function makeFocusable(e) {
          return e.attr("tabIndex", "0"), e;
        }, addRole: function addRole(e, a) {
          return e.attr("role", a), e;
        }, addLabel: function addLabel(e, a) {
          return e.attr("aria-label", a), e;
        }, disable: function disable(e) {
          return e.attr("aria-disabled", !0), e;
        }, enable: function enable(e) {
          return e.attr("aria-disabled", !1), e;
        }, onEnterKey: function onEnterKey(e) {
          13 === e.keyCode && (a(e.target).is(S.params.nextButton) ? (S.onClickNext(e), S.isEnd ? S.a11y.notify(S.params.lastSlideMessage) : S.a11y.notify(S.params.nextSlideMessage)) : a(e.target).is(S.params.prevButton) && (S.onClickPrev(e), S.isBeginning ? S.a11y.notify(S.params.firstSlideMessage) : S.a11y.notify(S.params.prevSlideMessage)), a(e.target).is("." + S.params.bulletClass) && a(e.target)[0].click());
        }, liveRegion: a('<span class="' + S.params.notificationClass + '" aria-live="assertive" aria-atomic="true"></span>'), notify: function notify(e) {
          var a = S.a11y.liveRegion;0 !== a.length && (a.html(""), a.html(e));
        }, init: function init() {
          S.params.nextButton && S.nextButton && S.nextButton.length > 0 && (S.a11y.makeFocusable(S.nextButton), S.a11y.addRole(S.nextButton, "button"), S.a11y.addLabel(S.nextButton, S.params.nextSlideMessage)), S.params.prevButton && S.prevButton && S.prevButton.length > 0 && (S.a11y.makeFocusable(S.prevButton), S.a11y.addRole(S.prevButton, "button"), S.a11y.addLabel(S.prevButton, S.params.prevSlideMessage)), a(S.container).append(S.a11y.liveRegion);
        }, initPagination: function initPagination() {
          S.params.pagination && S.params.paginationClickable && S.bullets && S.bullets.length && S.bullets.each(function () {
            var e = a(this);S.a11y.makeFocusable(e), S.a11y.addRole(e, "button"), S.a11y.addLabel(e, S.params.paginationBulletMessage.replace(/{{index}}/, e.index() + 1));
          });
        }, destroy: function destroy() {
          S.a11y.liveRegion && S.a11y.liveRegion.length > 0 && S.a11y.liveRegion.remove();
        } }, S.init = function () {
        S.params.loop && S.createLoop(), S.updateContainerSize(), S.updateSlidesSize(), S.updatePagination(), S.params.scrollbar && S.scrollbar && (S.scrollbar.set(), S.params.scrollbarDraggable && S.scrollbar.enableDraggable()), "slide" !== S.params.effect && S.effects[S.params.effect] && (S.params.loop || S.updateProgress(), S.effects[S.params.effect].setTranslate()), S.params.loop ? S.slideTo(S.params.initialSlide + S.loopedSlides, 0, S.params.runCallbacksOnInit) : (S.slideTo(S.params.initialSlide, 0, S.params.runCallbacksOnInit), 0 === S.params.initialSlide && (S.parallax && S.params.parallax && S.parallax.setTranslate(), S.lazy && S.params.lazyLoading && (S.lazy.load(), S.lazy.initialImageLoaded = !0))), S.attachEvents(), S.params.observer && S.support.observer && S.initObservers(), S.params.preloadImages && !S.params.lazyLoading && S.preloadImages(), S.params.zoom && S.zoom && S.zoom.init(), S.params.autoplay && S.startAutoplay(), S.params.keyboardControl && S.enableKeyboardControl && S.enableKeyboardControl(), S.params.mousewheelControl && S.enableMousewheelControl && S.enableMousewheelControl(), S.params.hashnavReplaceState && (S.params.replaceState = S.params.hashnavReplaceState), S.params.history && S.history && S.history.init(), S.params.hashnav && S.hashnav && S.hashnav.init(), S.params.a11y && S.a11y && S.a11y.init(), S.emit("onInit", S);
      }, S.cleanupStyles = function () {
        S.container.removeClass(S.classNames.join(" ")).removeAttr("style"), S.wrapper.removeAttr("style"), S.slides && S.slides.length && S.slides.removeClass([S.params.slideVisibleClass, S.params.slideActiveClass, S.params.slideNextClass, S.params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-column").removeAttr("data-swiper-row"), S.paginationContainer && S.paginationContainer.length && S.paginationContainer.removeClass(S.params.paginationHiddenClass), S.bullets && S.bullets.length && S.bullets.removeClass(S.params.bulletActiveClass), S.params.prevButton && a(S.params.prevButton).removeClass(S.params.buttonDisabledClass), S.params.nextButton && a(S.params.nextButton).removeClass(S.params.buttonDisabledClass), S.params.scrollbar && S.scrollbar && (S.scrollbar.track && S.scrollbar.track.length && S.scrollbar.track.removeAttr("style"), S.scrollbar.drag && S.scrollbar.drag.length && S.scrollbar.drag.removeAttr("style"));
      }, S.destroy = function (e, a) {
        S.detachEvents(), S.stopAutoplay(), S.params.scrollbar && S.scrollbar && S.params.scrollbarDraggable && S.scrollbar.disableDraggable(), S.params.loop && S.destroyLoop(), a && S.cleanupStyles(), S.disconnectObservers(), S.params.zoom && S.zoom && S.zoom.destroy(), S.params.keyboardControl && S.disableKeyboardControl && S.disableKeyboardControl(), S.params.mousewheelControl && S.disableMousewheelControl && S.disableMousewheelControl(), S.params.a11y && S.a11y && S.a11y.destroy(), S.params.history && !S.params.replaceState && window.removeEventListener("popstate", S.history.setHistoryPopState), S.params.hashnav && S.hashnav && S.hashnav.destroy(), S.emit("onDestroy"), e !== !1 && (S = null);
      }, S.init(), S;
    }
  };t.prototype = { isSafari: function () {
      var e = navigator.userAgent.toLowerCase();return e.indexOf("safari") >= 0 && e.indexOf("chrome") < 0 && e.indexOf("android") < 0;
    }(), isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent), isArray: function isArray(e) {
      return "[object Array]" === Object.prototype.toString.apply(e);
    }, browser: { ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled, ieTouch: window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1, lteIE9: function () {
        var e = document.createElement("div");return e.innerHTML = "<!--[if lte IE 9]><i></i><![endif]-->", 1 === e.getElementsByTagName("i").length;
      }() }, device: function () {
      var e = navigator.userAgent,
          a = e.match(/(Android);?[\s\/]+([\d.]+)?/),
          t = e.match(/(iPad).*OS\s([\d_]+)/),
          s = e.match(/(iPod)(.*OS\s([\d_]+))?/),
          i = !t && e.match(/(iPhone\sOS)\s([\d_]+)/);return { ios: t || i || s, android: a };
    }(), support: { touch: window.Modernizr && Modernizr.touch === !0 || function () {
        return !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
      }(), transforms3d: window.Modernizr && Modernizr.csstransforms3d === !0 || function () {
        var e = document.createElement("div").style;return "webkitPerspective" in e || "MozPerspective" in e || "OPerspective" in e || "MsPerspective" in e || "perspective" in e;
      }(), flexbox: function () {
        for (var e = document.createElement("div").style, a = "alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "), t = 0; t < a.length; t++) {
          if (a[t] in e) return !0;
        }
      }(), observer: function () {
        return "MutationObserver" in window || "WebkitMutationObserver" in window;
      }(), passiveListener: function () {
        var e = !1;try {
          var a = Object.defineProperty({}, "passive", { get: function get() {
              e = !0;
            } });window.addEventListener("testPassiveListener", null, a);
        } catch (e) {}return e;
      }(), gestures: function () {
        return "ongesturestart" in window;
      }() }, plugins: {} };for (var s = function () {
    var e = function e(_e) {
      var a = this,
          t = 0;for (t = 0; t < _e.length; t++) {
        a[t] = _e[t];
      }return a.length = _e.length, this;
    },
        a = function a(_a, t) {
      var s = [],
          i = 0;if (_a && !t && _a instanceof e) return _a;if (_a) if ("string" == typeof _a) {
        var r,
            n,
            o = _a.trim();if (o.indexOf("<") >= 0 && o.indexOf(">") >= 0) {
          var l = "div";for (0 === o.indexOf("<li") && (l = "ul"), 0 === o.indexOf("<tr") && (l = "tbody"), 0 !== o.indexOf("<td") && 0 !== o.indexOf("<th") || (l = "tr"), 0 === o.indexOf("<tbody") && (l = "table"), 0 === o.indexOf("<option") && (l = "select"), n = document.createElement(l), n.innerHTML = _a, i = 0; i < n.childNodes.length; i++) {
            s.push(n.childNodes[i]);
          }
        } else for (r = t || "#" !== _a[0] || _a.match(/[ .<>:~]/) ? (t || document).querySelectorAll(_a) : [document.getElementById(_a.split("#")[1])], i = 0; i < r.length; i++) {
          r[i] && s.push(r[i]);
        }
      } else if (_a.nodeType || _a === window || _a === document) s.push(_a);else if (_a.length > 0 && _a[0].nodeType) for (i = 0; i < _a.length; i++) {
        s.push(_a[i]);
      }return new e(s);
    };return e.prototype = { addClass: function addClass(e) {
        if ("undefined" == typeof e) return this;for (var a = e.split(" "), t = 0; t < a.length; t++) {
          for (var s = 0; s < this.length; s++) {
            this[s].classList.add(a[t]);
          }
        }return this;
      }, removeClass: function removeClass(e) {
        for (var a = e.split(" "), t = 0; t < a.length; t++) {
          for (var s = 0; s < this.length; s++) {
            this[s].classList.remove(a[t]);
          }
        }return this;
      }, hasClass: function hasClass(e) {
        return !!this[0] && this[0].classList.contains(e);
      }, toggleClass: function toggleClass(e) {
        for (var a = e.split(" "), t = 0; t < a.length; t++) {
          for (var s = 0; s < this.length; s++) {
            this[s].classList.toggle(a[t]);
          }
        }return this;
      }, attr: function attr(e, a) {
        if (1 === arguments.length && "string" == typeof e) return this[0] ? this[0].getAttribute(e) : void 0;for (var t = 0; t < this.length; t++) {
          if (2 === arguments.length) this[t].setAttribute(e, a);else for (var s in e) {
            this[t][s] = e[s], this[t].setAttribute(s, e[s]);
          }
        }return this;
      }, removeAttr: function removeAttr(e) {
        for (var a = 0; a < this.length; a++) {
          this[a].removeAttribute(e);
        }return this;
      }, data: function data(e, a) {
        if ("undefined" != typeof a) {
          for (var t = 0; t < this.length; t++) {
            var s = this[t];s.dom7ElementDataStorage || (s.dom7ElementDataStorage = {}), s.dom7ElementDataStorage[e] = a;
          }return this;
        }if (this[0]) {
          var i = this[0].getAttribute("data-" + e);return i ? i : this[0].dom7ElementDataStorage && (e in this[0].dom7ElementDataStorage) ? this[0].dom7ElementDataStorage[e] : void 0;
        }
      }, transform: function transform(e) {
        for (var a = 0; a < this.length; a++) {
          var t = this[a].style;t.webkitTransform = t.MsTransform = t.msTransform = t.MozTransform = t.OTransform = t.transform = e;
        }return this;
      }, transition: function transition(e) {
        "string" != typeof e && (e += "ms");for (var a = 0; a < this.length; a++) {
          var t = this[a].style;t.webkitTransitionDuration = t.MsTransitionDuration = t.msTransitionDuration = t.MozTransitionDuration = t.OTransitionDuration = t.transitionDuration = e;
        }return this;
      }, on: function on(e, t, s, i) {
        function r(e) {
          var i = e.target;if (a(i).is(t)) s.call(i, e);else for (var r = a(i).parents(), n = 0; n < r.length; n++) {
            a(r[n]).is(t) && s.call(r[n], e);
          }
        }var n,
            o,
            l = e.split(" ");for (n = 0; n < this.length; n++) {
          if ("function" == typeof t || t === !1) for ("function" == typeof t && (s = arguments[1], i = arguments[2] || !1), o = 0; o < l.length; o++) {
            this[n].addEventListener(l[o], s, i);
          } else for (o = 0; o < l.length; o++) {
            this[n].dom7LiveListeners || (this[n].dom7LiveListeners = []), this[n].dom7LiveListeners.push({ listener: s, liveListener: r }), this[n].addEventListener(l[o], r, i);
          }
        }return this;
      }, off: function off(e, a, t, s) {
        for (var i = e.split(" "), r = 0; r < i.length; r++) {
          for (var n = 0; n < this.length; n++) {
            if ("function" == typeof a || a === !1) "function" == typeof a && (t = arguments[1], s = arguments[2] || !1), this[n].removeEventListener(i[r], t, s);else if (this[n].dom7LiveListeners) for (var o = 0; o < this[n].dom7LiveListeners.length; o++) {
              this[n].dom7LiveListeners[o].listener === t && this[n].removeEventListener(i[r], this[n].dom7LiveListeners[o].liveListener, s);
            }
          }
        }return this;
      }, once: function once(e, a, t, s) {
        function i(n) {
          t(n), r.off(e, a, i, s);
        }var r = this;"function" == typeof a && (a = !1, t = arguments[1], s = arguments[2]), r.on(e, a, i, s);
      }, trigger: function trigger(e, a) {
        for (var t = 0; t < this.length; t++) {
          var s;try {
            s = new window.CustomEvent(e, { detail: a, bubbles: !0, cancelable: !0 });
          } catch (t) {
            s = document.createEvent("Event"), s.initEvent(e, !0, !0), s.detail = a;
          }this[t].dispatchEvent(s);
        }return this;
      }, transitionEnd: function transitionEnd(e) {
        function a(r) {
          if (r.target === this) for (e.call(this, r), t = 0; t < s.length; t++) {
            i.off(s[t], a);
          }
        }var t,
            s = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"],
            i = this;if (e) for (t = 0; t < s.length; t++) {
          i.on(s[t], a);
        }return this;
      }, width: function width() {
        return this[0] === window ? window.innerWidth : this.length > 0 ? parseFloat(this.css("width")) : null;
      }, outerWidth: function outerWidth(e) {
        return this.length > 0 ? e ? this[0].offsetWidth + parseFloat(this.css("margin-right")) + parseFloat(this.css("margin-left")) : this[0].offsetWidth : null;
      }, height: function height() {
        return this[0] === window ? window.innerHeight : this.length > 0 ? parseFloat(this.css("height")) : null;
      }, outerHeight: function outerHeight(e) {
        return this.length > 0 ? e ? this[0].offsetHeight + parseFloat(this.css("margin-top")) + parseFloat(this.css("margin-bottom")) : this[0].offsetHeight : null;
      }, offset: function offset() {
        if (this.length > 0) {
          var e = this[0],
              a = e.getBoundingClientRect(),
              t = document.body,
              s = e.clientTop || t.clientTop || 0,
              i = e.clientLeft || t.clientLeft || 0,
              r = window.pageYOffset || e.scrollTop,
              n = window.pageXOffset || e.scrollLeft;return { top: a.top + r - s, left: a.left + n - i };
        }return null;
      }, css: function css(e, a) {
        var t;if (1 === arguments.length) {
          if ("string" != typeof e) {
            for (t = 0; t < this.length; t++) {
              for (var s in e) {
                this[t].style[s] = e[s];
              }
            }return this;
          }if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(e);
        }if (2 === arguments.length && "string" == typeof e) {
          for (t = 0; t < this.length; t++) {
            this[t].style[e] = a;
          }return this;
        }return this;
      }, each: function each(e) {
        for (var a = 0; a < this.length; a++) {
          e.call(this[a], a, this[a]);
        }return this;
      }, html: function html(e) {
        if ("undefined" == typeof e) return this[0] ? this[0].innerHTML : void 0;for (var a = 0; a < this.length; a++) {
          this[a].innerHTML = e;
        }return this;
      }, text: function text(e) {
        if ("undefined" == typeof e) return this[0] ? this[0].textContent.trim() : null;for (var a = 0; a < this.length; a++) {
          this[a].textContent = e;
        }return this;
      }, is: function is(t) {
        if (!this[0]) return !1;var s, i;if ("string" == typeof t) {
          var r = this[0];if (r === document) return t === document;if (r === window) return t === window;if (r.matches) return r.matches(t);if (r.webkitMatchesSelector) return r.webkitMatchesSelector(t);if (r.mozMatchesSelector) return r.mozMatchesSelector(t);if (r.msMatchesSelector) return r.msMatchesSelector(t);for (s = a(t), i = 0; i < s.length; i++) {
            if (s[i] === this[0]) return !0;
          }return !1;
        }if (t === document) return this[0] === document;if (t === window) return this[0] === window;if (t.nodeType || t instanceof e) {
          for (s = t.nodeType ? [t] : t, i = 0; i < s.length; i++) {
            if (s[i] === this[0]) return !0;
          }return !1;
        }return !1;
      }, index: function index() {
        if (this[0]) {
          for (var e = this[0], a = 0; null !== (e = e.previousSibling);) {
            1 === e.nodeType && a++;
          }return a;
        }
      }, eq: function eq(a) {
        if ("undefined" == typeof a) return this;var t,
            s = this.length;return a > s - 1 ? new e([]) : a < 0 ? (t = s + a, new e(t < 0 ? [] : [this[t]])) : new e([this[a]]);
      }, append: function append(a) {
        var t, s;for (t = 0; t < this.length; t++) {
          if ("string" == typeof a) {
            var i = document.createElement("div");for (i.innerHTML = a; i.firstChild;) {
              this[t].appendChild(i.firstChild);
            }
          } else if (a instanceof e) for (s = 0; s < a.length; s++) {
            this[t].appendChild(a[s]);
          } else this[t].appendChild(a);
        }return this;
      }, prepend: function prepend(a) {
        var t, s;for (t = 0; t < this.length; t++) {
          if ("string" == typeof a) {
            var i = document.createElement("div");for (i.innerHTML = a, s = i.childNodes.length - 1; s >= 0; s--) {
              this[t].insertBefore(i.childNodes[s], this[t].childNodes[0]);
            }
          } else if (a instanceof e) for (s = 0; s < a.length; s++) {
            this[t].insertBefore(a[s], this[t].childNodes[0]);
          } else this[t].insertBefore(a, this[t].childNodes[0]);
        }return this;
      }, insertBefore: function insertBefore(e) {
        for (var t = a(e), s = 0; s < this.length; s++) {
          if (1 === t.length) t[0].parentNode.insertBefore(this[s], t[0]);else if (t.length > 1) for (var i = 0; i < t.length; i++) {
            t[i].parentNode.insertBefore(this[s].cloneNode(!0), t[i]);
          }
        }
      }, insertAfter: function insertAfter(e) {
        for (var t = a(e), s = 0; s < this.length; s++) {
          if (1 === t.length) t[0].parentNode.insertBefore(this[s], t[0].nextSibling);else if (t.length > 1) for (var i = 0; i < t.length; i++) {
            t[i].parentNode.insertBefore(this[s].cloneNode(!0), t[i].nextSibling);
          }
        }
      }, next: function next(t) {
        return new e(this.length > 0 ? t ? this[0].nextElementSibling && a(this[0].nextElementSibling).is(t) ? [this[0].nextElementSibling] : [] : this[0].nextElementSibling ? [this[0].nextElementSibling] : [] : []);
      }, nextAll: function nextAll(t) {
        var s = [],
            i = this[0];if (!i) return new e([]);for (; i.nextElementSibling;) {
          var r = i.nextElementSibling;t ? a(r).is(t) && s.push(r) : s.push(r), i = r;
        }return new e(s);
      }, prev: function prev(t) {
        return new e(this.length > 0 ? t ? this[0].previousElementSibling && a(this[0].previousElementSibling).is(t) ? [this[0].previousElementSibling] : [] : this[0].previousElementSibling ? [this[0].previousElementSibling] : [] : []);
      }, prevAll: function prevAll(t) {
        var s = [],
            i = this[0];if (!i) return new e([]);for (; i.previousElementSibling;) {
          var r = i.previousElementSibling;t ? a(r).is(t) && s.push(r) : s.push(r), i = r;
        }return new e(s);
      }, parent: function parent(e) {
        for (var t = [], s = 0; s < this.length; s++) {
          e ? a(this[s].parentNode).is(e) && t.push(this[s].parentNode) : t.push(this[s].parentNode);
        }return a(a.unique(t));
      }, parents: function parents(e) {
        for (var t = [], s = 0; s < this.length; s++) {
          for (var i = this[s].parentNode; i;) {
            e ? a(i).is(e) && t.push(i) : t.push(i), i = i.parentNode;
          }
        }return a(a.unique(t));
      }, find: function find(a) {
        for (var t = [], s = 0; s < this.length; s++) {
          for (var i = this[s].querySelectorAll(a), r = 0; r < i.length; r++) {
            t.push(i[r]);
          }
        }return new e(t);
      }, children: function children(t) {
        for (var s = [], i = 0; i < this.length; i++) {
          for (var r = this[i].childNodes, n = 0; n < r.length; n++) {
            t ? 1 === r[n].nodeType && a(r[n]).is(t) && s.push(r[n]) : 1 === r[n].nodeType && s.push(r[n]);
          }
        }return new e(a.unique(s));
      }, remove: function remove() {
        for (var e = 0; e < this.length; e++) {
          this[e].parentNode && this[e].parentNode.removeChild(this[e]);
        }return this;
      }, add: function add() {
        var e,
            t,
            s = this;for (e = 0; e < arguments.length; e++) {
          var i = a(arguments[e]);for (t = 0; t < i.length; t++) {
            s[s.length] = i[t], s.length++;
          }
        }return s;
      } }, a.fn = e.prototype, a.unique = function (e) {
      for (var a = [], t = 0; t < e.length; t++) {
        a.indexOf(e[t]) === -1 && a.push(e[t]);
      }return a;
    }, a;
  }(), i = ["jQuery", "Zepto", "Dom7"], r = 0; r < i.length; r++) {
    window[i[r]] && e(window[i[r]]);
  }var n;n = "undefined" == typeof s ? window.Dom7 || window.Zepto || window.jQuery : s, n && ("transitionEnd" in n.fn || (n.fn.transitionEnd = function (e) {
    function a(r) {
      if (r.target === this) for (e.call(this, r), t = 0; t < s.length; t++) {
        i.off(s[t], a);
      }
    }var t,
        s = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"],
        i = this;if (e) for (t = 0; t < s.length; t++) {
      i.on(s[t], a);
    }return this;
  }), "transform" in n.fn || (n.fn.transform = function (e) {
    for (var a = 0; a < this.length; a++) {
      var t = this[a].style;t.webkitTransform = t.MsTransform = t.msTransform = t.MozTransform = t.OTransform = t.transform = e;
    }return this;
  }), "transition" in n.fn || (n.fn.transition = function (e) {
    "string" != typeof e && (e += "ms");for (var a = 0; a < this.length; a++) {
      var t = this[a].style;t.webkitTransitionDuration = t.MsTransitionDuration = t.msTransitionDuration = t.MozTransitionDuration = t.OTransitionDuration = t.transitionDuration = e;
    }return this;
  }), "outerWidth" in n.fn || (n.fn.outerWidth = function (e) {
    return this.length > 0 ? e ? this[0].offsetWidth + parseFloat(this.css("margin-right")) + parseFloat(this.css("margin-left")) : this[0].offsetWidth : null;
  })), window.Swiper = t;
}(),  true ? module.exports = window.Swiper : "function" == typeof define && define.amd && define([], function () {
  "use strict";
  return window.Swiper;
});
//# sourceMappingURL=maps/swiper.min.js.map

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".slide-fade-enter-active{transition:all .3s ease}.slide-fade-leave-active{transition:all .8s cubic-bezier(1,.5,.8,1)}.slide-fade-enter,.slide-fade-leave-active{padding-right:500px;padding-left:500px;opacity:0}", ""]);

// exports


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".nav-header{height:.6rem;background:#f7f7f7;border-bottom:.01rem solid #dfdfdf}.nav-header .backBtn{position:absolute;display:block;width:.22rem;height:.38rem;left:.27rem;top:.3rem;background:url(" + __webpack_require__(4) + ") .01rem .01rem no-repeat}.nav-header p{font-size:.32rem;text-align:center;line-height:.6rem}", ""]);

// exports


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "#app{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-align:center;color:#2c3e50}header{padding:.2rem .3rem;background:#ff2772}.sc,header{height:.35rem}.sc{width:100%;text-align:center;line-height:.35rem;font-size:.27rem;color:#fff;float:left}.app-fade-enter-active{transition:all .3s ease}.app-fade-leave-active{transition:all .8s cubic-bezier(1,.5,.8,1)}.app-fade-enter,.app-fade-leave-active{padding-right:500px;padding-left:500px;opacity:0}", ""]);

// exports


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "#indexComtent{width:100%;height:300px;border:1px solid #000}h1{font-size:.2rem}a{font-size:.18rem}button{width:1rem;height:1rem;font-size:.2rem}", ""]);

// exports


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "#indexComtent{width:100%;height:300px;border:1px solid #000}h1{font-size:.2rem}a{font-size:.18rem}", ""]);

// exports


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".order-info-box div{background:#fff;padding:0 .18rem;text-align:left}.order-info-box .order-state{height:1.1rem;margin-bottom:.18rem}.order-info-box .order-state p{font-size:.3rem;color:#ff833e;line-height:1.1rem;text-align:left}.order-info-box .add-info{padding:.32rem .18rem .3rem;margin-bottom:.18rem}.order-info-box .add-info .add-name{padding-left:.46rem;color:#333;font-size:.3rem;margin-bottom:.24rem}.order-info-box .add-info .add-name span{padding-left:.54rem}.order-info-box .add-info .adds{font-size:.26rem;color:#666}.order-info-box .add-info .adds i{padding:0 .23rem;background:url(" + __webpack_require__(4) + ") no-repeat;background-position:0 -6.33rem}.order-info-box .order-detail{background:#f7f7f7;overflow:hidden}.order-info-box .order-detail .pro-tit{color:#333;font-size:.28rem;line-height:.74rem;background:#fff;margin:0 -.18rem;padding-left:.18rem}.order-info-box .order-detail dl{padding:.18rem 0;overflow:hidden;border-bottom:.01rem solid #e5e5e5;background:#f7f7f7}.order-info-box .order-detail dl dd{float:left;width:1.63rem;height:1.63rem;margin-right:.16rem}.order-info-box .order-detail dl dd img{display:block;width:100%;height:100%}.order-info-box .order-detail dl dt{text-align:left;font-size:.23rem;color:#000;overflow:hidden}.order-info-box .order-detail dl .proName{padding-top:.08rem}.order-info-box .order-detail dl .proName p{line-height:.3rem;height:.6rem}.order-info-box .order-detail dl .proAttribute{color:#999;height:.65rem}.order-info-box .order-detail dl .proPrice{line-height:.3rem}.order-info-box .order-detail dl .proPrice .proNum{float:right}.order-info-box .order-detail a.linkBtn{color:#fff;margin:.08rem 0;padding:0 .18rem;border-radius:.06rem;float:right;line-height:.38rem;font-size:.26rem;background:#ff833e}.order-info-box .pro-info{margin-bottom:.18rem}.order-info-box table{width:100%;font-size:.28rem;line-height:.42rem;padding:.2rem 0}.order-info-box table tr td{text-align:right;color:#ff2772}.order-info-box .order-info{padding:.2rem .18rem}.order-info-box .order-info p{font-size:.24rem;line-height:.36rem}", ""]);

// exports


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".vertical-center{display:-webkit-box;display:-moz-box;display:box;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;box-orient:vertical;-webkit-box-direction:normal;box-direction:normal;-moz-flex-direction:column;flex-direction:column;-ms-flex-direction:column;-webkit-box-pack:center;box-pack:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center}#loading-cover{position:fixed;top:0;right:0;bottom:0;left:0;z-index:10;background:#ff2772 url(" + __webpack_require__(64) + ") no-repeat bottom;color:#666;-webkit-transition:all,2.5s;transition:all,2.5s;a{width:5.02rem;height:2.25rem;margin:0 auto}.logo-img,a{display:block}.logo-img{width:100%;height:100%}}#loading-cover.done{opacity:0;z-index:-1;-webkit-transform:scale(1.2);transform:scale(1.2)}", ""]);

// exports


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports
exports.i(__webpack_require__(62), "");

// module
exports.push([module.i, ".swiper-container{width:100%;height:2.44rem}.swiper-slide img{width:100%;height:100%}", ""]);

// exports


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".loginBox{height:3.7rem;overflow:hidden;position:relative;margin-bottom:.36rem}.loginBox .toLogin{width:2.68rem;height:.68rem;margin:1.7rem auto 0;border:2px solid #fff6f9;border-radius:.04rem;overflow:hidden}.loginBox .toLogin a{width:1.3rem;line-height:.68rem}.loginBox .toLogin a,.loginBox .toLogin span{color:#fff6f9;font-size:.32rem;float:left;display:inline-block}.loginBox .toLogin span{width:.02rem;line-height:.64rem}.loginBox .uInfo{margin:1.16rem .18rem 0}.loginBox .uInfo dl{width:100%;height:1.24rem;overflow:hidden}.loginBox .uInfo dl dd{width:1.2rem;height:1.2rem;border:.02rem solid hsla(0,0%,100%,.5);border-radius:50%;float:left}.loginBox .uInfo dl dd img{width:100%;height:100%;display:block}.loginBox .uInfo dl .uName{padding:0 .18rem 0 .29rem;font-size:.3rem;line-height:1.24rem;float:left}.loginBox .uInfo dl .uLevel{font-size:.24rem;line-height:1.24rem;float:left}.loginBox .uInfo dl .fr{float:right;width:.15rem;height:1.24rem;background:url(" + __webpack_require__(67) + ") 0 no-repeat}.loginBox .uOrder{position:absolute;width:100%;left:0;bottom:0}.loginBox .uOrder ul{overflow:hidden;height:.9rem}.loginBox .uOrder ul .dd{float:left}.loginBox .uOrder ul .dd i{padding:0 .11rem;margin-right:.1rem;background:url(" + __webpack_require__(10) + ") no-repeat}.loginBox .uOrder ul .md{float:right}.loginBox .uOrder ul .md i{padding:0 .11rem;margin-right:.1rem;background:url(" + __webpack_require__(10) + ") no-repeat}.loginBox .uOrder ul li{width:3.74rem;height:100%;background:rgba(0,0,0,.35)}.loginBox .uOrder ul li a{display:block;line-height:.9rem;text-align:center;font-size:.29rem}.loging{background:url(" + __webpack_require__(69) + ") no-repeat;background-size:100% 100%}.ulogin{background:#fa6297}.uMenu{overflow:hidden;margin-bottom:.36rem}.uMenu ul{width:7.52rem}.uMenu ul li{width:1.86rem;float:left;background:#fff;border-right:.02rem solid #eee;border-bottom:.02rem solid #eee}.uMenu ul li a{display:block;padding:.58rem 0}.uMenu ul li a i{display:block;width:.42rem;height:.42rem;margin:0 auto .3rem;background:url(" + __webpack_require__(70) + ") 0 0 no-repeat}.uMenu ul li a .hongbao{background-position:-1.91rem 0}.uMenu ul li a .shoucang{background-position:-3.77rem 0}.uMenu ul li a .activity{background-position:-5.62rem 0}.uMenu ul li a .invite{background-position:0 -1.01rem}.uMenu ul li a .friend{background-position:-1.91rem -1.01rem}.uMenu ul li a .myReward{background-position:-3.77rem -1.01rem}.uMenu ul li a .partner{background-position:-5.62rem -1.01rem}.uMenu ul li a p{color:#333;font-size:.24rem;text-align:center}.uSeeting{border-top:.02rem solid #e1e1e1}.uSeeting li{border-bottom:.02rem solid #e1e1e1;background:#fff}.uSeeting li a{display:block;overflow:hidden;height:.88rem;margin:0 .26rem 0 .17rem;background:url(" + __webpack_require__(4) + ") no-repeat;background-position:6.83rem -.42rem}.uSeeting li a p{color:#000;text-align:left;font-size:.3rem;line-height:.88rem;padding-left:.19rem;float:left}.uSeeting li a p span{color:#878787}.uSeeting li a i{padding:.44rem .14rem;background:url(" + __webpack_require__(4) + ") no-repeat;background-position:0 -5.52rem;float:left}.uSeeting li a .kd-ico{background-position:0 -4.9rem}", ""]);

// exports


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".orderListBox{margin-bottom:.17rem}.orderListBox .content,.orderListBox .orderStat,.orderListBox .orderTitle{background:#fff;padding:0 .18rem;line-height:.7rem;font-size:.24rem;overflow:hidden}.orderListBox .orderTitle .orderNum{float:left}.orderListBox .orderTitle .orderState{float:right}.orderListBox dl{padding:.18rem;overflow:hidden;border-bottom:.01rem solid #e5e5e5;background:#f7f7f7}.orderListBox dl dd{float:left;width:1.63rem;height:1.63rem;margin-right:.16rem}.orderListBox dl dd img{display:block;width:100%;height:100%}.orderListBox dl dt{text-align:left;font-size:.23rem;color:#000;overflow:hidden}.orderListBox dl .proName{padding-top:.08rem}.orderListBox dl .proName p{line-height:.3rem;height:.6rem}.orderListBox dl .proAttribute{color:#999;height:.65rem}.orderListBox dl .proPrice{line-height:.3rem}.orderListBox dl .proPrice .proNum{float:right}.orderListBox .orderStat{margin-bottom:.02rem}.orderListBox .orderStat p{color:#000;text-align:right}.orderListBox .btns{padding:.18rem;background:#fff;overflow:hidden}.orderListBox .btns a{width:1.25rem;text-align:center;display:inline-block;float:right;font-size:.25rem;line-height:.52rem;border-radius:.04rem;margin-left:.18rem;border:.01rem solid #666;color:#666}.orderListBox .btns .orderInfoBtn{border:.01rem solid #ff2772;color:#ff2772}", ""]);

// exports


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".user-orders-box{padding-bottom:.8rem}", ""]);

// exports


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "#login-box,.login{height:100%}.login{padding:.72rem .18rem 0;background:#fff}.login .input-form{height:.86rem;border:.02rem solid #dadada;border-radius:.04rem;margin-bottom:.36rem;overflow:hidden}.login .input-form i{width:.68rem;height:100%;dispaly:block;float:left;background:url(" + __webpack_require__(4) + ") no-repeat}.login .input-form .user-ico{background-position:.14rem -1.3rem}.login .input-form .pw-ico{background-position:.14rem -2.3rem}.login .input-form input{width:5.3rem;height:100%;dispaly:block;float:left;font-size:.36rem;color:#000;line-height:100%}.login .input-form span{dispaly:block;height:100%;background:url(" + __webpack_require__(4) + ") no-repeat}.login .input-form .del-txst{width:.46rem;float:left;background-position:0 -3.04rem}.login .input-form .show-pw{width:.46rem;float:right;background-position:0 -3.72rem}.login .subBtn{display:block;width:100%;height:.72rem;color:#fff;border:none;border-radius:.06rem;background:#ff2772;font-size:.3rem;line-height:100%;font-weight:blod;margin-bottom:.7rem}.login .other{overflow:hidden;margin:0 auto;width:3.08rem}.login .other li{float:left}.login .other .divd,.login .other li a{font-size:.3rem;color:#ff2772;float:left}.login .other .divd{width:.68rem;text-align:center}", ""]);

// exports


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "#footMenu{width:100%;height:.88rem;background-color:#f7f7f7;position:fixed;overflow:hidden;bottom:0;border-top:.01rem solid #dcdcdc}#footMenu .a1{background-position:.06rem 0}#footMenu .a2{background-position:-1.43rem 0}#footMenu .a3{background-position:-2.95rem 0}#footMenu .a4{background-position:-4.43rem 0}#footMenu .a5{background-position:-5.95rem 0}#footMenu .ac1{background-position:.06rem -1.38rem}#footMenu .ac2{background-position:-1.43rem -1.38rem}#footMenu .ac3{background-position:-2.95rem -1.38rem}#footMenu .ac4{background-position:-4.44rem -1.38rem}#footMenu .ac5{background-position:-5.96rem -1.38rem}#footMenu a{display:block;float:left;width:20%;height:100%}#footMenu p{width:.53rem;height:.62rem;margin:.14rem auto 0;background:url(" + __webpack_require__(66) + ") no-repeat;background-position:0 0}.foot-enter-active,.foot-leave-active{transition:all 1.8s}.foot-enter,.foot-leave-active{margin-bottom:-.89rem}", ""]);

// exports


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "@-webkit-keyframes loadingPlus{0%{background-position:0 0}10%{background-position:0 -50px}20%{background-position:0 -100px}30%{background-position:0 -150px}40%{background-position:0 -200px}50%{background-position:0 -250px}60%{background-position:0 -300px}70%{background-position:0 -350px}80%{background-position:0 -400px}90%{background-position:0 -450px}to{background-position:0 0}}@keyframes loadingPlus{0%{background-position:0 0}10%{background-position:0 -50px}20%{background-position:0 -100px}30%{background-position:0 -150px}40%{background-position:0 -200px}50%{background-position:0 -250px}60%{background-position:0 -300px}70%{background-position:0 -350px}80%{background-position:0 -400px}90%{background-position:0 -450px}to{background-position:0 0}}.ui-loading-wrap .mask{position:absolute;width:100px;height:50px;left:50%;top:50%;margin-left:-50px;margin-top:-25px;background:url(" + __webpack_require__(63) + ") no-repeat;background-size:100px 500px;-webkit-animation:loadingPlus .4s steps(1) infinite;animation:loadingPlus .4s steps(1) infinite;transform:scale(3)}.ui-loading-wrap{position:fixed;top:0;z-index:10000;width:100%;height:100%;background:#fff}", ""]);

// exports


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".swiper-container{margin:0 auto;position:relative;overflow:hidden;z-index:1}.swiper-container-no-flexbox .swiper-slide{float:left}.swiper-container-vertical>.swiper-wrapper{-webkit-box-orient:vertical;-ms-flex-direction:column;flex-direction:column}.swiper-wrapper{position:relative;width:100%;height:100%;z-index:1;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-transition-property:-webkit-transform;transition-property:transform;box-sizing:content-box}.swiper-container-android .swiper-slide,.swiper-wrapper{-webkit-transform:translateZ(0);transform:translateZ(0)}.swiper-container-multirow>.swiper-wrapper{-webkit-box-lines:multiple;-moz-box-lines:multiple;-ms-flex-wrap:wrap;flex-wrap:wrap}.swiper-container-free-mode>.swiper-wrapper{-webkit-transition-timing-function:ease-out;transition-timing-function:ease-out;margin:0 auto}.swiper-slide{-webkit-flex-shrink:0;-ms-flex:0 0 auto;flex-shrink:0;width:100%;height:100%;position:relative}.swiper-container-autoheight,.swiper-container-autoheight .swiper-slide{height:auto}.swiper-container-autoheight .swiper-wrapper{-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;-webkit-transition-property:-webkit-transform,height;transition-property:transform,height}.swiper-container .swiper-notification{position:absolute;left:0;top:0;pointer-events:none;opacity:0;z-index:-1000}.swiper-wp8-horizontal{-ms-touch-action:pan-y;touch-action:pan-y}.swiper-wp8-vertical{-ms-touch-action:pan-x;touch-action:pan-x}.swiper-button-next,.swiper-button-prev{position:absolute;top:50%;width:27px;height:44px;margin-top:-22px;z-index:10;cursor:pointer;background-size:27px 44px;background-position:50%;background-repeat:no-repeat}.swiper-button-next.swiper-button-disabled,.swiper-button-prev.swiper-button-disabled{opacity:.35;cursor:auto;pointer-events:none}.swiper-button-prev,.swiper-container-rtl .swiper-button-next{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M0 22L22 0l2.1 2.1L4.2 22l19.9 19.9L22 44 0 22z' fill='%23007aff'/%3E%3C/svg%3E\");left:10px;right:auto}.swiper-button-prev.swiper-button-black,.swiper-container-rtl .swiper-button-next.swiper-button-black{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M0 22L22 0l2.1 2.1L4.2 22l19.9 19.9L22 44 0 22z'/%3E%3C/svg%3E\")}.swiper-button-prev.swiper-button-white,.swiper-container-rtl .swiper-button-next.swiper-button-white{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M0 22L22 0l2.1 2.1L4.2 22l19.9 19.9L22 44 0 22z' fill='%23fff'/%3E%3C/svg%3E\")}.swiper-button-next,.swiper-container-rtl .swiper-button-prev{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M27 22L5 44l-2.1-2.1L22.8 22 2.9 2.1 5 0l22 22z' fill='%23007aff'/%3E%3C/svg%3E\");right:10px;left:auto}.swiper-button-next.swiper-button-black,.swiper-container-rtl .swiper-button-prev.swiper-button-black{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M27 22L5 44l-2.1-2.1L22.8 22 2.9 2.1 5 0l22 22z'/%3E%3C/svg%3E\")}.swiper-button-next.swiper-button-white,.swiper-container-rtl .swiper-button-prev.swiper-button-white{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M27 22L5 44l-2.1-2.1L22.8 22 2.9 2.1 5 0l22 22z' fill='%23fff'/%3E%3C/svg%3E\")}.swiper-pagination{position:absolute;text-align:center;-webkit-transition:.3s;transition:.3s;-webkit-transform:translateZ(0);transform:translateZ(0);z-index:10}.swiper-pagination.swiper-pagination-hidden{opacity:0}.swiper-container-horizontal>.swiper-pagination-bullets,.swiper-pagination-custom,.swiper-pagination-fraction{bottom:10px;left:0;width:100%}.swiper-pagination-bullet{width:8px;height:8px;display:inline-block;border-radius:100%;background:#000;opacity:.2}button.swiper-pagination-bullet{border:none;margin:0;padding:0;box-shadow:none;-moz-appearance:none;-ms-appearance:none;-webkit-appearance:none;appearance:none}.swiper-pagination-clickable .swiper-pagination-bullet{cursor:pointer}.swiper-pagination-white .swiper-pagination-bullet{background:#fff}.swiper-pagination-bullet-active{opacity:1;background:#007aff}.swiper-pagination-white .swiper-pagination-bullet-active{background:#fff}.swiper-pagination-black .swiper-pagination-bullet-active{background:#000}.swiper-container-vertical>.swiper-pagination-bullets{right:10px;top:50%;-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0)}.swiper-container-vertical>.swiper-pagination-bullets .swiper-pagination-bullet{margin:5px 0;display:block}.swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet{margin:0 5px}.swiper-pagination-progress{background:rgba(0,0,0,.25);position:absolute}.swiper-pagination-progress .swiper-pagination-progressbar{background:#007aff;position:absolute;left:0;top:0;width:100%;height:100%;-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:left top;transform-origin:left top}.swiper-container-rtl .swiper-pagination-progress .swiper-pagination-progressbar{-webkit-transform-origin:right top;transform-origin:right top}.swiper-container-horizontal>.swiper-pagination-progress{width:100%;height:4px;left:0;top:0}.swiper-container-vertical>.swiper-pagination-progress{width:4px;height:100%;left:0;top:0}.swiper-pagination-progress.swiper-pagination-white{background:hsla(0,0%,100%,.5)}.swiper-pagination-progress.swiper-pagination-white .swiper-pagination-progressbar{background:#fff}.swiper-pagination-progress.swiper-pagination-black .swiper-pagination-progressbar{background:#000}.swiper-container-3d{-webkit-perspective:1200px;-o-perspective:1200px;perspective:1200px}.swiper-container-3d .swiper-cube-shadow,.swiper-container-3d .swiper-slide,.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top,.swiper-container-3d .swiper-wrapper{-webkit-transform-style:preserve-3d;transform-style:preserve-3d}.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:10}.swiper-container-3d .swiper-slide-shadow-left{background-image:-webkit-gradient(linear,left top,right top,from(rgba(0,0,0,.5)),to(transparent));background-image:-webkit-linear-gradient(right,rgba(0,0,0,.5),transparent);background-image:linear-gradient(270deg,rgba(0,0,0,.5),transparent)}.swiper-container-3d .swiper-slide-shadow-right{background-image:-webkit-gradient(linear,right top,left top,from(rgba(0,0,0,.5)),to(transparent));background-image:-webkit-linear-gradient(left,rgba(0,0,0,.5),transparent);background-image:linear-gradient(90deg,rgba(0,0,0,.5),transparent)}.swiper-container-3d .swiper-slide-shadow-top{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(0,0,0,.5)),to(transparent));background-image:-webkit-linear-gradient(bottom,rgba(0,0,0,.5),transparent);background-image:linear-gradient(0deg,rgba(0,0,0,.5),transparent)}.swiper-container-3d .swiper-slide-shadow-bottom{background-image:-webkit-gradient(linear,left bottom,left top,from(rgba(0,0,0,.5)),to(transparent));background-image:-webkit-linear-gradient(top,rgba(0,0,0,.5),transparent);background-image:linear-gradient(180deg,rgba(0,0,0,.5),transparent)}.swiper-container-coverflow .swiper-wrapper,.swiper-container-flip .swiper-wrapper{-ms-perspective:1200px}.swiper-container-cube,.swiper-container-flip{overflow:visible}.swiper-container-cube .swiper-slide,.swiper-container-flip .swiper-slide{pointer-events:none;-webkit-backface-visibility:hidden;backface-visibility:hidden;z-index:1}.swiper-container-cube .swiper-slide .swiper-slide,.swiper-container-flip .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-active .swiper-slide-active,.swiper-container-flip .swiper-slide-active,.swiper-container-flip .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-container-cube .swiper-slide-shadow-bottom,.swiper-container-cube .swiper-slide-shadow-left,.swiper-container-cube .swiper-slide-shadow-right,.swiper-container-cube .swiper-slide-shadow-top,.swiper-container-flip .swiper-slide-shadow-bottom,.swiper-container-flip .swiper-slide-shadow-left,.swiper-container-flip .swiper-slide-shadow-right,.swiper-container-flip .swiper-slide-shadow-top{z-index:0;-webkit-backface-visibility:hidden;backface-visibility:hidden}.swiper-container-cube .swiper-slide{visibility:hidden;-webkit-transform-origin:0 0;transform-origin:0 0;width:100%;height:100%}.swiper-container-cube.swiper-container-rtl .swiper-slide{-webkit-transform-origin:100% 0;transform-origin:100% 0}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-next,.swiper-container-cube .swiper-slide-next+.swiper-slide,.swiper-container-cube .swiper-slide-prev{pointer-events:auto;visibility:visible}.swiper-container-cube .swiper-cube-shadow{position:absolute;left:0;bottom:0;width:100%;height:100%;background:#000;opacity:.6;-webkit-filter:blur(50px);filter:blur(50px);z-index:0}.swiper-container-fade.swiper-container-free-mode .swiper-slide{-webkit-transition-timing-function:ease-out;transition-timing-function:ease-out}.swiper-container-fade .swiper-slide{pointer-events:none;-webkit-transition-property:opacity;transition-property:opacity}.swiper-container-fade .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-fade .swiper-slide-active,.swiper-container-fade .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-scrollbar{border-radius:10px;position:relative;-ms-touch-action:none;background:rgba(0,0,0,.1)}.swiper-container-horizontal>.swiper-scrollbar{position:absolute;left:1%;bottom:3px;z-index:50;height:5px;width:98%}.swiper-container-vertical>.swiper-scrollbar{position:absolute;right:3px;top:1%;z-index:50;width:5px;height:98%}.swiper-scrollbar-drag{height:100%;width:100%;position:relative;background:rgba(0,0,0,.5);border-radius:10px;left:0;top:0}.swiper-scrollbar-cursor-drag{cursor:move}.swiper-lazy-preloader{width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;-webkit-transform-origin:50%;transform-origin:50%;-webkit-animation:swiper-preloader-spin 1s steps(12) infinite;animation:swiper-preloader-spin 1s steps(12) infinite}.swiper-lazy-preloader:after{display:block;content:\"\";width:100%;height:100%;background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Cpath id='a' stroke='%236c6c6c' stroke-width='11' stroke-linecap='round' d='M60 7v20'/%3E%3C/defs%3E%3Cuse xlink:href='%23a' opacity='.27'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(30 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(60 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(90 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(120 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(150 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.37' transform='rotate(180 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.46' transform='rotate(210 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.56' transform='rotate(240 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.66' transform='rotate(270 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.75' transform='rotate(300 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.85' transform='rotate(330 60 60)'/%3E%3C/svg%3E\");background-position:50%;background-size:100%;background-repeat:no-repeat}.swiper-lazy-preloader-white:after{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Cpath id='a' stroke='%23fff' stroke-width='11' stroke-linecap='round' d='M60 7v20'/%3E%3C/defs%3E%3Cuse xlink:href='%23a' opacity='.27'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(30 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(60 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(90 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(120 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(150 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.37' transform='rotate(180 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.46' transform='rotate(210 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.56' transform='rotate(240 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.66' transform='rotate(270 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.75' transform='rotate(300 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.85' transform='rotate(330 60 60)'/%3E%3C/svg%3E\")}@-webkit-keyframes swiper-preloader-spin{to{-webkit-transform:rotate(1turn)}}@keyframes swiper-preloader-spin{to{transform:rotate(1turn)}}", ""]);

// exports


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "loading.png?34f22046c34440c6ab76b4617a49014a";

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "logo-foot.png?c3fa7ef987f5fa5b111c68f59233e489";

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "logo.png?e27364b3b8ae0c48a3da3f4cbe0f2cfa";

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "footMenu.png?d1b6b2bc5bec2fa74a72cdd4476a61cf";

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "right-ico.png?3aa1a7bb1251e28bbe54c212d39e4f36";

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "touxiang.png?9f15881660beac2ee0fd27f43f3fd76a";

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "ulogined.jpg?5e7ba1541ffb42306bd7add3a2f1016a";

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "user-icn.png?0afe34831b2584ae54bef03effe21d8e";

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(110)

/* script */
__vue_exports__ = __webpack_require__(15)

/* template */
var __vue_template__ = __webpack_require__(89)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(116)

/* script */
__vue_exports__ = __webpack_require__(19)

/* template */
var __vue_template__ = __webpack_require__(95)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(124)

/* script */
__vue_exports__ = __webpack_require__(20)

/* template */
var __vue_template__ = __webpack_require__(103)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(113)

/* script */
__vue_exports__ = __webpack_require__(21)

/* template */
var __vue_template__ = __webpack_require__(92)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(123)

/* script */
__vue_exports__ = __webpack_require__(22)

/* template */
var __vue_template__ = __webpack_require__(102)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(109)

/* script */
__vue_exports__ = __webpack_require__(23)

/* template */
var __vue_template__ = __webpack_require__(88)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(107)

/* script */
__vue_exports__ = __webpack_require__(24)

/* template */
var __vue_template__ = __webpack_require__(86)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(111)

/* script */
__vue_exports__ = __webpack_require__(25)

/* template */
var __vue_template__ = __webpack_require__(90)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(114)

/* script */
__vue_exports__ = __webpack_require__(26)

/* template */
var __vue_template__ = __webpack_require__(93)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(119)

/* script */
__vue_exports__ = __webpack_require__(27)

/* template */
var __vue_template__ = __webpack_require__(98)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(117)

/* script */
__vue_exports__ = __webpack_require__(28)

/* template */
var __vue_template__ = __webpack_require__(96)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(112)

/* script */
__vue_exports__ = __webpack_require__(29)

/* template */
var __vue_template__ = __webpack_require__(91)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(115)

/* script */
__vue_exports__ = __webpack_require__(30)

/* template */
var __vue_template__ = __webpack_require__(94)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(120)

/* script */
__vue_exports__ = __webpack_require__(32)

/* template */
var __vue_template__ = __webpack_require__(99)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(122)

/* script */
__vue_exports__ = __webpack_require__(33)

/* template */
var __vue_template__ = __webpack_require__(101)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 86 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', [_h('headnav', {
    attrs: {
      "title": pagetitle
    }
  }), " ", _h('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [_h('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (true),
      expression: "true"
    }],
    attrs: {
      "id": "mall"
    }
  })])])
}},staticRenderFns: []}

/***/ },
/* 87 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('header', {
    staticClass: "nav-header"
  }, [_h('a', {
    staticClass: "backBtn",
    on: {
      "click": function($event) {
        backfn()
      }
    }
  }), " ", _h('p', {
    staticClass: "headTxt"
  }, [_s(title)]), " ", _m(0)])
}},staticRenderFns: [function (){with(this) {
  return _h('a', {
    staticClass: "goAhead"
  }, [_h('i', {
    staticClass: "iconfont icon-"
  })])
}}]}

/***/ },
/* 88 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', [_h('headnav', {
    attrs: {
      "title": pagetitle
    }
  }), " ", _h('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [_h('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (true),
      expression: "true"
    }],
    attrs: {
      "id": "mall"
    }
  })])])
}},staticRenderFns: []}

/***/ },
/* 89 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', [_h('cover', {
    attrs: {
      "show": loading
    }
  }), " ", _h('transition', {
    attrs: {
      "name": "app-fade"
    }
  }, [_h('div', {
    attrs: {
      "show": !loading
    }
  }, [_m(0), " ", _h('banner', {
    attrs: {
      "imgArr": getCarousel
    }
  }), " ", _h('indexContent'), " ", _h('testContent')])])])
}},staticRenderFns: [function (){with(this) {
  return _h('header', {
    staticClass: "clearfix"
  }, [_h('div', {
    staticClass: "sc"
  }, ["优兑商城"])])
}}]}

/***/ },
/* 90 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', [_h('headnav', {
    attrs: {
      "title": pagetitle
    }
  }), " ", _h('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [_h('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (true),
      expression: "true"
    }],
    attrs: {
      "id": "mall"
    }
  })])])
}},staticRenderFns: []}

/***/ },
/* 91 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    staticClass: "my-wallet-box"
  }, [_h('headnav', {
    attrs: {
      "title": pagetitle
    }
  }), "\r\n  " + _s(myWallerData) + "\r\n"])
}},staticRenderFns: []}

/***/ },
/* 92 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    attrs: {
      "id": "indexComtent"
    }
  }, [_h('h1', [_s(mas)]), " ", _h('button', {
    on: {
      "click": function($event) {
        increment(num)
      }
    }
  }, ["按钮"])])
}},staticRenderFns: []}

/***/ },
/* 93 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    attrs: {
      "id": "indexComtent"
    }
  }, [_h('h3', [_s(counterValue)])])
}},staticRenderFns: []}

/***/ },
/* 94 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    staticClass: "order-info-box"
  }, [_h('loading', {
    attrs: {
      "show": loading
    }
  }), " ", _h('headnav', {
    attrs: {
      "title": pagetitle
    }
  }), " ", _h('div', {
    staticClass: "order-state"
  }, [_h('p', [_s(_f("orderState")(orderInfoData.state))])]), " ", _h('div', {
    staticClass: "add-info"
  }, [_h('p', {
    staticClass: "add-name"
  }, [_s(orderInfoData.receiverName), _h('span', [_s(orderInfoData.userName)])]), " ", _h('p', {
    staticClass: "adds"
  }, [_m(0), _s(orderInfoData.receiverArea + orderInfoData.receiverAddress)])]), " ", _h('div', {
    staticClass: "order-detail"
  }, [_h('p', {
    staticClass: "pro-tit"
  }, [_s(orderInfoData.sellerName)]), " ", _l((orderInfoData.orderItemList), function(data) {
    return _h('dl', [_h('dd', [_h('img', {
      attrs: {
        "src": data.productImgUrl
      }
    })]), " ", _h('dt', {
      staticClass: "proName"
    }, [_h('p', [_s(data.productName)])]), " ", _m(1, true), " ", _h('dt', {
      staticClass: "proPrice"
    }, ["¥" + _s(data.unitSellerPrice + data.unitVouchers) + " (可抵用" + _s(data.unitVouchers) + "优券)", _h('span', {
      staticClass: "proNum"
    }, ["x" + _s(data.count)])])])
  }), " ", _h('router-link', {
    staticClass: "linkBtn",
    attrs: {
      "to": "/user"
    }
  }, ["申请退款"])]), " ", _h('div', {
    staticClass: "pro-info"
  }, [_h('table', [_h('tr', [_m(2), " ", _h('td', ["￥" + _s(orderInfoData.totalPay) + ".00"])]), " ", _h('tr', [_m(3), " ", _h('td', ["￥" + _s(orderInfoData.totalDeliveryFee) + ".00"])]), " ", _h('tr', [_m(4), " ", _h('td', ["-￥" + _s(orderInfoData.totalVouchers) + ".00"])]), " ", _h('tr', [_m(5), " ", _h('td', ["￥" + _s(orderInfoData.totalPay) + ".00+"])])])]), " ", _h('div', {
    staticClass: "order-info"
  }, [_h('p', [_m(6), _s(orderInfoData.no)]), " ", _h('p', [_m(7), _s(_f("date")(orderInfoData.createTime))]), " ", _h('p', [_m(8), _s(_f("date")(orderInfoData.paymentTime))])]), "\r\n  " + _s(orderInfoData) + "\r\n  \r\n  \r\n  "])
}},staticRenderFns: [function (){with(this) {
  return _h('i')
}},function (){with(this) {
  return _h('dt', {
    staticClass: "proAttribute"
  }, ["参考身高：130  颜色分类：玫红色（女童）"])
}},function (){with(this) {
  return _h('th', ["商品金额："])
}},function (){with(this) {
  return _h('th', ["运费："])
}},function (){with(this) {
  return _h('th', ["活动抵扣："])
}},function (){with(this) {
  return _h('th', ["实付款："])
}},function (){with(this) {
  return _h('span', ["订单编号："])
}},function (){with(this) {
  return _h('span', ["下单时间："])
}},function (){with(this) {
  return _h('span', ["支付时间："])
}}]}

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('div', {
    staticClass: "vertical-center",
    class: show ? '' : 'done',
    attrs: {
      "id": "loading-cover"
    }
  }, [_m(0)])
}},staticRenderFns: [function (){with(this) {
  return _h('a', {
    staticClass: "logo-img",
    attrs: {
      "href": "#"
    }
  }, [_h('img', {
    staticClass: "inline",
    attrs: {
      "src": __webpack_require__(65)
    }
  })])
}}]}

/***/ },
/* 96 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    staticClass: "my-wallet-box"
  }, [_h('headnav', {
    attrs: {
      "title": pagetitle
    }
  }), "\r\n  " + _s(myEnvData) + "\r\n"])
}},staticRenderFns: []}

/***/ },
/* 97 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    staticClass: "swiper-container"
  }, [_h('div', {
    staticClass: "swiper-wrapper"
  }, [_l((imgArr), function(d) {
    return _h('div', {
      staticClass: "swiper-slide"
    }, [_h('img', {
      attrs: {
        "src": d.linkedImg
      }
    })])
  })]), " ", " ", _m(0)])
}},staticRenderFns: [function (){with(this) {
  return _h('div', {
    staticClass: "swiper-pagination"
  })
}}]}

/***/ },
/* 98 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    staticClass: "user-orders-box"
  }, [_h('loading', {
    attrs: {
      "show": loading
    }
  }), " ", _h('headnav', {
    attrs: {
      "title": pagetitle
    }
  }), " ", _h('banner', {
    attrs: {
      "imgArr": goodsInfoData.product.imgs
    }
  }), "\r\n  " + _s(goodsInfoData) + "\r\n"])
}},staticRenderFns: []}

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('div', {
    attrs: {
      "id": "user-center-box"
    }
  }, [_h('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [_h('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (true),
      expression: "true"
    }],
    attrs: {
      "id": "mall"
    }
  })]), " ", _h('div', {
    staticClass: "loginBox",
    class: [userInfo.isLogin ? 'loging' : 'ulogin'],
    on: {
      "click": function($event) {
        showNum()
      }
    }
  }, [(!userInfo.isLogin) ? _h('div', {
    staticClass: "toLogin"
  }, [_h('router-link', {
    attrs: {
      "to": "/login"
    }
  }, ["登录"]), " ", _m(0), " ", _h('router-link', {
    attrs: {
      "to": "/login"
    }
  }, ["注册"])]) : _e(), " ", (userInfo.isLogin) ? _h('div', {
    staticClass: "uInfo"
  }, [_h('router-link', {
    attrs: {
      "to": "/login"
    }
  }, [_h('dl', [_m(1), " ", _h('dt', {
    staticClass: "uName"
  }, [_s(userInfo.userName)]), " ", _m(2), " ", _m(3)])]), " ", _h('div', {
    staticClass: "uOrder"
  }, [_h('ul', [_h('li', {
    staticClass: "dd"
  }, [_h('router-link', {
    attrs: {
      "to": "/userOrders"
    }
  }, [_m(4), "我的订单\r\n                  "])]), " ", _h('li', {
    staticClass: "md"
  }, [_h('router-link', {
    attrs: {
      "to": "/login"
    }
  }, [_m(5), "我的买单\r\n                  "])])])])]) : _e()]), " ", _h('div', {
    staticClass: "uMenu"
  }, [_h('ul', {
    staticClass: "clearfix"
  }, [_h('li', [_h('router-link', {
    attrs: {
      "to": "/myWallet"
    }
  }, [_m(6), " ", _m(7)])]), " ", _h('li', [_h('router-link', {
    attrs: {
      "to": "/myEnvlop"
    }
  }, [_m(8), " ", _m(9)])]), " ", _h('li', [_h('router-link', {
    attrs: {
      "to": "/login"
    }
  }, [_m(10), " ", _m(11)])]), " ", _h('li', [_h('router-link', {
    attrs: {
      "to": "/login"
    }
  }, [_m(12), " ", _m(13)])]), " ", _h('li', [_h('router-link', {
    attrs: {
      "to": "/login"
    }
  }, [_m(14), " ", _m(15)])]), " ", _h('li', [_h('router-link', {
    attrs: {
      "to": "/login"
    }
  }, [_m(16), " ", _m(17)])]), " ", _h('li', [_h('router-link', {
    attrs: {
      "to": "/login"
    }
  }, [_m(18), " ", _m(19)])]), " ", _h('li', [_h('router-link', {
    attrs: {
      "to": "/login"
    }
  }, [_m(20), " ", _m(21)])])])]), " ", _h('ul', {
    staticClass: "uSeeting"
  }, [_h('li', [_h('router-link', {
    attrs: {
      "to": "/login"
    }
  }, [_m(22), " ", _m(23)])]), " ", _h('li', [_h('router-link', {
    attrs: {
      "to": "/login"
    }
  }, [_m(24), " ", _m(25)])])])])
}},staticRenderFns: [function (){with(this) {
  return _h('span', ["|"])
}},function (){with(this) {
  return _h('dd', [_h('img', {
    attrs: {
      "src": __webpack_require__(68)
    }
  })])
}},function (){with(this) {
  return _h('dt', {
    staticClass: "uLevel"
  }, ["普通会员"])
}},function (){with(this) {
  return _h('dt', {
    staticClass: "fr"
  })
}},function (){with(this) {
  return _h('i')
}},function (){with(this) {
  return _h('i')
}},function (){with(this) {
  return _h('i', {
    staticClass: "myWallet"
  })
}},function (){with(this) {
  return _h('p', ["我的钱包"])
}},function (){with(this) {
  return _h('i', {
    staticClass: "hongbao"
  })
}},function (){with(this) {
  return _h('p', ["我的红包"])
}},function (){with(this) {
  return _h('i', {
    staticClass: "shoucang"
  })
}},function (){with(this) {
  return _h('p', ["我的收藏"])
}},function (){with(this) {
  return _h('i', {
    staticClass: "activity"
  })
}},function (){with(this) {
  return _h('p', ["我的活动"])
}},function (){with(this) {
  return _h('i', {
    staticClass: "invite"
  })
}},function (){with(this) {
  return _h('p', ["邀请会员"])
}},function (){with(this) {
  return _h('i', {
    staticClass: "friend"
  })
}},function (){with(this) {
  return _h('p', ["我的好友"])
}},function (){with(this) {
  return _h('i', {
    staticClass: "myReward"
  })
}},function (){with(this) {
  return _h('p', ["我的奖励"])
}},function (){with(this) {
  return _h('i', {
    staticClass: "partner"
  })
}},function (){with(this) {
  return _h('p', ["合伙人福利"])
}},function (){with(this) {
  return _h('i', {
    staticClass: "set-ico"
  })
}},function (){with(this) {
  return _h('p', ["设置"])
}},function (){with(this) {
  return _h('i', {
    staticClass: "kd-ico"
  })
}},function (){with(this) {
  return _h('p', ["我要开店", _h('span', ["(同城商家申请)"])])
}}]}

/***/ },
/* 100 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', [_l((orderList), function(data) {
    return _h('div', {
      staticClass: "orderListBox"
    }, [_h('div', {
      staticClass: "orderTitle"
    }, [_h('span', {
      staticClass: "orderNum"
    }, ["订单编号：" + _s(data.no)]), " ", _h('span', {
      staticClass: "orderState"
    }, [_s(data.orderStatusName)])]), " ", _l((data.orderItemList), function(d) {
      return _h('div', [_h('router-link', {
        attrs: {
          "to": '/detail/' + d.productId
        }
      }, [_h('dl', [_h('dd', [_h('img', {
        attrs: {
          "src": d.productImgUrl
        }
      })]), " ", _h('dt', {
        staticClass: "proName"
      }, [_h('p', [_s(d.productName)])]), " ", _m(0, true), " ", _h('dt', {
        staticClass: "proPrice"
      }, ["¥" + _s(d.totalPayment) + "  (可抵用" + _s(d.unitVouchers) + "优券)", _h('span', {
        staticClass: "proNum"
      }, ["x" + _s(d.count)])])])])])
    }), " ", _h('div', {
      staticClass: "orderStat"
    }, [_h('p', ["共1件商品 合计￥" + _s(data.totalPay) + "+" + _s(data.totalVouchers) + "优券（含运费￥" + _s(data.totalDeliveryFee) + "）"])]), " ", _h('div', {
      staticClass: "btns"
    }, [_h('router-link', {
      staticClass: "orderInfoBtn",
      attrs: {
        "to": "/user"
      }
    }, ["立即支付"]), " ", _h('a', {
      on: {
        "click": function($event) {
          cancelOrder(data.no)
        }
      }
    }, ["取消订单"]), " ", _h('router-link', {
      attrs: {
        "to": '/orderInfo/' + data.no
      }
    }, ["订单详情"])])])
  })])
}},staticRenderFns: [function (){with(this) {
  return _h('dt', {
    staticClass: "proAttribute"
  }, ["参考身高：130  颜色分类：玫红色（女童）"])
}}]}

/***/ },
/* 101 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    staticClass: "user-orders-box"
  }, [_h('headnav', {
    attrs: {
      "title": pagetitle
    }
  }), " ", _h('banner', {
    attrs: {
      "imgArr": getOrdersCarousel
    }
  }), " ", _h('order-list', {
    attrs: {
      "orderList": orderList
    }
  })])
}},staticRenderFns: []}

/***/ },
/* 102 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    attrs: {
      "id": "login-box"
    }
  }, [_h('headnav', {
    attrs: {
      "title": pagetitle
    }
  }), " ", _h('div', {
    staticClass: "login"
  }, [_h('div', {
    staticClass: "input-form"
  }, [_m(0), " ", _h('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (userName),
      expression: "userName"
    }],
    attrs: {
      "type": "text",
      "placeholder": "用户名/手机号"
    },
    domProps: {
      "value": _s(userName)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) return;
        userName = $event.target.value
      }
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (userName != ''),
      expression: "userName!=''"
    }],
    staticClass: "del-txst",
    on: {
      "click": function($event) {
        userName = ''
      }
    }
  })]), " ", _h('div', {
    staticClass: "input-form"
  }, [_m(1), " ", _h('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (passWord),
      expression: "passWord"
    }],
    attrs: {
      "type": "password",
      "placeholder": "密码"
    },
    domProps: {
      "value": _s(passWord)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) return;
        passWord = $event.target.value
      }
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (passWord != ''),
      expression: "passWord!=''"
    }],
    staticClass: "del-txst",
    on: {
      "click": function($event) {
        passWord = ''
      }
    }
  }), " ", _m(2)]), " ", _h('button', {
    staticClass: "subBtn",
    on: {
      "click": function($event) {
        loginfn({
          phone: userName,
          pwd: passWord
        })
      }
    }
  }, ["登录"]), " ", _h('button', {
    staticClass: "subBtn",
    on: {
      "click": function($event) {
        loginfn({
          phone: userName,
          pwd: passWord
        })
      }
    }
  }, ["验证"]), " ", _h('ul', {
    staticClass: "clearfix other"
  }, [_h('li', [_h('router-link', {
    attrs: {
      "to": "/login"
    }
  }, ["手机注册"])]), " ", _m(3), " ", _h('li', [_h('router-link', {
    attrs: {
      "to": "/login"
    }
  }, ["忘记密码"])])])])])
}},staticRenderFns: [function (){with(this) {
  return _h('i', {
    staticClass: "user-ico"
  })
}},function (){with(this) {
  return _h('i', {
    staticClass: "pw-ico"
  })
}},function (){with(this) {
  return _h('span', {
    staticClass: "show-pw"
  })
}},function (){with(this) {
  return _h('li', {
    staticClass: "divd"
  }, ["|"])
}}]}

/***/ },
/* 103 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('transition', {
    attrs: {
      "name": "foot"
    }
  }, [(true) ? _h('div', {
    attrs: {
      "id": "footMenu"
    }
  }, [_h('router-link', {
    attrs: {
      "to": "/index"
    }
  }, [_h('p', {
    class: [iscur == 1 ? 'ac1' : 'a1'],
    on: {
      "click": function($event) {
        heiline(1)
      }
    }
  })]), " ", _h('router-link', {
    attrs: {
      "to": "/mall"
    }
  }, [_h('p', {
    class: [iscur == 2 ? 'ac2' : 'a2'],
    on: {
      "click": function($event) {
        heiline(2)
      }
    }
  })]), " ", _h('router-link', {
    attrs: {
      "to": "/tcshop"
    }
  }, [_h('p', {
    class: [iscur == 3 ? 'ac3' : 'a3'],
    on: {
      "click": function($event) {
        heiline(3)
      }
    }
  })]), " ", _h('router-link', {
    attrs: {
      "to": "/shopcar"
    }
  }, [_h('p', {
    class: [iscur == 4 ? 'ac4' : 'a4'],
    on: {
      "click": function($event) {
        heiline(4)
      }
    }
  })]), " ", _h('router-link', {
    attrs: {
      "to": "/user"
    }
  }, [_h('p', {
    class: [iscur == 5 ? 'ac5' : 'a5'],
    on: {
      "click": function($event) {
        heiline(5)
      }
    }
  })])]) : _e()])
}},staticRenderFns: []}

/***/ },
/* 104 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (show),
      expression: "show"
    }],
    staticClass: "ui-loading-wrap",
    attrs: {
      "id": "BP_Loading"
    }
  }, [_m(0)])
}},staticRenderFns: [function (){with(this) {
  return _h('p', {
    staticClass: "mask"
  }, [_h('span')])
}}]}

/***/ },
/* 105 */
/***/ function(module, exports) {

"use strict";
/*!
 * vue-resource v1.0.3
 * https://github.com/vuejs/vue-resource
 * Released under the MIT License.
 */

'use strict';

/**
 * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
 */

var RESOLVED = 0;
var REJECTED = 1;
var PENDING = 2;

function Promise$1(executor) {

    this.state = PENDING;
    this.value = undefined;
    this.deferred = [];

    var promise = this;

    try {
        executor(function (x) {
            promise.resolve(x);
        }, function (r) {
            promise.reject(r);
        });
    } catch (e) {
        promise.reject(e);
    }
}

Promise$1.reject = function (r) {
    return new Promise$1(function (resolve, reject) {
        reject(r);
    });
};

Promise$1.resolve = function (x) {
    return new Promise$1(function (resolve, reject) {
        resolve(x);
    });
};

Promise$1.all = function all(iterable) {
    return new Promise$1(function (resolve, reject) {
        var count = 0,
            result = [];

        if (iterable.length === 0) {
            resolve(result);
        }

        function resolver(i) {
            return function (x) {
                result[i] = x;
                count += 1;

                if (count === iterable.length) {
                    resolve(result);
                }
            };
        }

        for (var i = 0; i < iterable.length; i += 1) {
            Promise$1.resolve(iterable[i]).then(resolver(i), reject);
        }
    });
};

Promise$1.race = function race(iterable) {
    return new Promise$1(function (resolve, reject) {
        for (var i = 0; i < iterable.length; i += 1) {
            Promise$1.resolve(iterable[i]).then(resolve, reject);
        }
    });
};

var p$1 = Promise$1.prototype;

p$1.resolve = function resolve(x) {
    var promise = this;

    if (promise.state === PENDING) {
        if (x === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        var called = false;

        try {
            var then = x && x['then'];

            if (x !== null && typeof x === 'object' && typeof then === 'function') {
                then.call(x, function (x) {
                    if (!called) {
                        promise.resolve(x);
                    }
                    called = true;
                }, function (r) {
                    if (!called) {
                        promise.reject(r);
                    }
                    called = true;
                });
                return;
            }
        } catch (e) {
            if (!called) {
                promise.reject(e);
            }
            return;
        }

        promise.state = RESOLVED;
        promise.value = x;
        promise.notify();
    }
};

p$1.reject = function reject(reason) {
    var promise = this;

    if (promise.state === PENDING) {
        if (reason === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        promise.state = REJECTED;
        promise.value = reason;
        promise.notify();
    }
};

p$1.notify = function notify() {
    var promise = this;

    nextTick(function () {
        if (promise.state !== PENDING) {
            while (promise.deferred.length) {
                var deferred = promise.deferred.shift(),
                    onResolved = deferred[0],
                    onRejected = deferred[1],
                    resolve = deferred[2],
                    reject = deferred[3];

                try {
                    if (promise.state === RESOLVED) {
                        if (typeof onResolved === 'function') {
                            resolve(onResolved.call(undefined, promise.value));
                        } else {
                            resolve(promise.value);
                        }
                    } else if (promise.state === REJECTED) {
                        if (typeof onRejected === 'function') {
                            resolve(onRejected.call(undefined, promise.value));
                        } else {
                            reject(promise.value);
                        }
                    }
                } catch (e) {
                    reject(e);
                }
            }
        }
    });
};

p$1.then = function then(onResolved, onRejected) {
    var promise = this;

    return new Promise$1(function (resolve, reject) {
        promise.deferred.push([onResolved, onRejected, resolve, reject]);
        promise.notify();
    });
};

p$1.catch = function (onRejected) {
    return this.then(undefined, onRejected);
};

/**
 * Promise adapter.
 */

if (typeof Promise === 'undefined') {
    window.Promise = Promise$1;
}

function PromiseObj(executor, context) {

    if (executor instanceof Promise) {
        this.promise = executor;
    } else {
        this.promise = new Promise(executor.bind(context));
    }

    this.context = context;
}

PromiseObj.all = function (iterable, context) {
    return new PromiseObj(Promise.all(iterable), context);
};

PromiseObj.resolve = function (value, context) {
    return new PromiseObj(Promise.resolve(value), context);
};

PromiseObj.reject = function (reason, context) {
    return new PromiseObj(Promise.reject(reason), context);
};

PromiseObj.race = function (iterable, context) {
    return new PromiseObj(Promise.race(iterable), context);
};

var p = PromiseObj.prototype;

p.bind = function (context) {
    this.context = context;
    return this;
};

p.then = function (fulfilled, rejected) {

    if (fulfilled && fulfilled.bind && this.context) {
        fulfilled = fulfilled.bind(this.context);
    }

    if (rejected && rejected.bind && this.context) {
        rejected = rejected.bind(this.context);
    }

    return new PromiseObj(this.promise.then(fulfilled, rejected), this.context);
};

p.catch = function (rejected) {

    if (rejected && rejected.bind && this.context) {
        rejected = rejected.bind(this.context);
    }

    return new PromiseObj(this.promise.catch(rejected), this.context);
};

p.finally = function (callback) {

    return this.then(function (value) {
        callback.call(this);
        return value;
    }, function (reason) {
        callback.call(this);
        return Promise.reject(reason);
    });
};

/**
 * Utility functions.
 */

var debug = false;var util = {};var slice = [].slice;


function Util (Vue) {
    util = Vue.util;
    debug = Vue.config.debug || !Vue.config.silent;
}

function warn(msg) {
    if (typeof console !== 'undefined' && debug) {
        console.warn('[VueResource warn]: ' + msg);
    }
}

function error(msg) {
    if (typeof console !== 'undefined') {
        console.error(msg);
    }
}

function nextTick(cb, ctx) {
    return util.nextTick(cb, ctx);
}

function trim(str) {
    return str.replace(/^\s*|\s*$/g, '');
}

function toLower(str) {
    return str ? str.toLowerCase() : '';
}

function toUpper(str) {
    return str ? str.toUpperCase() : '';
}

var isArray = Array.isArray;

function isString(val) {
    return typeof val === 'string';
}

function isBoolean(val) {
    return val === true || val === false;
}

function isFunction(val) {
    return typeof val === 'function';
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

function isPlainObject(obj) {
    return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}

function isBlob(obj) {
    return typeof Blob !== 'undefined' && obj instanceof Blob;
}

function isFormData(obj) {
    return typeof FormData !== 'undefined' && obj instanceof FormData;
}

function when(value, fulfilled, rejected) {

    var promise = PromiseObj.resolve(value);

    if (arguments.length < 2) {
        return promise;
    }

    return promise.then(fulfilled, rejected);
}

function options(fn, obj, opts) {

    opts = opts || {};

    if (isFunction(opts)) {
        opts = opts.call(obj);
    }

    return merge(fn.bind({ $vm: obj, $options: opts }), fn, { $options: opts });
}

function each(obj, iterator) {

    var i, key;

    if (obj && typeof obj.length == 'number') {
        for (i = 0; i < obj.length; i++) {
            iterator.call(obj[i], obj[i], i);
        }
    } else if (isObject(obj)) {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                iterator.call(obj[key], obj[key], key);
            }
        }
    }

    return obj;
}

var assign = Object.assign || _assign;

function merge(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {
        _merge(target, source, true);
    });

    return target;
}

function defaults(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {

        for (var key in source) {
            if (target[key] === undefined) {
                target[key] = source[key];
            }
        }
    });

    return target;
}

function _assign(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {
        _merge(target, source);
    });

    return target;
}

function _merge(target, source, deep) {
    for (var key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                target[key] = {};
            }
            if (isArray(source[key]) && !isArray(target[key])) {
                target[key] = [];
            }
            _merge(target[key], source[key], deep);
        } else if (source[key] !== undefined) {
            target[key] = source[key];
        }
    }
}

/**
 * Root Prefix Transform.
 */

function root (options, next) {

    var url = next(options);

    if (isString(options.root) && !url.match(/^(https?:)?\//)) {
        url = options.root + '/' + url;
    }

    return url;
}

/**
 * Query Parameter Transform.
 */

function query (options, next) {

    var urlParams = Object.keys(Url.options.params),
        query = {},
        url = next(options);

    each(options.params, function (value, key) {
        if (urlParams.indexOf(key) === -1) {
            query[key] = value;
        }
    });

    query = Url.params(query);

    if (query) {
        url += (url.indexOf('?') == -1 ? '?' : '&') + query;
    }

    return url;
}

/**
 * URL Template v2.0.6 (https://github.com/bramstein/url-template)
 */

function expand(url, params, variables) {

    var tmpl = parse(url),
        expanded = tmpl.expand(params);

    if (variables) {
        variables.push.apply(variables, tmpl.vars);
    }

    return expanded;
}

function parse(template) {

    var operators = ['+', '#', '.', '/', ';', '?', '&'],
        variables = [];

    return {
        vars: variables,
        expand: function (context) {
            return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
                if (expression) {

                    var operator = null,
                        values = [];

                    if (operators.indexOf(expression.charAt(0)) !== -1) {
                        operator = expression.charAt(0);
                        expression = expression.substr(1);
                    }

                    expression.split(/,/g).forEach(function (variable) {
                        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
                        values.push.apply(values, getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
                        variables.push(tmp[1]);
                    });

                    if (operator && operator !== '+') {

                        var separator = ',';

                        if (operator === '?') {
                            separator = '&';
                        } else if (operator !== '#') {
                            separator = operator;
                        }

                        return (values.length !== 0 ? operator : '') + values.join(separator);
                    } else {
                        return values.join(',');
                    }
                } else {
                    return encodeReserved(literal);
                }
            });
        }
    };
}

function getValues(context, operator, key, modifier) {

    var value = context[key],
        result = [];

    if (isDefined(value) && value !== '') {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            value = value.toString();

            if (modifier && modifier !== '*') {
                value = value.substring(0, parseInt(modifier, 10));
            }

            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
        } else {
            if (modifier === '*') {
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
                    });
                } else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            result.push(encodeValue(operator, value[k], k));
                        }
                    });
                }
            } else {
                var tmp = [];

                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        tmp.push(encodeValue(operator, value));
                    });
                } else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            tmp.push(encodeURIComponent(k));
                            tmp.push(encodeValue(operator, value[k].toString()));
                        }
                    });
                }

                if (isKeyOperator(operator)) {
                    result.push(encodeURIComponent(key) + '=' + tmp.join(','));
                } else if (tmp.length !== 0) {
                    result.push(tmp.join(','));
                }
            }
        }
    } else {
        if (operator === ';') {
            result.push(encodeURIComponent(key));
        } else if (value === '' && (operator === '&' || operator === '?')) {
            result.push(encodeURIComponent(key) + '=');
        } else if (value === '') {
            result.push('');
        }
    }

    return result;
}

function isDefined(value) {
    return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
    return operator === ';' || operator === '&' || operator === '?';
}

function encodeValue(operator, value, key) {

    value = operator === '+' || operator === '#' ? encodeReserved(value) : encodeURIComponent(value);

    if (key) {
        return encodeURIComponent(key) + '=' + value;
    } else {
        return value;
    }
}

function encodeReserved(str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
            part = encodeURI(part);
        }
        return part;
    }).join('');
}

/**
 * URL Template (RFC 6570) Transform.
 */

function template (options) {

    var variables = [],
        url = expand(options.url, options.params, variables);

    variables.forEach(function (key) {
        delete options.params[key];
    });

    return url;
}

/**
 * Service for URL templating.
 */

var ie = document.documentMode;
var el = document.createElement('a');

function Url(url, params) {

    var self = this || {},
        options = url,
        transform;

    if (isString(url)) {
        options = { url: url, params: params };
    }

    options = merge({}, Url.options, self.$options, options);

    Url.transforms.forEach(function (handler) {
        transform = factory(handler, transform, self.$vm);
    });

    return transform(options);
}

/**
 * Url options.
 */

Url.options = {
    url: '',
    root: null,
    params: {}
};

/**
 * Url transforms.
 */

Url.transforms = [template, query, root];

/**
 * Encodes a Url parameter string.
 *
 * @param {Object} obj
 */

Url.params = function (obj) {

    var params = [],
        escape = encodeURIComponent;

    params.add = function (key, value) {

        if (isFunction(value)) {
            value = value();
        }

        if (value === null) {
            value = '';
        }

        this.push(escape(key) + '=' + escape(value));
    };

    serialize(params, obj);

    return params.join('&').replace(/%20/g, '+');
};

/**
 * Parse a URL and return its components.
 *
 * @param {String} url
 */

Url.parse = function (url) {

    if (ie) {
        el.href = url;
        url = el.href;
    }

    el.href = url;

    return {
        href: el.href,
        protocol: el.protocol ? el.protocol.replace(/:$/, '') : '',
        port: el.port,
        host: el.host,
        hostname: el.hostname,
        pathname: el.pathname.charAt(0) === '/' ? el.pathname : '/' + el.pathname,
        search: el.search ? el.search.replace(/^\?/, '') : '',
        hash: el.hash ? el.hash.replace(/^#/, '') : ''
    };
};

function factory(handler, next, vm) {
    return function (options) {
        return handler.call(vm, options, next);
    };
}

function serialize(params, obj, scope) {

    var array = isArray(obj),
        plain = isPlainObject(obj),
        hash;

    each(obj, function (value, key) {

        hash = isObject(value) || isArray(value);

        if (scope) {
            key = scope + '[' + (plain || hash ? key : '') + ']';
        }

        if (!scope && array) {
            params.add(value.name, value.value);
        } else if (hash) {
            serialize(params, value, key);
        } else {
            params.add(key, value);
        }
    });
}

/**
 * XDomain client (Internet Explorer).
 */

function xdrClient (request) {
    return new PromiseObj(function (resolve) {

        var xdr = new XDomainRequest(),
            handler = function (_ref) {
            var type = _ref.type;


            var status = 0;

            if (type === 'load') {
                status = 200;
            } else if (type === 'error') {
                status = 500;
            }

            resolve(request.respondWith(xdr.responseText, { status: status }));
        };

        request.abort = function () {
            return xdr.abort();
        };

        xdr.open(request.method, request.getUrl());
        xdr.timeout = 0;
        xdr.onload = handler;
        xdr.onerror = handler;
        xdr.ontimeout = handler;
        xdr.onprogress = function () {};
        xdr.send(request.getBody());
    });
}

/**
 * CORS Interceptor.
 */

var ORIGIN_URL = Url.parse(location.href);
var SUPPORTS_CORS = 'withCredentials' in new XMLHttpRequest();

function cors (request, next) {

    if (!isBoolean(request.crossOrigin) && crossOrigin(request)) {
        request.crossOrigin = true;
    }

    if (request.crossOrigin) {

        if (!SUPPORTS_CORS) {
            request.client = xdrClient;
        }

        delete request.emulateHTTP;
    }

    next();
}

function crossOrigin(request) {

    var requestUrl = Url.parse(Url(request));

    return requestUrl.protocol !== ORIGIN_URL.protocol || requestUrl.host !== ORIGIN_URL.host;
}

/**
 * Body Interceptor.
 */

function body (request, next) {

    if (isFormData(request.body)) {

        request.headers.delete('Content-Type');
    } else if (isObject(request.body) || isArray(request.body)) {

        if (request.emulateJSON) {
            request.body = Url.params(request.body);
            request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
        } else {
            request.body = JSON.stringify(request.body);
        }
    }

    next(function (response) {

        Object.defineProperty(response, 'data', {
            get: function () {
                return this.body;
            },
            set: function (body) {
                this.body = body;
            }
        });

        return response.bodyText ? when(response.text(), function (text) {

            var type = response.headers.get('Content-Type');

            if (isString(type) && type.indexOf('application/json') === 0) {

                try {
                    response.body = JSON.parse(text);
                } catch (e) {
                    response.body = null;
                }
            } else {
                response.body = text;
            }

            return response;
        }) : response;
    });
}

/**
 * JSONP client.
 */

function jsonpClient (request) {
    return new PromiseObj(function (resolve) {

        var name = request.jsonp || 'callback',
            callback = '_jsonp' + Math.random().toString(36).substr(2),
            body = null,
            handler,
            script;

        handler = function (_ref) {
            var type = _ref.type;


            var status = 0;

            if (type === 'load' && body !== null) {
                status = 200;
            } else if (type === 'error') {
                status = 500;
            }

            resolve(request.respondWith(body, { status: status }));

            delete window[callback];
            document.body.removeChild(script);
        };

        request.params[name] = callback;

        window[callback] = function (result) {
            body = JSON.stringify(result);
        };

        script = document.createElement('script');
        script.src = request.getUrl();
        script.type = 'text/javascript';
        script.async = true;
        script.onload = handler;
        script.onerror = handler;

        document.body.appendChild(script);
    });
}

/**
 * JSONP Interceptor.
 */

function jsonp (request, next) {

    if (request.method == 'JSONP') {
        request.client = jsonpClient;
    }

    next(function (response) {

        if (request.method == 'JSONP') {

            return when(response.json(), function (json) {

                response.body = json;

                return response;
            });
        }
    });
}

/**
 * Before Interceptor.
 */

function before (request, next) {

    if (isFunction(request.before)) {
        request.before.call(this, request);
    }

    next();
}

/**
 * HTTP method override Interceptor.
 */

function method (request, next) {

    if (request.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(request.method)) {
        request.headers.set('X-HTTP-Method-Override', request.method);
        request.method = 'POST';
    }

    next();
}

/**
 * Header Interceptor.
 */

function header (request, next) {

    var headers = assign({}, Http.headers.common, !request.crossOrigin ? Http.headers.custom : {}, Http.headers[toLower(request.method)]);

    each(headers, function (value, name) {
        if (!request.headers.has(name)) {
            request.headers.set(name, value);
        }
    });

    next();
}

/**
 * Timeout Interceptor.
 */

function timeout (request, next) {

    var timeout;

    if (request.timeout) {
        timeout = setTimeout(function () {
            request.abort();
        }, request.timeout);
    }

    next(function (response) {

        clearTimeout(timeout);
    });
}

/**
 * XMLHttp client.
 */

function xhrClient (request) {
    return new PromiseObj(function (resolve) {

        var xhr = new XMLHttpRequest(),
            handler = function (event) {

            var response = request.respondWith('response' in xhr ? xhr.response : xhr.responseText, {
                status: xhr.status === 1223 ? 204 : xhr.status, // IE9 status bug
                statusText: xhr.status === 1223 ? 'No Content' : trim(xhr.statusText)
            });

            each(trim(xhr.getAllResponseHeaders()).split('\n'), function (row) {
                response.headers.append(row.slice(0, row.indexOf(':')), row.slice(row.indexOf(':') + 1));
            });

            resolve(response);
        };

        request.abort = function () {
            return xhr.abort();
        };

        if (request.progress) {
            if (request.method === 'GET') {
                xhr.addEventListener('progress', request.progress);
            } else if (/^(POST|PUT)$/i.test(request.method)) {
                xhr.upload.addEventListener('progress', request.progress);
            }
        }

        xhr.open(request.method, request.getUrl(), true);

        if ('responseType' in xhr) {
            xhr.responseType = 'blob';
        }

        if (request.credentials === true) {
            xhr.withCredentials = true;
        }

        request.headers.forEach(function (value, name) {
            xhr.setRequestHeader(name, value);
        });

        xhr.timeout = 0;
        xhr.onload = handler;
        xhr.onerror = handler;
        xhr.send(request.getBody());
    });
}

/**
 * Base client.
 */

function Client (context) {

    var reqHandlers = [sendRequest],
        resHandlers = [],
        handler;

    if (!isObject(context)) {
        context = null;
    }

    function Client(request) {
        return new PromiseObj(function (resolve) {

            function exec() {

                handler = reqHandlers.pop();

                if (isFunction(handler)) {
                    handler.call(context, request, next);
                } else {
                    warn('Invalid interceptor of type ' + typeof handler + ', must be a function');
                    next();
                }
            }

            function next(response) {

                if (isFunction(response)) {

                    resHandlers.unshift(response);
                } else if (isObject(response)) {

                    resHandlers.forEach(function (handler) {
                        response = when(response, function (response) {
                            return handler.call(context, response) || response;
                        });
                    });

                    when(response, resolve);

                    return;
                }

                exec();
            }

            exec();
        }, context);
    }

    Client.use = function (handler) {
        reqHandlers.push(handler);
    };

    return Client;
}

function sendRequest(request, resolve) {

    var client = request.client || xhrClient;

    resolve(client(request));
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/**
 * HTTP Headers.
 */

var Headers = function () {
    function Headers(headers) {
        var _this = this;

        classCallCheck(this, Headers);


        this.map = {};

        each(headers, function (value, name) {
            return _this.append(name, value);
        });
    }

    Headers.prototype.has = function has(name) {
        return getName(this.map, name) !== null;
    };

    Headers.prototype.get = function get(name) {

        var list = this.map[getName(this.map, name)];

        return list ? list[0] : null;
    };

    Headers.prototype.getAll = function getAll(name) {
        return this.map[getName(this.map, name)] || [];
    };

    Headers.prototype.set = function set(name, value) {
        this.map[normalizeName(getName(this.map, name) || name)] = [trim(value)];
    };

    Headers.prototype.append = function append(name, value) {

        var list = this.getAll(name);

        if (list.length) {
            list.push(trim(value));
        } else {
            this.set(name, value);
        }
    };

    Headers.prototype.delete = function _delete(name) {
        delete this.map[getName(this.map, name)];
    };

    Headers.prototype.forEach = function forEach(callback, thisArg) {
        var _this2 = this;

        each(this.map, function (list, name) {
            each(list, function (value) {
                return callback.call(thisArg, value, name, _this2);
            });
        });
    };

    return Headers;
}();

function getName(map, name) {
    return Object.keys(map).reduce(function (prev, curr) {
        return toLower(name) === toLower(curr) ? curr : prev;
    }, null);
}

function normalizeName(name) {

    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name');
    }

    return trim(name);
}

/**
 * HTTP Response.
 */

var Response = function () {
    function Response(body, _ref) {
        var url = _ref.url;
        var headers = _ref.headers;
        var status = _ref.status;
        var statusText = _ref.statusText;
        classCallCheck(this, Response);


        this.url = url;
        this.ok = status >= 200 && status < 300;
        this.status = status || 0;
        this.statusText = statusText || '';
        this.headers = new Headers(headers);
        this.body = body;

        if (isString(body)) {

            this.bodyText = body;
        } else if (isBlob(body)) {

            this.bodyBlob = body;

            if (isBlobText(body)) {
                this.bodyText = blobText(body);
            }
        }
    }

    Response.prototype.blob = function blob() {
        return when(this.bodyBlob);
    };

    Response.prototype.text = function text() {
        return when(this.bodyText);
    };

    Response.prototype.json = function json() {
        return when(this.text(), function (text) {
            return JSON.parse(text);
        });
    };

    return Response;
}();

function blobText(body) {
    return new PromiseObj(function (resolve) {

        var reader = new FileReader();

        reader.readAsText(body);
        reader.onload = function () {
            resolve(reader.result);
        };
    });
}

function isBlobText(body) {
    return body.type.indexOf('text') === 0 || body.type.indexOf('json') !== -1;
}

/**
 * HTTP Request.
 */

var Request = function () {
    function Request(options) {
        classCallCheck(this, Request);


        this.body = null;
        this.params = {};

        assign(this, options, {
            method: toUpper(options.method || 'GET')
        });

        if (!(this.headers instanceof Headers)) {
            this.headers = new Headers(this.headers);
        }
    }

    Request.prototype.getUrl = function getUrl() {
        return Url(this);
    };

    Request.prototype.getBody = function getBody() {
        return this.body;
    };

    Request.prototype.respondWith = function respondWith(body, options) {
        return new Response(body, assign(options || {}, { url: this.getUrl() }));
    };

    return Request;
}();

/**
 * Service for sending network requests.
 */

var CUSTOM_HEADERS = { 'X-Requested-With': 'XMLHttpRequest' };
var COMMON_HEADERS = { 'Accept': 'application/json, text/plain, */*' };
var JSON_CONTENT_TYPE = { 'Content-Type': 'application/json;charset=utf-8' };

function Http(options) {

    var self = this || {},
        client = Client(self.$vm);

    defaults(options || {}, self.$options, Http.options);

    Http.interceptors.forEach(function (handler) {
        client.use(handler);
    });

    return client(new Request(options)).then(function (response) {

        return response.ok ? response : PromiseObj.reject(response);
    }, function (response) {

        if (response instanceof Error) {
            error(response);
        }

        return PromiseObj.reject(response);
    });
}

Http.options = {};

Http.headers = {
    put: JSON_CONTENT_TYPE,
    post: JSON_CONTENT_TYPE,
    patch: JSON_CONTENT_TYPE,
    delete: JSON_CONTENT_TYPE,
    custom: CUSTOM_HEADERS,
    common: COMMON_HEADERS
};

Http.interceptors = [before, timeout, method, body, jsonp, header, cors];

['get', 'delete', 'head', 'jsonp'].forEach(function (method) {

    Http[method] = function (url, options) {
        return this(assign(options || {}, { url: url, method: method }));
    };
});

['post', 'put', 'patch'].forEach(function (method) {

    Http[method] = function (url, body, options) {
        return this(assign(options || {}, { url: url, method: method, body: body }));
    };
});

/**
 * Service for interacting with RESTful services.
 */

function Resource(url, params, actions, options) {

    var self = this || {},
        resource = {};

    actions = assign({}, Resource.actions, actions);

    each(actions, function (action, name) {

        action = merge({ url: url, params: assign({}, params) }, options, action);

        resource[name] = function () {
            return (self.$http || Http)(opts(action, arguments));
        };
    });

    return resource;
}

function opts(action, args) {

    var options = assign({}, action),
        params = {},
        body;

    switch (args.length) {

        case 2:

            params = args[0];
            body = args[1];

            break;

        case 1:

            if (/^(POST|PUT|PATCH)$/i.test(options.method)) {
                body = args[0];
            } else {
                params = args[0];
            }

            break;

        case 0:

            break;

        default:

            throw 'Expected up to 4 arguments [params, body], got ' + args.length + ' arguments';
    }

    options.body = body;
    options.params = assign({}, options.params, params);

    return options;
}

Resource.actions = {

    get: { method: 'GET' },
    save: { method: 'POST' },
    query: { method: 'GET' },
    update: { method: 'PUT' },
    remove: { method: 'DELETE' },
    delete: { method: 'DELETE' }

};

/**
 * Install plugin.
 */

function plugin(Vue) {

    if (plugin.installed) {
        return;
    }

    Util(Vue);

    Vue.url = Url;
    Vue.http = Http;
    Vue.resource = Resource;
    Vue.Promise = PromiseObj;

    Object.defineProperties(Vue.prototype, {

        $url: {
            get: function () {
                return options(Vue.url, this, this.$options.url);
            }
        },

        $http: {
            get: function () {
                return options(Vue.http, this, this.$options.http);
            }
        },

        $resource: {
            get: function () {
                return Vue.resource.bind(this);
            }
        },

        $promise: {
            get: function () {
                var _this = this;

                return function (executor) {
                    return new Vue.Promise(executor, _this);
                };
            }
        }

    });
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

module.exports = plugin;

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

/**
 * vue-router v2.0.1
 * (c) 2016 Evan You
 * @license MIT
 */
(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueRouter = factory());
}(this, (function () { 'use strict';

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (h, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true

    var route = parent.$route
    var cache = parent._routerViewCache || (parent._routerViewCache = {})
    var depth = 0
    var inactive = false

    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++
      }
      if (parent._inactive) {
        inactive = true
      }
      parent = parent.$parent
    }

    data.routerViewDepth = depth
    var matched = route.matched[depth]
    if (!matched) {
      return h()
    }

    var name = props.name
    var component = inactive
      ? cache[name]
      : (cache[name] = matched.components[name])

    if (!inactive) {
      var hooks = data.hook || (data.hook = {})
      hooks.init = function (vnode) {
        matched.instances[name] = vnode.child
      }
      hooks.destroy = function (vnode) {
        if (matched.instances[name] === vnode.child) {
          matched.instances[name] = undefined
        }
      }
    }

    return h(component, data, children)
  }
}

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  if (relative.charAt(0) === '/') {
    return relative
  }

  if (relative.charAt(0) === '?' || relative.charAt(0) === '#') {
    return base + relative
  }

  var stack = base.split('/')

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop()
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/')
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i]
    if (segment === '.') {
      continue
    } else if (segment === '..') {
      stack.pop()
    } else {
      stack.push(segment)
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('')
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = ''
  var query = ''

  var hashIndex = path.indexOf('#')
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex)
    path = path.slice(0, hashIndex)
  }

  var queryIndex = path.indexOf('?')
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1)
    path = path.slice(0, queryIndex)
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (!condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message))
  }
}

/*  */

var encode = encodeURIComponent
var decode = decodeURIComponent

function resolveQuery (
  query,
  extraQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  if (query) {
    var parsedQuery
    try {
      parsedQuery = parseQuery(query)
    } catch (e) {
      warn(false, e.message)
      parsedQuery = {}
    }
    for (var key in extraQuery) {
      parsedQuery[key] = extraQuery[key]
    }
    return parsedQuery
  } else {
    return extraQuery
  }
}

function parseQuery (query) {
  var res = Object.create(null)

  query = query.trim().replace(/^(\?|#|&)/, '')

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=')
    var key = decode(parts.shift())
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null

    if (res[key] === undefined) {
      res[key] = val
    } else if (Array.isArray(res[key])) {
      res[key].push(val)
    } else {
      res[key] = [res[key], val]
    }
  })

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).sort().map(function (key) {
    var val = obj[key]

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = []
      val.slice().forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key))
        } else {
          result.push(encode(key) + '=' + encode(val2))
        }
      })
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null
  return res ? ("?" + res) : ''
}

/*  */

function createRoute (
  record,
  location,
  redirectedFrom
) {
  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: location.query || {},
    params: location.params || {},
    fullPath: getFullPath(location),
    matched: record ? formatMatch(record) : []
  }
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom)
  }
  return Object.freeze(route)
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
})

function formatMatch (record) {
  var res = []
  while (record) {
    res.unshift(record)
    record = record.parent
  }
  return res
}

function getFullPath (ref) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  return (path || '/') + stringifyQuery(query) + hash
}

var trailingSlashRE = /\/$/
function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  var aKeys = Object.keys(a)
  var bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) { return String(a[key]) === String(b[key]); })
}

function isIncludedRoute (current, target) {
  return (
    current.path.indexOf(target.path) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

function normalizeLocation (
  raw,
  current,
  append
) {
  var next = typeof raw === 'string' ? { path: raw } : raw
  if (next.name || next._normalized) {
    return next
  }

  var parsedPath = parsePath(next.path || '')
  var basePath = (current && current.path) || '/'
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append)
    : (current && current.path) || '/'
  var query = resolveQuery(parsedPath.query, next.query)
  var hash = next.hash || parsedPath.hash
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

/*  */

// work around weird flow bug
var toTypes = [String, Object]

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router
    var current = this.$route
    var to = normalizeLocation(this.to, current, this.append)
    var resolved = router.match(to)
    var fullPath = resolved.redirectedFrom || resolved.fullPath
    var base = router.history.base
    var href = base ? cleanPath(base + fullPath) : fullPath
    var classes = {}
    var activeClass = this.activeClass || router.options.linkActiveClass || 'router-link-active'
    var compareTarget = to.path ? createRoute(null, to) : resolved
    classes[activeClass] = this.exact
      ? isSameRoute(current, compareTarget)
      : isIncludedRoute(current, compareTarget)

    var on = {
      click: function (e) {
        // don't redirect with control keys
        /* istanbul ignore if */
        if (e.metaKey || e.ctrlKey || e.shiftKey) { return }
        // don't redirect when preventDefault called
        /* istanbul ignore if */
        if (e.defaultPrevented) { return }
        // don't redirect on right click
        /* istanbul ignore if */
        if (e.button !== 0) { return }
        e.preventDefault()
        if (this$1.replace) {
          router.replace(to)
        } else {
          router.push(to)
        }
      }
    }

    var data = {
      class: classes
    }

    if (this.tag === 'a') {
      data.on = on
      data.attrs = { href: href }
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default)
      if (a) {
        var aData = a.data || (a.data = {})
        aData.on = on
        var aAttrs = aData.attrs || (aData.attrs = {})
        aAttrs.href = href
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
}

function findAnchor (children) {
  if (children) {
    var child
    for (var i = 0; i < children.length; i++) {
      child = children[i]
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

function install (Vue) {
  if (install.installed) { return }
  install.installed = true

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this.$root._router }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get$1 () { return this.$root._route }
  })

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (this.$options.router) {
        this._router = this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      }
    }
  })

  Vue.component('router-view', View)
  Vue.component('router-link', Link)
}

var __moduleExports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

var isarray = __moduleExports

/**
 * Expose `pathToRegexp`.
 */
var index = pathToRegexp
var parse_1 = parse
var compile_1 = compile
var tokensToFunction_1 = tokensToFunction
var tokensToRegExp_1 = tokensToRegExp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string} str
 * @return {!Array}
 */
function parse (str) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    var next = str[index]
    var prefix = res[2]
    var name = res[3]
    var capture = res[4]
    var group = res[5]
    var modifier = res[6]
    var asterisk = res[7]

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    var partial = prefix != null && next != null && next !== prefix
    var repeat = modifier === '+' || modifier === '*'
    var optional = modifier === '?' || modifier === '*'
    var delimiter = res[2] || '/'
    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: escapeGroup(pattern)
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @return {!function(Object=, Object=)}
 */
function compile (str) {
  return tokensToFunction(parse(str))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
    }
  }

  return function (obj, opts) {
    var path = ''
    var data = obj || {}
    var options = opts || {}
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      var value = data[token.name]
      var segment

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      })
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  var tokens = parse(path)
  var re = tokensToRegExp(tokens, options)

  // Attach keys back to the regexp.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] !== 'string') {
      keys.push(tokens[i])
    }
  }

  return attachKeys(re, keys)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}  tokens
 * @param  {Object=} options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, options) {
  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var route = ''
  var lastToken = tokens[tokens.length - 1]
  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = '(?:' + token.pattern + ')'

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = prefix + '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
  }

  if (end) {
    route += '$'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithSlash ? '' : '(?=\\/|$)'
  }

  return new RegExp('^' + route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  keys = keys || []

  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys)
    keys = []
  } else if (!options) {
    options = {}
  }

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

index.parse = parse_1;
index.compile = compile_1;
index.tokensToFunction = tokensToFunction_1;
index.tokensToRegExp = tokensToRegExp_1;

/*  */

function createRouteMap (routes) {
  var pathMap = Object.create(null)
  var nameMap = Object.create(null)

  routes.forEach(function (route) {
    addRouteRecord(pathMap, nameMap, route)
  })

  return {
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  assert(path != null, "\"path\" is required in a route configuration.")

  var record = {
    path: normalizePath(path, parent),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {}
  }

  if (route.children) {
    // Warn if route is named and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (false) {}
    route.children.forEach(function (child) {
      addRouteRecord(pathMap, nameMap, child, record)
    })
  }

  if (route.alias) {
    if (Array.isArray(route.alias)) {
      route.alias.forEach(function (alias) {
        addRouteRecord(pathMap, nameMap, { path: alias }, parent, record.path)
      })
    } else {
      addRouteRecord(pathMap, nameMap, { path: route.alias }, parent, record.path)
    }
  }

  pathMap[record.path] = record
  if (name) { nameMap[name] = record }
}

function normalizePath (path, parent) {
  path = path.replace(/\/$/, '')
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */

var regexpCache = Object.create(null)

var regexpCompileCache = Object.create(null)

function createMatcher (routes) {
  var ref = createRouteMap(routes);
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute)
    var name = location.name;

    if (name) {
      var record = nameMap[name]
      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""))
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {}
      for (var path in pathMap) {
        if (matchRoute(path, location.params, location.path)) {
          return _createRoute(pathMap[path], location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location))
        : originalRedirect

    if (typeof redirect === 'string') {
      redirect = { path: redirect }
    }

    if (!redirect || typeof redirect !== 'object') {
      warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))))
      return _createRoute(null, location)
    }

    var re = redirect
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query
    hash = re.hasOwnProperty('hash') ? re.hash : hash
    params = re.hasOwnProperty('params') ? re.params : params

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name]
      assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."))
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record)
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""))
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))))
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""))
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    })
    if (aliasedMatch) {
      var matched = aliasedMatch.matched
      var aliasedRecord = matched[matched.length - 1]
      location.params = aliasedMatch.params
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom)
  }

  return match
}

function matchRoute (
  path,
  params,
  pathname
) {
  var keys, regexp
  var hit = regexpCache[path]
  if (hit) {
    keys = hit.keys
    regexp = hit.regexp
  } else {
    keys = []
    regexp = index(path, keys)
    regexpCache[path] = { keys: keys, regexp: regexp }
  }
  var m = pathname.match(regexp)

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1]
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i]
    if (key) { params[key.name] = val }
  }

  return true
}

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = index.compile(path))
    return filler(params || {}, { pretty: true })
  } catch (e) {
    assert(false, ("missing param for " + routeMsg + ": " + (e.message)))
    return ''
  }
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */

var inBrowser = typeof window !== 'undefined'

var supportsHistory = inBrowser && (function () {
  var ua = window.navigator.userAgent

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})()

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}

/*  */


var History = function History (router, base) {
  this.router = router
  this.base = normalizeBase(base)
  // start with a route object that stands for "nowhere"
  this.current = START
  this.pending = null
};

History.prototype.listen = function listen (cb) {
  this.cb = cb
};

History.prototype.transitionTo = function transitionTo (location, cb) {
    var this$1 = this;

  var route = this.router.match(location, this.current)
  this.confirmTransition(route, function () {
    this$1.updateRoute(route)
    cb && cb(route)
    this$1.ensureURL()
  })
};

History.prototype.confirmTransition = function confirmTransition (route, cb) {
    var this$1 = this;

  var current = this.current
  if (isSameRoute(route, current)) {
    this.ensureURL()
    return
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  )

  this.pending = route
  var iterator = function (hook, next) {
    if (this$1.pending !== route) { return }
    hook(route, current, function (to) {
      if (to === false) {
        // next(false) -> abort navigation, ensure current URL
        this$1.ensureURL()
      } else if (typeof to === 'string' || typeof to === 'object') {
        // next('/') or next({ path: '/' }) -> redirect
        this$1.push(to)
      } else {
        // confirm transition and pass on the value
        next(to)
      }
    })
  }

  runQueue(queue, iterator, function () {
    var postEnterCbs = []
    var enterGuards = extractEnterGuards(activated, postEnterCbs, function () {
      return this$1.current === route
    })
    // wait until async components are resolved before
    // extracting in-component enter guards
    runQueue(enterGuards, iterator, function () {
      if (this$1.pending === route) {
        this$1.pending = null
        cb(route)
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { return cb(); })
        })
      }
    })
  })
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current
  this.current = route
  this.cb && this.cb(route)
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev)
  })
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base')
      base = baseEl ? baseEl.getAttribute('href') : '/'
    } else {
      base = '/'
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i
  var max = Math.max(current.length, next.length)
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractLeaveGuards (matched) {
  return flatMapComponents(matched, function (def, instance) {
    var guard = def && def.beforeRouteLeave
    if (guard) {
      return function routeLeaveGuard () {
        return guard.apply(instance, arguments)
      }
    }
  }).reverse()
}

function extractEnterGuards (
  matched,
  cbs,
  isValid
) {
  return flatMapComponents(matched, function (def, _, match, key) {
    var guard = def && def.beforeRouteEnter
    if (guard) {
      return function routeEnterGuard (to, from, next) {
        return guard(to, from, function (cb) {
          next(cb)
          if (typeof cb === 'function') {
            cbs.push(function () {
              // #750
              // if a router-view is wrapped with an out-in transition,
              // the instance may not have been registered at this time.
              // we will need to poll for registration until current route
              // is no longer valid.
              poll(cb, match.instances, key, isValid)
            })
          }
        })
      }
    }
  })
}

function poll (cb, instances, key, isValid) {
  if (instances[key]) {
    cb(instances[key])
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid)
    }, 16)
  }
}

function resolveAsyncComponents (matched) {
  return flatMapComponents(matched, function (def, _, match, key) {
    // if it's a function and doesn't have Vue options attached,
    // assume it's an async component resolve function.
    // we are not using Vue's default async resolving mechanism because
    // we want to halt the navigation until the incoming component has been
    // resolved.
    if (typeof def === 'function' && !def.options) {
      return function (to, from, next) {
        var resolve = function (resolvedDef) {
          match.components[key] = resolvedDef
          next()
        }

        var reject = function (reason) {
          warn(false, ("Failed to resolve async component " + key + ": " + reason))
          next(false)
        }

        var res = def(resolve, reject)
        if (res && typeof res.then === 'function') {
          res.then(resolve, reject)
        }
      }
    }
  })
}

function flatMapComponents (
  matched,
  fn
) {
  return Array.prototype.concat.apply([], matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

/*  */

function saveScrollPosition (key) {
  if (!key) { return }
  window.sessionStorage.setItem(key, JSON.stringify({
    x: window.pageXOffset,
    y: window.pageYOffset
  }))
}

function getScrollPosition (key) {
  if (!key) { return }
  return JSON.parse(window.sessionStorage.getItem(key))
}

function getElementPosition (el) {
  var docRect = document.documentElement.getBoundingClientRect()
  var elRect = el.getBoundingClientRect()
  return {
    x: elRect.left - docRect.left,
    y: elRect.top - docRect.top
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

/*  */


var genKey = function () { return String(Date.now()); }
var _key = genKey()

var HTML5History = (function (History) {
  function HTML5History (router, base) {
    var this$1 = this;

    History.call(this, router, base)

    this.transitionTo(getLocation(this.base))

    var expectScroll = router.options.scrollBehavior
    window.addEventListener('popstate', function (e) {
      _key = e.state && e.state.key
      var current = this$1.current
      this$1.transitionTo(getLocation(this$1.base), function (next) {
        if (expectScroll) {
          this$1.handleScroll(next, current, true)
        }
      })
    })

    if (expectScroll) {
      window.addEventListener('scroll', function () {
        saveScrollPosition(_key)
      })
    }
  }

  if ( History ) HTML5History.__proto__ = History;
  HTML5History.prototype = Object.create( History && History.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n)
  };

  HTML5History.prototype.push = function push (location) {
    var this$1 = this;

    var current = this.current
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath))
      this$1.handleScroll(route, current, false)
    })
  };

  HTML5History.prototype.replace = function replace (location) {
    var this$1 = this;

    var current = this.current
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath))
      this$1.handleScroll(route, current, false)
    })
  };

  HTML5History.prototype.ensureURL = function ensureURL () {
    if (getLocation(this.base) !== this.current.fullPath) {
      replaceState(cleanPath(this.base + this.current.fullPath))
    }
  };

  HTML5History.prototype.handleScroll = function handleScroll (to, from, isPop) {
    var router = this.router
    if (!router.app) {
      return
    }

    var behavior = router.options.scrollBehavior
    if (!behavior) {
      return
    }
    assert(typeof behavior === 'function', "scrollBehavior must be a function")

    // wait until re-render finishes before scrolling
    router.app.$nextTick(function () {
      var position = getScrollPosition(_key)
      var shouldScroll = behavior(to, from, isPop ? position : null)
      if (!shouldScroll) {
        return
      }
      var isObject = typeof shouldScroll === 'object'
      if (isObject && typeof shouldScroll.selector === 'string') {
        var el = document.querySelector(shouldScroll.selector)
        if (el) {
          position = getElementPosition(el)
        } else if (isValidPosition(shouldScroll)) {
          position = normalizePosition(shouldScroll)
        }
      } else if (isObject && isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll)
      }

      if (position) {
        window.scrollTo(position.x, position.y)
      }
    })
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length)
  }
  return (path || '/') + window.location.search + window.location.hash
}

function pushState (url, replace) {
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url)
    } else {
      _key = genKey()
      history.pushState({ key: _key }, '', url)
    }
    saveScrollPosition(_key)
  } catch (e) {
    window.location[replace ? 'assign' : 'replace'](url)
  }
}

function replaceState (url) {
  pushState(url, true)
}

/*  */


var HashHistory = (function (History) {
  function HashHistory (router, base, fallback) {
    var this$1 = this;

    History.call(this, router, base)

    // check history fallback deeplinking
    if (fallback && this.checkFallback()) {
      return
    }

    ensureSlash()
    this.transitionTo(getHash(), function () {
      window.addEventListener('hashchange', function () {
        this$1.onHashChange()
      })
    })
  }

  if ( History ) HashHistory.__proto__ = History;
  HashHistory.prototype = Object.create( History && History.prototype );
  HashHistory.prototype.constructor = HashHistory;

  HashHistory.prototype.checkFallback = function checkFallback () {
    var location = getLocation(this.base)
    if (!/^\/#/.test(location)) {
      window.location.replace(
        cleanPath(this.base + '/#' + location)
      )
      return true
    }
  };

  HashHistory.prototype.onHashChange = function onHashChange () {
    if (!ensureSlash()) {
      return
    }
    this.transitionTo(getHash(), function (route) {
      replaceHash(route.fullPath)
    })
  };

  HashHistory.prototype.push = function push (location) {
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath)
    })
  };

  HashHistory.prototype.replace = function replace (location) {
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath)
    })
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n)
  };

  HashHistory.prototype.ensureURL = function ensureURL () {
    if (getHash() !== this.current.fullPath) {
      replaceHash(this.current.fullPath)
    }
  };

  return HashHistory;
}(History));

function ensureSlash () {
  var path = getHash()
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path)
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href
  var index = href.indexOf('#')
  return index === -1 ? '' : href.slice(index + 1)
}

function pushHash (path) {
  window.location.hash = path
}

function replaceHash (path) {
  var i = window.location.href.indexOf('#')
  window.location.replace(
    window.location.href.slice(0, i >= 0 ? i : 0) + '#' + path
  )
}

/*  */


var AbstractHistory = (function (History) {
  function AbstractHistory (router) {
    History.call(this, router)
    this.stack = []
    this.index = -1
  }

  if ( History ) AbstractHistory.__proto__ = History;
  AbstractHistory.prototype = Object.create( History && History.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route)
      this$1.index++
    })
  };

  AbstractHistory.prototype.replace = function replace (location) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route)
    })
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex]
    this.confirmTransition(route, function () {
      this$1.index = targetIndex
      this$1.updateRoute(route)
    })
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null
  this.options = options
  this.beforeHooks = []
  this.afterHooks = []
  this.match = createMatcher(options.routes || [])

  var mode = options.mode || 'hash'
  this.fallback = mode === 'history' && !supportsHistory
  if (this.fallback) {
    mode = 'hash'
  }
  if (!inBrowser) {
    mode = 'abstract'
  }
  this.mode = mode
};

var prototypeAccessors = { currentRoute: {} };

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  )

  this.app = app

  var ref = this;
    var mode = ref.mode;
    var options = ref.options;
    var fallback = ref.fallback;
  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base)
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, fallback)
      break
    case 'abstract':
      this.history = new AbstractHistory(this)
      break
    default:
      assert(false, ("invalid mode: " + mode))
  }

  this.history.listen(function (route) {
    this$1.app._route = route
  })
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  this.beforeHooks.push(fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  this.afterHooks.push(fn)
};

VueRouter.prototype.push = function push (location) {
  this.history.push(location)
};

VueRouter.prototype.replace = function replace (location) {
  this.history.replace(location)
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n)
};

VueRouter.prototype.back = function back () {
  this.go(-1)
};

VueRouter.prototype.forward = function forward () {
  this.go(1)
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents () {
  if (!this.currentRoute) {
    return []
  }
  return [].concat.apply([], this.currentRoute.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

VueRouter.install = install

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}

return VueRouter;

})));

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(43);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-1649ad02!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./shopcar.vue", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-1649ad02!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./shopcar.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(44);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-30324b3f!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./header.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-30324b3f!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./header.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(45);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-3e54ee83!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./mall.vue", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-3e54ee83!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./mall.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(46);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-44667741!./../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue", function() {
			var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-44667741!./../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(47);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-45641814!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./tcshop.vue", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-45641814!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./tcshop.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(48);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-4835dd98!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./my-wallet.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-4835dd98!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./my-wallet.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(49);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-5d6ac336!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./indexContent.vue", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-5d6ac336!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./indexContent.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(50);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-6d3801f0!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./testcontent.vue", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-6d3801f0!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./testcontent.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(51);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-77cf5bdf!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./order-info.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-77cf5bdf!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./order-info.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(52);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-7896edd8!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./cover.vue", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-7896edd8!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./cover.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(53);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-7bad3542!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./my-envlop.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-7bad3542!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./my-envlop.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(54);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-7cd5805e!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./banner.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-7cd5805e!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./banner.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(55);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-831f813a!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./detail.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-831f813a!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./detail.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(56);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-84d9d216!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./user-center.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-84d9d216!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./user-center.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(57);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-852da062!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./order-list.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-852da062!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./order-list.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(58);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-b31c34f6!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./user-orders.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-b31c34f6!./../../../node_modules/sass-loader/index.js!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./user-orders.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(59);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-c7c73eec!./../../node_modules/sass-loader/index.js!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./login.vue", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-c7c73eec!./../../node_modules/sass-loader/index.js!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./login.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(60);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-f59f4988!./../../node_modules/sass-loader/index.js!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./footmenu.vue", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-f59f4988!./../../node_modules/sass-loader/index.js!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./footmenu.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(61);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-f75f370c!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./loading.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-f75f370c!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./loading.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _vue = __webpack_require__(5);

var _vue2 = _interopRequireDefault(_vue);

var _store = __webpack_require__(14);

var _store2 = _interopRequireDefault(_store);

var _routerConfig = __webpack_require__(13);

var _routerConfig2 = _interopRequireDefault(_routerConfig);

var _filter = __webpack_require__(12);

var _filter2 = _interopRequireDefault(_filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import wxjssdk from './../static/jweixin-1.0.0.js'
//判断是否微信
var ua = window.navigator.userAgent.toLowerCase();
var isWx = ua.match(/MicroMessenger/i) == 'micromessenger';
if (isWx) {}

new _vue2.default({
  el: '#app',
  router: _routerConfig2.default.router,
  store: _store2.default
}).$mount('#app');

/***/ }
/******/ ]);
//# sourceMappingURL=build.js.map