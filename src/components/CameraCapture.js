import React, { useRef, useState, useEffect } from "react";

export default function CameraCapture({ isOpen, onClose, onCapture, title = "Take Photo" }) {
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraError(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    let mounted = true;
    setCameraError(null);

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false
        });
        if (!mounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera error:", err);
        if (mounted) {
          setCameraError("Unable to access camera. Please check permissions or use Upload instead.");
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    stopCamera();
    onCapture(dataUrl);
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes cam-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cam-panel-in {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cam-overlay {
          position: fixed; inset: 0;
          background: rgba(30,22,19,0.72);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: cam-overlay-in 0.3s ease both;
          font-family: 'Playfair Display', serif;
        }
        .cam-panel {
          width: 100%;
          max-width: 480px;
          background: var(--paper, #fcfaf7);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(61,53,50,0.2);
          animation: cam-panel-in 0.5s cubic-bezier(0.16,1,0.3,1) both;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border, #e8e3df);
        }
        .cam-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border, #e8e3df);
          background: var(--paper-dark, #f5f0ec);
        }
        .cam-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 400;
          color: var(--espresso, #3d3532);
          letter-spacing: 0.5px;
        }
        .cam-close {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: var(--paper, #fcfaf7);
          border: 1px solid var(--border, #e8e3df);
          color: var(--muted, #a39b95);
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s cubic-bezier(0.4,0,0.2,1);
          font-family: 'Playfair Display', serif;
        }
        .cam-close:hover {
          background: var(--paper-mid, #f0ebe5);
          color: var(--espresso, #3d3532);
          transform: scale(1.08);
        }
        .cam-preview-wrap {
          position: relative;
          background: #1a1210;
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .cam-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .cam-error {
          color: rgba(252,250,247,0.9);
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          text-align: center;
          padding: 48px 32px;
          line-height: 1.7;
          font-weight: 300;
        }
        .cam-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          gap: 16px;
          background: var(--paper, #fcfaf7);
        }
        .cam-capture-btn {
          width: 68px; height: 68px;
          border-radius: 50%;
          background: var(--espresso, #3d3532);
          border: 3px solid var(--paper, #fcfaf7);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 4px 18px rgba(61,53,50,0.22);
        }
        .cam-capture-btn:hover {
          transform: scale(1.1);
          background: var(--espresso-light, #4b3d36);
          box-shadow: 0 6px 24px rgba(61,53,50,0.28);
        }
        .cam-capture-btn:active {
          transform: scale(0.95);
        }
        @media (max-width: 600px) {
          .cam-overlay {
            padding: 0 16px 20px;
            align-items: flex-end;
          }
          .cam-panel {
            max-width: 100%;
            border-radius: 24px;
          }
          .cam-capture-btn {
            width: 60px;
            height: 60px;
          }
          .cam-topbar {
            padding: 16px 20px;
          }
        }
      `}</style>
      <div className="cam-overlay" onClick={stopCamera}>
        <div className="cam-panel" onClick={e => e.stopPropagation()}>
          <div className="cam-topbar">
            <span className="cam-title">{title}</span>
            <button className="cam-close" onClick={stopCamera}>✕</button>
          </div>
          <div className="cam-preview-wrap">
            {cameraError ? (
              <div className="cam-error">{cameraError}</div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="cam-video" />
            )}
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
          {!cameraError && (
            <div className="cam-actions">
              <button className="cam-capture-btn" onClick={capturePhoto} title="Capture">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}