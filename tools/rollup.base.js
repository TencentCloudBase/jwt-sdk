import copy from 'rollup-plugin-copy';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default [
    {
        input: 'src/mp/index.js',
        output: {
            name: 'TcbJwt',
            file: 'dist/jwt-mp-sdk/index.js',
            format: 'es'
        },
        plugins: [
            babel(),
            resolve(), // so Rollup can find `ms`
            commonjs(), // so Rollup can convert `ms` to an ES module
            copy({
                'src/mp/polyfill.js': 'dist/jwt-mp-sdk/polyfill.js'
            })
        ]
    },
    {
        input: 'src/javascript/index.js',
        output: {
            name: 'TcbJwt',
            file: 'dist/jwt-js-sdk/index.js',
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
            name: 'TcbJwt',
            file: 'dist/jwt-node-sdk/index.js',
            format: 'cjs',
        },
        plugins: [
            commonjs(),
        ]
    },
];
