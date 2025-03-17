declare module "node-piper" {
  export class Piper {
    constructor(modelPath: string, configPath: string);
    synthesize(text: string): Promise<Buffer>;
  }
}
