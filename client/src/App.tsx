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
            // Create map
            this.map = new mapboxgl.Map({
              container: 'primary-map',
              style: 'mapbox://styles/micahbales/cjnx84jgd0viy2sojoy624r6k',
              center: {lng: -98.585522, lat: 39.8333333},
              zoom: 10
            });

            // this.map.on('click', () => {
            //   const state = Object.assign({}, this.state);
            //   this.removeMarkers(state.markers);
              
            //   state.meetings.splice(-1);
              
            //   state.markers = this.addMarkers(state.meetings, this.map);
            //   this.setState(state);
            // });

            const markers = this.addMarkers(res.meetings, this.map);

            this.setState({
              meetings: res.meetings,
              markers: markers
            });
          })
          .catch((err) => console.error(err));
  }

  public addMarkers(meetings: Meeting[], map: any) {
    let marker;
    let popup;
    const markers: mapboxgl.Marker[] = [];
    meetings.forEach((meeting: Meeting) => {
      popup = new mapboxgl.Popup();
      popup.setHTML(
        renderToString(<PopUpCard meeting={meeting} />)
      );

      marker = new mapboxgl.Marker()
      .setLngLat([meeting.longitude, meeting.latitude])
      .setPopup(popup)
      .addTo(map);

      markers.push(marker);
    });

    this.setBounds(meetings);
    
    return markers;
  }

  public setBounds(meetings: Meeting[]) {
    if (!meetings.length) return;

    const boundsPoints = meetings.reduce((acc, meeting: Meeting) => {
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
    // Center map on markers
    this.map.fitBounds(bounds, boundsOptions);
  }

  // public removeMarkers(markers: mapboxgl.Marker[]) {
  //   markers.forEach((marker) => {
  //     marker.remove();
  //   });
  // }

  public render() {
    return (
      <div className='app'>
        <div id='primary-map' />
      </div>
    );
  }
}

export default App;
