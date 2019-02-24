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
