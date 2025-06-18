#!/usr/bin/env node

/**
 * Performance Monitoring Script for DankDealsMN
 * Monitors key performance metrics and provides optimization recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 DankDealsMN Performance Monitor');
console.log('====================================\n');

// Check if .next directory exists (build artifacts)
const buildExists = fs.existsSync('.next');
if (!buildExists) {
  console.log('❌ No build found. Run `pnpm run build` first.');
  process.exit(1);
}

// 1. Check bundle sizes
console.log('📦 Bundle Size Analysis');
console.log('-----------------------');

try {
  const buildInfo = fs.readFileSync('.next/build-manifest.json', 'utf8');
  const manifest = JSON.parse(buildInfo);
  
  // Analyze JavaScript bundles
  const jsFiles = Object.values(manifest.pages).flat().filter(file => file.endsWith('.js'));
  let totalJSSize = 0;
  
  jsFiles.forEach(file => {
    try {
      const filePath = path.join('.next', file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        totalJSSize += stats.size;
      }
    } catch (err) {
      // File might not exist, skip
    }
  });
  
  const totalJSMB = (totalJSSize / (1024 * 1024)).toFixed(2);
  console.log(`JavaScript bundle size: ${totalJSMB} MB`);
  
  if (totalJSSize < 1024 * 1024) { // < 1MB
    console.log('✅ JavaScript bundle size is optimized');
  } else if (totalJSSize < 2 * 1024 * 1024) { // < 2MB
    console.log('⚠️  JavaScript bundle size is acceptable but could be improved');
  } else {
    console.log('❌ JavaScript bundle size is too large - consider code splitting');
  }
  
} catch (err) {
  console.log('⚠️  Could not analyze bundle sizes');
}

// 2. Check image optimization
console.log('\n🖼️  Image Optimization Check');
console.log('-----------------------------');

const publicDir = 'public';
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
let optimizedImages = 0;
let unoptimizedImages = 0;

if (fs.existsSync(publicDir)) {
  const files = fs.readdirSync(publicDir);
  
  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (imageExtensions.includes(ext)) {
      if (file.includes('optimized') || ext === '.webp' || ext === '.avif') {
        optimizedImages++;
      } else {
        unoptimizedImages++;
      }
    }
  });
  
  console.log(`✅ Optimized images: ${optimizedImages}`);
  console.log(`❌ Unoptimized images: ${unoptimizedImages}`);
  
  if (unoptimizedImages === 0) {
    console.log('🎉 All images are optimized!');
  } else {
    console.log('💡 Run `pnpm run optimize-images` to optimize remaining images');
  }
} else {
  console.log('⚠️  Public directory not found');
}

// 3. Check CSS optimization
console.log('\n🎨 CSS Optimization Check');
console.log('--------------------------');

const cssFiles = [];
const walkDir = (dir) => {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.')) {
      walkDir(filePath);
    } else if (file.endsWith('.css')) {
      cssFiles.push(filePath);
    }
  });
};

walkDir('.next/static/css');

let totalCSSSize = 0;
cssFiles.forEach(file => {
  try {
    const stats = fs.statSync(file);
    totalCSSSize += stats.size;
  } catch (err) {
    // File might not exist
  }
});

const totalCSSKB = (totalCSSSize / 1024).toFixed(2);
console.log(`CSS bundle size: ${totalCSSKB} KB`);

if (totalCSSSize < 50 * 1024) { // < 50KB
  console.log('✅ CSS bundle size is excellent');
} else if (totalCSSSize < 100 * 1024) { // < 100KB
  console.log('✅ CSS bundle size is good');
} else {
  console.log('⚠️  CSS bundle size could be optimized');
}

// 4. Performance recommendations
console.log('\n💡 Performance Recommendations');
console.log('--------------------------------');

const recommendations = [];

// Check for large images
if (unoptimizedImages > 0) {
  recommendations.push('🖼️  Optimize remaining images with `pnpm run optimize-images`');
}

// Check for large bundles
if (totalJSSize > 2 * 1024 * 1024) {
  recommendations.push('📦 Consider implementing more code splitting');
}

// Check for unused dependencies
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const depCount = Object.keys(packageJson.dependencies || {}).length;
  if (depCount > 50) {
    recommendations.push(`📋 Review ${depCount} dependencies for unused packages`);
  }
} catch (err) {
  // Ignore
}

if (recommendations.length === 0) {
  console.log('🎉 No performance issues detected! Your app is well-optimized.');
} else {
  recommendations.forEach(rec => console.log(rec));
}

// 5. Next steps
console.log('\n🔧 Available Performance Scripts');
console.log('--------------------------------');
console.log('pnpm run build:analyze     - Analyze bundle composition');
console.log('pnpm run performance-test  - Run Lighthouse performance test');
console.log('pnpm run optimize-images   - Optimize images for web');
console.log('pnpm run bundle-analyzer   - Visual bundle analysis');

console.log('\n✅ Performance monitoring complete!');
console.log('Run this script regularly to maintain optimal performance.\n');