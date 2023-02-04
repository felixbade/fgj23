window.addEventListener('load', () => {
    const canvasContainer = document.getElementById('canvas-container')
    const fsButton = document.getElementById('full-screen-button')
    if (canvasContainer.requestFullscreen) {
        fsButton.addEventListener('click', () => {
            canvasContainer.requestFullscreen()
        })
    } else {
        fsButton.style.display = 'none'
    }

    const scale = window.devicePixelRatio || 1

    // Create the application helper and add its render target to the page
    // resizeTo doesn't work as intended
    const app = new PIXI.Application({
        width: window.innerWidth * scale,
        height: window.innerHeight * scale
    })
    canvasContainer.appendChild(app.view)

    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth * scale, window.innerHeight * scale)
    })

    // Add a container to center our sprite stack on the page
    const container = new PIXI.Container()
    container.x = app.screen.width / 2
    container.y = app.screen.height / 2
    app.stage.addChild(container)

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
        elapsed += delta / 60
        const amount = Math.sin(elapsed)
        const scale = 1.0 + 0.25 * amount
        const alpha = 0.75 + 0.25 * amount
        const angle = 40 * amount
        const x = 75 * amount
        for (let i = 0; i < sprites.length; i++) {
            const sprite = sprites[i]
            sprite.scale.set(scale)
            sprite.alpha = alpha
            sprite.angle = angle
            sprite.x = x
        }
    })

})
