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

    // Create the application helper and add its render target to the page
    // resizeTo doesn't work as intended
    app = new PIXI.Application({
        width: window.innerWidth * scale,
        height: window.innerHeight * scale
    })
    canvasContainer.appendChild(app.view)
    canvasContainer.style.height = `${window.innerHeight}px`
    canvasContainer.style.width = `${window.innerWidth}px`

    // Add a container to center our sprite stack on the page
    container = new PIXI.Container()
    container.x = app.screen.width / 2
    container.y = app.screen.height / 2
    const fxaa = new PIXI.FXAAFilter
    container.filters = [fxaa]
    app.stage.addChild(container)

    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth * scale, window.innerHeight * scale)
        container.x = app.screen.width / 2
        container.y = app.screen.height / 2
        canvasContainer.style.height = `${window.innerHeight}px`
        canvasContainer.style.width = `${window.innerWidth}px`
    })
})
