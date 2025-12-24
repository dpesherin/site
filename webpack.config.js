import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import TerserPlugin from 'terser-webpack-plugin'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getJsFiles(dir) {
  const files = fs.readdirSync(dir);
  const jsFiles = {};
  
  files.forEach(file => {
    if (path.extname(file) === '.js' && !file.includes('.min.js')) {
      const name = path.basename(file, '.js');
      jsFiles[name] = path.join(dir, file);
    }
  });
  
  return jsFiles;
}

const jsDir = path.resolve(__dirname, 'public_js/js');
const entryPoints = getJsFiles(jsDir);

export default {
  mode: 'production',
  entry: entryPoints,
  
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist/js'),
    clean: true,
  },
  
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
        extractComments: false,
      }),
    ],
  },
  
  devtool: 'source-map',
}