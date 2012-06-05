({
    appDir: "./",
    baseUrl: "./",
    dir: "../gen/js",
    paths: {
        jquery: 'lib/jquery.min',
        //underscore: 'lib/lodash.min',
        underscore: 'lib/underscore',
        memphis: 'lib/memphis/memphis'
    },
    //shim: {
    //    'lib/plugins/pjax': ['jquery'],
    //    'lib/plugins/waypoints': ['jquery']
    //},
    findNestedDependencies: true,
    //optimize: "none",
    modules: [
        { name: "main" }
    ]
})