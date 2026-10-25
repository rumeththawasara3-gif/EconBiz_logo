/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Camera,
  Download,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  Move,
  FileCode,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Smartphone,
  Square
} from 'lucide-react';
import { ECONBIZ_LOGO_DATA_URI } from './logoDataUri';

export default function App() {
  // Image & Canvas state
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageFileName, setImageFileName] = useState<string>('EconBiz-Story');
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number }>({ width: 1080, height: 1920 });

  // Overlay Configuration - Defaults strictly match prompt requirements
  // Pinned horizontally centered in upper section with 8-10% top padding (default 9%)
  const [posYPercent, setPosYPercent] = useState<number>(9); // 8-10% from top
  const [posXPercent, setPosXPercent] = useState<number>(50); // Horizontally centered
  const [logoScale, setLogoScale] = useState<number>(36); // ~36% of image width
  const [logoMode, setLogoMode] = useState<'vector' | 'image'>('vector'); // Vector 2D context text or official asset
  const [shadowBlurPercent, setShadowBlurPercent] = useState<number>(1.6); // Soft drop shadow
  const [enableSoftScrim, setEnableSoftScrim] = useState<boolean>(true); // Subtle gradient for bright photos
  const [showAdvancedControls, setShowAdvancedControls] = useState<boolean>(false);

  // Status & Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const officialLogoImgRef = useRef<HTMLImageElement | null>(null);

  // Dragging interaction state
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; initX: number; initY: number }>({
    clientX: 0,
    clientY: 0,
    initX: 50,
    initY: 9,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Preload the official logo image
  useEffect(() => {
    const img = new Image();
    img.src = ECONBIZ_LOGO_DATA_URI;
    img.onload = () => {
      officialLogoImgRef.current = img;
      if (baseImageRef.current) {
        renderCanvas();
      }
    };
  }, []);

  // Load initial demo story image on mount so users immediately see live preview
  useEffect(() => {
    loadDemoPhoto('campus');
  }, []);

  // Demo photo generator (high resolution 1080x1920)
  const loadDemoPhoto = (preset: 'campus' | 'summit' | 'portrait') => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 1080;
    tempCanvas.height = 1920;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    if (preset === 'campus') {
      // Modern student story photo background
      const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
      grad.addColorStop(0, '#111827');
      grad.addColorStop(0.35, '#1e293b');
      grad.addColorStop(0.7, '#0f172a');
      grad.addColorStop(1, '#090d16');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Subtle atmospheric lighting
      const glow = ctx.createRadialGradient(540, 500, 80, 540, 500, 700);
      glow.addColorStop(0, 'rgba(0, 128, 255, 0.25)');
      glow.addColorStop(0.5, 'rgba(0, 128, 255, 0.05)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 1080, 1920);

      // Story Card Graphic Mockup
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = 'rgba(0, 128, 255, 0.35)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(100, 680, 880, 640, [28]);
      ctx.fill();
      ctx.stroke();

      // Text elements
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 48px "Montserrat", sans-serif';
      ctx.fillText('ECONOMICS & BUSINESS', 160, 820);

      ctx.fillStyle = '#0080FF';
      ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Student Chapter · 2026 Summit', 160, 880);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '400 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Market Analysis & Leadership Bootcamp', 160, 960);
      ctx.fillText('Colombo, Sri Lanka', 160, 1020);

      // Badge pill
      ctx.fillStyle = '#0080FF';
      ctx.beginPath();
      ctx.roundRect(160, 1140, 260, 64, [32]);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('LIVE STORY', 215, 1180);
    } else if (preset === 'summit') {
      // Sleek Dark Theme
      const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
      grad.addColorStop(0, '#0a0d14');
      grad.addColorStop(0.5, '#131b2c');
      grad.addColorStop(1, '#06080d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Grid mesh
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 1080; x += 90) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1920);
        ctx.stroke();
      }
      for (let y = 0; y < 1920; y += 90) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1080, y);
        ctx.stroke();
      }
    } else {
      // Warm Light Background to test readability on bright photos
      const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
      grad.addColorStop(0, '#e2e8f0');
      grad.addColorStop(0.5, '#cbd5e1');
      grad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);
    }

    const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);
    applyImageFromDataUrl(dataUrl, `EconBiz-${preset}`);
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)');
      return;
    }
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    setImageFileName(`EconBiz-${cleanName}`);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        applyImageFromDataUrl(e.target.result, `EconBiz-${cleanName}`);
        showToast('Photo uploaded! EconBiz overlay applied.');
      }
    };
    reader.readAsDataURL(file);
  };

  const applyImageFromDataUrl = (url: string, name: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      baseImageRef.current = img;
      setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setImageFileName(name);
      setImageLoaded(true);
      renderCanvas();
    };
  };

  // HTML5 Canvas 2D Rendering
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const baseImg = baseImageRef.current;
    if (!canvas || !baseImg) return;

    const targetWidth = baseImg.naturalWidth || 1080;
    const targetHeight = baseImg.naturalHeight || 1920;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, targetWidth, targetHeight);

    // 1. Draw base photo at full original resolution
    ctx.drawImage(baseImg, 0, 0, targetWidth, targetHeight);

    // 2. Draw subtle soft protective scrim gradient at the top if enabled
    // This guarantees perfect contrast and legibility on both pure white and colored photos
    if (enableSoftScrim && posYPercent < 30) {
      const scrimHeight = targetHeight * 0.28;
      const scrimGrad = ctx.createLinearGradient(0, 0, 0, scrimHeight);
      scrimGrad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
      scrimGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.22)');
      scrimGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = scrimGrad;
      ctx.fillRect(0, 0, targetWidth, scrimHeight);
    }

    // 3. Render the EconBiz Logo Overlay
    ctx.save();

    // Coordinates: pinned horizontally centered, ~8-10% from the top
    const centerX = (posXPercent / 100) * targetWidth;
    const centerY = (posYPercent / 100) * targetHeight;

    // Scale calculation: logo size scales proportionally with the image width
    const targetLogoWidth = (logoScale / 100) * targetWidth;

    // Soft drop shadow configuration
    if (shadowBlurPercent > 0) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = targetWidth * (shadowBlurPercent / 100);
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = targetWidth * (shadowBlurPercent / 100) * 0.35;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    if (logoMode === 'image' && officialLogoImgRef.current && officialLogoImgRef.current.complete) {
      // Official transparent PNG rendering
      const logoImg = officialLogoImgRef.current;
      const logoAspect = logoImg.naturalWidth / (logoImg.naturalHeight || 1);
      const targetLogoHeight = targetLogoWidth / logoAspect;

      ctx.drawImage(
        logoImg,
        centerX - targetLogoWidth / 2,
        centerY - targetLogoHeight / 2,
        targetLogoWidth,
        targetLogoHeight
      );
    } else {
      // Vector 2D Context Typography Recreation:
      // Font: Bold, heavy sans-serif (Montserrat 900, Arial Black, Impact)
      // "Econ" in solid crisp white (#FFFFFF)
      // Letter "B" in vibrant blue (#0080FF)
      // "iz" in solid crisp white (#FFFFFF)
      const fontSize = targetLogoWidth * 0.30;
      ctx.font = `900 ${fontSize}px "Montserrat", "Arial Black", "Plus Jakarta Sans", -apple-system, sans-serif`;
      ctx.textBaseline = 'middle';

      const part1 = 'Econ';
      const part2 = 'B';
      const part3 = 'iz';

      const w1 = ctx.measureText(part1).width;
      const w2 = ctx.measureText(part2).width;
      const w3 = ctx.measureText(part3).width;
      const totalWidth = w1 + w2 + w3;

      let drawX = centerX - totalWidth / 2;

      // Draw "Econ" in #FFFFFF
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(part1, drawX, centerY);
      drawX += w1;

      // Draw "B" in #0080FF
      ctx.fillStyle = '#0080FF';
      ctx.fillText(part2, drawX, centerY);
      drawX += w2;

      // Draw "iz" in #FFFFFF
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(part3, drawX, centerY);
    }

    ctx.restore();
  }, [
    posXPercent,
    posYPercent,
    logoScale,
    logoMode,
    shadowBlurPercent,
    enableSoftScrim,
  ]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Touch and Mouse pointer drag on preview canvas to reposition logo easily
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    isDraggingRef.current = true;
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initX: posXPercent,
      initY: posYPercent,
    };
    canvas.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStartRef.current.clientX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStartRef.current.clientY) / rect.height) * 100;

    const newX = Math.max(5, Math.min(95, dragStartRef.current.initX + deltaX));
    const newY = Math.max(4, Math.min(96, dragStartRef.current.initY + deltaY));

    setPosXPercent(Math.round(newX * 10) / 10);
    setPosYPercent(Math.round(newY * 10) / 10);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // ignore pointer release error
      }
    }
  };

  // High-Resolution Instant Download
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDownloading(true);
    try {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `${imageFileName || 'EconBiz-Story'}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Downloaded full high-resolution branded photo!');
    } catch {
      showToast('Download error. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Mobile Web Share API (shares directly to Instagram / Camera roll on mobile phones)
  const handleShareMobile = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `${imageFileName || 'EconBiz-Story'}.png`, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'EconBiz Story Photo',
            text: 'Created with EconBiz Watermark Studio',
            files: [file],
          });
          showToast('Shared successfully!');
        } else {
          // Fallback to copy or direct download
          handleDownload();
        }
      }, 'image/png');
    } catch {
      handleDownload();
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setIsCopied(true);
          showToast('Copied photo to clipboard!');
          setTimeout(() => setIsCopied(false), 2400);
        } catch {
          showToast('Clipboard access restricted in browser. Use Download instead.');
        }
      }, 'image/png');
    } catch {
      showToast('Clipboard unsupported in this browser.');
    }
  };

  // Reset to default story template position
  const resetToDefaultStoryPosition = () => {
    setPosYPercent(9); // standard 9% top center
    setPosXPercent(50);
    setLogoScale(36);
    setShadowBlurPercent(1.6);
    setEnableSoftScrim(true);
    setLogoMode('vector');
    showToast('Reset to default Story Top-Center template (9%)');
  };

  // Download standalone single HTML file
  const downloadStandaloneHTML = () => {
    const link = document.createElement('a');
    link.href = '/standalone.html';
    link.download = 'econbiz-single-file-app.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded single-file offline HTML app!');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col font-sans selection:bg-[#0080FF] selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#161d27]/95 backdrop-blur-md border border-[#0080FF]/50 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl shadow-black/80 flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-[#0080FF]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header: Branded "EconBiz" with "Econ" in bold white, "B" in blue #0080FF, "iz" in white */}
      <header className="sticky top-0 z-30 bg-[#0d1117]/95 backdrop-blur-md border-b border-[#1c232d] px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white select-none">
            Econ<span className="text-[#0080FF]">B</span>iz
          </h1>
          <span className="hidden xs:inline-flex text-[11px] font-bold text-slate-400 bg-[#161c24] border border-[#232c38] px-2 py-0.5 rounded-md">
            Story Overlay
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadStandaloneHTML}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#161c24] hover:bg-[#1e2733] text-slate-300 border border-[#242d3a] transition-all"
            title="Download pure single-file offline HTML version"
          >
            <FileCode className="w-3.5 h-3.5 text-[#0080FF]" />
            <span>Single-File HTML</span>
          </button>

          <button
            onClick={resetToDefaultStoryPosition}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#161c24] hover:bg-[#1e2733] text-slate-400 hover:text-slate-200 border border-[#242d3a] flex items-center gap-1 transition-all"
            title="Reset position to default (Top 9%)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* Main Container: Mobile-First Single-Column Flow
          Header -> Upload Area -> Live Preview Canvas -> Download Button -> Footer */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-5 flex flex-col gap-5">
        
        {/* Hidden File Inputs for Gallery and Mobile Camera */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        {/* 2. Upload Area: Mobile-First, Touch-Friendly */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
          onDragLeave={() => setIsDraggingFile(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingFile(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`bg-[#12161f] border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center transition-all ${
            isDraggingFile ? 'border-[#0080FF] bg-[#0080FF]/10' : 'border-[#222c3b] hover:border-[#0080FF]/60'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-full bg-[#18202d] border border-[#283548] flex items-center justify-center text-[#0080FF]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Upload Your Photo</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Take a selfie, capture a photo, or choose from gallery
              </p>
            </div>

            {/* Mobile Action Buttons: Camera + Gallery */}
            <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm mt-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#18212e] hover:bg-[#202c3e] border border-[#2b384c] text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-all active:scale-[0.98]"
              >
                <Camera className="w-4 h-4 text-[#0080FF]" />
                <span>Take Photo</span>
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0080FF]/15 hover:bg-[#0080FF]/25 border border-[#0080FF]/40 text-white text-xs sm:text-sm font-semibold transition-all active:scale-[0.98]"
              >
                <Upload className="w-4 h-4 text-[#0080FF]" />
                <span>Photo Gallery</span>
              </button>
            </div>

            {/* Quick Demo Samples */}
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400 flex-wrap justify-center">
              <span>Or test with:</span>
              <button
                type="button"
                onClick={() => loadDemoPhoto('campus')}
                className="px-2 py-0.5 rounded bg-[#171e28] text-slate-300 hover:text-white border border-[#252f3e]"
              >
                Story 9:16
              </button>
              <button
                type="button"
                onClick={() => loadDemoPhoto('summit')}
                className="px-2 py-0.5 rounded bg-[#171e28] text-slate-300 hover:text-white border border-[#252f3e]"
              >
                Dark Theme
              </button>
              <button
                type="button"
                onClick={() => loadDemoPhoto('portrait')}
                className="px-2 py-0.5 rounded bg-[#171e28] text-slate-300 hover:text-white border border-[#252f3e]"
              >
                Bright Photo
              </button>
            </div>
          </div>
        </div>

        {/* 3. Live Preview Canvas */}
        <div className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-3 sm:p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0080FF]" />
              Live Story Preview
            </span>
            <span className="font-mono text-[11px] text-slate-400 tabular-nums">
              {canvasRef.current ? `${canvasRef.current.width} × ${canvasRef.current.height} px` : '1080 × 1920'}
            </span>
          </div>

          {/* Interactive Canvas Viewport */}
          <div className="relative min-h-[380px] sm:min-h-[460px] max-h-[64vh] bg-[#090b0e] border border-[#1b222c] rounded-xl flex items-center justify-center p-2 overflow-hidden">
            {/* Main Canvas */}
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl shadow-black/90 touch-none cursor-move select-none"
              title="Touch or drag anywhere on the canvas to adjust logo position"
            />

            {/* Visual Hint */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none bg-[#0e1218]/90 backdrop-blur-md border border-[#232b38] text-slate-300 text-[11px] font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md whitespace-nowrap">
              <Move className="w-3 h-3 text-[#0080FF]" />
              <span>Drag logo to adjust position</span>
            </div>
          </div>

          {/* Quick Position Bar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">Position:</span>
              <button
                type="button"
                onClick={() => setPosYPercent(9)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                  posYPercent === 9
                    ? 'bg-[#0080FF] border-[#0080FF] text-white shadow-sm'
                    : 'bg-[#18202c] border-[#252f3e] text-slate-300 hover:text-white'
                }`}
              >
                Top (9%)
              </button>
              <button
                type="button"
                onClick={() => setPosYPercent(50)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                  posYPercent === 50
                    ? 'bg-[#0080FF] border-[#0080FF] text-white shadow-sm'
                    : 'bg-[#18202c] border-[#252f3e] text-slate-300 hover:text-white'
                }`}
              >
                Center
              </button>
              <button
                type="button"
                onClick={() => setPosYPercent(90)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                  posYPercent === 90
                    ? 'bg-[#0080FF] border-[#0080FF] text-white shadow-sm'
                    : 'bg-[#18202c] border-[#252f3e] text-slate-300 hover:text-white'
                }`}
              >
                Bottom
              </button>
            </div>

            {/* Toggle optional fine-tune sliders */}
            <button
              type="button"
              onClick={() => setShowAdvancedControls(!showAdvancedControls)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1 py-1 px-2 rounded-lg bg-[#18202c] border border-[#252f3e] transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-[#0080FF]" />
              <span className="hidden xs:inline">Adjust</span>
              {showAdvancedControls ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expandable Subtle Adjustments Drawer */}
          {showAdvancedControls && (
            <div className="bg-[#0e1218] border border-[#1f2734] rounded-xl p-3.5 flex flex-col gap-3 mt-1 animate-in fade-in slide-in-from-top-2">
              {/* Logo Scale */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Logo Scale</span>
                  <span className="text-[#0080FF] font-mono">{logoScale}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="65"
                  value={logoScale}
                  onChange={(e) => setLogoScale(Number(e.target.value))}
                  className="w-full accent-[#0080FF] cursor-pointer"
                />
              </div>

              {/* Vertical Position Fine-tune */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Vertical Offset</span>
                  <span className="text-[#0080FF] font-mono">{Math.round(posYPercent)}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={posYPercent}
                  onChange={(e) => setPosYPercent(Number(e.target.value))}
                  className="w-full accent-[#0080FF] cursor-pointer"
                />
              </div>

              {/* Logo Mode & Scrim */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1c2430] text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Render:</span>
                  <button
                    type="button"
                    onClick={() => setLogoMode('vector')}
                    className={`px-2 py-1 rounded text-xs font-semibold ${logoMode === 'vector' ? 'bg-[#0080FF] text-white' : 'bg-[#18202c] text-slate-300'}`}
                  >
                    Vector Type
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoMode('image')}
                    className={`px-2 py-1 rounded text-xs font-semibold ${logoMode === 'image' ? 'bg-[#0080FF] text-white' : 'bg-[#18202c] text-slate-300'}`}
                  >
                    Official PNG
                  </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={enableSoftScrim}
                    onChange={(e) => setEnableSoftScrim(e.target.checked)}
                    className="accent-[#0080FF] rounded cursor-pointer"
                  />
                  <span>Soft Contrast Scrim</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* 4. Prominent Download Button & Mobile Actions */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full h-14 rounded-2xl bg-[#0080FF] hover:bg-[#0070e0] text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl shadow-[#0080FF]/30 hover:shadow-[#0080FF]/45 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>{isDownloading ? 'Processing...' : 'Download Branded Photo'}</span>
          </button>

          {/* Secondary Mobile Actions: Share & Copy */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleShareMobile}
              className="h-11 rounded-xl bg-[#161c26] hover:bg-[#1e2634] border border-[#242d3a] text-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Share2 className="w-4 h-4 text-[#0080FF]" />
              <span>Share to Story</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="h-11 rounded-xl bg-[#161c26] hover:bg-[#1e2634] border border-[#242d3a] text-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{isCopied ? 'Copied!' : 'Copy Photo'}</span>
            </button>
          </div>
        </div>

      </main>

      {/* 5. Footer: "Powered by Osanda Nimsara" */}
      <footer className="border-t border-[#1a212b] py-6 px-4 text-center mt-auto">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-1.5 text-xs text-slate-500">
          <div className="font-semibold text-slate-400 tracking-wide">
            Powered by Osanda Nimsara
          </div>
          <div className="text-[11px] text-slate-600">
            EconBiz Student Watermark & Brand Story Studio
          </div>
        </div>
      </footer>
    </div>
  );
}
