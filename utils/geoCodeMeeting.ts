import axios from 'axios';
import { Meeting } from '../client/src/Definitions';

/**
 * Check a meeting object for whether it has an address
 * If it does, ask MapQuest to give us latitude and longitude for the meeting
 */

const getFormattedAddress = (address: string, city: string, state: string, zip: string) => {
    const formattedAddress = address.trim().replace(/\s+/g, '+');
    return `${formattedAddress},${city},${state},${zip}`;
};

export const geoCodeMeeting = async (meeting: Meeting) => {
    if (!meeting.address) return meeting;

    const formattedAddress = getFormattedAddress(
        meeting.address,
        meeting.city,
        meeting.state,
        meeting.zip
    );
    const url = `http://www.mapquestapi.com/geocoding/v1/address?key=` +
        `${process.env.MAPQUESTKEY}&location=${formattedAddress}`;
    const locationData: any = await axios.get(url)
        .catch((err) => {
            console.error(err);
        });
    meeting.latitude = Number(locationData.data.results[0].locations[0].latLng.lat);
    meeting.longitude = Number(locationData.data.results[0].locations[0].latLng.lng);
    return meeting;
};
