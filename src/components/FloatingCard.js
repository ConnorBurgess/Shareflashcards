import blank_card from '../img/blank_card.png'
import PropTypes from 'prop-types'

const FloatingCard = (props) => {
  const floatingCardStyle = {
    backgroundImage: `url(${blank_card})`,
  }

  return (
    <>
      {props.showFollowingCard === true ?
        <div onClick={() => { props.setCardBackShowing(prevState => !prevState) }} id="floating-card"
          className="absolute top-0 left-0 z-50 object-contain w-3/12 pb-3 mr-1 overflow-hidden bg-no-repeat bg-cover rounded-sm pointer-events-none select-none bottom-1/5 h-36 sm:h-40 opacity-90 lg:h-1/4 sm:w-1/12"
          style={floatingCardStyle}>
          <div > {props.cardBackShowing ? props.largeCardDataBack : props.largeCardDataFront}</div>
        </div>
        : null}
    </>
  );
}

FloatingCard.propTypes = {
  showFollowingCard: PropTypes.bool,
  cardBackShowing: PropTypes.bool,
  largeCardDataBack: PropTypes.object,
  largeCardDataFront: PropTypes.object,
  setCardBackShowing: PropTypes.func
};

export default FloatingCard