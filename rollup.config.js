/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

'use strict';

/* Reference: https://medium.com/@kelin2025/so-you-wanna-use-es6-modules-714f48b3a953 */
var commonjs = require('rollup-plugin-commonjs');
var resolve = require('rollup-plugin-node-resolve');

var dependencies = Object.keys(require('./package.json').dependencies).concat('events');

export default {
    rollup: require('rollup'),

    input: './built/index.js',
    output: {
        format: 'cjs',
        sourcemap: false,
    },
    plugins: [
        commonjs(),
        resolve({ preferBuiltins: true })
    ],
    external: dependencies
};
  