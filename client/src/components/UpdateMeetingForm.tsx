import * as React from 'react';
import { Meeting, State } from '../Definitions';
import {  states } from '../utils/helpers'

/**
 * UpdateMeetingForm is a general-purpose form used for both updating and creating meetings
 */

interface UpdateMeetingFormProps {
    meeting: Meeting;
    handleMultiSelectFormChange: (e: any) => void;
    handleUpdateAttr: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleUpdateMeeting: (e: React.SyntheticEvent) => void;
    selectedTitles: any;
    titles: any;
}

export const UpdateMeetingForm: React.SFC<UpdateMeetingFormProps> = ({
    meeting,
    handleMultiSelectFormChange,
    handleUpdateAttr,
    handleUpdateMeeting,
    selectedTitles,
    titles
}) => (
    <>
        <form>
            <h5>Meeting Name:</h5>
            <input
                name='title'
                placeholder='Meeting Name'
                value={meeting.title}
                onChange={handleUpdateAttr}
            />

            <h5>Meeting Slug:</h5>
            <input
                name='slug'
                placeholder='Meeting Slug'
                value={meeting.slug}
                onChange={handleUpdateAttr}
            />

            <h5>Address:</h5>
            <input
                name='address'
                placeholder='Address'
                value={meeting.address}
                onChange={handleUpdateAttr}
            />

            <h5>Latitude:</h5>
            <input
                name='latitude'
                placeholder='Latitude'
                value={meeting.latitude}
                onChange={handleUpdateAttr}
            />

            <h5>Longitude:</h5>
            <input
                name='longitude'
                placeholder='Longitude'
                value={meeting.longitude}
                onChange={handleUpdateAttr}
            />

            <h5>City:</h5>
            <input
                name='city'
                placeholder='City'
                value={meeting.city}
                onChange={handleUpdateAttr}
            />

            <h5>State:</h5>
            <select
                name='state'
                placeholder='State'
                defaultValue={meeting.state}
                onChange={handleUpdateAttr}
            >
                {states.map((state: State, i: number) =>
                    <option key={i} value={state.short}>{state.name}</option>)}
            </select>

            <h5>Zip:</h5>
            <input
                name='zip'
                placeholder='Zip'
                value={meeting.zip}
                onChange={handleUpdateAttr}
            />


            <h5>Email:</h5>
            <input
                name='email'
                placeholder='Email'
                value={meeting.email}
                onChange={handleUpdateAttr}
            />


            <h5>Phone:</h5>
            <input
                name='phone'
                placeholder='Phone'
                value={meeting.phone}
                onChange={handleUpdateAttr}
            />

            <h5>Worship Style:</h5>
            <select
                onChange={handleMultiSelectFormChange}
                className='worship_style'
                multiple={true}
                defaultValue={selectedTitles.worshipStyleTitles}>
                {
                    titles.worshipStyleTitles.map((title: string, i: number) =>
                        <option value={title} key={i}>{title}</option>)
                }
            </select>

            <h5>Yearly Meeting:</h5>
            <select
                onChange={handleMultiSelectFormChange}
                className='yearly_meeting'
                multiple={true}
                defaultValue={selectedTitles.yearlyMeetingTitles}>
                {
                    titles.yearlyMeetingTitles.map((title: string, i: number) =>
                        <option value={title} key={i}>{title}</option>)
                }
            </select>

            <h5>Description:</h5>
            <input
                name='description'
                placeholder='Description'
                value={meeting.description}
                onChange={handleUpdateAttr}
            />

            <h5>Worship Time:</h5>
            <input
                name='worship_time'
                placeholder='Worship Time'
                value={meeting.worship_time}
                onChange={handleUpdateAttr}
            />

            <h5>Website:</h5>
            <input
                name='website'
                placeholder='Website'
                value={meeting.website}
                onChange={handleUpdateAttr}
            />

            <h5>Accessibility:</h5>
            <select
                onChange={handleMultiSelectFormChange}
                className='accessibility'
                multiple={true}
                defaultValue={selectedTitles.accessibilityTitles}>
                {
                    titles.accessibilityTitles.map((title: string, i: number) =>
                        <option value={title} key={i}>{title}</option>)
                }
            </select>

            <h5>Branch:</h5>
            <select
                onChange={handleMultiSelectFormChange}
                className='branch'
                multiple={true}
                defaultValue={selectedTitles.branchTitles}>
                {
                    titles.branchTitles.map((title: string, i: number) =>
                        <option value={title} key={i}>{title}</option>)
                }
            </select>

            <h5>LGBT-Affirming:</h5>
            <div className='form-element'>
                <input type='radio' name='lgbt_affirming' value='true'
                    checked={meeting.lgbt_affirming === true}
                    onChange={handleUpdateAttr} />
                LGBT-Affirming
                    <input type='radio' name='lgbt_affirming' value='false'
                    checked={meeting.lgbt_affirming === false}
                    onChange={handleUpdateAttr} />
                Non-Affirming
                </div>

            <button onClick={handleUpdateMeeting}>Submit</button>
        </form>
    </>
)
