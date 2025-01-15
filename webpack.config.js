const path = require('path');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                        plugins: [
                            ['module-resolver', {
                                root: ['./src'],
                                extensions: ['.js', '.jsx', '.ts', '.tsx']
                            }]
                        ]
                    }
                }
            }
        ]
    }
};