

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";


const DATA_DIR = join(process.cwd(), "data");
const CREDITS_FILE = join(DATA_DIR, "credits.json");


async function readAll() {
  try {
    const raw = await readFile(CREDITS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return {}; 
    throw err;
  }
}


async function writeAll(map) {
  await mkdir(dirname(CREDITS_FILE), { recursive: true });
  await writeFile(CREDITS_FILE, JSON.stringify(map, null, 2), "utf-8");
}

export async function addCredits(key, amount) {
  if (!key) throw new Error("addCredits: missing key");
  const k = String(key).toLowerCase();
  const map = await readAll();
  map[k] = (map[k] || 0) + Number(amount);
  await writeAll(map);
  return map[k];
}


export async function getCredits(key) {
  if (!key) return 0;
  const k = String(key).toLowerCase();
  const map = await readAll();
  return map[k] || 0;
}
