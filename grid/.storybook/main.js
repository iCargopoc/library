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
    presets: ["@storybook/addon-docs/preset"]
};
