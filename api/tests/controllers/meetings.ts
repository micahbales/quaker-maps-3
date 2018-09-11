import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../../.env'});
import app from '../../app';
import * as chai from 'chai';
import * as supertest from 'supertest';

describe('Meetings', () => {
    it('should return 6 meetings', (done) => {
        supertest(app)
                .get('/all-meetings')
                .expect(200)
                .end((err, res) => {
                    chai.assert(res.body.allMeetings.rows.length === 6);
                    done(err);
                });
    });
});
