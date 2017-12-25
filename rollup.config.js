import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import json from 'rollup-plugin-json';
export default {
    input: './index.js',
    indent: '\t',
    output: [
        {
            format: 'umd',
            name: 'VADR',
            file: 'build/vadr-aframe.js'
        }
    ],
    plugins: [
        // json(),
        resolve({
            jsnext: true,
            browser: true
        }),
        builtins(),
        commonjs({
            globals: {
                // crypto: 'crypto',
                // global: 'window'
            }
        })
    ],
    globals: {
        crypto: 'crypto'
    },
    banner: '/* Copyright (c) 2017 VadR Network Pvt. Ltd. */',
};
