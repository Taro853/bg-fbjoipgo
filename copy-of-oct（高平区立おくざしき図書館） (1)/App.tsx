import React, { useState, useEffect } from 'react';
import { Book, ModalState, NewsItem, Notice, ClosedDate, MonthlyFeature, SurveyQuestion } from './types';
import { INITIAL_BOOKS, INITIAL_NEWS, INITIAL_NOTICES, INITIAL_CLOSED_DATES, INITIAL_FEATURE, INITIAL_LIBRARIANS, INITIAL_SURVEY } from './constants';
import { db } from './firebase';

// Fix: Modular SDK named imports from firebase/firestore
import { collection, onSnapshot, doc, query, orderBy } from 'firebase/firestore';

// Components
import { Modal } from './Modal';
import { Header, Footer } from './Layout';
import { CalendarView } from './CalendarView';

// Modals
import { AdminModal } from './AdminModal';
import { FeatureModal } from './FeatureModal';
import { NewsDetailModal } from './NewsDetailModal';
import { AccessModal } from './AccessModal';
import { BookDetailModal } from './BookDetailModal';
import { LibrarianModal } from './LibrarianModal';
import { SurveyModal } from './SurveyModal';
import { NoticeDetailModal } from './NoticeDetailModal';

import { FileText, ArrowRight, Calendar as CalendarIcon, BookOpen, Bell, Search, Info } from 'lucide-react';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [closedDates, setClosedDates] = useState<ClosedDate[]>(INITIAL_CLOSED_DATES);
  const [currentFeature, setCurrentFeature] = useState<MonthlyFeature>(INITIAL_FEATURE);
  const [survey, setSurvey] = useState<SurveyQuestion[]>(INITIAL_SURVEY);
  
  const [modalState, setModalState] = useState<ModalState>({ type: 'NONE' });
  const [reservedBookIds, setReservedBookIds] = useState<string[]>(() => JSON.parse(localStorage.getItem('oct_reserved') || '[]'));
  const [wantToReadIds, setWantToReadIds] = useState<string[]>(() => JSON.parse(localStorage.getItem('oct_bookmark') || '[]'));

  useEffect(() => {
    if (!db) return;

    const unsubBooks = onSnapshot(collection(db, 'books'), (snap) => {
      if (!snap.empty) setBooks(snap.docs.map(d => ({ ...d.data(), id: d.id } as Book)));
    });

    const unsubNews = onSnapshot(query(collection(db, 'news'), orderBy('date', 'desc')), (snap) => {
      if (!snap.empty) setNews(snap.docs.map(d => ({ ...d.data(), id: d.id } as NewsItem)));
    });

    const unsubNotices = onSnapshot(query(collection(db, 'notices'), orderBy('date', 'desc')), (snap) => {
      if (!snap.empty) setNotices(snap.docs.map(d => ({ ...d.data(), id: d.id } as Notice)));
    });

    const unsubDates = onSnapshot(collection(db, 'closed_dates'), (snap) => {
      if (!snap.empty) setClosedDates(snap.docs.map(d => ({ ...d.data(), id: d.id } as ClosedDate)));
    });

    const unsubFeature = onSnapshot(doc(db, 'features', 'current_feature'), (docSnap) => {
      if (docSnap.exists()) setCurrentFeature(docSnap.data() as MonthlyFeature);
    });

    return () => {
      unsubBooks(); unsubNews(); unsubNotices(); unsubDates(); unsubFeature();
    };
  }, []);

  useEffect(() => localStorage.setItem('oct_reserved', JSON.stringify(reservedBookIds)), [reservedBookIds]);
  useEffect(() => localStorage.setItem('oct_bookmark', JSON.stringify(wantToReadIds)), [wantToReadIds]);

  const openModal = (type: ModalState['type'], data?: any) => setModalState({ type, data });
  const closeModal = () => setModalState({ type: 'NONE' });

  const toggleReserve = (id: string) => setReservedBookIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleWantToRead = (id: string) => setWantToReadIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-oct-950">
      <Header onOpenModal={openModal} />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-oct-950">
        <div className="absolute inset-0 z-0">
          <img src={currentFeature.imageUrl} alt="Feature" className="w-full h-full object-cover opacity-40 animate-ken-burns" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-oct-950" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 serif animate-slide-up">{currentFeature.title}</h2>
          <p className="text-xl md:text-2xl font-light italic mb-10 animate-slide-up">{currentFeature.subtitle}</p>
          <div className="flex justify-center gap-4 animate-slide-up">
            <button onClick={() => openModal('FEATURE')} className="bg-white text-oct-950 px-8 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition-all">特集を読む</button>
            <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all">蔵書検索</button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-24">
          {/* Notices */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b pb-4">
              <h2 className="text-3xl font-bold serif flex items-center gap-3"><Bell className="text-oct-500" /> お知らせ</h2>
            </div>
            <div className="space-y-4">
              {notices.slice(0, 3).map(item => (
                <div key={item.id} onClick={() => openModal('NOTICE_DETAIL', item)} className="group flex justify-between items-center p-6 bg-white border border-oct-50 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-oct-300">{item.date}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${item.category === 'IMPORTANT' ? 'bg-red-50 text-red-600' : 'bg-oct-50 text-oct-600'}`}>{item.category}</span>
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-oct-600">{item.title}</h3>
                  </div>
                  <ArrowRight size={20} className="text-oct-100 group-hover:text-oct-900 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Books */}
          <section>
            <h2 className="text-3xl font-bold serif mb-8 flex items-center gap-3"><BookOpen className="text-oct-500" /> 今月のおすすめ</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {books.filter(b => b.isRecommended).map(book => (
                <div key={book.id} onClick={() => openModal('BOOK_DETAIL', book)} className="group cursor-pointer">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all mb-4">
                    <img src={book.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h4 className="font-bold text-sm line-clamp-1">{book.title}</h4>
                  <p className="text-[10px] text-oct-400 italic">{book.author}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          <section>
            <h3 className="text-xl font-bold serif mb-6 flex items-center gap-2"><CalendarIcon size={20} className="text-oct-500" /> 休館日カレンダー</h3>
            <CalendarView closedDates={closedDates} />
          </section>
          
          <div className="bg-oct-950 text-white p-8 rounded-3xl shadow-2xl">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Info size={18} className="text-oct-400" /> 本日の開館時間</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>平日</span><span className="font-bold">9:30 - 20:00</span></div>
              <div className="flex justify-between"><span>土日祝</span><span className="font-bold">9:30 - 18:00</span></div>
            </div>
            <button onClick={() => openModal('ACCESS')} className="w-full mt-8 bg-oct-800 hover:bg-oct-700 py-3 rounded-xl font-bold transition-colors">アクセス・地図</button>
          </div>
        </aside>
      </main>

      <Footer onOpenSurvey={() => openModal('SURVEY')} />

      <Modal isOpen={modalState.type !== 'NONE'} onClose={closeModal} onNavigate={openModal}>
        {modalState.type === 'ADMIN' && (
          <AdminModal 
            books={books} setBooks={setBooks}
            news={news} setNews={setNews}
            closedDates={closedDates} setClosedDates={setClosedDates}
            feature={currentFeature} setFeature={setCurrentFeature}
            survey={survey} setSurvey={setSurvey}
          />
        )}
        {modalState.type === 'FEATURE' && <FeatureModal feature={currentFeature} allBooks={books} onBookClick={(b) => openModal('BOOK_DETAIL', b)} />}
        {modalState.type === 'NEWS_DETAIL' && <NewsDetailModal news={modalState.data} />}
        {modalState.type === 'NOTICE_DETAIL' && <NoticeDetailModal notice={modalState.data} />}
        {modalState.type === 'ACCESS' && <AccessModal />}
        {modalState.type === 'BOOK_DETAIL' && (
          <BookDetailModal 
            book={modalState.data} 
            isReserved={reservedBookIds.includes(modalState.data?.id)}
            isBookmarked={wantToReadIds.includes(modalState.data?.id)}
            onToggleReserve={() => toggleReserve(modalState.data.id)}
            onToggleBookmark={() => toggleWantToRead(modalState.data.id)}
          />
        )}
        {modalState.type === 'LIBRARIAN' && <LibrarianModal librarians={INITIAL_LIBRARIANS} />}
        {modalState.type === 'SURVEY' && <SurveyModal questions={survey} onSubmit={closeModal} />}
      </Modal>
    </div>
  );
};

export default App;
