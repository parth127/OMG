import firebase from 'firebase/app'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyASHEaE1Vma_GwpaOr_XCphkwTFY0F3AZA',
  authDomain: 'capstoneproject-omg.firebaseapp.com',
  projectId: 'capstoneproject-omg',
  storageBucket: 'capstoneproject-omg.appspot.com',
  messagingSenderId: '879137551889',
  appId: '1:879137551889:web:df8a58d09387770faae3b0',
  measurementId: 'G-THCPRHMYZ0',
}

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

export { storage, firebase as default }
