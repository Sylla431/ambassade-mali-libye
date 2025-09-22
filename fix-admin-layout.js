#!/usr/bin/env node

// Script pour identifier les pages admin qui n'utilisent pas AdminLayout
const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src/app/admin');

function findAdminPages(dir) {
  const pages = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        scanDirectory(itemPath);
      } else if (item === 'page.tsx') {
        pages.push(itemPath);
      }
    }
  }
  
  scanDirectory(dir);
  return pages;
}

function checkAdminLayoutUsage(pagePath) {
  const content = fs.readFileSync(pagePath, 'utf8');
  
  const hasAdminLayout = content.includes('AdminLayout');
  const hasMinHeightScreen = content.includes('min-h-screen bg-gray-50');
  const hasCustomHeader = content.includes('{/* Header */}');
  
  return {
    path: pagePath,
    hasAdminLayout,
    hasMinHeightScreen,
    hasCustomHeader,
    needsFix: hasMinHeightScreen && !hasAdminLayout
  };
}

console.log('🔍 Analyse des pages admin...\n');

const pages = findAdminPages(adminDir);
const results = pages.map(checkAdminLayoutUsage);

console.log('📋 Résultats de l\'analyse :\n');

results.forEach(result => {
  const relativePath = result.path.replace(__dirname + '/', '');
  const status = result.needsFix ? '❌ À corriger' : '✅ OK';
  
  console.log(`${status} ${relativePath}`);
  if (result.needsFix) {
    console.log(`   - Utilise min-h-screen: ${result.hasMinHeightScreen}`);
    console.log(`   - A un header personnalisé: ${result.hasCustomHeader}`);
    console.log(`   - Utilise AdminLayout: ${result.hasAdminLayout}`);
  }
});

const needsFix = results.filter(r => r.needsFix);
console.log(`\n📊 Résumé :`);
console.log(`- Total des pages : ${pages.length}`);
console.log(`- Pages à corriger : ${needsFix.length}`);
console.log(`- Pages OK : ${pages.length - needsFix.length}`);

if (needsFix.length > 0) {
  console.log('\n🔧 Pages nécessitant une correction :');
  needsFix.forEach(page => {
    console.log(`- ${page.path.replace(__dirname + '/', '')}`);
  });
}
