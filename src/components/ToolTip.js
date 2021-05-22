import PropTypes from "prop-types";

const ToolTip = (props) => (
  <>
    <div id="thistooltip" className="absolute z-50 flex items-center justify-center px-4 py-8">
      <div className="p-6 bg-white rounded shadow-lg md:w-80 dark:bg-gray-800 ">
        <div className="flex items-center ">
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
            <path d="M5 12L10 17L20 7" stroke="#22C55E" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 className="pl-3 text-lg font-bold text-left text-gray-800 dark:text-gray-100">Welcome to shareflashcards</h1>
        </div>
        <p className="pt-6 font-normal text-left text-gray-600 text-md dark:text-gray-100">
          <li> <span className="text-green-800">Chill out</span> and check out flash cards from users globally </li>
          <li> Tap a card to see pop up it's contents</li>
          <li> Cards can be saved by tapping the right side of the screen, or left side to discard.</li>
        </p>
        <div className="flex items-center justify-between pt-6">
          <button onClick={() => props.setShowToolTip(false)} className="py-3.5 w-full text-white focus:outline-none hover:opacity-90 text-sm font-semibold border rounded border-indigo-700 bg-indigo-700 leading-3">Okay!</button>
        </div>
      </div>
    </div>
  </>
);

ToolTip.propTypes = {
  setShowToolTip: PropTypes.func
}
export default ToolTip;