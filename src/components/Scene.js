import React, { useEffect, useState, useRef } from 'react'
import Matter from "matter-js";
import background from '../img/background.jpg'
import background_alt from '../img/background_alt.jpg'
import background_alt_2 from '../img/background_alt_2.jpg'
import background_alt_3 from '../img/background_alt_3.jpg'
import background_alt_4 from '../img/background_alt_4.jpg'
import blank_card_small from '../img/blank_card_small.jpg'
import logo_small from '../img/logo_small.png'
import PropTypes from "prop-types";
import { animFollowing, animEnlarge, animSave, animDismiss, animExtendCommandBar, animHideCommandBar } from '../lib/gsap'
import { handleUpdatingFirestoreCards } from '../lib/firebase'
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';


//! Current scene.js still needs to be broken up into smaller components and refactored
//Todo: Refactor and reorganize code
function Scene(props) {
  const { authUser, setAuthUser } = useContext(UserContext);
  const [mEngine, setEngine] = useState(null);
  const [mMouseConstraint, setMouseConstraint] = useState(null);
  const [mGravity, setGravity] = useState(true);
  const [matterCard, setMatterCardId] = useState(null);

  const boxRef = useRef(null)
  const canvasRef = useRef(null)


  //* Responsive state
  const [constraints, setContraints] = useState()
  const [commandBarExtended, setCommandBarExtended] = useState(false)
  const [scene, setScene] = useState()

  const handleResize = () => {
    setContraints(boxRef.current.getBoundingClientRect())
  }

  const { cardArray, currentDeck, showFollowingCard, showLargeCard } = props;

  useEffect(() => {
    //* Core matter engine / canvas initialization
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Composite = Matter.Composite;

    let engine = Engine.create({});

    setEngine(engine);

    let bgroundRand = Math.floor(Math.random() * 5) + 1;
    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        showAngleIndicator: false,
        showIds: false,
        width: window.innerWidth,
        height: window.innerHeight,
        background: bgroundRand === 1 ? background
          : bgroundRand === 2 ? background_alt
            : bgroundRand === 3 ? background_alt_2
              : bgroundRand === 4 ? background_alt_3
                : background_alt_4,
        wireframes: false,
      },
    })

    Composite.add(engine.world, [
      Bodies.rectangle(700, 550, 2000, 130, {
        isStatic: true, render: { fillStyle: '#111827' }, chamfer: { radius: 10 }, collisionFilter: {
          group: 0,
          category: 1,
          mask: 1,
        }, id: ""
      }),
    ]);

    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });

    window.addEventListener('resize', handleResize)
    setMouseConstraint(mouseConstraint);
    extendCommandBar();
    setContraints(boxRef.current.getBoundingClientRect())
    setScene(render)
    Composite.add(engine.world, mouseConstraint);
    Runner.run(engine);
    Render.run(render);
  }, [])

  //* Responsive canvas
  useEffect(() => {
    if (constraints) {
      let { width, height } = constraints
      scene.bounds.max.x = width
      scene.bounds.max.y = height
      scene.options.width = width
      scene.options.height = height
      scene.canvas.width = width
      scene.canvas.height = height

      const floor = scene.engine.world.bodies.filter(e => e.id.length < 1)
      Matter.Body.setPosition(floor[0], {
        x: width / 2,
        y: height,
      })
    }
  }, [scene, constraints])

  useEffect(() => {
    if (mEngine !== null) {
      setTimeout(() => { 
      Matter.Composite.add(mEngine.world,  [Matter.Bodies.rectangle(constraints.width / 3, 0, 260, 120, {
        isStatic: false,
        // angle: (Math.floor(Math.random() * (6.28 * 100 - 1 * 100) + 1 * 100) / (1 * 100)), //! Angle is in radians. Randomizes between 0 and 6.28
        chamfer: { radius: 1 },
        friction: 1,
        restitituion: 1.0,
        density: 0.9,
        force: { x: 0, y: 12351 },
        // frictionAir: 0.001,
        collisionFilter: {
          group: 0,
          category: 1,
          mask: 1
        },
        render: {
          fillStyle: '#374151',
          strokeStyle: '#968786',
          chamfer: { radius: 9 },
          lineWidth: 2,
          sprite: {
            texture: logo_small,
          }
        },
      })]);
    },3000)
      for (let i = 0; props.isMobile ? i < 250 : i < 400; i++) {
        Matter.Composite.add(mEngine.world,  [Matter.Bodies.rectangle(props.isMobile ? Math.random() * 400 + 1 : Math.random() * 1000 + 1 , 0, 37, 54, {
          isStatic: false,
          angle: (Math.floor(Math.random() * (6.28 * 100 - 1 * 100) + 1 * 100) / (1 * 100)), //! Angle is in radians. Randomizes between 0 and 6.28
          chamfer: { radius: 1 },
          friction: 0.7,
          density: 0.2,
          force: { x: 2, y: 3 },
          restitituion: 0.9,
          // frictionAir: 0.001,
          collisionFilter: {
            group: 0,
            category: 1,
            mask: 1
          },
          render: {
            fillStyle: '#374151',
            strokeStyle: '#968786',
            chamfer: { radius: 9 },
            lineWidth: 2,
            sprite: {
              texture: blank_card_small,
            }
          },
        })]);
      }

    }
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [mEngine])

  useEffect(() => {
    if (props.userSignedIn) {
      for (let i = 0; i < 10; i++ ) { 
      mEngine.world.bodies.forEach(element => { if (element.id !== "") { Matter.Composite.removeBody(mEngine.world, element) } });
    }
    }
  }, [props.userSignedIn])

  function onMouseMove(event) {
    if (showFollowingCard) {
      document.getElementById("floating-card").classList.add("pointer-events-none")
      animFollowing(event, props.isMobile, constraints);
    }
  }

  function onRelease(event) {
    Matter.Events.on(mMouseConstraint, "mouseup", (event) => {
      if (document.getElementById("card-front") !== null) {
        document.getElementById("card-front").classList.add("hidden")
      }
      props.setShowLargeCard(true);
      document.getElementById("floating-card").classList.remove("pointer-events-none")
      document.querySelector('#scene').removeEventListener(props.isMobile ? 'touchmove' : 'mousemove', onMouseMove);
      document.querySelector('#scene').removeEventListener(props.isMobile ? 'touchend' : 'mouseup', onRelease);
      animEnlarge(event, props.isMobile, constraints);
    });
  }

  //* Actions for dismissing / saving large card, 
  //Todo: Improve coords of animations
  useEffect(() => {
    // if (!props.userSignedIn) {
    //   setTimeout(() => { 
    //   props.setShowSignUp(prevState => !prevState)
    // },7500)
    // }
    if (mMouseConstraint !== null) {
      Matter.Events.off(mMouseConstraint, "mouseup")
    }
    if (mMouseConstraint != null && showLargeCard && props.userSignedIn) {
      props.setCardBackShowing(false);
      Matter.Events.on(mMouseConstraint, "mousedown", (event) => {
        document.getElementById("floating-card").classList.add("pointer-events-none")
        Matter.Events.off(mMouseConstraint, "mousedown")
        props.setShowLargeCard(false);
        if (event.source.constraint.pointA.x > constraints.width / 2) {
          handleUpdatingFirestoreCards(matterCard)
          animSave(props.isMobile);
        }
        else {
          animDismiss(props.isMobile);
        }
      });
    }
  }, [showLargeCard])

  //* Check if user presses gravity button
  //? Should this be removed?
  useEffect(() => {
    if (mGravity && mEngine !== null) {
      mEngine.world.gravity.y = 0.53;
    }
    else if (mEngine !== null) {
      mEngine.world.gravity.y = -0.2;
    }
  }, [mGravity, mEngine])

  //* Handles card generation
  //Todo: Move to card generation component

  useEffect(() => {

    const generateMatterCard = () => {
      return Matter.Composite.add(mEngine.world, [Matter.Bodies.rectangle(props.isMobile ? Math.random() * 400 + 1 : Math.random() * 1000 + 1 , 0, 37, 54, {
        isStatic: false,
        angle: (Math.floor(Math.random() * (6.28 * 100 - 1 * 100) + 1 * 100) / (1 * 100)), //! Angle is in radians. Randomizes between 0 and 6.28
        chamfer: { radius: 1 },
        friction: 0.7,
        density: 0.2,
        force: { x: 2, y: 3 },
        restitituion: 0.9,
        // frictionAir: 0.001,
        collisionFilter: {
          group: 0,
          category: 1,
          mask: 1
        },
        render: {
          fillStyle: '#374151',
          strokeStyle: '#968786',
          chamfer: { radius: 9 },
          lineWidth: 2,
          sprite: {
            texture: blank_card_small,
          }
        },
        id: currentDeck[currentDeck.length - 1].id
      })]);
    }

    for (let i = 0; i < currentDeck.length; i++) {
      //* Random card generation at slightly different times visual effect
      let randomTime = Math.floor(Math.random() * (400 - 10 + 1)) + 10

      setTimeout(function () {
        generateMatterCard();

      }, randomTime);
      currentDeck.pop()
      // props.setCurrentDeck(prevDeck => prevDeck.filter((element, index) => index < prevDeck.length - 1))
    }
  }, [currentDeck, mEngine])

  //* Handle adding floating div to mouse movement
  //Todo: Move to mouse constraint component
  useEffect(() => {
    console.log(showLargeCard);
    console.log(cardArray);

    //* Add floating div movement event 
    if (mMouseConstraint !== null && mEngine !== null && cardArray !== undefined && !showLargeCard) {

      Matter.Events.on(mMouseConstraint, "mousedown", (event) => {
        let getClickedBody = Matter.Query.point(mEngine.world.bodies, event.mouse.position);
        if (getClickedBody.length !== 0 && cardArray.length > 1 && getClickedBody !== undefined && authUser != undefined) {
          props.setFollowingCard(true);
          let matterCardId = getClickedBody[0].id
          setMatterCardId(matterCardId)
          //* Call function to update floating card with card data
          if (matterCardId !== undefined) {
            props.handleShowingLargeCard(matterCardId)
          }
          document.querySelector('#scene').addEventListener(props.isMobile ? 'touchmove' : 'mousemove', onMouseMove)
          document.querySelector('#scene').addEventListener(props.isMobile ? 'touchend' : 'mouseup', onRelease)
        }
      });
    }
  }, [cardArray, currentDeck, showFollowingCard, showLargeCard, constraints, mEngine, mMouseConstraint]);

  //Todo: Move to CommandBar.js component
  const extendCommandBar = () => {
    if (!commandBarExtended) {
      animExtendCommandBar();
      setCommandBarExtended(true);
    } else {
      animHideCommandBar();
      setCommandBarExtended(false);
    }
  }

  //Todo: Move to separate component
  return (
    <>
      <div id="scene" className="relative flex justify-center">
        <div id="command-bar" className="fixed bottom-0 left-0 flex h-16 p-3 mx-auto bg-gray-900 border-gray-300 shadow-md space rounded-br-md">
          <button id="command-bar-button" onClick={() => { extendCommandBar(); }} className="mr-4 select-none"><img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAUUlEQVRIS+2USQoAMAgDzf8fnZ67UA9lBKGeq5MFqoBH8P34gDTh+ohsO5V1eSBpEr05wAEv6k+79R3gDvAOcAAeUX8A3gEO6N/Bd7AmgP+mA2tUGBlfaHSyAAAAAElFTkSuQmCC" /></button>
          <div>
            <div id="buttons-popup" className="fixed bottom-0 inline-block w-full h-16 bg-gray-900 opacity-0">
              <button className="z-10 m-2 text-white transform outline-none select-none text-bold hover:scale-105 " onClick={() => setGravity(prevState => !prevState)}> Gravity</button>
              <button className="z-10 m-2 text-white transform outline-none select-none text-bold hover:scale-105" onClick={() => props.setGenerateMoreCards(prevState => prevState + 1)}>Card Boost</button>
              <button className="z-10 justify-end m-2 text-red-400 transform outline-none select-none animate-pulse text-bold hover:scale-105" onClick={() => props.setCurrentlyGeneratingCards(prevState => !prevState)}>Exploring cards . . .</button>
            </div>
          </div>
        </div>
        <div
          ref={boxRef}
          style={{
            width: "100%",
            height: "100%",
          }}>
        </div>
        <div id="canvas" className="w-auto h-auto" >
          <canvas
            ref={canvasRef} />
        </div>
      </div>
    </>
  )
}

Scene.propTypes = {
  isMobile: PropTypes.bool,
  getCards: PropTypes.func,
  generateDeck: PropTypes.func
};

export default Scene;