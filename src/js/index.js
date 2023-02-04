import { app, container } from './render.js'
import { controller } from './controller.js'

let x = 0
let y = 0

window.addEventListener('load', () => {

    const rootSprites = []
    const rootContainer = new PIXI.Container()
    rootContainer.scale.set(0.3)
    rootContainer.y = -400
    container.addChild(rootContainer)

    let parent = rootContainer
    for (let i = 0; i < 20; i++) {
        let sprite = PIXI.Sprite.from('assets/images/white square.png')
        sprite.anchor.set(0.5)
        sprite.scale.set(0.95)
        sprite.y = 64
        parent.addChild(sprite)
        rootSprites.push(sprite)
        parent = sprite
    }

    app.ticker.add((delta) => {
        x += controller.move.x * delta * 0.3
        // y += controller.move.y * delta * 10
        // console.log(controller.trigger)

        for (let i = 0; i < rootSprites.length; i++) {
            const sprite = rootSprites[i]
            sprite.angle = -x
        }
    })
})
