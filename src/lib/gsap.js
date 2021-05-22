import { gsap } from "gsap";

export const animFollowing = (event, isMobile) => {
  var tl = gsap.timeline()
  tl.set("#card-title", { fontSize: '90% ' });
  tl.set("#card-username", { fontSize: '80% ' });
  tl.set("#card-created-by", { fontSize: '40% ' });
  tl.set("#card-front", { autoAlpha: 0 });
  tl.to(document.querySelector('#floating-card'), {
    opacity: 1.0,
    duration: 0.9,
    scale: 1.0,
    x: isMobile ? event.offsetX = event.touches[0].pageX - event.touches[0].target.offsetLeft + 1 : event.offsetX + 50,
    y: isMobile ? event.offsetY = event.touches[0].pageY - event.touches[0].target.offsetTop - 200 : event.offsetY - 200,
    ease: "power4.out",
  })

  //* Rotate anim might be too annoying
  // setTimeout(() => {
  //   let randNum = Math.floor(Math.random() * 10)
  //     if (randNum === 1) {
  //     tl.to(document.querySelector('#floating-card'), {
  //       duration: 0.3,
        // rotate: 3, 
  //     })
  //   }}, 3500);
  }


export const animEnlarge = (event, isMobile, constraints) => {
  let tl = gsap.timeline()
  tl.delay(1);
  isMobile ? tl.set("#card-username", { fontSize: '50%' }) : tl.set("#card-username", { fontSize: '70% ' });
  tl.set("#card-title", { fontSize: '90% ' });
  tl.set("#card-created-by", { fontSize: '40% ' });
  tl.to(document.querySelector('#floating-card'), {
    opacity: 1.0,
    duration: 1.2,
    scale: 3.0,
    x: isMobile ? 140 : event.offsetX,
    y: isMobile ? 200 : event.offsetY,
    ease: "elastic.out"
  })
  tl.to(document.querySelector('#floating-card'), {
    duration: 0.5,
    ease: "elastic.out",
    x: constraints.right / 2,
    y: constraints.height / 3,
  })
  tl.to("#card-front", { fontSize: '50% ' });
  tl.to("#card-front", { autoAlpha: 1, duration: 0.5, scale: 1.1 });
  tl.to("#card-front", { scale: 1.0, duration: 0.2 });
  tl.delay(0.3)
  setTimeout(() => {
    document.getElementById("card-front").classList.remove("hidden");
  }, 400)

}

export const animSave = (isMobile) => {
  const saveIcon = document.getElementById("save-icon");
  let tl = gsap.timeline()
  tl.from(saveIcon, {
    perspective: 800,
    perspectiveOrigin: '50% 50% 0px',
    duration: 0.3,
    scale: 0.0,
    rotate: 360,
    ease: "elastic.out"
  })
  tl.to(saveIcon, {
    opacity: 1.0,
    duration: 0.3,
    scale: 2.0,
    rotate: 360,
    ease: "elastic.out"
  })
  tl.to(saveIcon, {
    opacity: 1.0,
    duration: 0.4,
    scale: 0,
    rotate: 360,
    ease: "elastic.out"
  })
  tl.to(document.querySelector('#floating-card'), {
    opacity: 1.0,
    transformStyle: "preserve-3d",
    perspective: 200,
    perspectiveOrigin: '50% 50% 0px',
    duration: 0.5,
    scale: 4.0,
    x: 0,
    y: 0,
    ease: "elastic.out"
  })
  tl.to(document.querySelector('#floating-card'), {
    opacity: 1.0,
    duration: 1.0,
    scale: 0,
    x: isMobile ? 300 : 355,
    y: isMobile ? 0 : -15,
    ease: "elastic.out"
  })
  tl.set("#floating-card", { fontSize: '100%' });
  const saveNav = document.getElementById("saved-nav");
  tl.to(saveNav, {
    duration: 0.3,
    color: "#A75248",
    scale: 2.0,
    rotate: 30,
    ease: "power4.out"
  })
  tl.to(saveNav, {
    duration: 0.3,
    scale: 1,
    color: "white",
    rotate: 0,
    ease: "power4.in"
  })
}

export const animDismiss = (isMobile) => {
  let tl = gsap.timeline()
  tl.to(document.querySelector('#floating-card'), {
    opacity: 1.0,
    transformStyle: "preserve-3d",
    perspective: 200,
    perspectiveOrigin: '50% 50% 0px',
    duration: 0.5,
    scale: 1.0,
    x: 140,
    y: 200,
    ease: "elastic.out"
  })
  tl.set("#floating-card", { fontSize: '100%' });
  tl.to(document.querySelector('#floating-card'), {
    opacity: 1.0,
    duration: 1.0,
    scale: 0,
    x: isMobile ? 300 : 355,
    y: isMobile ? 0 : 300,
    ease: "elastic.out"
  })
  let randNum = Math.floor(Math.random() * 2);
  if (randNum === 1) {
    tl.to(document.querySelector('#floating-card'), {
      opacity: 1.0,
      duration: 1.0,
      scale: 0,
      rotate: 360,
      x: isMobile ? 300 : 355,
      y: isMobile ? 0 : -400,
      ease: "elastic.out"
    })
  } else {
    tl.to(document.querySelector('#floating-card'), {
      opacity: 1.0,
      duration: 1.0,
      scale: 0,
      x: isMobile ? 300 : 355,
      y: isMobile ? 0 : -400,
      ease: "elastic.out"
    })
  }
}

export const animExtendCommandBar = () => {
  const commandBarButtons = document.getElementById("buttons-popup");
  let tl = gsap.timeline();
  tl.from(commandBarButtons, { autoAlpha: 0, xPercent: -75, yPercent: 100 });
  tl.to(commandBarButtons, { autoAlpha: 50, xPercent: 0, duration: 0.3, ease: "Power4.in" });
  tl.to(commandBarButtons, { autoAlpha: 100, yPercent: -100, duration: 0.6, ease: "Power4.out" });
  tl.to(commandBarButtons, { yPercent: 0, duration: 0.6, ease: "bounce" });
}

export const animHideCommandBar = () => {
  const commandBarButtons = document.getElementById("buttons-popup");
  let tl = gsap.timeline();
  tl.from(commandBarButtons, { xPercent: 0 });
  tl.to(commandBarButtons, { yPercent: 100, duration: 0.6, ease: "Power4.in" });
  tl.to(commandBarButtons, { autoAlpha: 0, xPercent: -100, duration: 1.3, ease: "power4.out" });
}

export const animPopup = () => {
  const infoPopup = document.getElementById("info-popup");
  console.log(infoPopup)
  let tl = gsap.timeline()
  tl.delay(1);
  tl.yoyo(true);
  tl.from(infoPopup, { autoAlpha: 0, xPercent: -100, rotation: 180 })
  tl.to(infoPopup, { autoAlpha: 1, xPercent: 0, duration: 1.3, ease: "Power1.out" })
  tl.repeatDelay(2.5);
  tl.repeat(1);
}