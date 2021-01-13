module.exports = {
    moduleNameMapper: {
        "\\.(css|scss)$": "@neo/style-proxy-loader/lib/styleMock.js",
        "\\@neo-ui/images$": "<rootDir>/__mocks__/imageMock.js"
    }
};
