export interface AppState {
    meetings: Meeting[];
    markers: mapboxgl.Marker[];
}
  
export interface Meeting {
    id: number;
    title: string;
    mappable: boolean;
    phone: string;
    email: string;
    city: string;
    address: string;
    zip: string;
    latitude: number;
    longitude: number;
    description: string;
    worship_time: string;
    state: string;
    website: string;
    lgbt_affirming: boolean;
    yearly_meeting: [
      {
        id: number,
        title: string
      }
    ];
    branch: [
      {
        id: number,
        title: string
      }
    ];
    worship_style: [
      {
        id: number,
        title: string
      }
    ];
    accessibility: [
      {
        id: number,
        title: string
      }
    ]
  }
  
export interface BoundsPoints {
    highestLat: number; 
    highestLng: number;
    lowestLat: number;
    lowestLng: number;
}
