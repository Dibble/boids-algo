const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const boundingRect = canvas.getBoundingClientRect()
console.log(boundingRect)

// draw canvas edge
ctx.beginPath()
ctx.lineWidth = 5
ctx.rect(0, 0, boundingRect.width, boundingRect.height)
ctx.stroke()

const drawPoint = (x, y, radius) => {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2, true)
  ctx.fill()
}

const boids = []
for (let  i = 0; i < 5; i++) {
  boids.push({
    x: Math.floor(Math.random() * boundingRect.width),
    y: Math.floor(Math.random() * boundingRect.height)
  })
}

boids.forEach(b => drawPoint(b.x, b.y, 5))
console.log(boids)