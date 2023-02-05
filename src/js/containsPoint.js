export const collider = function (sprite, point) {
  const tempPoint = {x: 0, y: 0 }
  //get mouse poisition relative to the bunny anchor point
  sprite.worldTransform.applyInverse(point, tempPoint);
  // console.error('temppoint:' + tempPoint);

  const width = sprite._texture.orig.width;
  const height = sprite._texture.orig.height;
  const x1 = -width * sprite.anchor.x;
  let y1 = 0;

  let flag = false;
  //collision detection for sprite (as a square, not pixel perfect)
  if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
      y1 = -height * sprite.anchor.y;

      if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
          flag = true;
      }
  }
  //if collision not detected return false
  if (!flag) {
      return false
  }

  //if not continues from here

  // bitmap check
  const tex = sprite.texture;
  const baseTex = sprite.texture.baseTexture;
  const res = baseTex.resolution;

  if (!baseTex.hitmap) {
      //generate hitmap
      if (!genHitmap(baseTex, 255)) {
           return true;
       }

  }

  const hitmap = baseTex.hitmap;

  // console.log(hitmap)
  // this does not account for rotation yet!!!

  //check mouse position if its over the sprite and visible
  let dx = Math.round((tempPoint.x - x1 + tex.frame.x) * res);
  let dy = Math.round((tempPoint.y - y1 + tex.frame.y) * res);
  // console.log(dx);
  // console.log(dy);
  let ind = (dx + dy * baseTex.realWidth);
  let ind1 = ind % 32;
  let ind2 = ind / 32 | 0;
  return (hitmap[ind2] & (1 << ind1)) !== 0;
}

function genHitmap(baseTex, threshold) {
  //check sprite props
  if (!baseTex.resource) {
      //renderTexture
      return false;
  }
  const imgSource = baseTex.resource.source;
  let canvas = null;
  if (!imgSource) {
      return false;
  }
  let context = null;
  if (imgSource.getContext) {
      canvas = imgSource;
      context = canvas.getContext('2d');
  } else if (imgSource instanceof Image) {
      canvas = document.createElement('canvas');
      canvas.width = imgSource.width;
      canvas.height = imgSource.height;
      context = canvas.getContext('2d');
      context.drawImage(imgSource, 0, 0);
  } else {
      //unknown source;
      return false;
  }

  const w = canvas.width, h = canvas.height;
  let imageData = context.getImageData(0, 0, w, h);
  //create array
  let hitmap = baseTex.hitmap = new Uint32Array(Math.ceil(w * h / 32));
  //fill array
  for (let i = 0; i < w * h; i++) {
      //lower resolution to make it faster
      let ind1 = i % 32;
      let ind2 = i / 32 | 0;
      //check every 4th value of image data (alpha number; opacity of the pixel)
      //if it's visible add to the array
      if (imageData.data[i * 4 + 3] >= threshold) {
          hitmap[ind2] = hitmap[ind2] | (1 << ind1);
          // console.log(`hitmap[${ind2}]:`, hitmap[ind2]);
      }
  }
  return true;
}
