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

//Keypress handlers
//Not yet implemented
export const handleKeyPress = (event) => {
  if (event.key === 'z') {
    //Freezes all items in world
    // if (event.key === 'f') {
    //   this.state.worldBodies.forEach((item) => {
    //     item.isSleeping = true;
    //   })
    // }
    if (event.key === 's') {
      // this.state.worldBodies.forEach((item) => {
      //   item.isSleeping = false;
      // })
    }
  }
}

//Handles adding a new card to firestore
export const handleAddCard = (event) => {
  event.preventDefault();
  firestore.collection("cards")
    .add({
      title: event.target.title.value,
      front: event.target.front.value,
      back: event.target.back.value
    })
    return false;
}

//Handles GET card data from firestore
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

//Intended to run after handleGetCards in order to generate a random deck off the cards db
//Currently just randomizes the order of the whole deck data
export const generateDeck = (cardArrayPassed) => {
  try {
    const tempDeck = cardArrayPassed.map(x => { return x }).sort();
    console.log(tempDeck);
    return tempDeck;
  } catch (error) {
    console.log(error);
  }
}

//Handles signing up
  export const handleSignUp = newUser => {
    newUser.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(newUser.target.email.value, newUser.target.password.value)
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: newUser.target.userName.value
    })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  }