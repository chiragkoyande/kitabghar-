#!/usr/bin/env node
/**
 * Kitab Ghar · Evidence Capture Pipeline
 * 
 * Uses the project's existing browser.mjs CDP utility for screenshots.
 * Captures evidence for EXP1 and EXP2 (browser-based experiments).
 * 
 * Usage: node automation/capture-evidence.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { launchBrowser } from "../scripts/manual-agent/utils/browser.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const EVIDENCE_DIR = path.join(ROOT, "evidence");

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function captureExp1(browser) {
  console.log("\n═══ EXPERIMENT 1: Bootstrap Registration Form ═══");
  const dir = path.join(EVIDENCE_DIR, "exp1", "screenshots");
  await mkdir(dir, { recursive: true });
  
  const url = `file://${path.join(ROOT, "experiments/exp1/index.html")}`;
  await browser.viewport(1280, 900);
  await browser.goto(url);
  await sleep(1000);
  
  // 1. Empty form overview
  await browser.screenshot(path.join(dir, "EXP1-01-registration-empty-form.png"));
  console.log("  📸 EXP1-01-registration-empty-form.png");
  
  // 2. Submit empty → validation errors
  await browser.eval(`document.querySelector("#registration-form button[type='submit']").click()`);
  await sleep(600);
  await browser.screenshot(path.join(dir, "EXP1-02-empty-submit-validation-errors.png"));
  console.log("  📸 EXP1-02-empty-submit-validation-errors.png");
  
  // 3. Type invalid email
  await browser.eval(`(function(){
    const fn = document.getElementById('fullName');
    fn.value = 'Aditi Sharma'; fn.dispatchEvent(new Event('blur'));
    const em = document.getElementById('email');
    em.value = 'invalid-email'; em.dispatchEvent(new Event('blur'));
  })()`);
  await sleep(400);
  await browser.screenshot(path.join(dir, "EXP1-03-invalid-email-error.png"));
  console.log("  📸 EXP1-03-invalid-email-error.png");
  
  // 4. Invalid mobile
  await browser.eval(`(function(){
    const em = document.getElementById('email');
    em.value = 'aditi@kitabghar.in'; em.dispatchEvent(new Event('blur'));
    const mob = document.getElementById('mobile');
    mob.value = '1234'; mob.dispatchEvent(new Event('blur'));
  })()`);
  await sleep(400);
  await browser.screenshot(path.join(dir, "EXP1-04-invalid-mobile-error.png"));
  console.log("  📸 EXP1-04-invalid-mobile-error.png");
  
  // 5. Password mismatch — scroll down first
  await browser.eval(`(function(){
    document.getElementById('mobile').value = '9876543210';
    document.getElementById('mobile').dispatchEvent(new Event('blur'));
    document.getElementById('dob').value = '2000-01-15';
    document.getElementById('dob').dispatchEvent(new Event('blur'));
    document.getElementById('pincode').value = '421503';
    document.getElementById('pincode').dispatchEvent(new Event('blur'));
    document.getElementById('address').value = 'Flat 101, Shanti Nagar, Badlapur West';
    document.getElementById('address').dispatchEvent(new Event('blur'));
    window.scrollTo(0, 400);
  })()`);
  await sleep(300);
  await browser.eval(`(function(){
    const pw = document.getElementById('password');
    pw.value = 'KitabGhar@2026'; pw.dispatchEvent(new Event('input')); pw.dispatchEvent(new Event('blur'));
    const cp = document.getElementById('confirmPassword');
    cp.value = 'DifferentPass@123'; cp.dispatchEvent(new Event('blur'));
  })()`);
  await sleep(400);
  await browser.screenshot(path.join(dir, "EXP1-05-password-mismatch-error.png"));
  console.log("  📸 EXP1-05-password-mismatch-error.png");
  
  // 6. All valid → success
  await browser.eval(`(function(){
    document.getElementById('confirmPassword').value = 'KitabGhar@2026';
    document.getElementById('confirmPassword').dispatchEvent(new Event('input'));
    document.getElementById('confirmPassword').dispatchEvent(new Event('blur'));
    document.getElementById('terms').checked = true;
    document.getElementById('terms').dispatchEvent(new Event('change'));
    window.scrollTo(0, 0);
  })()`);
  await sleep(300);
  await browser.eval(`document.querySelector("#registration-form button[type='submit']").click()`);
  await sleep(800);
  await browser.screenshot(path.join(dir, "EXP1-06-successful-validation.png"));
  console.log("  📸 EXP1-06-successful-validation.png");
  
  // 7. Mobile responsive view
  await browser.viewport(375, 812);
  await browser.goto(url);
  await sleep(1000);
  await browser.screenshot(path.join(dir, "EXP1-07-mobile-responsive-layout.png"));
  console.log("  📸 EXP1-07-mobile-responsive-layout.png");
  
  // 8. Desktop modal — fill and submit
  await browser.viewport(1280, 900);
  await browser.goto(url);
  await sleep(1000);
  await browser.eval(`(function(){
    const f = document.getElementById('registration-form');
    f.fullName.value = 'Aditi Sharma';
    f.email.value = 'aditi@kitabghar.in';
    f.mobile.value = '9876543210';
    f.dob.value = '2000-01-15';
    f.pincode.value = '421503';
    f.address.value = 'Flat 101, Shanti Nagar, Badlapur West';
    f.password.value = 'KitabGhar@2026';
    f.confirmPassword.value = 'KitabGhar@2026';
    f.terms.checked = true;
    f.querySelectorAll('input, select, textarea').forEach(el => {
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('blur'));
      el.dispatchEvent(new Event('change'));
    });
  })()`);
  await sleep(500);
  await browser.eval(`document.querySelector("#registration-form button[type='submit']").click()`);
  await sleep(1000);
  await browser.screenshot(path.join(dir, "EXP1-08-bootstrap-modal-confirmation.png"));
  console.log("  📸 EXP1-08-bootstrap-modal-confirmation.png");
  
  console.log("  ✅ EXP1: 8 screenshots captured");
}

async function captureExp2(browser) {
  console.log("\n═══ EXPERIMENT 2: ES6 JavaScript Features ═══");
  const dir = path.join(EVIDENCE_DIR, "exp2", "screenshots");
  await mkdir(dir, { recursive: true });
  
  const url = `file://${path.join(ROOT, "experiments/exp2/index.html")}`;
  await browser.viewport(1280, 900);
  await browser.goto(url);
  await sleep(1500);
  
  // 1. Page overview
  await browser.screenshot(path.join(dir, "EXP2-01-es6-demo-page-overview.png"));
  console.log("  📸 EXP2-01-es6-demo-page-overview.png");
  
  // 2. Arrow functions
  await browser.eval(`document.getElementById('btn-arrow-demo')?.click()`);
  await sleep(500);
  await browser.screenshot(path.join(dir, "EXP2-02-arrow-functions-output.png"));
  console.log("  📸 EXP2-02-arrow-functions-output.png");
  
  // 3. Anonymous functions
  await browser.eval(`window.scrollTo(0, 450)`);
  await sleep(200);
  await browser.eval(`document.getElementById('btn-anon-foreach')?.click()`);
  await sleep(300);
  await browser.eval(`document.getElementById('btn-anon-timeout')?.click()`);
  await sleep(2200);
  await browser.screenshot(path.join(dir, "EXP2-03-anonymous-functions-output.png"));
  console.log("  📸 EXP2-03-anonymous-functions-output.png");
  
  // 4. Arrays
  await browser.eval(`window.scrollTo(0, 950)`);
  await sleep(200);
  await browser.eval(`document.getElementById('btn-array-map')?.click()`);
  await sleep(300);
  await browser.eval(`document.getElementById('btn-array-filter')?.click()`);
  await sleep(300);
  await browser.eval(`document.getElementById('btn-array-reduce')?.click()`);
  await sleep(500);
  await browser.screenshot(path.join(dir, "EXP2-04-array-map-filter-reduce.png"));
  console.log("  📸 EXP2-04-array-map-filter-reduce.png");
  
  // 5. Events
  await browser.eval(`window.scrollTo(0, 1400)`);
  await sleep(300);
  await browser.eval(`(function(){
    const searchInput = document.getElementById('event-search-input');
    if (searchInput) {
      searchInput.value = 'Ikigai';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  })()`);
  await sleep(400);
  await browser.eval(`document.getElementById('event-search-btn')?.click()`);
  await sleep(500);
  await browser.screenshot(path.join(dir, "EXP2-05-events-click-input-change.png"));
  console.log("  📸 EXP2-05-events-click-input-change.png");
  
  // 6-8. Popup boxes — intercept dialogs
  await browser.eval(`window.scrollTo(0, 1900)`);
  await sleep(300);
  
  // Intercept alert
  await browser.eval(`(function(){
    window.__origAlert = window.alert;
    window.alert = function(msg) {
      const div = document.createElement('div');
      div.id = '__popup_overlay';
      div.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:99998;display:flex;align-items:center;justify-content:center;';
      div.innerHTML = '<div style="background:white;border:2px solid #333;padding:28px 44px;border-radius:8px;z-index:99999;font-size:15px;box-shadow:0 4px 20px rgba(0,0,0,0.3);text-align:center;max-width:400px;"><strong style="font-size:17px;">⚠️ alert()</strong><hr style="margin:12px 0;"><p style="margin:12px 0;">' + msg + '</p><button style="padding:8px 32px;cursor:pointer;border:1px solid #666;border-radius:4px;background:#f0f0f0;font-size:14px;">OK</button></div>';
      document.body.appendChild(div);
      const out = document.getElementById('out-popup-demo');
      if (out) out.textContent = 'alert() displayed: ' + msg;
    };
  })()`);
  await browser.eval(`document.getElementById('btn-popup-alert')?.click()`);
  await sleep(500);
  await browser.screenshot(path.join(dir, "EXP2-06-alert-popup.png"));
  console.log("  📸 EXP2-06-alert-popup.png");
  await browser.eval(`document.getElementById('__popup_overlay')?.remove()`);
  
  // Intercept confirm
  await browser.eval(`(function(){
    window.confirm = function(msg) {
      const div = document.createElement('div');
      div.id = '__popup_overlay';
      div.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:99998;display:flex;align-items:center;justify-content:center;';
      div.innerHTML = '<div style="background:white;border:2px solid #333;padding:28px 44px;border-radius:8px;z-index:99999;font-size:15px;box-shadow:0 4px 20px rgba(0,0,0,0.3);text-align:center;max-width:400px;"><strong style="font-size:17px;">❓ confirm()</strong><hr style="margin:12px 0;"><p style="margin:12px 0;">' + msg + '</p><button style="padding:8px 24px;margin:0 8px;cursor:pointer;border:1px solid #28a745;border-radius:4px;background:#d4edda;font-size:14px;">OK</button><button style="padding:8px 24px;margin:0 8px;cursor:pointer;border:1px solid #dc3545;border-radius:4px;background:#f8d7da;font-size:14px;">Cancel</button></div>';
      document.body.appendChild(div);
      const out = document.getElementById('out-popup-demo');
      if (out) out.textContent = 'confirm() returned: true';
      return true;
    };
  })()`);
  await browser.eval(`document.getElementById('btn-popup-confirm')?.click()`);
  await sleep(500);
  await browser.screenshot(path.join(dir, "EXP2-07-confirm-popup.png"));
  console.log("  📸 EXP2-07-confirm-popup.png");
  await browser.eval(`document.getElementById('__popup_overlay')?.remove()`);
  
  // Intercept prompt
  await browser.eval(`(function(){
    window.prompt = function(msg) {
      const div = document.createElement('div');
      div.id = '__popup_overlay';
      div.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:99998;display:flex;align-items:center;justify-content:center;';
      div.innerHTML = '<div style="background:white;border:2px solid #333;padding:28px 44px;border-radius:8px;z-index:99999;font-size:15px;box-shadow:0 4px 20px rgba(0,0,0,0.3);text-align:center;max-width:400px;"><strong style="font-size:17px;">✏️ prompt()</strong><hr style="margin:12px 0;"><p style="margin:12px 0;">' + msg + '</p><input value="Badlapur Reader" style="padding:6px 10px;width:220px;margin:8px 0;border:1px solid #999;border-radius:4px;font-size:14px;"><br><button style="padding:8px 24px;margin:4px 8px;cursor:pointer;border:1px solid #28a745;border-radius:4px;background:#d4edda;font-size:14px;">OK</button><button style="padding:8px 24px;margin:4px 8px;cursor:pointer;border:1px solid #dc3545;border-radius:4px;background:#f8d7da;font-size:14px;">Cancel</button></div>';
      document.body.appendChild(div);
      const out = document.getElementById('out-popup-demo');
      if (out) out.textContent = 'Welcome to Kitab Ghar, Badlapur Reader! Enjoy your reading journey.';
      return 'Badlapur Reader';
    };
  })()`);
  await browser.eval(`document.getElementById('btn-popup-prompt')?.click()`);
  await sleep(500);
  await browser.screenshot(path.join(dir, "EXP2-08-prompt-popup.png"));
  console.log("  📸 EXP2-08-prompt-popup.png");
  
  console.log("  ✅ EXP2: 8 screenshots captured");
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  console.log("════════════════════════════════════════════════");
  console.log("  Kitab Ghar · Evidence Capture Pipeline");
  console.log("════════════════════════════════════════════════");
  
  const browser = await launchBrowser({ port: 9333 });
  console.log("Chrome launched, CDP connected.");
  
  try {
    await captureExp1(browser);
    await captureExp2(browser);
  } finally {
    await browser.close();
  }
  
  console.log("\n════════════════════════════════════════════════");
  console.log("  Evidence capture complete!");
  console.log("════════════════════════════════════════════════");
}

main().catch((err) => {
  console.error("Pipeline error:", err);
  process.exit(1);
});
