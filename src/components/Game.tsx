import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Pause } from 'lucide-react';
import { drawBirdShape, drawBackgroundElements } from '../lib/drawUtils';
import { THEMES, COLORS, STYLES, HATS, WINGS, COINS_TO_LEVEL_UP } from '../lib/constants';

const MenuPanel = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`pointer-events-auto bg-gradient-to-b from-[#f0f8ff] to-[#e0f2fe] p-6 border-[6px] border-[#312e81] rounded-[2rem] w-11/12 max-w-[380px] shadow-[0_8px_0_#1e1b4b,0_15px_40px_rgba(0,0,0,0.5)] text-center text-sky-950 relative ${className}`}>
        <div className="absolute inset-1.5 border-[3px] border-white/60 rounded-[1.4rem] pointer-events-none" />
        <div className="relative z-10">
            {children}
        </div>
    </div>
);

const BtnMain = ({ onClick, children, secondary = false, className = '', disabled = false }: any) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-3 px-4 text-xs font-black tracking-widest cursor-pointer mt-3 rounded-xl transition-all border-[3px] border-[#1e1b4b] relative overflow-hidden ${
            disabled ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-[0_4px_0_#94a3b8]' : 
            secondary 
                ? 'bg-[#fcd34d] text-[#451a03] shadow-[0_4px_0_#1e1b4b] active:translate-y-[4px] active:shadow-[0_0px_0_#1e1b4b] hover:bg-[#fde68a]'
                : 'bg-[#22c55e] text-white shadow-[0_4px_0_#1e1b4b] active:translate-y-[4px] active:shadow-[0_0px_0_#1e1b4b] hover:bg-[#4ade80]'
        } ${className}`}
    >
        <span className="absolute inset-x-0 top-0 h-1/3 bg-white/20 rounded-b-lg pointer-events-none" />
        {children}
    </button>
);

export default function Game() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mCanvasRef = useRef<HTMLCanvasElement>(null);
    const pCanvasRef = useRef<HTMLCanvasElement>(null);
  
    const safeParse = (key: string, backup: string) => {
        try { return localStorage.getItem(key) || backup; } catch { return backup; }
    };
    const safeParseInt = (key: string, backup: number) => {
        try { const v = localStorage.getItem(key); return v ? parseInt(v) : backup; } catch { return backup; }
    };

    const [gameState, setGameState] = useState<'loading' | 'login' | 'menu' | 'playing' | 'paused' | 'gameover'>('loading');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [playerName, setPlayerName] = useState(() => safeParse('flappyPlayerName', ''));
    const [highScore, setHighScore] = useState(() => safeParseInt('flappyCoinBest', 0));
    const [unlockedLevel, setUnlockedLevel] = useState(() => safeParseInt('flappyCoinLvl', 1));
    const [currentLevel, setCurrentLevel] = useState(unlockedLevel);
    
    // Customizations
    const [birdColor, setBirdColor] = useState(() => safeParse('flappyBirdColor', "#0ea5e9"));
    const [birdStyle, setBirdStyle] = useState(() => safeParse('flappyBirdStyle', 'classic'));
    const [birdHat, setBirdHat] = useState(() => safeParse('flappyBirdHat', 'none'));
    const [birdWings, setBirdWings] = useState(() => safeParse('flappyBirdWings', 'normal'));
  
    // HUD
    const [currentScore, setCurrentScore] = useState(0);
    const [coinsCollected, setCoinsCollected] = useState(0);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [levelUpText, setLevelUpText] = useState("");
  
    // Panels
    const [activePanel, setActivePanel] = useState<'none' | 'style' | 'levels'>('none');
    const [activeCustomTab, setActiveCustomTab] = useState<'style' | 'color' | 'hat' | 'wings'>('style');
  
    // Login
    const [loginInput, setLoginInput] = useState(playerName);
    const [shakeLogin, setShakeLogin] = useState(false);
  
    // Audio
    const [isSoundOn, setIsSoundOn] = useState(() => {
        const saved = localStorage.getItem('flappySoundOn');
        return saved !== null ? saved === 'true' : true;
    });
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const flapAudioRef = useRef<HTMLAudioElement | null>(null);
    const pointAudioRef = useRef<HTMLAudioElement | null>(null);
    const dieAudioRef = useRef<HTMLAudioElement | null>(null);
    const hitAudioRef = useRef<HTMLAudioElement | null>(null);
    const gameOverVoiceRef = useRef<HTMLAudioElement | null>(null);
    const gameStartVoiceRef = useRef<HTMLAudioElement | null>(null);
    const levelUpAudioRef = useRef<HTMLAudioElement | null>(null);
    const mainMenuVoiceRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('/game-sound.mp3');
        audioRef.current.loop = true;
        
        flapAudioRef.current = new Audio('/flap.mp3');
        pointAudioRef.current = new Audio('/point.mp3');
        dieAudioRef.current = new Audio('/die.mp3');
        hitAudioRef.current = new Audio('/flappy-bird-hit-sound.mp3');
        gameOverVoiceRef.current = new Audio('/game-over-voice.wav');
        gameStartVoiceRef.current = new Audio('/game-start-voice.wav');
        levelUpAudioRef.current = new Audio('/level-up.wav');
        mainMenuVoiceRef.current = new Audio('/main-menu-voice.wav');
        
        const initialMuted = localStorage.getItem('flappySoundOn') === 'false';
        audioRef.current.muted = initialMuted;
        flapAudioRef.current.muted = initialMuted;
        pointAudioRef.current.muted = initialMuted;
        dieAudioRef.current.muted = initialMuted;
        hitAudioRef.current.muted = initialMuted;
        gameOverVoiceRef.current.muted = initialMuted;
        gameStartVoiceRef.current.muted = initialMuted;
        levelUpAudioRef.current.muted = initialMuted;
        mainMenuVoiceRef.current.muted = initialMuted;
        
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            flapAudioRef.current = null;
            pointAudioRef.current = null;
            dieAudioRef.current = null;
            hitAudioRef.current = null;
            gameOverVoiceRef.current = null;
            gameStartVoiceRef.current = null;
            levelUpAudioRef.current = null;
            mainMenuVoiceRef.current = null;
        };
    }, []);

    useEffect(() => {
        const muted = !isSoundOn;
        if (audioRef.current) audioRef.current.muted = muted;
        if (flapAudioRef.current) flapAudioRef.current.muted = muted;
        if (pointAudioRef.current) pointAudioRef.current.muted = muted;
        if (dieAudioRef.current) dieAudioRef.current.muted = muted;
        if (hitAudioRef.current) hitAudioRef.current.muted = muted;
        if (gameOverVoiceRef.current) gameOverVoiceRef.current.muted = muted;
        if (gameStartVoiceRef.current) gameStartVoiceRef.current.muted = muted;
        if (levelUpAudioRef.current) levelUpAudioRef.current.muted = muted;
        if (mainMenuVoiceRef.current) mainMenuVoiceRef.current.muted = muted;
        localStorage.setItem('flappySoundOn', isSoundOn.toString());
    }, [isSoundOn]);

    useEffect(() => {
        if (gameState === 'login' || gameState === 'menu' || gameState === 'playing') {
            if (audioRef.current) {
                audioRef.current.play().catch(err => console.log('Audio error:', err));
            }
        } else {
            audioRef.current?.pause();
        }

        if (gameState === 'menu') {
            if (mainMenuVoiceRef.current) {
                mainMenuVoiceRef.current.currentTime = 0;
                mainMenuVoiceRef.current.play().catch(err => console.log('Main menu voice error:', err));
            }
        }
    }, [gameState]);

    // Engine State Loop Variables
    const engineState = useRef({
        totalCoins: 0,
        coinsCollectedInLevel: 0,
        frames: 0,
        isOut: false,
        bird: { x: 60, y: 250, velocity: 0, rotation: 0, targetRotation: 0 },
        pipes: [] as any[],
        coins: [] as any[],
        gameState: 'login',
        currentLevel: unlockedLevel
    });
  
    // Sync React -> Engine safely
    useLayoutEffect(() => {
      engineState.current.gameState = gameState;
      engineState.current.currentLevel = currentLevel;
    }, [gameState, currentLevel]);
  
    const customRef = useRef({ birdColor, birdStyle, birdHat, birdWings });
    useLayoutEffect(() => {
      customRef.current = { birdColor, birdStyle, birdHat, birdWings };
      localStorage.setItem('flappyBirdColor', birdColor);
      localStorage.setItem('flappyBirdStyle', birdStyle);
      localStorage.setItem('flappyBirdHat', birdHat);
      localStorage.setItem('flappyBirdWings', birdWings);
    }, [birdColor, birdStyle, birdHat, birdWings]);
  
    // Responsive Canvas dimensions
    const [dimensions, setDimensions] = useState({ w: 400, h: 700 });
    useEffect(() => {
      const handleResize = () => {
        setDimensions({
          w: window.innerWidth,
          h: window.innerHeight
        });
      };
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    // Main Game Loop Engine
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
    
        const getLevelConfig = (lvl: number) => {
            return { 
                gap: Math.max(110, 210 - (lvl * 2)), 
                speed: Math.min(8, 3.2 + (lvl * 0.15)), 
                gravity: 0.22, 
                spawnRate: Math.max(40, 95 - lvl)
            };
        };
    
        const triggerOut = (hitPillar = false) => {
            const estate = engineState.current;
            if (estate.isOut) return;
            estate.isOut = true;
            
            if (audioRef.current) {
                audioRef.current.pause();
            }
            
            if (hitPillar && hitAudioRef.current) {
                hitAudioRef.current.currentTime = 0;
                hitAudioRef.current.play().catch(err => console.log('Hit audio error:', err));
            }
            
            if (dieAudioRef.current) {
                dieAudioRef.current.currentTime = 0;
                dieAudioRef.current.play().catch(err => console.log('Die audio error:', err));
            }
            
            if (gameOverVoiceRef.current) {
                gameOverVoiceRef.current.currentTime = 0;
                gameOverVoiceRef.current.play().catch(err => console.log('Voice error:', err));
            }
            
            // Shake visual effect
            canvas.classList.add('shake');
            setTimeout(() => canvas.classList.remove('shake'), 200);
    
            setTimeout(() => {
                setGameState('gameover');
                
                setHighScore(prev => {
                    const newBest = Math.max(prev, estate.totalCoins);
                    localStorage.setItem('flappyCoinBest', newBest.toString());
                    return newBest;
                });
            }, 800);
        };
    
        const checkLevelUp = () => {
            const estate = engineState.current;
            setCurrentScore(estate.totalCoins);
            setCoinsCollected(estate.coinsCollectedInLevel);
    
            if(estate.coinsCollectedInLevel >= COINS_TO_LEVEL_UP) {
                estate.coinsCollectedInLevel = 0;
                const nextLevel = estate.currentLevel + 1;
                
                estate.currentLevel = nextLevel;
                setCurrentLevel(nextLevel);
                
                if (levelUpAudioRef.current) {
                    levelUpAudioRef.current.currentTime = 0;
                    levelUpAudioRef.current.play().catch(err => console.log('Level up audio error:', err));
                }
                
                setUnlockedLevel(prev => {
                   const max = Math.max(prev, nextLevel);
                   localStorage.setItem('flappyCoinLvl', max.toString());
                   return max;
                });
    
                setLevelUpText(`LEVEL ${nextLevel}!`);
                setShowLevelUp(false);
                setTimeout(() => setShowLevelUp(true), 10);
            }
        };
    
        let animationFrameId: number;

        const loop = () => {
            const estate = engineState.current;
            const currentLvl = estate.currentLevel;
            const theme = THEMES[(currentLvl - 1) % THEMES.length];
            const w = dimensions.w;
            const h = dimensions.h;
    
            canvas.width = w;
            canvas.height = h;
    
            const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
            skyGrad.addColorStop(0, theme.sky[0]); 
            skyGrad.addColorStop(0.5, theme.sky[1]); 
            skyGrad.addColorStop(1, theme.sky[2]);
            ctx.fillStyle = skyGrad; 
            ctx.fillRect(0, 0, w, h);
    
            drawBackgroundElements(ctx, w, h, theme, estate.frames, currentLvl);
    
            estate.pipes.forEach(p => {
                const grad = ctx.createLinearGradient(p.x, 0, p.x + 65, 0);
                grad.addColorStop(0, theme.pipe[0]); grad.addColorStop(0.5, theme.pipe[1]); grad.addColorStop(1, theme.pipe[0]);
                ctx.fillStyle = grad;
                ctx.fillRect(p.x, 0, 65, p.top);
                const bY = p.top + p.gap;
                ctx.fillRect(p.x, bY, 65, h - bY);
                ctx.fillStyle = theme.pipe[0];
                ctx.fillRect(p.x - 5, p.top - 22, 75, 22);
                ctx.fillRect(p.x - 5, bY, 75, 22);
            });
    
            estate.coins.forEach(c => {
                ctx.save(); ctx.translate(c.x, c.y);
                ctx.scale(Math.abs(Math.sin(estate.frames * 0.15)), 1);
                ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = '#a16207'; ctx.lineWidth = 1.5; ctx.stroke();
                ctx.restore();
            });
    
            const bird = estate.bird;
            bird.rotation += (bird.targetRotation - bird.rotation) * 0.12;
            drawBirdShape(ctx, bird.x, bird.y, customRef.current.birdColor, customRef.current.birdStyle, customRef.current.birdHat, customRef.current.birdWings, estate.frames, bird.rotation);
            
            if (estate.isOut) {
                ctx.save();
                ctx.fillStyle = "#ef4444"; ctx.strokeStyle = "white"; ctx.lineWidth = 4;
                ctx.font = "900 24px 'Inter', sans-serif"; ctx.textAlign = "center";
                ctx.strokeText("GAME OVER!", bird.x + 20, bird.y - 15);
                ctx.fillText("GAME OVER!", bird.x + 20, bird.y - 15);
                ctx.restore();
            }
    
            ctx.fillStyle = theme.ground; ctx.fillRect(0, h - 70, w, 70);
            ctx.fillStyle = theme.groundEdge; ctx.fillRect(0, h - 70, w, 5);
    
            if(estate.gameState === 'playing') {
                if (!estate.isOut) {
                    const config = getLevelConfig(currentLvl);
                    
                    bird.velocity += config.gravity;
                    bird.y += bird.velocity;
                    if (bird.velocity < 0) bird.targetRotation = -0.3;
                    else if (bird.velocity > 2) bird.targetRotation = Math.min(Math.PI/2, bird.targetRotation + 0.05);
                    if(bird.y + 24 > h - 70 || bird.y < 0) triggerOut(false);
    
                    if(estate.frames % config.spawnRate === 0) {
                        const usableH = h - 70;
                        const top = Math.random() * (usableH - config.gap - 180) + 90;
                        estate.pipes.push({ x: w, top: top, gap: config.gap });
                        estate.coins.push({ x: w + 32, y: top + config.gap/2 });
                    }
    
                    for(let i = estate.pipes.length - 1; i >= 0; i--) {
                        const p = estate.pipes[i];
                        p.x -= config.speed;
                        if (bird.x + 30 > p.x && bird.x + 10 < p.x + 65) {
                            if (bird.y + 5 < p.top || bird.y + 25 > p.top + p.gap) triggerOut(true);
                        }
                        if(p.x + 65 < 0) estate.pipes.splice(i, 1);
                    }
    
                    for(let i = estate.coins.length - 1; i >= 0; i--) {
                        const c = estate.coins[i];
                        c.x -= config.speed;
                        const dx = bird.x + 20 - c.x;
                        const dy = bird.y + 15 - c.y;
                        if(Math.sqrt(dx*dx + dy*dy) < 28) {
                            estate.totalCoins++; 
                            estate.coinsCollectedInLevel++;
                            estate.coins.splice(i, 1);
                            
                            if (pointAudioRef.current) {
                                pointAudioRef.current.currentTime = 0;
                                pointAudioRef.current.play().catch(err => console.log('Point audio error:', err));
                            }
                            
                            checkLevelUp();
                        } else if(c.x < -20) {
                            estate.coins.splice(i, 1);
                        }
                    }
    
                    estate.frames++;
                }
            }

            const mCtx = mCanvasRef.current?.getContext('2d');
            const pCtx = pCanvasRef.current?.getContext('2d');
            
            if (mCtx) {
                mCtx.clearRect(0, 0, 80, 60);
                drawBirdShape(mCtx, 20, 15, customRef.current.birdColor, customRef.current.birdStyle, customRef.current.birdHat, customRef.current.birdWings, performance.now()/150, 0);
            }
            if (pCtx && estate.gameState === 'menu') {
                pCtx.clearRect(0, 0, 80, 70);
                drawBirdShape(pCtx, 20, 20, customRef.current.birdColor, customRef.current.birdStyle, customRef.current.birdHat, customRef.current.birdWings, performance.now()/150, 0);
            }
    
            animationFrameId = requestAnimationFrame(loop);
        };
    
        animationFrameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions]);

    // Input handlers
    const handleAction = () => {
        const estate = engineState.current;
        if (estate.gameState === 'playing' && !estate.isOut) {
            estate.bird.velocity = -5.4;
            estate.bird.targetRotation = -0.4;
            if (flapAudioRef.current) {
                flapAudioRef.current.currentTime = 0;
                flapAudioRef.current.play().catch(err => console.log('Flap audio error:', err));
            }
        } else if (estate.gameState === 'menu' && activePanel === 'none') {
            startCurrentLevel();
        }
    };
  
    const startCurrentLevel = () => {
        resetGame();
        setActivePanel('none');
    };
  
    const resetGame = () => {
        const estate = engineState.current;
        estate.totalCoins = 0; 
        estate.coinsCollectedInLevel = 0; 
        estate.frames = 0; 
        estate.isOut = false;
        estate.bird.y = 250; 
        estate.bird.velocity = 0; 
        estate.bird.rotation = 0; 
        estate.bird.targetRotation = 0;
        estate.pipes = []; 
        estate.coins = [];
        estate.gameState = 'playing';
        
        setCurrentScore(0);
        setCoinsCollected(0);
        setGameState('playing');
    };

    const handleLogin = () => {
        const name = loginInput.trim();
        if(name) {
            setPlayerName(name);
            localStorage.setItem('flappyPlayerName', name);
            setGameState('menu');
        } else {
            setShakeLogin(true);
            setTimeout(() => setShakeLogin(false), 300);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && engineState.current.gameState !== 'login') {
                e.preventDefault();
                handleAction();
            }
        };
        const handleTouchStart = (e: TouchEvent) => {
            if (engineState.current.gameState !== 'login' && e.target === canvasRef.current) {
                e.preventDefault();
                handleAction();
            }
        };
        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 0 && engineState.current.gameState !== 'login' && e.target === canvasRef.current) {
                handleAction();
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
            canvas.addEventListener('mousedown', handleMouseDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (canvas) {
                canvas.removeEventListener('touchstart', handleTouchStart);
                canvas.removeEventListener('mousedown', handleMouseDown);
            }
        };
    }, []);

    // Effect for skipping login
    useLayoutEffect(() => {
        if (gameState === 'loading') {
            const interval = setInterval(() => {
                setLoadingProgress(p => {
                    if (p >= 100) {
                        clearInterval(interval);
                        setGameState('login');
                        return 100;
                    }
                    return p + 20; // 5 steps
                });
            }, 300);
            return () => clearInterval(interval);
        }
    }, [gameState, playerName]);

    const customTabs = [
        { id: 'style', label: 'BODY' },
        { id: 'color', label: 'COLOR' },
        { id: 'hat', label: 'HAT' },
        { id: 'wings', label: 'WINGS' }
    ];

    return (
        <div id="game-container">
            <canvas ref={canvasRef} id="gameCanvas" className="block w-full h-full" />
            
            {gameState === 'playing' && (
                <>
                    <div className="absolute top-[15px] left-[15px] text-white text-[10px] z-10 bg-black/40 px-3 py-2 border-2 border-white/30 rounded-lg backdrop-blur-md">
                        LVL: {currentLevel} | COINS: {coinsCollected}/{COINS_TO_LEVEL_UP}
                    </div>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setGameState('paused');
                            engineState.current.gameState = 'paused';
                        }} 
                        className="absolute top-[15px] right-[15px] z-[60] bg-black/40 text-white p-2.5 rounded-xl border-2 border-white/30 backdrop-blur-md pointer-events-auto hover:bg-black/60 transition-colors shadow-lg active:scale-95 flex items-center justify-center cursor-pointer"
                    >
                        <Pause size={24} fill="currentColor" />
                    </button>
                    <div className="absolute top-[50px] text-[40px] text-white z-10 drop-shadow-[3px_3px_0_rgba(0,0,0,0.4)]">
                        {currentScore}
                    </div>
                </>
            )}

            {showLevelUp && (
                <div className="do-text absolute top-[40%] text-white text-2xl text-center z-50 pointer-events-none drop-shadow-[3px_3px_0_#0369a1]">
                    {levelUpText}
                </div>
            )}

            {gameState === 'loading' && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center z-[200] bg-sky-950">
                    <h1 className="text-4xl mb-8 font-bold tracking-tighter text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)] animate-pulse">FLAPPY BIRD 3D</h1>
                    <div className="w-48 h-3 bg-slate-800 rounded-full overflow-hidden border border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                        <div className="h-full bg-gradient-to-r from-sky-500 to-sky-300 transition-all duration-[300ms] ease-out" style={{ width: `${loadingProgress}%` }}></div>
                    </div>
                    <div className="text-sky-300 mt-3 text-[10px] font-bold">LOADING... {loadingProgress}%</div>
                </div>
            )}

            {gameState === 'login' && (
                <div className="absolute inset-0 pointer-events-auto flex justify-center items-center z-50 bg-black/60 backdrop-blur-md">
                    <MenuPanel>
                        <h1 className="text-4xl mb-4 font-black tracking-widest text-[#facc15] uppercase scale-110 drop-shadow-md" style={{ WebkitTextStroke: '2px #1e1b4b', textShadow: '0 4px 0 #1e1b4b', lineHeight: 1.2 }}>FLAPPY PRO</h1>
                        <p className="text-xs mb-3 text-[#1e1b4b] font-black uppercase tracking-wider">ENTER PILOT NAME</p>
                        <input 
                            type="text" 
                            className={`w-full bg-white text-[#1e1b4b] border-[4px] border-[#1e1b4b] rounded-2xl p-4 mb-4 text-center font-black outline-none focus:border-sky-500 focus:scale-105 transition-all shadow-[inset_0_4px_8px_rgba(0,0,0,0.1)] ${shakeLogin ? 'shake' : ''}`}
                            placeholder="YOUR NAME" 
                            maxLength={12} 
                            autoComplete="off"
                            value={loginInput}
                            onChange={(e) => setLoginInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                        <BtnMain onClick={handleLogin}>START ADVENTURE</BtnMain>
                    </MenuPanel>
                </div>
            )}

            {gameState === 'menu' && activePanel === 'none' && (
                <div className="absolute inset-0 pointer-events-auto flex justify-center items-center z-50 bg-black/60 backdrop-blur-md">
                    <MenuPanel>
                        <h1 className="text-4xl mb-2 font-black tracking-widest text-[#facc15] uppercase scale-105 drop-shadow-md" style={{ WebkitTextStroke: '2px #1e1b4b', textShadow: '0 4px 0 #1e1b4b', lineHeight: 1.2 }}>FLAPPY PRO</h1>
                        <div className="text-xs mb-3 text-[#1e1b4b] font-black uppercase tracking-widest">WELCOME, {playerName}!</div>
                        
                        <div className="bg-[#1e1b4b] text-[#facc15] px-4 py-2 rounded-2xl inline-block mb-3 font-black text-xs border-[3px] border-[#1e1b4b] shadow-[0_4px_0_rgba(0,0,0,0.2)]">
                            BEST SCORE: {highScore}
                        </div>
                        
                        <div className="bg-[#e0f2fe] rounded-[1.5rem] p-4 mb-2 border-[4px] border-[#38bdf8] shadow-[inset_0_4px_8px_rgba(0,0,0,0.1)] relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <canvas ref={mCanvasRef} width={80} height={60} className="mx-auto" />
                        </div>

                        <BtnMain onClick={startCurrentLevel}>GAME START</BtnMain>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <BtnMain secondary onClick={() => setActivePanel('style')}>CUSTOMIZE</BtnMain>
                            <BtnMain secondary onClick={() => setActivePanel('levels')}>LEVELS</BtnMain>
                        </div>
                        <div className="mt-4 flex flex-col items-center gap-3">
                            <button className="flex items-center gap-1.5 text-black transition-all pointer-events-auto bg-red-500 hover:bg-red-400 px-4 py-2 rounded-xl border-[3px] border-black shadow-[0_4px_0_#000] active:translate-y-[4px] active:shadow-none" onClick={() => setIsSoundOn(!isSoundOn)} title={isSoundOn ? "Mute Sound" : "Enable Sound"}>
                                {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                                <span className="text-sm font-black tracking-widest">{isSoundOn ? 'SOUND ON' : 'SOUND OFF'}</span>
                            </button>
                            <button className="text-[10px] font-bold text-sky-700/60 uppercase hover:text-sky-700 pointer-events-auto transition-colors" onClick={() => { setPlayerName(''); localStorage.removeItem('flappyPlayerName'); setGameState('login'); }}>
                                [ Back to Login ]
                            </button>
                        </div>
                    </MenuPanel>
                </div>
            )}

            {gameState === 'menu' && activePanel === 'style' && (
                <div className="absolute inset-0 pointer-events-auto flex justify-center items-center z-[100] bg-black/60 backdrop-blur-md">
                    <MenuPanel className="max-w-[400px]">
                        <h3 className="text-2xl mb-2 font-black tracking-widest text-[#38bdf8] uppercase" style={{ WebkitTextStroke: '1px #1e1b4b', textShadow: '0 2px 0 #1e1b4b' }}>WARDROBE</h3>
                        
                        <div className="border-[4px] border-[#38bdf8] rounded-3xl mb-3 p-2 bg-[#e0f2fe] shadow-[inset_0_4px_8px_rgba(0,0,0,0.1)]">
                            <canvas ref={pCanvasRef} width={80} height={70} className="mx-auto" />
                        </div>

                        <div className="flex justify-between mb-3 border-b-2 border-slate-200 px-1">
                            {customTabs.map(tab => (
                                <button 
                                    key={tab.id} 
                                    onClick={() => setActiveCustomTab(tab.id as any)}
                                    className={`p-2 text-[10px] font-black tracking-wider border-b-[3px] transition-all ${activeCustomTab === tab.id ? 'text-[#38bdf8] border-[#38bdf8]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto p-1 bg-white rounded-xl border-2 border-slate-100 shadow-inner">
                            {activeCustomTab === 'color' && COLORS.map(c => (
                                <button key={c.val} onClick={() => setBirdColor(c.val)} className={`transition-all border-[3px] rounded-xl p-2 text-[9px] font-bold text-center ${birdColor === c.val ? 'border-[#38bdf8] bg-[#e0f2fe] text-[#0369a1]' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                                    {c.name}
                                </button>
                            ))}
                            {activeCustomTab === 'style' && STYLES.map(s => (
                                <button key={s.id} onClick={() => setBirdStyle(s.id)} className={`transition-all border-[3px] rounded-xl p-2 text-[9px] font-bold text-center ${birdStyle === s.id ? 'border-[#38bdf8] bg-[#e0f2fe] text-[#0369a1]' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                                    {s.name}
                                </button>
                            ))}
                            {activeCustomTab === 'hat' && HATS.map(h => (
                                <button key={h.id} onClick={() => setBirdHat(h.id)} className={`transition-all border-[3px] rounded-xl p-2 text-[9px] font-bold text-center ${birdHat === h.id ? 'border-[#38bdf8] bg-[#e0f2fe] text-[#0369a1]' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                                    {h.name}
                                </button>
                            ))}
                            {activeCustomTab === 'wings' && WINGS.map(w => (
                                <button key={w.id} onClick={() => setBirdWings(w.id)} className={`transition-all border-[3px] rounded-xl p-2 text-[9px] font-bold text-center ${birdWings === w.id ? 'border-[#38bdf8] bg-[#e0f2fe] text-[#0369a1]' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                                    {w.name}
                                </button>
                            ))}
                        </div>
                        
                        <BtnMain onClick={() => setActivePanel('none')} className="mt-4">SAVE & CLOSE</BtnMain>
                    </MenuPanel>
                </div>
            )}

            {gameState === 'menu' && activePanel === 'levels' && (
                <div className="absolute inset-0 pointer-events-auto flex justify-center items-center z-[100] bg-black/60 backdrop-blur-md">
                    <MenuPanel>
                        <h3 className="text-2xl mb-4 font-black tracking-widest text-[#38bdf8] uppercase" style={{ WebkitTextStroke: '1px #1e1b4b', textShadow: '0 2px 0 #1e1b4b' }}>SELECT LEVEL</h3>
                        <div className="grid grid-cols-5 gap-3 max-h-[300px] overflow-y-auto p-3 bg-white rounded-2xl border-[3px] border-slate-200 shadow-inner">
                            {Array.from({length: 100}).map((_, i) => {
                                const lvl = i + 1;
                                const locked = lvl > unlockedLevel;
                                return (
                                    <button 
                                        key={lvl} 
                                        disabled={locked} 
                                        onClick={() => { 
                                            setCurrentLevel(lvl); 
                                            engineState.current.currentLevel = lvl; 
                                            setActivePanel('none'); 
                                            resetGame(); 
                                        }} 
                                        className={`w-12 h-12 flex items-center justify-center rounded-xl text-xs font-black border-[3px] transition-all ${locked ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed' : (lvl === currentLevel ? 'bg-[#38bdf8] text-white border-[#0284c7] shadow-[0_4px_0_#0284c7] -translate-y-1' : 'bg-white text-[#0284c7] border-[#bae6fd] shadow-[0_2px_0_#bae6fd] hover:-translate-y-0.5 hover:shadow-[0_3px_0_#bae6fd]')}`}
                                    >
                                        {locked ? '🔒' : lvl}
                                    </button>
                                );
                            })}
                        </div>
                        <BtnMain secondary onClick={() => setActivePanel('none')} className="mt-4">CLOSE</BtnMain>
                    </MenuPanel>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="absolute inset-0 pointer-events-auto flex justify-center items-center z-50 bg-black/60 backdrop-blur-md">
                    <MenuPanel>
                        <h2 className="text-4xl mb-4 font-black tracking-widest text-[#ef4444] uppercase scale-105 drop-shadow-md" style={{ WebkitTextStroke: '2px #111827', textShadow: '0 4px 0 #111827', lineHeight: 1.2 }}>GAME OVER!</h2>
                        
                        <div className="bg-[#1e1b4b] text-[#fcd34d] px-6 py-4 rounded-2xl inline-block mb-4 font-black text-2xl border-[4px] border-[#1e1b4b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                            <div className="text-[10px] text-sky-200 mb-1 tracking-widest">COINS COLLECTED</div>
                            {currentScore}
                        </div>

                        <BtnMain onClick={resetGame}>PLAY AGAIN</BtnMain>
                        <BtnMain secondary onClick={() => setGameState('menu')}>MAIN MENU</BtnMain>
                    </MenuPanel>
                </div>
            )}

            {gameState === 'paused' && (
                <div className="absolute inset-0 pointer-events-auto flex justify-center items-center z-50 bg-black/60 backdrop-blur-md">
                    <MenuPanel>
                        <h2 className="text-4xl mb-6 font-black tracking-widest text-[#38bdf8] uppercase scale-105 drop-shadow-md" style={{ WebkitTextStroke: '2px #1e1b4b', textShadow: '0 4px 0 #1e1b4b', lineHeight: 1.2 }}>PAUSED</h2>
                        <BtnMain onClick={() => {
                            setGameState('playing');
                            engineState.current.gameState = 'playing';
                        }}>RESUME</BtnMain>
                        <BtnMain secondary onClick={() => {
                            if (gameStartVoiceRef.current) {
                                gameStartVoiceRef.current.currentTime = 0;
                                gameStartVoiceRef.current.play().catch(err => console.log('Start voice error:', err));
                            }
                            setGameState('menu');
                            engineState.current.gameState = 'menu';
                        }} className="mt-2 text-sm bg-slate-200 text-slate-800 border-slate-400">MAIN MENU</BtnMain>
                    </MenuPanel>
                </div>
            )}
        </div>
    );
}
