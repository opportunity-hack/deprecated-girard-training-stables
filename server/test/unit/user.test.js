import db from "../utils/database";
import request from "supertest";
import express from "express";
import User from "../../src/models/users";
import { createUser,
        getUsers,
} from "../../src/controllers/user";

beforeAll(async () => {
    await db.connect();
});

afterAll(async() => {
    await db.drop();
});

afterEach(async () => {
    await db.dropCollections();
});

const app = express();

// Mock Data

const validUser = {
    firstName: "joe",
    lastName: "schmoe",
    userType: "volunteer",
    email: "joe.schmoe@notreal.com",
    phoneNumber: "123-456-7890",
    horseExperience: 1000,
    horseRiding: false,
    horseTacking: false,
    horseGrooming: false,
    horseLeading: false,
}

const validUserIncomplete = {
    email: "alice@example.com"
}

const inValidUserNoEmail = {
    firstName: "joe",
    lastName: "schmoe",
    userType: "volunteer",
    phoneNumber: "123-456-7890",
    horseExperience: 1000,
    horseRiding: false,
    horseTacking: false,
    horseGrooming: false,
    horseLeading: false,
}

// Route setup

app.use(express.json());
app.post('/users', createUser);
app.get('/users', getUsers);

// Tests

describe("POST /users", () => {
    it("create a user from valid data", async () => {
        let res = await request(app)
            .post('/users')
            .send(validUser)
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(201);

        expect(res.body).toEqual(expect.objectContaining(validUser));
        let createdUser = await User.findOne({ email: validUser.email }).exec()
        expect(createdUser).toEqual(expect.objectContaining(validUser));

        res = await request(app)
            .post('/users')
            .send(validUserIncomplete)
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining(validUserIncomplete));
        createdUser = await User.findOne({ email: validUserIncomplete.email }).exec()
        expect(createdUser).toEqual(expect.objectContaining(validUserIncomplete));
    });

    it("responds to invalid requests with an error", async () => {
        let res = await request(app)
            .post('/users')
            .send({ invalid_input: "hello" })
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(400);

        res = await request(app)
            .post('/users')
            .send(inValidUserNoEmail)
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(400);
    });
});

describe("GET /users", () => {
    it("retrieves users filtering by query parameters", async () => {
        // creating users as in the above tests
        await request(app)
            .post('/users')
            .send(validUser)
            .set('Accept', 'application/json')

        let res = await request(app)
            .get('/users')
            .query({ email: validUser.email})
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(200);
        expect(res.body[0]).toEqual(expect.objectContaining(validUser));

        await request(app)
            .post('/users')
            .send(validUserIncomplete)
            .set('Accept', 'application/json')

        res = await request(app)
            .get('/users')
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.arrayContaining(
            [
                expect.objectContaining(validUser),
                expect.objectContaining(validUserIncomplete),
            ]));
    });

    it("returns a 404 error if requested user(s) is/are not found", async () => {
        // creating users as in the above tests
        let res = await request(app)
            .get('/users')
            .query({ email: "nonexistent@example.com"})
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(404);
    });
});
