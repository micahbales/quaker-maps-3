import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../../.env.test'});
import app from '../../app';
import * as chai from 'chai';
import * as supertest from 'supertest';

describe('Quakers', () => {
    describe('GET /quakers', () => {
        it('should return 2 Quakers', (done) => {
            supertest(app)
                    .get('/quakers')
                    .expect(200)
                    .end((err, res) => {
                        chai.assert(res.body.quakers.length === 2);
                        done(err);
                    });
        });
    });

    describe('GET /quakers/:id', () => {
        it('should return 1 quaker', (done) => {
            supertest(app)
                    .get('/quakers/2')
                    .expect(200)
                    .end((err, res) => {
                        chai.assert(res.body.quakers.length === 1);
                        done(err);
                    });
        });

        it('should return Georege Fox for an ID of 2', (done) => {
            supertest(app)
                    .get('/quakers/2')
                    .expect(200)
                    .end((err, res) => {
                        const queriedquaker = res.body.quakers.filter((m) => m.id === 2)[0];
                        chai.assert.equal(queriedquaker.name, 'George Fox');
                        done(err);
                    });
        });
    });

    describe('POST /quakers/', () => {
        it('should create a new quaker record', (done) => {
            const quaker = {
                name: 'James Naylor',
                email: 'jimmynay@independents.org',
                username: 'jamesnaylor',
                password: 'ridingintobristolisnteasy',
                description: 'There is a spirit which I feel that delights to do no evil, ' +
                'nor to revenge any wrong, but delights to endure all things, in hope to enjoy its own in the end...'
            };

            // Create quaker record
            supertest(app)
                    .post('/quakers')
                    .send({quaker})
                    .expect(201)
                    .end(() => {
                        // Then check and make sure it was created
                        supertest(app)
                        .get('/quakers')
                        .expect(200)
                        .end((err, res) => {
                            // New quaker record is successfully retrieved
                            chai.assert(res.body.quakers.find((o) => o.name === 'James Naylor'));
                            done(err);
                        });
                    });
        });
    });

    describe('PUT /quakers/:id', () => {
        it('should update a quaker record', (done) => {
            const quaker = {
                name: 'William Penn',
                email: 'willyp@pennsylvania.gov',
                username: 'pennyforyourthoughts',
                password: 'nocrossnocrown',
                description: 'Men must be governed by God or they will be ruled by tyrants.'
            };

            // Update quaker record
            supertest(app)
                    .put('/quakers/3')
                    .send({quaker})
                    .expect(204)
                    .end(() => {
                        // Then check and make sure it was updated
                        supertest(app)
                        .get('/quakers')
                        .expect(200)
                        .end((err, res) => {
                            // New quaker record is successfully retrieved
                            chai.assert(res.body.quakers.find((o) => {
                                return o.name === 'William Penn' &&
                                o.description === 'Men must be governed by God or they will be ruled by tyrants.';
                            }));
                            done(err);
                        });
                    });
        });
    });

    describe('DELETE /quakers/:id', () => {
        it('should delete a quaker record', (done) => {
            // Update quaker record
            supertest(app)
                    .delete('/quakers/3')
                    .expect(204)
                    .end(() => {
                        // Then check and make sure it was deleted
                        supertest(app)
                        .get('/quakers')
                        .expect(200)
                        .end((err, res) => {
                            // New quaker record no longer exists
                            chai.assert(!!(res.body.quakers.find((o) => o.name === 'William Penn')) === false);
                            done(err);
                        });
                    });
        });
    });
});
