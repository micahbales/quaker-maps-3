import {
    query,
    getKeys,
    getValues,
    getQueryBling,
    getKeyValueQueryString
} from '../utils/utils';

// GET /quakers
export const getAllQuakers = async (req, res) => {
    const quakers = await query('SELECT * FROM quaker;');

    res.json({quakers: quakers.rows});
};

// GET /quakers/:id
export const getQuakerById = async (req, res) => {
    const quakerId = req.params.id;
    const quakers = await query(
        'SELECT * FROM quaker ' +
        ' WHERE id = ' + quakerId + ';'
    );

    res.json({quakers: quakers.rows});
};

// POST /quakers
export const createQuaker = async (req, res) => {
    const newquaker = req.body.quaker;
    const queryString = 'INSERT INTO quaker (' + getKeys(newquaker) + ') ' +
                        ' VALUES (' + getQueryBling(newquaker) + ');';

    const quaker = await query(queryString, getValues(newquaker));

    res.status(201).send({quaker: quaker});
};

// PUT /quakers/:id
export const updateQuaker = async (req, res) => {
    const quakerId = req.params.id;
    const quaker = req.body.quaker;
    const queryString = 'UPDATE quaker ' +
                        ' SET ' +
                        getKeyValueQueryString(quaker) +
                        ' WHERE id = ' + quakerId + ';';

    const quakers = await query(queryString);

    res.status(204).json({quakers: quakers.rows});
};

// DELETE /quakers/:id
export const deleteQuaker = async (req, res) => {
    const quakerId = req.params.id;
    const quaker = await query(
        'DELETE FROM quaker ' +
        ' WHERE id = ' + quakerId + ';'
    );

    res.json({quaker: quaker});
};
