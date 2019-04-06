import * as React from 'react';
import { MainMapViewState } from '../components/MainMapView/MainMapView';
import { renderToString } from 'react-dom/server';
import PopUpCard from '../components/PopUpCard/PopUpCard';
import { Meeting } from '../Definitions';
import * as mapboxgl from 'mapbox-gl';
const mapboxKey = 'pk.eyJ1IjoibWljYWhiYWxlcyIsImEiOiJjaXg4OTlrNHgwMDAyMnlvNDRleXBrdGNrIn0.d3eUGWL--AriB6n5MXy5TA';
(mapboxgl as any).accessToken = mapboxKey;

export interface BoundsPoints {
    highestLat: number;
    highestLng: number;
    lowestLat: number;
    lowestLng: number;
}

/**
 * createMap initializes the MapBox Map object. This is where the process starts.
 */

export const createMap = () => (
    new mapboxgl.Map({
        container: 'primary-map',
        style: 'mapbox://styles/micahbales/cjnx84jgd0viy2sojoy624r6k',
        center: { lng: -98.585522, lat: 39.8333333 },
        zoom: 10
    })
);

/**
 * setActiveCriteria checks to see which search criteria have been activated.
 * A key string is returned for every active criterion.
 */

export const setActiveCriteria = (state: MainMapViewState) => {
    const activeCriteria = [];

    for (const criterion in state.searchCriteria) {
        if (state.searchCriteria[criterion]) {
            activeCriteria.push(criterion);
        }
    }
    return activeCriteria;
}

/**
 * setBounds finds the most southwesterly and northeasterly points from a group of markers.
 * These two extremes are used to create a bounding box, which defines the dimensions of
 * our map that are shown in the viewport.
 */

const setBounds = (meetings: Meeting[], map: any) => {
    if (!meetings.length) return;

    const boundsPoints = meetings.reduce((acc, meeting: Meeting) => {
        const updatedPoints: BoundsPoints = {
            highestLat: meeting.latitude > acc.highestLat ? meeting.latitude : acc.highestLat,
            highestLng: meeting.longitude > acc.highestLng ? meeting.longitude : acc.highestLng,
            lowestLat: meeting.latitude < acc.lowestLat ? meeting.latitude : acc.lowestLat,
            lowestLng: meeting.longitude < acc.lowestLng ? meeting.longitude : acc.lowestLng
        };
        return Object.assign(acc, updatedPoints);
    }, { highestLat: -Infinity, highestLng: -Infinity, lowestLat: Infinity, lowestLng: Infinity });

    const sw: mapboxgl.LngLatLike = { lng: boundsPoints.lowestLng, lat: boundsPoints.lowestLat };
    const ne: mapboxgl.LngLatLike = { lng: boundsPoints.highestLng, lat: boundsPoints.highestLat };
    const bounds = new mapboxgl.LngLatBounds(sw, ne);
    const boundsOptions = {
        // Add padding around our bounds so markers aren't on the edges
        padding: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        }
    }
    // Center map on markers
    map.fitBounds(bounds, boundsOptions);
}

/**
 * getMarkers takes a collection of meetings and creates a set of markers.
 * The markers are each given their own MapBox popup window, with details about that meeting.
 * Finally, the markers are bounded (see setBounds for details).
 */

export const getMarkers = (meetings: Meeting[], map: any) => {
    let marker;
    let popup;
    const markers: mapboxgl.Marker[] = [];
    meetings.forEach((meeting: Meeting) => {
        popup = new mapboxgl.Popup();
        popup.setHTML(
            renderToString(<PopUpCard meeting={ meeting } />)
        );

        marker = new mapboxgl.Marker()
            .setLngLat([meeting.longitude, meeting.latitude])
            .setPopup(popup)
            .addTo(map);

        markers.push(marker);
    });

    setBounds(meetings, map);

    return markers;
}

/**
 * removeMarkers removes markers from the map.
 */

export const removeMarkers = (markers: mapboxgl.Marker[]) =>
    markers.forEach((marker) => marker.remove());

/**
 * filterMeetings checks a set of meetings against search criteria, 
 * returning only those that meet *all* of the criteria.
 */

export const filterMeetings = async (state: MainMapViewState) => {
    // Only search results against actively selected criteria
    if (state.activeCriteria.length < 1) return state.meetings;

    // Filter for meetings that match all active criteria
    return state.meetings.filter((meeting: Meeting) => {
        // Filter out yearly meetings
        if (meeting.yearly_meeting.length < 1 && !state.showYms) return false;

        let criteriaSatisfied = 0;
        for (const key of state.activeCriteria) {
            // Handle string/null values
            if (typeof (meeting[key]) !== 'object') {
                if (String(meeting[key]).includes(state.searchCriteria[key]) ||
                    state.searchCriteria[key].includes(String(meeting[key]))) {
                    criteriaSatisfied += 1;
                    if (criteriaSatisfied >= state.activeCriteria.length) return true;
                }
            // Handle array values
            } else if (Array.isArray(meeting[key]) && meeting[key].length > 0) {
                for (const ym of meeting[key]) {
                    if (ym.title === state.searchCriteria[key]) {
                        criteriaSatisfied += 1;
                        if (criteriaSatisfied >= state.activeCriteria.length) return true;
                    }
                }
            }
        }
        return false;
    });
}
