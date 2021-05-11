import '../App.css';
import Scene from './Scene';
import ToolTip from './ToolTip';
import AddCard from './AddCard';
import {firestore} from '../firebase';
import react, {useState, useEffect} from 'react';
function CardsControl() {
  const [showToolTip, setShowToolTip] = useState(true);
  const [showAddCard, setShowAddCard] = useState(true);
  const [cardArray, setCardArray] = useState([]);
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

  const handleGetCards  = () => {
    firestore.collection("cards").get().then((entry) => {
    entry.forEach( doc => {
      //push card data to cardArray for generating cards in matter.js
      setCardArray(cardArray.push(doc.data()))
      console.log(cardArray);
    }
    )
  });
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
        <div className=" border-green-400 border-4">
        <div className="left-52 z-50 absolute border-red-400 border-4"> {showToolTip ? <ToolTip handleToolTipDisplaying = {handleToolTipDisplaying}/> : null}</div>
        <div className="z-50 absolute top-9 left-2/4"> {showAddCard ? <AddCard addCard = {handleAddCard} setShowAddCard = {setShowAddCard}/> : null} </div>
        <div className="absolute z-0"> <Scene getCards = {handleGetCards}/></div>
        </div>
    </>
  );
}
export default CardsControl;
