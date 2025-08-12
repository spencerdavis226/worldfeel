#!/usr/bin/env node

/**
 * Bundle Size Check Script
 *
 * Compares current build sizes against metrics.json baseline
 * Fails if main bundle grows >10% from baseline
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const METRICS_FILE = path.join(PROJECT_ROOT, 'metrics.json');
const DIST_DIR = path.join(PROJECT_ROOT, 'apps/web/dist');

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function getGzipSize(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Simple gzip estimation (rough approximation)
    return Math.round(content.length * 0.33);
  } catch (error) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'kB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function calculateGrowth(current, baseline) {
  if (baseline === 0) return 0;
  return ((current - baseline) / baseline) * 100;
}

function main() {
  console.log('🔍 Checking bundle sizes...\n');

  // Read baseline metrics
  if (!fs.existsSync(METRICS_FILE)) {
    console.error(
      '❌ metrics.json not found. Run build first to establish baseline.'
    );
    process.exit(1);
  }

  const baseline = JSON.parse(fs.readFileSync(METRICS_FILE, 'utf8'));
  const baselineMain = baseline.build_metrics.main_chunk;

  // Find current main bundle
  const distAssets = path.join(DIST_DIR, 'assets');
  if (!fs.existsSync(distAssets)) {
    console.error('❌ dist/assets not found. Run build first.');
    process.exit(1);
  }

  const files = fs.readdirSync(distAssets);
  const mainBundleFile = files.find(
    (file) =>
      file.startsWith('index-') && file.endsWith('.js') && !file.includes('map')
  );

  if (!mainBundleFile) {
    console.error('❌ Main bundle not found in dist/assets');
    process.exit(1);
  }

  const mainBundlePath = path.join(distAssets, mainBundleFile);
  const currentSize = getFileSize(mainBundlePath);
  const currentGzipSize = getGzipSize(mainBundlePath);

  // Parse baseline sizes
  const baselineSize = parseInt(baselineMain.size.replace(' kB', '')) * 1024;
  const baselineGzipSize =
    parseInt(baselineMain.gzip_size.replace(' kB', '')) * 1024;

  // Calculate growth
  const sizeGrowth = calculateGrowth(currentSize, baselineSize);
  const gzipGrowth = calculateGrowth(currentGzipSize, baselineGzipSize);

  // Display comparison
  console.log('📊 Bundle Size Comparison:');
  console.log('┌─────────────────┬─────────────┬─────────────┬─────────────┐');
  console.log('│ Metric          │ Baseline    │ Current     │ Growth      │');
  console.log('├─────────────────┼─────────────┼─────────────┼─────────────┤');
  console.log(
    `│ Raw Size        │ ${formatBytes(baselineSize).padEnd(11)} │ ${formatBytes(currentSize).padEnd(11)} │ ${sizeGrowth >= 0 ? '+' : ''}${sizeGrowth.toFixed(1)}%${sizeGrowth >= 0 ? '      ' : '     '} │`
  );
  console.log(
    `│ Gzip Size       │ ${formatBytes(baselineGzipSize).padEnd(11)} │ ${formatBytes(currentGzipSize).padEnd(11)} │ ${gzipGrowth >= 0 ? '+' : ''}${gzipGrowth.toFixed(1)}%${gzipGrowth >= 0 ? '      ' : '     '} │`
  );
  console.log(
    '└─────────────────┴─────────────┴─────────────┴─────────────┘\n'
  );

  // Check thresholds
  const MAX_GROWTH = 10; // 10% threshold
  const sizeOverLimit = sizeGrowth > MAX_GROWTH;
  const gzipOverLimit = gzipGrowth > MAX_GROWTH;

  if (sizeOverLimit || gzipOverLimit) {
    console.error('❌ Bundle size check FAILED');
    console.error(
      `   Raw size growth: ${sizeGrowth.toFixed(1)}% (max: ${MAX_GROWTH}%)`
    );
    console.error(
      `   Gzip size growth: ${gzipGrowth.toFixed(1)}% (max: ${MAX_GROWTH}%)`
    );
    console.error('\n💡 Suggestions:');
    console.error('   - Review recent changes for large dependencies');
    console.error('   - Consider code splitting or lazy loading');
    console.error('   - Check for unused code or duplicate imports');
    console.error('   - Update metrics.json baseline if growth is intentional');
    process.exit(1);
  }

  console.log('✅ Bundle size check PASSED');
  console.log(`   All sizes within ${MAX_GROWTH}% threshold`);

  if (sizeGrowth < 0 || gzipGrowth < 0) {
    console.log(
      '🎉 Bundle size improved! Consider updating metrics.json baseline.'
    );
  }
}

main();
