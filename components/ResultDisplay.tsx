import React from 'react';
import { AppState } from '../types';

interface ResultDisplayProps {
  status: AppState;
  resultImage: string | null;
  errorMessage: string | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">증명사진을 생성 중입니다...</p>
    <p className="text-sm text-gray-500">잠시만 기다려주세요.</p>
  </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full bg-red-50 p-4 rounded-lg">
    <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p className="mt-4 font-semibold text-red-700">오류가 발생했습니다</p>
    <p className="mt-2 text-sm text-red-600 text-center">{message}</p>
  </div>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ status, resultImage, errorMessage }) => {
  return (
    <div className="w-full bg-gray-100 rounded-lg min-h-[30rem] flex items-center justify-center p-4">
      {status === AppState.IDLE && (
        <div className="text-center text-gray-500">
          <p>생성된 사진이 여기에 표시됩니다.</p>
        </div>
      )}
      {status === AppState.LOADING && <LoadingSpinner />}
      {status === AppState.ERROR && <ErrorDisplay message={errorMessage || '알 수 없는 오류가 발생했습니다.'} />}
      {status === AppState.SUCCESS && resultImage && (
        <div className="text-center">
            <img src={resultImage} alt="Generated ID Photo" className="max-h-[28rem] rounded-lg shadow-lg" />
            <a 
              href={resultImage} 
              download="id-photo.png"
              className="mt-4 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              사진 다운로드
            </a>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;