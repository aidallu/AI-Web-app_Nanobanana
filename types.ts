
export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface IdFormatOption {
  id: string;
  label: string;
}

export interface BackgroundColorOption {
  id: string;
  label: string;
  colorHex: string;
}

export interface OutfitOption {
  id: string;
  label: string;
  imageUrl: string;
}

export interface HairstyleOption {
  id: string;
  label: string;
}

export interface GenerateIdPhotoParams {
  portraitImage: File;
  idFormat: string;
  backgroundColor: string;
  outfitPreset: string | null;
  customOutfitImage: File | null;
  hairstyle: string | null;
}
