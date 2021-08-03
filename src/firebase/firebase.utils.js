import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyABSkGgsgSIS2RGO5xsfcm1sdRwkcDXsQY',
  authDomain: 'live-now-db.firebaseapp.com',
  projectId: 'live-now-db',
  storageBucket: 'live-now-db.appspot.com',
  messagingSenderId: '1057130403069',
  appId: '1:1057130403069:web:0bfe8bbea5d50121d1da94',
  measurementId: 'G-03Z28P1QBN',
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();
  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createAt,
        photos: [],
        ...additionalData,
      });
    } catch (error) {
      console.log('error creating user', error.message); // eslint-disable-line no-console
    }
  }

  return userRef; // eslint-disable-line consistent-return
};

export const allPhotos = async () => {
  const photos = [];

  const docRef = firestore.collection('users').doc('allPhotos');
  const doc = await docRef.get();

  if (doc.exists) {
    const docData = doc.data().photos;
    for (let i = 0; i < docData.length; i += 1) {
      photos.push(docData[i]);
    }
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!'); // eslint-disable-line no-console
  }

  return photos;
};

export const addPhoto = (userId, objectsToAdd, photo) => {
  firestore.collection('users').doc(userId).update({
    photos: firebase.firestore.FieldValue.arrayUnion(objectsToAdd),
  });
  firestore.collection('users').doc('allPhotos').update({
    photos: firebase.firestore.FieldValue.arrayUnion(photo),
  });
};

export const deletePrivatePhoto = (userId, objectsToDelete) => {
  firestore.collection('users').doc(userId).update({
    photos: firebase.firestore.FieldValue.arrayRemove(objectsToDelete),
  });
};

export const deletePublicPhoto = (objectsToDelete) => {
  firestore.collection('users').doc('allPhotos').update({
    photos: firebase.firestore.FieldValue.arrayRemove(objectsToDelete),
  });
};

export const addReaction = (objectsToAdd) => {
  firestore.collection('users').doc('allPhotos').update({
    photos: firebase.firestore.FieldValue.arrayUnion(objectsToAdd),
  });
};

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ promt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
