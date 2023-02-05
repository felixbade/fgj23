export const collider = function (sprite, point) {

    // Get mouse poisition relative to the bunny anchor point
    const tempPoint = { x: 0, y: 0 }
    sprite.worldTransform.applyInverse(point, tempPoint)

    const width = sprite._texture.orig.width
    const height = sprite._texture.orig.height
    const x1 = -width * sprite.anchor.x

    // Collision detection for sprite (as a rectangle, not pixel perfect)
    let y1 = 0
    let flag = false
    if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
        y1 = -height * sprite.anchor.y

        if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
            flag = true
        }
    }

    // Test point is outside the sprite
    if (!flag) {
        return false
    }

    // Bitmap check
    const tex = sprite.texture
    const baseTex = sprite.texture.baseTexture
    const res = baseTex.resolution

    if (!baseTex.hitmap) {
        if (!generateHitmap(baseTex, 255)) {
            return true
        }
    }

    const hitmap = baseTex.hitmap

    // This does not account for rotation yet!!!

    // Check mouse position if its over the sprite and visible
    let dx = Math.round((tempPoint.x - x1 + tex.frame.x) * res)
    let dy = Math.round((tempPoint.y - y1 + tex.frame.y) * res)
    let ind = (dx + dy * baseTex.realWidth)
    let ind1 = ind % 32
    let ind2 = ind / 32 | 0
    return (hitmap[ind2] & (1 << ind1)) !== 0
}

function generateHitmap(baseTex, threshold) {
    if (!baseTex.resource) {
        return false
    }
    const imgSource = baseTex.resource.source
    if (!imgSource) {
        return false
    }

    let canvas = null
    let context = null
    if (imgSource.getContext) {
        canvas = imgSource
        context = canvas.getContext('2d')
    } else if (imgSource instanceof Image) {
        canvas = document.createElement('canvas')
        canvas.width = imgSource.width
        canvas.height = imgSource.height
        context = canvas.getContext('2d')
        context.drawImage(imgSource, 0, 0)
    } else {
        // Unknown source
        return false
    }

    const w = canvas.width, h = canvas.height
    let imageData = context.getImageData(0, 0, w, h)
    let hitmap = baseTex.hitmap = new Uint32Array(Math.ceil(w * h / 32))

    for (let i = 0; i < w * h; i++) {
        // Lower resolution to make it faster
        let ind1 = i % 32
        let ind2 = i / 32 | 0

        // Alpha channel is every 4th number
        if (imageData.data[i * 4 + 3] >= threshold) {
            hitmap[ind2] = hitmap[ind2] | (1 << ind1)
        }
    }

    return true
}
