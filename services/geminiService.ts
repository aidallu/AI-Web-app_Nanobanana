
import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateIdPhotoParams } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

const buildPrompt = (idFormat: string, backgroundColor: string, outfitPreset: string | null, hasCustomOutfit: boolean, hairstyle: string | null): string => {
  let outfitInstruction = "Keep the person's original clothing.";
  if (hasCustomOutfit) {
    outfitInstruction = "Take the second image provided (the custom outfit) and seamlessly composite it onto the person's body. Replace their original clothing below the neck. The final composition must be hyper-realistic, matching the lighting, shadows, and perspective of the original person.";
  } else if (outfitPreset) {
    outfitInstruction = `Generate a high-quality, professional '${outfitPreset}' and seamlessly composite it onto the person's body. Replace their original clothing below the neck. The final composition must be hyper-realistic, matching the lighting, shadows, and perspective of the original person.`;
  }

  let hairstyleInstruction = "Keep the person's original hairstyle.";
  if (hairstyle) {
    hairstyleInstruction = `Change the person's hairstyle to a realistic '${hairstyle}' style. The new hairstyle must look natural, fitting their head shape, face, and skin tone. It must be seamlessly blended.`;
  }
  
  return `
    You are an expert AI photo editor specializing in creating professional ID photos. Your task is to process the user's uploaded portrait image according to the specified options.

    **Instructions:**

    1.  **Isolate Subject:** Begin with the primary portrait image. Accurately isolate the person and completely remove the original background, resulting in a transparent background.

    2.  **Standardize Format:** Crop and resize the isolated person to meet the specifications of a '${idFormat}' photo. Ensure the head and shoulders are framed correctly according to standard ID photo guidelines for this format.
    
    3.  **Preserve Face:** It is CRITICAL that you do not alter the person's face, facial features, expression, or skin tone. These must remain identical to the original portrait.

    4.  **Apply Hairstyle:** ${hairstyleInstruction}

    5.  **Apply Outfit:** ${outfitInstruction}

    6.  **Apply Background:** Set the background to a solid '${backgroundColor}' color.

    7.  **Add Watermark:** Add a small, clean, white text watermark 'made by 달루' in the top-right corner of the final image. The font should be subtle and unobtrusive. Use a contrasting shadow or outline if needed for visibility against the background.

    8.  **Final Output:** Provide only the final, edited image as your output. Do not include any explanatory text.
  `;
};

export const generateIdPhoto = async ({
  portraitImage,
  idFormat,
  backgroundColor,
  outfitPreset,
  customOutfitImage,
  hairstyle,
}: GenerateIdPhotoParams): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const portraitPart = await fileToGenerativePart(portraitImage);
  const customOutfitPart = customOutfitImage ? await fileToGenerativePart(customOutfitImage) : null;
  const promptText = buildPrompt(idFormat, backgroundColor, outfitPreset, !!customOutfitImage, hairstyle);

  const parts: any[] = [portraitPart];
  if (customOutfitPart) {
    parts.push(customOutfitPart);
  }
  parts.push({ text: promptText });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts: parts,
    },
    config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      const mimeType = part.inlineData.mimeType;
      return `data:${mimeType};base64,${base64ImageBytes}`;
    }
  }

  // If no image is returned, throw an error.
  const errorText = response.text || "이미지 생성에 실패했습니다. 모델이 이미지 부분을 반환하지 않았습니다.";
  throw new Error(errorText);
};
