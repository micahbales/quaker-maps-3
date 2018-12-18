export interface AppState {
    searchCriteria: SearchCriteria;
    meetings: Meeting[];
    markers: mapboxgl.Marker[];
    showYms: boolean;
}

export interface SearchCriteria {
  accessibility: string;
  branch: string;
  lgbt_affirming: string | null;
  state: string;
  worship_style: string;
  yearly_meeting: string;
  zip: string;
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

export interface NavModalProps {
  handleNavSubmit: (e: React.SyntheticEvent<Element>) => void;
}
