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
    Events["WorldSyncData"] = "sync data";
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
    DataRepo.encode = function (data) {
        return msgpackLite.encode(data);
    };
    DataRepo.decode = function (buffer) {
        return msgpackLite.decode(buffer);
    };
    DataRepo.applyDataDiff = function (current, diff_) {
        diff_.forEach(function (d) { return deepDiff.applyChange(current, current, DataRepo.decode(d)); });
        return current;
    };
    DataRepo.calcDataDiff = function (lhs, rhs) {
        var diff_ = deepDiff.diff(lhs, rhs) || [];
        return diff_.map(function (d) { return DataRepo.encode(d); });
    };
    DataRepo._cloneSourceData = function (source) {
        return source.cloner ? source.cloner(source.data, cloneDeep) : cloneDeep(source.data);
    };
    DataRepo.prototype.addDataSource = function (name, source) {
        var synceddata = this._synceddata[name];
        if (!synceddata) {
            this._synceddata[name] = { source: source, current: DataRepo._cloneSourceData(source) };
        }
        return !!synceddata;
    };
    DataRepo.prototype.isDataSource = function (name) {
        return !!this._synceddata[name];
    };
    DataRepo.prototype.removeDataSource = function (name) {
        return delete this._synceddata[name];
    };
    DataRepo.prototype.getData = function (name) {
        var synceddata = this._synceddata[name];
        if (!synceddata || !synceddata.current) {
            return undefined;
        }
        return synceddata.current;
    };
    DataRepo.prototype.calcDataDiff = function (name) {
        var synceddata = this._synceddata[name];
        if (!synceddata || !synceddata.source) {
            return undefined;
        }
        var current = DataRepo._cloneSourceData(synceddata.source);
        var diff_ = DataRepo.calcDataDiff(synceddata.current, current);
        synceddata.current = current;
        return diff_;
    };
    DataRepo.prototype.setData = function (name, data) {
        var synceddata = this._synceddata[name];
        if (synceddata) {
            synceddata.current = data;
        }
        else {
            synceddata = this._synceddata[name] = { current: data };
        }
    };
    DataRepo.prototype.applyDataDiff = function (name, diff_) {
        var synceddata = this._synceddata[name];
        if (!synceddata) {
            synceddata = this._synceddata[name] = { current: {} };
        }
        DataRepo.applyDataDiff(synceddata.current, diff_);
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
