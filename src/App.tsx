import React, { useEffect, useState } from 'react';
import { Spot, ItineraryDay } from './types';
import MapComponent from './components/MapComponent';
import Timeline from './components/Timeline';
import SpotDetail from './components/SpotDetail';
import { Map as MapIcon, List, Info, CreditCard, Plane, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [activeDayIndex, setActiveDayIndex] = useState(1);
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);
  const [centerTrigger, setCenterTrigger] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'timeline'>('timeline'); // For mobile

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itineraryRes, spotsRes] = await Promise.all([
          fetch('/api/itinerary'),
          fetch('/api/spots')
        ]);
        const itineraryData = await itineraryRes.json();
        const spotsData = await spotsRes.json();
        setItinerary(itineraryData);
        setSpots(spotsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeDay = itinerary.find(d => d.day_index === activeDayIndex);
  const activeSpot = spots.find(s => s.id === activeSpotId) || null;
  const daySpots = activeDay ? activeDay.spot_ids.map(id => spots.find(s => s.id === id)).filter(Boolean) as Spot[] : [];

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 font-medium animate-pulse">상하이 여행 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const handleTimelineSpotClick = (id: string) => {
    setActiveSpotId(id);
    // On mobile, switch to map view when a spot is clicked to show its location
    if (window.innerWidth < 768) {
      setViewMode('map');
      setShowDetail(false); // Hide detail on mobile so user can see map move
    } else {
      setShowDetail(true); // Show detail on desktop
    }
  };

  const handleMapSpotClick = (id: string) => {
    setActiveSpotId(id);
    setShowDetail(true);
  };

  const handleNavigate = (id: string) => {
    setActiveSpotId(id);
    setCenterTrigger(prev => prev + 1);
    if (window.innerWidth < 768) {
      setViewMode('map');
      setShowDetail(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-50 overflow-hidden font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 sm:px-6 z-50 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Plane className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-zinc-900 leading-none">상하이 2박 3일</h1>
            <p className="text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Shanghai Travel Guide</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
          {[1, 2, 3].map(day => (
            <button
              key={day}
              onClick={() => {
                setActiveDayIndex(day);
                setActiveSpotId(null);
                setShowDetail(false);
              }}
              className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeDayIndex === day 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Day {day}
            </button>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
            <CreditCard className="w-5 h-5" />
          </button>
          <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex relative overflow-hidden">
        {/* Map Area - Always present in background for mobile, side-by-side for desktop */}
        <div className="absolute inset-0 md:relative md:flex-1 bg-zinc-100">
          <MapComponent 
            spots={spots} 
            activeSpotId={activeSpotId} 
            onSpotClick={handleMapSpotClick}
            daySpots={daySpots}
            centerTrigger={centerTrigger}
          />
        </div>

        {/* Sidebar / Timeline - Overlay for mobile, fixed sidebar for desktop */}
        <div className={`
          fixed inset-0 top-16 md:relative md:top-0
          w-full md:w-[400px] lg:w-[450px] 
          bg-white border-r border-zinc-200 
          overflow-y-auto z-40 
          transition-all duration-500 ease-in-out
          ${viewMode === 'map' ? 'translate-y-full md:translate-y-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'translate-y-0 opacity-100'}
        `}>
          {activeDay && (
            <Timeline 
              day={activeDay} 
              spots={spots} 
              activeSpotId={activeSpotId} 
              onSpotClick={handleTimelineSpotClick} 
            />
          )}
          
          {/* Quick Tips Section */}
          <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 pb-32 md:pb-6">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              여행 필수 팁
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 bg-white rounded-xl border border-zinc-200 shadow-sm">
                <p className="text-xs font-bold text-zinc-900 mb-1">알리페이 결제 팁</p>
                <p className="text-[11px] text-zinc-500 leading-relaxed">200위안 이상 결제 시 수수료가 발생하므로, 큰 금액은 나눠서 결제하거나 트래블로그 등을 활용하세요.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-zinc-200 shadow-sm">
                <p className="text-xs font-bold text-zinc-900 mb-1">지도 앱 추천</p>
                <p className="text-[11px] text-zinc-500 leading-relaxed">구글 지도보다는 고덕지도(Amap)나 바이두 지도를 사용하는 것이 훨씬 정확합니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Toggle View - Floating Bottom Nav */}
        <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 flex bg-white/90 backdrop-blur-2xl rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 p-1.5 z-[1000] ring-1 ring-black/5">
          <button 
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              viewMode === 'timeline' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-zinc-500'
            }`}
          >
            <List className="w-4 h-4" />
            일정
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              viewMode === 'map' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-zinc-500'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            지도
          </button>
        </div>

        {/* Spot Detail Drawer */}
        <SpotDetail 
          spot={showDetail ? activeSpot : null} 
          onClose={() => setShowDetail(false)} 
          onNavigate={handleNavigate}
        />
      </main>
    </div>
  );
}
