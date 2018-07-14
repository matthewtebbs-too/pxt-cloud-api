/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

// tslint:disable:no-string-literal

require('dotenv').config();

import * as API from '..';

const debug = require('debug')('pxt-cloud:test');

function test(datarepo: API.DataRepo) {
    const data = {
        ary: [5, 6],
        count: 0,
        strct: {
            a: 'hello',
            b: 5,
        },
    };

    const filter = (path: string[], key: string) => {
        debug(path);
        debug(key);

        return -1 !== ['strct'].indexOf(key);
    };

    datarepo.setDataSource('test', { data, filter });

    debug(datarepo.calcDataDiff('test'));

    debug(API.DataRepo.cloneData(data));
}

test(new API.DataRepo());
