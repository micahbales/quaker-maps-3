import { Pool, Client } from 'pg';

export const root = async (req, res) => {

    // example of pool

    const pool = new Pool();

    const queryResponse = await pool.query('SELECT * FROM meeting;');
    console.log(queryResponse);
    await pool.end();

    // example of client

    const client = new Client();
    await client.connect();

    const response = await client.query('SELECT $1::text as message', ['Hello world!']);
    // console.log(response.rows[0].message); // Hello world!
    await client.end();

    res.json({hello: 'world'});
};
