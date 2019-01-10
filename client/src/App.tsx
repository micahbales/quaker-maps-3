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

    this.renderMeetingView = this.renderMeetingView.bind(this);
    this.renderMainMap = this.renderMainMap.bind(this);
  }

  public callApi = async () => {
    // Fetch all state data
    const meetings = await fetch('/api/v1/meetings');
    const yearlymeetings = await fetch('/api/v1/meetings/yearlymeetings');
    const branches = await fetch('/api/v1/meetings/branches');
    const worshipStyles = await fetch('/api/v1/meetings/worshipstyles');
    const accessibilities = await fetch('/api/v1/meetings/accessibilities');

    if (meetings.status !== 200) throw Error(await meetings.json());
    if (yearlymeetings.status !== 200) throw Error(await yearlymeetings.json());
    if (branches.status !== 200) throw Error(await branches.json());
    if (worshipStyles.status !== 200) throw Error(await worshipStyles.json());
    if (accessibilities.status !== 200) throw Error(await accessibilities.json());

    return {
      meetings: (await meetings.json()).meetings,
      yearlymeetings: (await yearlymeetings.json()).yearlymeetings,
      branches: (await branches.json()).branches,
      worshipStyles: (await worshipStyles.json()).worshipstyles,
      accessibilities: (await accessibilities.json()).accessibilities,
    };;
  };

  public getTitleStrings(state: AppState, titleType: string, attr: string): string[] {
      return state[titleType].reduce((list: string[], record: string) => {
          if (record[attr] && !list.includes(record[attr] as string)) list.push(record[attr]);
          return list;
      }, []);
  }

  public componentDidMount() {
    this.callApi()
          .then(async (res) => {
            // Add all data from API to state
            const state = Object.assign({}, this.state);
            state.meetings = res.meetings;
            state.yearlymeetings = res.yearlymeetings;
            state.branches = res.branches;
            state.worshipStyles = res.worshipStyles;
            state.accessibilities = res.accessibilities;
            state.titles = {
              stateTitles: this.getTitleStrings(state, 'meetings', 'state'),
              yearlyMeetingTitles: this.getTitleStrings(state, 'yearlymeetings', 'title'),
              accessibilityTitles: this.getTitleStrings(state, 'accessibilities', 'title'),
              branchTitles: this.getTitleStrings(state, 'branches', 'title'),
              worshipStyleTitles: this.getTitleStrings(state, 'worshipStyles', 'title'),
            };
            this.setState(state);
          })
          .catch((err) => console.error(err));
  }

  public renderMainMap() {
    return (
      <MainMap appState={this.state} />
    );
  }

  public renderMeetingView(props: RouteComponentProps<any>) {
    const slug = props.match.params.slug;
    const meeting = this.state.meetings.find((m: Meeting) => m.slug === slug);
    if (meeting) {
      return (
        <MeetingView
          meeting={meeting}
          yearlymeetings={this.state.yearlymeetings}
          branches={this.state.branches}
          worshipStyles={this.state.worshipStyles}
          accessibilities={this.state.accessibilities}
          titles={this.state.titles}
          history={this.state.history} />
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
