'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var cloneDeep = _interopDefault(require('clone-deep'));
var deepDiff = _interopDefault(require('deep-diff'));
var msgpackLite = _interopDefault(require('msgpack-lite'));

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
    Events["WorldSyncDataDiff"] = "sync data diff";
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
    DataRepo.prototype.syncDataSource = function (name) {
        var synceddata = this._synceddata[name];
        if (!synceddata || !synceddata.source) {
            return null;
        }
        var current = synceddata.source.cloner ? synceddata.source.cloner(synceddata.source.data, cloneDeep) : cloneDeep(synceddata.source.data);
        var diff_ = deepDiff.diff(synceddata.current, current) || [];
        synceddata.current = current;
        return diff_.map(function (d) { return msgpackLite.encode(d); });
    };
    DataRepo.prototype.syncDataDiff = function (name, diff_) {
        var synceddata = this._synceddata[name];
        if (!synceddata) {
            synceddata = this._synceddata[name] = { current: {} };
        }
        var current = synceddata.current;
        diff_.forEach(function (d) { return deepDiff.applyChange(synceddata.current, current, msgpackLite.decode(d)); });
        return diff_;
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
