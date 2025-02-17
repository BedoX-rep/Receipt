
import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { name: string } }
) {
  const supabase = createClient();
  const updates = await request.json();
  
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('name', params.name)
    .select();
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data[0]);
}

export async function DELETE(
  request: Request,
  { params }: { params: { name: string } }
) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('name', params.name);
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return new NextResponse(null, { status: 204 });
}
