import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js'
import {
  getDatabase,
  ref,
  set
} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js'

const FIREBASE_CONFIG = {
  databaseURL:
    'https://wedding-d4cef-default-rtdb.europe-west1.firebasedatabase.app/'
}

const app = initializeApp(FIREBASE_CONFIG)
const db = getDatabase(app)

const formContainer = document.querySelector('#formContainer')
const form = formContainer.querySelector('form')
const params = new URLSearchParams(window.location.search)

form.querySelector('input').value = params.get('name')

form.onsubmit = (e) => {
  e.preventDefault()

  formContainer.classList.add('loading')

  const data = new FormData(form)
  const date = Date.now()

  set(ref(db, `records/${date}`), Object.fromEntries(data))
    .then(() => {
      formContainer.innerHTML =
        '<h2 class="center">Спасибо, Ваша анкета принята!</h2>'
    })
    .catch(() => {
      alert('Что-то пошло не так, попробуйте еще раз')
    })
    .finally(() => {
      formContainer.classList.remove('loading')
    })

  return 0
}
