import db from "../utils/database";
import { memoizeUnique } from "../utils/memoizeUnique";
import request from "supertest";
import express from "express";
import User from "../../src/models/users";
import { createUser,
        getUsers,
} from "../../src/controllers/user";
import { faker } from "@faker-js/faker";
import { build, perBuild, oneOf }  from '@jackfranklin/test-data-bot';


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

const userTypes = ["instructor", "volunteer", "volunteer coordinator"]

const newUniqueAuth0ID = memoizeUnique(() => `auth0|${faker.string.alphanumeric(24)}`)

const newUniqueEmail = memoizeUnique(faker.internet.email)

const newValidUserBuilder = build({
    fields: {
    user_id: perBuild(newUniqueAuth0ID),
    firstName: perBuild(faker.person.firstName),
    lastName: perBuild(faker.person.lastName),
    userType: oneOf(...userTypes),
    email: perBuild(newUniqueEmail),
    phoneNumber: perBuild(() => faker.phone.number('###-###-####')),
    horseExperience: perBuild(faker.number.int),
    horseRiding: perBuild(faker.datatype.boolean),
    horseTacking: perBuild(faker.datatype.boolean),
    horseGrooming: perBuild(faker.datatype.boolean),
    horseLeading: perBuild(faker.datatype.boolean),
    }
})

const validUser = newValidUserBuilder.one()

const validUserIncomplete = {
    user_id: newUniqueAuth0ID(),
    email: newUniqueEmail(),
}

const inValidUserNoEmail = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    userType: faker.helpers.arrayElement(userTypes),
    phoneNumber: faker.phone.number('###-###-####'),
    horseExperience: faker.number.int(),
    horseRiding: faker.datatype.boolean(),
    horseTacking: faker.datatype.boolean(),
    horseGrooming: faker.datatype.boolean(),
    horseLeading: faker.datatype.boolean(),
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

    it("returns an empty array if requested user(s) is/are not found", async () => {
        // creating users as in the above tests
        let res = await request(app)
            .get('/users')
            .query({ email: "nonexistent@example.com"})
            .set('Accept', 'application/json')
        expect(res.body).toEqual([]);
    });
});
