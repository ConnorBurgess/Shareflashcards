import '../App.css';
import NavBar from './NavBar';
import Scene from './Scene';
import ToolTip from './ToolTip';
import AddCard from './AddCard';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { firestore, auth } from '../firebase';
import react, { useState, useEffect } from 'react';

function CardsControl() {
  //Handle display of different components
  const [showToolTip, setShowToolTip] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  //CardArray holds all of DB card
  const [cardArray, setCardArray] = useState([{}]);

  //currentDeck holds a smaller generated deck off of cardArray
  const [currentDeck, setCurrentDeck] = useState([]);
  const [showCard, setShowCard] = useState(false);

  //After card is generated into matter world shownDeck holds that card's data
  const [shownDeck, setShownDeck] = useState([]);

  // Handles setting data from child components

  const handleShownDeck = (val) => {
      setShownDeck(prevState => {return [...prevState, val]});
    console.log(shownDeck);
    return shownDeck
  }



  console.log(shownDeck);
  //Handles adding a new card to firestore
  const handleAddCard = event => {
    event.preventDefault();
    setShowAddCard(false);
    firestore.collection("cards")
      .add({
        title: event.target.title.value,
        front: event.target.front.value,
        back: event.target.back.value
      })
  }

  //Handles signing up 
  const handleSignUp = userInfo => {
    console.log("test")
  }

  //Handles GET card data from firestore
  const handleGetCards = async () => {
    try {
      await firestore.collection("cards").get().then((entry) => {
        entry.forEach(doc => {
          setCardArray(cardArray.push({ id: doc.id, data: doc.data() }))
        })
      });
    } catch (err) {
      console.log(err)
    }
  }

  //Runs after handleGetCards in order to generate a deck off the cards db (CB note: have to sync up with localstorage)
  const generateDeck = async () => {
    try {
      for (let i = 0; i < 5; i++) {
        let randomNumber = Math.floor(Math.random() * (cardArray.length));
        setCurrentDeck(currentDeck.push(cardArray[randomNumber]));
        cardArray.splice(randomNumber, 1);
      }
      return currentDeck;
    } catch (error) {
      console.log(error);
    }
  }


  //Generates a random username in SignUp component
  const generateRandomName = () => {
    let firstArr = ["ruthless", "smart", "eager", "envious", "energetic", "joyous", "shiny", "sleepy"]
    let secondArr = ["buttercotch", "sardine", "iguana", "walrus", "rhinoceros", "kitten", "albatross"]
    let randomNumber = Math.floor(Math.random() * (firstArr.length));
    let randomNumber2 = Math.floor(Math.random() * (secondArr.length));
    let name = firstArr[randomNumber] + "_" + secondArr[randomNumber2];
    return name;
  }

  useEffect(() => {
  },[]);
  return (
    <>
      <div className="z-50"><NavBar /></div>
      {/* <div className="absolute z-50"><SignIn/></div> */}
      <div className=" border-gray-800">

        <div className="left-52 z-45 md:absolute border-red-400 border-4">
          {showToolTip ? <ToolTip
            setShowToolTip={setShowToolTip} /> : null}</div>
        <div className="z-50 md:absolute md:top-9 md:left-2/4">

          {showAddCard ? <AddCard
            addCard={handleAddCard}
            setShowAddCard={setShowAddCard} />
            : null} </div>

        <div className="absolute z-50 right-72 top-20 border-red-400 border-4">
          {showSignUp ? <SignUp
            handleSignUp={handleSignUp}
            setShowSignUp={setShowSignUp}
            tempName={generateRandomName} />
            : null}</div>

        <div className="md:absolute z-0 ">
          <Scene shownDeck={shownDeck}
            setShownDeck={setShownDeck}
            handleShownDeck={handleShownDeck}
            showCard={showCard}
            setShowCard={setShowCard}
            currentDeck={currentDeck}
            setCurrentDeck={setCurrentDeck}
            getCards={handleGetCards}
            generateDeck={generateDeck} />
        </div>
      </div>
    </>
  );
}
export default CardsControl;
