import * as React from 'react';
import {RecordItemListingProps} from './../Definitions';

const RecordItemListing: React.SFC<RecordItemListingProps> = (props) => {
    if (Array.isArray(props.item)) {
        return (
            <div className='record-item-listing'>
                <label>{props.label}: </label>
                <ul>
                    {
                        props.item.map((o: any, i: number) => {
                            return <li key={i}>{o.title}</li>;
                        })
                    }
                </ul>
            </div>
        );
    }
    if (props.link) {
        return (
            <div>
                <p>
                    <label>{props.label}: </label>
                    <a href={props.link}>{props.item}</a>
                </p>
            </div>
        );
    }
    return (
        <div>
            <p>
                <label>{props.label}: </label>
                {props.item}
            </p>
        </div>
    );
};

export default RecordItemListing;
