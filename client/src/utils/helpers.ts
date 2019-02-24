import { AppState } from '../Definitions';

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
