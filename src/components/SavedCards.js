import { handleGetSavedCards } from '../lib/firebase';
import { useEffect } from 'react';
const SavedCards = (props) => {

  useEffect(() => {
    const fetchedCards = async () => {
      props.setSavedCards(await handleGetSavedCards().then(entry => { return entry }))

    }
    fetchedCards();
    console.log(props.savedCards);

  }, [])
  useEffect(() => {
    console.log(props.savedCards);
  }, [props.savedCards])
  return (
    <>
      <div className="left-0 w-full">
        <div className="p-4 bg-green-800">
          <h2 className="text-2xl text-white">
            My Saved Cards
            </h2>
          <p className="text-sm italic text-white">
            Examine and add cards to a deck
            </p>
        </div>
        <div id="dynamic-content" className="overflow-y-scroll h-1/6 max-h-96">
        <div>
        {props.savedCards ? props.savedCards.map((item) => (
          <div className="grid grid-cols-4 py-4 pl-6 text-sm bg-white border-b border-green-700 md:text-lg">
            <div className="border-r">
              <input className="md:mr-2"
                name="isAdded"
                type="checkbox" /> {item.data.title} </div>
            <div className="p-1"> {item.data.front} </div>
            <div className="p-1"> {item.data.back} </div>
          </div>
        )) : null}
        </div>
        </div>
        <div className="p-4 space-y-1 md:grid md:grid-cols-2 md:space-y-0">
          <div className="p-3 text-center bg-gray-100 hover:bg-gray-300 hover:text-white">
            <p>
              <button onClick={handleGetSavedCards} type='submit'>Add to learning queue</button>
            </p>
          </div>
          <div className="p-3 text-center bg-gray-100 hover:bg-gray-300 hover:text-white">
            <p>
              <button type='click'>Delete Card</button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default SavedCards;