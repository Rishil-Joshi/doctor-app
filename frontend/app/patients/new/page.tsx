'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPatientPage() {
  const router = useRouter();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleCamera = () => cameraInputRef.current?.click();
  const handleGallery = () => galleryInputRef.current?.click();
  const handleDetails = () => router.push('/patients/new/details');

  return (
    <div className="min-h-screen bg-pastel-bg flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-xl w-full">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-6 sm:mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-700 text-xs font-bold uppercase tracking-widest"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
          BACK
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 uppercase tracking-wider mb-2">ADD NEW PATIENT</h1>
        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-8 sm:mb-10">CHOOSE HOW TO START</p>

        <div className="space-y-4 sm:space-y-5">

          {/* Open Camera */}
          <button
            onClick={handleCamera}
            className="w-full flex items-center gap-4 sm:gap-6 p-5 sm:p-7 bg-white rounded-2xl border-2 border-pastel-blue/20 hover:border-pastel-mint-dark/60 hover:bg-pastel-mint/10 transition-all text-left"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-pastel-mint/30 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 sm:w-8 sm:h-8 text-pastel-mint-dark" aria-hidden="true">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-800 uppercase tracking-wider">OPEN CAMERA</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 uppercase tracking-wide">CAPTURE IMAGE, ADD DETAILS LATER</p>
            </div>
          </button>

          {/* Add from Gallery */}
          <button
            onClick={handleGallery}
            className="w-full flex items-center gap-4 sm:gap-6 p-5 sm:p-7 bg-white rounded-2xl border-2 border-pastel-blue/20 hover:border-pastel-blue-dark/60 hover:bg-pastel-blue/10 transition-all text-left"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-pastel-blue/30 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 sm:w-8 sm:h-8 text-pastel-blue-dark" aria-hidden="true">
                <path d="M16 5h6" /><path d="M19 2v6" />
                <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                <circle cx="9" cy="9" r="2" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-800 uppercase tracking-wider">ADD FROM GALLERY</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 uppercase tracking-wide">UPLOAD IMAGES, ADD DETAILS LATER</p>
            </div>
          </button>

          {/* Enter Details First */}
          <button
            onClick={handleDetails}
            className="w-full flex items-center gap-4 sm:gap-6 p-5 sm:p-7 bg-white rounded-2xl border-2 border-pastel-blue/20 hover:border-pastel-lavender/60 hover:bg-pastel-lavender/10 transition-all text-left"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-pastel-lavender/30 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600" aria-hidden="true">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-800 uppercase tracking-wider">ENTER DETAILS FIRST</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 uppercase tracking-wide">FILL IN PATIENT INFORMATION</p>
            </div>
          </button>
        </div>

        {/* Hidden file inputs */}
        <input ref={cameraInputRef} accept="image/*" capture="environment" className="hidden" type="file" />
        <input ref={galleryInputRef} accept="image/*" multiple className="hidden" type="file" />
      </div>
    </div>
  );
}
