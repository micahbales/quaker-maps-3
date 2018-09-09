import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../../.env'});
// Uncomment this when we have the test database set up
// process.env.PGDATABASE = 'quaker_maps_test';
import app from '../../app';
import * as chai from 'chai';
import * as supertest from 'supertest';

describe('Meetings', () => {
    it('should return 6 meetings', (done) => {
        supertest(app)
                .get('/all-meetings')
                .expect(200)
                .end((err, res) => {
                    // console.log(res.body.allMeetings.rows);
                    chai.assert(res.body.allMeetings.rows.length === 6);
                    done(err);
                });
    });
});
