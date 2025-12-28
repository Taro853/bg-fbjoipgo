
import React from 'react';
import { NewsItem } from './types';
import { FileText, Download, Calendar } from 'lucide-react';

interface NewsDetailModalProps {
  news: NewsItem;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-3xl shadow-xl border border-oct-100 animate-fade-in">
      <header className="mb-12 border-b border-oct-100 pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-oct-400 tracking-widest mb-4 uppercase">
          <Calendar size={14} />
          <time>{news.date}</time>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-oct-950 leading-tight">{news.title}</h2>
      </header>
      
      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 rich-text leading-loose" dangerouslySetInnerHTML={{ __html: news.content }} />
        
        <aside className="space-y-6">
          {news.pdfUrl && (
            <div className="bg-oct-50 p-6 rounded-2xl border border-oct-100 shadow-sm sticky top-24">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <FileText size={24} className="text-red-500" />
              </div>
              <h4 className="font-bold text-sm mb-2 text-oct-900">PDF版ライブラリ</h4>
              <p className="text-[10px] text-gray-400 mb-6 truncate leading-relaxed">
                紙面と同じ内容をPDF形式で<br/>ダウンロードいただけます。
              </p>
              <a 
                href={news.pdfUrl} 
                download={news.fileName || 'oct_news.pdf'}
                className="flex items-center justify-center gap-2 bg-oct-900 text-white p-4 rounded-xl text-xs font-bold w-full hover:bg-oct-800 transition-all shadow-md active:scale-95"
              >
                <Download size={14}/> ダウンロード
              </a>
              <p className="mt-3 text-[9px] text-center text-gray-400 font-sans">
                File: {news.fileName || 'noname.pdf'}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
