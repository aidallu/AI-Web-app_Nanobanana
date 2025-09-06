
import type { IdFormatOption, BackgroundColorOption, OutfitOption, HairstyleOption } from './types';

export const ID_FORMATS: IdFormatOption[] = [
  { id: 'US Passport', label: '미국 여권' },
  { id: 'Schengen Visa', label: '유럽 비자' },
  { id: 'Korean Driver\'s License', label: '한국 운전면허' },
  { id: 'International ID', label: '국제 신분증' },
];

export const BACKGROUND_COLORS: BackgroundColorOption[] = [
  { id: 'White', label: '흰색', colorHex: '#FFFFFF' },
  { id: 'Light Grey', label: '밝은 회색', colorHex: '#E5E7EB' },
  { id: 'Light Blue', label: '밝은 파란색', colorHex: '#DBEAFE' },
];

export const OUTFITS: OutfitOption[] = [
  { id: 'Dark Suit & Tie', label: '어두운 정장 & 넥타이', imageUrl: 'https://picsum.photos/seed/suit1/100' },
  { id: 'Dark Suit No Tie', label: '어두운 정장', imageUrl: 'https://picsum.photos/seed/suit2/100' },
  { id: 'Light Blouse', label: '밝은 블라우스', imageUrl: 'https://picsum.photos/seed/blouse1/100' },
  { id: 'Dark Blouse', label: '어두운 블라우스', imageUrl: 'https://picsum.photos/seed/blouse2/100' },
];

export const HAIRSTYLES: { male: HairstyleOption[], female: HairstyleOption[] } = {
  male: [
    { id: 'Bald', label: '대머리' },
    { id: 'Curly Hair', label: '곱슬머리' },
    { id: 'Natural Perm', label: '자연스러운 펌' },
    { id: 'Sleek Pomade', label: '깔끔한 포마드' },
    { id: 'Neat Two-Block', label: '단정한 투블럭' },
  ],
  female: [
    { id: 'Neat Bob', label: '단정한 단발' },
    { id: 'Natural Wave', label: '자연스러운 웨이브' },
    { id: 'Sleek Updo', label: '깔끔한 올림머리' },
    { id: 'Straight Hair', label: '긴 생머리' },
    { id: 'Short Cut', label: '숏컷' },
  ],
};
