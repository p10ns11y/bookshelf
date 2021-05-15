import {renderHook, act} from '@testing-library/react-hooks'
import {useAsync} from '../hooks'

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

// Use it like this:
// const {promise, resolve} = deferred()
// promise.then(() => console.log('resolved'))
// do stuff/make assertions you want to before calling resolve
// resolve()
// await promise
// do stuff/make assertions you want to after the promise has resolved

// 🐨 flesh out these tests
test('calling run with a promise which resolves', async () => {
  const {promise, resolve} = deferred()
  const {result} = renderHook(() => useAsync())

  expect(result.current).toEqual({
    status: 'idle',
    data: null,
    error: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),

    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,
  })

  let pendingPromise
  act(() => {
    pendingPromise = result.current.run(promise)
  })

  expect(result.current).toEqual({
    status: 'pending',
    data: null,
    error: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),

    isIdle: false,
    isLoading: true,
    isError: false,
    isSuccess: false,
  })

  await act(async () => {
    resolve('resolved-value')
    await pendingPromise
  })

  expect(result.current).toEqual({
    status: 'resolved',
    data: 'resolved-value',
    error: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),

    isIdle: false,
    isLoading: false,
    isError: false,
    isSuccess: true,
  })

  act(() => {
    result.current.reset()
  })

  expect(result.current).toEqual({
    status: 'idle',
    data: null,
    error: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),

    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,
  })
})

test('calling run with a promise which rejects', async () => {
  const {promise, reject} = deferred()
  const {result} = renderHook(() => useAsync())

  expect(result.current).toEqual({
    status: 'idle',
    data: null,
    error: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),

    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,
  })

  let pendingPromise
  act(() => {
    pendingPromise = result.current.run(promise)
  })

  expect(result.current).toEqual({
    status: 'pending',
    data: null,
    error: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),

    isIdle: false,
    isLoading: true,
    isError: false,
    isSuccess: false,
  })

  await act(async () => {
    reject('rejected message')
    const noop = () => {}
    await pendingPromise.catch(noop)
  })

  expect(result.current).toEqual({
    status: 'rejected',
    data: null,
    error: 'rejected message',

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),

    isIdle: false,
    isLoading: false,
    isError: true,
    isSuccess: false,
  })
})

test('can specify an initial state', () => {
  const {result} = renderHook(() => useAsync({status: 'pending'}))

  expect(result.current).toEqual({
    status: 'pending',
    data: null,
    error: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),

    isIdle: false,
    isLoading: true,
    isError: false,
    isSuccess: false,
  })
})

test('can set the data', () => {
  const {result} = renderHook(() => useAsync())

  act(() => {
    result.current.setData('new data value')
  })

  expect(result.current).toEqual({
    status: 'resolved',
    data: 'new data value',
    error: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),

    isIdle: false,
    isLoading: false,
    isError: false,
    isSuccess: true,
  })
})
// 💰 result.current.setData('whatever you want')

test('can set the error', () => {
  const {result} = renderHook(() => useAsync())

  act(() => {
    result.current.setError('error value')
  })

  expect(result.current).toEqual({
    status: 'rejected',
    data: null,
    error: 'error value',

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),

    isIdle: false,
    isLoading: false,
    isError: true,
    isSuccess: false,
  })
})

test('No state updates happen if the component is unmounted while pending', async () => {
  jest.spyOn(console, 'error')
  const {promise, resolve} = deferred()
  const {result, unmount} = renderHook(() => useAsync())

  let pendingPromise
  act(() => {
    pendingPromise = result.current.run(promise)
  })

  unmount()

  await act(async () => {
    resolve('resolve after component unmount')
    await pendingPromise
  })

  expect(result.current).toEqual({
    status: 'pending',
    data: null,
    error: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),

    isIdle: false,
    isLoading: true,
    isError: false,
    isSuccess: false,
  })
  expect(console.error).not.toHaveBeenCalled()

  console.error.mockRestore()
})

test('calling "run" without a promise results in an early error', () => {
  const {result} = renderHook(() => useAsync())

  expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
    `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`,
  )
})
