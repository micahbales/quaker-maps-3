import * as React from 'react';
import {renderToString} from 'react-dom/server'
import './styles/App.css';
import * as mapboxgl from 'mapbox-gl';
import {AppState, Meeting, BoundsPoints} from './AppDefinitions';
import PopUpCard from './PopUpCard';
const mapboxKey = 'pk.eyJ1IjoibWljYWhiYWxlcyIsImEiOiJjaXg4OTlrNHgwMDAyMnlvNDRleXBrdGNrIn0.d3eUGWL--AriB6n5MXy5TA';
(mapboxgl as any).accessToken = mapboxKey;

class App extends React.Component {

  public map: any;

  public state: AppState = {
    meetings: [],
    markers: []
  };

  public callApi = async () => {
    // Fetch all meetings
    const response = await fetch('/api/v1/meetings');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  public componentDidMount() {
    this.callApi()
          .then((res) => {
            this.setState({meetings: res.meetings});
            
            // Create map
            this.map = new mapboxgl.Map({
              container: 'primary-map',
              style: 'mapbox://styles/micahbales/cjnx84jgd0viy2sojoy624r6k',
              center: [
                this.state.meetings[1].longitude,
                this.state.meetings[1].latitude,
              ],
              zoom: 10
            });

            // Set up markers
            let marker;
            let popup;
            const markers: mapboxgl.Marker[] = [];
            this.state.meetings.forEach((meeting: Meeting) => {
              popup = new mapboxgl.Popup();
              popup.setHTML(
                renderToString(<PopUpCard meeting={meeting} />)
              );

              marker = new mapboxgl.Marker()
              .setLngLat([meeting.longitude, meeting.latitude])
              .setPopup(popup)
              .addTo(this.map);

              markers.push(marker);
            });

            // Get bounds
            const boundsPoints = this.state.meetings.reduce((acc, meeting: Meeting) => {
              const updatedPoints: BoundsPoints = {
                highestLat: meeting.latitude > acc.highestLat ? meeting.latitude : acc.highestLat,
                highestLng: meeting.longitude > acc.highestLng ? meeting.longitude : acc.highestLng,
                lowestLat: meeting.latitude < acc.lowestLat ? meeting.latitude : acc.lowestLat,
                lowestLng: meeting.longitude < acc.lowestLng ? meeting.longitude : acc.lowestLng
              };
              return Object.assign(acc, updatedPoints);
            }, {highestLat: -Infinity, highestLng: -Infinity, lowestLat: Infinity, lowestLng: Infinity});
            
            const sw: mapboxgl.LngLatLike = {lng: boundsPoints.lowestLng, lat: boundsPoints.lowestLat};
            const ne: mapboxgl.LngLatLike = {lng: boundsPoints.highestLng, lat: boundsPoints.highestLat};
            const bounds = new mapboxgl.LngLatBounds(sw, ne);
            const boundsOptions = {
              padding: {
                top: 50, 
                bottom: 50, 
                left: 50, 
                right: 50
              }
            }

            // Center map on markers & update state
            this.map.fitBounds(bounds, boundsOptions);
            this.setState(Object.assign(this.state, {
              markers: markers
            }));
          })
          .catch((err) => console.log(err));
  }

  public render() {
    return (
      <div className='app'>
        <div id='primary-map' />
      </div>
    );
  }
}

export default App;
