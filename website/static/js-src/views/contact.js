/* global google */
import $ from 'jquery';
import core from 'memphis';

import { scriptLoad } from '../util';

let map;

let mapVisible = false;
let mapZoom = 0;

function init() {
    window.googleMapCallback = onMapLibLoaded;

    core.subscribe('window.breakpoint', onBreakpoint);
    onBreakpoint(core.getViewport());

    $('#contact-map').on('click', function() {
        $(this).addClass('active');
        if (mapVisible) {
            scriptLoad(['http://maps.google.com/maps/api/js?sensor=false&callback=googleMapCallback']);
        }
    });
}

function onBreakpoint(vp) {
    let bp = vp.currBreakpoint;
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
}

function onMapLibLoaded() {
    let mapStyle = [
        {
            featureType: 'road',
            stylers: [
                { visibility: 'off' }
            ]
        }, {
            featureType: 'landscape',
            stylers: [
                { visibility: 'off' }
            ]
        }, {
            featureType: 'poi',
            stylers: [
                { visibility: 'off' }
            ]
        }, {
            featureType: 'administrative',
            stylers: [
                { visibility: 'off' }
            ]
        }, {
            featureType: 'transit',
            stylers: [
                { visibility: 'off' }
            ]
        }, {
            featureType: 'water',
            elementType: 'labels',
            stylers: [
                { visibility: 'off' }
            ]
        }, {
            stylers: [
                { saturation: -56 }
            ]
        }
    ];
    let latLng = new google.maps.LatLng(40.88, -73.2);
    let opts = {
        zoom: mapZoom,
        center: latLng,
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'mm_style']
    };
    map = new google.maps.Map(document.getElementById('contact-map'), opts);

    let styledMapOptions = {
        name: 'MM'
    };
    let styledMapType = new google.maps.StyledMapType(mapStyle, styledMapOptions);

    map.mapTypes.set('mm_style', styledMapType);
    map.setMapTypeId('mm_style');

    let image = new google.maps.MarkerImage('/static/img/map_marker.png',
        new google.maps.Size(32, 32),
        new google.maps.Point(0, 0),
        new google.maps.Point(16, 16)
    );
    new google.maps.Marker({
        position: new google.maps.LatLng(41.096482, -72.366392),
        map,
        icon: image
    });
    new google.maps.Marker({
        position: new google.maps.LatLng(40.753139, -73.974896),
        map,
        icon: image
    });
}

function unregister() {
    core.unsubscribe('window.breakpoint', onBreakpoint);
    delete window.googleMapCallback;

    delete this.map;
}

export default {
    init,
    unregister,
};
