import { rest } from 'msw'
import dotenv from 'dotenv'
import { faker } from '@faker-js/faker'

dotenv.config();

interface Auth0User {
  user_id: string,
  email: string,
  last_login: string | Date,
  isAdmin?: boolean,
}

interface userMap {
  [key: string]: Auth0User
}

export var userStore: userMap = {}

const ApiUrl = `https://${process.env.AUTH0_DOMAIN}/api/v2`
const usersEndpoint = `${ApiUrl}/users`;
const adminUsersEndpoint = `${ApiUrl}/roles/${process.env.AUTH0_ADMIN_ROLE_ID}/users`;

export const handlers = [
  rest.get(usersEndpoint, mockGetUsers),
  rest.post(usersEndpoint, mockPostUsers),
  rest.put(usersEndpoint + '/:user_id', mockUpdateUser),
  rest.delete(usersEndpoint + '/:user_id', mockDeleteUser),
  rest.get(adminUsersEndpoint, mockGetAdmins),
  rest.post(adminUsersEndpoint, mockSetAdmin),
]

async function mockPostUsers(req, res, ctx) {
  const user: Auth0User = await req.json()
  const newAuth0User = {
    user_id: user.user_id,
    email: user.email,
    last_login: faker.date.past()
  }
  userStore[user.user_id] = newAuth0User;
  req.body
  return res(
    ctx.status(201),
    ctx.json(user),
  )
}

function mockGetUsers(req, res, ctx) {
  return res(
    ctx.status(200),
    ctx.json(
      Object.values(userStore)
    )
  )
}

function mockUpdateUser(req, res, ctx) {
  const { user_id } = req.params;
  if (!(user_id in userStore)) {
    return res(
      ctx.status(404),
      ctx.json({
          "statusCode": 404,
          "error": "Not Found",
          "message": "The user does not exist.",
          "errorCode": "inexistent_user"
      })
    )
  }

  // email is the only thing about the Auth0 user entity
  // that we ever need to modify for our usecase so this
  // is the only thing we mock out
  userStore[user_id].email = req.body.email
  return res(
    ctx.status(200),
    ctx.json(userStore[user_id]),
  )
}

function mockDeleteUser(req, res, ctx) {
  const { user_id } = req.params;

  // as long as the user_id has the right format, the real
  // Auth0 API doesn't actually care if the user to be deleted
  // exists or not
  delete userStore[user_id]
  return res(
    ctx.set('cache-control', 'no-cache'),
    ctx.set('content-type', 'application/json; charset=utf-8'),
    ctx.status(204),
  )
}

function mockGetAdmins(req, res, ctx) {
  const adminUsers = Object.values(userStore).filter(user => user.isAdmin)
  return res(
    ctx.status(200),
    ctx.json(adminUsers)
  )
}

function mockSetAdmin(req, res, ctx) {
  const user_ids = req.params
  user_ids.forEach(user_id => {userStore[user_id].isAdmin = true})
  return res(
    ctx.status(200),
    ctx.json({message:"success"})
  )
}
