const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        'popup': path.join(__dirname, 'src/popup.ts'),
        'content-script': path.join(__dirname, 'src/content-script.ts'),
        'background': path.join(__dirname, 'src/background.ts')        
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'scripts/[name].js'
    },
    module: {
        loaders: [{
            exclude: /node_modules/,
            test: /\.tsx?$/,
            loader: 'ts-loader'
        }]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new CopyWebpackPlugin([
            { 
                context: 'src',
                from: '**/*', 
                to: '', 
                ignore: ['**/*.ts']}            
        ])
    ]
};
