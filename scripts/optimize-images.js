#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Image optimization configuration
const OPTIMIZATIONS = [
  {
    input: 'public/cannabis-bud.png',
    outputs: [
      { file: 'public/cannabis-bud-optimized.webp', format: 'webp', quality: 80, width: 800 },
      { file: 'public/cannabis-bud-optimized.avif', format: 'avif', quality: 60, width: 800 },
      { file: 'public/cannabis-bud-optimized.jpg', format: 'jpeg', quality: 85, width: 800 }
    ]
  },
  {
    input: 'public/king-bud-default.png',
    outputs: [
      { file: 'public/king-bud-default-optimized.webp', format: 'webp', quality: 80, width: 400 },
      { file: 'public/king-bud-default-optimized.avif', format: 'avif', quality: 60, width: 400 },
      { file: 'public/king-bud-default-optimized.jpg', format: 'jpeg', quality: 85, width: 400 }
    ]
  },
  {
    input: 'public/dark-purple-cannabis-bud.png',
    outputs: [
      { file: 'public/dark-purple-cannabis-bud-optimized.webp', format: 'webp', quality: 80, width: 800 },
      { file: 'public/dark-purple-cannabis-bud-optimized.avif', format: 'avif', quality: 60, width: 800 },
      { file: 'public/dark-purple-cannabis-bud-optimized.jpg', format: 'jpeg', quality: 85, width: 800 }
    ]
  },
  {
    input: 'public/space-gummies.png',
    outputs: [
      { file: 'public/space-gummies-optimized.webp', format: 'webp', quality: 80, width: 600 },
      { file: 'public/space-gummies-optimized.avif', format: 'avif', quality: 60, width: 600 },
      { file: 'public/space-gummies-optimized.jpg', format: 'jpeg', quality: 85, width: 600 }
    ]
  },
  {
    input: 'public/sleek-vape-pen.png',
    outputs: [
      { file: 'public/sleek-vape-pen-optimized.webp', format: 'webp', quality: 80, width: 500 },
      { file: 'public/sleek-vape-pen-optimized.avif', format: 'avif', quality: 60, width: 500 },
      { file: 'public/sleek-vape-pen-optimized.jpg', format: 'jpeg', quality: 85, width: 500 }
    ]
  },
  {
    input: 'public/blue-nerds-gelato.jpg',
    outputs: [
      { file: 'public/blue-nerds-gelato-optimized.webp', format: 'webp', quality: 85, width: 600 },
      { file: 'public/blue-nerds-gelato-optimized.avif', format: 'avif', quality: 70, width: 600 }
    ]
  }
];

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  for (const optimization of OPTIMIZATIONS) {
    const { input, outputs } = optimization;
    
    // Check if input file exists
    if (!fs.existsSync(input)) {
      console.log(`⚠️  Input file not found: ${input}`);
      continue;
    }
    
    // Get original file size
    const originalStats = fs.statSync(input);
    const originalSize = originalStats.size;
    totalOriginalSize += originalSize;
    
    console.log(`\n📸 Processing: ${input}`);
    console.log(`   Original size: ${formatBytes(originalSize)}`);
    
    for (const output of outputs) {
      try {
        let sharpInstance = sharp(input);
        
        // Resize if width is specified
        if (output.width) {
          sharpInstance = sharpInstance.resize(output.width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          });
        }
        
        // Apply format and quality
        switch (output.format) {
          case 'webp':
            sharpInstance = sharpInstance.webp({ 
              quality: output.quality,
              effort: 6,
              smartSubsample: true
            });
            break;
          case 'avif':
            sharpInstance = sharpInstance.avif({ 
              quality: output.quality,
              effort: 9
            });
            break;
          case 'jpeg':
            sharpInstance = sharpInstance.jpeg({ 
              quality: output.quality,
              progressive: true,
              mozjpeg: true
            });
            break;
        }
        
        // Save the optimized image
        await sharpInstance.toFile(output.file);
        
        // Get optimized file size
        const optimizedStats = fs.statSync(output.file);
        const optimizedSize = optimizedStats.size;
        totalOptimizedSize += optimizedSize;
        
        const savings = ((originalSize - optimizedSize) / originalSize * 100);
        
        console.log(`   ✅ ${output.format.toUpperCase()}: ${formatBytes(optimizedSize)} (${savings.toFixed(1)}% smaller)`);
        
      } catch (error) {
        console.error(`   ❌ Failed to optimize ${output.file}:`, error.message);
      }
    }
  }
  
  const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100);
  
  console.log(`\n🎉 Optimization Complete!`);
  console.log(`📊 Total original size: ${formatBytes(totalOriginalSize)}`);
  console.log(`📊 Total optimized size: ${formatBytes(totalOptimizedSize)}`);
  console.log(`💰 Total savings: ${formatBytes(totalOriginalSize - totalOptimizedSize)} (${totalSavings.toFixed(1)}%)`);
  
  console.log(`\n🚀 Next steps:`);
  console.log(`1. Update your components to use the optimized images`);
  console.log(`2. Test the new images in your application`);
  console.log(`3. Remove the original large images once verified`);
  console.log(`4. Deploy and test with Google PageSpeed Insights`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Check if sharp is installed
try {
  require.resolve('sharp');
} catch (e) {
  console.error('❌ Sharp is not installed. Please run: npm install sharp');
  process.exit(1);
}

// Run the optimization
optimizeImages().catch(console.error); 