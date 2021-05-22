import PropTypes from 'prop-types'
import popup from '../img/popup.jpg'
import { animPopup } from '../lib/gsap';
import { useEffect } from 'react';

export const InfoPopup = (props) => {
  const { cardArray } = props;

  const infoPopupStyle = {
    backgroundImage: `url(${popup})`,
  }

  useEffect(() => {
    animPopup();
  },[])
  return (
    <>
      <div id="info-popup"
        style={infoPopupStyle}
        className="fixed left-0 z-50 w-4/12 h-24 p-3 text-green-800 bg-gray-700 border-r-2 border-gray-700 shadow-lg select-none rounded-r-md top-36 sm:w-2/12 sm:h-3/6 md:p-5 sm:text-3xl">
        <div className="z-50 text-white border-red-400">
          New Cards: {cardArray.length} <br></br>
          Tags: All
        </div>
      </div>
    </>
  )
}

InfoPopup.propTypes = {
  cardArray: PropTypes.array
}

export default InfoPopup;