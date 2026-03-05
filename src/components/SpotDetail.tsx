import React from 'react';
import { Spot } from '../types';
import { X, ExternalLink, MessageSquare, CreditCard, Info, Map as MapIcon, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SpotDetailProps {
  spot: Spot | null;
  onClose: () => void;
}

const SpotDetail: React.FC<SpotDetailProps> = ({ spot, onClose }) => {
  if (!spot) return null;

  const getBookingIcon = (type: Spot['booking_type']) => {
    switch (type) {
      case 'wechat': return <MessageSquare className="w-4 h-4" />;
      case 'dianping': return <CreditCard className="w-4 h-4" />;
      case 'officialSite': return <ExternalLink className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getBookingLabel = (type: Spot['booking_type']) => {
    switch (type) {
      case 'wechat': return '위챗 예약/주문';
      case 'dianping': return '따종디엔핑 쿠폰';
      case 'officialSite': return '공식 홈페이지';
      case 'phone': return '전화 예약';
      case 'walkin': return '현장 대기';
      default: return '예약 정보 없음';
    }
  };

  const Utensils = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );

  return (
    <AnimatePresence>
      {spot && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ 
            y: 0,
            transition: { type: 'spring', damping: 25, stiffness: 200 }
          }}
          exit={{ y: '100%' }}
          className="fixed inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto w-full sm:w-[450px] h-[90vh] sm:h-full bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.15)] sm:shadow-2xl z-[3000] flex flex-col rounded-t-[32px] sm:rounded-none"
        >
          {/* Mobile Handle */}
          <div className="sm:hidden shrink-0 w-12 h-1.5 bg-zinc-200 rounded-full mx-auto my-4" />
          
          <div className="flex-1 overflow-y-auto">
            {/* Header Image */}
            <div className="relative h-72 sm:h-80 w-full">
              <img 
                src={spot.image_url} 
                alt={spot.name_ko} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Close Button - More prominent on mobile */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-xl rounded-full text-white border border-white/30 transition-all active:scale-95 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500 px-2.5 py-1 rounded-md shadow-lg shadow-emerald-500/20">
                    {spot.category}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">{spot.name_ko}</h1>
                <p className="text-lg opacity-80 font-mono mt-1">{spot.name_zh}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-10 pb-20">
            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-1">영업시간</p>
                <p className="text-sm font-medium text-zinc-900">{spot.hours}</p>
              </div>
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-1">예상 비용</p>
                <p className="text-sm font-medium text-zinc-900">{spot.price}</p>
              </div>
            </div>

            {/* Address */}
            <section>
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-emerald-500" />
                위치 정보
              </h3>
              <div className="p-4 bg-white border border-zinc-200 rounded-2xl">
                <p className="text-sm text-zinc-700 mb-4">{spot.address}</p>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-colors">
                    <Navigation className="w-4 h-4" />
                    길찾기 시작
                  </button>
                  <button className="px-4 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Booking / Action */}
            <section>
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                {getBookingIcon(spot.booking_type)}
                예약 및 주문 가이드
              </h3>
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded uppercase">
                    {getBookingLabel(spot.booking_type)}
                  </span>
                </div>
                <p className="text-sm text-emerald-900 leading-relaxed mb-4">
                  {spot.booking_info || '별도의 예약 정보가 등록되지 않았습니다.'}
                </p>
                {spot.booking_type !== 'none' && (
                  <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-emerald-200">
                    {getBookingLabel(spot.booking_type)} 바로가기
                  </button>
                )}
              </div>
            </section>

            {/* Recommended Menu */}
            {spot.recommended_menu && (
              <section>
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-rose-500" />
                  대표 추천 메뉴
                </h3>
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl">
                  <p className="text-sm text-rose-900 leading-relaxed font-medium">
                    {spot.recommended_menu}
                  </p>
                </div>
              </section>
            )}

            {/* Tips */}
            <section>
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-500" />
                꿀팁 & 주의사항
              </h3>
              <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl">
                <p className="text-sm text-amber-900 leading-relaxed italic">
                  "{spot.tips}"
                </p>
              </div>
            </section>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100">
              {spot.tags.split(',').map(tag => (
                <span key={tag} className="text-xs font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpotDetail;
