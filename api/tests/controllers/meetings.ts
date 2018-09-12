import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../../.env'});
import app from '../../app';
import * as chai from 'chai';
import * as supertest from 'supertest';

describe('Meetings', () => {
    describe('/meetings', () => {
        it('should return 6 meetings', (done) => {
            supertest(app)
                    .get('/meetings')
                    .expect(200)
                    .end((err, res) => {
                        chai.assert(res.body.meetings.rows.length === 6);
                        done(err);
                    });
        });
    });

    describe('/meetings/:id', () => {
        it('should return 1 meeting', (done) => {
            supertest(app)
                    .get('/meetings/1')
                    .expect(200)
                    .end((err, res) => {
                        chai.assert(res.body.meetings.rows.length === 1);
                        done(err);
                    });
        });

        it('should return University Friends Church for an ID of 3', (done) => {
            supertest(app)
                    .get('/meetings/3')
                    .expect(200)
                    .end((err, res) => {
                        const queriedMeeting = res.body.meetings.rows.filter((m) => m.id === 3)[0];
                        chai.assert.equal(queriedMeeting.title, 'University Friends Church');
                        done(err);
                    });
        });
    });
});
