(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PxtCloudAPI = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Events;
(function (Events) {
    Events["ChatNewMessage"] = "new message";
    Events["UserAddSelf"] = "add self";
    Events["UserLeft"] = "user left";
    Events["UserJoined"] = "user joined";
    Events["UserRemoveSelf"] = "remove self";
    Events["UserSelfInfo"] = "self info";
    Events["WorldSyncDiff"] = "sync diff";
})(Events = exports.Events || (exports.Events = {}));

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cloneDeep = require('clone-deep');
var deep_diff_1 = require("deep-diff");
var DataRepo = (function () {
    function DataRepo() {
        this._synceddata = {};
    }
    DataRepo.prototype.addDataSource = function (name, source_) {
        var synceddata = this._synceddata[name];
        if (!synceddata) {
            this._synceddata[name] = { source: source_, current: source_.data };
        }
        return !!synceddata;
    };
    DataRepo.prototype.removeDataSource = function (name) {
        return delete this._synceddata[name];
    };
    DataRepo.prototype.currentlySynced = function (name) {
        var synceddata = this._synceddata[name];
        if (!synceddata) {
            return null;
        }
        return synceddata.current || null;
    };
    DataRepo.prototype.syncData = function (name) {
        var synceddata = this._synceddata[name];
        if (!synceddata) {
            return null;
        }
        var current = synceddata.source.cloner ? synceddata.source.cloner(synceddata.source.data, cloneDeep) : cloneDeep(synceddata.source.data);
        var diff_ = deep_diff_1.diff(synceddata.current, current) || [];
        synceddata.current = current;
        return diff_;
    };
    DataRepo.prototype.applyDataDiffs = function (name, diff_) {
        var synceddata = this._synceddata[name];
        if (!synceddata) {
            return false;
        }
        if (Array.isArray(diff_)) {
            diff_.forEach(function (item) { return deep_diff_1.applyChange(synceddata.current, synceddata.current, item); });
        }
        else {
            deep_diff_1.applyChange(synceddata.current, synceddata.current, diff_);
        }
        return true;
    };
    return DataRepo;
}());
exports.DataRepo = DataRepo;

},{"clone-deep":4,"deep-diff":5}],3:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./api"));
__export(require("./datarepo"));

},{"./api":1,"./datarepo":2}],4:[function(require,module,exports){
'use strict';

/**
 * Module dependenices
 */

var isObject = require('is-plain-object');
var clone = require('shallow-clone');
var typeOf = require('kind-of');
var forOwn = require('for-own');

/**
 * Recursively clone native types.
 */

function cloneDeep(val, instanceClone) {
  switch (typeOf(val)) {
    case 'object':
      return cloneObjectDeep(val, instanceClone);
    case 'array':
      return cloneArrayDeep(val, instanceClone);
    default: {
      return clone(val);
    }
  }
}

function cloneObjectDeep(obj, instanceClone) {
  if (isObject(obj) || (instanceClone === true && typeOf(obj) === 'object')) {
    var res = {};
    forOwn(obj, function(val, key) {
      this[key] = cloneDeep(val, instanceClone);
    }, res);
    return res;
  }
  if (typeof instanceClone === 'function') {
    return instanceClone(obj);
  }
  return obj;
}

function cloneArrayDeep(arr, instanceClone) {
  var res = [];
  for (var i = 0; i < arr.length; i++) {
    res[i] = cloneDeep(arr[i], instanceClone);
  }
  return res;
}

/**
 * Expose `cloneDeep`
 */

module.exports = cloneDeep;

},{"for-own":7,"is-plain-object":8,"kind-of":10,"shallow-clone":13}],5:[function(require,module,exports){
;(function(root, factory) { // eslint-disable-line no-extra-semi
  var deepDiff = factory(root);
  // eslint-disable-next-line no-undef
  if (typeof define === 'function' && define.amd) {
      // AMD
      define('DeepDiff', function() { // eslint-disable-line no-undef
          return deepDiff;
      });
  } else if (typeof exports === 'object') {
      // Node.js
      module.exports = deepDiff;
  } else {
      // Browser globals
      var _deepdiff = root.DeepDiff;
      deepDiff.noConflict = function() {
          if (root.DeepDiff === deepDiff) {
              root.DeepDiff = _deepdiff;
          }
          return deepDiff;
      };
      root.DeepDiff = deepDiff;
  }
}(this, function(root) {
  var validKinds = ['N', 'E', 'A', 'D'];

  // nodejs compatible on server side and in the browser.
  function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  }

  function Diff(kind, path) {
    Object.defineProperty(this, 'kind', {
      value: kind,
      enumerable: true
    });
    if (path && path.length) {
      Object.defineProperty(this, 'path', {
        value: path,
        enumerable: true
      });
    }
  }

  function DiffEdit(path, origin, value) {
    DiffEdit.super_.call(this, 'E', path);
    Object.defineProperty(this, 'lhs', {
      value: origin,
      enumerable: true
    });
    Object.defineProperty(this, 'rhs', {
      value: value,
      enumerable: true
    });
  }
  inherits(DiffEdit, Diff);

  function DiffNew(path, value) {
    DiffNew.super_.call(this, 'N', path);
    Object.defineProperty(this, 'rhs', {
      value: value,
      enumerable: true
    });
  }
  inherits(DiffNew, Diff);

  function DiffDeleted(path, value) {
    DiffDeleted.super_.call(this, 'D', path);
    Object.defineProperty(this, 'lhs', {
      value: value,
      enumerable: true
    });
  }
  inherits(DiffDeleted, Diff);

  function DiffArray(path, index, item) {
    DiffArray.super_.call(this, 'A', path);
    Object.defineProperty(this, 'index', {
      value: index,
      enumerable: true
    });
    Object.defineProperty(this, 'item', {
      value: item,
      enumerable: true
    });
  }
  inherits(DiffArray, Diff);

  function arrayRemove(arr, from, to) {
    var rest = arr.slice((to || from) + 1 || arr.length);
    arr.length = from < 0 ? arr.length + from : from;
    arr.push.apply(arr, rest);
    return arr;
  }

  function realTypeOf(subject) {
    var type = typeof subject;
    if (type !== 'object') {
      return type;
    }

    if (subject === Math) {
      return 'math';
    } else if (subject === null) {
      return 'null';
    } else if (Array.isArray(subject)) {
      return 'array';
    } else if (Object.prototype.toString.call(subject) === '[object Date]') {
      return 'date';
    } else if (typeof subject.toString === 'function' && /^\/.*\//.test(subject.toString())) {
      return 'regexp';
    }
    return 'object';
  }

  // http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
  function hashThisString(string) {
    var hash = 0;
    if (string.length === 0) { return hash; }
    for (var i = 0; i < string.length; i++) {
      var char = string.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  // Gets a hash of the given object in an array order-independent fashion
  // also object key order independent (easier since they can be alphabetized)
  function getOrderIndependentHash(object) {
    var accum = 0;
    var type = realTypeOf(object);

    if (type === 'array') {
      object.forEach(function (item) {
        // Addition is commutative so this is order indep
        accum += getOrderIndependentHash(item);
      });

      var arrayString = '[type: array, hash: ' + accum + ']';
      return accum + hashThisString(arrayString);
    }

    if (type === 'object') {
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          var keyValueString = '[ type: object, key: ' + key + ', value hash: ' + getOrderIndependentHash(object[key]) + ']';
          accum += hashThisString(keyValueString);
        }
      }

      return accum;
    }

    // Non object, non array...should be good?
    var stringToHash = '[ type: ' + type + ' ; value: ' + object + ']';
    return accum + hashThisString(stringToHash);
  }

  function deepDiff(lhs, rhs, changes, prefilter, path, key, stack, orderIndependent) {
    changes = changes || [];
    path = path || [];
    stack = stack || [];
    var currentPath = path.slice(0);
    if (typeof key !== 'undefined' && key !== null) {
      if (prefilter) {
        if (typeof (prefilter) === 'function' && prefilter(currentPath, key)) {
          return;
        } else if (typeof (prefilter) === 'object') {
          if (prefilter.prefilter && prefilter.prefilter(currentPath, key)) {
            return;
          }
          if (prefilter.normalize) {
            var alt = prefilter.normalize(currentPath, key, lhs, rhs);
            if (alt) {
              lhs = alt[0];
              rhs = alt[1];
            }
          }
        }
      }
      currentPath.push(key);
    }

    // Use string comparison for regexes
    if (realTypeOf(lhs) === 'regexp' && realTypeOf(rhs) === 'regexp') {
      lhs = lhs.toString();
      rhs = rhs.toString();
    }

    var ltype = typeof lhs;
    var rtype = typeof rhs;
    var i, j, k, other;

    var ldefined = ltype !== 'undefined' ||
      (stack && (stack.length > 0) && stack[stack.length - 1].lhs &&
        Object.getOwnPropertyDescriptor(stack[stack.length - 1].lhs, key));
    var rdefined = rtype !== 'undefined' ||
      (stack && (stack.length > 0) && stack[stack.length - 1].rhs &&
        Object.getOwnPropertyDescriptor(stack[stack.length - 1].rhs, key));

    if (!ldefined && rdefined) {
      changes.push(new DiffNew(currentPath, rhs));
    } else if (!rdefined && ldefined) {
      changes.push(new DiffDeleted(currentPath, lhs));
    } else if (realTypeOf(lhs) !== realTypeOf(rhs)) {
      changes.push(new DiffEdit(currentPath, lhs, rhs));
    } else if (realTypeOf(lhs) === 'date' && (lhs - rhs) !== 0) {
      changes.push(new DiffEdit(currentPath, lhs, rhs));
    } else if (ltype === 'object' && lhs !== null && rhs !== null) {
      for (i = stack.length - 1; i > -1; --i) {
        if (stack[i].lhs === lhs) {
          other = true;
          break;
        }
      }
      if (!other) {
        stack.push({ lhs: lhs, rhs: rhs });
        if (Array.isArray(lhs)) {
          // If order doesn't matter, we need to sort our arrays
          if (orderIndependent) {
            lhs.sort(function (a, b) {
              return getOrderIndependentHash(a) - getOrderIndependentHash(b);
            });

            rhs.sort(function (a, b) {
              return getOrderIndependentHash(a) - getOrderIndependentHash(b);
            });
          }
          i = rhs.length - 1;
          j = lhs.length - 1;
          while (i > j) {
            changes.push(new DiffArray(currentPath, i, new DiffNew(undefined, rhs[i--])));
          }
          while (j > i) {
            changes.push(new DiffArray(currentPath, j, new DiffDeleted(undefined, lhs[j--])));
          }
          for (; i >= 0; --i) {
            deepDiff(lhs[i], rhs[i], changes, prefilter, currentPath, i, stack, orderIndependent);
          }
        } else {
          var akeys = Object.keys(lhs);
          var pkeys = Object.keys(rhs);
          for (i = 0; i < akeys.length; ++i) {
            k = akeys[i];
            other = pkeys.indexOf(k);
            if (other >= 0) {
              deepDiff(lhs[k], rhs[k], changes, prefilter, currentPath, k, stack, orderIndependent);
              pkeys[other] = null;
            } else {
              deepDiff(lhs[k], undefined, changes, prefilter, currentPath, k, stack, orderIndependent);
            }
          }
          for (i = 0; i < pkeys.length; ++i) {
            k = pkeys[i];
            if (k) {
              deepDiff(undefined, rhs[k], changes, prefilter, currentPath, k, stack, orderIndependent);
            }
          }
        }
        stack.length = stack.length - 1;
      } else if (lhs !== rhs) {
        // lhs is contains a cycle at this element and it differs from rhs
        changes.push(new DiffEdit(currentPath, lhs, rhs));
      }
    } else if (lhs !== rhs) {
      if (!(ltype === 'number' && isNaN(lhs) && isNaN(rhs))) {
        changes.push(new DiffEdit(currentPath, lhs, rhs));
      }
    }
  }

  function observableDiff(lhs, rhs, observer, prefilter, orderIndependent) {
    var changes = [];
    deepDiff(lhs, rhs, changes, prefilter, null, null, null, orderIndependent);
    if (observer) {
      for (var i = 0; i < changes.length; ++i) {
        observer(changes[i]);
      }
    }
    return changes;
  }

  function orderIndependentDeepDiff(lhs, rhs, changes, prefilter, path, key, stack) {
    return deepDiff(lhs, rhs, changes, prefilter, path, key, stack, true);
  }

  function accumulateDiff(lhs, rhs, prefilter, accum) {
    var observer = (accum) ?
      function (difference) {
        if (difference) {
          accum.push(difference);
        }
      } : undefined;
    var changes = observableDiff(lhs, rhs, observer, prefilter);
    return (accum) ? accum : (changes.length) ? changes : undefined;
  }

  function accumulateOrderIndependentDiff(lhs, rhs, prefilter, accum) {
    var observer = (accum) ?
      function (difference) {
        if (difference) {
          accum.push(difference);
        }
      } : undefined;
    var changes = observableDiff(lhs, rhs, observer, prefilter, true);
    return (accum) ? accum : (changes.length) ? changes : undefined;
  }

  function applyArrayChange(arr, index, change) {
    if (change.path && change.path.length) {
      var it = arr[index],
        i, u = change.path.length - 1;
      for (i = 0; i < u; i++) {
        it = it[change.path[i]];
      }
      switch (change.kind) {
        case 'A':
          applyArrayChange(it[change.path[i]], change.index, change.item);
          break;
        case 'D':
          delete it[change.path[i]];
          break;
        case 'E':
        case 'N':
          it[change.path[i]] = change.rhs;
          break;
      }
    } else {
      switch (change.kind) {
        case 'A':
          applyArrayChange(arr[index], change.index, change.item);
          break;
        case 'D':
          arr = arrayRemove(arr, index);
          break;
        case 'E':
        case 'N':
          arr[index] = change.rhs;
          break;
      }
    }
    return arr;
  }

  function applyChange(target, source, change) {
    if (typeof change === 'undefined' && source && ~validKinds.indexOf(source.kind)) {
      change = source;
    }
    if (target && change && change.kind) {
      var it = target,
        i = -1,
        last = change.path ? change.path.length - 1 : 0;
      while (++i < last) {
        if (typeof it[change.path[i]] === 'undefined') {
          it[change.path[i]] = (typeof change.path[i + 1] !== 'undefined' && typeof change.path[i + 1] === 'number') ? [] : {};
        }
        it = it[change.path[i]];
      }
      switch (change.kind) {
        case 'A':
          if (change.path && typeof it[change.path[i]] === 'undefined') {
            it[change.path[i]] = [];
          }
          applyArrayChange(change.path ? it[change.path[i]] : it, change.index, change.item);
          break;
        case 'D':
          delete it[change.path[i]];
          break;
        case 'E':
        case 'N':
          it[change.path[i]] = change.rhs;
          break;
      }
    }
  }

  function revertArrayChange(arr, index, change) {
    if (change.path && change.path.length) {
      // the structure of the object at the index has changed...
      var it = arr[index],
        i, u = change.path.length - 1;
      for (i = 0; i < u; i++) {
        it = it[change.path[i]];
      }
      switch (change.kind) {
        case 'A':
          revertArrayChange(it[change.path[i]], change.index, change.item);
          break;
        case 'D':
          it[change.path[i]] = change.lhs;
          break;
        case 'E':
          it[change.path[i]] = change.lhs;
          break;
        case 'N':
          delete it[change.path[i]];
          break;
      }
    } else {
      // the array item is different...
      switch (change.kind) {
        case 'A':
          revertArrayChange(arr[index], change.index, change.item);
          break;
        case 'D':
          arr[index] = change.lhs;
          break;
        case 'E':
          arr[index] = change.lhs;
          break;
        case 'N':
          arr = arrayRemove(arr, index);
          break;
      }
    }
    return arr;
  }

  function revertChange(target, source, change) {
    if (target && source && change && change.kind) {
      var it = target,
        i, u;
      u = change.path.length - 1;
      for (i = 0; i < u; i++) {
        if (typeof it[change.path[i]] === 'undefined') {
          it[change.path[i]] = {};
        }
        it = it[change.path[i]];
      }
      switch (change.kind) {
        case 'A':
          // Array was modified...
          // it will be an array...
          revertArrayChange(it[change.path[i]], change.index, change.item);
          break;
        case 'D':
          // Item was deleted...
          it[change.path[i]] = change.lhs;
          break;
        case 'E':
          // Item was edited...
          it[change.path[i]] = change.lhs;
          break;
        case 'N':
          // Item is new...
          delete it[change.path[i]];
          break;
      }
    }
  }

  function applyDiff(target, source, filter) {
    if (target && source) {
      var onChange = function (change) {
        if (!filter || filter(target, source, change)) {
          applyChange(target, source, change);
        }
      };
      observableDiff(target, source, onChange);
    }
  }

  Object.defineProperties(accumulateDiff, {

    diff: {
      value: accumulateDiff,
      enumerable: true
    },
    orderIndependentDiff: {
      value: accumulateOrderIndependentDiff,
      enumerable: true
    },
    observableDiff: {
      value: observableDiff,
      enumerable: true
    },
    orderIndependentObservableDiff: {
      value: orderIndependentDeepDiff,
      enumerable: true
    },
    orderIndepHash: {
      value: getOrderIndependentHash,
      enumerable: true
    },
    applyDiff: {
      value: applyDiff,
      enumerable: true
    },
    applyChange: {
      value: applyChange,
      enumerable: true
    },
    revertChange: {
      value: revertChange,
      enumerable: true
    },
    isConflict: {
      value: function () {
        return typeof $conflict !== 'undefined';
      },
      enumerable: true
    }
  });

  // hackish...
  accumulateDiff.DeepDiff = accumulateDiff;
  // ...but works with:
  // import DeepDiff from 'deep-diff'
  // import { DeepDiff } from 'deep-diff'
  // const DeepDiff = require('deep-diff');
  // const { DeepDiff } = require('deep-diff');

  root.DeepDiff = accumulateDiff;
  return accumulateDiff;
}));

},{}],6:[function(require,module,exports){
/*!
 * for-in <https://github.com/jonschlinkert/for-in>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

module.exports = function forIn(obj, fn, thisArg) {
  for (var key in obj) {
    if (fn.call(thisArg, obj[key], key, obj) === false) {
      break;
    }
  }
};

},{}],7:[function(require,module,exports){
/*!
 * for-own <https://github.com/jonschlinkert/for-own>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var forIn = require('for-in');
var hasOwn = Object.prototype.hasOwnProperty;

module.exports = function forOwn(obj, fn, thisArg) {
  forIn(obj, function(val, key) {
    if (hasOwn.call(obj, key)) {
      return fn.call(thisArg, obj[key], key, obj);
    }
  });
};

},{"for-in":6}],8:[function(require,module,exports){
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var isObject = require('isobject');

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

module.exports = function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
};

},{"isobject":9}],9:[function(require,module,exports){
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

module.exports = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

},{}],10:[function(require,module,exports){
var toString = Object.prototype.toString;

module.exports = function kindOf(val) {
  if (val === void 0) return 'undefined';
  if (val === null) return 'null';

  var type = typeof val;
  if (type === 'boolean') return 'boolean';
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'symbol') return 'symbol';
  if (type === 'function') {
    return isGeneratorFn(val) ? 'generatorfunction' : 'function';
  }

  if (isArray(val)) return 'array';
  if (isBuffer(val)) return 'buffer';
  if (isArguments(val)) return 'arguments';
  if (isDate(val)) return 'date';
  if (isError(val)) return 'error';
  if (isRegexp(val)) return 'regexp';

  switch (ctorName(val)) {
    case 'Symbol': return 'symbol';
    case 'Promise': return 'promise';

    // Set, Map, WeakSet, WeakMap
    case 'WeakMap': return 'weakmap';
    case 'WeakSet': return 'weakset';
    case 'Map': return 'map';
    case 'Set': return 'set';

    // 8-bit typed arrays
    case 'Int8Array': return 'int8array';
    case 'Uint8Array': return 'uint8array';
    case 'Uint8ClampedArray': return 'uint8clampedarray';

    // 16-bit typed arrays
    case 'Int16Array': return 'int16array';
    case 'Uint16Array': return 'uint16array';

    // 32-bit typed arrays
    case 'Int32Array': return 'int32array';
    case 'Uint32Array': return 'uint32array';
    case 'Float32Array': return 'float32array';
    case 'Float64Array': return 'float64array';
  }

  if (isGeneratorObj(val)) {
    return 'generator';
  }

  // Non-plain objects
  type = toString.call(val);
  switch (type) {
    case '[object Object]': return 'object';
    // iterators
    case '[object Map Iterator]': return 'mapiterator';
    case '[object Set Iterator]': return 'setiterator';
    case '[object String Iterator]': return 'stringiterator';
    case '[object Array Iterator]': return 'arrayiterator';
  }

  // other
  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
};

function ctorName(val) {
  return val.constructor ? val.constructor.name : null;
}

function isArray(val) {
  if (Array.isArray) return Array.isArray(val);
  return val instanceof Array;
}

function isError(val) {
  return val instanceof Error || (typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number');
}

function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === 'function'
    && typeof val.getDate === 'function'
    && typeof val.setDate === 'function';
}

function isRegexp(val) {
  if (val instanceof RegExp) return true;
  return typeof val.flags === 'string'
    && typeof val.ignoreCase === 'boolean'
    && typeof val.multiline === 'boolean'
    && typeof val.global === 'boolean';
}

function isGeneratorFn(name, val) {
  return ctorName(name) === 'GeneratorFunction';
}

function isGeneratorObj(val) {
  return typeof val.throw === 'function'
    && typeof val.return === 'function'
    && typeof val.next === 'function';
}

function isArguments(val) {
  try {
    if (typeof val.length === 'number' && typeof val.callee === 'function') {
      return true;
    }
  } catch (err) {
    if (err.message.indexOf('callee') !== -1) {
      return true;
    }
  }
  return false;
}

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */

function isBuffer(val) {
  if (val.constructor && typeof val.constructor.isBuffer === 'function') {
    return val.constructor.isBuffer(val);
  }
  return false;
}

},{}],11:[function(require,module,exports){
'use strict';

var isObject = require('is-extendable');
var forIn = require('for-in');

module.exports = function mixin(target, objects) {
  if (!isObject(target)) {
    throw new TypeError('expected the first argument to be an object');
  }

  var len = arguments.length;
  var idx = 0;

  while (++idx < len) {
    copy(target, arguments[idx]);
  }
  return target;
};

/**
 * copy properties from the source object to the
 * target object. We don't use `Object.keys` here, since
 * "mixin" also adds non-enumerable keys.
 *
 * @param  {*} `value`
 * @param  {String} `key`
 */

function copy(target, obj) {
  if (isObject(obj)) {
    forIn(obj, function(value, key) {
      target[key] = value;
    });
  }
}

},{"for-in":6,"is-extendable":12}],12:[function(require,module,exports){
/*!
 * is-extendable <https://github.com/jonschlinkert/is-extendable>
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var isPlainObject = require('is-plain-object');

module.exports = function isExtendable(val) {
  return isPlainObject(val) || typeof val === 'function' || Array.isArray(val);
};

},{"is-plain-object":8}],13:[function(require,module,exports){
/*!
 * shallow-clone <https://github.com/jonschlinkert/shallow-clone>
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var isObject = require('is-extendable');
var mixin = require('mixin-object');
var typeOf = require('kind-of');

/**
 * Shallow copy an object, array or primitive.
 *
 * @param  {any} `val`
 * @return {any}
 */

function clone(val) {
  var type = typeOf(val);
  if (clone.hasOwnProperty(type)) {
    return clone[type](val);
  }
  return val;
}

clone.array = function cloneArray(arr) {
  return arr.slice();
};

clone.date = function cloneDate(date) {
  return new Date(+date);
};

clone.object = function cloneObject(obj) {
  if (isObject(obj)) {
    return mixin({}, obj);
  } else {
    return obj;
  }
};

clone.map = function cloneMap(val) {
  return new Map(val);
};

clone.regexp = function cloneRegExp(re) {
  var flags = '';
  flags += re.multiline ? 'm' : '';
  flags += re.global ? 'g' : '';
  flags += re.ignoreCase ? 'i' : '';
  return new RegExp(re.source, flags);
};

clone.set = function cloneSet(val) {
  return new Set(val);
};

/**
 * Expose `clone`
 */

module.exports = clone;

},{"is-extendable":14,"kind-of":10,"mixin-object":11}],14:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"is-plain-object":8}]},{},[1,2,3])(3)
});
