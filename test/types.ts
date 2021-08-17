export interface SuiteData {
  [key: string]: GifBenchmark;
}

export type GifBenchmark = (
  frames: Buffer[],
  width: number,
  height: number
) => Promise<Buffer>;
