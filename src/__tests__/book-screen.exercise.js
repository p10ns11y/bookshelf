import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {queryCache} from 'react-query'
import {buildUser, buildBook} from 'test/generate'
import * as auth from 'auth-provider'
import {AppProviders} from 'context'
import {App} from 'app'

// 🐨 after each test, clear the queryCache and auth.logout
afterEach(async () => {
  queryCache.clear()
  await auth.logout()
})

test('renders all the book information', async () => {
  window.localStorage.setItem(auth.localStorageKey, 'prem-token')
  const user = buildUser()
  const book = buildBook()
  window.history.pushState({}, 'book screen', `/book/${book.id}`)
  window.fetch = async (url, config) => {
    if (url.endsWith('/bootstrap')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          user: {...user, token: 'prem-token'},
          listItems: [],
        }),
      })
    }
    if (url.endsWith(`/books/${book.id}`)) {
      return Promise.resolve({ok: true, json: async () => ({book})})
    }
  }
  render(<App />, {wrapper: AppProviders})

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByRole('heading', {name: book.title})).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.publisher)).toBeInTheDocument()
  expect(screen.getByText(book.synopsis)).toBeInTheDocument()
  expect(screen.getByRole('img', {name: /book cover/i})).toHaveAttribute(
    'src',
    book.coverImageUrl,
  )
  expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()
})
