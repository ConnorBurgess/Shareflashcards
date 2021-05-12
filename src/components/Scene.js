import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from "react-dom";
import Matter from "matter-js";
import image from '../img/card.svg';
import testCard from '../img/testcard2.png';
import background from '../img/background.jpg';
import ToolTip from './ToolTip';
import { firestore } from '../firebase';
import { gsap } from "gsap";

const floatingCardStyle = {
    position: "absolute",
    width: "100px",
    height: "100px",
    top: "0",
    left: "0",
    background: "#cb4b16",
    borderRadius: "80%",
    backfaceVisibility: "hidden",
    pointerEvents: "none",
    opacity: "0.5",
  }



function Scene(props) {
  const boxRef = useRef(null)
  const canvasRef = useRef(null)
  const [showAddCard, SetShowAddCard] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [generateCards, setGenerateCards] = useState(false);
  const [cardArray, setCardArray] = useState([]);

  //  Handle keypress for starting card flow
  const handleKeyPress = async (event) => {
    if (event.key === 's') {
      await props.getCards();
      await props.generateDeck();
      // this.handleDeckGeneration();
      console.log("s pressed");
      if (event.key === 'f') {
        // this.state.worldBodies.forEach((item) => {
        //   item.isSleeping = true;
        // })
      }
      if (event.key === 'g') {
        // this.state.worldBodies.forEach((item) => {
        //   item.isSleeping = false;
        // })
      }
    }
  }

  const generateCard = () => {
    Matter.Bodies.rectangle(Math.random() * 1000 + 1, 0, 70, 100, {
      isStatic: false,
      render: {
        fillStyle: 'blue',
        strokeStyle: 'red',
        lineWidth: 8,
        sprite: {
          texture: testCard
        }
      },
      id: 5
    });
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
    console.log(this)
    

    function onMouseMove(event) {
      console.log(this);
      const follower = this.querySelector('#floating-card')
      console.log(follower)

      gsap.to(follower, 0.3, {
        x: event.offsetX,
        y: event.offsetY,
        ease: "power4.out"
    })
    }
    //Add listeners to create div on mouse movement
    const scene = document.querySelector('#scene')
    scene.addEventListener('mousemove', onMouseMove)

    gsap.set('#floating-card', {
      xPercent: -50,
      yPercent: -50
  })

    let engine = Engine.create({});
    
    
    //Add new card to world state
    // this.setState({addCardToWorld : () => {Composite.add(engine.world, this.state.cardArray[this.state.cardArray.length - 1])},});
    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        showIds: true,
        background: "rgb(75,85,99)",
        wireframes: false,
      },
    })
    // let render = Render.create({
    //   element: boxRef,
    //   engine: engine,
    //   canvas: canvasRef,
    //   options: {
    // width: 1200,
    // height: 600,
    //     wireframes: false,
    //     // showIds: true,
    //     background: false,
    //   },
    // })
    var ballA = Bodies.circle(210, 100, 30, {
      restitution: 0.5, render: {
        fillStyle: 'blue',
        strokeStyle: 'red',
        lineWidth: 8
      }
    });

    var ballB = Bodies.rectangle(110, 50, 30, {
      restitution: 0.5, render: {
        sprite: {
          texture: './img/ball.png'
        }
      }
    });
    // var rectangleA = Bodies.rectangle(0, 0, 10, 10, { isStatic: true });
    var rectangleB = Bodies.rectangle(400, 0, 800, 50, { isStatic: true });

    //Set world gravity
    engine.world.gravity.y = 0.01;
    console.log(engine.world);

    //Add platform
    Composite.add(engine.world, [
      Bodies.rectangle(800, 550, 200, 30, { isStatic: false, render: { fillStyle: 'white', strokeStyle: 'red' } }),

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
    // console.log(this.state.cardArray);
    //   console.log(this.state);

    Matter.Events.on(mouseConstraint, "mousedown", (event) => {
      //Generate card in World
      // if (this.state.cardArray.length > 0) {
      //   setTimeout(() => {
      //     if (this.state.cardArray.length > 0) {
      console.log("test")
      // console.log(this.state.addCardToWorld())
      // this.state.cardArray.pop();
      //     }
      //   }, 1000)
      // }

      //   Composite.add(engine.world, this.state.cardArray[this.state.cardArray.length - 1]);
      //   this.state.cardArray.pop();
      // }
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
    //Componentdidmount ended here
    Runner.run(engine);
    Render.run(render);
  }, [])

  //Check if current deck has been modified, if it has then create new cards in scene
  useEffect(() => {
    console.log("currentdeck" + props.currentDeck);
  }, [props.currentDeck]);

  return (
    <div id="scene" className="container flex justify-start border-4 border-red-800">
      <div id="floating-card" style={floatingCardStyle}>Test flashcard</div>
      <div
        ref={boxRef}
        style={{
          width: 1200,
          height: 600,
        }}
      >
      </div>
      <div id="canvas" className="border-blue-800">
        <canvas
          ref={canvasRef} />
      </div>
    </div>
  )
}

export default Scene;