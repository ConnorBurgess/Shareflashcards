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
  //Holds card data which is updated when card is enlarged
  const [largeCardData, setLargeCardData] = useState(<>
    <h1 className="text-center text-">Placeholder Flashcard</h1>
    <h1 className="text-center">by Ruthless Butterscotch</h1>
    <br />
    <div className="ml-4 mr-4 text-sm">
      <p>Why did the chicken cross the road?</p>
      <p classname="">{showCard ? "Click to view " : null}</p>
    </div>
  </>);


  // Handles setting data from child components
  // const handleShownDeck = (val) => {
  //   if (val != null) {
  //     setShownDeck(prevState => { return [...prevState, val] });
  //   }
  //   return shownDeck
  // }

  const handleShowingLargeCardFront = (id) => {
    console.log(cardArray);
    console.log(cardArray.filter(e => e.id === id));
    const clickedCard = cardArray.find(e => e.id === id);
    console.log(cardArray.find(e => e.id === id));
    setLargeCardData(
      <>
        <h1 className="text-center text-">{clickedCard.data.title}</h1>
        <h1 className="text-center">by Ruthless Butterscotch</h1>
        <br />
        <div className="ml-4 mr-4 text-sm">
          <p>{clickedCard.data.front}</p>
          <p classname="">{showCard ? "Click to view " : null}</p>
        </div>
      </>)
  }

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

  //Runs after handleGetCards in order to generate a deck off the cards db (have to sync up with localstorage)
  //note: later fix to not mutate array, instead map/randomize and return new azrray
  const generateDeck = async (currentDeck) => {
    try {
      for (let i = 0; i < 5; i++) {
        let randomNumber = Math.floor(Math.random() * (cardArray.length - 1));
        console.log(cardArray);
        setCurrentDeck(currentDeck.push(cardArray[randomNumber]));
        // cardArray.splice(randomNumber, 1);
      }
      return currentDeck;
    } catch (error) {
      console.log(error);
    }
  }

  const handleKeyPress = async (event) => {
    if (event.key === 'z') {
      await handleGetCards();
      console.log(cardArray);
      await generateDeck();
      console.log(cardArray);
      console.log(currentDeck);
      //Freezes all items in world
      // if (event.key === 'f') {
      //   this.state.worldBodies.forEach((item) => {
      //     item.isSleeping = true;
      //   })
      // }
      if (event.key === 'g') {
        // this.state.worldBodies.forEach((item) => {
        //   item.isSleeping = false;
        // })
      }
    }
  }
  useEffect(() => {
    console.log(cardArray)
  }, [cardArray]);

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
    console.log("re-rendered")
    console.log(cardArray)
  }, [cardArray]);

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
          <Scene
            handleShowingLargeCardFront={handleShowingLargeCardFront}
            showCard={showCard}
            cardArray={cardArray}
            setShowCard={setShowCard}
            currentDeck={currentDeck}
            setCurrentDeck={setCurrentDeck}
            getCards={handleGetCards}
            generateDeck={generateDeck}
            handleKeyPress={handleKeyPress}
            largeCardData={largeCardData} />
        </div>
      </div>
    </>
  );
}
export default CardsControl;
