import * as React from 'react';

/**
 * RecordItemListing represents a single item to be displayed in a Meeting listing.
 * Items displayed by this component can range from an address, to a linked website,
 * or a list of yearly meetings, branches, etc.
 */

interface RecordItemListingProps {
    item: any;
    label: string;
    link?: string;
}

const RecordItemListing: React.SFC<RecordItemListingProps> = ({
    item,
    label,
    link
}) => {
    if (Array.isArray(item)) {
        return (
            <div className='record-item-listing'>
                <label>{label}: </label>
                <ul>
                    {
                        item.map((o: any, i: number) => {
                            return <li key={i}>{o.title}</li>;
                        })
                    }
                </ul>
            </div>
        );
    }
    if (link) {
        return (
            <div>
                <p>
                    <label>{label}: </label>
                    <a href={link}>{item}</a>
                </p>
            </div>
        );
    }
    return (
        <div>
            <p>
                <label>{label}: </label>
                {item}
            </p>
        </div>
    );
};

export default RecordItemListing;
