import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../../.env.test'});
import app from '../../app';
import * as chai from 'chai';
import * as supertest from 'supertest';

describe('Meetings', function() {
    this.timeout(6000);
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
                        const meetingsWithYms = res.body.meetings.filter((meeting) => {
                            return meeting.yearly_meeting.length >= 1;
                        });
                        const meetingWithoutYm = res.body.meetings.filter((meeting) => {
                            return meeting.yearly_meeting.length < 1;
                        });
                        chai.assert(meetingsWithYms.length === 5);
                        chai.assert(meetingsWithYms[0].yearly_meeting[0].title === 'Great Plains Yearly Meeting');
                        chai.assert(meetingWithoutYm[0].title === 'Great Plains Yearly Meeting');
                        done(err);
                    });
        });

        it('should return a yearly meeting with all three worship styles', (done) => {
            supertest(app)
                    .get('/meetings')
                    .expect(200)
                    .end((err, res) => {
                        chai.assert(res.body.meetings[0].worship_style.length === 3);
                        chai.assert(res.body.meetings[0].worship_style[2].title === 'Semi-programmed');
                        done(err);
                    });
        });

        it('should return Great Plains Yearly Meeting as having the branch Friends United Meeting', (done) => {
            supertest(app)
                    .get('/meetings')
                    .expect(200)
                    .end((err, res) => {
                        const meeting = res.body.meetings.find((m) => m.title === 'Great Plains Yearly Meeting');
                        chai.assert(meeting.branch.find((branch) => branch.title === 'Friends United Meeting'));
                        done(err);
                    });
        });

        it('should return Heartland Meeting as having 2 branches: FUM and FGC', (done) => {
            supertest(app)
                    .get('/meetings')
                    .expect(200)
                    .end((err, res) => {
                        const meeting = res.body.meetings.find((m) => m.title === 'Heartland Friends Meeting');
                        chai.assert(!!(meeting.branch.find((branch) => branch.title === 'Friends General Conference')));
                        chai.assert(!!(meeting.branch.find((branch) => branch.title === 'Friends United Meeting')));
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
                        chai.assert(meeting.accessibility.find((a) => a.title === 'Wheelchair Accessible'));
                        chai.assert(meeting.accessibility.find((a) => a.title === 'Hearing Assistance System'));
                        chai.assert(meeting.accessibility.find((a) => a.title === 'Childcare Available'));
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

        it(`should belong to one yearly meeting, two branches,
            have three accessibilities and one worship style`, (done) => {
            supertest(app)
                    .get('/meetings/3')
                    .expect(200)
                    .end((err, res) => {
                        const queriedMeeting = res.body.meetings.filter((m) => m.id === 3)[0];
                        chai.assert(queriedMeeting.yearly_meeting.length === 1);
                        chai.assert(queriedMeeting.branch.length === 2);
                        chai.assert(queriedMeeting.worship_style.length === 1);
                        chai.assert(queriedMeeting.accessibility.length === 3);
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

        it('should have no yearly meeting or accessibility, but one branch and 3 worship styles', (done) => {
            supertest(app)
                    .get('/yearlymeetings')
                    .expect(200)
                    .end((err, res) => {
                        chai.assert(res.body.meetings.length === 1);
                        chai.assert(res.body.meetings[0].yearly_meeting.length === 0);
                        chai.assert(res.body.meetings[0].accessibility.length === 0);
                        chai.assert(res.body.meetings[0].branch.length === 1);
                        chai.assert(res.body.meetings[0].worship_style.length === 3);
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

        it(`should create a new meeting record with a yearly meeting,
                worship styles, branches, and accessibility`, (done) => {
            const meetingName = 'fantastic meeting!';
            const meeting = {
                title: meetingName,
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
                            const mtg = res.body.meetings.find((o) => o.title === meetingName);
                            // // New meeting record is successfully retrieved
                            chai.assert(mtg);
                            // // It has a yearly meeting
                            chai.assert(mtg.yearly_meeting[0].id === 1);
                            // // It has two worship styles
                            chai.assert(mtg.worship_style[0].id === 1);
                            chai.assert(mtg.worship_style[1].id === 3);
                            // // It has two branches
                            chai.assert(mtg.branch[0].id === 1);
                            chai.assert(mtg.branch[1].id === 2);
                            // // It has an accessibility option
                            chai.assert(mtg.accessibility[0].id === 3);
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
                lgbt_affirming: 'true',
                yearly_meeting: null, // remove yearly meeting
                worship_style: [2, 3], // was [1, 3]
                branch: [1], // was [1, 2]
                accessibility: [1, 2, 3] // was [3]
            };

            // Update meeting record
            supertest(app)
                    .put('/meetings/8')
                    .send({meeting})
                    .expect(200)
                    .end(() => {
                        // Then check and make sure it was updated
                        supertest(app)
                        .get('/meetings')
                        .expect(200)
                        .end((err, res) => {
                            // New meeting record is successfully retrieved
                            chai.assert(res.body.meetings.find((o) => {
                                return o.title === 'an updated meeting' &&
                                o.description === 'we updated our description to reflect changes' &&
                                o.yearly_meeting.length === 0 &&
                                o.worship_style[0].id === 2 &&
                                o.branch.length === 1 &&
                                o.accessibility.length === 3;
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
                    .delete('/meetings/8')
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
