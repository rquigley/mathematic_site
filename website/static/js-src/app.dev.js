requirejs.config({
    //appDir: "./",
    paths: {
        jquery: 'lib/jquery',
        //jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
        underscore: 'lib/lodash.min',
        //underscore: 'lib/underscore',
        memphis: 'lib/memphis/memphis',
        //underscore: 'lib/underscore',
        //mediator: 'lib/aura/mediator',
        //text: 'lib/require/text'
        pjax: 'lib/plugins/pjax',
        waypoints: 'lib/plugins/waypoints'
    }
});

require(["main"]);
