
import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function POST(request: Request) {
  try {
    const receipt = await request.json();
    
    // Create a PDF document
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    // Collect PDF data chunks
    doc.on('data', chunk => chunks.push(chunk));
    
    // Generate PDF content
    doc.fontSize(20).text('Lens Optic Receipt', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Date: ${new Date(receipt.date).toLocaleString()}`);
    doc.text(`Client: ${receipt.client_name}`);
    doc.text(`Phone: ${receipt.client_phone}`);
    doc.moveDown();

    // Prescription
    doc.fontSize(14).text('Prescription');
    doc.fontSize(12);
    doc.text('Right Eye:');
    doc.text(`SPH: ${receipt.right_eye.sph || 'N/A'} CYL: ${receipt.right_eye.cyl || 'N/A'} AXE: ${receipt.right_eye.axe || 'N/A'}`);
    doc.text('Left Eye:');
    doc.text(`SPH: ${receipt.left_eye.sph || 'N/A'} CYL: ${receipt.left_eye.cyl || 'N/A'} AXE: ${receipt.left_eye.axe || 'N/A'}`);
    doc.moveDown();

    // Products
    doc.fontSize(14).text('Products');
    doc.fontSize(12);
    receipt.products.forEach(product => {
      doc.text(`${product.name} x${product.quantity} @ $${product.price.toFixed(2)} = $${product.total.toFixed(2)}`);
    });
    doc.moveDown();

    // Totals
    doc.text(`Subtotal: $${receipt.total.toFixed(2)}`);
    if (receipt.discount > 0) doc.text(`Discount: ${receipt.discount}%`);
    if (receipt.numerical_discount > 0) doc.text(`Additional Discount: $${receipt.numerical_discount.toFixed(2)}`);
    doc.text(`Total: $${receipt.total.toFixed(2)}`);
    doc.text(`Advance Payment: $${receipt.advance_payment.toFixed(2)}`);
    doc.text(`Balance Due: $${receipt.balance_due.toFixed(2)}`);
    
    // Footer
    doc.moveDown();
    doc.fontSize(10).text('Thank you for your business!', { align: 'center' });
    
    // End the document
    doc.end();

    // Wait for PDF generation to complete
    const pdfBuffer = Buffer.concat(chunks);
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=receipt.pdf'
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
