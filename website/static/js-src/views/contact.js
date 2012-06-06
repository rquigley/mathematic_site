define([
    'jquery',
    'memphis'
], function($, core) {
    "use strict";

    var map;

    var mapVisible = false;
    var mapZoom = 0;

    function init() {
        window.googleMapCallback = onMapLibLoaded;

        core.subscribe('window.breakpoint', onBreakpoint);
        onBreakpoint(core.getViewport());

        if (true === mapVisible) {
            require(["http://maps.google.com/maps/api/js?sensor=false&callback=googleMapCallback"]);
            //if (window.hasOwnProperty('google') && window.google.hasOwnProperty('maps')) {
            //    $("#contact-map").empty();
            //    onMapLibLoaded();
            //} else {
            //    require(["googlemaps"], onMapLibLoaded);
            //}
        }
    }

    function onBreakpoint(vp) {
        var bp = vp.currBreakpoint;
        if (bp < 480) {
            mapVisible = false;
            return;
        }
        mapVisible = true;

        if (vp.currBreakpoint >= 680) {
            mapZoom = 9;
        } else {
            mapZoom = 8;
        }
    };

    function onMapLibLoaded() {
        var mapStyle = [
            {
                featureType: "road",
                stylers: [
                    { visibility: "off" }
                ]
            },{
                featureType: "landscape",
                stylers: [
                    { visibility: "off" }
                ]
            },{
                featureType: "poi",
                stylers: [
                    { visibility: "off" }
                ]
            },{
                featureType: "administrative",
                stylers: [
                    { visibility: "off" }
                ]
            },{
                featureType: "transit",
                stylers: [
                    { visibility: "off" }
                ]
            },{
                featureType: "water",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            },{
                stylers: [
                    { saturation: -56 }
              ]
            }
        ];
        var latLng = new google.maps.LatLng(40.88, -73.2);
        var opts = {
            zoom: mapZoom,
            center: latLng,
            streetViewControl: false,
            mapTypeControl: false,
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'mm_style']
        };
        map = new google.maps.Map(document.getElementById("contact-map"), opts);

        var styledMapOptions = {
            name: "MM"
        };
        var styledMapType = new google.maps.StyledMapType(mapStyle, styledMapOptions);

        map.mapTypes.set('mm_style', styledMapType);
        map.setMapTypeId('mm_style');

        var image = new google.maps.MarkerImage('/static/img/map_marker.png',
            new google.maps.Size(32, 32),
            new google.maps.Point(0,0),
            new google.maps.Point(16, 16)
        );
        var marker1 = new google.maps.Marker({
            position: new google.maps.LatLng(41.096482, -72.366392),
            map: map,
            icon: image
        });
        var marker2 = new google.maps.Marker({
            position: new google.maps.LatLng(40.753139, -73.974896),
            map: map,
            icon: image
        });
    }

    function unregister() {
        delete window.googleMapCallback;

        delete this.map;
    }

    return {
        init: init,
        unregister: unregister
    };
});


