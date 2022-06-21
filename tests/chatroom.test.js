require("dotenv").config();
const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const con = require('../db');
const chatroom = require('../routes/chatroom_route');

app.use('/', chatroom);

describe("route works", done => {

    it("gets all chatrooms", (done) => {
        request(app)
            .get('/all')
            .expect("Content-Type", /json/)
            .expect(200, done)
    });

    //In this case, user does not exist so it returns an empty array
    it("gets all chatrooms based on user", (done) => {
        request(app)
            .get('/users/1234')
            .expect("Content-Type", /json/)
            .expect([])
            .expect(200, done);
    });
    
    it("successfully creates a message", (done) => {
        request(app)
            .post('/5bd8274b-5145-42c4-987e-77c780a7a1f6')
            .type("form")
            .send({text: "Test Message", userid: 'eaab8a69-8e53-4e57-875d-c652d9af2524'})
            .expect(200, done)
    });

    it("gets info for specific chatroom", (done) => {
        request(app)
            .get('/5bd8274b-5145-42c4-987e-77c780a7a1f6')
            .expect("Content-Type", /json/)
            .expect(200, done)
    });


    it("gets messages based on chatroom", (done) => {
        request(app)
            .get('/5bd8274b-5145-42c4-987e-77c780a7a1f6/messages')
            .expect("Content-Type", /json/)
            .expect(200, done)
    });


    afterAll(() => {
        con.end();
    })
});
