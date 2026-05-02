import { useEffect, useState } from 'react';
import { playerStore, type Track } from '../../lib/player-store';
import playlist from '../../data/playlist.json';

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Shared initial state — same on server and client to avoid hydration mismatch
const initialState = {
  track: (playlist as Track[])[0] || null,
  playing: false,
  progress: 0,
  currentTime: 0,
  duration: 0,
};

export default function NowPlaying() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(initialState);

  // Sync with store on client
  useEffect(() => {
    playerStore.setTracks(playlist as Track[]);
    setState(playerStore.getState());

    const unsub = playerStore.subscribe(() => {
      const s = playerStore.getState();
      setState({
        track: s.track,
        playing: s.playing,
        progress: s.progress,
        currentTime: s.currentTime,
        duration: s.duration,
      });
    });
    return unsub;
  }, []);

  // Persist open state
  useEffect(() => {
    const saved = sessionStorage.getItem('lucid-player-open');
    if (saved === 'true') setIsOpen(true);
  }, []);

  useEffect(() => {
    sessionStorage.setItem('lucid-player-open', String(isOpen));
  }, [isOpen]);

  const { track, playing, progress, currentTime, duration } = state;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded player */}
      {track && (
        <div
          className={`
            overflow-hidden transition-all duration-500 ease-out rounded-2xl
            bg-white/[0.06] backdrop-blur-xl border border-white/[0.1]
            shadow-[0_8px_32px_rgba(0,0,0,0.2)]
            ${isOpen
              ? 'w-72 opacity-100 translate-y-0 pointer-events-auto'
              : 'w-0 h-0 opacity-0 translate-y-4 pointer-events-none border-0'
            }
          `}
        >
          <div className="p-4 w-72">
            <div className="flex items-center gap-3">
              {/* Vinyl disc */}
              <button
                onClick={() => playerStore.toggle()}
                className="relative w-11 h-11 flex-shrink-0 group/disc"
                aria-label={playing ? 'Pause' : 'Play'}
              >
                <div className={`w-11 h-11 rounded-full bg-white/[0.12] border border-white/[0.15] flex items-center justify-center ${playing ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
                  <div className="w-4 h-4 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  </div>
                  <div className="absolute inset-1.5 rounded-full border border-white/[0.08]" />
                  <div className="absolute inset-3 rounded-full border border-white/[0.08]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/disc:opacity-100 transition-opacity">
                  {playing ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </div>
              </button>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] text-warm-400 font-mono uppercase tracking-wider">Now Playing</span>
                  {playing && (
                    <span className="flex gap-0.5 items-end h-2.5">
                      <span className="w-0.5 bg-white/60 rounded-full animate-[music-bar_0.6s_ease-in-out_infinite_alternate]" style={{ height: '6px', animationDelay: '0s' }} />
                      <span className="w-0.5 bg-white/60 rounded-full animate-[music-bar_0.6s_ease-in-out_infinite_alternate]" style={{ height: '10px', animationDelay: '0.2s' }} />
                      <span className="w-0.5 bg-white/60 rounded-full animate-[music-bar_0.6s_ease-in-out_infinite_alternate]" style={{ height: '4px', animationDelay: '0.4s' }} />
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-warm-200 truncate">{track.title}</p>
                <p className="text-[10px] text-warm-400 truncate">{track.artist}{track.album ? ` · ${track.album}` : ''}</p>

                {/* Progress bar */}
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[9px] text-warm-500 font-mono tabular-nums w-7 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <div
                    className="flex-1 h-1 bg-white/[0.08] rounded-full overflow-hidden cursor-pointer group/bar"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pct = ((e.clientX - rect.left) / rect.width) * 100;
                      playerStore.seek(pct);
                    }}
                  >
                    <div className="h-full bg-white/60 group-hover/bar:bg-white/80 rounded-full transition-all duration-150 relative" style={{ width: `${progress}%` }}>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-sm" />
                    </div>
                  </div>
                  <span className="text-[9px] text-warm-500 font-mono tabular-nums w-7">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-5 mt-2.5">
                  <button
                    onClick={() => playerStore.prev()}
                    className="text-warm-400 hover:text-white transition-colors"
                    aria-label="上一首"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
                  </button>
                  <button
                    onClick={() => playerStore.toggle()}
                    className="w-8 h-8 rounded-full bg-white/[0.12] border border-white/[0.15] text-white flex items-center justify-center hover:bg-white/[0.2] hover:border-white/[0.25] transition-all duration-300"
                    aria-label={playing ? '暂停' : '播放'}
                  >
                    {playing ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    )}
                  </button>
                  <button
                    onClick={() => playerStore.next()}
                    className="text-warm-400 hover:text-white transition-colors"
                    aria-label="下一首"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button — always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] text-white flex items-center justify-center shadow-lg hover:bg-white/[0.15] hover:border-white/[0.25] hover:scale-105 active:scale-95 transition-all duration-300 relative group"
        aria-label={isOpen ? '收起播放器' : '展开播放器'}
      >
        {!isOpen && playing && (
          <span className="absolute inset-0 rounded-full bg-white/[0.06] animate-ping" />
        )}
        {isOpen ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </button>

      <style>{`
        @keyframes music-bar {
          0% { height: 4px; }
          100% { height: 12px; }
        }
      `}</style>
    </div>
  );
}
