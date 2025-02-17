
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');

export async function PUT(request: Request, { params }: { params: { name: string } }) {
  const product = await request.json();
  const products = JSON.parse(await fs.readFile(PRODUCTS_FILE, 'utf-8'));
  const index = products.findIndex((p: any) => p.name === params.name);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  
  products[index] = product;
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products));
  return NextResponse.json(product);
}

export async function DELETE(request: Request, { params }: { params: { name: string } }) {
  const products = JSON.parse(await fs.readFile(PRODUCTS_FILE, 'utf-8'));
  const filtered = products.filter((p: any) => p.name !== params.name);
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(filtered));
  return NextResponse.json({}, { status: 200 });
}
