import * as React from 'react';
import './styles/App.css';
import MeetingCard from './MeetingCard';

import logo from './logo.svg';

class App extends React.Component {

  public state = {
    meetings: []
  };

  public componentDidMount() {
    this.callApi()
          .then((res) => this.setState({meetings: res.meetings}))
          .catch((err) => console.log(err));
  }

  public callApi = async () => {
    // Fetch all meetings
    const response = await fetch('/meetings');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  public render() {
    return (
      <div className='app'>
        <header className='app-header'>
          <img src={logo} className='app-logo' alt='logo' />
          <h1 className='app-title'>Quaker Maps</h1>
        </header>
        <h3>All Meetings:</h3>
        <div className='meetings-list'>
          {
            this.state.meetings.map((meeting:any, i:number) => {
              return <MeetingCard key={i} meeting={meeting} />
            })
          }
        </div>
            
      </div>
    );
  }
}

export default App;
