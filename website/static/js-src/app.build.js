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
        waypoints: 'lib/plugins/waypoints',
        transit: 'lib/plugins/transit',
        imagesloaded: 'lib/plugins/imagesloaded.min'
    },
    shim: {
        'pjax': ['jquery'],
        'waypoints': ['jquery'],
        'transit': ['jquery'],
        'imagesloaded': ['jquery']
    },
    findNestedDependencies: true,
    removeCombined: true,
    useStrict: false,
    //optimize: "none",
    modules: [
        { name: "main" }
    ]
})