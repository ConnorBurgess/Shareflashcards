import '../App.css';
import NavBar from './NavBar';
import Scene from './Scene';
import ToolTip from './ToolTip';
import AddCard from './AddCard';
import SignIn from './SignIn';
import SignUp from './SignUp';
import firebase, { firestore, auth } from '../firebase';
import react, { useState, useEffect, useRef } from 'react';
import { generateRandomName, handleAddCard, handleKeyPress, handleGetCards, generateDeck, handleSignUp, deviceDetect } from './utils';
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

function CardsControl() {

  //* Handle display of different  components
  const [showToolTip, setShowToolTip] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  //* CardArray all DB cards and currentdeck is intended to hold a smaller subset deck
  //Todo: CurrentDeck is just a sorted cardArray in current implementation
  const [cardArray, setCardArray] = useState([{}]);
  const [currentDeck, setCurrentDeck] = useState([]);

  //* Card displayed after user releases mouseup on matter object
  const [showLargeCard, setShowLargeCard] = useState(false);
  const [cardBackShowing, setCardBackShowing] = useState(false);

  //* Card currently following pointer
  const [showFollowingCard, setFollowingCard] = useState(false);

  //* Holds card data which is updated when card is enlarged
  const [largeCardDataFront, setLargeCardDataFront] = useState(null);
  const [largeCardDataBack, setLargeCardDataBack] = useState(null);

  //* Button to toggle card generation on/off
  //Todo: Implement functionality
  const [currentlyGeneratingCards, setCurrentlyGeneratingCards] = useState(false);
  const [backgroundTheme, setBackgroundTheme] = useState(false);
  //* Boost for more cards
  //Todo: Fix, currently generates using a function with setInterval which is nasty
  const [generateMoreCards, setGenerateMoreCards] = useState(1);

  //* Generates a new username when user clicks button
  //? Does this need to be here?
  const [userName, setUserName] = useState(null);
  const [userSignedIn, setUserSignedIn] = useState(false);

  //* Responsiveness
  const [isMobile, setIsMobile] = useState(false);

  // * Draggable elements
  // const draggableRefs = useRef([])
  const draggableToolTip = useRef(null);
  const draggableSignUp = useRef(null);
  const draggableAddCard = useRef(null);
  const appBox = useRef(null);

  const handleShowingLargeCard = (id) => {
    const clickedCard = cardArray.find(e => e.id === id);
    if (clickedCard != undefined) {
      setLargeCardDataFront(
        <><div className="relative justify-items-center ml-4 mr-4 my-4 rounded-md overflow-hidden">
          <div className="text-center">
            <h1 className="font-bold text-sm text-green-800">{clickedCard.data.title} </h1>
            <span> 05/17/21</span>
          </div>
          <h2 className="text-center italic text-bold sm:mb-2 mr-2">Ruthless Butterscotch</h2>
          <br />
          <div id="card-front" className=" ml-2 mr-1 flex mb-7">
            {clickedCard.data.front}
          </div>
        </div>
        </>)
      setLargeCardDataBack(
        <><div className="relative justify-items-center ml-4 mr-4 my-4 rounded-md overflow-hidden">
          <div className="text-center">
            <h1 className="font-bold text-sm text-green-800">{clickedCard.data.title} </h1>
            <span> 05/17/21</span>
          </div>
          <h2 className="text-center italic text-bold sm:mb-2 mr-2">Ruthless Butterscotch</h2>
          <br />
          <div id="card-front" className=" ml-2 mr-1 flex mb-7">
            {clickedCard.data.back}
          </div>
        </div>
        </>)
    }
  }

  useEffect(() => {
    var tl = gsap.timeline()
    const veil = document.getElementById("veil");
    if (showAddCard || showToolTip || showSignUp || showSignIn || showLargeCard) {
      tl.to(veil, {
        duration: 2.0,
        autoAlpha: 0.44
      })
    }
    else {
      tl.to(veil, {
        duration: 1.0,
        autoAlpha: 0
      })
    }
  }, [showToolTip, showAddCard, showSignUp, showSignIn, showLargeCard]);

  //* Components draggable upon component mount
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

    //* Fetch firestore data on mount
    const fetchData = async () => {
      const cardCollection = await handleGetCards();
      setCardArray(cardCollection);
      const currentUser = await firebase.auth().currentUser;
      if (currentUser != null) {
        setUserSignedIn(true);
        document.getElementById("sign-up-nav").classList.add("hidden")
        document.getElementById("sign-in-nav").classList.add("hidden")
        document.getElementById("sign-out-nav").classList.remove("hidden")
      }
    }
    fetchData();
    setIsMobile(deviceDetect());
    //* Verify user is signed in
  }, []);

  useEffect(() => {
    if (userSignedIn) {
      setUserSignedIn(true);
      document.getElementById("sign-up-nav").classList.add("hidden")
      document.getElementById("sign-in-nav").classList.add("hidden")
      document.getElementById("sign-out-nav").classList.remove("hidden")
    }
    else {
      document.getElementById("sign-out-nav").classList.add("hidden")
      document.getElementById("sign-up-nav").classList.remove("hidden")
      document.getElementById("sign-in-nav").classList.remove("hidden")
      setUserSignedIn(false);
    }
  }, [userSignedIn]);

  useEffect(() => {
    setCardArray(cardArray.sort(() => Math.random() - 0.5))
    if (cardArray.length > 7) {
      const trimmedCollection = generateDeck(cardArray);
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
        <div className="z-40 absolute w-full">
          <NavBar
            isMobile={isMobile}
            setShowAddCard={setShowAddCard}
            userSignedIn={userSignedIn}
            setUserSignedIn={setUserSignedIn}
            setShowSignUp={setShowSignUp}
            setShowSignIn={setShowSignIn}
          />
        </div>
        <div className="absolute z-50 h-max w-max">
          {showSignIn ?
            <SignIn
              setShowSignIn={setShowSignIn}
              cardArray={cardArray.length}
              setShowSignUp={setShowSignUp}
            />
            : null}
        </div>
        <div ref={draggableToolTip} className="z-50 sm:left-1/3 top-1/4 md:absolute">
          {showToolTip ?
            <ToolTip
              setShowToolTip={setShowToolTip} /> : null}</div>
        <div ref={draggableAddCard} className="z-40 absolute md:top-9 left-4 md:left-1/4 drag sm:w-1/2 w-3/4 sm:top-0 top-6">
          {showAddCard ?
            <AddCard
              addCard={handleAddCard}
              setShowAddCard={setShowAddCard}
            />
            : null} </div>
        <div id="veil" className=" pointer-events-none opacity-40 h-full w-full z-30 bg-gray-800 absolute"></div>
        <div ref={draggableSignUp} className="absolute m-20 z-50 lg:left-1/3 md:m-8 lg:top-6 lg:w-1/4 md:w-1/3 sm:w-1/3">
          {showSignUp ?
            <SignUp
              handleSignUp={handleSignUp}
              setShowSignUp={setShowSignUp}
              setUserName={setUserName}
              setShowToolTip={setShowToolTip}
              setUserSignedIn={setUserSignedIn}
              userName={userName}
              generateRandomName={generateRandomName} />
            : null}</div>
        <div className="z-0">
          <Scene
            setBackgroundTheme={setBackgroundTheme}
            backgroundTheme={backgroundTheme}
            userSignedIn={userSignedIn}
            isMobile={isMobile}
            setShowSignUp={setShowSignUp}
            cardArray={cardArray}
            handleShowingLargeCard={handleShowingLargeCard}
            //Determines whether actual card is visible after clicking or not
            showFollowingCard={showFollowingCard}
            setFollowingCard={setFollowingCard}
            showLargeCard={showLargeCard}
            setShowLargeCard={setShowLargeCard}
            setCardBackShowing={setCardBackShowing}
            cardBackShowing={cardBackShowing}
            setShowLargeCardBack
            currentDeck={currentDeck}
            setCurrentDeck={setCurrentDeck}
            getCards={handleGetCards}
            generateDeck={generateDeck}
            //Press button to generate more cards
            setGenerateMoreCards={setGenerateMoreCards}
            //Turn card generation on or off
            setCurrentlyGeneratingCards={setCurrentlyGeneratingCards}
            largeCardDataFront={largeCardDataFront}
            largeCardDataBack={largeCardDataBack} />
        </div>
      </div>
    </>
  );
}
export default CardsControl;
