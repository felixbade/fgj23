import { app, container } from './render.js'
import { controller } from './controller.js'

let x = 0
let y = 0

window.addEventListener('load', () => {

    // Create the 3 sprites, each a child of the last
    const sprites = []
    let parent = container
    for (let i = 0; i < 3; i++) {
        let sprite = PIXI.Sprite.from('assets/images/sample.png')
        sprite.anchor.set(0.5)
        parent.addChild(sprite)
        sprites.push(sprite)
        parent = sprite
    }

    // Set all sprite's properties to the same value, animated over time
    let elapsed = 0.0
    app.ticker.add((delta) => {
        x += controller.move.x * delta * 10
        y += controller.move.y * delta * 10
        // console.log(controller.trigger)

        elapsed += delta / 60
        const amount = Math.sin(elapsed)
        const scale = 1.0 + 0.25 * amount
        const alpha = 0.75 + 0.25 * amount
        const angle = 40 * amount
        const x2 = 75 * amount
        for (let i = 0; i < sprites.length; i++) {
            const sprite = sprites[i]
            sprite.scale.set(scale)
            sprite.alpha = alpha
            sprite.angle = angle
            sprite.x = x2 + x
            sprite.y = y
        }
    })
})
