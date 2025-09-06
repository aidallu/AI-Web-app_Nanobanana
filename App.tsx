
import React, { useState, useMemo } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import { generateIdPhoto } from './services/geminiService';
import { AppState } from './types';
import type { IdFormatOption, BackgroundColorOption, OutfitOption, HairstyleOption } from './types';
import { ID_FORMATS, BACKGROUND_COLORS, OUTFITS, HAIRSTYLES } from './constants';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Input states
  const [portraitFile, setPortraitFile] = useState<File | null>(null);
  const [customOutfitFile, setCustomOutfitFile] = useState<File | null>(null);
  const [idFormat, setIdFormat] = useState<string>(ID_FORMATS[0].id);
  const [backgroundColor, setBackgroundColor] = useState<string>(BACKGROUND_COLORS[0].id);
  const [outfit, setOutfit] = useState<string | null>(null);
  const [hairstyle, setHairstyle] = useState<string | null>(null);
  const [hairGender, setHairGender] = useState<'male' | 'female'>('male');

  const portraitPreview = useMemo(() => portraitFile ? URL.createObjectURL(portraitFile) : null, [portraitFile]);
  const customOutfitPreview = useMemo(() => customOutfitFile ? URL.createObjectURL(customOutfitFile) : null, [customOutfitFile]);

  const handleGenerate = async () => {
    if (!portraitFile) {
      setErrorMessage("먼저 인물 사진을 업로드해주세요.");
      setStatus(AppState.ERROR);
      return;
    }

    setStatus(AppState.LOADING);
    setResultImage(null);
    setErrorMessage(null);

    try {
      const generatedImage = await generateIdPhoto({
        portraitImage: portraitFile,
        idFormat: idFormat,
        backgroundColor: backgroundColor,
        outfitPreset: outfit,
        customOutfitImage: customOutfitFile,
        hairstyle: hairstyle,
      });
      setResultImage(generatedImage);
      setStatus(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
      setErrorMessage(`생성 실패: ${message}`);
      setStatus(AppState.ERROR);
    }
  };

  const isGenerating = status === AppState.LOADING;

  const currentHairstyles = hairGender === 'male' ? HAIRSTYLES.male : HAIRSTYLES.female;

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">AI 증명사진 만들기</h1>
          <p className="mt-2 text-lg text-gray-600">사진을 업로드하고 옵션을 선택하여 전문적인 증명사진을 만들어 보세요.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-8">
            {/* Step 1: Upload Portrait */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">1. 인물 사진 업로드</h2>
              <ImageUploader 
                id="portrait-uploader"
                label="메인 사진"
                onFileSelect={setPortraitFile}
                previewUrl={portraitPreview}
              />
            </section>
            
            {/* Step 2: Configure Options */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">2. 옵션 설정</h2>
              <div className="space-y-6">
                {/* ID Format */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">ID 규격</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {ID_FORMATS.map((format: IdFormatOption) => (
                      <button
                        key={format.id}
                        onClick={() => setIdFormat(format.id)}
                        disabled={isGenerating}
                        className={`p-3 text-center rounded-md text-sm font-medium transition-all ${idFormat === format.id ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        {format.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Color */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">배경색</h3>
                  <div className="flex space-x-3">
                    {BACKGROUND_COLORS.map((color: BackgroundColorOption) => (
                      <button
                        key={color.id}
                        onClick={() => setBackgroundColor(color.id)}
                        disabled={isGenerating}
                        className={`w-12 h-12 rounded-full border-2 transition-transform transform hover:scale-110 ${backgroundColor === color.id ? 'ring-4 ring-offset-2 ring-blue-500' : 'ring-gray-300'}`}
                        style={{ backgroundColor: color.colorHex }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Hairstyle */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">헤어스타일</h3>
                    <div className="flex border-b border-gray-200 mb-3">
                        <button onClick={() => setHairGender('male')} disabled={isGenerating} className={`-mb-px py-2 px-4 text-sm font-medium border-b-2 ${hairGender === 'male' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>남자</button>
                        <button onClick={() => setHairGender('female')} disabled={isGenerating} className={`-mb-px py-2 px-4 text-sm font-medium border-b-2 ${hairGender === 'female' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>여자</button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                        {currentHairstyles.map((style: HairstyleOption) => (
                            <button key={style.id} onClick={() => setHairstyle(style.id)} disabled={isGenerating} className={`p-2 text-center rounded-md text-sm font-medium transition-all ${hairstyle === style.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                {style.label}
                            </button>
                        ))}
                    </div>
                     <button onClick={() => setHairstyle(null)} disabled={isGenerating} className={`w-full p-2 text-center rounded-md text-sm font-medium transition-all ${hairstyle === null ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                        원본 헤어스타일 사용
                    </button>
                </div>

                {/* Outfit */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">의상</h3>
                   <div className="grid grid-cols-2 gap-3 mb-4">
                    {OUTFITS.map((opt: OutfitOption) => (
                      <button
                        key={opt.id}
                        onClick={() => { setOutfit(opt.id); setCustomOutfitFile(null); }}
                        disabled={isGenerating}
                        className={`p-2 rounded-lg border-2 transition-all flex items-center space-x-2 ${outfit === opt.id ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300 hover:border-blue-400'}`}
                      >
                        <img src={opt.imageUrl} alt={opt.label} className="w-10 h-10 rounded-md object-cover"/>
                        <span className="text-sm text-gray-800">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setOutfit(null)} disabled={isGenerating} className={`w-full p-2 text-center rounded-md text-sm font-medium transition-all ${outfit === null ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    원본 의상 사용
                  </button>
                </div>
                
                 {/* Custom Outfit */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">커스텀 의상 (선택)</h3>
                    <ImageUploader 
                        id="custom-outfit-uploader"
                        label="사용할 커스텀 의상 업로드"
                        onFileSelect={(file) => { setCustomOutfitFile(file); if(file) setOutfit(null); }}
                        previewUrl={customOutfitPreview}
                    />
                </div>
              </div>
            </section>

            {/* Step 3: Generate */}
            <section>
              <button
                onClick={handleGenerate}
                disabled={!portraitFile || isGenerating}
                className="w-full bg-green-600 text-white font-bold text-lg py-4 px-6 rounded-lg hover:bg-green-700 transition-all shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>생성 중...</span>
                  </>
                ) : (
                  <span>사진 생성</span>
                )}
              </button>
            </section>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">3. 결과</h2>
            <ResultDisplay status={status} resultImage={resultImage} errorMessage={errorMessage} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
