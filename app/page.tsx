'use client';

import { useState, useRef, useEffect } from 'react';
import { FileUp, FileText, X, Download, Sun, Shield, Infinity as InfinityIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PDFMerger from 'pdf-merger-js/browser';

// Icons
interface WaveIconProps {
  className?: string;
}

const WaveIcon: React.FC<WaveIconProps> = ({ className = '' }) => (
  <svg 
    className={className}
    width="32" 
    height="32" 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16 2C13.2 2 10.4 3.2 8 5.4C5.6 7.6 4 10.8 4 14.4C4 18 5.6 21.2 8 23.4C10.4 25.6 13.2 26.8 16 26.8C18.8 26.8 21.6 25.6 24 23.4C26.4 21.2 28 18 28 14.4C28 10.8 26.4 7.6 24 5.4C21.6 3.2 18.8 2 16 2Z" fill="currentColor"/>
    <path d="M16 6.40002C17.8 6.40002 19.4 7.20002 20.6 8.60002C21.8 10 22.2 11.6 22 13.2C21.8 14.8 20.8 16.2 19.4 17C18 17.8 16.4 18 14.8 17.8C13.2 17.6 11.8 16.8 10.8 15.6C9.8 14.4 9.19999 12.8 9.39999 11.2C9.59999 9.60002 10.6 8.20002 12 7.40002C13.4 6.60002 14.8 6.40002 16 6.40002Z" fill="white"/>
  </svg>
);

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// type PDFFile = File & { preview: string };

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  // Success state will be used for notifications
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  // Remove a file from the list
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Merge PDFs using pdf-merger-js
  const mergePdfs = async () => {
    if (files.length < 2) return;
    setIsMerging(true);
    try {
      const merger = new PDFMerger();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        await merger.add(arrayBuffer);
      }
      const mergedPdf = await merger.saveAsBuffer();
      const blob = new Blob([mergedPdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
      setShowSuccess(true);
      
      // Save the merged PDF to localStorage
      const mergedPdfData = {
        id: `pdf-${Date.now()}`,
        name: `merged-${new Date().toISOString().slice(0, 10)}.pdf`,
        size: blob.size,
        mergedAt: new Date().toISOString(),
        url: url
      };
      
      // Get existing PDFs from localStorage or initialize empty array
      const existingPdfs = JSON.parse(localStorage.getItem('mergedPdfs') || '[]');
      const updatedPdfs = [mergedPdfData, ...existingPdfs];
      localStorage.setItem('mergedPdfs', JSON.stringify(updatedPdfs));
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('An error occurred while merging PDFs. Please try again.');
    } finally {
      setIsMerging(false);
    }
  };
  
  // Download merged PDF
  const downloadMergedPdf = () => {
    if (!mergedPdfUrl) return;
    
    const a = document.createElement('a');
    a.href = mergedPdfUrl;
    a.download = 'merged-document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(mergedPdfUrl);
  };
  
  // Reset the form
  const resetForm = () => {
    setFiles([]);
    setMergedPdfUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="text-center mb-12"
      >
        <motion.div variants={fadeInUp} className="flex justify-center items-center mb-2">
          <WaveIcon />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-amber-500 bg-clip-text text-transparent ml-2">
            MergeWave
          </h1>
        </motion.div>
        <motion.p variants={fadeInUp} className="text-lg text-gray-400 max-w-2xl mx-auto">
          Combine multiple PDFs into one document with just a few clicks. It&apos;s fast, secure, and completely free!
        </motion.p>
      </motion.div>

        {/* File Upload Area */}
        <motion.div 
          variants={fadeInUp}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700 mb-8 transition-all hover:shadow-xl hover:border-gray-600"
        >
          <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="bg-gray-800/95 p-7 rounded-lg">
              <div className="flex flex-col items-center justify-center text-center p-4">
                <div className="p-3 bg-gray-700 rounded-full mb-4">
                  <WaveIcon />
                </div>
                <h3 className="text-lg font-medium text-gray-100 mb-2">Drop your PDFs here</h3>
                <p className="text-gray-400 text-sm mb-5 max-w-md">
                  Or click below to browse files from your device
                </p>
                <label className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-2.5 px-6 rounded-lg inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200">
                  <FileUp className="w-4 h-4 mr-2" />
                  Select PDF Files
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    multiple 
                    accept=".pdf"
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-3">
                  {files.length === 0 
                    ? 'No files selected' 
                    : `${files.length} file${files.length > 1 ? 's' : ''} selected`}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Selected Files */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700 mb-8"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="mb-4 sm:mb-0">
                    <h2 className="text-xl font-semibold text-gray-100">
                      Selected Files <span className="text-gray-400">({files.length})</span>
                    </h2>
                    <p className="text-sm text-gray-400">
                      {files.length >= 2 
                        ? `Ready to merge ${files.length} files` 
                        : 'Add at least one more file to merge'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                    >
                      <X className="w-4 h-4 mr-1.5" />
                      Clear All
                    </button>
                    {!mergedPdfUrl && files.length >= 2 && (
                      <button
                        onClick={mergePdfs}
                        disabled={isMerging}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 disabled:opacity-70 transition-all flex items-center shadow-md hover:shadow-lg disabled:shadow-none"
                      >
                        {isMerging ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Merging...
                          </>
                        ) : (
                          <>
                            <WaveIcon className="w-4 h-4 mr-1.5" />
                            Merge PDFs
                          </>
                        )}
                      </button>
                    )}
                    {mergedPdfUrl && (
                      <button
                        onClick={downloadMergedPdf}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-400 hover:to-emerald-500 transition-all flex items-center shadow-md hover:shadow-lg"
                      >
                        <Download className="w-4 h-4 mr-1.5" />
                        Download PDF
                      </button>
                    )}
                  </div>
                </div>

                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <ul className="divide-y divide-gray-700">
                    {files.map((file, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="group hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center justify-between p-3">
                          <div className="flex items-center min-w-0">
                            <div className="bg-gray-700 p-2 rounded-lg mr-3 group-hover:bg-gray-600 transition-colors">
                              <FileText className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="min-w-0 pr-2">
                              <p className="text-sm font-medium text-gray-100 truncate">
                                {file.name.replace(/\.pdf$/i, '')}
                              </p>
                              <p className="text-xs text-gray-400">
                                {(file.size / 1024).toFixed(1)} KB • {new Date(file.lastModified).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1.5 text-gray-500 hover:text-red-400 rounded-full hover:bg-red-900/30 transition-colors"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features */}
        <motion.div 
          variants={fadeInUp}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div 
            variants={fadeInUp}
            className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-600"
          >
            <div className="bg-yellow-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Sun className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="font-semibold text-gray-100 mb-2">Easy to Use</h3>
            <p className="text-sm text-gray-400">
              Just select your PDFs and click merge. It&apos;s that simple! No watermarks, no registration required.
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-600"
          >
            <div className="bg-blue-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-100 mb-2">100% Secure</h3>
            <p className="text-sm text-gray-400">
              Your files never leave your browser. All processing happens locally for maximum privacy and security.
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-600"
          >
            <div className="bg-purple-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <InfinityIcon className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-100 mb-2">No Limits</h3>
            <p className="text-sm text-gray-400">
              Merge as many PDFs as you need, with no file size limits. Completely free, now and forever.
            </p>
          </motion.div>
        </motion.div>
      </div>
  );
}
