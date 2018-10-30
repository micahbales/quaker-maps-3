import * as React from 'react';
import './styles/App.css';
import * as mapboxgl from 'mapbox-gl';

class App extends React.Component {

  public state = {
    meetings: []
  };

  public componentDidMount() {
    this.callApi()
          .then((res) => this.setState({meetings: res.meetings}))
          .catch((err) => console.log(err));

    (mapboxgl as any).accessToken = 'pk.eyJ1IjoibWljYWhiYWxlcyIsImEiOiJjaXg4OTlrNHgwMDAy' + 
        'MnlvNDRleXBrdGNrIn0.d3eUGWL--AriB6n5MXy5TA';

    const map = new mapboxgl.Map({
      container: 'primary-map',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [-96, 37.8],
      zoom: 3
    });

    console.log(map);
  }

  public callApi = async () => {
    // Fetch all meetings
    const response = await fetch('/api/v1/meetings');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  public render() {
    return (
      <div className='app'>
        <div id='primary-map' />
      </div>
    );
  }
}

export default App;
