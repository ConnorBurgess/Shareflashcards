# Shareflashcards
<img src="./src/img/preview.gif"> </br>
#### Created By: Connor Burgess 
* * *
* Not all features and UI buttons currently implemented
* Buggy. See 'Known bugs.'
* Current implementation deployed soon at www.shareflashcards.com
## Description  
Responsive web application allowing users to contribute flash cards to community and send cards to friends. Uses Matter.js physics engine to allow users to explore database visually and build sets off discovered cards. Site built using React and styled with Tailwind. Backend NOSQL database managed through Firebase. Current implementation allows users to add new cards to database as well as have cards from the DB randomly shown.
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
* Better Comments
* Adobe Stock Assets
* Create React App

* * *
## Setup
* Clone Repo from GitHub (Link: https://github.com/ConnorBurgess/cards)
* Open in terminal or IDE/text editor of choice
* Type `npm install` to setup depencies
* In order to be setup fully project must be connected with a Firebase/Firestore database.
* Alternatively, check out the deployed site at shareflashcards.com
## Additional comments:
* Created on 5/12/21  
* * *

## *Known bugs:*
| Bug | Reason | Possible solution  | State (fixed/current)|
| :-------------: |  :------------: | :-------------: |:-------------: |
| Matter mouse events continually adding events to mMouseConstraint | Need to look over event handlers in Scene.js | Fix event handlers | ❌  **Current**|
| Issues with animations if users click too fast | Need to implement more checks to GSAP animations | Fix animations | ❌  **Current**|
| Responsiveness issues with floating card | Need to adjust tailwind classes on floating card and play with media queries | Fix floating card | ❌  **Current**|
| Responsiveness issues with matter scene on some screen sizes | Body generation needs to be tweaked | Fix Matter scene.js | ❌  **Current**|
| Input validation needs to be added to forms | Add input validation | Implement | ❌  **Current**|
| Large card frozen if user clicks matter card before logging in | Add user auth checks to mouseConstraint | Fix matter scene.js | ❌  **Current**|


## License:
> *&copy; Connor Burgess, 2021*

Licensed under [MIT license](https://mit-license.org/)

* * *

## Contact Information
_Connor Burgess: [Email](connorburgesscodes@gmail.com)_