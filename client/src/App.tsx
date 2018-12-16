import * as React from 'react';
import {renderToString} from 'react-dom/server'
import './styles/App.css';
import * as mapboxgl from 'mapbox-gl';
import {AppState, SearchCriteria, Meeting, BoundsPoints} from './Definitions';
import PopUpCard from './components/PopUpCard';
import NavModal from './components/NavModal';
const mapboxKey = 'pk.eyJ1IjoibWljYWhiYWxlcyIsImEiOiJjaXg4OTlrNHgwMDAyMnlvNDRleXBrdGNrIn0.d3eUGWL--AriB6n5MXy5TA';
(mapboxgl as any).accessToken = mapboxKey;

class App extends React.Component {

  public map: any;

  public state: AppState = {
    searchCriteria: {
      yearly_meeting: '',
      lgbt_affirming: '',
      state: '',
      zip: '',
    },
    meetings: [],
    markers: [],
    showYms: false,
  };

  private constructor(props: any) {
    super(props);

    this.handleNavSubmit = this.handleNavSubmit.bind(this);
  }

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

            const filteredMeetings = res.meetings.filter((m: Meeting) => {
              if (m.yearly_meeting.length < 1) return this.state.showYms;
              return true;
            })
            this.addMarkers(filteredMeetings);

            const state = Object.assign({}, this.state);
            state.meetings = res.meetings;
            this.setState(state);
          })
          .catch((err) => console.error(err));
  }

  public addMarkers(meetings: Meeting[]) {
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
      .addTo(this.map);

      markers.push(marker);
    });

    this.setBounds(meetings);

    const state = Object.assign({}, this.state);
    state.markers = markers;
    this.setState(state);
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

  public removeMarkers(markers: mapboxgl.Marker[]) {
    markers.forEach((marker) => {
      marker.remove();
    });
    const state = Object.assign({}, this.state);
    state.markers = [];
    this.setState(state);
  }

  public filterMeetings(searchCriteria: SearchCriteria) {
    return this.state.meetings.filter((meeting: Meeting) => {
      // Filter yearly Meetings
      if (meeting.yearly_meeting.length < 1) return this.state.showYms;

      for (const key in searchCriteria) {
        if (searchCriteria[key]) {
          if (typeof(meeting[key]) !== 'object') {
            if (String(meeting[key]).includes(searchCriteria[key]) || 
                searchCriteria[key].includes(String(meeting[key]))) 
                return true;
          } else if (Array.isArray(meeting[key]) && meeting[key].length > 0) {
            for (const ym of meeting[key]) {
              if (ym.title === searchCriteria[key]) return true;
            }
          }
        }
      }
      return false;
    });
  }

  public handleNavSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    // Set parameters for meeting search from user inputs
    const lgbtNode = ([...Array.from(document.getElementsByName('lgbt'))] as HTMLInputElement[])
        .find((n) => n.checked);
    const searchCriteria = {
      accessibility: ((document.querySelector('.filter-meetings-form .accessibility') as HTMLInputElement)
          .value as string),
      branch: ((document.querySelector('.filter-meetings-form .branch') as HTMLInputElement)
          .value as string),
      lgbt_affirming: lgbtNode ? lgbtNode.value : null,
      state: ((document.querySelector('.filter-meetings-form .state') as HTMLInputElement).value as string),
      worship_style: ((document.querySelector('.filter-meetings-form .worship-style') as HTMLInputElement)
          .value as string),
      yearly_meeting: ((document.querySelector('.filter-meetings-form .yearlymeeting') as HTMLInputElement)
          .value as string),
      zip: ((document.querySelector('.filter-meetings-form .zip') as HTMLInputElement).value as string),
    }

    // Filter meetings according to the search criteria
    const filteredMeetings = this.filterMeetings(searchCriteria);

    // Update map only if there are any results
    if (filteredMeetings.length > 0) {
      this.removeMarkers(this.state.markers);
      this.addMarkers(filteredMeetings);
    }
  }

  public render() {
    return (
      <div className='app'>
        <NavModal 
          handleNavSubmit={this.handleNavSubmit}
        />
        <div id='primary-map' />
      </div>
    );
  }
}

export default App;
