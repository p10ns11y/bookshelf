import {server, rest} from 'test/server'
import {client} from '../api-client'

beforeAll(() => {
  server.listen()
})
afterAll(() => {
  server.close()
})
afterEach(() => {
  server.resetHandlers()
})

const apiURL = process.env.REACT_APP_API_URL

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  // arrange
  const endpoint = 'test-point'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )

  // act
  const responseData = await client(endpoint)

  // assert
  expect(responseData).toEqual(mockResult)
})

test('adds auth token when a token is provided', async () => {
  // arrange
  const token = 'fake-token'
  let request
  const endpoint = 'test-point'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    }),
  )

  // act
  await client(endpoint, {token})

  // assert
  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`)
})

test('allows for config overrides', async () => {
  // arrange
  let request
  const endpoint = 'test-point'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    }),
  )

  // act
  await client(endpoint, {headers: {'x-test': 'test-header'}})

  // assert
  expect(request.headers.get('x-test')).toBe('test-header')
})

test('when data is provided, it is stringified and the method defaults to POST', async () => {
  // arrange
  let request
  const endpoint = 'test-point'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    }),
  )
  const requestBody = {testKey: 'testValue'}

  // act
  await client(endpoint, {data: requestBody})

  // assert
  expect(request.body).toEqual(requestBody)
})
