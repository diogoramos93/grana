
import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, SkipForward, Info, Loader2, Flag } from 'lucide-react';
import Button from './Button';
import ChatBox from './ChatBox';
import { ChatMessage, UserPreferences } from '../types';

interface RandomTabProps {
  preferences: UserPreferences;
}

const RandomTab: React.FC<RandomTabProps> = ({ preferences }) => {
  const [status, setStatus] = useState<'idle' | 'searching' | 'connected'>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let timer: any;
    if (status === 'connected') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSkip();
            return 180;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  const handleStart = async () => {
    setStatus('searching');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Simulate matching with preferences filter
      setTimeout(() => {
        setStatus('connected');
        setMessages([
          { id: 'sys', user: 'LiveFlow', text: `Conectado com alguém que busca ${preferences.myIdentity?.replace('_', ' ')}.` }
        ]);
      }, 3000);
    } catch (err) {
      alert("Acesso à câmera é obrigatório para o Random.");
      setStatus('idle');
    }
  };

  const handleSkip = () => {
    setStatus('searching');
    setMessages([]);
    setTimeLeft(180);
    setTimeout(() => {
      setStatus('connected');
      setMessages([
        { id: 'sys', user: 'LiveFlow', text: 'Novo match encontrado!' }
      ]);
    }, 2000);
  };

  const handleSendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: 'Você',
      text
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] text-center max-w-sm w-full shadow-2xl">
          <div className="w-24 h-24 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-lg shadow-indigo-500/20">
            <Video size={48} />
          </div>
          <h2 className="text-3xl font-black mb-4">Busca 1v1</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Filtrando matches para: <br/>
            <span className="text-rose-400 font-bold">
              {preferences.lookingFor.length === 0 ? 'Qualquer pessoa' : preferences.lookingFor.map(l => l.replace('_', ' ')).join(', ')}
            </span>
          </p>
          <Button onClick={handleStart} className="w-full py-5 text-lg">Começar Busca</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden bg-black">
      <div className="relative flex-1 bg-slate-950 flex flex-col md:flex-row gap-1 p-1">
        {/* Remote Video */}
        <div className="relative flex-1 bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl group">
          {status === 'searching' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-400 p-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
                <Loader2 className="animate-spin mb-6 relative" size={64} />
              </div>
              <p className="font-black text-xl mb-2">Cruzando Preferências...</p>
              <p className="text-slate-500 text-sm">Buscando o par ideal para você</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Transmissão do Estranho</p>
            </div>
          )}
          
          <div className="absolute top-6 left-6 flex items-center gap-3">
             <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-tighter">Conectado</span>
             </div>
          </div>

          <div className="absolute bottom-6 left-6">
            <button className="bg-black/40 hover:bg-rose-600/40 p-3 rounded-2xl backdrop-blur-xl border border-white/10 text-slate-400 hover:text-white transition-all">
              <Flag size={20} />
            </button>
          </div>
        </div>

        {/* Local Video */}
        <div className="relative w-full md:w-72 h-56 md:h-auto bg-slate-800 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-slate-900 self-end md:self-auto">
          <video 
            ref={localVideoRef}
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
            <button 
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`p-3 rounded-2xl backdrop-blur-xl transition-all border border-white/10 ${isCameraOn ? 'bg-black/40 text-white' : 'bg-rose-600 text-white'}`}
            >
              {isCameraOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>
            <button 
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-2xl backdrop-blur-xl transition-all border border-white/10 ${isMicOn ? 'bg-black/40 text-white' : 'bg-rose-600 text-white'}`}
            >
              {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
          </div>
        </div>

        {/* Floating Controls */}
        {status === 'connected' && (
          <div className="absolute top-6 right-6 flex flex-col items-end gap-3 pointer-events-none">
            <div className="pointer-events-auto bg-indigo-600 px-6 py-4 rounded-3xl shadow-2xl shadow-indigo-600/40 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/60 uppercase font-black tracking-widest">Tempo</span>
                <span className="text-2xl font-mono font-black text-white">{formatTime(timeLeft)}</span>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <button 
                onClick={handleSkip}
                className="bg-white text-indigo-600 p-3 rounded-2xl hover:bg-slate-100 transition-all active:scale-90"
              >
                <SkipForward size={28} fill="currentColor" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full md:w-96 h-80 md:h-full border-l border-slate-800">
        <ChatBox 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          placeholder="Envie uma mensagem..."
        />
      </div>
    </div>
  );
};

export default RandomTab;
