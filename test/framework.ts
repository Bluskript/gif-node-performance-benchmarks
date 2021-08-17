import { GifUtil, GifCodec } from "gifwrap";
import { SuiteData } from "./types";
import Benchmark from "benchmark";
import Jimp from "jimp";
import chalk from "chalk";
import fs from "fs/promises";

export async function readGifIntoFrames(path: string): Promise<{
  frames: Buffer[];
  width: number;
  height: number;
}> {
  const { frames } = await GifUtil.read(path);
  return {
    frames: await Promise.all(
      frames.map(async (f) => {
        const jimpFrame = (await GifUtil.shareAsJimp(Jimp, f)) as Jimp;
        return jimpFrame.getBufferAsync("image/png");
      })
    ),
    width: frames[0].bitmap.width,
    height: frames[0].bitmap.height,
  };
}

/**
 * Writes the image outputs for each method and suite name
 */
export async function writeImageOutputs(
  methodName: string,
  suiteName: string,
  buffer: Buffer
) {
  await fs.writeFile(`./out/${methodName}-${suiteName}.gif`, buffer);
}

export async function runSuite(suiteName: string, suiteData: SuiteData) {
  const { frames, width, height } = await readGifIntoFrames(
    `./gifs/${suiteName}.gif`
  );
  const suite = new Benchmark.Suite(suiteName);
  console.log(`\nRunning suite ${chalk.green(suiteName)}`);

  for (const [methodName, method] of Object.entries(suiteData)) {
    suite.add(methodName, async () => {
      try {
        await method(frames, width, height);
      } catch (e) {
        console.log(
          chalk.red(e, `failed to execute ${methodName} on ${suiteName}`)
        );
      }
    });
  }

  suite.on("complete", () => suite.filter("fastest").map("name"));
  suite.on("cycle", (event: any) =>
    console.log(`   ${chalk.green(suiteName)} - ${chalk.blue(event.target)}`)
  );
  return suite.run({ async: false });
}
