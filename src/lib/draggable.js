import { Draggable } from "gsap/Draggable";
import { gsap } from "gsap";

gsap.registerPlugin(Draggable);

export const makeComponentsDraggable = (appBox, draggableToolTip, draggableAddCard, draggableSignUp) => {
Draggable.create(draggableToolTip.current, {
  bounds: appBox.current,
  throwProps: true
});
Draggable.create(draggableAddCard.current, {
  bounds: appBox.current,
  throwProps: true,
  dragClickables: false
});
Draggable.create(draggableSignUp.current, {
  bounds: appBox.current,
  throwProps: true,
  dragClickables: false
}, []);
}