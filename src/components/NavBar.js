import React from 'react'
import logo from '../img/logo.png'
import { handleSignOut } from '../lib/firebase';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
let navigation = [
  { name: 'Explore', href: '#', current: true, id: "explore-nav" },
  { name: 'New Card', href: '#', current: false, id: "new-nav" },
  { name: 'Saved', href: '#', current: false, id: "saved-nav" },
  { name: 'Profile', href: '#', current: false, id: "profile-nav" },
  { name: 'Sign up', current: false, id: "sign-up-nav" },
  { name: 'Sign in', current: false, id: "sign-in-nav" },
  { name: 'Sign out', current: false, id: "sign-out-nav" },
]

export default function NavBar(props) {

  return (
    <>
      <nav class="bg-gray-900 shadow select-none" role="navigation">
        <div class="container  mx-auto p-4 flex flex-wrap items-center md:flex-no-wrap">
          <div class="mr-3 md:mr-8 pointer-events-none">
            <a href="#" rel="home">
              <img width="150" height="280" className="select-none" src={logo}></img>
            </a>
          </div>
          <div class="ml-auto md:hidden">
            <button class="flex items-center px-3 py-2 border rounded" type="button">
              <svg class="h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
          <div class="w-full md:w-auto md:flex-grow md:flex md:items-center">
            <div className=" sm:block sm:ml-6">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    onClick={() => {
                      if (item.id === "new-nav") {
                        props.setShowAddCard(prevState => !prevState)
                      } else if (item.id === "sign-out-nav") {
                        handleSignOut()
                        props.setUserSignedIn(prevState => !prevState)
                      } else if (item.id === "sign-up-nav") {
                        props.setShowSignUp(prevState => !prevState)
                      }
                      else if (item.id === "sign-in-nav") {
                        props.setShowSignIn(prevState => !prevState)
                      }
                      else if (item.id === "saved-nav") {
                        let anki = document.createElement('anki');
                        anki.href = "data:application/octet-stream," + encodeURIComponent("My DATA");
                        anki.download = 'abc.txt';
                        anki.click();
                      }
                      item.current = !item.current
                    }}
                    id={item.id}
                    key={item.id}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'px-3 py-2 rounded-md text-sm font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute top-20 right-10">
            <svg id="save-icon" className="opacity-0" xmlns="http://www.w3.org/2000/svg" width="34" height="34" style={{ fill: "rgba(210, 26, 26, 1)" }} viewBox="0 0 24 24"><path fill="none" d="M9 14H15V19H9zM11 5H13V7H11z"></path><path fill="none" d="M7,14c0-1.103,0.897-2,2-2h6c1.103,0,2,0.897,2,2v5h2.001L19,8.414L15.586,5H15v4h-1h-1h-2H9H7V5H5v14h2V14z"></path><path d="M5,21h14c1.103,0,2-0.897,2-2V8c0-0.265-0.105-0.52-0.293-0.707l-4-4C16.52,3.105,16.266,3,16,3H5C3.897,3,3,3.897,3,5v14 C3,20.103,3.897,21,5,21z M15,19H9v-5h6V19z M13,7h-2V5h2V7z M5,5h2v4h2h2h2h1h1V5h0.586L19,8.414L19.001,19H17v-5 c0-1.103-0.897-2-2-2H9c-1.103,0-2,0.897-2,2v5H5V5z"></path></svg>
          </div>
        </div>
      </nav>
    </>
  )
}