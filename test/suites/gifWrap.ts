import { GifBenchmark } from "src/types";
import { GifCodec, GifFrame } from "gifwrap";
import Jimp from "jimp";

export const gifWrap: GifBenchmark = async (buffers) => {
  const codec = new GifCodec();

  const gifFrames = await Promise.all(
    buffers.map(async (b) => {
      return new GifFrame((await Jimp.read(b)).bitmap);
    })
  );

  const { buffer } = await codec.encodeGif(gifFrames, { loops: 0 });
  return buffer;
};
