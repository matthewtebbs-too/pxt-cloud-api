/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

require('dotenv').config();

import * as Lo from 'lodash';
import * as API from '..';

const debug = require('debug')('pxt-cloud:test');

function test(datarepo: API.DataRepo) {
    const data = {
        a: 10,
        strct: {
            b: 10,
        },
        xyz: 'foobar',
    };

    const dataPicked = Lo.pickBy(data, (value: any, key: string) => {
        debug(`${key} ${value}`);
        return true;
    });
    dataPicked.xyz = 'wobble';
    debug(dataPicked);
    debug(data);
}

test(new API.DataRepo());
