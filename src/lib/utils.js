export const generateRandomName = () => {
  let firstArr = ["ruthless", "ninja", "smart", "eager", "envious", "energetic", "joyous", "shiny", "sleepy", "spicy", "demanding", "heroic", "lazy"]
  let secondArr = ["butterscotch", "sardine", "iguana", "walrus", "rhinoceros", "kitten", "albatross", "hound", "llama", "mouse", "crocodile", "shark"]
  let randomNumber = Math.floor(Math.random() * (firstArr.length));
  let randomNumber2 = Math.floor(Math.random() * (secondArr.length));
  let name = firstArr[randomNumber] + "_" + secondArr[randomNumber2];
  return name;
}

// *Check device size for responsiveness
export const deviceDetect = () => {
  const userAgent =
    typeof window.navigator === "undefined" ? "" :
      navigator.userAgent;
  if (userAgent !== "") {
    const mobile = Boolean(userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera|Mini|IEMobile|WPDesktop/i
    )
    );
    return mobile
  }
  else {
    return false;
  }
}

export const filterObjsInArr = (arr, selection) => {
  if (selection.length == undefined) {
    return false;
  }
  const filteredArray = [];
  arr.map((obj) => {
    const filteredObj = {};
    for (let key in obj) {
      if (selection.includes(obj.id)) {
        filteredObj[key] = obj[key];
      };
    };
    if (filteredObj.id !== undefined) {
      console.log(filteredObj)
      filteredArray.push(filteredObj);
    }
  })
  return filteredArray;
}