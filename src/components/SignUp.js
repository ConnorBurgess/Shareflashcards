import { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { handleGetDisplayName, handleSignUp } from '../lib/firebase';
import { UserContext } from '../context/UserContext';

const SignUp = (props) => {

  const {authUser, setAuthUser} = useContext(UserContext);
  const { setUserName, generateRandomName } = props
  useEffect(() => {
    setUserName(generateRandomName())
  }, [setUserName, generateRandomName])

  return (
    <>
      <div className="grid overflow-x-hidden place-items-center">
        <div id="draggable" className="p-8 mx-auto bg-white border-t-8 border-b-8 border-gray-700 shadow-sm">
          <h1 className="text-xl font-semibold">Hello there <br /><button className="text-green-800 transform select-none hover:scale-105 focus:outline-none"
            onClick={() => setUserName(generateRandomName())}>
            {props.userName}</button><span className="ml-1">👋</span>, <br /> <span className="font-normal">Provide an email and password to get exploring</span></h1>
          <form className="mt-6 w-max" onSubmit={async (event) => {
            await handleSignUp(event)
            await setAuthUser(handleGetDisplayName().then((e) => { setAuthUser(e)}))
            props.setUserSignedIn(true);
            props.setShowSignUp(prevState => !prevState)
            props.setShowToolTip(prevState => !prevState)
          }}>
            <label htmlFor="email" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">E-mail</label>
            <input id="email" type="email" name="email" placeholder="" autoComplete="email" className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner" required />
            <label htmlFor="password" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">Password</label>
            <input id="password" type="password" name="password" placeholder="********" autoComplete="new-password" className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner" required />
            <label htmlFor="password-confirm" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">Confirm password</label>
            <input id="password-confirm" type="password" name="password-confirm" placeholder="********" autoComplete="new-password" className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner" required />
            <input id="userName" type="userName" name="userName" hidden={true} value={props.userName} readOnly />
            <button type="submit" className="w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-black shadow-lg animate-pulse focus:outline-none hover:bg-gray-900 hover:shadow-none">
              Join
      </button>
            <button type="click" onClick={() => {
              props.setShowSignUp(prevState => !prevState);
            }
            } className="justify-between inline-block mt-4 text-xs text-gray-500 cursor-pointer hover:text-black">Already registered?</button>
          </form>
        </div>
      </div>
    </>
  );
}

SignUp.propTypes = {
  handleSignUp: PropTypes.func,
  setUserName: PropTypes.func,
  setUserSignedIn: PropTypes.func,
  setDisplayName: PropTypes.func,
  setShowSignUp: PropTypes.func,
  setShowToolTip: PropTypes.func,
  generateRandomName: PropTypes.func
}

export default SignUp;

