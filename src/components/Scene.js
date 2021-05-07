import React from "react";
import ReactDOM from "react-dom";
import Matter from "matter-js";
import image from '../img/card.svg'
import testCard from '../img/testcard2.png'
class Scene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      worldBodies: null,
      idArray: [5, 7, 9, 10, 4, 99, 50, 20, 40, 44, 66, "I'm a card", 10],
      cardArray: [],
      xParam: 1000,
      generatedCard: null,
      addCardToWorld: null
    }
  }
  //Handle keypress for starting card flow
  handleKeyPress = (event) => {
    if (event.key === 's') {
      this.handleDeckGeneration();
    }
    if (event.key === 'f') {
      this.state.worldBodies.forEach((item) => {
        item.isSleeping = true;
      })
    }
    if (event.key === 'g') {
      this.state.worldBodies.forEach((item) => {
        item.isSleeping = false;
      })
    }
  }
  handleDeckGeneration = () => {

    for (let i = 0; i < this.state.idArray.length; i++) {
      this.state.xParam = Math.random() * 1000 + 1;
      //add to a randomize card handler
      this.state.generatedCard.id = Math.floor(Math.random() * 1000 + 1);
      console.log("generated card = " + this.state.generatedCard);

      //end randomize card handler
      this.state.cardArray.push(this.state.generatedCard);
      // Object.keys(this.state.generatedCard.position.x).forEach((prop)=> console.log(prop));

      console.log(this.state.cardArray);
    }
    this.state.addCardToWorld();
    this.state.cardArray.pop();
    this.state.addCardToWorld();

  }
  componentDidMount() {
    const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Common = Matter.Common,
    Pairs = Matter.Pairs,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    Events = Matter.Events,
    MouseConstraint = Matter.MouseConstraint,
    Composite = Matter.Composite;
    //Add keydown events
    document.addEventListener("keydown", this.handleKeyPress, false);
    
    setTimeout(() => console.log('Hello, World!'), 6000)
    
    var engine = Engine.create({
    });
    
    //Set state so can be edited in handlers
    this.setState({worldBodies : engine.world.bodies, 
      generatedCard : Bodies.rectangle(this.state.xParam, 0, 70, 100, {
        isStatic: false,
        render: {
          fillStyle: 'blue',
          strokeStyle: 'red',
          lineWidth: 8,
          sprite: {
            texture: testCard
          }
        },
        // id: this.state.idArray[i]
      }) 
    });
    //Add new card to world state
    this.setState({addCardToWorld : () => {Composite.add(engine.world, this.state.cardArray[this.state.cardArray.length - 1])},});
  
    var render = Render.create({
      element: this.refs.scene,
      engine: engine,
      options: {
        width: 1200,
        height: 600,
        wireframes: false,
        showIds: true,
        background: image,
        gravity: 0.001
      }
    });
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

    //Add red platform
    Composite.add(engine.world, [
      Bodies.rectangle(800, 550, 200, 30, { isStatic: true, render: { fillStyle: '#f6392b' } }),

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
    console.log(this.state.cardArray);
      console.log(this.state);

    Matter.Events.on(mouseConstraint, "mousedown",  (event) => {
      //Generate card in World
      // if (this.state.cardArray.length > 0) {
      //   setTimeout(() => {
      //     if (this.state.cardArray.length > 0) {
            console.log(this.state.addCardToWorld())
            this.state.cardArray.pop();
      //     }
      //   }, 1000)
      // }

      //   Composite.add(engine.world, this.state.cardArray[this.state.cardArray.length - 1]);
      //   this.state.cardArray.pop();
      // }
    });

    Engine.run(engine);
    Render.run(render);

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
  }
  
  render() {
    return (
      <>
        <div ref="scene" />
      </>
    );
  }
}
export default Scene;
