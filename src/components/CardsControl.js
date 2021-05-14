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

  //Card currently following pointer
  const [showFollowingCard, setFollowingCard] = useState(false);

  //WIP while building app to generate more cards
  const [generateMoreCards, setGenerateMoreCards] = useState(0);

  const handleShowingLargeCardFront = (id) => {
    console.log(cardArray);
    console.log(id);
    const clickedCard = cardArray.find(e => e.id === id);
    console.log(clickedCard);
    console.log(cardArray.find(e => e.id === id));
    setLargeCardData(
      <><div className="bg-red-400">
        <h1 className="text-center text-red-500">{clickedCard.data.title}</h1>
        <h1 className="text-center">by Ruthless Butterscotch</h1>
        <br />
        <div className="ml-4 mr-4 text-sm">
          <p>{clickedCard.data.front}</p><div>
            <button className="transform hover:scale-105 z-50" onClick={() => console.log("Saving card...")}>Save it</button><span className="ml-1">👋</span>
          </div>
        </div>
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
  
  const generateDeck = (cardArrayPassed) => {
    try {
      const tempDeck = cardArrayPassed.map(x => {return x});
      // for (let i = 0; i < 7; i++) {"
      //   let randomNumber = Math.floor(Math.random() * cardArrayPassed.length);
      //   console.log(cardArrayPassed[randomNumber])
      //   tempDeck.push(cardArrayPassed[randomNumber]);"
        console.log(tempDeck);
      // }

      return tempDeck;
    } catch (error) {
      console.log(error);
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'z') {
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

  //Generates a random username in SignUp component
  const generateRandomName = () => {
    let firstArr = ["ruthless", "smart", "eager", "envious", "energetic", "joyous", "shiny", "sleepy"]
    let secondArr = ["buttercotch", "sardine", "iguana", "walrus", "rhinoceros", "kitten", "albatross"]
    let randomNumber = Math.floor(Math.random() * (firstArr.length));
    let randomNumber2 = Math.floor(Math.random() * (secondArr.length));
    let name = firstArr[randomNumber] + "_" + secondArr[randomNumber2];
    return name;
  }

  //Call functions to fetch firestore data upon component mount
  useEffect(() => {
    console.log("re-rendered")
    const fetchData = async () => {
      const cardCollection = await handleGetCards();
      setCardArray(cardCollection);
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log("re-renderedx2")
    setCardArray(cardArray.sort(() => Math.random() - 0.5))
    if(cardArray.length > 7) {
    const trimmedCollection = generateDeck(cardArray);
    console.log(trimmedCollection);
    setCurrentDeck(trimmedCollection);
    setTimeout(
      () => {console.log("timeout fired")
      setGenerateMoreCards()}, 
      6000
    );
    
  }
  }, [cardArray, generateMoreCards])

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
            showFollowingCard={showFollowingCard}
            setFollowingCard={setFollowingCard}
            showCard={showCard}
            cardArray={cardArray}
            setShowCard={setShowCard}
            currentDeck={currentDeck}
            setCurrentDeck={setCurrentDeck}
            getCards={handleGetCards}
            generateDeck={generateDeck}
            handleKeyPress={handleKeyPress}
            setGenerateMoreCards ={setGenerateMoreCards}
            generateMoreCard ={generateMoreCards}
            largeCardData={largeCardData} />
        </div>
      </div>
    </>
  );
}
export default CardsControl;
