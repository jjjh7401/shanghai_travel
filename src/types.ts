export interface Spot {
  id: string;
  name_ko: string;
  name_zh: string;
  name_en: string;
  category: 'food' | 'cafe' | 'attraction' | 'shopping' | 'transport' | 'hotel' | 'etc';
  lat: number;
  lng: number;
  address: string;
  hours: string;
  price: string;
  tips: string;
  booking_type: 'wechat' | 'dianping' | 'officialSite' | 'phone' | 'walkin' | 'none';
  booking_info: string;
  image_url: string;
  tags: string;
  recommended_menu?: string;
}

export interface ItineraryDay {
  day_index: number;
  title: string;
  spot_ids: string[];
  route_notes: string;
}
