import {formatDate} from '../misc'

test('formatDate formats the date to look nice', () => {
  // arrange
  const date = new Date('2021-05-09')

  // assert
  expect(formatDate(date)).toBe('May 21')
})
