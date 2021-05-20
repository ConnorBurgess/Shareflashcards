import PropTypes from "prop-types";
import react, { useEffect } from 'react';
import { handleSignIn } from './utils'
const SignIn = (props) => {
  return (
    <>
      <header className=" bg-cover h-full bg-gray-700 z-50 {-- h-screen --} w-full">
        <div className="content px-8 py-2 w-screen">
          <nav className="flex items-center justify-between">
            <div className="auth flex items-center">
              <button onClick={() => {props.setShowSignIn(prevState => !prevState)}} className="bg-transparent text-gray-200  p-2 rounded border border-gray-300 mr-4 hover:bg-gray-100 hover:text-gray-700">Close</button>
              <button onClick={() => {
                props.setShowSignIn(prevState => !prevState)
                props.setShowSignUp(prevState => !prevState)
              }} className="bg-gray-900 text-gray-200  py-2 px-3 rounded  hover:bg-gray-800 hover:text-gray-100">Sign up for free</button>
            </div>
          </nav>
          <div className="body mt-20 mx-8  w-full">
            <div className="md:flex items-center justify-between ml-14 mr-28">
              <div className="w-full md:w-1/2 mr-auto">
                <h1 className="md:text-5xl text-3xl font-bold text-white tracking-wide" ><div className="content">Shareflashcards</div></h1>
                <br></br>
                <div className="md:ml-3">
                  <h2 className=" text-2xl  font-bold text-white md:text-3xl tracking-wide">Welcome back </h2>
                  <p className="text-gray-300 text-xl md:text-3xl">
                    Sign in to view <span className="text-green-700">{props.cardArray}</span> user-submitted cards
                </p>
                </div>
              </div>
              <div className="w-full md:max-w-md mt-6">
                <div className="card bg-white shadow-md rounded-lg px-4 py-4 mb-6 ">
                  <form onSubmit={(event) => {
                    handleSignIn(event);
                    props.setShowSignIn(prevState => !prevState);

                  }}>
                    <div className="flex items-center justify-center">
                      <h2 className="text-2xl font-bold tracking-wide">
                        Welcome back
                      </h2>
                    </div>
                    <h2 className="text-xl text-center font-semibold text-gray-800 mb-2">
                      Sign In
                                </h2>
                    <input id="email" type="email" className="rounded px-4 w-full py-1 bg-gray-200  border border-gray-400 mb-6 text-gray-700 placeholder-gray-700 focus:bg-white focus:outline-none" placeholder="Email Address" />
                    <input id="password" type="password" className="rounded px-4 w-full py-1 bg-gray-200  border border-gray-400 mb-4 text-gray-700 placeholder-gray-700 focus:bg-white focus:outline-none" placeholder="Password" />
                    <div className="flex items-center justify-between">
                      <a href="#" className="text-gray-600">Forget Password?</a>
                      <button type="submit" className="bg-gray-800 text-gray-200  px-2 py-1 rounded">Sign In</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
};

export default SignIn;