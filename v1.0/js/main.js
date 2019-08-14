// alert("Hello world!");

document.querySelector("body").addEventListener("keydown", moveHero);

function moveHero(event) {
  const hero = document.body.querySelector("#hero");
  let currentLeft = parseInt(hero.style.left);

  if (isNaN(currentLeft)) {
    currentLeft = 0;
  }

  switch (event.code) {
    case "ArrowLeft":
      hero.style.left = (currentLeft >= 5) ? `${currentLeft - 5}px` : "0px";
      break;
    case "ArrowRight":
      hero.style.left = (currentLeft <= 1163) ? `${currentLeft + 5}px` : "1168px";
      break;
    case "ArrowUp":
      jump(hero);
      break;
  }
}

function jump(hero) {
  let currentBottom = parseInt(hero.style.bottom);

  if (isNaN(currentBottom)) {
    currentBottom = 0;
  }

  hero.style.bottom = `${currentBottom + 50}px`
  setTimeout(() => {hero.style.bottom = `${currentBottom}px`}, 150);

}
