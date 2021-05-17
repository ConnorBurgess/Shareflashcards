import '../App.css';
import NavBar from './NavBar';
import Scene from './Scene';
import ToolTip from './ToolTip';
import AddCard from './AddCard';
import SignIn from './SignIn';
import SignUp from './SignUp';
import firebase, { firestore, auth } from '../firebase';
import react, { useState, useEffect, useRef } from 'react';
import {generateRandomName, handleAddCard, handleKeyPress, handleGetCards, generateDeck, handleSignUp} from './utils';
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

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
  const [showLargeCard, setShowLargeCard] = useState(false);

  //Card currently following pointer
  const [showFollowingCard, setFollowingCard] = useState(false);

  //Holds card data which is updated when card is enlarged
  const [largeCardData, setLargeCardData] = useState(<>
    <h1 className="text-center text-">About Card Hunts</h1>
    <h1 className="text-center"><a href="github.com/ConnorBurgess">Connor Burgess</a></h1>
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
    console.log("showing front")
    const clickedCard = cardArray.find(e => e.id === id);
    if (clickedCard != undefined) {
    setLargeCardData(
      <><div className="border-4">
        <h1 className="text-center text-white">{clickedCard.data.title}</h1>
        <h1 className="text-center">by Ruthless Butterscotch</h1>
        <br />
        <div className="ml-4 mr-4 border-4 flex w-auto">
         {clickedCard.data.front}
        </div>
      </div>
      </>)
      }
  }

  //Fetch firestore data and make components draggable upon component mount
  const activateVeil = (truthy) => {
    var tl = gsap.timeline()
    const veil = document.getElementById("veil");
    if (truthy) {
    tl.to(veil, {
      duration: 2.0,
      autoAlpha: 0.44
    })}
  else {
    tl.to(veil, {
      duration: 1.0,
      autoAlpha: 0
    })}
  }
  useEffect(() => {
    Draggable.create(draggableToolTip.current, {
      bounds: appBox.current,
      throwProps: true
    });
    Draggable.create(draggableAddCard.current, {
      bounds: appBox.current,
      throwProps: true,
      dragClickables: false

    });
    Draggable.create(draggableSignUp.current, {
      bounds: appBox.current,
      throwProps: true,
      dragClickables: false
    });
    Draggable.create(draggableSignIn.current, {
      bounds: appBox.current,
      throwProps: true,
      dragClickables: false
    });

    const fetchData = async () => {
      const cardCollection = await handleGetCards();
      setCardArray(cardCollection);
    }
    fetchData();
  }, []);

  useEffect(() => {
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
          <div ref={draggableToolTip} className="z-50 sm:left-1/3 top-1/4 md:absolute">
          {showToolTip ? activateVeil(true) : null}
            {showToolTip ? <ToolTip
              setShowToolTip={setShowToolTip} /> : null}</div>
          <div ref={draggableAddCard} className="z-40 md:absolute md:top-9 md:left-1/4 drag">
          {showAddCard ? activateVeil(true) : null}
            {showAddCard ? <AddCard
              addCard={handleAddCard}
              setShowAddCard={setShowAddCard} 
              activateVeil={activateVeil}
              />
              : null} </div>
            <div id="veil" className=" opacity-40 h-full w-full z-30 bg-gray-800 absolute"></div>
          <div ref={draggableSignUp} className="absolute m-20 z-30 lg:left-1/3 md:m-8 lg:top-6 lg:w-1/4 md:w-1/3 sm:w-1/3">
            {/*setShowSignUp can be removed later*/}
            {/* {auth.currentUser != null ? setShowSignUp(true) : null  } */}
            {showSignUp ? activateVeil(true) : activateVeil(false) }
            {showSignUp ? 
            <SignUp
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
