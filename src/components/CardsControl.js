import '../App.css';
import NavBar from './NavBar';
import Scene from './Scene';
import ToolTip from './ToolTip';
import AddCard from './AddCard';
import SignIn from './SignIn';
import SignUp from './SignUp';
import {firestore, auth} from '../firebase';
import react, {useState, useEffect} from 'react';

function CardsControl() {
  const [showToolTip, setShowToolTip] = useState(true);
  const [showAddCard, setShowAddCard] = useState(true);
  const [showSignUp, setShowSignUp] = useState(true);
  const [showSignIn, setShowSignIn] = useState(false);
  const [cardArray, setCardArray] = useState([]);
  const [currentDeck, setCurrentDeck] = useState([]);
  const [visibleComponent, setVisibleComponent] = useState(null);
  //handlers for displaying components
  const handleToolTipDisplaying = (val) => {
    console.log(val);
    setShowToolTip(val);
    console.log(showToolTip);
  }

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

  const handleSignUp = userInfo => {
    console.log("test")
  }

  const handleGetCards = async () => {
    const data = await firestore.collection("cards").get();
    console.log(data);
      setCardArray(data.docs.map(doc => {return {...doc.data(), id: doc.id} }));
      
  console.log(cardArray);
  }

  const generateDeck = async () => {
    try{
    for(let i = 0; i < 5; i++) {
    let randomNumber = Math.floor(Math.random()*(cardArray.length));
    setCurrentDeck(currentDeck.push(cardArray[randomNumber]));
    cardArray.splice(randomNumber, 1);
  }
} catch (error) {
  console.log(error);
}
  console.log(currentDeck);
  }

//Generates a random username in SignUp component
  const generateRandomName = () => {
    let firstArr = ["ruthless", "smart", "eager", "envious", "energetic", "joyous", "shiny", "sleepy"]
    let secondArr =["buttercotch", "sardine", "iguana", "walrus", "rhinoceros", "kitten", "albatross"]
    let randomNumber = Math.floor(Math.random()*(firstArr.length));
    let randomNumber2 = Math.floor(Math.random()*(secondArr.length));
    let name = firstArr[randomNumber] + "_" + secondArr[randomNumber2];
    console.log(name);
    return name;

  }

  //not needed
//   useEffect(() => {
//   if (showToolTip != false) {
//     setVisibleComponent(<ToolTip handleToolTipDisplaying = {handleToolTipDisplaying}/>)
//   }
//   else {
//     setVisibleComponent(null);
//   }
// }, [showToolTip]); 
  return (
    
    <>
        <div className="z-50"><NavBar /></div>
        {/* <div className="absolute z-50"><SignIn/></div> */}
        <div className=" border-green-400 border-4">
        <div className="left-52 z-45 md:absolute border-red-400 border-4"> {showToolTip ? <ToolTip handleToolTipDisplaying = {handleToolTipDisplaying}/> : null}</div>
        <div className="z-45 md:absolute md:top-9 md:left-2/4"> {showAddCard ? <AddCard addCard = {handleAddCard} setShowAddCard = {setShowAddCard}/> : null} </div>
        {/* <div className="absolute z-50 right-72 top-20 border-red-400 border-4">{showSignUp ? <SignUp handleSignUp = {handleSignUp} setShowSignUp= {setShowSignUp} tempName = {generateRandomName}/> : null}</div> */}
        <div className="md:absolute z-0"> <Scene currentDeck={currentDeck} getCards = {handleGetCards} generateDeck = {generateDeck}/></div>
        </div>
    </>
  );
}
export default CardsControl;
