({
    //appDir: "./",
    //baseUrl: "./",
    dir: "../gen/js",
    paths: {
        jquery: 'lib/jquery.min',
        //jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
        underscore: 'lib/lodash.min',
        //underscore: 'lib/underscore',
        memphis: 'lib/memphis/memphis',
        //underscore: 'lib/underscore',
        //mediator: 'lib/aura/mediator',
        //text: 'lib/require/text'
        pjax: 'lib/plugins/pjax',
        waypoints: 'lib/plugins/waypoints'
    },
    shim: {
        'pjax': ['jquery'],
        'waypoints': ['jquery']
    },
    findNestedDependencies: true,
    removeCombined: true,
    useStrict: false,
    //optimize: "none",
    modules: [
        { name: "main" }
    ]
})