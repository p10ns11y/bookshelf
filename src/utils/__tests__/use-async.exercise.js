import {renderHook, act} from '@testing-library/react-hooks'
import {useAsync} from '../hooks'

beforeEach(() => {
  jest.spyOn(console, 'error')
})

afterEach(() => {
  console.error.mockRestore()
})

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

function getAsyncState(overrides) {
  return {
    data: null,
    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,

    error: null,
    status: 'idle',
    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
    ...overrides,
  }
}

test('calling run with a promise which resolves', async () => {
  const {promise, resolve} = deferred()
  const {result} = renderHook(() => useAsync())
  expect(result.current).toEqual(getAsyncState())
  let p
  act(() => {
    p = result.current.run(promise)
  })
  expect(result.current).toEqual(
    getAsyncState({
      status: 'pending',
      isIdle: false,
      isLoading: true,
    }),
  )
  const resolvedValue = Symbol('resolved value')
  await act(async () => {
    resolve(resolvedValue)
    await p
  })
  expect(result.current).toEqual(
    getAsyncState({
      status: 'resolved',
      data: resolvedValue,
      isIdle: false,
      isSuccess: true,
    }),
  )

  act(() => {
    result.current.reset()
  })
  expect(result.current).toEqual(getAsyncState())
})

test('calling run with a promise which rejects', async () => {
  const {promise, reject} = deferred()
  const {result} = renderHook(() => useAsync())
  expect(result.current).toEqual(getAsyncState())
  let p
  act(() => {
    p = result.current.run(promise)
  })
  expect(result.current).toEqual(
    getAsyncState({
      status: 'pending',
      isIdle: false,
      isLoading: true,
    }),
  )
  const rejectedValue = Symbol('rejected value')
  await act(async () => {
    reject(rejectedValue)
    await p.catch(() => {
      /* ignore erorr */
    })
  })
  expect(result.current).toEqual(
    getAsyncState({
      error: rejectedValue,
      status: 'rejected',
      isIdle: false,
      isError: true,
    }),
  )
})

test('can specify an initial state', () => {
  const mockData = Symbol('resolved value')
  const customInitialState = {status: 'resolved', data: mockData}
  const {result} = renderHook(() => useAsync(customInitialState))
  expect(result.current).toEqual(
    getAsyncState({
      status: 'resolved',
      data: mockData,
      isIdle: false,
      isSuccess: true,
    }),
  )
})

test('can set the data', () => {
  const mockData = Symbol('resolved value')
  const {result} = renderHook(() => useAsync())
  act(() => {
    result.current.setData(mockData)
  })
  expect(result.current).toEqual(
    getAsyncState({
      status: 'resolved',
      data: mockData,
      isIdle: false,
      isSuccess: true,
    }),
  )
})

test('can set the error', () => {
  const mockError = Symbol('rejected value')
  const {result} = renderHook(() => useAsync())
  act(() => {
    result.current.setError(mockError)
  })
  expect(result.current).toEqual(
    getAsyncState({
      status: 'rejected',
      error: mockError,
      isIdle: false,
      isError: true,
    }),
  )
})

test('No state updates happen if the component is unmounted while pending', async () => {
  const {promise, resolve} = deferred()
  const {result, unmount} = renderHook(() => useAsync())
  let p
  act(() => {
    p = result.current.run(promise)
  })
  unmount()
  await act(async () => {
    resolve()
    await p
  })
  expect(console.error).not.toHaveBeenCalled()
})

test('calling "run" without a promise results in an early error', () => {
  const {result} = renderHook(() => useAsync())
  expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
    `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`,
  )
})
