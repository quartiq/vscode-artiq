import { context } from "esbuild";
import { glob } from "glob";

const entryPoints = glob.sync("src/webviews/*.ts");
console.log("Watching entry points:", entryPoints);

const ctx = await context({
    entryPoints,
    bundle: true,
    outdir: "out/webviews",
    format: "esm",
    platform: "browser",
    external: ["vscode"],
    sourcemap: true,
    logLevel: "info"
});

await ctx.watch();
console.log("👀 Watching webviews...");