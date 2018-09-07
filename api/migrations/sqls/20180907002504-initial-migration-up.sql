-- Create Meeting
CREATE TABLE meeting (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    mappable BOOLEAN,
    phone VARCHAR(255),
    email VARCHAR(255),
    city VARCHAR(255),
    address VARCHAR(255),
    zip VARCHAR(255),
    latitude SMALLINT,
    longitude SMALLINT,
    description VARCHAR(255),
    worship_time TIME,
    state VARCHAR(255),
    website VARCHAR(255),
    lgbt_affirming BOOLEAN,
    created TIMESTAMP default current_timestamp,
    updated TIMESTAMP default current_timestamp
);

-- Create MeetingYearlyMeeting
CREATE TABLE meeting_yearly_meeting (
    id SERIAL PRIMARY KEY,
    meeting_id SMALLINT,
    yearly_meeting_id SMALLINT,
    created TIMESTAMP default current_timestamp,
    updated TIMESTAMP default current_timestamp
);

-- Create Branch
CREATE TABLE branch (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    created TIMESTAMP default current_timestamp,
    updated TIMESTAMP default current_timestamp
);

-- Create MeetingBranch
CREATE TABLE meeting_branch (
    id SERIAL PRIMARY KEY,
    meeting_id SMALLINT,
    branch_id SMALLINT,
    created TIMESTAMP default current_timestamp,
    updated TIMESTAMP default current_timestamp
);

-- Create Worship Style
CREATE TABLE worship_style (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    created TIMESTAMP default current_timestamp,
    updated TIMESTAMP default current_timestamp
);

-- Create MeetingWorshipStyle
CREATE TABLE meeting_worship_style (
    id SERIAL PRIMARY KEY,
    meeting_id SMALLINT,
    worship_style_id SMALLINT,
    created TIMESTAMP default current_timestamp,
    updated TIMESTAMP default current_timestamp
);

-- Create Accessibility
CREATE TABLE accessibility (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    created TIMESTAMP default current_timestamp,
    updated TIMESTAMP default current_timestamp
);

-- Create MeetingAccessibility
CREATE TABLE meeting_accessibility (
    id SERIAL PRIMARY KEY,
    meeting_id SMALLINT,
    accessibility_id SMALLINT,
    created TIMESTAMP default current_timestamp,
    updated TIMESTAMP default current_timestamp
);