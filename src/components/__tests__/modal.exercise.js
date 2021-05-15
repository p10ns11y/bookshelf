import * as React from 'react'
import {render, screen, within} from '@testing-library/react'
import user from '@testing-library/user-event'
import {Modal, ModalContents, ModalOpenButton} from '../modal'

test('can be opened and closed', () => {
  // arrange
  render(
    <Modal>
      <ModalOpenButton>
        <button type="button">Open modal</button>
      </ModalOpenButton>
      <ModalContents aria-label="Modal label" title="Modal title">
        <div>Content</div>
      </ModalContents>
    </Modal>,
  )

  // act
  user.click(screen.getByRole('button', {name: /open modal/i}))

  // assert
  expect(screen.getByText(/content/i)).toBeInTheDocument()
  expect(
    screen.getByRole('heading', {name: /modal title/i}),
  ).toBeInTheDocument()
  expect(screen.getByRole('dialog')).toHaveAttribute(
    'aria-label',
    'Modal label',
  )

  // act
  user.click(
    within(screen.getByRole('dialog')).getByRole('button', {name: /close/i}),
  )

  // assert
  expect(screen.queryByText(/content/i)).not.toBeInTheDocument()
})
