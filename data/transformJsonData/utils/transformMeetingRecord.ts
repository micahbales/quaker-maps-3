export const transformMeetingRecord = async (meeting) => {
    delete meeting.accessibility;
    delete meeting.branch;
    delete meeting.worship_style;
    delete meeting.yearly_meeting;

    meeting.table_type = 'meeting';

    return meeting;
};
