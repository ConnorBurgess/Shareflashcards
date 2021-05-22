import React, { useEffect, useState, useRef } from 'react'
import Matter from "matter-js";
import background from '../img/background.jpg'
// import background_alt from '../img/background_alt.jpg'
import blank_card_small from '../img/blank_card_small.jpg'
import PropTypes from "prop-types";
import { animFollowing, animEnlarge, animSave, animDismiss, animExtendCommandBar, animHideCommandBar } from '../lib/gsap'
import { handleUpdatingFirestoreCards } from '../lib/firebase'

//! Current scene.js still needs to be broken up into smaller components and refactored
//Todo: Refactor and reorganize code
function Scene(props) {

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
    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        showAngleIndicator: false,
        showIds: false,
        width: window.innerWidth,
        height: window.innerHeight,
        background: background,
        wireframes: false,
      },
    })

    Composite.add(engine.world, [
      Bodies.rectangle(700, 550, 2000, 130, {
        isStatic: true, render: { fillStyle: '#111827' }, chamfer: { radius: 10 }, collisionFilter: {
          group: 0,
          category: 1,
          mask: 1,
          restitituion: 1,
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

    Composite.add(engine.world, mouseConstraint);
    setMouseConstraint(mouseConstraint);
    extendCommandBar();
    Runner.run(engine);
    Render.run(render);
    setContraints(boxRef.current.getBoundingClientRect())
    setScene(render)

    window.addEventListener('resize', handleResize)
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

      //* Responsive static body
      const floor = scene.engine.world.bodies.filter(e => e.id.length < 1)
      Matter.Body.setPosition(floor[0], {
        x: width / 2,
        y: height,
      })
    }
  }, [scene, constraints])

  useEffect(() => {
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  function onMouseMove(event) {
    if (showFollowingCard) {
      animFollowing(event, props.isMobile);
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
    if (!props.userSignedIn) {
      props.setShowSignUp(prevState => !prevState)
    }
    if (mMouseConstraint !== null) {
      Matter.Events.off(mMouseConstraint, "mouseup")
    }
    if (mMouseConstraint != null && showLargeCard && props.userSignedIn) {
      props.setCardBackShowing(false);
      Matter.Events.on(mMouseConstraint, "mousedown", (event) => {
        document.getElementById("floating-card").classList.add("pointer-events-none")
        handleUpdatingFirestoreCards(matterCard)
        Matter.Events.off(mMouseConstraint, "mousedown")
        props.setShowLargeCard(false);
        if (event.source.constraint.pointA.x > constraints.width / 2) {
          animSave(props.isMobile);
        }
        else {
          animDismiss(props.isMobile);
        }
      });
    }
  }, [showLargeCard])

  //Animation for handling bottom command bar
  //* Check if user presses gravity button
  //? Should this be removed?
  useEffect(() => {
    if (mGravity && mEngine !== null) {
      mEngine.world.gravity.y = 0.33;
    }
    else if (mEngine !== null) {
      mEngine.world.gravity.y = -0.2;
    }
  }, [mGravity, mEngine])

  //* Handles card generation
  //Todo: Move to card generation component

  useEffect(() => {

    const generateMatterCard = () => {
      return Matter.Composite.add(mEngine.world, [Matter.Bodies.rectangle(Math.random() * 1000 + 1, 0, 37, 54, {
        isStatic: false,
        angle: (Math.floor(Math.random() * (6.28 * 100 - 1 * 100) + 1 * 100) / (1 * 100)), //! Angle is in radians. Randomizes between 0 and 6.28
        chamfer: { radius: 1 },
        density: 0.2,
        force: { x: 2, y: 3 },
        restitituion: 1,
        frictionAir: 0.001,
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

    //* Add floating div movement event 
    if (mMouseConstraint !== null && mEngine !== null && cardArray !== undefined) {

      Matter.Events.on(mMouseConstraint, "mousedown", (event) => {
        let getClickedBody = Matter.Query.point(mEngine.world.bodies, event.mouse.position);
        if (getClickedBody.length !== 0 && cardArray.length > 1 && getClickedBody !== undefined) {
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
    <div id="scene" className="relative flex justify-center">
      <div id="command-bar" className="fixed bottom-0 left-0 flex h-16 p-3 mx-auto bg-gray-900 border-gray-300 shadow-md space rounded-br-md">
        <button onClick={() => { extendCommandBar(); }} className="mr-4"><img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAUUlEQVRIS+2USQoAMAgDzf8fnZ67UA9lBKGeq5MFqoBH8P34gDTh+ohsO5V1eSBpEr05wAEv6k+79R3gDvAOcAAeUX8A3gEO6N/Bd7AmgP+mA2tUGBlfaHSyAAAAAElFTkSuQmCC" /></button>
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
      <div id="canvas" >
        <canvas
          ref={canvasRef} />
      </div>
    </div>
  )
}

Scene.propTypes = {
  isMobile: PropTypes.bool,
  getCards: PropTypes.func,
  generateDeck: PropTypes.func
};

export default Scene;