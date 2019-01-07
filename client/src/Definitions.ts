export interface AppState {
  meetings: Meeting[];
  yearlymeetings: Meeting[];
  branches: any;
  worshipStyles: any;
  accessibilities: any;
  history: any;
}

export interface MainMapState extends AppState {
    activeCriteria: string[];
    searchCriteria: SearchCriteria;
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
    slug: string;
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

export interface MainMapViewProps {
  appState: AppState;
}

export interface MeetingViewProps {
  history: any;
  meeting: Meeting;
}

export interface RecordItemListingProps {
  item: any;
  label: string;
  link?: string;
}

export interface NavModalProps {
  handleNavSubmit: (e: React.SyntheticEvent<Element>) => void;
  handleInputChange: (criterion: string, e: React.SyntheticEvent<Element>) => void;
  searchCriteria: SearchCriteria;
  meetings: Meeting[];
  yearlymeetings: Meeting[];
  branches: any;
  worshipStyles: any;
  accessibilities: any;
}

export interface ModifyMeetingModalProps {
  meeting: Meeting;
  history: any;
}
