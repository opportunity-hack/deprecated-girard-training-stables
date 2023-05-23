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

var userStore: userMap = {}

const ApiUrl = `https://${process.env.AUTH0_DOMAIN}/api/v2`
const usersEndpoint = `${ApiUrl}/users`;
const adminUsersEndpoint = `${ApiUrl}/roles/${process.env.AUTH0_ADMIN_ROLE_ID}/users`;

export const handlers = [
  rest.get(usersEndpoint, mockGetUsers),
  rest.post(usersEndpoint, mockPostUsers),
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

function mockGetAdmins(req, res, ctx) {
  const adminUsers = Object.values(userStore).filter(user => user.isAdmin)
  return res(
    ctx.status(200),
    ctx.json(adminUsers)
  )
}

function mockSetAdmin(req, res, ctx) {
  const { user_id } = req.params
  userStore[user_id].isAdmin = true
  return res(
    ctx.status(200),
    ctx.json({message:"success"})
  )
}
