import * as React from 'react';
import {renderToString} from 'react-dom/server'
import '../styles/MainMapView.css';
import * as mapboxgl from 'mapbox-gl';
import {MainMapState, MainMapViewProps, Meeting, BoundsPoints} from '../Definitions';
import PopUpCard from './PopUpCard';
import NavModal from './modals/NavModal';
import NavButton from './NavButton';
const mapboxKey = 'pk.eyJ1IjoibWljYWhiYWxlcyIsImEiOiJjaXg4OTlrNHgwMDAyMnlvNDRleXBrdGNrIn0.d3eUGWL--AriB6n5MXy5TA';
(mapboxgl as any).accessToken = mapboxKey;

class MainMapView extends React.Component<MainMapViewProps> {

  public map: any;

  public state: MainMapState;

  public constructor(props: any) {
    super(props);

    this.state = {
      activeCriteria: [],
      searchCriteria: {
        accessibility: '',
        branch: '',
        lgbt_affirming: '',
        state: '',
        worship_style: '',
        yearly_meeting: '',
        zip: '',
      },
      meetings: props.appState.meetings,
      yearlymeetings: props.appState.yearlymeetings,
      branches: props.appState.branches,
      worshipStyles: props.appState.worshipStyles,
      accessibilities: props.appState.accessibilities,
      markers: [],
      showYms: false,
      history: this.props.appState.history,
    };

    this.handleNavSubmit = this.handleNavSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.setActiveCriteria = this.setActiveCriteria.bind(this);
  }

  public setLocalStorage(itemName: string, data: object) {
    try {
      localStorage.setItem(itemName, JSON.stringify(data));
    } catch(err) {
      console.error(err);
    }
  }

  public async componentDidMount() {          
    // Create map
    this.map = new mapboxgl.Map({
      container: 'primary-map',
      style: 'mapbox://styles/micahbales/cjnx84jgd0viy2sojoy624r6k',
      center: {lng: -98.585522, lat: 39.8333333},
      zoom: 10
    });

    // Get search criteria from local storage
    const localState = localStorage.getItem('quaker-maps-search-criteria');
    if (localState) {
      const appState = Object.assign({}, this.state);
      appState.searchCriteria = JSON.parse(localState);
      await this.setState(appState);
    }

    // Filter meetings and add markers
    const filteredMeetings = await this.filterMeetings();
    this.addMarkers(filteredMeetings);
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

  public setActiveCriteria() {
    const state = Object.assign({}, this.state);
    const activeCriteria = [];
    
    for (const criterion in this.state.searchCriteria) {
      if (this.state.searchCriteria[criterion]) {
        activeCriteria.push(criterion);
      }
    }
    state.activeCriteria = activeCriteria;
    this.setState(state);
  }

  public async filterMeetings() {
    // Only search results against actively selected criteria
    await this.setActiveCriteria();
    if (this.state.activeCriteria.length < 1) return this.state.meetings;

    // Filter for meetings that match all active criteria
    return this.state.meetings.filter((meeting: Meeting) => {
      // Filter yearly meetings
      if (meeting.yearly_meeting.length < 1 && !this.state.showYms) return false;

      let criteriaSatisfied = 0;
      for (const key of this.state.activeCriteria) {
        // Handle string/null values
        if (typeof(meeting[key]) !== 'object') {
          if (String(meeting[key]).includes(this.state.searchCriteria[key]) || 
              this.state.searchCriteria[key].includes(String(meeting[key]))) {
                criteriaSatisfied += 1;
                if (criteriaSatisfied >= this.state.activeCriteria.length) return true;
              }
        // Handle array values
        } else if (Array.isArray(meeting[key]) && meeting[key].length > 0) {
          for (const ym of meeting[key]) {
            if (ym.title === this.state.searchCriteria[key]) {
              criteriaSatisfied += 1;
              if (criteriaSatisfied >= this.state.activeCriteria.length) return true;
            }
          }
        }
      }
      return false;
    });
  }

  public async handleNavSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    // Filter meetings according to the search criteria
    const filteredMeetings = await this.filterMeetings();
    // Update map only if there are any results
    if (filteredMeetings.length > 0) {
      this.removeMarkers(this.state.markers);
      this.addMarkers(filteredMeetings);
    }
  }

  public handleInputChange(criterion: string, e: React.SyntheticEvent) {
    const state = Object.assign({}, this.state);
    state.searchCriteria[criterion] = (e.currentTarget as HTMLInputElement).value;
    this.setState(state);
    this.setLocalStorage('quaker-maps-search-criteria', state.searchCriteria);
  }

  public render() {
    return (
      <div className='app'>
        <NavButton />
        <NavModal 
          handleNavSubmit={this.handleNavSubmit}
          handleInputChange={this.handleInputChange}
          searchCriteria={this.state.searchCriteria}
          meetings={this.state.meetings}
          yearlymeetings={this.state.yearlymeetings}
          branches={this.state.branches}
          worshipStyles={this.state.worshipStyles}
          accessibilities={this.state.accessibilities}
        />
        <div id='primary-map' />
      </div>
    );
  }
}

export default MainMapView;
