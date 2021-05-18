# Cards
#### Created By: Connor Burgess 
* * *
* Heavily WIP, very buggy / code needs to be refactored and separated to components 5.18.21
## Description  
Responsive web application allowing users to contribute flash cards to community and send cards to friends. Uses Matter.js physics engine to allow users to explore database visually and build sets off discovered cards. Site built using React and styled with Tailwind. Backend NOSQL database managed through Firebase.
* * *

## User Stories
* As a user, I want to be able to discover new content visually
* As a user, I want to submit a form to send cards to friends or the database.
* As a user, I want to be able to hover over a card to see it's contents
* As a user, I want to be able to login to view saved cards.
* As a user, I want to be able to review cards in saved decks.

## Technologies used
* JavaScript
* React
* Matter.js
* HTML
* CSS
* Tailwind
* GSAP
* npm
* BrowserFS
* Better Comments
* Create React App

* * *
## Setup
* Clone Repo from GitHub (Link: https://github.com/ConnorBurgess/cards)
* Open in terminal or IDE/text editor of choice
* Ensure terminal is in cards directory and type `npm start` to load local server
* Local server should open automatically in browser but otherwise navigate to http://localhost:3000/ (default port) in browser URL
## Additional comments:
* Created on 5/12/21  
* * *

## *Known bugs:*
| Bug | Reason | Possible solution  | State (fixed/current)|
| :-------------: |  :------------: | :-------------: |:-------------: |
| Matter mouse events continually adding events to mMouseConstraint | Need to look over event handlers in Scene.js | Fix event handlers | ❌  **Current**|


## License:
> *&copy; Connor Burgess, 2021*

Licensed under [MIT license](https://mit-license.org/)

* * *

## Contact Information
_Connor Burgess: [Email](connorburgesscodes@gmail.com)_