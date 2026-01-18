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

export function formatToRussianDateTimeCustom(dateString) {
    const date = new Date(dateString);
    
    const options = {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    
    return date.toLocaleString('ru-RU', options);
}
export function formatToRussianDateCustom(dateString) {
    const date = new Date(dateString);
    
    const options = {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };
    
    return date.toLocaleString('ru-RU', options);
}
export function translateApplicationStatus(applicationStatus) {
  let status
  switch (applicationStatus){
    case "canceled":
      status = "Отклонено"
      break
    case "success":
      status = "Создана фотосессия"
      break
    default:
      status = "Новая"
  }
  return status
}