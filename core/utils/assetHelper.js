// utils/assetHelper.js
import fs from 'fs';
import path from 'path';

export function getJsAsset(filename) {
  const isProduction = process.env.APP_MODE !== 'dev';
  const baseName = path.basename(filename, '.js');
  
  if (isProduction) {
    const minPath = path.join(process.cwd(), 'dist/js', `${baseName}.min.js`);
    
    if (fs.existsSync(minPath)) {
      return `/js/${baseName}.min.js`;
    }
  }
  return `/js/${filename}`;
}