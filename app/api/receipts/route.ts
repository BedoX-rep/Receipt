
import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('receipts')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const receipt = await request.json();
    
    const { data, error } = await supabase
      .from('receipts')
      .insert([{
        ...receipt,
        right_eye: typeof receipt.right_eye === 'string' ? receipt.right_eye : JSON.stringify(receipt.right_eye),
        left_eye: typeof receipt.left_eye === 'string' ? receipt.left_eye : JSON.stringify(receipt.left_eye),
        products: typeof receipt.products === 'string' ? receipt.products : JSON.stringify(receipt.products),
      }])
      .select()
      .single();
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'No data returned from insert' }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST /api/receipts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
