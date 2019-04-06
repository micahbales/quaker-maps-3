import * as React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import MainMap from './components/MainMapView/MainMapView';
import MeetingView from './components/MeetingView/MeetingView';
import { CreateMeetingView } from './components/CreateMeetingView/CreateMeetingView';
import { AppState, Meeting } from './Definitions';
import { getMeetingData } from './api/api';
import { getTitleStrings } from './utils/helpers';
import { loadingPage, pageNotFound } from './utils/views';
import './styles/App.css';

/**
 * App is the top-level container for the entire application.
 * This component manages state and calls our API.
 */

class App extends React.Component {

  state: AppState;

  constructor(props: any) {
    super(props);

    this.state = {
      history: createBrowserHistory(),
      meetings: [],
      yearlymeetings: [],
      branches: [],
      worshipStyles: [],
      accessibilities: [],
      titles: {
        stateTitles: [],
        yearlyMeetingTitles: [],
        accessibilityTitles: [],
        branchTitles: [],
        worshipStyleTitles: [],
      }
    };
  }

  componentDidMount() {
    getMeetingData()
      .then(async (res) => {
        // Add all data from API to state
        const state = Object.assign({}, this.state);
        state.meetings = res.meetings;
        state.yearlymeetings = res.yearlymeetings;
        state.branches = res.branches;
        state.worshipStyles = res.worshipStyles;
        state.accessibilities = res.accessibilities;
        state.titles = {
          stateTitles: getTitleStrings(state, 'meetings', 'state'),
          yearlyMeetingTitles: getTitleStrings(state, 'yearlymeetings', 'title'),
          accessibilityTitles: getTitleStrings(state, 'accessibilities', 'title'),
          branchTitles: getTitleStrings(state, 'branches', 'title'),
          worshipStyleTitles: getTitleStrings(state, 'worshipStyles', 'title'),
        };
        this.setState(state);
      })
      .catch((err) => console.error(err));
  }

  renderMainMap = () => <MainMap appState={this.state} />;

  renderMeetingView = (props: RouteComponentProps<any>) => {
    const slug = props.match.params.slug;
    const meeting = this.state.meetings.find((m: Meeting) => m.slug === slug);
    if (!meeting) return pageNotFound();
    return (
      <MeetingView
        meeting={meeting}
        yearlymeetings={this.state.yearlymeetings}
        branches={this.state.branches}
        worshipStyles={this.state.worshipStyles}
        accessibilities={this.state.accessibilities}
        history={this.state.history}
        titles={this.state.titles}
        />
    );
  }

  renderCreateMeetingView = () => {
    const newMeeting = {
      title: '',
      mappable: true,
      phone: '',
      email: '',
      city: '',
      address: '',
      zip: '',
      latitude: 0,
      longitude: 0,
      description: '',
      worship_time: '',
      state: '',
      website: '',
      lgbt_affirming: false,
      slug: '',
      yearly_meeting: [],
      branch: [],
      worship_style: [],
      accessibility: []
    };
    return (
      <CreateMeetingView
        meeting={newMeeting}
        yearlymeetings={this.state.yearlymeetings}
        branches={this.state.branches}
        worshipStyles={this.state.worshipStyles}
        accessibilities={this.state.accessibilities}
        history={this.state.history}
        titles={this.state.titles}
      />
    )
  };

  render = () => (
    <div className='app'>
      <Switch>
        {/* Main Map */}
        <Route exact={true} path='/' component={
            this.state.meetings.length > 0 ? 
            this.renderMainMap :
            loadingPage} />
        {/* Individual Meeting Pages */}
        <Route path='/meetings/:slug' render={
          this.state.meetings.length > 0 ? 
          this.renderMeetingView :
          loadingPage} />
        {/* View for Creating a New Meeting */}
        <Route path='/create-meeting' render={
          this.state.meetings.length > 0 ?
            this.renderCreateMeetingView :
            loadingPage} />
      </Switch>
    </div>
  );
}

export default App;
