import {useQuery} from 'react-query'
import {client} from 'utils/api-client'

export function useBook(bookId, user) {
  return useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user.token}).then(data => data.book),
  })
}

export function useBookSearch(query, user) {
  return useQuery({
    queryKey: ['bookSearch', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`, {
        token: user.token,
      }).then(data => data.books),
  })
}
