import * as React from 'react';
import {Switch, Route, RouteComponentProps} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import MainMap from './components/MainMapView';
import MeetingView from './components/MeetingView';
import Spinner from './components/Spinner';
import {AppState, Meeting} from './Definitions';
import './styles/App.css';

class App extends React.Component {

  public state: AppState;
  public history: any;

  constructor(props: any) {
    super(props);

    this.state = {
      meetings: [],
    };

    this.history = createBrowserHistory();

    this.renderMeetingView = this.renderMeetingView.bind(this);
    this.renderMainMap = this.renderMainMap.bind(this);
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
          .then(async (res) => {
            // Add meetings to state
            const state = Object.assign({}, this.state);
            state.meetings = res.meetings;
            this.setState(state);
          })
          .catch((err) => console.error(err));
  }

  public renderMainMap() {
    return (
      <MainMap meetings={this.state.meetings} />
    );
  }

  public renderMeetingView(props: RouteComponentProps<any>) {
    const slug = props.match.params.slug;
    const meeting = this.state.meetings.find((m: Meeting) => m.slug === slug);
    if (meeting) {
      return (
        <MeetingView 
          meeting={meeting} 
          history={this.history} />
      );
    } else {
      return this.pageNotFound();
    }
  }

  public pageNotFound() {
    return (
      <div>
        <h1>Looks like that page doesn't exist!</h1>
        <p>
          If you think this is an error, please <a href='mailto:admin@quakermaps.com'>contact a site administrator</a>.
        </p>
      </div>
    );
  }

  public loadingPage() {
    return (
      <Spinner />
    );
  }

  public render() {
    return (
      <div className='app'>
        <Switch>
          {/* Main Map */}
          <Route exact={true} path='/' component={
              this.state.meetings.length > 0 ? 
              this.renderMainMap :
              this.loadingPage} />
            } />
          {/* Individual Meeting Pages */}
          <Route path='/:slug' render={
            this.state.meetings.length > 0 ? 
            this.renderMeetingView :
            this.loadingPage} />
        </Switch>
      </div>
    );
  }
}

export default App;
