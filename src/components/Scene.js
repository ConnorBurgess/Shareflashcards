import React from "react";
import ReactDOM from "react-dom";
import Matter from "matter-js";
class Scene extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }
  componentDidMount() {
    const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;
    //Generate number between 0 and 1000
    function random(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }
    var engine = Engine.create({
    });

    var render = Render.create({
      element: this.refs.scene,
      engine: engine,
      options: {
        width: 1200,
        height: 1200,
        wireframes: false,
        showIds: true,
        background: '../img/background.jpg',
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
          texture: '../img/ball.png'
        }
      }
    });
    // var rectangleA = Bodies.rectangle(0, 0, 10, 10, { isStatic: true });
    var rectangleB = Bodies.rectangle(400, 0, 800, 50, { isStatic: true });

    //Set world gravity
    engine.world.gravity.y = 0.01;

    //Add platforms
    World.add(engine.world, [
      //generate card platform
      Bodies.rectangle(600, 600, 600, 500, { isStatic: true }),
      //place card platform
      Bodies.rectangle(800, 200, 300, 30, { isStatic: true, render: { fillStyle: '#f6392b' } }),

    ]);
    World.add(engine.world, [ballA, ballB]);

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

    World.add(engine.world, mouseConstraint);
    let idArray = [5, 7, 9, 10, 4, 99, 50, 20, 40, 44, 66, 999, 335, 352, 2414, 111, "I'm a flashcard", 10]
    let cardArray = [];
    let xParam = 1000;

    for (let i = 0; i < idArray.length; i++) {
      xParam = Math.random() * 1000 + 1;
      let newCard = Bodies.rectangle(xParam, 0, 100, 50, {
        isStatic: false,
        render: {
          fillStyle: 'blue',
          strokeStyle: 'red',
          lineWidth: 8,
        },
        id: idArray[i]
      })
      cardArray.push(newCard);
    }
    let cardsLeft = cardArray.length
    Matter.Events.on(mouseConstraint, "mousedown", function (event) {
      //Generate card in World
      console.log(cardsLeft);
      if(cardsLeft > 0) {
      World.add(engine.world, cardArray[cardsLeft - 1]);
      cardArray.pop();
      cardsLeft--;
      console.log(cardsLeft);
      console.log(cardArray);
      }  
      // }
    });

    Engine.run(engine);

    Render.run(render);
  }

  render() {
    return <div ref="scene" />;
  }
}
export default Scene;
