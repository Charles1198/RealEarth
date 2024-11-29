function drawStar(ctx, x, y, r, c = '#fff') {
  ctx.fillStyle = c
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI, true)
  ctx.closePath()
  ctx.fill()
}

export class StarrySky {
  constructor(canvasId, starCount = 30) {
    this.canvas = document.getElementById(canvasId)
    this.ctx = this.canvas.getContext('2d')

    this.starCount = starCount
    this.w = document.body.clientWidth
    this.h = document.body.clientHeight
    this.canvas.width = this.w
    this.canvas.height = this.h

    this.stars = []
    this._setupStars()
  }

  drawStars() {
    this.stars.forEach((star) => {
      drawStar(this.ctx, star.x, star.y, star.r)
    })
  }

  _setupStars() {
    for (let i = 0; i < this.starCount; i++) {
      const x = Math.round(this.w * Math.random())
      const y = Math.round(this.h * Math.random())
      const r = 0.3 + Math.random() * 1.2
      this.stars.push({ x, y, r })
    }
  }
}

export class Meteor {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.ctx = this.canvas.getContext('2d')

    this.w = document.body.clientWidth
    this.h = document.body.clientHeight
    this.canvas.width = this.w
    this.canvas.height = this.h

    this.timer = null
  }

  drawMeteor() {
    const x = Math.round(this.w * Math.random()) * 2
    const v = Math.round(8 + 8 * Math.random())
    this.drawMeteorAt(x, 0, v)

    this.timer = setTimeout(
      () => {
        this.drawMeteor()
      },
      1000 * 60 * Math.random()
    )
  }

  drawMeteorAt(px, py, v) {
    this.ctx.clearRect(0, 0, this.w, this.h)
    if (px < 0 || py > this.h) {
      return
    }

    let x = px
    let y = py
    let r = 1.8
    let a = 0.8
    for (let i = 0; i < 80; i++) {
      x += 1.1
      y -= 1.2
      r -= 0.01
      a -= 0.0125
      drawStar(this.ctx, x, y, r, `rgba(255,255,255,${a})`)
    }
    requestAnimationFrame(() => this.drawMeteorAt(px - v, py + v, v))
  }
}
