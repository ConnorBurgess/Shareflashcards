import '../App.css';
import AddCard from './AddCard';
import NavBar from './NavBar';
import Scene from './Scene';
import ToolTip from './ToolTip';
import SignIn from './SignIn';
import SignUp from './SignUp';
import SavedCards from './SavedCards';
import InfoPopup from './InfoPopup';
import FloatingCard from './FloatingCard';
import { useState, useEffect, useRef, useContext } from 'react';
import { makeComponentsDraggable } from '../lib/draggable';
import { handleGetCards, generateDeck } from '../lib/firebase';
import { generateRandomName, deviceDetect } from '../lib/utils'
import { gsap } from "gsap";
import { UserContext } from '../context/UserContext';

function CardsControl() {
  const { authUser, setAuthUser } = useContext(UserContext);
  const [showToolTip, setShowToolTip] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSavedCards, setShowSavedCards] = useState(false);
  const [savedCards, setSavedCards] = useState(null);
  //* CardArray all DB cards and currentdeck is intended to hold a smaller sub-deck
  //Todo: CurrentDeck is just a sorted cardArray in current implementation
  const [cardArray, setCardArray] = useState([{}]);
  const [currentDeck, setCurrentDeck] = useState([]);
  const [showLargeCard, setShowLargeCard] = useState(false);
  const [cardBackShowing, setCardBackShowing] = useState(false);
  const [showFollowingCard, setFollowingCard] = useState(false);

  //* Holds card data which is updated when card is enlarged
  const [largeCardDataFront, setLargeCardDataFront] = useState(null);
  const [largeCardDataBack, setLargeCardDataBack] = useState(null);

  //* Button to toggle card generation on/off
  //Todo: Implement functionality
  // const [currentlyGeneratingCards, setCurrentlyGeneratingCards] = useState(false);

  //* Boost for more cards
  //Todo: Fix, currently generates using a function with setInterval which is nasty
  const [generateMoreCards, setGenerateMoreCards] = useState(1);

  //* Generates a new username when user clicks button
  //? Does this need to be here?
  const [userName, setUserName] = useState("");
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // * Draggable elements
  // const draggableRefs = useRef([])
  const draggableToolTip = useRef(null);
  const draggableSignUp = useRef(null);
  const draggableAddCard = useRef(null);
  const appBox = useRef(null);


  const handleShowingLargeCard = (id) => {
    const clickedCard = cardArray.find(e => e.id === id);
    if (clickedCard !== undefined) {
      setLargeCardDataFront(
        <><div className="relative my-4 ml-4 mr-4 overflow-hidden rounded-md sm:pt-2 justify-items-center">
          <div className="text-center">
            <h1 id="card-title" className="mb-1 font-bold text-green-800">{clickedCard.data.title}</h1>
          </div>
          <div id="card-created-by" className="text-center">Card created by</div>
          <h2 id="card-username" className="mr-2 italic text-center text-bold ">{clickedCard.data.userName != null ? clickedCard.data.userName : "Tom"}</h2>
          <br />
          <div id="card-front" className="flex ml-2 mr-1 text-black mb-7">
            {clickedCard.data.front}
          </div>
        </div>
        </>)
      setLargeCardDataBack(
        <><div className="relative pt-2 my-4 ml-4 mr-4 overflow-hidden rounded-md justify-items-center">
          <div className="text-center">
            <h1 id="card-title" className="mb-1 font-bold text-green-800">{clickedCard.data.title}</h1>
          </div>
          <div id="card-created-by" className="text-center">Card created by</div>
          <h2 id="card-username" className="mr-2 italic text-center text-bold sm:mb-1">{clickedCard.data.userName != null ? clickedCard.data.userName : "Tom"}</h2>
          <br />
          <div id="card-front" className="flex ml-2 mr-1 mb-7">
            {clickedCard.data.back}
          </div>
        </div>
        </>)
    }
  }

  useEffect(() => {
    const veil = document.getElementById("veil");
    var tl = gsap.timeline()
    if (showAddCard || showToolTip || showSignUp || showSignIn || showLargeCard || showSavedCards) {
      tl.to(veil, {
        duration: 2.0,
        autoAlpha: 0.74
      })
    }
    else {
      tl.to(veil, {
        duration: 1.0,
        autoAlpha: 0
      })
    }
  }, [showToolTip, showAddCard, showSignUp, showSignIn, showLargeCard, showSavedCards]);

  //* Components draggable upon mount
  useEffect(() => {
    makeComponentsDraggable(appBox, draggableToolTip, draggableAddCard, draggableSignUp);

    //* Fetch firestore data on mount
    const fetchData = async () => {
      if (authUser !== undefined && cardArray.length <= 1) {
        const cardCollection = await handleGetCards();
        setCardArray(cardCollection);
        setUserSignedIn(true);
        document.getElementById("sign-up-nav").classList.add("hidden")
        document.getElementById("sign-in-nav").classList.add("hidden")
        document.getElementById("sign-out-nav").classList.remove("hidden")
      }
      else {
        setTimeout(() => {
          document.getElementById("welcome-back").classList.remove("animate-pulse")
        }, 3000)
      }
    }
    fetchData();
    setIsMobile(deviceDetect());
  }, [userSignedIn]);

  useEffect(() => {
    const fetchUser = async () => {
    }
    if (userSignedIn) {
      document.getElementById("welcome-back").classList.add("animate-pulse")
      fetchUser();
      setTimeout(() => {
        document.getElementById("welcome-back").classList.remove("animate-pulse")
      }, 3000)
    }
  }, [userSignedIn])


  useEffect(() => {
    if (userSignedIn) {
      setUserSignedIn(true);
      document.getElementById("sign-up-nav").classList.add("hidden")
      document.getElementById("sign-in-nav").classList.add("hidden")
      document.getElementById("sign-out-nav").classList.remove("hidden")
      document.getElementById("saved-nav").classList.remove("hidden")
      document.getElementById("profile-nav").classList.remove("hidden")
      document.getElementById("explore-nav").classList.remove("hidden")
      document.getElementById("new-nav").classList.remove("hidden")

    }
    else {
      document.getElementById("sign-out-nav").classList.add("hidden")
      document.getElementById("saved-nav").classList.add("hidden")
      document.getElementById("profile-nav").classList.add("hidden")
      document.getElementById("explore-nav").classList.add("hidden")
      document.getElementById("new-nav").classList.add("hidden")

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
      <div className="overflow-hidden">
        <div className="w-full h-full " ref={appBox}>
          <div className="absolute z-40 w-full">
            <NavBar
              isMobile={isMobile}
              setShowAddCard={setShowAddCard}
              userSignedIn={userSignedIn}
              setUserSignedIn={setUserSignedIn}
              setShowSignUp={setShowSignUp}
              setShowSignIn={setShowSignIn}
              setShowSavedCards={setShowSavedCards}
            />
            <div className="z=50 absolute w-11/12 top-15 left-2 md:left-1/4 drag sm:w-1/2 bg-gray-50 ">
              {showSavedCards ?
                <SavedCards
                  savedCards={savedCards}
                  setSavedCards={setSavedCards}
                /> : null} </div>
          </div>
          <div className="absolute z-50 h-max w-max">
            {showSignIn ?
              <SignIn
                setUserSignedIn={setUserSignedIn}
                setShowSignIn={setShowSignIn}
                cardArray={cardArray.length}
                setShowSignUp={setShowSignUp}
              />
              : null}
          </div>
          <InfoPopup
            cardArray={cardArray}
          />
          <div ref={draggableToolTip} className="z-50 sm:left-1/3 top-1/4 md:absolute">
            {showToolTip ?
              <ToolTip
                setShowToolTip={setShowToolTip} /> : null}</div>
          <div ref={draggableAddCard} className="absolute z-40 w-3/4 md:top-9 left-4 md:left-1/4 drag sm:w-1/2 sm:top-0 top-6">
            {showAddCard ?
              <AddCard
                setShowAddCard={setShowAddCard}
              />
              : null} </div>
          <div id="veil" className="absolute z-30 w-full h-full bg-gray-800 pointer-events-none opacity-70"></div>
          <div ref={draggableSignUp} className="absolute z-50 m-20 lg:left-1/3 md:m-8 lg:top-6 lg:w-1/4 md:w-1/3 sm:w-1/3">
            {showSignUp ?
              <SignUp
                setShowSignUp={setShowSignUp}
                setUserName={setUserName}
                setShowToolTip={setShowToolTip}
                setUserSignedIn={setUserSignedIn}
                userName={userName}
                generateRandomName={generateRandomName} />
              : null}</div>
          <div className="z-0">
            <FloatingCard
              largeCardDataFront={largeCardDataFront}
              largeCardDataBack={largeCardDataBack}
              setCardBackShowing={setCardBackShowing}
              cardBackShowing={cardBackShowing}
              showFollowingCard={showFollowingCard}
            />
            <Scene
              isMobile={isMobile}
              userSignedIn={userSignedIn}
              setShowSignUp={setShowSignUp}
              setShowLargeCard={setShowLargeCard}
              setShowLargeCardBack
              setCardBackShowing={setCardBackShowing}
              showLargeCard={showLargeCard}
              showFollowingCard={showFollowingCard}
              setFollowingCard={setFollowingCard}
              cardArray={cardArray}
              handleShowingLargeCard={handleShowingLargeCard}
              cardBackShowing={cardBackShowing}
              currentDeck={currentDeck}
              setCurrentDeck={setCurrentDeck}
              getCards={handleGetCards}
              generateDeck={generateDeck}
              setGenerateMoreCards={setGenerateMoreCards}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default CardsControl;
