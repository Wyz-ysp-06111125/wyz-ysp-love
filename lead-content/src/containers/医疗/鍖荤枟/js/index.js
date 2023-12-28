let currentImageIndex = 0
const images = [
  "../images/IMG_417612016x1512.jpg",
  "../images/t-1.jpeg",
  "../images/t-2.jpeg",
  "../images/t-3.jpeg",
]
const carouselImage = document.getElementById("carouselImage")

function startImageCarousel () {
  setInterval(changeImage, 1000)
}

function changeImage () {
  currentImageIndex = (currentImageIndex + 1) % images.length
  carouselImage.src = images[currentImageIndex]
}

window.onload = startImageCarousel




function updateClock () {
  var now = new Date()
  var hours = now.getHours()
  var minutes = now.getMinutes()
  var seconds = now.getSeconds()

  hours = hours < 10 ? "0" + hours : hours
  minutes = minutes < 10 ? "0" + minutes : minutes
  seconds = seconds < 10 ? "0" + seconds : seconds

  document.getElementById("clock").innerHTML = '北京时间：' + hours + ":" + minutes + ":" + seconds
}

setInterval(updateClock, 1000)

updateClock()