// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],

    "lintOnSave": false,

    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'ru',
            localeDir: 'locales',
            enableInSFC: true
        },
    },
    devServer: {
        disableHostCheck: true
    },
}
