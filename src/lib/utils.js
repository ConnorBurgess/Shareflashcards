export const generateRandomName = () => {
  let firstArr = ["ruthless", "smart", "eager", "envious", "energetic", "joyous", "shiny", "sleepy"]
  let secondArr = ["butterscotch", "sardine", "iguana", "walrus", "rhinoceros", "kitten", "albatross"]
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