import firebase, { firestore, auth } from '../firebase';

//Generates a random username
export const generateRandomName = () => {
  let firstArr = ["ruthless", "smart", "eager", "envious", "energetic", "joyous", "shiny", "sleepy"]
  let secondArr = ["butterscotch", "sardine", "iguana", "walrus", "rhinoceros", "kitten", "albatross"]
  let randomNumber = Math.floor(Math.random() * (firstArr.length));
  let randomNumber2 = Math.floor(Math.random() * (secondArr.length));
  let name = firstArr[randomNumber] + "_" + secondArr[randomNumber2];
  return name;
}

//* Handles adding a new card to firestore
export const handleAddCard = (event) => {
  event.preventDefault();
  try {
  firestore.collection("cards")
    .add({
      title: event.target.title.value,
      front: event.target.front.value,
      back: event.target.back.value,
      created: firebase.firestore.FieldValue.serverTimeStamp
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

//* Intended to run after handleGetCards in order to generate a random deck off the cards db
//! Currently just sorts the whole deck data
//Todo: Implement to only generate off specfic tags
export const generateDeck = (cardArrayPassed) => {
  try {
    const tempDeck = cardArrayPassed.map(x => { return x }).sort();
    console.log(tempDeck);
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
  user.updateProfile({
    displayName: newUser.target.userName.value
  })
  firestore.collection("users")
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

//* Handle updating user card data
export const handleUpdatingFirestoreCards = async cardId => {

  try {
    const currentUser = await firebase.auth().currentUser;
    if (currentUser.uid != undefined) {
      await firestore.collection("users").doc(currentUser.uid).update({ "savedCards" : firebase.firestore.FieldValue.arrayUnion(cardId)})
    }
  } catch (err) {
    console.log(err)
  }

}
// *Check device size for responsiveness
export const deviceDetect = () => {
  const userAgent =
    typeof window.navigator === "undefined" ? "" :
      navigator.userAgent;
  if (userAgent != "") {
    const mobile = Boolean(userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera|Mini|IEMobile|WPDesktop/i
    )
    );
    return mobile
  }
  else {
    return false;
  }
}