import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    // Make it work on github pages
    // See <https://stackoverflow.com/questions/78750417/how-do-i-force-rspack-rsbuild-to-use-relative-paths>
    assetPrefix: './',
  },
});
