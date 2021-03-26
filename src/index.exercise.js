import '@reach/dialog/styles.css'
import * as React from 'react'
import ReactDOM from 'react-dom'
import Dialog from '@reach/dialog'
import {Logo} from './components/logo'

function App() {
  const [openModal, setOpenModal] = React.useState('none')
  const closeModal = () => setOpenModal('none')

  return (
    <div>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => setOpenModal('login')}>Login</button>
      </div>
      <div>
        <button onClick={() => setOpenModal('register')}>Register</button>
      </div>
      <Dialog isOpen={openModal !== 'none'} onDismiss={closeModal}>
        {openModal === 'login' && <p>Login</p>}
        {openModal === 'register' && <p>Register</p>}
      </Dialog>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
