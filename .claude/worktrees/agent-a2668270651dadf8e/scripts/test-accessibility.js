#!/usr/bin/env node

/**
 * Automated Accessibility Testing with axe-core
 * Runs a11y tests on key pages and generates report
 * Exit code 1 if critical issues found
 */

const { chromium } = require('playwright');
const { AxePuppeteer } = require('@axe-core/puppeteer');

const PAGES_TO_TEST = [
  { name: 'Homepage', url: '/' },
  { name: 'VIP1 Grid', url: '/vip/vip1' },
  { name: 'ChatHub', url: '/room/women_health_free' },
  { name: 'Kids Chat', url: '/kids-chat/alphabet_sounds_kids_l1' },
  { name: 'Admin Dashboard', url: '/admin' },
];

const CRITICAL_VIOLATIONS = ['critical', 'serious'];

async function testPage(page, pageInfo) {
  console.log(`\n📄 Testing: ${pageInfo.name} (${pageInfo.url})`);
  
  try {
    await page.goto(`http://localhost:5173${pageInfo.url}`, {
      waitUntil: 'networkidle',
      timeout: 10000,
    });

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Run axe-core
    const results = await new AxePuppeteer(page).analyze();

    const criticalIssues = results.violations.filter(v =>
      CRITICAL_VIOLATIONS.includes(v.impact)
    );

    console.log(`✅ Total issues: ${results.violations.length}`);
    console.log(`⚠️  Critical/Serious: ${criticalIssues.length}`);

    if (criticalIssues.length > 0) {
      console.log('\n❌ CRITICAL VIOLATIONS FOUND:');
      criticalIssues.forEach(violation => {
        console.log(`\n  • ${violation.help}`);
        console.log(`    Impact: ${violation.impact}`);
        console.log(`    Elements: ${violation.nodes.length}`);
        violation.nodes.forEach(node => {
          console.log(`      - ${node.html}`);
        });
      });
    }

    return { pageInfo, results, criticalIssues };
  } catch (error) {
    console.error(`❌ Error testing ${pageInfo.name}:`, error.message);
    return { pageInfo, error: error.message };
  }
}

async function main() {
  console.log('🔍 Starting Accessibility Tests with axe-core\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const allResults = [];
  let totalCritical = 0;

  for (const pageInfo of PAGES_TO_TEST) {
    const result = await testPage(page, pageInfo);
    allResults.push(result);
    if (result.criticalIssues) {
      totalCritical += result.criticalIssues.length;
    }
  }

  await browser.close();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 ACCESSIBILITY TEST SUMMARY');
  console.log('='.repeat(60));

  allResults.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.pageInfo.name}: ERROR`);
    } else {
      const critical = result.criticalIssues.length;
      const total = result.results.violations.length;
      const status = critical === 0 ? '✅' : '❌';
      console.log(`${status} ${result.pageInfo.name}: ${critical} critical / ${total} total`);
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(`Total Critical/Serious Issues: ${totalCritical}`);
  console.log('='.repeat(60));

  // Exit with error if critical issues found
  if (totalCritical > 0) {
    console.log('\n❌ BUILD FAILED: Critical accessibility issues detected');
    process.exit(1);
  } else {
    console.log('\n✅ BUILD PASSED: No critical accessibility issues');
    process.exit(0);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
