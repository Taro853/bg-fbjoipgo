
import React, { useState } from 'react';
import { Book, NewsItem, ClosedDate, MonthlyFeature, SurveyQuestion } from './types';
import { Plus, Trash2, Upload, Edit2, Layout, Calendar as CalendarIcon, BookOpen, MessageSquare, Check, X } from 'lucide-react';

interface AdminPanelProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  closedDates: ClosedDate[];
  setClosedDates: React.Dispatch<React.SetStateAction<ClosedDate[]>>;
  feature: MonthlyFeature;
  setFeature: React.Dispatch<React.SetStateAction<MonthlyFeature>>;
  survey: SurveyQuestion[];
  setSurvey: React.Dispatch<React.SetStateAction<SurveyQuestion[]>>;
}

type Tab = 'news' | 'books' | 'dates' | 'feature' | 'survey';

const RICH_TEXT_TOOLS = [
  { label: '大見出し', tagStart: '<div class="rt-h1-style">', tagEnd: '</div>', icon: 'H1', color: 'text-oct-900' },
  { label: '中見出し', tagStart: '<div class="rt-h2-style">', tagEnd: '</div>', icon: 'H2', color: 'text-oct-700' },
  { label: '赤字', tagStart: '<span class="rt-text-red">', tagEnd: '</span>', icon: 'A', color: 'text-red-600' },
  { label: '青字', tagStart: '<span class="rt-text-blue">', tagEnd: '</span>', icon: 'A', color: 'text-blue-600' },
  { label: '黄マーカー', tagStart: '<span class="rt-marker-yellow">', tagEnd: '</span>', icon: 'M', color: 'bg-yellow-100' },
  { label: '情報BOX', tagStart: '<div class="rt-box-info">', tagEnd: '</div>', icon: 'Box', color: 'bg-blue-50' },
  { label: '引用', tagStart: '<div class="rt-box-quote">', tagEnd: '</div>', icon: '”', color: 'bg-gray-50' },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  books, setBooks, news, setNews, closedDates, setClosedDates, feature, setFeature, survey, setSurvey
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('news');

  const insertTag = (current: string, setFunc: (val: string) => void, tagStart: string, tagEnd: string) => {
    setFunc(current + `\n${tagStart}テキスト${tagEnd}`);
  };

  const handleFileUpload = (file: File, callback: (url: string, name: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target?.result as string, file.name);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 pb-20 font-sans">
      <div className="flex flex-wrap justify-center gap-2 border-b border-oct-200 pb-4 sticky top-0 bg-white z-20 pt-4">
        {[
          { id: 'news', label: '図書館通信', icon: <Layout size={16}/> },
          { id: 'feature', label: '今月の特集', icon: <Edit2 size={16}/> },
          { id: 'books', label: '蔵書管理', icon: <BookOpen size={16}/> },
          { id: 'dates', label: '休館日', icon: <CalendarIcon size={16}/> },
          { id: 'survey', label: 'アンケート', icon: <MessageSquare size={16}/> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === tab.id ? 'bg-oct-900 text-white shadow-md' : 'bg-oct-50 text-oct-600 hover:bg-oct-100'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-oct-100 p-6 min-h-[600px]">
        {/* NEWS TAB */}
        {activeTab === 'news' && (
          <div className="space-y-8 animate-fade-in">
            <button onClick={() => setNews([{ id: Date.now().toString(), date: new Date().toISOString().split('T')[0], title: '新規通信', content: '' }, ...news])} className="flex items-center gap-2 bg-oct-900 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-oct-800 transition-colors">
              <Plus size={16} /> 通信を新規作成
            </button>
            <div className="space-y-6">
              {news.map(item => (
                <div key={item.id} className="border border-oct-100 rounded-xl p-6 bg-oct-50/30">
                  <div className="flex justify-between items-start mb-4">
                    <input value={item.title} onChange={e => setNews(news.map(n => n.id === item.id ? {...n, title: e.target.value} : n))} className="text-xl font-bold bg-transparent border-b border-oct-200 outline-none flex-1 mr-4 focus:border-oct-500" />
                    <button onClick={() => setNews(news.filter(n => n.id !== item.id))} className="text-red-400 p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={16}/></button>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {RICH_TEXT_TOOLS.map(t => (
                          <button key={t.label} onClick={() => insertTag(item.content, (val) => setNews(news.map(n => n.id === item.id ? {...n, content: val} : n)), t.tagStart, t.tagEnd)} className={`px-2 py-1 text-[10px] bg-white border border-oct-200 rounded font-bold hover:bg-oct-50 ${t.color}`}>{t.icon}</button>
                        ))}
                      </div>
                      <textarea value={item.content} onChange={e => setNews(news.map(n => n.id === item.id ? {...n, content: e.target.value} : n))} className="w-full h-40 p-3 border rounded text-xs font-mono focus:ring-2 focus:ring-oct-100 outline-none" placeholder="本文を入力..." />
                      <div className="mt-4 flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer bg-white border px-3 py-1 rounded text-[10px] font-bold hover:bg-oct-50">
                          <Upload size={14}/> PDFをアップロード
                          <input type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], (url, name) => setNews(news.map(n => n.id === item.id ? {...n, pdfUrl: url, fileName: name} : n)))} />
                        </label>
                        <span className="text-[10px] text-gray-400 truncate max-w-[100px]">{item.fileName || '未設定'}</span>
                      </div>
                    </div>
                    <div className="bg-white border rounded p-4 h-64 overflow-y-auto rich-text text-sm">
                      <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEATURE TAB */}
        {activeTab === 'feature' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2 text-oct-900"><Edit2 size={18}/> 今月の特集 編集</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-oct-400 mb-1 tracking-widest">メインタイトル</label>
                  <input value={feature.title} onChange={e => setFeature({...feature, title: e.target.value})} className="w-full border p-3 rounded font-bold focus:ring-2 focus:ring-oct-100 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-oct-400 mb-1 tracking-widest">サブタイトル</label>
                  <input value={feature.subtitle} onChange={e => setFeature({...feature, subtitle: e.target.value})} className="w-full border p-3 rounded focus:ring-2 focus:ring-oct-100 outline-none" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-oct-400 mb-1 tracking-widest">特集コンテンツ本文</label>
                   <div className="flex flex-wrap gap-1 mb-2">
                    {RICH_TEXT_TOOLS.map(t => (
                      <button key={t.label} onClick={() => insertTag(feature.content, (val) => setFeature({...feature, content: val}), t.tagStart, t.tagEnd)} className={`px-2 py-1 text-[10px] bg-white border border-oct-200 rounded font-bold hover:bg-oct-50 ${t.color}`}>{t.icon}</button>
                    ))}
                  </div>
                  <textarea value={feature.content} onChange={e => setFeature({...feature, content: e.target.value})} className="w-full h-80 p-3 border rounded text-xs font-mono focus:ring-2 focus:ring-oct-100 outline-none" />
                </div>
              </div>
              <div className="space-y-4">
                 <label className="block text-[10px] font-bold text-oct-400 mb-1 tracking-widest">プレビュー（実際の表示イメージ）</label>
                 <div className="border rounded-xl p-8 bg-[#fdfdfd] h-[550px] overflow-y-auto rich-text shadow-inner">
                    <h2 className="text-4xl font-bold mb-4 text-oct-950 font-serif">{feature.title}</h2>
                    <p className="italic text-oct-500 mb-6 text-xl font-serif">{feature.subtitle}</p>
                    <div className="mb-6 rounded-lg overflow-hidden h-40 bg-oct-100">
                      <img src={feature.imageUrl} className="w-full h-full object-cover" />
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: feature.content }} />
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* BOOKS TAB */}
        {activeTab === 'books' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2 text-oct-900"><BookOpen size={18}/> 蔵書管理</h3>
              <button 
                onClick={() => setBooks([{ id: Date.now().toString(), title: '新刊タイトル', author: '著者名', description: 'あらすじを入力...', coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400', category: '小説', isNew: true, isRecommended: false }, ...books])} 
                className="bg-oct-900 text-white px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-oct-800 transition-colors"
              >
                <Plus size={16}/> 本を新規登録
              </button>
            </div>
            
            <div className="grid gap-6">
              {books.map(book => (
                <div key={book.id} className="border border-oct-100 rounded-2xl p-6 bg-oct-50/20 hover:bg-oct-50/40 transition-colors grid md:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-white shadow-md border border-oct-100">
                      <img src={book.coverUrl} className="w-full h-full object-cover" />
                    </div>
                    <label className="block text-[10px] font-bold text-oct-400 tracking-tighter">画像URL</label>
                    <input value={book.coverUrl} onChange={e => setBooks(books.map(b => b.id === book.id ? {...b, coverUrl: e.target.value} : b))} className="w-full text-[10px] p-1 border rounded" />
                  </div>
                  
                  <div className="md:col-span-3 space-y-4">
                    <div className="flex justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        <input value={book.title} onChange={e => setBooks(books.map(b => b.id === book.id ? {...b, title: e.target.value} : b))} className="w-full text-lg font-bold bg-transparent border-b focus:border-oct-500 outline-none" placeholder="書籍名" />
                        <input value={book.author} onChange={e => setBooks(books.map(b => b.id === book.id ? {...b, author: e.target.value} : b))} className="w-full text-sm text-oct-600 bg-transparent border-b focus:border-oct-500 outline-none italic" placeholder="著者名" />
                      </div>
                      <button onClick={() => setBooks(books.filter(b => b.id !== book.id))} className="text-red-400 hover:text-red-600 p-2 self-start"><Trash2 size={20}/></button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-oct-400 mb-1">カテゴリ</label>
                        <select value={book.category} onChange={e => setBooks(books.map(b => b.id === book.id ? {...b, category: e.target.value} : b))} className="w-full border p-2 rounded text-sm">
                          {['小説', '技術', '料理', 'ビジネス', 'アート', '歴史'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div className="flex gap-4 items-end pb-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" checked={book.isNew} onChange={e => setBooks(books.map(b => b.id === book.id ? {...b, isNew: e.target.checked} : b))} className="w-4 h-4 rounded text-oct-900" />
                          <span className="text-xs font-bold group-hover:text-oct-600">新刊ラベル</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" checked={book.isRecommended} onChange={e => setBooks(books.map(b => b.id === book.id ? {...b, isRecommended: e.target.checked} : b))} className="w-4 h-4 rounded text-oct-900" />
                          <span className="text-xs font-bold group-hover:text-oct-600">おすすめ設定</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-oct-400 mb-1">説明・あらすじ</label>
                      <textarea value={book.description} onChange={e => setBooks(books.map(b => b.id === book.id ? {...b, description: e.target.value} : b))} className="w-full h-24 border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-oct-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DATES TAB */}
        {activeTab === 'dates' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-oct-900 flex items-center gap-2"><CalendarIcon size={18}/> 休館日カレンダー管理</h3>
              <button onClick={() => setClosedDates([...closedDates, { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], reason: '特別休館' }])} className="bg-oct-900 text-white px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-oct-800 transition-colors">
                <Plus size={16}/> 日付を追加
              </button>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {closedDates.map(d => (
                 <div key={d.id} className="flex flex-col gap-3 p-5 border border-oct-100 rounded-2xl bg-oct-50/50 hover:bg-oct-50 transition-colors">
                    <input type="date" value={d.date} onChange={e => setClosedDates(closedDates.map(cd => cd.id === d.id ? {...cd, date: e.target.value} : cd))} className="font-bold p-2 rounded border bg-white focus:ring-2 focus:ring-oct-100 outline-none" />
                    <input value={d.reason} onChange={e => setClosedDates(closedDates.map(cd => cd.id === d.id ? {...cd, reason: e.target.value} : cd))} className="text-sm p-2 bg-transparent border-b outline-none focus:border-oct-500" placeholder="理由（館内整理日など）" />
                    <button onClick={() => setClosedDates(closedDates.filter(cd => cd.id !== d.id))} className="self-end text-red-400 hover:text-red-600 p-2"><Trash2 size={16}/></button>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* SURVEY TAB */}
        {activeTab === 'survey' && (
          <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-oct-900 flex items-center gap-2"><MessageSquare size={18}/> アンケート項目管理</h3>
              <button onClick={() => setSurvey([...survey, { id: Date.now().toString(), text: '新しい質問項目', type: 'text' }])} className="bg-oct-900 text-white px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-oct-800 transition-colors">
                <Plus size={16}/> 項目を追加
              </button>
            </div>
            
            <div className="space-y-4">
              {survey.map(q => (
                <div key={q.id} className="border border-oct-100 rounded-2xl p-6 bg-oct-50/20 flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-1 w-full space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-oct-200 text-oct-700 px-2 py-0.5 rounded uppercase">Question</span>
                      <input value={q.text} onChange={e => setSurvey(survey.map(item => item.id === q.id ? {...item, text: e.target.value} : item))} className="flex-1 font-bold text-lg bg-transparent border-b outline-none focus:border-oct-500" />
                    </div>
                    <div className="flex gap-6 items-center">
                      <label className="text-xs font-bold text-oct-400">回答形式:</label>
                      <div className="flex gap-4">
                        {(['text', 'rating', 'choice'] as const).map(type => (
                          <label key={type} className="flex items-center gap-1.5 cursor-pointer group">
                            <input type="radio" checked={q.type === type} onChange={() => setSurvey(survey.map(item => item.id === q.id ? {...item, type} : item))} className="text-oct-900 w-4 h-4" />
                            <span className={`text-xs font-bold capitalize ${q.type === type ? 'text-oct-900' : 'text-gray-400'}`}>{type === 'text' ? '記述式' : type === 'rating' ? '5段階評価' : '選択肢'}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSurvey(survey.filter(item => item.id !== q.id))} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={20}/></button>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-8 bg-oct-950 text-white rounded-3xl">
              <h4 className="font-bold text-center mb-6 border-b border-oct-800 pb-4">管理者向けメッセージ</h4>
              <p className="text-sm text-oct-300 leading-relaxed text-center">
                アンケートの回答結果は、月次の「図書館運営会議」にて集計され、<br/>
                来年度の予算編成や蔵書選定の貴重な資料となります。<br/>
                定期的な項目の見直しを推奨します。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
