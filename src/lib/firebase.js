import firebase, { firestore } from '../firebase';
import { filterObjsInArr } from './utils';
//* Handles adding a new card to firestore
export const handleAddCard = (event) => {
  event.preventDefault();
  try {
    console.log(event);
    firestore.collection("cards")
      .add({
        title: event.target.title.value,
        front: event.target.front.value,
        back: event.target.back.value,
        userName: event.target.userName.value,
        // created: firebase.firestore.FieldValue.serverTimeStamp
      })
  } catch (err) {
    console.log(err)
  }
  return false;
}

//* Handles GET card data from firestore
export const handleGetCards = async () => {
  try {
    const cardCollection = await firestore.collection("cards").get().then((entry) => {
      return (entry.docs.map(x => ({
        id: x.id,
        data: x.data()
      }))
      )
    });
    return cardCollection
  } catch (err) {
    console.log(err)
  }
}


//* Handles GET saved cards for user
export const handleGetSavedCards = async () => {
  try {
    const currentUser = await firebase.auth().currentUser;
    const foundUser = await firestore.collection("users").doc(currentUser.uid).get().then((docRef) => { return docRef.data() })
      .catch((error) => { });
    const cardCollection = await firestore.collection("cards").get().then((entry) => {
      return (entry.docs.map(x => ({
        id: x.id,
        data: x.data()
      }))
      )
    });
    const userCards = filterObjsInArr(cardCollection, foundUser.savedCards);
    return userCards;
  } catch (err) {
    console.log(err)
  }
}
export const handleGetDisplayName = async () => {
  try {
    const currentUser = await firebase.auth().currentUser;
    console.log(currentUser);
    if (currentUser !== null) {
      return await currentUser.displayName
    }
    return null;
  }
  catch (err) {
    console.log(err);
  }
}
//* Intended to run after handleGetCards in order to generate a random deck off the cards db
//! Currently just sorts the whole deck data
//Todo: Implement to only generate off specfic tags
export const generateDeck = (cardArrayPassed) => {
  try {
    const tempDeck = cardArrayPassed.map(x => { return x }).sort();
    // console.log(tempDeck);
    return tempDeck;
  } catch (error) {
    console.log(error);
  }
}

//* Handles signing up
export const handleSignUp = async newUser => {
  newUser.preventDefault();
  await firebase.auth().createUserWithEmailAndPassword(newUser.target.email.value, newUser.target.password.value)
  var user = await firebase.auth().currentUser;
  await user.updateProfile({
    displayName: newUser.target.userName.value
  })
  await firestore.collection("users")
    .doc(user.uid).set({
      displayName: newUser.target.userName.value,
      savedCards: {},
      friendCode: "test", // Todo: Implement salted hash
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
  console.log(user);
}

//* Handles sign in
export const handleSignIn = async (event) => {
  console.log(event);
  event.preventDefault();
  await firebase.auth().signInWithEmailAndPassword(event.target.email.value, event.target.password.value)
    // .then((userCredential) => {
    //   var user = userCredential.user;
    // })
    .catch((error) => {
      // var errorCode = error.code;
      // var errorMessage = error.message;
      // console.log(errorMessage);
    });
}

//* Handles sign out
export const handleSignOut = async => {
  firebase.auth().signOut().then(() => {
    console.log("signout successful")
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });

}

//* Handle updating user card data
export const handleUpdatingFirestoreCards = async cardId => {

  try {
    const currentUser = await firebase.auth().currentUser;
    if (currentUser.uid !== undefined) {
      await firestore.collection("users").doc(currentUser.uid).update({ "savedCards": firebase.firestore.FieldValue.arrayUnion(cardId) })
    }
  } catch (err) {
    console.log(err)
  }

}