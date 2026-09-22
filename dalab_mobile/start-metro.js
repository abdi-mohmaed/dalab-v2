#!/usr/bin/env node

const Metro = require('metro');
const path = require('path');

const config = {
    projectRoot: __dirname,
    watchFolders: [path.resolve(__dirname, '..')],
    resolver: {
        nodeModulesPaths: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '../node_modules'),
        ],
    },
};

Metro.runMetro(config).then(server => {
    console.log('\n✅ Metro bundler is running on http://localhost:8081\n');
});
