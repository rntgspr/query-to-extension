/*** @type {(context:import("esbuild").BuildContext) => void} */
export default async function (context) {
  if (process?.argv?.[2] === "--watch") {
    await context.watch();
  } else {
    await context.rebuild();
    await context.dispose();
  }
}
