import * as React from 'react';
import './App.css';

import logo from './logo.svg';

class App extends React.Component {

  public state = {
    meetings: {}
  };

  public componentDidMount() {
    this.callApi()
          .then(res => this.setState({ meetings: res.meetings }))
          .catch(err => console.log(err));
  }

  public callApi = async () => {
    const response = await fetch('/meetings');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  public render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Quaker Maps</h1>
        </header>
        <h3>Meetings:</h3>
            {
              [this.state].map((meeting, i) => {
                return <p key={i}>{JSON.stringify(meeting)}</p>
              })
            }
      </div>
    );
  }
}

export default App;
