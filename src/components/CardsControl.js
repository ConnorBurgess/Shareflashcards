import '../App.css';
import NavBar from './NavBar';
import Scene from './Scene';
import ToolTip from './ToolTip';
import AddCard from './AddCard';
import SignIn from './SignIn';
import SignUp from './SignUp';
import firebase, { firestore, auth } from '../firebase';
import react, { useState, useEffect, useRef } from 'react';
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);



function CardsControl() {
  //Handle display of different components
  const [showToolTip, setShowToolTip] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showSignUp, setShowSignUp] = useState(true);
  const [showSignIn, setShowSignIn] = useState(false);

  //CardArray holds all of DB card
  const [cardArray, setCardArray] = useState([{}]);

  //currentDeck holds a smaller generated deck off of cardArray
  const [currentDeck, setCurrentDeck] = useState([]);
  const [showLargeCard, setShowLargeCard] = useState(false);

  //Card currently following pointer
  const [showFollowingCard, setFollowingCard] = useState(false);

  //Holds card data which is updated when card is enlarged
  const [largeCardData, setLargeCardData] = useState(<>
    <h1 className="text-center text-">Placeholder Flashcard</h1>
    <h1 className="text-center">by Ruthless Butterscotch</h1>
    <br />
    <div className="ml-4 mr-4 text-sm">
      <p>Why did the chicken cross the road?</p>
      <p classname="">{showLargeCard ? "Click to view " : null}</p>
    </div>
  </>);

  //WIP to generate more cards
  const [currentlyGeneratingCards, setCurrentlyGeneratingCards] = useState(false);

  //Boost for more cards
  const [generateMoreCards, setGenerateMoreCards] = useState(1);

  //Generates a new username when user clicks button
  const [userName, setUserName] = useState(null);


  //Draggable element refs
  //put refs in an array later
  const draggableRefs = useRef([])
  const draggableToolTip = useRef(null);
  const draggableSignIn = useRef(null);
  const draggableSignUp = useRef(null);
  const draggableAddCard = useRef(null);

  const appBox = useRef(null);

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
        <div className="ml-4 mr-4">
          <p>{clickedCard.data.front}</p><div>
            <button className="transform hover:scale-105 z-50" onClick={() => console.log("Saving card...")}>Save it</button><span className="ml-1">👋</span>
            <button className="absolute md:left-2/3 sm:left-2/4 my-3   text-bold transform hover:scale-105 z-0">testtttt cards</button>

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
  const handleSignUp = newUser => {
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
        //Popup tooltip with error and reload signup module if error occurs
        setShowSignUp(true);
        setShowToolTip(true);
      });
    setShowSignUp(false);
    var user = auth.currentUser;
    console.log(user);

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
      const tempDeck = cardArrayPassed.map(x => { return x }).sort();
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
    let secondArr = ["butterscotch", "sardine", "iguana", "walrus", "rhinoceros", "kitten", "albatross"]
    let randomNumber = Math.floor(Math.random() * (firstArr.length));
    let randomNumber2 = Math.floor(Math.random() * (secondArr.length));
    let name = firstArr[randomNumber] + "_" + secondArr[randomNumber2];
    return name;
  }

  //Call functions to fetch firestore data upon component mount
  //Also makes components draggable
  useEffect(() => {
    Draggable.create(draggableToolTip.current, {
      bounds: appBox.current,
      throwProps: true
    });
    Draggable.create(draggableAddCard.current, {
      bounds: appBox.current,
      throwProps: true
    });
    Draggable.create(draggableSignUp.current, {
      bounds: appBox.current,
      throwProps: true
    });
    Draggable.create(draggableSignIn.current, {
      bounds: appBox.current,
      throwProps: true
    });
    console.log("re-rendered")
    const fetchData = async () => {
      const cardCollection = await handleGetCards();
      setCardArray(cardCollection);
    }
    fetchData();
  }, []);

  useEffect(() => {

  }, draggableToolTip)

  useEffect(() => {
    console.log("re-renderedx2")
    setCardArray(cardArray.sort(() => Math.random() - 0.5))
    if (cardArray.length > 7) {
      const trimmedCollection = generateDeck(cardArray);
      console.log(trimmedCollection);
      setCurrentDeck(trimmedCollection);
      let randomTime = Math.floor(Math.random() * (30000 - 7000 + 1)) + 7000
      setTimeout(
        () =>
          setGenerateMoreCards(prevState => prevState + 1),
        randomTime
      );
    }

  }, [cardArray, generateMoreCards])

  return (
    <>
      <div ref={appBox}>
        {/* <div className="z-50"><NavBar /></div> */}
        {/* <div ref={draggableSignIn} className="absolute z-50"><SignIn/></div> */}
        <div className="">
          <div ref={draggableToolTip} className="z-50 left-52 md:absolute">
            {showToolTip ? <ToolTip
              setShowToolTip={setShowToolTip} /> : null}</div>

          <div ref={draggableAddCard} className="z-40 md:absolute md:top-9 md:left-1/4 drag">
            {showAddCard ? <AddCard
              addCard={handleAddCard}
              setShowAddCard={setShowAddCard} />
              : null} </div>

          <div ref={draggableSignUp} className="absolute m-20 z-30 lg:left-1/3 md:m-8 lg:top-6 lg:w-1/4 md:w-1/3 sm:w-1/3">
            {/*setShowSignUp can be removed later*/}
            {/* {auth.currentUser != null ? setShowSignUp(true) : null  } */
              console.log(auth.currentUser)}
            {showSignUp ? <SignUp
              handleSignUp={handleSignUp}
              setShowSignUp={setShowSignUp}
              setUserName={setUserName}
              userName={userName}
              generateRandomName={generateRandomName} />
              : null}</div>
          <div className="z-0">
            <Scene
              cardArray={cardArray}
              handleShowingLargeCardFront={handleShowingLargeCardFront}
              //Determines whether actual card is visible after clicking or not
              showFollowingCard={showFollowingCard}
              setFollowingCard={setFollowingCard}
              showLargeCard={showLargeCard}
              setShowLargeCard={setShowLargeCard}
              currentDeck={currentDeck}
              setCurrentDeck={setCurrentDeck}
              getCards={handleGetCards}
              generateDeck={generateDeck}
              handleKeyPress={handleKeyPress}
              //Press button to generate more cards
              setGenerateMoreCards={setGenerateMoreCards}
              //Turn card generation on or off
              setCurrentlyGeneratingCards={setCurrentlyGeneratingCards}
              largeCardData={largeCardData} />
          </div>
        </div>
      </div>
    </>
  );
}
export default CardsControl;
