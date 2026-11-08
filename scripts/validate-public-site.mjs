import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html must contain its application script');
new vm.Script(scriptMatch[1], { filename: 'index.html inline script' });

const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
const rewrites = (vercel.rewrites || []).map((item) => item.source);
assert.ok(rewrites.includes('/industries/:path*'), 'industry detail routes must rewrite to the SPA');
assert.ok(rewrites.includes('/blog/:path*'), 'Insight article routes must rewrite to the SPA');

const pageMapMatch = scriptMatch[1].match(/const pageMap=\{([\s\S]*?)\};/);
assert.ok(pageMapMatch, 'route map must exist');
const routes = [...pageMapMatch[1].matchAll(/'([^']+)':/g)].map((match) => match[1]);
const requiredRoutes = [
  '/', '/solutions', '/voice-agents', '/industries', '/use-cases', '/pricing',
  '/voice-for-good', '/about-us', '/contact', '/request-demo', '/live-demo',
  '/careers', '/countries', '/blog', '/testimonials', '/case-studies', '/resources', '/ar',
];
for (const route of requiredRoutes) {
  assert.ok(routes.includes(route), 'missing route: ' + route);
}

const requiredIndustrySlugs = [
  'real-estate', 'healthcare', 'dental-clinics', 'education', 'banking-finance',
  'insurance', 'travel-hospitality', 'restaurants', 'retail-ecommerce',
  'recruitment-hr', 'bpo-customer-support',
];
for (const slug of requiredIndustrySlugs) {
  assert.ok(scriptMatch[1].includes("'" + slug + "'"), 'missing industry slug: ' + slug);
}

const requiredArticles = ['ai-voice-agent-readiness', 'human-handoff', 'industry-campaigns'];
for (const slug of requiredArticles) {
  assert.ok(scriptMatch[1].includes("'" + slug + "'"), 'missing Insight article: ' + slug);
}

assert.ok(existsSync('assets/proautodial-homepage-hero-panel.jpg'), 'approved Home hero artwork missing');
assert.ok(existsSync('assets/proautodial-usecases-hero-panel.jpg'), 'approved Use Cases artwork missing');
assert.ok(scriptMatch[1].includes('data-mailto-form'), 'enquiry forms must use the email-draft flow');
assert.ok(scriptMatch[1].includes('mailto:contact@proautodial.in'), 'enquiry destination must be present');
assert.ok(scriptMatch[1].includes('function notfound()'), 'unknown routes must have a not-found page');

console.log('Public website validation passed: JavaScript syntax, routes, rewrites, assets and enquiry flow.');
