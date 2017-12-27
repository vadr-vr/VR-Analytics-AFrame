import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';
import babel from 'rollup-plugin-babel';
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
        }),
        babel({
            exclude: 'node_modules/**',
        }),
        uglify({
            output: {
                comments: function(node, comment) {
                    var text = comment.value;
                    if (text == ' Copyright (c) 2017 VadR Network Pvt. Ltd. ')
                        return true;
                    else
                        return false;
                }
            }
        }, minify)
    ],
    globals: {
    },
    banner: '/* Copyright (c) 2017 VadR Network Inc. */',
};
