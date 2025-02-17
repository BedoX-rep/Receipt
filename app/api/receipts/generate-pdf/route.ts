
import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function POST(request: Request) {
  try {
    const receipt = await request.json();
    
    // Create a PDF document with better defaults
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true
    });
    
    const chunks: Buffer[] = [];

    // Collect PDF data chunks
    doc.on('data', chunk => chunks.push(chunk));
    
    // Error handling for PDF generation
    doc.on('error', (error) => {
      throw new Error(`PDF Generation Error: ${error.message}`);
    });

    // Generate PDF content with proper error checking
    try {
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
      const subtotal = receipt.products.reduce((sum, product) => sum + product.total, 0);
      if (Array.isArray(receipt.products)) {
        receipt.products.forEach(product => {
          doc.text(`${product.name} x${product.quantity} @ $${product.price.toFixed(2)} = $${product.total.toFixed(2)}`);
        });
      }
      doc.moveDown();

      // Calculate final total with discounts
      const percentageDiscount = subtotal * (receipt.discount / 100);
      const finalTotal = Math.max(subtotal - percentageDiscount - receipt.numerical_discount, 0);

      // Totals
      doc.text(`Subtotal: $${subtotal.toFixed(2)}`);
      if (receipt.discount > 0) doc.text(`Discount: ${receipt.discount}%`);
      if (receipt.numerical_discount > 0) doc.text(`Additional Discount: $${receipt.numerical_discount.toFixed(2)}`);
      doc.text(`Total: $${finalTotal.toFixed(2)}`);
      doc.text(`Advance Payment: $${receipt.advance_payment.toFixed(2)}`);
      doc.text(`Balance Due: $${(finalTotal - receipt.advance_payment).toFixed(2)}`);
      
      // Footer
      doc.moveDown();
      doc.fontSize(10).text('Thank you for your business!', { align: 'center' });
      
      // End the document
      doc.end();

      // Wait for PDF generation to complete
      return new Promise((resolve, reject) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve(new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename=receipt.pdf'
            }
          }));
        });
      });

    } catch (error) {
      throw new Error(`PDF Content Generation Error: ${error.message}`);
    }

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    );
  }
}
