import * as THREE from 'three';

import GoogleMaps from '../../../GoogleMaps';
import Instagram from '../../../Instagram';
import PredictHQ from '../../../PredictHQ';
import {
    GOOGLE_PLACES_API_KEY,
    PREDICTHQ_ACCESS_TOKEN,
    GEOMETRIES,
    MATERIALS
} from '../constants';
import { getDistance, getCameraPosition, calibrateObject } from '../utils';
import { addObjects } from './ar';

export const TOGGLE_MAP = 'hud/TOGGLE_MAP';
export const GOOGLE_MAPS_NEARBY_SEARCH = 'hud/GOOGLE_MAPS_NEARBY_SEARCH';
export const INSTAGRAM_LOCATION_MEDIA_SEARCH =
    'hud/INSTAGRAM_LOCATION_MEDIA_SEARCH';
export const PREDICTHQ_EVENTS_SEARCH = 'hud/PREDICTHQ_EVENTS_SEARCH';
export const HUD_ERROR = 'hud/ERROR';

export const toggleMap = () => ({ type: TOGGLE_MAP });
export const googlePlacesNearbySearch = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: GOOGLE_MAPS_NEARBY_SEARCH
        });
        const { location: { currentLocation } } = getState();
        const results = await GoogleMaps.place.nearbysearch({
            key: GOOGLE_PLACES_API_KEY,
            location: `${currentLocation.coords.latitude},${
                currentLocation.coords.longitude
            }`,
            radius: 10
        });
        console.log(results);
    } catch (error) {
        console.error(error);
        dispatch({ type: HUD_ERROR, error });
        throw error;
    }
};
export const instagramLocationMediaSearch = () => ({
    type: INSTAGRAM_LOCATION_MEDIA_SEARCH
});
export const predictHQEventsSearch = () => async (dispatch, getState) => {
    try {
        dispatch({ type: PREDICTHQ_EVENTS_SEARCH });
        const {
            heading: { initialHeading },
            location: { currentLocation },
            three: { camera, scene }
        } = getState();

        // get events within a radius
        const radius = 50;
        const unit = 'm';
        const results = await PredictHQ.events.search(
            {
                within: `${radius}${unit}@${currentLocation.coords.latitude},${
                    currentLocation.coords.longitude
                }`
            },
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${PREDICTHQ_ACCESS_TOKEN}`
                }
            }
        );

        // predicthq still gives events outside radius
        // remove events with location outside radius
        const events = results.results.filter(event => {
            const { distanceInKilometers } = getDistance(
                currentLocation.coords,
                {
                    longitude: event.location[0],
                    latitude: event.location[1]
                }
            );
            const distanceInMeters = distanceInKilometers * 1000;
            return distanceInMeters < radius;
        });

        const cameraPos = getCameraPosition(camera);

        // create default object3D for each event
        const newObjects = [];
        events.forEach((event, i) => {
            const newObject = {
                ...event,
                longitude: event.location[0],
                latitude: event.location[1]
            };
            const geometry = GEOMETRIES[0];
            const material = MATERIALS[0];
            const object3D = new THREE.Mesh(geometry, material);
            newObject.object3D = object3D;
            calibrateObject(
                newObject,
                cameraPos,
                currentLocation,
                initialHeading
            );
            scene.add(newObject.object3D);
            newObjects.push(newObject);
        });

        dispatch(addObjects(newObjects));
    } catch (error) {
        console.error(error);
        dispatch({ type: HUD_ERROR, error });
        throw error;
    }
};
