import { app, container } from './render.js'
import { controller } from './controller.js'

let x = 0
let y = 0
const controlPieceCount = 30
const stoneCount = 10

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

    const stoneSprites = []
    const stonesContainer = new PIXI.Container()
    container.addChild(stonesContainer)

    for (let i = 0; i < stoneCount; i++) {
        let sprite = PIXI.Sprite.from(`assets/images/stone_${i % 5 + 1}.png`)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.5)
        sprite.rotation = Math.random() * Math.PI * 2
        do {
            sprite.x = Math.random() * 2000 - 1000
            sprite.y = Math.random() * 800 - 250
        } while (sprite.y < 250 && sprite.x < 300 && sprite.x > -300)
        stonesContainer.addChild(sprite)
        stoneSprites.push(sprite)
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
        let currentCoordinates = rootSprites[rootSprites.length - 1].getGlobalPosition()
        for (let i = 0; i < stoneSprites.length; i++){
            if(stoneSprites[i].containsPoint(currentCoordinates)){
                console.log(`Collision with stone ${i}`)
            }
        }
        for (let i = 0; i < rootSprites.length - 10; i++){
            if(rootSprites[i].containsPoint(currentCoordinates)){
                console.log(`Collision with root ${i}`)
            }
        }

        for (let i = 0; i < rootSprites.length; i++) {
            const sprite = rootSprites[i]
            const edgyness = 1 + (i - rootSprites.length) / controlPieceCount
            if (rootSprites.length - 1 - i < controlPieceCount) {
                sprite.angle = x * (1 + 0.6 * edgyness)
            }
        }
    })

    let turnipSprite = PIXI.Sprite.from('assets/images/turnip.png')
    turnipSprite.anchor.set(0.5, 0)
    turnipSprite.scale.set(0.25)
    turnipSprite.y = -510
    turnipSprite.x = 5
    container.addChild(turnipSprite)
})
