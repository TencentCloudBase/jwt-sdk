import copy from 'rollup-plugin-copy';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default [
    {
        input: 'src/mp/index.js',
        output: {
            name: 'TcbClientWS',
            file: 'dist/tcb-websocket-mp-sdk/index.js',
            format: 'es'
        },
        plugins: [
            babel(),
            resolve(), // so Rollup can find `ms`
            commonjs(), // so Rollup can convert `ms` to an ES module
            copy({
                'src/mp/polyfill.js': 'dist/tcb-websocket-mp-sdk/polyfill.js',
                // 'src/node/index.js': 'dist/tcb-websocket-node-sdk/index.js',
                // 'src/functions/auth': 'dist/functions',
            })
        ]
    },
    {
        input: 'src/javascript/index.js',
        output: {
            name: 'TcbClientWS',
            file: 'dist/tcb-websocket-javascript-sdk/index.js',
            format: 'umd'
        },
        plugins: [
            babel(),
            resolve(), // so Rollup can find `ms`
            commonjs(), // so Rollup can convert `ms` to an ES module
        ]
    },
    {
        input: 'src/node/index.js',
        output: {
            name: 'TcbServerWS',
            file: 'dist/tcb-websocket-node-sdk/index.js',
            format: 'cjs'
        },
        plugins: [
            // babel(),
            resolve(), // so Rollup can find `ms`
            commonjs(), // so Rollup can convert `ms` to an ES module
        ]
    },
];
