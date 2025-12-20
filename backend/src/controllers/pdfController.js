const PDFParser = require('pdf2json');

const extractPdfText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Check file type
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'File must be a PDF' });
    }

    // Check file size (5MB limit)
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size must be less than 5MB' });
    }

    // Create PDF parser
    const pdfParser = new PDFParser();

    // Extract text from PDF
    const extractedText = await new Promise((resolve, reject) => {
      pdfParser.on('pdfParser_dataError', errData => reject(errData.parserError));
      
      pdfParser.on('pdfParser_dataReady', pdfData => {
        try {
          // Extract text from all pages
          let text = '';
          
          if (pdfData.Pages) {
            pdfData.Pages.forEach(page => {
              if (page.Texts) {
                page.Texts.forEach(textItem => {
                  if (textItem.R) {
                    textItem.R.forEach(r => {
                      if (r.T) {
                        try {
                          // Try to decode, but catch errors for malformed URIs
                          text += decodeURIComponent(r.T) + ' ';
                        } catch (e) {
                          // If decoding fails, just use the raw text
                          text += r.T + ' ';
                        }
                      }
                    });
                  }
                });
                text += '\n';
              }
            });
          }

          resolve(text.trim());
        } catch (error) {
          reject(error);
        }
      });

      // Parse the PDF buffer
      pdfParser.parseBuffer(req.file.buffer);
    });

    // Clean up the extracted text
    const cleanedText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    // Return extracted text
    res.json({
      success: true,
      text: cleanedText,
      info: {
        fileName: req.file.originalname,
        fileSize: req.file.size
      }
    });

  } catch (error) {
    console.error('PDF extraction error:', error);
    res.status(500).json({ 
      error: 'Failed to extract text from PDF. Please try again or enter text manually.',
      details: error.message
    });
  }
};

module.exports = {
  extractPdfText
};