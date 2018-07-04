/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

// tslint:disable:no-string-literal

require('dotenv').config();

import * as API from '..';

const debug = require('debug')('pxt-cloud:test');

function test(datarepo: API.DataRepo) {
    const name = 'test', nameclone = `${name}_clone`;
    const testdata = {}, testdataClone = {};

    datarepo.addDataSource(name, { data: testdata });
    datarepo.addDataSource(nameclone, { data: testdataClone });

    const accumdiffs: API.DataDiff[] = [];
    const localSyncData = () => {
        const diffs = datarepo.syncDataSource(name);
        if (diffs && diffs.length > 0) {
            accumdiffs.push(...diffs);
            debug(diffs);
        }
    };

    localSyncData();

    testdata['ary'] = [1, 2];

    localSyncData();

    testdata['ary'].push(1234);

    localSyncData();

    if (datarepo.syncDataDiff(nameclone, accumdiffs)) {
        debug(testdataClone);
    } else {
        debug('failed DataRepo.applyDataDiffs');
    }
}

test(new API.DataRepo());
