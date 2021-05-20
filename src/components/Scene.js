import React, { useEffect, useState, useRef } from 'react'
import Matter from "matter-js";
import popup from '../img/popup.jpg'
import images from '../img/index'
import blank_card_small from '../img/blank_card_small.jpg'
import PropTypes from "prop-types";
import { gsap } from "gsap";
import { handleUpdatingFirestoreCards } from './utils'

//! Current scene.js still needs to be broken up into smaller components and refactored
//Todo: Refactor and reorganize code

//* Holds style for pop up div when hovering over a Matter.js card
//? Is this style necessary?
const floatingCardStyle = {
  backgroundImage: `url(${images.blank_card})`,
  backfaceVisibility: "hidden",
  object_fit: "cover",
  overflow: "hidden",
  backgroundSize: "100%",
  backgroundRepeat: "no-repeat"
}

function Scene(props) {

  //? Should this be here?
  //Todo: Use context with core matter components and otherwise refactor state
  const [mEngine, setEngine] = useState(null);
  const [mMouseConstraint, setMouseConstraint] = useState(null);
  const [mGravity, setGravity] = useState(true);
  const [userClicks, setUserClicks] = useState(1);
  const [matterCard, setMatterCardId] = useState(null);

  const boxRef = useRef(null)
  const canvasRef = useRef(null)


  //* Responsive state
  const [constraints, setContraints] = useState()
  const [commandBarExtended, setCommandBarExtended] = useState(false)
  const [mRender, setRender] = useState(false);
  const [scene, setScene] = useState()
  const handleResize = () => {
    setContraints(boxRef.current.getBoundingClientRect())
  }

  useEffect(() => {

    //* Core matter engine / canvas initialization
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      World = Matter.World,
      Common = Matter.Common,
      Pairs = Matter.Pairs,
      Bodies = Matter.Bodies,
      Mouse = Matter.Mouse,
      Events = Matter.Events,
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
        background: props.backgroundTheme ? images.background : images.background2,
        wireframes: false,

      },
    })
      setRender(render);
    //* Add platform
    Composite.add(engine.world, [
      Bodies.rectangle(700, 550, 2000, 130, {
        isStatic: true, render: { fillStyle: '#111827', strokeStyle: 'red' }, chamfer: { radius: 10 }, collisionFilter: {
          group: 0,
          category: 1,
          mask: 1,
          restitituion: 1,
        }, id: ""
      }),
    ]);

    //* Implement mouse control
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
    extendCommandBar()
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
  useEffect(() => {
  }, [props.cardBackShowing])

  //*Animation for card following mouse 
  //Todo: Move all gsap animations to separate component
  function onMouseMove(event) {
    if (props.showFollowingCard) {
      var tl = gsap.timeline()
      tl.to(document.querySelector('#floating-card'), {
        opacity: 1.0,
        duration: 0.9,
        scale: 1.0,
        x: props.isMobile ? event.offsetX = event.touches[0].pageX - event.touches[0].target.offsetLeft + 1 : event.offsetX + 50,
        y: props.isMobile ? event.offsetY = event.touches[0].pageY - event.touches[0].target.offsetTop - 200 : event.offsetY - 200,
        ease: "power4.out",
      })
      setTimeout(() => {
        tl.to(document.querySelector('#floating-card'), {
          duration: 0.6,
          rotate: 9,
        })
      }, 3500);
      // setTimeout(() => {
      //   tl.to(document.querySelector('#floating-card'), {
      //     duration: 0.6,
      //     rotate: 360,
      //   })
      // },5000);
      // tl.set('#floating-card', {
      //   xPercent: -50,
      //   yPercent: -50
      // })
    }
  }

  //* Animation for enlarge card
  function onRelease(event) {
    Matter.Events.on(mMouseConstraint, "mouseup", (event) => {
      props.setShowLargeCard(true);
      document.getElementById("floating-card").classList.remove("pointer-events-none")
      document.querySelector('#scene').removeEventListener(props.isMobile ? 'touchmove' : 'mousemove', onMouseMove);
      document.querySelector('#scene').removeEventListener(props.isMobile ? 'touchend' : 'mouseup', onRelease);
      let tl = gsap.timeline()
      tl.delay(1);
      tl.to(document.querySelector('#floating-card'), {
        opacity: 1.0,
        duration: 1.7,
        scale: 3.0,
        x: props.isMobile ? 140 : event.offsetX,
        y: props.isMobile ? 200 : event.offsetY,
        ease: "elastic.out"
      })
      tl.to(document.querySelector('#floating-card'), {
        duration: 0.9,
        ease: "elastic.in",
        x: props.isMobile ? 140 : constraints.right/2,
        y: props.isMobile ? 200 : constraints.height/3,
        ease: "elastic.out"
      })

      tl.set("#floating-card", { fontSize: '25%' });
      tl.delay(0.3)
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
    if (mMouseConstraint != null && props.showLargeCard && props.userSignedIn) {
      props.setCardBackShowing(false);
      Matter.Events.on(mMouseConstraint, "mousedown", (event) => {
        document.getElementById("floating-card").classList.add("pointer-events-none")
        handleUpdatingFirestoreCards(matterCard)
        Matter.Events.off(mMouseConstraint, "mousedown")
        props.setShowLargeCard(false);
        let tl = gsap.timeline()
        if (event.source.constraint.pointA.x > constraints.width / 2) {
          const saveIcon = document.getElementById("save-icon");
          tl.from(saveIcon, {
            perspective: 800,
            perspectiveOrigin: '50% 50% 0px',
            duration: 0.3,
            scale: 0.0,
            rotate: 360,
            ease: "elastic.out"
          })
          tl.to(saveIcon, {
            opacity: 1.0,
            duration: 0.3,
            scale: 2.0,
            rotate: 360,
            ease: "elastic.out"
          })
          tl.to(saveIcon, {
            opacity: 1.0,
            duration: 0.4,
            scale: 0,
            rotate: 360,
            ease: "elastic.out"
          })
          tl.to(document.querySelector('#floating-card'), {
            opacity: 1.0,
            transformStyle: "preserve-3d",
            perspective: 200,
            perspectiveOrigin: '50% 50% 0px',
            duration: 0.5,
            scale: 4.0,
            x: 0,
            y: 0,
            ease: "elastic.out"
          })
          tl.to(document.querySelector('#floating-card'), {
            opacity: 1.0,
            duration: 1.0,
            scale: 0,
            x: props.isMobile ? 300 : 355,
            y: props.isMobile ? 0 : -15,
            ease: "elastic.out"
          })
          tl.set("#floating-card", { fontSize: '100%' });
          const saveNav = document.getElementById("saved-nav")
          tl.to(saveNav, {
            duration: 0.3,
            color: "#A75248",
            scale: 2.0,
            rotate: 30,
            ease: "power4.out"
          })
          tl.to(saveNav, {
            duration: 0.3,
            scale: 1,
            color: "white",
            rotate: 0,
            rotate: 0,
            ease: "power4.in"
          })
        }
        else {
          tl.to(document.querySelector('#floating-card'), {
            opacity: 1.0,
            transformStyle: "preserve-3d",
            perspective: 200,
            perspectiveOrigin: '50% 50% 0px',
            duration: 0.5,
            scale: 1.0,
            x: 140,
            y: 200,
            ease: "elastic.out"
          })
          tl.set("#floating-card", { fontSize: '100%' });
          tl.to(document.querySelector('#floating-card'), {
            opacity: 1.0,
            duration: 1.0,
            scale: 0,
            x: props.isMobile ? 300 : 355,
            y: props.isMobile ? 0 : 300,
            ease: "elastic.out"
          })
          tl.to(document.querySelector('#floating-card'), {
            opacity: 1.0,
            duration: 1.0,
            scale: 0,
            rotate: 360,
            x: props.isMobile ? 300 : 355,
            y: props.isMobile ? 0 : -400,
            ease: "elastic.out"
          })
        }
      });
    }
  }, [props.showLargeCard])

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
      let newBody = Matter.Composite.add(mEngine.world, [Matter.Bodies.rectangle(Math.random() * 1000 + 1, 0, 37, 54, {
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
        id: props.currentDeck[props.currentDeck.length - 1].id
      })]);

    }
    for (let i = 0; i < props.currentDeck.length; i++) {
      //* Random card generation at slightly different times visual effect
      let randomTime = Math.floor(Math.random() * (400 - 10 + 1)) + 10

      setTimeout(function () {
        generateMatterCard();

      }, randomTime);
      props.currentDeck.pop()
      // props.setCurrentDeck(prevDeck => prevDeck.filter((element, index) => index < prevDeck.length - 1))
    }
  }, [props.currentDeck])

  //* Handle adding floating div to mouse movement
  //Todo: Move to mouse constraint component
  useEffect(() => {

    //* Add floating div movement event 
    if (mMouseConstraint !== null && mEngine !== null && props.cardArray !== undefined) {

      Matter.Events.on(mMouseConstraint, "mousedown", (event) => {
        let getClickedBody = Matter.Query.point(mEngine.world.bodies, event.mouse.position);
        if (getClickedBody.length !== 0 && props.cardArray.length > 1 && getClickedBody !== undefined) {
          props.setFollowingCard(true);
          let matterCardId = getClickedBody[0].id
          setMatterCardId(matterCardId)

          //* Call function to update floating card with card data
          if (matterCardId !== undefined) {
            props.handleShowingLargeCard(matterCardId)
          }
          document.querySelector('#scene').addEventListener(props.isMobile ? 'touchmove' : 'mousemove', onMouseMove)
          //Add mouse event to make card enlarge
          document.querySelector('#scene').addEventListener(props.isMobile ? 'touchend' : 'mouseup', onRelease)
        }
      });
    }
    //Todo: Necessary dependencies?    
  }, [props.cardArray, props.currentDeck, props.showFollowingCard, props.showLargeCard]);

  //* Animation for card popup
  //Todo: Fix to only trigger on clicking div
  useEffect(() => {
    const cardsPopup = document.getElementById("cards-popup");

    let tl = gsap.timeline()
    tl.delay(1);
    tl.yoyo(true);
    tl.from(cardsPopup, { opacity: 0, xPercent: -100, rotation: 180 })
    tl.to(cardsPopup, { opacity: 1, xPercent: 0, duration: 1.3, ease: "Power1.out" })
    tl.repeatDelay(2.5);
    tl.repeat(1);

  }, [props.CardArray])
  //Todo: Implement

  //Todo: Move to CommandBar.js component
  const extendCommandBar = (extended) => {
    const commandBarButtons = document.getElementById("buttons-popup");
    let tl = gsap.timeline()
    if (!commandBarExtended || extended) {
      tl.from(commandBarButtons, { autoAlpha: 0, xPercent: -75, yPercent: 100 })
      tl.to(commandBarButtons, { autoAlpha: 50, xPercent: 0, duration: 0.3, ease: "Power4.in" })
      tl.to(commandBarButtons, { autoAlpha: 100, yPercent: -100, duration: 0.6, ease: "Power4.out" })
      tl.to(commandBarButtons, { yPercent: 0, duration: 0.6, ease: "bounce" })
      setCommandBarExtended(true);

    } else if (commandBarExtended || extended) {
      tl.from(commandBarButtons, { xPercent: 0 })
      tl.to(commandBarButtons, { yPercent: 100, duration: 0.6, ease: "Power4.in" })
      tl.to(commandBarButtons, { autoAlpha: 0, xPercent: -100, duration: 1.3, ease: "power4.out" })
      setCommandBarExtended(false);
    }
  }

  useEffect(() => {
  }, [props.backgroundTheme])


  //Todo: Move to separate component
  return (
    <div id="scene" className="flex justify-center relative">
      {props.showFollowingCard === true ?
        <div onClick={() => {props.setCardBackShowing(prevState => !prevState)}}id="floating-card"
          className="z-50 pointer-events-none select-none absolute w-3/12 bottom-1/5 overflow-hidden pb-3 mr-1 h-36 sm:h-40 top-0 left-0 rounded-sm opacity-90 lg:h-1/4 sm:w-1/12"
          style={floatingCardStyle}>
          <div > {props.cardBackShowing ? props.largeCardDataBack : props.largeCardDataFront}</div>
        </div>
        : null}
      <div id="command-bar" className="bottom-0 fixed left-0 flex h-16 space bg-gray-900 p-3 shadow-md mx-auto rounded-br-md border-gray-300">
        <button onClick={() => { extendCommandBar() }} className="mr-4"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAUUlEQVRIS+2USQoAMAgDzf8fnZ67UA9lBKGeq5MFqoBH8P34gDTh+ohsO5V1eSBpEr05wAEv6k+79R3gDvAOcAAeUX8A3gEO6N/Bd7AmgP+mA2tUGBlfaHSyAAAAAElFTkSuQmCC" /></button>
        <div>
          <div id="buttons-popup" className="fixed opacity-0 h-16 bottom-0 inline-block w-full bg-gray-900">
            <button className="text-white m-2 outline-none select-none text-bold transform hover:scale-105 z-10 " onClick={() => setGravity(prevState => !prevState)}>Reverse Gravity</button>
            <button className="text-white m-2 outline-none select-none text-bold transform hover:scale-105 z-10" onClick={() => props.setGenerateMoreCards(prevState => prevState + 1)}>Card Boost</button>
            <button className="text-white m-2 outline-none select-none text-bold transform hover:scale-105 z-10" onClick={() => props.setBackgroundTheme(prevState => !prevState)}>{props.backgroundTheme ? "Day" : "Night"}</button>
            <button className="text-red-400 m-2 justify-end outline-none select-none animate-pulse text-bold transform hover:scale-105 z-10" onClick={() => props.setCurrentlyGeneratingCards(prevState => !prevState)}>Exploring cards . . .</button>
          </div>
        </div>
      </div>
      <div id="cards-popup" style={{ backgroundImage: `url(${popup})` }} className=" fixed p-3 border-r-2 select-none border-gray-700 rounded-r-md h-24 w-4/12 left-0 top-36 sm:w-2/12 sm:h-3/6 bg-gray-700 shadow-lg md:p-5 text-green-800 sm:text-3xl"><div className="z-50 border-red-400  text-white"> New Cards: {props.cardArray.length} <br></br> Tags: All </div></div>
      <div
        ref={boxRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
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