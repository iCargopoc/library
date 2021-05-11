module.exports = {
    stories: ["../__stories__/*.stories.(js|mdx)"],
    addons: [
        {
            name: "@storybook/addon-docs/register",
            options: {
                configureJSX: true,
                babelOptions: {},
                sourceLoaderOptions: null
            }
        },
        "@storybook/addon-actions/register",
        "@storybook/addon-knobs/register",
        "@panosvoudouris/addon-versions/register"
    ],
    presets: ["@storybook/addon-docs/preset"],
    webpackFinal: async (config, { configType }) => {
        // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
        // You can change the configuration based on that.
        // 'PRODUCTION' is used when building the static version of storybook.

        // Make whatever fine-grained changes you need
        config.module.rules.push({
            test: /\.(scss)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: "style-loader",
                    options: {
                        injectType: "lazySingletonStyleTag"
                    }
                },
                {
                    loader: "css-loader",
                    options: {
                        modules: false
                    }
                },
                {
                    loader: "sass-loader",
                    options: {
                        implementation: require("sass")
                    }
                }
            ]
        });
        config.module.rules.push({
            test: /\.(scss)$/,
            include: /node_modules/,
            use: [
                {
                    loader: "style-loader"
                },
                {
                    loader: "css-loader",
                    options: {
                        modules: false
                    }
                },
                {
                    loader: "sass-loader",
                    options: {
                        implementation: require("sass")
                    }
                }
            ]
        });

        // Return the altered config
        return config;
    }
};
