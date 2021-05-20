import { useState, useEffect } from 'react';
// import paper from '../img/popup.jpg'
const AddCard = (props) => {

  const [titleCount, setTitleCount] = useState(40);
  const [frontCount, setFrontCount] = useState(200);
  const [backCount, setBackCount] = useState(500);
  const [tag, setTag] = useState("Japanese")
  
  const tagArr = ["Japanese", "English", "Chinese", "Coding", "Math", "Finance", "Fun", "Jokes", "Culture"]

  useEffect(() => {
  setInterval(() => { setTag(tagArr[Math.floor(Math.random() * (tagArr.length))]) }, 3000);
}, []);
  return (
    <>
      <form onSubmit={(event) => { 
        event.preventDefault()
        props.addCard()
        props.setShowAddCard(false)}} >
        <div className="flex items-center justify-center rounded-md w-full">
          <div className=" bg-white  rounded-lg shadow-xl w-full">
            <div className="p-4 border-b bg-green-800">
              <h2 className="text-2xl text-white ">
                Add card
            </h2>
              <p className="text-sm text-white italic">
                New flashcard
            </p>
            </div>
            <div>
              <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                <p className="text-gray-600">
                  Tag
                </p>
                <p>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder={tag}
                    onChange={e => setTitleCount(
                      10 - e.target.value.length)}
                    maxLength="10"
                    required
                  />
                </p>
                <div className="text-gray-400 text-sm italic ml-6">
                  {
                    titleCount > 35 ? <span className="placeholder_class"> Tag it</span>
                      : titleCount > 0 && titleCount <= 35 ? <span className="text-green-600 opacity-60"> {titleCount}</span>
                        : <span className="text-red-400 opacity-60"> No characters remaining</span>
                  }
                </div>
              </div>
              {/* <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                <p className="text-gray-600">
                  Send card to
                </p>
                <p>
                  Everyone
                </p>
              </div> */}
              <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                <p className="text-gray-600">
                  Front of Card
                </p>
                <p>
                  <textarea
                    type="textarea"
                    id="front"
                    name="front"
                    onChange={e => setFrontCount(
                      200 - e.target.value.length)}
                    maxLength="200"
                    minLength="5"
                    rows="4"
                    cols="25"
                    placeholder="Share"
                    required
                  />
                </p>
                <div className="text-gray-400 text-sm italic ml-6">
                  {
                    frontCount > 195 ? <span className="placeholder_class"> Write something</span>
                      : frontCount > 0 && frontCount <= 195 ? <span className="text-green-600 opacity-60"> {frontCount}</span>
                        : <span className="text-red-400 opacity-60"> No characters remaining</span>
                  }
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                <p className="text-gray-600">
                  Back of Card
                </p>
                <p>
                  <textarea
                    type="textarea"
                    id="back"
                    name="back"
                    onChange={e => setBackCount(
                      400 - e.target.value.length)}
                    maxLength="300"
                    minLength="5"
                    rows="4"
                    cols="25"
                    placeholder="Learn"
                    required
                  />
                </p>
                <div className="text-gray-400 text-sm italic ml-6">
                  {
                    backCount > 395 ? <span className="placeholder_class"> Share something</span>
                      : backCount > 0 && backCount <= 395 ? <span className="text-green-600 opacity-60"> {backCount}</span>
                        : <span className="text-red-400 opacity-60"> No characters remaining</span>
                  }
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:space-y-0 space-y-1 p-4 border-b">
                <div className="hover:bg-gray-300 bg-gray-100 hover:text-white text-center p-3">
                  <p>
                    <button type='submit'>Add Card</button>
                  </p>
                </div>
                <div className="hover:bg-gray-300 hover:text-white bg-gray-100 text-center p-3">
                  <p>
                    <button onClick={() => props.setShowAddCard()} type='click'>Close</button>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </form>
    </>
  )
};

export default AddCard;

