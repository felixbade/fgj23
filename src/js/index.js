import { app, container } from './render.js'
import { controller } from './controller.js'
import { collider } from './containsPoint.js'
import { mapv } from './utils.js'

let x = 0
let y = 0
const controlPieceCount = 30
const stoneCount = 10
const gemCount = 10


let soundStarted = false

const startSound = () => {
    if (soundStarted) return
    soundStarted = true

    const sound = PIXI.sound.Sound.from({
        url: 'assets/sounds/birds.mp3',
        autoPlay: true,
        loop: true
    })
    sound.play()
}

window.addEventListener('keydown', startSound)
window.addEventListener('mousedown', startSound)
window.addEventListener('touchstart', startSound)

window.addEventListener('load', () => {
    let bgSprite = PIXI.Sprite.from('assets/images/background.png')
    bgSprite.anchor.set(0.5, 0)
    bgSprite.scale.set(0.5)
    bgSprite.y = -650
    container.addChild(bgSprite)



    const dirtContainer = new PIXI.Container()
    container.addChild(dirtContainer)
    for (let i = 0; i < 4; i++) {
        let sprite = PIXI.Sprite.from(`assets/images/dirt_${i + 1}.png`)
        sprite.anchor.set(0.5)
        sprite.scale.set(.5)
        do {
            sprite.x = Math.random() * 2000 - 1000
            sprite.y = Math.random() * 800 - 150
        } while (sprite.y < 250 && sprite.x < 300 && sprite.x > -300)
        dirtContainer.addChild(sprite)
    }


    const rootAngles = []
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
        rootAngles.push(Math.random())
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



    let turnipSprite = PIXI.Sprite.from('assets/images/turnip.png')
    turnipSprite.anchor.set(0.5, 0)
    turnipSprite.scale.set(0.25)
    turnipSprite.y = -510
    turnipSprite.x = 5
    container.addChild(turnipSprite)

    const gemSprites = []
    const gemContainer = new PIXI.Container()
    container.addChild(gemContainer)
    let gemGlowSprites = []
    let gemGlowTexture = PIXI.Texture.from('assets/images/gem_glow.png')
    for (let i = 0; i < gemCount; i++) {
        let sprite = PIXI.Sprite.from(`assets/images/gem.png`)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.25)
        do {
            sprite.x = Math.random() * 1500 - 750
            sprite.y = Math.random() * 700 - 250
        } while ((sprite.y < 250 && sprite.x < 300 && sprite.x > -300))
        gemContainer.addChild(sprite)
        gemSprites.push(sprite)
        let glow = PIXI.Sprite.from(`assets/images/gem_glow.png`)
        glow.anchor.set(0.5)
        glow.scale.set(1)
        gemGlowSprites.push([glow, Math.random()])
        sprite.addChild(glow)
    }
    let gemGlowState = 0


    const animationImages = [
        'assets/images/bug_animation/bug_1.png',
        'assets/images/bug_animation/bug_2.png',
        'assets/images/bug_animation/bug_3.png',
    ]
    const textureArray = []
    for (let i = 0; i < animationImages.length; i++)
    {
        const texture = PIXI.Texture.from(animationImages[i]);
        textureArray.push(texture);
    }
    const bugSprite = new PIXI.AnimatedSprite(textureArray);
    bugSprite.anchor.set(0.5, 0.8)
    bugSprite.scale.set(0.25)
    bugSprite.y = -160
    bugSprite.x = 10
    container.addChild(bugSprite)
    let bugState = 0
    // Idk how to make a proper alternating animation
    const bugFrameOrder = [0, 1, 2, 1]


    app.ticker.add((delta) => {
        let collidesWithStone = false
        let collidesWithRoot = false
        let currentCoordinates = rootSprites[rootSprites.length - 1].getGlobalPosition()
        for (let i = 0; i < stoneSprites.length; i++) {
            if (collider(stoneSprites[i], currentCoordinates)) {
                collidesWithStone = true
            }
        }
        for (let i = 0; i < rootSprites.length - 10; i++) {
            if (collider(rootSprites[i], currentCoordinates)) {
                collidesWithRoot = true
            }
        }

        for (let i = 0; i < gemSprites.length; i++) {
            if (collider(gemSprites[i], currentCoordinates)) {
                gemContainer.removeChild(gemSprites[i])
                gemSprites.splice(i, 1)
                if(gemSprites.length === 0){
                    console.log("Victory")
                }
            }
        }

        x += controller.move.x * delta * 8 / controlPieceCount
        x *= 1 - 1/40

        if (!collidesWithStone) {
            if (controller.trigger) {
                y += delta * 0.4
            } else {
                y += delta * 0.03
            }
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
            rootAngles.push(Math.random())
        }

        for (let i = 0; i < rootSprites.length; i++) {
            const sprite = rootSprites[i]
            const edgyness = 1 + (i - rootSprites.length) / controlPieceCount
            if (rootSprites.length - 1 - i < controlPieceCount) {
                sprite.angle = (
                    x * (1 + .09 * edgyness)
                    + (rootAngles[i] - 0.5) * mapv(edgyness, 0, 1, 30, 20)
                )
            }
        }


        const bugAnimationSpeed = 0.1
        const bugMaxRotation = 0.1
        const bugRotationStep = 0.4
        const bugFrameSpeed = 0.5
        bugState += delta * bugAnimationSpeed
        bugSprite.currentFrame = bugFrameOrder[Math.round(bugState * bugFrameSpeed) % bugFrameOrder.length]
        bugSprite.rotation = Math.sin(bugState * bugRotationStep) * bugMaxRotation

        gemGlowState += delta
        for (let i = 0; i < gemGlowSprites.length; i++) {
            gemGlowSprites[i][0].alpha = 0.5 + 0.2 * Math.sin(gemGlowSprites[i][1] * Math.PI*2 + (0.07 + 0.02 * gemGlowSprites[i][1]) * gemGlowState)
        }

        // Center the view horizontally
        const viewX = container.getGlobalPosition().x
        const tipX = rootSprites[rootSprites.length - 1].getGlobalPosition().x
        const canvasScaling = container.parent.scale.x
        const newCenteringX = (viewX - tipX) / canvasScaling
        const t = 0.03
        container.x = (1-t) * container.x + t * newCenteringX
    })
})
