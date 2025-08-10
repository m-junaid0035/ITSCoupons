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
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
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
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export type SettingListResponse = SettingData[];

export type SettingSingleResponse = SettingData | null;
