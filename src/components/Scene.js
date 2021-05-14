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

//Matter.js scene
function Scene(props) {

  const boxRef = useRef(null)
  const canvasRef = useRef(null)
  //Handle key events
  const handleKeyPress = async (event) => {
    if (event.key === 'z') {
      await props.getCards();
      await props.generateDeck();
      console.log(props.currentDeck);
      console.log(props.shownDeck);
      //Freezes all items in world
      if (event.key === 'f') {
        this.state.worldBodies.forEach((item) => {
          item.isSleeping = true;
        })
      }
      if (event.key === 'g') {
        // this.state.worldBodies.forEach((item) => {
        //   item.isSleeping = false;
        // })
      }
    }
  }

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
    document.addEventListener("keydown", handleKeyPress, false);
    const follower = document.querySelector('#floating-card')
    const scene = document.querySelector('#scene')

    //gsap animation for div that follows mouse
    function onMouseMove(event) {

      console.log(this);
      console.log(follower)
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

    var ball = Bodies.rectangle(110, 50, 30, {
      restitution: 0.5, render: {
        sprite: {
          texture: './img/ball.png'
        }
      }
    });


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
      if (getClickedBody.length > 0) {
        console.log(getClickedBody);
        console.log(getClickedBody[0].id)
        scene.addEventListener('mousemove', onMouseMove)
        Matter.Events.on(mouseConstraint, "mouseup", (event) => {
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
          id: props.currentDeck[props.currentDeck.length-1].id
        })]);
        //Add generated card to shownDeck array and pop off of currentDeck
        console.log(props.currentDeck[props.currentDeck.length-1])
        props.handleShownDeck(props.currentDeck[props.currentDeck.length-1])
        console.log(...props.currentDeck)
        props.currentDeck.pop();
        console.log(props.shownDeck);
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

  return (
    <div id="scene" className="container flex justify-start  ">
      <div id="floating-card" style={floatingCardStyle}>
        <h1 className="text-center text-">Test flashcard</h1>
        <h1 className="text-center">by Ruthless Butterscotch</h1>
        <br />
        <div className="ml-4 mr-4 text-sm">
          <p> Why didn't the chicken cross the road?</p>
          <p>{props.showCard ? "hello" : null}</p>
        </div>

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