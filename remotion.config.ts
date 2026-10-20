import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind";

Config.setEntryPoint("./src/index.ts");
Config.overrideWebpackConfig(enableTailwind);
