import '@reach/dialog/styles.css'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {Dialog} from '@reach/dialog'
import {Logo} from './components/logo'

function LoginForm(props) {
  const handleSubmit = event => {
    event.preventDefault()

    const {
      username: usernameInput,
      password: passwordInput,
    } = event.target.elements

    props.onSubmit({
      username: usernameInput.value,
      password: passwordInput.value,
    })
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" />
      <input type="password" name="password" />
      <button type="submit">{props.buttonText}</button>
    </form>
  )
}

function App() {
  const [openModal, setOpenModal] = React.useState('none')

  function closeModal() {
    return setOpenModal('none')
  }

  function login(formData) {
    console.log('login', formData)
  }

  function register(formData) {
    console.log('register', formData)
  }

  return (
    <div>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div>
        <button type="button" onClick={() => setOpenModal('login')}>
          Login
        </button>
      </div>
      <div>
        <button type="button" onClick={() => setOpenModal('register')}>
          Register
        </button>
      </div>
      <Dialog
        aria-label="Login form"
        isOpen={openModal === 'login'}
        onDismiss={closeModal}
      >
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Login</h3>
        <LoginForm onSubmit={login} buttonText="Login" />
      </Dialog>
      <Dialog
        aria-label="Registration form"
        isOpen={openModal === 'register'}
        onDismiss={closeModal}
      >
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Register</h3>
        <LoginForm onSubmit={register} buttonText="Register" />
      </Dialog>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
