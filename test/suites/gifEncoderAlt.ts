import GIFEncoder from "gif-encoder";
import { GifBenchmark } from "src/types";
import concat from "concat-stream";

export const gifEncoderAlt: GifBenchmark = async (buffers, width, height) => {
  return new Promise((resolve, reject) => {
    const encoder = new GIFEncoder(width, height);
    encoder.pipe(concat(resolve));
    encoder.setRepeat(0);
    encoder.writeHeader();
    for (let frame of buffers) {
      encoder.addFrame(frame);
    }
    encoder.finish();
    encoder.on("error", reject);
  });
};
