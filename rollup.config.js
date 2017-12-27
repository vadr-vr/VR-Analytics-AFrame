import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
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
        json(),
        resolve({
            jsnext: true,
            browser: true
        }),
        commonjs({
            globals: {
                // crypto: 'crypto',
                // global: 'window'
            }
        })
    ],
    globals: {
    },
    banner: '/* Copyright (c) 2017 VadR Network Pvt. Ltd. */',
};
