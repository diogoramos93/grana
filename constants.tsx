
import { StreamInfo } from './types';

export const MOCK_STREAMS: StreamInfo[] = [
  {
    id: '1',
    title: 'Tocando Violão na Madrugada 🎸',
    viewerCount: 124,
    thumbnail: 'https://picsum.photos/seed/music/400/225',
    streamerName: 'Anônimo 422',
    tag: 'homem'
  },
  {
    id: '2',
    title: 'Papo Furado & Relax 🍷',
    viewerCount: 89,
    thumbnail: 'https://picsum.photos/seed/relax/400/225',
    streamerName: 'Anônimo 109',
    tag: 'mulher'
  },
  {
    id: '3',
    title: 'Trans & Proud: Conversa Aberta',
    viewerCount: 45,
    thumbnail: 'https://picsum.photos/seed/trans/400/225',
    streamerName: 'Anônimo 877',
    tag: 'mulher_trans'
  },
  {
    id: '4',
    title: 'Gaming & Chill 🎮',
    viewerCount: 231,
    thumbnail: 'https://picsum.photos/seed/gaming/400/225',
    streamerName: 'Anônimo 332',
    tag: 'homem'
  }
];

export const FORBIDDEN_WORDS = ['palavrao1', 'palavrao2', 'spam', 'link-malicioso'];
