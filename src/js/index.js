import { app, container } from './render.js'
import { controller } from './controller.js'

let x = 0
let y = 0
const controlPieceCount = 30

window.addEventListener('load', () => {
    let bgSprite = PIXI.Sprite.from('assets/images/background.png')
    bgSprite.anchor.set(0.5, 0)
    bgSprite.scale.set(0.5)
    bgSprite.y = -650
    container.addChild(bgSprite)
    
    const rootSprites = []
    const rootContainer = new PIXI.Container()
    rootContainer.scale.set(0.08)
    rootContainer.y = -70
    container.addChild(rootContainer)

    let parent = rootContainer
    for (let i = 0; i < controlPieceCount; i++) {
        let sprite = PIXI.Sprite.from('assets/images/white square.png')
        sprite.anchor.set(0.5)
        sprite.scale.set(1 - 1/controlPieceCount)
        sprite.y = 64
        parent.addChild(sprite)
        rootSprites.push(sprite)
        parent = sprite
    }

    app.ticker.add((delta) => {
        x += controller.move.x * delta * 8 / controlPieceCount
        // y += controller.move.y * delta * 10

        if (controller.trigger) {
            y += delta * 0.4
        }

        const scaling = Math.min(1, 1 - (1-y) / controlPieceCount)
        rootSprites[rootSprites.length - controlPieceCount].scale.set(scaling)

        if (y >= 1) {
            y -= 1
            let sprite = PIXI.Sprite.from('assets/images/white square.png')
            sprite.anchor.set(0.5)
            sprite.scale.set(1 - 1/controlPieceCount)
            sprite.y = 64
            rootSprites[rootSprites.length - 1].addChild(sprite)
            rootSprites.push(sprite)
        }

        for (let i = 0; i < rootSprites.length; i++) {
            const sprite = rootSprites[i]
            const edgyness = 1 + (i - rootSprites.length) / controlPieceCount
            if (rootSprites.length - 1 - i < controlPieceCount) {
                sprite.angle = x * (1 + 0.6 * edgyness)
            }
        }
        console.log(sprites[2].containsPoint({x: 600, y: 400}))
    })

    let turnipSprite = PIXI.Sprite.from('assets/images/turnip.png')
    turnipSprite.anchor.set(0.5, 0)
    turnipSprite.scale.set(0.25)
    turnipSprite.y = -510
    turnipSprite.x = 5
    container.addChild(turnipSprite)
})
