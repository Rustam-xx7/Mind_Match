import React, { useEffect, useRef } from 'react';

/**
 * WinModal Component
 * Shows a celebratory overlay screen when the player completes the game.
 * Features an integrated, high-performance custom HTML5 Canvas confetti generator
 * and details about the final score, including high score notifications.
 *
 * @param {boolean} isOpen - If the modal should be visible
 * @param {number} moves - Total moves taken to win
 * @param {number} time - Total elapsed time in seconds
 * @param {boolean} isNewBestTime - True if player beat their best time
 * @param {boolean} isNewBestMoves - True if player beat their best moves
 * @param {function} onRestart - Callback to start a new game
 */
export default function WinModal({
  isOpen,
  moves,
  time,
  isNewBestTime,
  isNewBestMoves,
  onRestart
}) {
  const canvasRef = useRef(null);

  // Formats time in seconds to mm:ss layout
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Resizes the canvas to match the viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Vibrant confetti color palette
    const colors = [
      '#f43f5e', // rose
      '#ec4899', // pink
      '#d946ef', // fuchsia
      '#a855f7', // purple
      '#8b5cf6', // violet
      '#6366f1', // indigo
      '#3b82f6', // blue
      '#0ea5e9', // sky
      '#10b981', // emerald
      '#f59e0b', // amber
    ];
    const particles = [];
    const particleCount = 120;

    // Confetti particle class
    class Particle {
      constructor() {
        this.reset();
        // Distribute particles across the viewport height initially so it starts mid-fall
        this.y = Math.random() * -canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -40 - 20;
        this.size = Math.random() * 6 + 4;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedX = Math.random() * 2.5 - 1.25;
        this.speedY = Math.random() * 3 + 1.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 3 - 1.5;
        this.opacity = Math.random() * 0.4 + 0.6;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        // If particle falls off the bottom, reset it back to the top
        if (this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        // Draw confetti rectangle
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.6);
        ctx.restore();
      }
    }

    // Populate particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Canvas animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md">
      {/* Confetti canvas renders behind the modal card */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Glassmorphic Modal Box */}
      <div className="relative z-10 w-full max-w-md glass-panel rounded-[32px] p-6 sm:p-8 text-center shadow-2xl overflow-hidden animate-float">
        {/* Glowing background circles for visual depth */}
        <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-purple-500/10 blur-xl"></div>
        <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl"></div>

        {/* Trophy / Victory Emblem */}
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4 scale-110">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2H6c-1.1 0-2 .9-2 2v3c0 2.24 1.55 4.13 3.61 4.68C8.38 12.65 10.07 13 12 13s3.62-.35 4.39-1.32C18.45 11.13 20 9.24 20 7V4c0-1.1-.9-2-2-2zm-1 5c0 1.65-1.35 3-3 3h-4C8.35 10 7 8.65 7 7V4h10v3zM12 15c-2.76 0-5 2.24-5 5v2h10v-2c0-2.76-2.24-5-5-5z" />
          </svg>
        </div>

        {/* Celebratory Title */}
        <h2 className="font-display font-black text-2xl sm:text-3.5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 mb-2 leading-tight">
          Congratulations!
        </h2>
        <p className="text-gray-300 text-sm sm:text-base font-medium mb-6">
          You matched all pairs and conquered the board!
        </p>

        {/* Stats Table */}
        <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5 flex flex-col gap-3">
          {/* Final Time Row */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-400 font-medium">Final Time</span>
            <div className="flex items-center gap-2">
              {isNewBestTime && (
                <span className="px-2 py-0.5 text-[9px] font-bold bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30 animate-pulse">
                  NEW RECORD!
                </span>
              )}
              <span className="font-mono font-bold text-base sm:text-lg text-cyan-300">
                {formatTime(time)}
              </span>
            </div>
          </div>
          
          <div className="h-[1px] bg-white/5"></div>

          {/* Final Moves Row */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-400 font-medium">Total Moves</span>
            <div className="flex items-center gap-2">
              {isNewBestMoves && (
                <span className="px-2 py-0.5 text-[9px] font-bold bg-pink-500/20 text-pink-300 rounded-full border border-pink-500/30 animate-pulse">
                  NEW RECORD!
                </span>
              )}
              <span className="font-mono font-bold text-base sm:text-lg text-pink-300">
                {moves} moves
              </span>
            </div>
          </div>
        </div>

        {/* Play Again CTA Button */}
        <button
          onClick={onRestart}
          className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-500 hover:via-amber-600 hover:to-orange-600 active:scale-[0.98] text-slate-950 font-bold text-sm sm:text-base rounded-2xl transition-all duration-200 cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 touch-manipulation"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
          </svg>
          Play Again
        </button>
      </div>
    </div>
  );
}
