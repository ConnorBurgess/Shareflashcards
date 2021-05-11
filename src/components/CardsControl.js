import '../App.css';
import Scene from './Scene';
import ToolTip from './ToolTip';
import AddCard from './AddCard';
import {firestore} from '../firebase';
import react, {useState, useEffect} from 'react';
function App() {
  const [showToolTip, setShowToolTip] = useState(true);
  const [showAddCard, setShowAddCard] = useState(true);
  const [visibleComponent, setVisibleComponent] = useState(null);
  const handleToolTipDisplaying = () => {
    setShowToolTip(!showToolTip);
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

  useEffect(() => {
  if (showToolTip != false) {
    setVisibleComponent(<ToolTip handleToolTipDisplaying = {handleToolTipDisplaying}/>)
  }
}, [showToolTip]); 
  return (
    <>
        {visibleComponent}
        <Scene />
        <div className="absolute">
        <AddCard addCard = {handleAddCard}/>
        </div>
    </>
  );
}
export default App;
