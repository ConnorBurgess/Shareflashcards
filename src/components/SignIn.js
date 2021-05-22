import { handleSignIn } from '../lib/firebase'
const SignIn = (props) => {
  return (
    <>
      <header className=" bg-cover h-full bg-gray-700 z-50 {-- h-screen --} w-full">
        <div className="w-screen px-8 py-2 content">
          <nav className="flex items-center justify-between">
            <div className="flex items-center auth">
              <button onClick={() => {props.setShowSignIn(prevState => !prevState)}} className="p-2 mr-4 text-gray-200 bg-transparent border border-gray-300 rounded hover:bg-gray-100 hover:text-gray-700">Close</button>
              <button onClick={() => {
                props.setShowSignIn(prevState => !prevState)
                props.setShowSignUp(prevState => !prevState)
              }} className="px-3 py-2 text-gray-200 bg-gray-900 rounded hover:bg-gray-800 hover:text-gray-100">Sign up for free</button>
            </div>
          </nav>
          <div className="w-full mx-8 mt-20 body">
            <div className="items-center justify-between md:flex ml-14 mr-28">
              <div className="w-full mr-auto md:w-1/2">
                <h1 className="text-3xl font-bold tracking-wide text-white md:text-5xl" ><div className="content">Shareflashcards</div></h1>
                <br></br>
                <div className="md:ml-3">
                  <h2 className="text-2xl font-bold tracking-wide text-white md:text-3xl">Welcome back </h2>
                  <p className="text-xl text-gray-300 md:text-3xl">
                    Sign in to view <span className="text-green-700">{props.cardArray}</span> user-submitted cards
                </p>
                </div>
              </div>
              <div className="w-full mt-6 md:max-w-md">
                <div className="px-4 py-4 mb-6 bg-white rounded-lg shadow-md card ">
                  <form onSubmit={(event) => {
                    handleSignIn(event);
                    props.setShowSignIn(prevState => !prevState);
                  }}>
                    <div className="flex items-center justify-center">
                      <h2 className="text-2xl font-bold tracking-wide">
                        Welcome back
                      </h2>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-center text-gray-800">
                      Sign In
                                </h2>
                    <input id="email" type="email" className="w-full px-4 py-1 mb-6 text-gray-700 placeholder-gray-700 bg-gray-200 border border-gray-400 rounded focus:bg-white focus:outline-none" placeholder="Email Address" />
                    <input id="password" type="password" className="w-full px-4 py-1 mb-4 text-gray-700 placeholder-gray-700 bg-gray-200 border border-gray-400 rounded focus:bg-white focus:outline-none" placeholder="Password" />
                    <div className="flex items-center justify-between">
                      {/* <a href="#" className="text-gray-600">Forget Password?</a> */}
                      <button type="submit" className="px-2 py-1 text-gray-200 bg-gray-800 rounded">Sign In</button>
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