/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

// tslint:disable:no-string-literal

require('dotenv').config();

import * as API from '..';

const debug = require('debug')('pxt-cloud:test');

function test(datarepo: API.DataRepo) {
    /* do nothing */
}

test(new API.DataRepo());
