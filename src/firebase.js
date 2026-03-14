import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCE3L93oc7pRYk-Zzd7zxY3Cpy07M_JZ6Q',
  authDomain: 'expensemanager-ce83d.firebaseapp.com',
  databaseURL: 'https://expensemanager-ce83d-default-rtdb.firebaseio.com',
  projectId: 'expensemanager-ce83d',
  storageBucket: 'expensemanager-ce83d.firebasestorage.app',
  messagingSenderId: '594470810198',
  appId: '1:594470810198:web:60c5d995b7aab932dc41f7',
}

const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)
export const storage = getStorage(app)
