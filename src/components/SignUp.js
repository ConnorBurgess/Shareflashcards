import PropTypes from "prop-types";
import react, { useState, useEffect } from 'react';
const SignUp = (props) => {
  //Generate random name on component mount
  useEffect(() => {
    props.setUserName(props.generateRandomName())
  }, [])

  return (
    <div className="grid place-items-center overflow-x-hidden">
      <div className="p-8 bg-white mx-auto border-t-8 border-b-8 shadow-sm border-red-400">
        <h1 className="text-xl font-semibold">Hello there <br /><button className="text-red-500 transform hover:scale-105 focus:outline-none"
          onClick={() => props.setUserName(props.generateRandomName())}>
          {props.userName}</button><span className="ml-1">👋</span>, <br /> <span className="font-normal">Provide an email and password to get card hunting!</span></h1>
        <form className="mt-6 w-max" onSubmit={props.handleSignUp}>
          <label for="email" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">E-mail</label>
          <input id="email" type="email" name="email" placeholder="" autocomplete="email" className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner" required />
          <label for="password" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">Password</label>
          <input id="password" type="password" name="password" placeholder="********" autocomplete="new-password" className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner" required />
          <label for="password-confirm" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">Confirm password</label>
          <input id="password-confirm" type="password" name="password-confirm" placeholder="********" autocomplete="new-password" className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner" required />
          <input id="userName" type="userName" name="userName" hidden="true" value={props.userName} />
          <button type="submit" className="animate-pulse w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none">
            Join
      </button>
          <button type="click" onClick={() => props.setShowSignUp(false)} className="justify-between inline-block mt-4 text-xs text-gray-500 cursor-pointer hover:text-black">Already registered?</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;