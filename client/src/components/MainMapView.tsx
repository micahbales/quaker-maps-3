import * as React from 'react';
import '../styles/MainMapView.css';
import * as mapboxgl from 'mapbox-gl';
import { AppState, SearchCriteria } from '../Definitions';
import { setLocalStorage } from '../utils/helpers';
import { createMap, filterMeetings, getMarkers, removeMarkers, setActiveCriteria } from '../utils/mapping';
import NavModal from './modals/NavModal';
import NavButton from './NavButton';
const mapboxKey = 'pk.eyJ1IjoibWljYWhiYWxlcyIsImEiOiJjaXg4OTlrNHgwMDAyMnlvNDRleXBrdGNrIn0.d3eUGWL--AriB6n5MXy5TA';
(mapboxgl as any).accessToken = mapboxKey;

/**
 * MainMapView is the initial and primary view for QuakerMaps.
 * This view displays a map with markers for each meeting selected by the user's search criteria.
 */

export interface MainMapViewProps {
  appState: AppState;
}

export interface MainMapViewState extends AppState {
  activeCriteria: string[];
  searchCriteria: SearchCriteria;
  markers: mapboxgl.Marker[];
  showYms: boolean;
}

class MainMapView extends React.Component<MainMapViewProps> {

  map: any;
  state: MainMapViewState;

  constructor(props: MainMapViewProps) {
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
      titles: {
        stateTitles: this.props.appState.titles.stateTitles,
        yearlyMeetingTitles: this.props.appState.titles.yearlyMeetingTitles,
        accessibilityTitles: this.props.appState.titles.accessibilityTitles,
        branchTitles: this.props.appState.titles.branchTitles,
        worshipStyleTitles: this.props.appState.titles.worshipStyleTitles,
      },
      markers: [],
      showYms: false,
      history: this.props.appState.history,
    };
  }

  async componentDidMount() { 
    this.loadMap();
  }

  /**
   * loadMap 
   * - Creates the map
   * - Activates existing search criteria, if any
   * - Filters meetings so that only those being searched for are shown
   * - Adds meeting markers to the map
   */

  loadMap = async () => {
    // Create map         
    this.map = createMap();

    // Get search criteria from local storage, if it exists
    const localState = localStorage.getItem('quaker-maps-search-criteria');
    if (localState) {
      const searchCriteria = JSON.parse(localState);
      await this.setState({ searchCriteria });
    }

    // Update active criteria before filtering meetings
    const activeCriteria = setActiveCriteria(this.state);
    await this.setState({ activeCriteria });

    // Filter meetings according to the search criteria
    const filteredMeetings = await filterMeetings(this.state);

    // Add markers
    const markers = await getMarkers(filteredMeetings, this.map);
    this.setState({ markers });
  }

  /**
   * handleNavSubmit is triggered when the user submits their criteria in the main nav bar.
   * This function updates our markers, showing only the meetings we have selected.
   */

  handleNavSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    // Update active criteria before filtering meetings
    const activeCriteria = setActiveCriteria(this.state);
    await this.setState({ activeCriteria });

    // Filter meetings according to the search criteria
    const filteredMeetings = await filterMeetings(this.state);

    // Update map only if there are any results
    if (filteredMeetings.length > 0) {
      // Remove all markers
      removeMarkers(this.state.markers);
      
      // Re-add only meeting markers that meet our criteria
      const markers = await getMarkers(filteredMeetings, this.map);
      this.setState({ markers });

      // Cache our search criteria in the browser
      setLocalStorage('quaker-maps-search-criteria', this.state.searchCriteria);
    }
  }

  /**
   * handleInputChange updates the searchCriteria whenever an item on the form is updated.
   * The search criteria must be up-to-date at all times,
   * so that the proper search is performed when the form is submitted.
   */

  handleInputChange = async (criterion: string, e: React.SyntheticEvent) => {
    const searchCriteria = Object.assign({}, this.state.searchCriteria);
    searchCriteria[criterion] = (e.currentTarget as HTMLInputElement).value;
    await this.setState({ searchCriteria });
  }

  render = () => (
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
        titles={this.state.titles}
      />
      <div id='primary-map' />
    </div>
  );
}

export default MainMapView;
