import React, { useEffect, useState, useRef } from 'react'
import Matter from "matter-js";
import background from '../img/background.jpg'
import popup from '../img/popup.jpg'
import images from '../img/index'
import testcard from '../img/testcard.png'
import PropTypes from "prop-types";
import { gsap } from "gsap";


//! Current scene.js still needs to be broken up into smaller components and refactored
//Todo: Refactor and reorganize code

//* Holds style for pop up div when hovering over a Matter.js card
//? Is this style necessary?
const floatingCardStyle = {
  backgroundImage: `url(${popup})`,
  backfaceVisibility: "hidden",
  pointerEvents: "none",
}

function Scene(props) {
  //* State
  //? Should this be here?
  //Todo: Use context with core matter components
  const [mEngine, setEngine] = useState(null);
  const [mMouseConstraint, setMouseConstraint] = useState(null);
  const [mGravity, setGravity] = useState(true);
  const [userClicks, setUserClicks] = useState(1);

  const boxRef = useRef(null)
  const canvasRef = useRef(null)


  //* For responsiveness
  const [constraints, setContraints] = useState()
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
    engine.world.gravity.y = 0.001;

    let render = Render.create({
      element: boxRef.current,
      engine: engine,

      canvas: canvasRef.current,
      options: {
        showAngleIndicator: false,
        showIds: false,
        width: window.innerWidth,
        height: window.innerHeight,
        background: images.background,
        wireframes: false,

      },
    })

    //* Add platform
    Composite.add(engine.world, [
      Bodies.rectangle(700, 550, 300, 100, {
        isStatic: true, render: { fillStyle: '#9b7653', strokeStyle: 'red' }, collisionFilter: {
          group: 0,
          category: 1,
          mask: 1
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

    ////Track user clicks
    //// Matter.Events.on(mouseConstraint, "mousedown", (event) => {
    ////   setUserClicks(prevState => prevState + 1)
    //// });


    Runner.run(engine);
    Render.run(render);

    //* Get window constraints for managing responsiveness
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

      //* Responsive static bodies
      //todo Create responsive static bodies
      const floor = scene.engine.world.bodies.filter(e => e.id.length < 1)
      floor.forEach(element => {
        Matter.Body.setPosition(element, {
          x: width / 2,
          y: height - 100,
        })
      }
      )
    }
  }, [scene, constraints])

  useEffect(() => {
    console.log(props.isMobile);
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  //*Animation for card following mouse 
  //Todo Move all gsap animations to separate component
  function onMouseMove(event) {
    console.log("LOL")
    if (props.showFollowingCard) {
      var tl = gsap.timeline()
      tl.to(document.querySelector('#floating-card'), {
        opacity: 1.0,
        duration: 0.9,
        scale: 1.0,
        //* Responsive default
        //? Does this need to be adjusted?
        x: props.isMobile ? event.offsetX = event.touches[0].pageX - event.touches[0].target.offsetLeft + 1 : event.offsetX + 50,
        y: props.isMobile ? event.offsetY = event.touches[0].pageY - event.touches[0].target.offsetTop - 200 : event.offsetY - 200,
        ease: "power4.out",
      })
      
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
      document.querySelector('#scene').removeEventListener(props.isMobile ? 'touchmove' : 'mousemove', onMouseMove);
      document.querySelector('#scene').removeEventListener(props.isMobile ? 'touchend' : 'mouseup', onRelease);
      let tl = gsap.timeline()
      tl.delay(1);
      tl.to(document.querySelector('#floating-card'), {
        opacity: 1.0,
        duration: 1.7,
        scale: 3.0,
        x: 140,
        y: 200,
        ease: "elastic.out"
      })
      //// tl.set("#floating-card", { fontSize: '10%' });
      tl.delay(0.3)
    });
  }

  //* Animation for hiding enlarged card
  useEffect(() => {
    if (mMouseConstraint !== null) {
      Matter.Events.off(mMouseConstraint, "mouseup")
    }
    if (mMouseConstraint != null && props.showLargeCard) {
      Matter.Events.on(mMouseConstraint, "mousedown", () => {
        Matter.Events.off(mMouseConstraint, "mousedown")
        props.setShowLargeCard(false);
        let tl = gsap.timeline()
        tl.delay(1);
        tl.to(document.querySelector('#floating-card'), {
          opacity: 1.0,
          transformStyle: "preserve-3d",
          perspective: 200,
          perspectiveOrigin: '50% 50% 0px',
          duration: 0.5,
          scale: 4.0,
          x: 140,
          y: 200,
          ease: "elastic.out"
        })
        tl.to(document.querySelector('#floating-card'), {
          opacity: 1.0,
          duration: 1.0,
          scale: 0,
          x: 300,
          y: 0,
          ease: "elastic.out"
        })
        tl.set("#floating-card", { fontSize: '25%' });
        tl.delay(0.3)
      });
    }
  }, [props.showLargeCard])

  //* Check if user presses gravity button
  //? Should this be removed?
  useEffect(() => {
    if (mGravity && mEngine !== null) {
      mEngine.world.gravity.y = 0.33;
    }
    else if (mEngine !== null) {
      mEngine.world.gravity.y = -0.11;
    }
  }, [mGravity, mEngine])

  //* Handles card generation
  //Todo: Move to card generation component

  useEffect(() => {
    for (let i = 0; i < props.currentDeck.length; i++) {
      //* Random card generation at slightly different times visual effect
      let randomTime = Math.floor(Math.random() * (400 - 10 + 1)) + 10 
      let randomImage = Math.floor(Math.random() * (56)) + 1;

      setTimeout(function () {
        var newBody = Matter.Composite.add(mEngine.world, [Matter.Bodies.rectangle(Math.random() * 1000 + 1, 0, 35, 50, {
          isStatic: false,
          angle: (Math.floor(Math.random() * (6.28 * 100 - 1 * 100) + 1 * 100) / (1 * 100)), //! Angle is in radians. Randomizes between 0 and 6.28
          chamfer: { radius: 1 },
          density: 0.2,
          force: { x: 2, y: 3 },
          collisionFilter: {
            group: 0,
            category: 1,
            mask: 1
          },
          render: {
            fillStyle: '#374151',
            strokeStyle: '#968786',
            chamfer: { radius: 4 },
            lineWidth: 2,
            sprite: {
              texture: images[randomImage],
            }
          },
          id: props.currentDeck[props.currentDeck.length - 1].id
        })]);
      }, randomTime);
      props.currentDeck.pop();
    }
  }, [props.currentDeck])

  //* Handle adding floating div to mouse movement
  //Todo: Move to mouse constraint component
  useEffect(() => {
    ////console.log(props.cardArray);
    //* Add floating div movement event 
    if (mMouseConstraint !== null && mEngine !== null && props.cardArray !== undefined) {
      Matter.Events.on(mMouseConstraint, "mousedown", (event) => {
        let getClickedBody = Matter.Query.point(mEngine.world.bodies, event.mouse.position);

        if (getClickedBody.length !== 0 && props.cardArray.length > 1 && getClickedBody !== undefined) {
          props.setFollowingCard(true);
          let matterCardId = getClickedBody[0].id
          //// console.log(matterCardId)
          //// console.log(props.cardArray);
          //* Call function to update floating card with card data
          if (matterCardId !== undefined) {
            console.log(matterCardId);
            props.handleShowingLargeCardFront(matterCardId)
          }
          // //Add listener to make floating card follow mouse
          document.querySelector('#scene').addEventListener(props.isMobile ? 'touchmove' : 'mousemove', onMouseMove)
          //// document.getElementById('floating-card').addEventListener(handleClick)
          //Add mouse event to make card enlarge
          document.querySelector('#scene').addEventListener(props.isMobile ? 'touchend' : 'mouseup', onRelease)
        }
      });
    }
    //// console.log(props.currentDeck);
    //// console.log(props.cardArray)
  //Todo: Necessary dependencies?    
  }, [props.cardArray, props.currentDeck, props.showFollowingCard, props.showLargeCard]);

  //* Animation on card click
  //Todo: Fix to only trigger on clicking div
  useEffect(() => {
    const cardsPopup = document.getElementById("cards-popup");
    const buttonsPopup = document.getElementById("buttons-popup");

    let tl = gsap.timeline()
    tl.delay(1);
    tl.yoyo(true);
    tl.from(cardsPopup, { opacity: 0, xPercent: -100, rotation: 180 })
    tl.to(cardsPopup, { opacity: 1, xPercent: 0, duration: 1.3, ease: "Power1.out" })
    tl.repeatDelay(2.5);
    tl.repeat(1);

  }, [props.CardArray])
  //Todo: Implement
  const handleClick = () => {
    console.log("clicked on div")
  }


//Todo: Move to separate component
  return (
    <div id="scene" className="flex justify-center relative">
      {props.showFollowingCard === true ? <div id="floating-card" onClick={handleClick} className="z-50 absolute w-3/12 bottom-1/5 overflow-hidden h-32 top-0 left-0 rounded-sm opacity-90" style={floatingCardStyle}>
        <div >{props.largeCardData}</div>
      </div>
        : null}
      <div id="buttons-popup" className="top-2 fixed flex h-16 space bg-gray-700 p-3 shadow-md w-full sm:w-full mx-auto rounded-br-md rounded-bl-md border-2 border-gray-700 ">
        <div className="sm:left-1/3 fixed ">
          <button className="text-white ring-green-500 m-2 outline-none select-none text-bold transform hover:scale-105 z-10 " onClick={() => setGravity(prevState => !prevState)}>Reverse Gravity</button>
          <button className="text-white m-2 outline-none select-none text-bold transform hover:scale-105 z-10" onClick={() => props.setGenerateMoreCards(prevState => prevState + 1)}>Card Boost</button>
          <button className="text-red-400 m-2 justify-end outline-none select-none animate-pulse text-bold transform hover:scale-105 z-10" onClick={() => props.setCurrentlyGeneratingCards(prevState => !prevState)}>Exploring cards . . .</button>
        </div>
      </div>
      <div id="cards-popup" style={{ backgroundImage: `url(${popup})` }} className=" fixed p-3 border-r-2 select-none border-gray-700 rounded-r-md h-24 w-4/12 left-0 top-36 sm:w-2/12 sm:h-3/6 bg-gray-700 shadow-lg"><div className="z-50 border-red-400  text-white"> New Cards: {props.cardArray.length} <br></br> Tags: All </div></div>
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