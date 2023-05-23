import { setupServer } from 'msw/node'
import { handlers } from './Auth0handlers'

export const server = setupServer(...handlers)
