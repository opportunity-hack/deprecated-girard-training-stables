import db from "../utils/database";
import { memoizeUnique } from "../utils/memoizeUnique";
import request from "supertest";
import express from "express";
import User from "../../src/models/users";
import { createUser,
        getUsers,
        updateUserById,
        deleteUserById,
} from "../../src/controllers/user";
import { faker } from "@faker-js/faker";
import { build, perBuild, oneOf }  from '@jackfranklin/test-data-bot';
import { errorHandler } from '../../src/middlewares/errorHandler'

import { userStore, usersEndpoint, resetUserStore } from '../mocks/Auth0handlers';
import { server } from '../mocks/Auth0Server';
import { rest } from 'msw';

beforeAll(async () => {
    await db.connect();
    server.listen({
        onUnhandledRequest: 'bypass',
    })
});

afterAll(async() => {
    await db.drop();
    server.close()
});

afterEach(async () => {
    await db.dropCollections();
    resetUserStore();
    server.resetHandlers()
});

const app = express();
app.use(errorHandler);

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
    user_id: newUniqueAuth0ID(),
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
app.patch('/users/:id', updateUserById);
app.delete('/users/:id', deleteUserById);

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
        // check that a user was also created in the Auth0 DB 
        expect(userStore[validUser.user_id]).toBeDefined();

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

    it("fails if the call to Auth0 fails", async () => {
        server.use(
          rest.post(
            usersEndpoint,
            async (req, res, ctx) => {
                return res(
                    ctx.json({
                        message: "could not create new user for some reason"
                    }),
                    ctx.status(500)
                )
            },
          ),
        )

        let res = await request(app)
          .post('/users')
          .send(newValidUserBuilder.one())
          .set('Accept', 'application/json')
        expect(res.statusCode).not.toEqual(201)
    })
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
        expect(res.body[0]).toEqual(expect.objectContaining(validUser));
        expect(res.body[0].last_login).toBeDefined()
        expect(res.statusCode).toEqual(200);


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
        // creating users using functionality tested above
        let res = await request(app)
            .get('/users')
            .query({ email: "nonexistent@example.com"})
            .set('Accept', 'application/json')
        expect(res.body).toEqual([]);
    });
});

describe("DELETE /users/:id", () => {
    it("deletes a user by ID in both the application and Auth0 databases", async () => {
        await request(app)
            .post('/users')
            .send(validUser)
            .set('Accept', 'application/json')

        let res = await request(app)
            .get('/users')
            .query({ email: validUser.email})
            .set('Accept', 'application/json')
        expect(res.body[0]).toEqual(expect.objectContaining(validUser));
        expect(res.body[0].last_login).toBeDefined()
        expect(res.statusCode).toEqual(200);
        const user_id = res.body[0].user_id
        const id = res.body[0]._id
        expect(userStore[user_id]).toBeDefined();

        res = await request(app)
            .delete('/users/' + id)
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(200);
        expect (userStore[user_id]).not.toBeDefined()

        res = await request(app)
            .get('/users')
            .query({ email: validUser.email})
            .set('Accept', 'application/json')
        expect(res.body).toEqual([])
        expect(res.statusCode).toEqual(200);
    })

    it("fails if the user to be deleted does not exist", async () => {
        let res = await request(app)
            .delete('/users/' + faker.database.mongodbObjectId())
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(400);
    })

    it("fails if the call to Auth0 fails and doesn't modify anything", async () => {
        server.use(
          rest.delete(
            usersEndpoint + '/:id',
            async (req, res, ctx) => {
                return res(
                    ctx.json({
                        message: "could not delete specified user for some reason"
                    }),
                    ctx.status(500)
                )
            },
          ),
        )

        await request(app)
            .post('/users')
            .send(validUser)
            .set('Accept', 'application/json')

        let res = await request(app)
            .get('/users')
            .query({ email: validUser.email})
            .set('Accept', 'application/json')
        expect(res.body[0]).toEqual(expect.objectContaining(validUser));
        expect(res.body[0].last_login).toBeDefined()
        expect(res.statusCode).toEqual(200);
        const user_id = res.body[0].user_id
        const id = res.body[0]._id
        expect(userStore[user_id]).toBeDefined();

        res = await request(app)
            .delete('/users/' + id)
            .set('Accept', 'application/json')
        expect(res.statusCode).not.toEqual(200);
        expect (userStore[user_id]).toBeDefined()

        let createdUser = await User.findOne({ email: validUser.email }).exec()
        expect(createdUser).toEqual(expect.objectContaining(validUser));
    })
});

describe("PATCH /user/:id", () => {
    it("modifies a user's attributes", async () => {
        await request(app)
            .post('/users')
            .send(validUser)
            .set('Accept', 'application/json')

        let res = await request(app)
            .get('/users')
            .query({ email: validUser.email})
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(200);
        const user_id = res.body[0].user_id
        const id = res.body[0]._id
        expect(userStore[user_id]).toBeDefined();

        res = await request(app)
            .patch('/users/' + id)
            .send({ "firstName": "foo", "age": 20, "horseLeading": true, bar: "baz" })
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(200);
        expect(res.body.firstName).toEqual("foo")
        expect(res.body.age).toEqual(20)
        expect(res.body.horseLeading).toEqual(true)

        // fields not in the model schema should be ignored
        expect(res.body.bar).not.toBeDefined()

        res = await request(app)
            .get('/users')
            .query({ email: validUser.email})
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(200);
        expect(res.body[0].firstName).toEqual("foo")
        expect(res.body[0].age).toEqual(20)
        expect(res.body[0].horseLeading).toEqual(true)
    })

    it("modifying a user's email or role changes the user's auth0 email or role", async () => {
        await request(app)
            .post('/users')
            .send(validUser)
            .set('Accept', 'application/json')

        let res = await request(app)
            .get('/users')
            .query({ email: validUser.email})
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(200);
        const user_id = res.body[0].user_id
        const id = res.body[0]._id
        expect(userStore[user_id]).toBeDefined();

        const newEmail = newUniqueEmail()
        res = await request(app)
            .patch('/users/' + id)
            .send({ "email": newEmail, "firstName": "foo", "age": 20, "horseLeading": true })
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(newEmail)
        expect(userStore[user_id].email).toEqual(newEmail)
        expect(res.body.firstName).toEqual("foo")
        expect(res.body.age).toEqual(20)
        expect(res.body.horseLeading).toEqual(true)

        res = await request(app)
            .patch('/users/' + id)
            .send({ isAdmin: true })
            .set('Accept', 'application/json')
        expect(userStore[user_id].isAdmin).toEqual(true)

        res = await request(app)
            .patch('/users/' + id)
            .send({ isAdmin: false })
            .set('Accept', 'application/json')
        expect(userStore[user_id].isAdmin).toEqual(false)

        res = await request(app)
            .get('/users')
            .query({ email: newEmail})
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(200);
        expect(res.body[0].email).toEqual(newEmail)
        expect(res.body[0].firstName).toEqual("foo")
        expect(res.body[0].age).toEqual(20)
        expect(res.body[0].horseLeading).toEqual(true)
    })

    it("fails if the call to Auth0 fails and doesn't modify anything", async () => {
        server.use(
          rest.patch(
            usersEndpoint + '/:id',
            async (req, res, ctx) => {
                return res(
                    ctx.json({
                        message: "could not update specified user for some reason"
                    }),
                    ctx.status(500)
                )
            },
          ),
        )

        await request(app)
            .post('/users')
            .send(validUser)
            .set('Accept', 'application/json')

        let res = await request(app)
            .get('/users')
            .query({ email: validUser.email})
            .set('Accept', 'application/json')
        expect(res.body[0]).toEqual(expect.objectContaining(validUser));
        expect(res.body[0].last_login).toBeDefined()
        expect(res.statusCode).toEqual(200);
        const user_id = res.body[0].user_id
        const id = res.body[0]._id
        expect(userStore[user_id]).toBeDefined();

        const newEmail = newUniqueEmail()
        res = await request(app)
            .patch('/users/' + id)
            .send({ "email": newEmail,
                    "firstName": "foo",
                    "age": 20,
                    "horseLeading": true })
            .set('Accept', 'application/json')
        expect(res.statusCode).not.toEqual(200);

        res = await request(app)
            .get('/users')
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(200);
        expect(res.body[0].email).toEqual(validUser.email)
    })

    it("fails if the user to be updated does not exist", async () => {
        let res = await request(app)
            .patch('/users/' + faker.database.mongodbObjectId())
            .send({ "firstName": "foo" })
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(400);
    })

    it("fails if an invalid attribute value is given", async () => {
        await request(app)
            .post('/users')
            .send(validUser)
            .set('Accept', 'application/json')

        let res = await request(app)
            .get('/users')
            .query({ email: validUser.email})
            .set('Accept', 'application/json')
        const id = res.body[0]._id
        expect(res.statusCode).toEqual(200);

        res = await request(app)
            .patch('/users/' + id)
            .send({ "firstName": "foo", "horseExperience": -20 })
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(400);
        expect(res.body.horseExperience).not.toEqual(-20)
        expect(res.body.firstName).not.toEqual("foo")
    })

})
