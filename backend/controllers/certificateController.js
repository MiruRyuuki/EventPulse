// controllers/certificateController.js
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

exports.generateCertificate = async (req, res) => {
  const { name, event } = req.query;

  if (!name || !event) {
    return res.status(400).json({ message: 'Missing name or event query parameters' });
  }

  try {
    // Create a new PDF document
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });

    // Define file path
    const fileName = `${Date.now()}-${name.replace(/ /g, '_')}-${event.replace(/ /g, '_')}.pdf`;
    const filePath = path.join(__dirname, '../uploads', fileName);

    // Create writable stream
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // --- Basic Certificate Styling ---
    doc
      .fontSize(30)
      .text('Certificate of Participation', { align: 'center', underline: true });

    doc.moveDown(2);

    doc
      .fontSize(20)
      .text(`This is to certify that`, { align: 'center' });

    doc
      .fontSize(26)
      .fillColor('blue')
      .text(name, { align: 'center' });

    doc
      .fontSize(20)
      .fillColor('black')
      .text(`has participated in the event`, { align: 'center' });

    doc
      .fontSize(24)
      .fillColor('green')
      .text(`"${event}"`, { align: 'center' });

    doc.moveDown(2);
    doc
      .fontSize(14)
      .fillColor('gray')
      .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });

    // Finalize the PDF
    doc.end();

    // Wait for the file to be written then send
    stream.on('finish', () => {
      res.download(filePath, fileName);
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ message: 'Failed to generate certificate' });
  }
};
