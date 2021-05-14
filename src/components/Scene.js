import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from "react-dom";
import Matter from "matter-js";
import image from '../img/card.svg';
import testCard from '../img/testcard2.png';
import background from '../img/background.jpg';
import ToolTip from './ToolTip';
import { firestore } from '../firebase';
import { gsap } from "gsap";
import PropTypes from "prop-types";

//Holds style for pop up div when hovering over a Matter.js card
const floatingCardStyle = {
  position: "absolute",
  width: "30vh",
  height: "20vh",
  top: "0",
  left: "0",
  background: "white",
  borderRadius: "5%",
  backfaceVisibility: "hidden",
  pointerEvents: "none",
  opacity: "0.9",
}
// useEffect(() => {
//   console.log("re-rendered")
//   console.log(props.cardArray);
//   }, [props.cardArray]);
    //Matter.js scene
    
function Scene(props) {
  
  const boxRef = useRef(null)
  const canvasRef = useRef(null)
  //Handle key events
  // useEffect(() => {
    //   console.log("re-rendered")
    //   console.log(props.cardArray);
    // }, [props.cardArray]);
    useEffect(() => {
    
      let Engine = Matter.Engine,
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
    const follower = document.querySelector('#floating-card')
    const scene = document.querySelector('#scene')
    
    //gsap animation for div that follows mouse
    function onMouseMove(event) {

      // console.log(this);
      // console.log(follower)
      var tl = gsap.timeline()
      tl.to(follower, {
        opacity: 1.0,
        duration: 0.9,
        scale: 1.0,
        x: event.offsetX + 50,
        y: event.offsetY - 200,
        ease: "power4.out",
        // ease: "bounce.out"
      })
    }
    //Add listeners to create div on mouse movement
    // scene.addEventListener('mousemove', onMouseMove)

    //   gsap.set('#floating-card', {
    //     xPercent: -50,
    //     yPercent: -50
    // })

    let engine = Engine.create({});
    //Set world gravity
    engine.world.gravity.y = 0.1;

    //Render composite
    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        showAngleIndicator: true,
        width: window.innerWidth,
        height: window.innerHeight,
        showIds: true,
        background: "rgb(75,85,99)",
        wireframes: false,
      },
    })

    //Add platform
    Composite.add(engine.world, [
      Bodies.rectangle(800, 550, 200, 30, { isStatic: true, render: { fillStyle: 'white', strokeStyle: 'red' }, id: 1 }),
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
    Matter.Events.on(mouseConstraint, "mousedown", (event) => {
      let getClickedBody = Matter.Query.point(engine.world.bodies, event.mouse.position);
      if (getClickedBody.length != 0) {
        let matterCardId = getClickedBody[0].id
        //Call function to update floating card with card data
        props.handleShowingLargeCardFront(matterCardId)

        //Add listener to make floating card follow mouse if there is a matter body
        scene.addEventListener('mousemove', onMouseMove)

        //Add mouse event to make card enlarge
        Matter.Events.on(mouseConstraint, "mouseup", (event) => {
          //Set large card showing
          props.setShowCard(true);
          let tl = gsap.timeline()
          tl.to(follower, {
            opacity: 1.0,
            duration: 2.3,
            scale: 3.5,
            x: 500,
            y: 200,
            // ease: "power4.out",
            ease: "bounce.out"
          })
          //Remove floating card event listener
          scene.removeEventListener('mousemove', onMouseMove);
        });
      }
      if (props.currentDeck.length > 0) {
        console.log(props.currentDeck);
        Composite.add(engine.world, [Matter.Bodies.rectangle(Math.random() * 1000 + 1, 0, 70, 100, {
          isStatic: false,
          render: {
            fillStyle: 'blue',
            strokeStyle: 'red',
            lineWidth: 8,
            sprite: {
              texture: testCard
            }
          },
          id: props.currentDeck[props.currentDeck.length - 1].id
        })]);
        //Add generated card to shownDeck array and pop off of currentDeck
        //note: need to update to not mutate array
        // console.log(props.currentDeck[props.currentDeck.length-1])
        // const cardBeingRemoved = props.currentDeck[props.currentDeck.length-1]
        // console.log(...props.currentDeck)
        // console.log(props);
        props.currentDeck.pop();
      }



    });


    //Implement collision
    Events.on(engine, "collisionStart", function (event) {
      // Composite.removeBody(engine.world, event.source.pairs.list[0].bodyA);
      console.log(event);
      if (event.source.pairs.collisionActive[0] != undefined) {
        event.source.pairs.collisionActive[0].bodyA.isSleeping = true;
      }
      console.log(event.source.pairs)

      // console.log(event.source.pairs.list[0].bodyA)
    });
    Runner.run(engine);
    Render.run(render);
  }, [])

  useEffect(() => {
    console.log("re-rendered")
    console.log(props.cardArray);
  }, [props.cardArray]);

  return (
    <div id="scene" className="container flex justify-start  ">
      <div id="floating-card" style={floatingCardStyle}>
        <div>{props.largeCardData}</div>

      </div>
      <div
        ref={boxRef}
        style={{
          width: 1200,
          height: 600,
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