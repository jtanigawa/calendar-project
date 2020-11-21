import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyCNeAvWXH87tiJ6tKTFQ_WfgU3g8tVdZ5U",
  authDomain: "calendar-db-554d9.firebaseapp.com",
  databaseURL: "https://calendar-db-554d9.firebaseio.com",
  projectId: "calendar-db-554d9",
  storageBucket: "calendar-db-554d9.appspot.com",
  messagingSenderId: "87813503312",
  appId: "1:87813503312:web:2e3e7becdee55fd2c71455",
  measurementId: "G-HYBNB1CCP9"
};


export const createUserProfileDocument = async (userAuth, additionalData) => {
  // if there's no userAuth
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();
  // user doc doesn't exist
  if(!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    const currentMo = createdAt.getMonth();
    const createdMo = currentMo > 9 ? currentMo : "0" + currentMo;
    const createdYr = createdAt.getFullYear();
    const currentYrMo = createdYr + '' + createdMo;

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        calendar: {
          [currentYrMo]: []
        },
        ...additionalData
      })
    }catch (error) {
      console.log('Error creating user', error.message);
    }
  }

  return userRef;
}

export const addEventToCalendar = async (userAuth, additionalData) => {
  // if there's no userAuth
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.id}`);
  const snapShot = await userRef.get();

  if (snapShot.exists) {

    const {yrMo, day, eventName, startTime, endTime, guestEmail, description} = additionalData;

    let event = {};
    event['name'] = eventName;
    event['day'] = day;
    event['start'] = startTime;
    event['end'] = endTime;
    event['guestEmail'] = guestEmail;
    event['description'] = description;

    let user = snapShot.data();
    let ucal = user.calendar;
    // checks if month is not in calendar
    if (!(yrMo in ucal)) {
      // adds month to calendar
      ucal[yrMo] = [];
    }
    //add event to calendar
    ucal[yrMo].push(event);
    //console.log(ucal);

    try {
      await userRef.update({
        calendar: ucal
      })
    }catch (error) {
      console.log('Error adding event', error.message);
    }
  }
  return;
}

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
// Google signin pop up
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account'});
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;