window.addEventListener('load', () => {
    document.getElementById('full-screen-button').addEventListener('click', () => {
        let canvasContainer = document.getElementById('canvas-container')
        if (canvasContainer.requestFullscreen) {
            canvasContainer.requestFullscreen()
        } else {
            alert('Full screen is not supported')
        }
    })
})