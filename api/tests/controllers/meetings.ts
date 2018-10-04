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

        it('should return 5 meetings with a yearly meeting, and one with no yearly meeting', (done) => {
            supertest(app)
                    .get('/meetings')
                    .expect(200)
                    .end((err, res) => {
                        const expectedValues = [
                            null,
                            'Great Plains Yearly Meeting',
                            'Great Plains Yearly Meeting',
                            'Great Plains Yearly Meeting',
                            'Great Plains Yearly Meeting',
                            'Great Plains Yearly Meeting',
                        ];
                        const actualValues = res.body.meetings.map((m) => m.yearly_meeting);

                        chai.assert.equal(expectedValues.length, actualValues.length);
                        chai.assert.equal(actualValues.length, 6);
                        chai.assert.equal(expectedValues.join(','), actualValues.join(','));

                        done(err);
                    });
        });

        it('should return a yearly meeting with all three worship styles', (done) => {
            supertest(app)
                    .get('/meetings')
                    .expect(200)
                    .end((err, res) => {
                        chai.assert(res.body.meetings[0].worship_style = 'unprogrammed, programmed, semi-programmed');
                        done(err);
                    });
        });

        it('should return Great Plains Yearly Meeting as having the branch Friends United Meeting', (done) => {
            supertest(app)
                    .get('/meetings')
                    .expect(200)
                    .end((err, res) => {
                        const meeting = res.body.meetings.find((m) => m.title === 'Great Plains Yearly Meeting');
                        chai.assert(meeting.branch = 'Friends United Meeting');
                        done(err);
                    });
        });

        it('should return Heartland Meeting as having 2 branches: FUM and FGC', (done) => {
            supertest(app)
                    .get('/meetings')
                    .expect(200)
                    .end((err, res) => {
                        const meeting = res.body.meetings.find((m) => m.title === 'Heartland Friends Meeting');
                        chai.assert(meeting.branch = 'Friends General Conference, Friends United Meeting');
                        done(err);
                    });
        });

        it('should return Great Plains Yearly Meeting as having no accessibility options', (done) => {
            supertest(app)
                    .get('/meetings')
                    .expect(200)
                    .end((err, res) => {
                        const meeting = res.body.meetings.find((m) => m.title === 'Great Plains Yearly Meeting');
                        chai.assert.equal(meeting.accesibility, null);
                        done(err);
                    });
        });

        it('should return University Friends Church as having all accessibility options', (done) => {
            supertest(app)
                    .get('/meetings')
                    .expect(200)
                    .end((err, res) => {
                        const meeting = res.body.meetings.find((m) => m.title === 'University Friends Church');
                        chai.assert.equal(
                            meeting.accessibility,
                            'Wheelchair Accessible, Hearing Assistance System, Childcare Available'
                        );
                        done(err);
                    });
        });
    });

    describe('GET /meetings/:id', () => {
        it('should return 1 meeting', (done) => {
            supertest(app)
                    .get('/meetings/2')
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
                    .end(() => {
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

        it.only(`should create a new meeting record with joins for
                yearly meeting, worship style, branch, and accessibility`, (done) => {
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
                lgbt_affirming: 'true',
                yearly_meeting: [1],
                worship_style: [1, 3],
                branch: [1, 2],
                accessibility: [3]
            };

            // Create meeting record
            supertest(app)
                    .post('/meetings')
                    .send({meeting})
                    .expect(201)
                    .end(() => {
                        // Then check and make sure it was created
                        supertest(app)
                        .get('/meetings')
                        .expect(200)
                        .end((err, res) => {
                            // New meeting record is successfully retrieved
                            chai.assert(res.body.meetings.find((o) => o.title === 'brand new meeting'));
                            // It has a yearly meeting
                            chai.assert(
                                res.body.meetings
                                .find((o) => o.id === 7 &&
                                o.yearly_meeting === 'Great Plains Yearly Meeting')
                                );
                            // It has two worship styles
                            chai.assert(
                                res.body.meetings
                                .find((o) => o.id === 7 &&
                                o.worship_style === 'unprogrammed, semi-programmed')
                                );
                            // It has two branches
                            chai.assert(
                                res.body.meetings
                                .find((o) => o.id === 7 &&
                                o.branch === 'Friends General Conference, Friends United Meeting')
                                );
                            // It has an accessibility option
                            chai.assert(
                                res.body.meetings
                                .find((o) => o.id === 7 &&
                                o.accessibility === 'Childcare Available')
                                );
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
                    .end(() => {
                        // Then check and make sure it was updated
                        supertest(app)
                        .get('/meetings')
                        .expect(200)
                        .end((err, res) => {
                            // New meeting record is successfully retrieved
                            chai.assert(res.body.meetings.find((o) => {
                                return o.title === 'an updated meeting' &&
                                o.description === 'we updated our description to reflect changes';
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
                    .end(() => {
                        // Then check and make sure it was deleted
                        supertest(app)
                        .get('/meetings')
                        .expect(200)
                        .end((err, res) => {
                            // New meeting record no longer exists
                            chai.assert(!!(res.body.meetings.find((o) => o.title === 'an updated meeting')) === false);
                            done(err);
                        });
                    });
        });
    });
});
