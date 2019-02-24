/**
 * getMeetingData fetches all relevant data for meetings from the Quaker Maps API.
 */

export const getMeetingData = async () => {
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
