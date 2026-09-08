export type Language = 'km' | 'en';

export type TemplateStyle = 
  | 'traditional-gold' 
  | 'royal-blush' 
  | 'nature-green' 
  | 'modern-ivory' 
  | 'royal-violet' 
  | 'classic-burgundy';

export interface MusicTrack {
  id: string;
  titleKh: string;
  titleEn: string;
  category: string;
  audioUrl?: string;
  duration?: string;
  isPopular?: boolean;
}

export interface Template {
  id: string;
  code: string;
  nameKh: string;
  nameEn: string;
  style: TemplateStyle;
  badge?: string;
  coverImage: string;
  previewImage: string;
  primaryColor: string;
  accentColor: string;
  bgGradient: string;
  fontFamily: string;
  descriptionKh: string;
  descriptionEn: string;
  musicTrackTitle: string;
  usageCount: number;
  tags: string[];
  isPopular?: boolean;
}

export interface AgendaItem {
  id: string;
  time: string;
  titleKh: string;
  titleEn?: string;
  descKh?: string;
  descEn?: string;
  icon?: 'sun' | 'scissors' | 'ring' | 'utensils' | 'music' | 'heart' | 'clock' | 'sparkles';
  day?: number; // 1 = Day 1, 2 = Day 2
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  qrUrl: string;
  currency: 'USD' | 'KHR';
}

export interface GuestWish {
  id: string;
  guestName: string;
  guestTitle?: string;
  message: string;
  date: string;
  attendees: number;
  isAttending: boolean;
  side: 'groom' | 'bride' | 'mutual';
}

export interface Guest {
  id: string;
  code: string;
  titleKh: string; // e.g. ឯកឧត្តម, លោកជំទាវ, លោក, លោកស្រី, អ្នកនាង, កញ្ញា, លោកពូ, អ្នកមីង, មិត្តភក្តិ
  titleEn: string; // e.g. H.E., Lok Chumteav, Mr., Mrs., Ms., Brother, Sister
  fullNameKh: string;
  fullNameEn?: string;
  phone?: string;
  side: 'groom' | 'bride' | 'mutual';
  category: 'VIP' | 'Family' | 'Friend' | 'Colleague';
  paxExpected: number;
  tableNumber?: string;
  rsvpStatus: 'pending' | 'attending' | 'declined';
  attendeesCount?: number;
  wishMessage?: string;
  rsvpDate?: string;
  specialNote?: string;
}

export interface CoupleEvent {
  id: string;
  slug: string;
  manageUsername?: string;
  managePassword?: string;
  // Couple basic info
  groomNameKh: string;
  groomNameEn: string;
  brideNameKh: string;
  brideNameEn: string;
  groomNickKh?: string;
  brideNickKh?: string;
  
  // Parents info
  groomFatherKh: string;
  groomMotherKh: string;
  brideFatherKh: string;
  brideMotherKh: string;
  groomFatherEn?: string;
  groomMotherEn?: string;
  brideFatherEn?: string;
  brideMotherEn?: string;

  // Event Date & Time
  weddingDate: string; // YYYY-MM-DD
  weddingDateKh?: string;
  weddingTimeKh: string;
  weddingTimeEn: string;
  auspiciousTextKh?: string;

  // Venue & Location
  venueNameKh: string;
  venueNameEn: string;
  venueAddressKh: string;
  venueAddressEn: string;
  venueMapUrl: string;
  venueMapImage?: string; // Optional custom drawn map image
  mapEmbedUrl?: string;

  // Template & customization
  templateId: string;
  customTheme: {
    primaryColor: string;
    accentColor: string;
    enablePetals: boolean;
    enableMusic: boolean;
    musicTrack: string;
    musicUrl?: string;
    envelopeStyle: 'classic-gold' | 'royal-red' | 'blush-pink' | 'emerald' | 'royal-violet';
    fontFamilyKhmer?: 'battambang' | 'moul' | 'kantumruy';
    showSlideshowOnOpen?: boolean;
  };

  // Media
  coverPhoto: string;
  cardBackgroundImage?: string;
  secondaryPhoto?: string;
  galleryPhotos: string[];
  
  // Story & Quotes
  loveStoryKh?: string;
  loveStoryEn?: string;
  weddingQuoteKh?: string;

  // Agendas
  weddingProgramDay1TitleKh?: string;
  weddingProgramDay2TitleKh?: string;
  agendas: AgendaItem[];

  // Bank gifts
  bankAccounts: BankAccount[];

  // Guests & Wishes
  guests: Guest[];
  wishes: GuestWish[];

  // Metadata
  createdDate: string;
  status: 'active' | 'draft' | 'archived';
  packageType: 'VIP Gold' | 'Diamond Pro' | 'Standard';
  adminNotes?: string;

  // Admin Promotions / Info
  adminPromo?: {
    enabled: boolean;
    textKh: string;
    imageUrl?: string;
    linkUrl?: string;
  };

  // Contacts for guests
  contactFacebook?: string;
  contactTelegram?: string;
  contactPhone?: string;
}

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'couple';
  coupleId?: string;
  email: string;
  avatar?: string;
}
