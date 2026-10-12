#!/usr/bin/env node
// Archive web articles, PDFs, and YouTube links as pages in a SilverBullet space.
//
// Usage: node archive.mjs [--folder Reading] [--tags a,b] [--dry-run] <url>[|Title] ...
// Env:   SB_URL (for example https://notes.example.com), SB_TOKEN (SilverBullet auth token)
import { execFileSync } from "node:child_process";

const DEFUDDLE = "defuddle@0.19.5";

const args = process.argv.slice(2);
let folder = "Reading", tags = [], dryRun = false;
const targets = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--folder") folder = args[++i];
  else if (args[i] === "--tags") tags = args[++i].split(",").map((t) => t.trim()).filter(Boolean);
  else if (args[i] === "--dry-run") dryRun = true;
  else targets.push(args[i]);
}
const { SB_URL, SB_TOKEN } = process.env;
if (!targets.length || !SB_URL || !SB_TOKEN) {
  console.error("usage: SB_URL=... SB_TOKEN=... node archive.mjs [--folder Reading] [--tags a,b] [--dry-run] <url>[|Title] ...");
  process.exit(2);
}

const auth = { Authorization: `Bearer ${SB_TOKEN}` };
const fsUrl = (path) => `${SB_URL.replace(/\/$/, "")}/.fs/${path.split("/").map(encodeURIComponent).join("/")}`;
const exists = async (path) => (await fetch(fsUrl(path), { method: "GET", headers: auth })).status === 200;
const put = async (path, body, type) => {
  const res = await fetch(fsUrl(path), { method: "PUT", headers: { ...auth, "Content-Type": type }, body });
  if (!res.ok) throw new Error(`PUT ${path}: HTTP ${res.status}`);
  const back = Buffer.from(await (await fetch(fsUrl(path), { headers: auth })).arrayBuffer());
  if (!back.equals(Buffer.from(body))) throw new Error(`PUT ${path}: content read back differs`);
};

// Page names must not contain characters that SilverBullet treats as link syntax or folders.
const cleanName = (s) => s.replace(/:\s+/g, " - ").replace(/[\/:\\?*"<>|#\[\]^]/g, "-").replace(/\s+/g, " ").trim().replace(/^-+|-+$/g, "");
const yaml = (s) => JSON.stringify(s ?? "");
const today = new Date().toISOString().slice(0, 10);
const used = new Set();

let failed = 0;
for (const target of [...new Set(targets)]) {
  const [url, override] = target.split("|");
  try {
    let title, body, meta = "", pdf = null;
    if (/(youtube\.com\/watch|youtu\.be\/)/.test(url)) {
      const o = await (await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`)).json();
      title = o.title;
      meta = `author: ${yaml(o.author_name)}\n`;
      body = `Video: ${url}\n\n_No transcript archived._\n`;
    } else {
      if (/\.pdf$/i.test(url)) {
        // curl handles servers whose TLS setup Node's fetch rejects, such as cr.yp.to.
        pdf = execFileSync("curl", ["-sfL", url], { maxBuffer: 256e6 });
        if (pdf.subarray(0, 4).toString() !== "%PDF") throw new Error(`GET ${url}: not a PDF`);
        title = override || decodeURIComponent(url.split("/").pop().replace(/\.pdf$/i, ""));
      } else {
        const j = JSON.parse(execFileSync("npx", ["-y", DEFUDDLE, "parse", url, "--json", "--markdown"], { maxBuffer: 64e6, stdio: ["ignore", "pipe", "ignore"] }).toString());
        title = j.title;
        if (j.author) meta += `author: ${yaml(j.author)}\n`;
        if (j.published) meta += `published: ${yaml(j.published)}\n`;
        body = j.content + "\n";
      }
    }

    let name = cleanName(override || title || url.split("/").pop());
    for (let n = 2; used.has(name); n++) name = `${name.replace(/ \(\d+\)$/, "")} (${n})`;
    used.add(name);
    const page = `${folder}/${name}.md`;
    if (await exists(page)) { console.log(`SKIP exists  ${page}`); continue; }

    if (pdf) {
      const file = `${folder}/${name}.pdf`;
      if (await exists(file)) { console.log(`SKIP exists  ${file}`); continue; }
      if (!dryRun) await put(file, pdf, "application/pdf");
      body = `PDF: ${url}\n\nArchived copy: [[${file}]]\n`;
    }
    const tagLine = tags.length ? `tags: [${tags.join(", ")}]\n` : "";
    const text = `---\n${tagLine}url: ${yaml(url)}\nstatus: unread\nadded: ${today}\n${meta}---\n# Article\n\n${body}\n# My notes\n`;
    if (!dryRun) await put(page, text, "text/markdown");
    console.log(`${dryRun ? "DRY " : "OK  "} ${page} (${text.length} chars${pdf ? `, pdf ${pdf.length} bytes` : ""})`);
  } catch (e) {
    failed++;
    console.log(`FAIL ${url} ${e.message.split("\n")[0]}`);
  }
}
process.exit(failed ? 1 : 0);
