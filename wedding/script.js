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

const form = document.querySelector('form')
const button = form.querySelector('button')
const params = new URLSearchParams(window.location.search)

form.querySelector('input').value = params.get('name')

form.onsubmit = (e) => {
  e.preventDefault()

  button.disabled = true

  const data = new FormData(form)
  const date = Date.now()

  set(ref(db, `records/${date}`), Object.fromEntries(data))
    .then(() => alert('Ваши ответы записаны, Спасибо!'))
    .finally(() => {
      button.disabled = false
    })

  return 0
}
