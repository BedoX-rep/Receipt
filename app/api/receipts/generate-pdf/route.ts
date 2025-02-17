
import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function POST(request: Request) {
  try {
    const receipt = await request.json();
    
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true
    });
    
    const chunks: Buffer[] = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('error', (error) => {
      throw new Error(`PDF Generation Error: ${error.message}`);
    });

    try {
      doc.fontSize(20).text('Lens Optic Receipt', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(12).text(`Date: ${new Date(receipt.date || new Date()).toLocaleString()}`);
      doc.text(`Client: ${receipt.client_name || 'Walk-in Customer'}`);
      doc.text(`Phone: ${receipt.client_phone || 'N/A'}`);
      doc.moveDown();

      // Prescription
      doc.fontSize(14).text('Prescription');
      doc.fontSize(12);
      doc.text('Right Eye:');
      const rightEye = receipt.right_eye || {};
      doc.text(`SPH: ${rightEye.sph || 'N/A'} CYL: ${rightEye.cyl || 'N/A'} AXE: ${rightEye.axe || 'N/A'}`);
      doc.text('Left Eye:');
      const leftEye = receipt.left_eye || {};
      doc.text(`SPH: ${leftEye.sph || 'N/A'} CYL: ${leftEye.cyl || 'N/A'} AXE: ${leftEye.axe || 'N/A'}`);
      doc.moveDown();

      // Products
      doc.fontSize(14).text('Products');
      doc.fontSize(12);
      const products = receipt.products || [];
      const subtotal = products.reduce((sum, product) => sum + (product.total || 0), 0);
      
      if (Array.isArray(products)) {
        products.forEach(product => {
          const price = product.price || 0;
          const quantity = product.quantity || 1;
          const total = product.total || (price * quantity);
          doc.text(`${product.name || 'Unknown Product'} x${quantity} @ $${price.toFixed(2)} = $${total.toFixed(2)}`);
        });
      }
      doc.moveDown();

      // Calculate final total with discounts
      const discount = receipt.discount || 0;
      const numericalDiscount = receipt.numerical_discount || 0;
      const percentageDiscount = subtotal * (discount / 100);
      const finalTotal = Math.max(subtotal - percentageDiscount - numericalDiscount, 0);
      const advancePayment = receipt.advance_payment || 0;

      // Totals
      doc.text(`Subtotal: $${subtotal.toFixed(2)}`);
      if (discount > 0) doc.text(`Discount: ${discount}%`);
      if (numericalDiscount > 0) doc.text(`Additional Discount: $${numericalDiscount.toFixed(2)}`);
      doc.text(`Total: $${finalTotal.toFixed(2)}`);
      doc.text(`Advance Payment: $${advancePayment.toFixed(2)}`);
      doc.text(`Balance Due: $${(finalTotal - advancePayment).toFixed(2)}`);
      
      // Footer
      doc.moveDown();
      doc.fontSize(10).text('Thank you for your business!', { align: 'center' });
      
      doc.end();

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
