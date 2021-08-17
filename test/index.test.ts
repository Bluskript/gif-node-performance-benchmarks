import { readGifIntoFrames, runSuite, writeImageOutputs } from "./framework";
import { gifWrap } from "./suites/gifWrap";
import chalk from "chalk";
import fs from "fs";
import { gifEncoder } from "./suites/gifEncoder";
import { gifEncoderAlt } from "./suites/gifEncoderAlt";

console.clear();

const suites: string[] = fs
  .readdirSync("./gifs")
  .map((file) => file.split(".")[0]);

const methods = {
  gifWrap,
  gifEncoder,
  gifEncoderAlt,
};

async function writeFiles() {
  for (const suiteName of suites) {
    const { frames, width, height } = await readGifIntoFrames(
      `./gifs/${suiteName}.gif`
    );

    await Promise.all(
      Object.entries(methods).map(async ([methodName, method]) => {
        await writeImageOutputs(
          methodName,
          suiteName,
          await method(frames, width, height)
        );
      })
    );
  }
}

async function main() {
  await fs.promises.rm("./out", { recursive: true });
  await fs.promises.mkdir("./out");

  console.log(
    chalk.cyan(`Benchmarking ${Object.keys(suites).length} suites...`)
  );

  await writeFiles();

  const start = Date.now();
  for (const suiteName of suites) {
    await runSuite(suiteName, methods);
  }
  const end = Date.now();
  console.log(
    chalk.cyan(`Benchmarks complete in ${chalk.red((end - start) / 1000)}s`)
  );
  return;
}

main();
