module.exports = {
    configureWebpack:{
        devServer: {
            disableHostCheck: true,
            proxy:{
                '/api':{
                    target:'http://localhost:8081',
                },
            },
        },
    },
}