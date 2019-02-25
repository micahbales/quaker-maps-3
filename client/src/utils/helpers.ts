import { AppState } from '../Definitions';

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
