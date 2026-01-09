
import React, { useState, useRef } from 'react';
import { MOCK_STREAMS } from '../constants';
import { StreamInfo, ChatMessage, UserPreferences, IdentityTag } from '../types';
import Button from './Button';
import ChatBox from './ChatBox';
import { Play, Users, Radio, X, Filter } from 'lucide-react';

interface LiveTabProps {
  preferences: UserPreferences;
}

const LiveTab: React.FC<LiveTabProps> = ({ preferences }) => {
  const [selectedStream, setSelectedStream] = useState<StreamInfo | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeFilter, setActiveFilter] = useState<IdentityTag | 'all'>('all');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const startLive = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setIsStreaming(true);
      setMessages([{ id: '1', user: 'ModBot', text: `Sua live está sendo exibida para quem busca por ${preferences.myIdentity?.replace('_', ' ')}.` }]);
      setTimeout(() => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      alert("Erro ao acessar câmera.");
    }
  };

  const filteredStreams = MOCK_STREAMS.filter(s => 
    activeFilter === 'all' || s.tag === activeFilter
  );

  const filterOptions: { id: IdentityTag | 'all', label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'mulher', label: 'Mulheres' },
    { id: 'homem', label: 'Homens' },
    { id: 'mulher_trans', label: 'Trans' },
  ];

  if (selectedStream || isStreaming) {
    return (
      <div className="flex flex-col md:flex-row h-full bg-black">
        <div className="flex-1 bg-black relative overflow-hidden">
          {isStreaming ? (
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
              <img src={selectedStream?.thumbnail} className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-20" alt="" />
              <Play size={80} className="text-white/20" />
            </div>
          )}

          <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
            <div className="bg-black/60 backdrop-blur-2xl p-4 rounded-3xl border border-white/10">
              <h2 className="text-white font-black mb-1">{isStreaming ? "Minha Transmissão" : selectedStream?.title}</h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span> Ao Vivo
                </span>
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Users size={12} /> {isStreaming ? 1 : selectedStream?.viewerCount}
                </span>
              </div>
            </div>
            <button 
              onClick={() => { setSelectedStream(null); setIsStreaming(false); }}
              className="bg-white/10 hover:bg-rose-600 p-3 rounded-2xl backdrop-blur-xl transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="w-full md:w-96 h-80 md:h-full">
          <ChatBox messages={messages} onSendMessage={(text) => setMessages(prev => [...prev, { id: Date.now().toString(), user: 'Você', text }])} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black mb-2">Transmissões</h1>
          <p className="text-slate-500 font-medium">Interaja com pessoas ao vivo agora.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setActiveFilter(opt.id)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeFilter === opt.id ? 'bg-white text-black' : 'bg-slate-900 text-slate-500 hover:text-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
          <Button onClick={startLive} variant="danger" className="flex items-center gap-2 ml-md-4">
            <Radio size={18} /> Iniciar Live
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 overflow-y-auto pb-20">
        {filteredStreams.map((stream) => (
          <div 
            key={stream.id}
            onClick={() => setSelectedStream(stream)}
            className="group cursor-pointer bg-slate-900/40 rounded-[2rem] overflow-hidden border border-slate-800/50 hover:border-indigo-500 transition-all"
          >
            <div className="relative aspect-video">
              <img src={stream.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="bg-rose-600 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Live</span>
                <span className="bg-black/40 backdrop-blur-md text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Users size={10} /> {stream.viewerCount}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-slate-100 mb-1 line-clamp-1">{stream.title}</h3>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{stream.tag.replace('_', ' ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTab;
