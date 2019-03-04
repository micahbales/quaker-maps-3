import { AppState, State } from '../Definitions';

/**
 * convertStringBooleans checks a string to see if it is 'true' or false'.
 * If so, it returns the appropriate boolean.
 * Otherwise, it returns back the original string.
 */

export const convertStringBooleans = (s: string) => {
    if (s === 'true') return true;
    if (s === 'false') return false;
    return s;
}

/**
 * getIds returns the ids of all items in a collection.
 */

export const getIds = (collection: any[]) => {
    if (!collection || collection.length < 1) return null;
    // Return an array of ids
    return collection.map((c: any) => c.id)
}

/**
 * getMultiSelectValues checks an HTMLSelectElement and returns a list of all selected values.
 */

export const getMultiSelectValues = (multiSelectElement: HTMLSelectElement) => {
    const values = []
    const optionsLength = multiSelectElement.options.length;
    let option;

    for (let i = 0; i < optionsLength; i++) {
        // Check every option in the multi-select
        option = multiSelectElement.options[i];

        // If it is selected, include it in the returned values array
        if (option.selected) {
            values.push(option.value);
        }
    }

    return values;
}

/**
 * getTitleStrings returns an array of titles found in meetingData,
 * providing titles for dropdown menus.
 */

export const getTitleStrings = (
    state: AppState, 
    titleType: string, 
    attr: string
): string[] =>
    state[titleType].reduce((list: string[], record: string) => {
        if (record[attr] && !list.includes(record[attr] as string)) list.push(record[attr]);
        return list;
    }, []);

/**
 * setLocalStorage allows persisting state in the browser.
 * This function exists primarily to handle for possible errors arising from the stringify operation.
 */

export const setLocalStorage = (itemName: string, data: object) => {
    try {
        localStorage.setItem(itemName, JSON.stringify(data));
    } catch (err) {
        console.error(err);
    }
}

/**
 * States and provinces in the US and Canada.
 * Source: https://github.com/substack/provinces
 */

export const states: State[] = [
    { short: 'AL', name: 'Alabama', country: 'US' },
    { short: 'AK', name: 'Alaska', country: 'US' },
    { short: 'AZ', name: 'Arizona', country: 'US' },
    { short: 'AR', name: 'Arkansas', country: 'US' },
    { short: 'CA', name: 'California', country: 'US' },
    { short: 'CO', name: 'Colorado', country: 'US' },
    { short: 'CT', name: 'Connecticut', country: 'US' },
    { short: 'DC', name: 'District of Columbia', 'alt': ['Washington DC', 'Washington D.C.'], country: 'US' },
    { short: 'DE', name: 'Delaware', country: 'US' },
    { short: 'FL', name: 'Florida', country: 'US' },
    { short: 'GA', name: 'Georgia', country: 'US' },
    { short: 'HI', name: 'Hawaii', country: 'US' },
    { short: 'ID', name: 'Idaho', country: 'US' },
    { short: 'IL', name: 'Illinois', country: 'US' },
    { short: 'IN', name: 'Indiana', country: 'US' },
    { short: 'IA', name: 'Iowa', country: 'US' },
    { short: 'KS', name: 'Kansas', country: 'US' },
    { short: 'KY', name: 'Kentucky', country: 'US' },
    { short: 'LA', name: 'Louisiana', country: 'US' },
    { short: 'ME', name: 'Maine', country: 'US' },
    { short: 'MD', name: 'Maryland', country: 'US' },
    { short: 'MA', name: 'Massachusetts', country: 'US' },
    { short: 'MI', name: 'Michigan', country: 'US' },
    { short: 'MN', name: 'Minnesota', country: 'US' },
    { short: 'MS', name: 'Mississippi', country: 'US' },
    { short: 'MO', name: 'Missouri', country: 'US' },
    { short: 'MT', name: 'Montana', country: 'US' },
    { short: 'NE', name: 'Nebraska', country: 'US' },
    { short: 'NV', name: 'Nevada', country: 'US' },
    { short: 'NH', name: 'New Hampshire', country: 'US' },
    { short: 'NJ', name: 'New Jersey', country: 'US' },
    { short: 'NM', name: 'New Mexico', country: 'US' },
    { short: 'NY', name: 'New York', country: 'US' },
    { short: 'NC', name: 'North Carolina', country: 'US' },
    { short: 'ND', name: 'North Dakota', country: 'US' },
    { short: 'OH', name: 'Ohio', country: 'US' },
    { short: 'OK', name: 'Oklahoma', country: 'US' },
    { short: 'OR', name: 'Oregon', country: 'US' },
    { short: 'PA', name: 'Pennsylvania', country: 'US' },
    { short: 'RI', name: 'Rhode Island', country: 'US' },
    { short: 'SC', name: 'South Carolina', country: 'US' },
    { short: 'SD', name: 'South Dakota', country: 'US' },
    { short: 'TN', name: 'Tennessee', country: 'US' },
    { short: 'TX', name: 'Texas', country: 'US' },
    { short: 'UT', name: 'Utah', country: 'US' },
    { short: 'VT', name: 'Vermont', country: 'US' },
    { short: 'VA', name: 'Virginia', country: 'US' },
    { short: 'WA', name: 'Washington', country: 'US' },
    { short: 'WV', name: 'West Virginia', country: 'US' },
    { short: 'WI', name: 'Wisconsin', country: 'US' },
    { short: 'WY', name: 'Wyoming', country: 'US' },
    { short: 'AS', name: 'American Samoa', country: 'US' },
    { short: 'GU', name: 'Guam', country: 'US' },
    { short: 'MP', name: 'Northern Mariana Islands', country: 'US' },
    { short: 'PR', name: 'Puerto Rico', country: 'US' },
    { short: 'UM', name: 'United States Minor Outlying Islands', country: 'US' },
    { short: 'VI', name: 'Virgin Islands', country: 'US' },

    { short: 'AB', name: 'Alberta', country: 'CA' },
    { short: 'BC', name: 'British Columbia', country: 'CA' },
    { short: 'MB', name: 'Manitoba', country: 'CA' },
    { short: 'NB', name: 'New Brunswick', country: 'CA' },
    { short: 'NL', name: 'Newfoundland and Labrador', country: 'CA', 'alt': ['Newfoundland', 'Labrador'] },
    { short: 'NS', name: 'Nova Scotia', country: 'CA' },
    { short: 'NU', name: 'Nunavut', country: 'CA' },
    { short: 'NT', name: 'Northwest Territories', country: 'CA' },
    { short: 'ON', name: 'Ontario', country: 'CA' },
    { short: 'PE', name: 'Prince Edward Island', country: 'CA' },
    { short: 'QC', name: 'Quebec', country: 'CA' },
    { short: 'SK', name: 'Saskatchewan', country: 'CA' },
    { short: 'YT', name: 'Yukon', country: 'CA' }
]
    
