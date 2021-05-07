const ToolTip = (props) => (
  <div className="flex items-center justify-center py-8 px-4">
    <div className="md:w-80 rounded shadow-lg p-6  dark:bg-gray-800 bg-white">
      <div className="flex items-center ">
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M5 12L10 17L20 7" stroke="#22C55E" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className=" dark:text-gray-100 text-gray-800 font-bold text-lg text-left pl-3">Welcome to Explore mode!</h1>
      </div>
      <p className="text-sm pt-6 text-left font-normal  dark:text-gray-100 text-gray-600"> 
      <li> Have fun exploring the flashcard database. </li> 
      <li className="text-red-700"> Press 's' to start. </li>
      <li className="text-red-700"> Press 'h' at anytime to pop up a help menu. </li>
      <li> Press 'f' at anytime to freeze cards</li>
      <li> Press 'g' at anytime to freeze cards</li>
      </p>
      <div className="flex items-center justify-between pt-6">
        <button className="py-3.5 w-full text-white focus:outline-none hover:opacity-90 text-sm font-semibold border rounded border-indigo-700 bg-indigo-700 leading-3">Close</button>
      </div>
    </div>
  </div>
);
export default ToolTip;