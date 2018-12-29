import * as React from 'react';
import {Switch, Route} from 'react-router-dom';
import MainMap from './MainMap';
import './styles/App.css';

class App extends React.Component {

  public render() {
    return (
      <div className='app'>
        <Switch>
            <Route exact={true} path='/' component={MainMap} />
        </Switch>
      </div>
    );
  }
}

export default App;
