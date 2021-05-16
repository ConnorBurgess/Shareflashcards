import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from "react-dom";
import Matter, { Body } from "matter-js";
import image from '../img/card.svg';
import testCard from '../img/testcard2.png';
import background from '../img/background.jpg';
import testbackground from '../img/testb.png'
import ToolTip from './ToolTip';
import { firestore } from '../firebase';
import PropTypes from "prop-types";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import randomColor from "randomcolor";

//Holds style for pop up div when hovering over a Matter.js card
const floatingCardStyle = {
  position: "absolute",
  width: "15vh",
  bottom: "500px",
  overflow: "hidden",
  height: "20vh",
  top: "0",
  left: "0",
  background: "white",
  borderRadius: "3%",
  backfaceVisibility: "hidden",
  pointerEvents: "none",
  opacity: "0.9",
}


//Matter.js scene

function Scene(props) {
  const [mEngine, setEngine] = useState(null);
  const [mMouseConstraint, setMouseConstraint] = useState(null);
  const [userClicks, setUserClicks] = useState(1);
  const [mGravity, setGravity] = useState(true);

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
    //Set world gravity
    engine.world.gravity.y = 0.33;
    // engine.timing.timeScale = 3.4
    //Render composite
    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        showAngleIndicator: false,
        showIds: true,
        width: window.innerWidth,
        height: window.innerHeight,
        texture: testbackground,
        background: "#4496d0",
        wireframes: false,
      },
    })
    console.log(render.options.background);

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
      Bodies.rectangle(900, 490, 200, 20, { isStatic: true, chamfer: { radius: 40 }, render: { fillStyle: '#567d46' }, id: "" }),
      // Bodies.rectangle(1100, 490, 200, 20, { isStatic: true, render: { fillStyle: '#567d46' }, id: "" }),

      // Bodies.rectangle(300, 550, 200, 100, { isStatic: true, showIds: false, render: { fillStyle: '#9b7653', strokeStyle: 'default' }, id: "" }),
      Bodies.rectangle(500, 550, 300, 100, { isStatic: true, chamfer: { radius: 10 }, render: { fillStyle: '#9b7653', strokeStyle: 'red' }, id: "" }),
      Bodies.rectangle(700, 550, 300, 100, { isStatic: true, chamfer: { radius: 10 }, render: { fillStyle: '#9b7653', strokeStyle: 'red' }, id: "" }),
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

    //Add ability to drag to engine.world
    Composite.add(engine.world, mouseConstraint);
    setMouseConstraint(mouseConstraint);

    //Track user clicks
    Matter.Events.on(mouseConstraint, "mousedown", (event) => {
      setUserClicks(prevState => prevState + 1)
    });
    //Implement collision
    Events.on(engine, "collisionStart", function (event) {
      // Composite.removeBody(engine.world, event.source.pairs.list[0].bodyA);
      // if (event.source.pairs.collisionActive[0] != undefined) {
      //   event.source.pairs.collisionActive[0].bodyA.isSleeping = true;
      //   // event.source.pairs.collisionActive[0].bodyB.isSleeping = true;

      // }
      // console.log(event.source.pairs)

      // console.log(event.source.pairs.list[0].bodyA)
    });
    Runner.run(engine);
    Render.run(render);


    //Responsive state
    setContraints(boxRef.current.getBoundingClientRect())
    setScene(render)

    window.addEventListener('resize', handleResize)
  }, [])


  useEffect(() => {
    return () => {
      window.removeEventListener('resize', handleResize)
    }

  }, [])


  //Manages responsiveness on adjusting window
  useEffect(() => {
    if (constraints) {
      let { width, height } = constraints
      console.log(constraints);
      scene.bounds.max.x = width
      scene.bounds.max.y = height
      scene.options.width = width
      scene.options.height = height
      scene.canvas.width = width
      scene.canvas.height = height

      //Reset position of static composite bodies
      const floor = scene.engine.world.bodies.filter(e => e.id.length < 1)
      console.log(scene.engine.world.bodies)
      floor.forEach(element => {
        console.log(element)
        Matter.Body.setPosition(element, {
          x: width / 2,
          y: height - 100,
        })
      }
      )
    }

  }, [scene, constraints])


  //gsap animation for div that follows mouse
  function onMouseMove(event) {
    console.log(props.showFollowingCard)
    console.log(event)
    if (props.showFollowingCard) {
      console.log("TEEEEEEEEEEEEEEEEEEEEEEEEEEEEEST")
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

  //Check if user presses gravity button
  useEffect(() => {
    if (mGravity && mEngine != null) {
      mEngine.world.gravity.y = 0.75;
    }
    else if (mEngine != null) {
      mEngine.world.gravity.y = -0.11;
    }

  }, [mGravity, mEngine])

  useEffect(() => {
    console.log("hello world")
    console.log(props.currentDeck);
    for (let i = 0; i < props.currentDeck.length; i++) {

      //Random card generation at slightly different times for better effect
      let randomTime = Math.floor(Math.random() * (400 - 10 + 1)) + 10 //Random time between 10ms and 400ms
      setTimeout(function () {
        var newBody = Matter.Composite.add(mEngine.world, [Matter.Bodies.rectangle(Math.random() * 1000 + 1, 0, 35, 50, {
          isStatic: false,
          angle: (Math.floor(Math.random() * (6.28 * 100 - 1 * 100) + 1 * 100) / (1 * 100)), //Angle is in radians. Randomizes between 0 and 6.28
          collisionFilter: { group: 1 },
          density: .001,
          render: {
            fillStyle: 'blue',
            strokeStyle: 'red',
            chamfer: { radius: 4 },
            lineWidth: 8,
            sprite: {
              // texture: testCard
            }
          },
          id: props.currentDeck[props.currentDeck.length - 1].id
        })]);
      }, randomTime);

      console.log(mEngine);
      props.currentDeck.pop();
    }
  }, [props.currentDeck])

  useEffect(() => {
    console.log(props.cardArray);
    //Add mouse events 
    if (mMouseConstraint != null && mEngine != null && props.cardArray != undefined) {
      Matter.Events.on(mMouseConstraint, "mousedown" || "touchstart", (event) => {
        let getClickedBody = Matter.Query.point(mEngine.world.bodies, event.mouse.position);

        if (getClickedBody.length != 0 && props.cardArray.length > 1) {
          props.setFollowingCard(true);
          let matterCardId = getClickedBody[0].id
          console.log(matterCardId)
          console.log(props.cardArray);
          //Call function to update floating card with card data
          props.handleShowingLargeCardFront(matterCardId)
          // //Add listener to make floating card follow mouse if there is a matter body
          document.querySelector('#scene').addEventListener('touchmove', onMouseMove)

          //Add mouse event to make card enlarge
          Matter.Events.on(mMouseConstraint, "mouseup", (event) => {
            //Set large card showing
            props.setShowLargeCard(true);
            console.log(props.showLargeCard);
            let tl = gsap.timeline()
            tl.to(document.querySelector('#floating-card'), {
              opacity: 1.0,
              duration: 1.7,
              scale: 3.0,
              x: 140
              // + Math.ceil(Math.random() * 200) * (Math.round(Math.random()) ? 1 : -1)
              ,
              y: 200
              // + Math.ceil(Math.random() * 50) * (Math.round(Math.random()) ? 1 : -1)
              ,
              // ease: "power4.out",
              ease: "elastic.out"
            })
            // tl.delay(3);
            tl.set("#floating-card", { fontSize: '10%' });
            tl.delay(0.3)
            



            //Remove floating card event listener
            document.querySelector('#scene').removeEventListener('mousemove', onMouseMove);
          });
        }
      });
    }
    console.log(props.currentDeck);
    console.log(props.cardArray)
  }, [mEngine, mMouseConstraint, props.cardArray, props.currentDeck, props.showFollowingCard]);
  return (
    <div id="scene" className="flex justify-center relative ">
      {props.showFollowingCard == true ? <div id="floating-card" className="z-50" style={floatingCardStyle}>
        <div>{props.largeCardData}</div>
        <button className="transform hover:scale-105 z-50 mx-36" onClick={() => console.log("Saving card...")}>Save it</button><span className="ml-1">👋</span>
      </div>
        : null}
      <div className="absolute flex space m-5 bg-gray-700 p-3 shadow-md mx-auto rounded-md border-2 ">
        <div className="">
          <button className="text-white ring-green-500 m-2 outline-none select-none text-bold transform hover:scale-105 z-10 " onClick={() => setGravity(prevState => !prevState)}>Reverse Gravity</button>
          <button className="text-white m-2 outline-none select-none text-bold transform hover:scale-105 z-10" onClick={() => props.setGenerateMoreCards(prevState => prevState + 1)}>Card Boost</button>
        </div>
        <div className="flex">
          <button className="text-red-400 m-2 justify-end outline-none select-none animate-pulse text-bold transform hover:scale-105 z-10" onClick={() => props.setCurrentlyGeneratingCards(prevState => !prevState)}>Exploring cards . . .</button>
        </div>
      </div>
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