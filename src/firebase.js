import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore/lite';
import lang from './language';


const firebaseConfig = {
    apiKey: "AIzaSyCmbuULltMhgN7Aka3nf-aW_nxbUaBraLk",
    authDomain: "private-note-ffa81.firebaseapp.com",
    projectId: "private-note-ffa81",
    storageBucket: "private-note-ffa81.appspot.com",
    messagingSenderId: "128581451587",
    appId: "1:128581451587:web:a0382dc0fa8af1e361b9f6",
    measurementId: "G-CKEQ0XBEV0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const random = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

async function addNote(message) {
    const secretkey = random(8);
    const created = (() => {
        const date = new Date();
        return date.setTime(date.getTime());
    })();
    try {
        const data = await addDoc(collection(db, "notes-lite"), {
            note: message,
            secret: secretkey,
            created: created,
        });
        return {
            action: 'create-note',
            status: 'success',
            message: {
                id: data.id,
                secret: secretkey,
            }
        };
    } catch (error) {
        console.error(error);
        return {
            action: 'create-note',
            status: 'failed',
            message: lang.error.unknown,//error,
        };
    }
};

async function getNote(id, key) {
    const docRef = doc(db, 'notes-lite', id);
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.secret === key) {
                return {
                    action: 'get-note',
                    status: 'success',
                    message: data,
                };
            } else {
                return {
                    action: 'get-note',
                    status: 'failed',
                    message: lang.error.invalid,
                };
            }
        } else {
            return {
                action: 'get-note',
                status: 'failed',
                message: lang.error.notexist,
            };
        }
    } catch (error) {
        console.error(error);
        return {
            action: 'get-note',
            status: 'failed',
            message: lang.error.unknown,//error,
        };
    }
};

export {
    addNote,
    getNote,
};