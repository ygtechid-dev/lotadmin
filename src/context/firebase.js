// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

const firebaseConfig = {
 
    apiKey: "AIzaSyAVpHr_ZuKZgbxfEHsOJIuC8u1CEaP7jdg",
    authDomain: "lotra-4abd9.firebaseapp.com",
    projectId: "lotra-4abd9",
    storageBucket: "lotra-4abd9.firebasestorage.app",
    messagingSenderId: "271769623110",
    appId: "1:271769623110:web:71a2b760ec37522df18847",
databaseURL: "https://lotra-4abd9-default-rtdb.asia-southeast1.firebasedatabase.app/",

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Realtime Database and Storage
export const database = getDatabase(app);
export const storage = getStorage(app); // Initialize and export Firebase Storage
