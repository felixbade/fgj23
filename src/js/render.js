export let app, container

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

    app = new PIXI.Application()
    canvasContainer.appendChild(app.view)

    container = new PIXI.Container()
    const fxaa = new PIXI.FXAAFilter
    container.filters = [fxaa]
    app.stage.addChild(container)

    const resize = () => {
        app.renderer.resize(window.innerWidth * scale, window.innerHeight * scale)
        container.x = app.screen.width / 2
        container.y = app.screen.height / 2
        container.scale.set(window.innerHeight * scale / 1000)
        canvasContainer.style.height = `${window.innerHeight}px`
        canvasContainer.style.width = `${window.innerWidth}px`
    }

    resize()

    window.addEventListener('resize', resize)
})
