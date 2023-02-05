export const mapv = (x, in_min, in_max, out_min, out_max) => {
    // x = in_min .. in_max
    x -= in_min
    // x = 0 .. in_max - in_min
    x /= (in_max - in_min)
    // x = 0 .. 1
    x *= (out_max - out_min)
    // x = 0 .. out_max - out_min
    x += out_min
    // x = out_min .. out_max
    return x
}