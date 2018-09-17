import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../../.env.test'});
import app from '../../app';
import * as chai from 'chai';
import * as supertest from 'supertest';

describe('Meetings', () => {
    describe('GET /meetings', () => {
        it('should return 6 meetings', (done) => {
            supertest(app)
                    .get('/meetings')
                    .expect(200)
                    .end((err, res) => {
                        chai.assert(res.body.meetings.length === 6);
                        done(err);
                    });
        });
    });

    describe('GET /meetings/:id', () => {
        it('should return 1 meeting', (done) => {
            supertest(app)
                    .get('/meetings/1')
                    .expect(200)
                    .end((err, res) => {
                        chai.assert(res.body.meetings.length === 1);
                        done(err);
                    });
        });

        it('should return University Friends Church for an ID of 3', (done) => {
            supertest(app)
                    .get('/meetings/3')
                    .expect(200)
                    .end((err, res) => {
                        const queriedMeeting = res.body.meetings.filter((m) => m.id === 3)[0];
                        chai.assert.equal(queriedMeeting.title, 'University Friends Church');
                        done(err);
                    });
        });
    });

    describe('GET /yearlymeetings', () => {
        it('should return all yearly meetings (in this case, just one)', (done) => {
            supertest(app)
                    .get('/yearlymeetings')
                    .expect(200)
                    .end((err, res) => {
                        chai.assert(res.body.meetings.length === 1);
                        chai.assert(res.body.meetings[0].title = 'Great Plains Yearly Meeting');
                        done(err);
                    });
        });
    });

    describe('POST /meetings/', () => {
        it('should create a new meeting record', (done) => {
            const meeting = {
                title: 'brand new meeting',
                longitude: 75.20201,
                mappable: 'true',
                phone: '1234567890',
                email: 'example@example.com',
                city: 'anytown',
                address: '123 street',
                latitude: -88.0029,
                zip: '12345',
                description: 'this is an example meeting',
                worship_time: '10:00AM',
                state: 'AK',
                website: 'www.www.com',
                lgbt_affirming: 'true'
            };

            // Create meeting record
            supertest(app)
                    .post('/meetings')
                    .send({meeting})
                    .expect(201)
                    .end((err, res) => {
                        // Then check and make sure it was created
                        supertest(app)
                        .get('/meetings')
                        .expect(200)
                        .end((err, res) => {
                            // New meeting record is successfully retrieved
                            chai.assert(res.body.meetings.find((o) => o.title === 'brand new meeting'));
                            done(err);
                        });
                    });
        });
    });

    describe('PUT /meetings/:id', () => {
        it('should update a meeting record', (done) => {
            const meeting = {
                title: 'an updated meeting',
                longitude: 75.20201,
                mappable: 'true',
                phone: '1234567890',
                email: 'example@example.com',
                city: 'anytown',
                address: '123 street',
                latitude: -88.0029,
                zip: '12345',
                description: 'we updated our description to reflect changes',
                worship_time: '10:00AM',
                state: 'AK',
                website: 'www.www.com',
                lgbt_affirming: 'true'
            };

            // Update meeting record
            supertest(app)
                    .put('/meetings/7')
                    .send({meeting})
                    .expect(204)
                    .end((err, res) => {
                        // Then check and make sure it was updated
                        supertest(app)
                        .get('/meetings')
                        .expect(200)
                        .end((err, res) => {
                            // New meeting record is successfully retrieved
                            chai.assert(res.body.meetings.find((o) => {
                                return o.title === 'an updated meeting' && 
                                o.description === 'we updated our description to reflect changes'
                            }));
                            done(err);
                        });
                    });
        });
    });
    describe('DELETE /meetings/:id', () => {
        it('should delete a meeting record', (done) => {
            // Update meeting record
            supertest(app)
                    .delete('/meetings/7')
                    .expect(204)
                    .end((err, res) => {
                        // Then check and make sure it was deleted
                        supertest(app)
                        .get('/meetings')
                        .expect(200)
                        .end((err, res) => {
                            // New meeting record no longer exists
                            chai.assert(!!(res.body.meetings[6]) === false);
                            done(err);
                        });
                    });
        });
    });
});
