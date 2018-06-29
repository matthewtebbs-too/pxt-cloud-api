'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var cloneDeep = _interopDefault(require('clone-deep'));
var deepDiff = _interopDefault(require('deep-diff'));

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var api = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
var Events;
(function (Events) {
    Events["ChatNewMessage"] = "new message";
    Events["UserAddSelf"] = "add self";
    Events["UserLeft"] = "user left";
    Events["UserJoined"] = "user joined";
    Events["UserRemoveSelf"] = "remove self";
    Events["UserSelfInfo"] = "self info";
})(Events = exports.Events || (exports.Events = {}));
});

var api$1 = unwrapExports(api);
var api_1 = api.Events;

var api$2 = /*#__PURE__*/Object.freeze({
	default: api$1,
	__moduleExports: api,
	Events: api_1
});

var datarepo = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


var DataRepo = (function () {
    function DataRepo() {
        this._synceddata = {};
    }
    DataRepo.prototype.addDataSource = function (name, source_) {
        var data = this._synceddata[name];
        if (!data) {
            this._synceddata[name] = { source: source_ };
        }
        return !!data;
    };
    DataRepo.prototype.removeDataSource = function (name) {
        return delete this._synceddata[name];
    };
    DataRepo.prototype.currentlySynced = function (name) {
        var data = this._synceddata[name];
        if (!data) {
            return null;
        }
        return data.latest || null;
    };
    DataRepo.prototype.syncToData = function (name) {
        var data = this._synceddata[name];
        if (!data) {
            return null;
        }
        var latest = data.source.cloner ? data.source.cloner(data.source, cloneDeep) : cloneDeep(data.source);
        var diff_ = deepDiff.diff(data.latest || {}, latest) || [];
        data.latest = latest;
        return diff_;
    };
    DataRepo.prototype.applyDiffs = function (name, diff) {
        var data = this._synceddata[name];
        if (!data) {
            return false;
        }
        if (Array.isArray(diff)) {
            diff.forEach(function (diff_) { return deepDiff.applyChange(data.latest, data.latest, diff_); });
        }
        else {
            deepDiff.applyChange(data.latest, data.latest, diff);
        }
        return true;
    };
    return DataRepo;
}());
exports.DataRepo = DataRepo;
});

var datarepo$1 = unwrapExports(datarepo);
var datarepo_1 = datarepo.DataRepo;

var datarepo$2 = /*#__PURE__*/Object.freeze({
	default: datarepo$1,
	__moduleExports: datarepo,
	DataRepo: datarepo_1
});

var require$$0 = ( api$2 && api$1 ) || api$2;

var require$$1 = ( datarepo$2 && datarepo$1 ) || datarepo$2;

var built = createCommonjsModule(function (module, exports) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require$$0);
__export(require$$1);
});

var index = unwrapExports(built);

module.exports = index;
