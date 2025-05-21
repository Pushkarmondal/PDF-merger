'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type MergedPdf = {
  id: string;
  name: string;
  size: number;
  mergedAt: string;
  url: string;
};

export default function DashboardPage() {
  const [pdfs, setPdfs] = useState<MergedPdf[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMergedPdfs = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch this from your database/API
        // For now, we'll use localStorage as a simple solution
        const savedPdfs = localStorage.getItem('mergedPdfs');
        if (savedPdfs) {
          setPdfs(JSON.parse(savedPdfs));
        }
      } catch (err) {
        console.error('Error fetching merged PDFs:', err);
        setError('Failed to load merged PDFs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMergedPdfs();
  }, []);

  const handleDownload = (pdf: MergedPdf) => {
    const link = document.createElement('a');
    link.href = pdf.url;
    link.download = pdf.name || 'merged-document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this PDF?')) {
      const updatedPdfs = pdfs.filter(pdf => pdf.id !== id);
      setPdfs(updatedPdfs);
      localStorage.setItem('mergedPdfs', JSON.stringify(updatedPdfs));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Merged PDFs</h1>
            <p className="mt-2 text-sm text-gray-500">
              View and manage your previously merged PDF documents
            </p>
          </div>
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="-ml-1 mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {pdfs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No merged PDFs yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Merge some PDFs to see them here
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Merge PDFs Now
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {pdfs.map((pdf) => (
                <li key={pdf.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="flex-shrink-0 h-10 w-10 text-blue-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {pdf.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {Math.round(pdf.size / 1024)} KB • 
                            {new Date(pdf.mergedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-3">
                        <button
                          type="button"
                          onClick={() => handleDownload(pdf)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Download className="-ml-0.5 mr-1.5 h-4 w-4" />
                          Download
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(pdf.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 className="-ml-0.5 mr-1.5 h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
