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

    var engine = Engine.create({
    });

    var render = Render.create({
      element: this.refs.scene,
      engine: engine,
      options: {
        width: 1200,
        height: 1200,
        wireframes: false,
        showIds: true
      }
    });
    let idArray = [5, 7, 9, 10, 4]
    let cardArray = [];
    for (let i = 0; i < idArray.length; i++) {
      let newCard = Bodies.rectangle(110, 100, 20, 80, { restitution: 0.5, isStatic: false, render: { fillStyle: '#f6392b' }, id: idArray[i] })
      cardArray.push(newCard);
    }
    var ballA = Bodies.rectangle(210, 100, 330, { restitution: 0.5 });
    var ballB = Bodies.rectangle(110, 50, 30, { restitution: 0.5 });
    // var rectangleA = Bodies.rectangle(0, 0, 10, 10, { isStatic: true });

    //Add platforms
    World.add(engine.world, [
      //generate card platform
      Bodies.rectangle(600, 600, 600, 500, { isStatic: true }),
      //place card platform
      Bodies.rectangle(800, 200, 300, 30, { isStatic: true, render: { fillStyle: '#f6392b' } }),

    ]);
    // World.add(engine.world, [ballA, ballB]);

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

    Matter.Events.on(mouseConstraint, "mousedown", function (event) {
      //Determine where card is added
      // for(let i = 0; i < 2; i++) {
      World.add(engine.world, ballA);
      // console.log(this.state);
      console.log(cardArray);

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
