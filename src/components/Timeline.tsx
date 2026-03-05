import React from 'react';
import { Spot, ItineraryDay } from '../types';
import { MapPin, Clock, Utensils, Coffee, Camera, ShoppingBag, Bus, Hotel, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface TimelineProps {
  day: ItineraryDay;
  spots: Spot[];
  activeSpotId: string | null;
  onSpotClick: (id: string) => void;
}

const CategoryIcon = ({ category }: { category: Spot['category'] }) => {
  switch (category) {
    case 'food': return <Utensils className="w-4 h-4" />;
    case 'cafe': return <Coffee className="w-4 h-4" />;
    case 'attraction': return <Camera className="w-4 h-4" />;
    case 'shopping': return <ShoppingBag className="w-4 h-4" />;
    case 'transport': return <Bus className="w-4 h-4" />;
    case 'hotel': return <Hotel className="w-4 h-4" />;
    default: return <MapPin className="w-4 h-4" />;
  }
};

const Timeline: React.FC<TimelineProps> = ({ day, spots, activeSpotId, onSpotClick }) => {
  const daySpots = day.spot_ids.map(id => spots.find(s => s.id === id)).filter(Boolean) as Spot[];

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="mb-2 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-zinc-900 leading-tight">{day.title}</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 leading-relaxed">{day.route_notes}</p>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-zinc-100" />

        <div className="flex flex-col gap-4 sm:gap-6">
          {daySpots.map((spot, index) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSpotClick(spot.id)}
              className={`relative pl-10 cursor-pointer group`}
            >
              {/* Dot */}
              <div className={`absolute left-2.5 top-2 w-3.5 h-3.5 rounded-full border-2 bg-white z-10 transition-all duration-300
                ${activeSpotId === spot.id ? 'border-emerald-500 bg-emerald-500 scale-110' : 'border-zinc-200 group-hover:border-emerald-300'}`} 
              />

              <div className={`p-3 sm:p-4 rounded-2xl border transition-all duration-300
                ${activeSpotId === spot.id 
                  ? 'bg-emerald-50/50 border-emerald-200 shadow-sm ring-1 ring-emerald-100' 
                  : 'bg-white border-zinc-100 hover:border-zinc-200 shadow-sm'}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100/50 px-1.5 py-0.5 rounded">
                        {index + 1}
                      </span>
                      <div className="text-zinc-400">
                        <CategoryIcon category={spot.category} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{spot.category}</span>
                    </div>
                    <h3 className="font-bold text-zinc-900 text-sm sm:text-base truncate">{spot.name_ko}</h3>
                    <p className="text-[10px] text-zinc-400 font-mono truncate">{spot.name_zh}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 shrink-0 ${activeSpotId === spot.id ? 'rotate-90 text-emerald-500' : 'text-zinc-300'}`} />
                </div>

                {activeSpotId === spot.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 pt-3 border-t border-emerald-100 space-y-2"
                  >
                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{spot.hours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{spot.address}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {spot.tags.split(',').map(tag => (
                        <span key={tag} className="text-[10px] bg-white border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
