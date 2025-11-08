'use client';

import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumeTemplateProps {
  content: string;
  name: string;
  role: string;
}

export function ResumeTemplate({ content, name, role }: ResumeTemplateProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;

    try {
      // Create canvas from the resume div
      const canvas = await html2canvas(resumeRef.current, {
        scale: 3, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `${name.replace(/\s+/g, '_')}_Resume.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Parse the content into structured sections
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const sections: { type: 'header' | 'content' | 'bullet'; text: string }[] = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      // Check if it's a section header (ALL CAPS)
      if (/^[A-Z\s&]+:?$/.test(trimmed) && trimmed.length > 3) {
        sections.push({ type: 'header', text: trimmed.replace(':', '') });
      } else if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        sections.push({ type: 'bullet', text: trimmed.replace(/^[•\-]\s*/, '') });
      } else {
        sections.push({ type: 'content', text: trimmed });
      }
    });
    
    return sections;
  };

  const sections = parseContent(content);

  return (
    <div className="max-w-[210mm] mx-auto">
      {/* Action Buttons */}
      <div className="mb-6 flex gap-4 justify-end">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </button>
      </div>

      {/* Resume Preview */}
      <div
        ref={resumeRef}
        className="bg-white shadow-2xl"
        style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}
      >
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-10">
          <h1 className="text-5xl font-bold mb-2 tracking-tight">{name}</h1>
          <p className="text-2xl font-light text-slate-200 tracking-wide">{role}</p>
          <div className="mt-6 flex items-center gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>email@example.com</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>City, State</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-10">
          {sections.map((section, index) => {
            if (section.type === 'header') {
              return (
                <div key={index} className="mt-8 first:mt-0 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
                    <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
                      {section.text}
                    </h2>
                  </div>
                  <div className="h-0.5 bg-gradient-to-r from-green-600 via-emerald-500 to-transparent"></div>
                </div>
              );
            }

            if (section.type === 'bullet') {
              return (
                <div key={index} className="flex items-start gap-3 mb-2 ml-4">
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0"></div>
                  <p className="text-slate-700 leading-relaxed text-sm">{section.text}</p>
                </div>
              );
            }

            return (
              <p key={index} className="text-slate-700 leading-relaxed mb-3 text-sm">
                {section.text}
              </p>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 pb-6 px-10">
          <div className="border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
            Professional Resume • Generated by ScholarBar
          </div>
        </div>
      </div>
    </div>
  );
}

