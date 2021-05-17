import React, { useEffect, useState, useRef } from 'react'
import Matter from "matter-js";
import background from '../img/background.jpg'
import popup from '../img/popup.jpg'
import images from '../img/index'
import testcard from '../img/testcard.png'
import PropTypes from "prop-types";
import { gsap } from "gsap";
// import randomColor from "randomcolor";

//Holds style for pop up div when hovering over a Matter.js card
const floatingCardStyle = {
  backgroundImage: `url(${popup})`,
  backfaceVisibility: "hidden",
  pointerEvents: "none",
}

//Matter.js scene

function Scene(props) {
  const [mEngine, setEngine] = useState(null);
  const [mMouseConstraint, setMouseConstraint] = useState(null);
  const [mGravity, setGravity] = useState(true);
  const [userClicks, setUserClicks] = useState(1);

  const boxRef = useRef(null)
  const canvasRef = useRef(null)


  //responsive
  const [constraints, setContraints] = useState()
  const [scene, setScene] = useState()
  const handleResize = () => {
    console.log("resizing")
    setContraints(boxRef.current.getBoundingClientRect())
  }


  //Handle key events
  // useEffect(() => {
  //   console.log("re-rendered")
  //   console.log(props.cardArray);
  // }, [props.cardArray]);
  useEffect(() => {
    console.log("first");

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

    //Add keydown events
    document.addEventListener("keydown", props.handleKeyPress, false);

    
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
    
    //Add platform
    Composite.add(engine.world, [
      //Green platform
      // Bodies.rectangle(300, 490, 200, 20, { isStatic: true, showIds: false, render: { fillStyle: '#567d46'}, id: "" }),
      // Bodies.rectangle(500, 490, 200, 20, { isStatic: true, render: { fillStyle: '#567d46'}, id: "" }),
      // Bodies.rectangle(700, 490, 200, 20, { isStatic: true, render: { fillStyle: '#567d46'}, id: "" }),
      // Bodies.rectangle(900, 490, 200, 20, { isStatic: true, render: { fillStyle: '#567d46'}, id: "" }),
      // Bodies.rectangle(1100, 490, 200, 20, { isStatic: true, render: { fillStyle: '#567d46'}, id: "" }),

      // Bodies.rectangle(300, 550, 200, 100, { isStatic: true, showIds: false, render: { fillStyle: '#9b7653', strokeStyle: 'default' }, id: "" }),
      // Bodies.rectangle(500, 550, 200, 100, { isStatic: true, render: { fillStyle: '#9b7653', strokeStyle: 'red' }, id: "" }),
      // Bodies.rectangle(700, 550, 200, 100, { isStatic: true, render: { fillStyle: '#9b7653', strokeStyle: 'red' }, id: "" }),
      // Bodies.rectangle(900, 550, 200, 100, { isStatic: true, render: { fillStyle: '#9b7653', strokeStyle: 'red' }, id: "" }),
      // Bodies.rectangle(1100, 550, 200, 100, { isStatic: true, render: { fillStyle: '#9b7653', strokeStyle: 'red' }, id: "" }),
      // Bodies.rectangle(300, 490, 200, 20, { isStatic: true, showIds: false, render: { fillStyle: '#567d46' }, id: "" }),
      // Bodies.rectangle(500, 490, 200, 20, { isStatic: true, render: { fillStyle: '#567d46' }, id: "" }),
      // Bodies.rectangle(700, 490, 200, 20, { isStatic: true, render: { fillStyle: '#567d46' }, id: "" }),
      // Bodies.rectangle(900, 490, 200, 20, { isStatic: true, render: { fillStyle: '#567d46' }, id: "" }),
      // Bodies.rectangle(1100, 490, 200, 20, { isStatic: true, render: { fillStyle: '#567d46' }, id: "" }),

      // Bodies.rectangle(300, 550, 200, 100, { isStatic: true, showIds: false, render: { fillStyle: '#9b7653', strokeStyle: 'default' }, id: "" }),
      // Bodies.rectangle(500, 550, 300, 100, { isStatic: true, render: { fillStyle: '#9b7653', strokeStyle: 'red' }, id: "" }),
      Bodies.rectangle(700, 550, 300, 100, { isStatic: true, render: { fillStyle: '#9b7653', strokeStyle: 'red' }, id: "" }),
      // Bodies.rectangle(900, 550, 200, 100, { isStatic: true, render: { fillStyle: '#9b7653', strokeStyle: 'red' }, id: "" }),
      // Bodies.rectangle(1100, 550, 200, 100, { isStatic: true, render: { fillStyle: '#9b7653', strokeStyle: 'red' }, id: "" }),



    ]);

    // Implement mouse control
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

    //Track user clicks
    Matter.Events.on(mouseConstraint, "mousedown", (event) => {
      setUserClicks(prevState => prevState + 1)
    });

    Runner.run(engine);
    Render.run(render);


    //Get window constraints for managing responsiveness
    setContraints(boxRef.current.getBoundingClientRect())
    setScene(render)

    window.addEventListener('resize', handleResize)
  }, [])

  //Responsive canvas
  useEffect(() => {
    if (constraints) {
      let { width, height } = constraints
      scene.bounds.max.x = width
      scene.bounds.max.y = height
      scene.options.width = width
      scene.options.height = height
      scene.canvas.width = width
      scene.canvas.height = height

      //Responsive static bodies
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
    return () => {
      window.removeEventListener('resize', handleResize)
    }

  }, [])

  //Animation for card following mouse 
  function onMouseMove(event) {
    // console.log(props.showFollowingCard)
    if (props.showFollowingCard) {
      var tl = gsap.timeline()
      tl.to(document.querySelector('#floating-card'), {
        opacity: 1.0,
        duration: 0.9,
        scale: 1.0,
        //responsive default
        x: event.offsetX = event.touches[0].pageX - event.touches[0].target.offsetLeft + 50,
        y: event.offsetY = event.touches[0].pageY - event.touches[0].target.offsetTop - 200,
        ease: "power4.out",
      })
    }
  }


  //Animation for enlarge card
  function onRelease(event) {
    Matter.Events.on(mMouseConstraint, "mouseup", (event) => {
      props.setShowLargeCard(true);
      document.querySelector('#scene').removeEventListener('touchmove', onMouseMove);
      document.querySelector('#scene').removeEventListener('mouseup', onRelease);
      document.querySelector('#scene').removeEventListener('touchend', onRelease);
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
      tl.set("#floating-card", { fontSize: '10%' });
      tl.delay(0.3)
    });
  }

  //Animation for hiding enlarged card
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
        tl.set("#floating-card", { fontSize: '10%' });
        tl.delay(0.3)
      });
    }
  }, [props.showLargeCard])

  //Check if user presses gravity button
  useEffect(() => {
    if (mGravity && mEngine !== null) {
      mEngine.world.gravity.y = 0.33;
    }
    else if (mEngine !== null) {
      mEngine.world.gravity.y = -0.11;
    }

  }, [mGravity, mEngine])

  useEffect(() => {
    for (let i = 0; i < props.currentDeck.length; i++) {

      //Random card generation at slightly different times for better visual effect
      let randomTime = Math.floor(Math.random() * (400 - 10 + 1)) + 10 //Random time between 10ms and 400ms
      let randomImage = Math.floor(Math.random() *(56)) +1;
      setTimeout(function () {
        var newBody = Matter.Composite.add(mEngine.world, [Matter.Bodies.rectangle(Math.random() * 1000 + 1, 0, 35, 50, {
          isStatic: false,
          angle: (Math.floor(Math.random() * (6.28 * 100 - 1 * 100) + 1 * 100) / (1 * 100)), //Angle is in radians. Randomizes between 0 and 6.28
          chamfer: { radius: 1 },
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

  useEffect(() => {
    console.log(props.cardArray);
    //Add floating div movement event 
    if (mMouseConstraint !== null && mEngine !== null && props.cardArray !== undefined) {
      Matter.Events.on(mMouseConstraint, "mousedown" || "touchstart", (event) => {
        let getClickedBody = Matter.Query.point(mEngine.world.bodies, event.mouse.position);

        if (getClickedBody.length !== 0 && props.cardArray.length > 1 && getClickedBody !== undefined) {
          props.setFollowingCard(true);
          let matterCardId = getClickedBody[0].id
          // console.log(matterCardId)
          // console.log(props.cardArray);

          //Call function to update floating card with card data
          if (matterCardId !== undefined) {
            console.log(matterCardId);
            props.handleShowingLargeCardFront(matterCardId)
          }
          // //Add listener to make floating card follow mouse
          document.querySelector('#scene').addEventListener('touchmove', onMouseMove)
          // document.getElementById('floating-card').addEventListener(handleClick)

          //Add mouse event to make card enlarge
          document.querySelector('#scene').addEventListener('touchend', onRelease)
        }
      });
    }
    // console.log(props.currentDeck);
    // console.log(props.cardArray)
  }, [mEngine, mMouseConstraint, props.cardArray, props.currentDeck, props.showFollowingCard, props.showLargeCard]);

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

  const handleClick = () => {
    console.log("clicked on div")
  }
  return (
    <div id="scene" className="flex justify-center relative ">
      {props.showFollowingCard === true ? <div id="floating-card" onClick={handleClick} className="z-50 absolute w-3/12 bottom-1/5 overflow-hidden h-32 top-0 left-0 rounded-sm opacity-90"  style={floatingCardStyle}>
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
  getCards: PropTypes.func,
  generateDeck: PropTypes.func
};

export default Scene;