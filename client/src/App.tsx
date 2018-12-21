import * as React from 'react';
import {renderToString} from 'react-dom/server'
import './styles/App.css';
import * as mapboxgl from 'mapbox-gl';
import {AppState, Meeting, BoundsPoints} from './Definitions';
import PopUpCard from './components/PopUpCard';
import NavModal from './components/NavModal';
const mapboxKey = 'pk.eyJ1IjoibWljYWhiYWxlcyIsImEiOiJjaXg4OTlrNHgwMDAyMnlvNDRleXBrdGNrIn0.d3eUGWL--AriB6n5MXy5TA';
(mapboxgl as any).accessToken = mapboxKey;

class App extends React.Component {

  public map: any;

  public state: AppState = {
    searchCriteria: {
      accessibility: '',
      branch: '',
      lgbt_affirming: '',
      state: '',
      worship_style: '',
      yearly_meeting: '',
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

  public setLocalStorage(itemName: string, data: object) {
    try {
      localStorage.setItem(itemName, JSON.stringify(data));
    } catch(err) {
      console.error(err);
    }
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

            // Add meetings to state
            const state = Object.assign({}, this.state);
            state.meetings = res.meetings;
            this.setState(state);

            // Get search criteria from local storage
            const localState = localStorage.getItem('quaker-maps-search-criteria');
            if (localState) {
              const appState = Object.assign({}, this.state);
              appState.searchCriteria = JSON.parse(localState);
              this.setState(appState);
            }

            // Filter meetings and add markers
            const filteredMeetings = this.filterMeetings();
            this.addMarkers(filteredMeetings);
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

  public setSearchCriteria() {
    const state = Object.assign({}, this.state);

    const lgbtNode = ([...Array.from(document.getElementsByName('lgbt'))] as HTMLInputElement[])
      .find((n) => n.checked);
    state.searchCriteria = {
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

    this.setState(state);
    this.setLocalStorage('quaker-maps-search-criteria', state.searchCriteria);
  }

  public filterMeetingsWithoutCriteria() {
    let noCriteriaSet = true;

    for (const criterion in this.state.searchCriteria) {
      // For some reason, null is not returning falsy without the !!
      if (!!(this.state.searchCriteria[criterion])) {
        noCriteriaSet = false;
      }
    }

    if (noCriteriaSet) return this.state.meetings.filter((meeting) => {
      if (meeting.yearly_meeting.length < 1) return this.state.showYms;
      return true;
    });
    return false;
  }

  public filterMeetings() {
    // If there are no search criteria set, return all meetings
    const meetingsWithoutCriteria = this.filterMeetingsWithoutCriteria();
    if (meetingsWithoutCriteria) return meetingsWithoutCriteria;

    // Otherwise, filter according to criteria
    return this.state.meetings.filter((meeting: Meeting) => {
      // Filter yearly Meetings
      if (meeting.yearly_meeting.length < 1) return this.state.showYms;

      for (const key in this.state.searchCriteria) {
        if (this.state.searchCriteria[key]) {
          if (typeof(meeting[key]) !== 'object') {
            if (String(meeting[key]).includes(this.state.searchCriteria[key]) || 
                this.state.searchCriteria[key].includes(String(meeting[key]))) 
                return true;
          } else if (Array.isArray(meeting[key]) && meeting[key].length > 0) {
            for (const ym of meeting[key]) {
              if (ym.title === this.state.searchCriteria[key]) return true;
            }
          }
        }
      }
      return false;
    });
  }

  public async handleNavSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    // Set search criteria from user input
    await this.setSearchCriteria();
    // Filter meetings according to the search criteria
    const filteredMeetings = this.filterMeetings();
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
