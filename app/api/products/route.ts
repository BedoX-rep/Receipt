
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR);
  }
  
  try {
    await fs.access(PRODUCTS_FILE);
  } catch {
    await fs.writeFile(PRODUCTS_FILE, '[]');
  }
}

export async function GET() {
  await ensureDataDir();
  const products = await fs.readFile(PRODUCTS_FILE, 'utf-8');
  return NextResponse.json(JSON.parse(products));
}

export async function POST(request: Request) {
  await ensureDataDir();
  const product = await request.json();
  const products = JSON.parse(await fs.readFile(PRODUCTS_FILE, 'utf-8'));
  products.push(product);
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products));
  return NextResponse.json(product, { status: 201 });
}
