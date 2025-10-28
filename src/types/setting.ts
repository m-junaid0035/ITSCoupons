// types/setting.ts

export interface SettingInput {
  siteName: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  facebookUrl?: string;
  XUrl?: string;          // changed from twitterUrl to XUrl
  instagramUrl?: string;
  yahooUrl?: string;
  linkedinUrl?: string;   // changed from linkedinUrl to whatsappUrl
}

export interface SettingData {
  _id: string;
  siteName: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  facebookUrl?: string;
  XUrl?: string;           // changed from twitterUrl to XUrl
  instagramUrl?: string;
  linkedinUrl?: string;
  yahooUrl?: string;    // changed from linkedinUrl to whatsappUrl
  createdAt?: string | null;
  updatedAt?: string | null;
}

export type SettingListResponse = SettingData[];

export type SettingSingleResponse = SettingData | null;
