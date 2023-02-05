import { mapv } from './utils.js'

const keysDown = new Set()

window.addEventListener('keydown', event => {
    keysDown.add(event.code)
})

window.addEventListener('keyup', event => {
    keysDown.delete(event.code)
})

class Controller {
    get move() {
        let x = 0
        let y = 0
        if (keysDown.has('KeyA')) {
            x -= 1
        }
        if (keysDown.has('KeyD')) {
            x += 1
        }
        if (keysDown.has('KeyW')) {
            y -= 1
        }
        if (keysDown.has('KeyS')) {
            y += 1
        }
        
        if (navigator.getGamepads) {
            const gamepads = navigator.getGamepads()
            if (gamepads.length >= 1 && gamepads[0]) {
                const gamepad = gamepads[0]
                if (gamepad.axes.length >= 2) {
                    // Remove neutral zone drift
                    const minR = 0.15
                    let gx = gamepad.axes[0]
                    let gy = gamepad.axes[1]
                    const gr = Math.sqrt(gx*gx + gy*gy)
                    if (gr < minR) {
                        gx = 0
                        gy = 0
                    } else {
                        const gr2 = mapv(gr, minR, 1, 0, 1)
                        gx *= gr2 / gr
                        gy *= gr2 / gr
                    }
                    x += gx
                    y += gy
                }
            }
        }

        const r = Math.sqrt(x*x + y*y)
        if (r > 1) {
            x /= r
            y /= r
        }
        return { x, y }
    }

    get trigger() {
        if (keysDown.has('Space')) {
            return true
        }
        
        if (navigator.getGamepads) {
            const gamepads = navigator.getGamepads()
            if (gamepads.length >= 1 && gamepads[0]) {
                const gamepad = gamepads[0]
                if (gamepad.buttons.length >= 1) {
                    if (gamepad.buttons[0].pressed) {
                        return true
                    }
                }
            }
        }

        return false
    }
}

export const controller = new Controller()
