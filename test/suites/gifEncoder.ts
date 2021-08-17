import GIFEncoder from "gifencoder";
import { createCanvas, createImageData } from "canvas";
import { GifBenchmark } from "src/types";

export const gifEncoder: GifBenchmark = async (buffers, width, height) => {
  const encoder = new GIFEncoder(width, height);
  const canvas = createCanvas(width, height);
  encoder.start();
  encoder.setRepeat(0);

  for (let frame of buffers) {
    const data = createImageData(new Uint8ClampedArray(frame), width, height);
    const ctx = canvas.getContext("2d");
    ctx.putImageData(data, 0, 0);
    encoder.addFrame(ctx);
  }

  encoder.finish();
  return encoder.out.getData();
};
