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
    i,
    x: Math.random() * boundingRect.width,
    y: Math.random() * boundingRect.height,
    dx: 0,
    dy: 0
  })
}

boids.forEach(b => drawPoint(b.x, b.y, 5))
console.log(boids)

const moveTowardsCentreOfMass = boid => {
  const otherBoids = boids.filter(b => b.i !== boid.i)
  let avgPosition = otherBoids.reduce((prev, current) => {
    return { x: prev.x + current.x, y: prev.y + current.y }
  }, { x: 0, y: 0 })
  avgPosition = { x: avgPosition.x / otherBoids.length, y: avgPosition.y / otherBoids.length }
  
  return { x: (avgPosition.x - boid.x) / 100, y: (avgPosition.y - boid.y) / 100 }
}

const avoidNearbyBoids = boid => {
  const otherBoids = boids.filter(b => b.i !== boid.i)
  return otherBoids.reduce((prev, current) => {
    const distanceFromBoid = Math.sqrt(Math.pow(Math.abs(current.x - boid.x), 2) + Math.pow(Math.abs(current.y - boid.y), 2))
    if (distanceFromBoid > 100) {
      return prev
    }
    
    return { x: prev.x + (boid.x - current.x), y: prev.y + (boid.y - current.y) }
  }, { x: 0, y: 0 })
}

const matchVelocityToOtherBoids = boid => {
  const otherBoids = boids.filter(b => b.i !== boid.i)
  let avgVelocity = otherBoids.reduce((prev, current) => ({ dx: prev.dx + current.dx, dy: prev.dy + current.dy }), { dx: 0, dy: 0 })
  avgVelocity = { dx: avgVelocity.dx / otherBoids.length, dy: avgVelocity.dy / otherBoids.length }

  return { x: (avgVelocity.dx - boid.dx) / 8, y: (avgVelocity.dy - boid.dy) / 8 }
}

const moveTowardsCentre = boid => {
  const rectCentre = { x: boundingRect.width / 2, y: boundingRect.height / 2 }
  return { x: (rectCentre.x - boid.x) / 10, y: (rectCentre.y - boid.y) / 10 }
}

let interval = setInterval(() => {
  ctx.clearRect(2, 2, boundingRect.width - 4, boundingRect.height - 4)
  boids.forEach(b => {
    let { dx, dy } = b
    const rule1 = moveTowardsCentreOfMass(b)
    const rule2 = avoidNearbyBoids(b)
    const rule3 = matchVelocityToOtherBoids(b)
    const rule4 = moveTowardsCentre(b)

    dx += rule1.x + rule2.x + rule3.x + rule4.x
    dy += rule1.y + rule2.y + rule3.y + rule4.y

    const currentSpeed = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    const maxSpeed = 50
    if (currentSpeed > maxSpeed) {
      dx = (dx / currentSpeed) * maxSpeed
      dy = (dy / currentSpeed) * maxSpeed
    }

    b.dx = dx
    b.dy = dy
    b.x += dx
    b.y += dy
    drawPoint(b.x, b.y, 5)
  })
}, 50)

document.getElementById('stop').onclick = () => { clearInterval(interval); interval = null }