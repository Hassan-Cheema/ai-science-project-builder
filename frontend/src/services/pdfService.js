import { jsPDF } from 'jspdf';
import { marked } from 'marked';

export const generatePDF = (projectData) => {
  const { title, idea, hypothesis, graphBase64, report } = projectData;
  
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkNewPage = (requiredSpace = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add wrapped text
  const addWrappedText = (text, fontSize = 11, fontStyle = 'normal', maxWidth = contentWidth) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    const lines = doc.splitTextToSize(text, maxWidth);
    
    lines.forEach((line) => {
      checkNewPage();
      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    });
  };

  // Header - Title
  doc.setFillColor(35, 131, 226); // Notion blue
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(title, contentWidth - 20);
  doc.text(titleLines, margin, 15);
  
  // Reset colors
  doc.setTextColor(0, 0, 0);
  yPosition = 45;

  // Metadata
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | AI Science Builder`, margin, yPosition);
  yPosition += 15;

  // Section 1: Project Idea
  doc.setFillColor(239, 246, 255); // Light blue background
  doc.roundedRect(margin - 5, yPosition - 5, contentWidth + 10, 12, 2, 2, 'F');
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(35, 131, 226);
  doc.text('💡 Project Idea', margin, yPosition + 4);
  yPosition += 15;

  doc.setTextColor(0, 0, 0);
  addWrappedText(idea, 11, 'normal');
  yPosition += 10;

  // Section 2: Hypothesis
  checkNewPage(30);
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(margin - 5, yPosition - 5, contentWidth + 10, 12, 2, 2, 'F');
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(35, 131, 226);
  doc.text('🔬 Hypothesis', margin, yPosition + 4);
  yPosition += 15;

  doc.setTextColor(0, 0, 0);
  doc.setFillColor(240, 240, 240);
  const hypothesisHeight = doc.splitTextToSize(hypothesis, contentWidth - 10).length * 5 + 10;
  doc.roundedRect(margin, yPosition - 5, contentWidth, hypothesisHeight, 3, 3, 'F');
  yPosition += 2;
  addWrappedText(hypothesis, 11, 'italic', contentWidth - 10);
  yPosition += 10;

  // Section 3: Data Visualization
  if (graphBase64) {
    checkNewPage(80);
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(margin - 5, yPosition - 5, contentWidth + 10, 12, 2, 2, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(35, 131, 226);
    doc.text('📊 Data Visualization', margin, yPosition + 4);
    yPosition += 15;

    try {
      // Add graph image
      const imgWidth = contentWidth;
      const imgHeight = imgWidth * 0.6; // Maintain aspect ratio
      doc.addImage(`data:image/png;base64,${graphBase64}`, 'PNG', margin, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;
    } catch (error) {
      console.error('Error adding image to PDF:', error);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('(Graph visualization not available)', margin, yPosition);
      yPosition += 10;
    }
  }

  // Section 4: Full Report (if available)
  if (report) {
    doc.addPage();
    yPosition = margin;
    
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(margin - 5, yPosition - 5, contentWidth + 10, 12, 2, 2, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(35, 131, 226);
    doc.text('📝 Comprehensive Report', margin, yPosition + 4);
    yPosition += 15;

    // Convert markdown to plain text for PDF
    doc.setTextColor(0, 0, 0);
    const plainText = report
      .replace(/#+\s/g, '') // Remove markdown headers
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/\*/g, '') // Remove italic markers
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links
      .replace(/`/g, ''); // Remove code markers

    addWrappedText(plainText, 10, 'normal');
  }

  // Footer on last page
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${totalPages} | AI Science Builder`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  return doc;
};

export const downloadProjectPDF = async (projectData, filename = 'science-project.pdf') => {
  try {
    const pdf = generatePDF(projectData);
    pdf.save(filename);
    return { success: true };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: error.message };
  }
};

