import * as React from 'react';
import './styles/App.css';
import * as mapboxgl from 'mapbox-gl';
(mapboxgl as any).accessToken = 'pk.eyJ1IjoibWljYWhiYWxlcyIsImEiOiJjaXg4OTlrNHgwMDAy' + 
    'MnlvNDRleXBrdGNrIn0.d3eUGWL--AriB6n5MXy5TA';

interface AppState {
  meetings: any[];
  markers: any[];
}

class App extends React.Component {

  public map: any;

  public state: AppState = {
    meetings: [],
    markers: []
  };

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
            this.setState({meetings: res.meetings});
            
            // Create map
            this.map = new mapboxgl.Map({
              container: 'primary-map',
              style: 'mapbox://styles/mapbox/light-v9',
              center: [
                this.state.meetings[1].longitude,
                this.state.meetings[1].latitude,
              ],
              zoom: 5
            });

            // Set up markers
            let marker;
            const markers: any[] = [];
            this.state.meetings.forEach((meeting) => {
              marker = new mapboxgl.Marker()
              .setLngLat([meeting.longitude, meeting.latitude])
              .addTo(this.map);

              markers.push(marker);
            });

            // Update state
            this.setState(Object.assign(this.state, {
              markers: markers
            }));
          })
          .catch((err) => console.log(err));
  }

  public render() {
    return (
      <div className='app'>
        <div id='primary-map' />
      </div>
    );
  }
}

export default App;
