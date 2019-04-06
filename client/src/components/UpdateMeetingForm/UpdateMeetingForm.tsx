import * as React from 'react';
import { Meeting, State } from '../../Definitions';
import { states } from '../../utils/helpers';
import './styles/UpdateMeetingForm.css';
import { FormInput } from './components/FormInput';

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
    <form>
        <FormInput
            handleChangeCb={handleUpdateAttr}
            name={'title'}
            placeholder={'Meeting Name'}
            title={'Meeting Name'}
            value={meeting.title}
        />

        <FormInput
            handleChangeCb={handleUpdateAttr}
            name={'slug'}
            placeholder={'Meeting Slug'}
            title={'Meeting Slug'}
            value={meeting.slug}
        />

        <FormInput
            handleChangeCb={handleUpdateAttr}
            name={'address'}
            placeholder={'Address'}
            title={'Address'}
            value={meeting.address}
        />

        <FormInput
            handleChangeCb={handleUpdateAttr}
            name={'city'}
            placeholder={'City'}
            title={'City'}
            value={meeting.city}
        />

        <h5>State:</h5>
        <select name='state' placeholder='State' defaultValue={meeting.state} onChange={handleUpdateAttr}>
            {states.map((state: State, i: number) =>
                <option key={i} value={state.short}>{state.name}</option>)}
        </select>

        <FormInput
            handleChangeCb={handleUpdateAttr}
            name={'zip'}
            placeholder={'Zip'}
            title={'Zip'}
            value={meeting.zip}
        />

        <FormInput
            handleChangeCb={handleUpdateAttr}
            name={'email'}
            placeholder={'Email'}
            title={'Email'}
            value={meeting.email}
        />

        <FormInput
            handleChangeCb={handleUpdateAttr}
            name={'phone'}
            placeholder={'Phone'}
            title={'Phone'}
            value={meeting.phone}
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

        <FormInput
            handleChangeCb={handleUpdateAttr}
            name={'description'}
            placeholder={'Description'}
            title={'Description'}
            value={meeting.description}
        />

        <FormInput
            handleChangeCb={handleUpdateAttr}
            name={'worship_time'}
            placeholder={'Worship Time'}
            title={'Worship Time'}
            value={meeting.worship_time}
        />

        <FormInput
            handleChangeCb={handleUpdateAttr}
            name={'website'}
            placeholder={'Website'}
            title={'Website'}
            value={meeting.website}
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
            <input
                type='radio'
                name='lgbt_affirming'
                value='true'
                checked={meeting.lgbt_affirming === true}
                onChange={handleUpdateAttr}
            />
            LGBT-Affirming
            <input
                type='radio'
                name='lgbt_affirming'
                value='false'
                checked={meeting.lgbt_affirming === false}
                onChange={handleUpdateAttr}
            />
            Non-Affirming
        </div>

        <button onClick={handleUpdateMeeting}>Submit</button>
    </form>
)
