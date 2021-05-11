const AddCard = (props) => {
  console.log("props" + props.addCard);
  return (
    <>
      <form onSubmit={props.addCard}>
        <div class="min-h-screen flex items-center justify-center px-4 ab">

          <div class="max-w-4xl  bg-white w-full rounded-lg shadow-xl">
            <div class="p-4 border-b">
              <h2 class="text-2xl ">
                Add a new card
            </h2>
              <p class="text-sm text-gray-500">
                Send a card to your friend or leave it for someone to discover
            </p>
            </div>
            <div>
              <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                <p class="text-gray-600">
                  Title
                </p>
                <p>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="New flash card"
                    required
                  />

                </p>
              </div>
              <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                <p class="text-gray-600">
                  Send card to
                </p>
                <p>
                  Everyone
                </p>
              </div>
              <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                <p class="text-gray-600">
                  Front
                </p>
                <p>
                  <textarea
                    type="textarea"
                    id="front"
                    name="front"
                    rows="6"
                    columns="6"
                    placeholder="Why did the chicken cross the road?"
                    required
                  />
                </p>
              </div>
              <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                <p class="text-gray-600">
                  Back
                </p>
                <p>
                  <textarea
                    type="textarea"
                    id="back"
                    name="back"
                    rows="6"
                    columns="6"
                    placeholder="Because there was a KFC on the other side"
                    required
                  />
                </p>
              </div>
              <div class="md:grid md:grid-cols-2 hover:bg-green-50 md:space-y-0 space-y-1 p-4 border-b">
                <p>
                  <button type='submit'>Add Card</button>
                </p>
              </div>
            </div>
          </div>

        </div>
      </form>
    </>
  )
};

export default AddCard;

