import React, { useState, useRef, useEffect } from 'react';
import styles from './MusicPlayer.module.css';
import PixelProgressBar from '../../components/PixelProgressBar/PixelProgressBar';
import MusicVisualizer from '../../components/MusicVisualizer/MusicVisualizer';
import { useSoundSettings } from '../../context/SoundSettingsContext';
import { getAudioContext } from '../../hooks/useSound';

// 1. Import Ảnh
import pastBibiImg from '../../assets/images/albumbibi.jpg';
import pastNhiNhiImg from '../../assets/images/albumnhinhi.jpg';
import afterLikeImg from '../../assets/images/afterlikecover.jpg';
import newBeginningsImg from '../../assets/images/newbeginningscover.jpg';
import sukidakaraImg from '../../assets/images/sukidakaracover.png';
import escapismImg from '../../assets/images/Escapism_Singles_Cover.jpg';
import hereComesImg from '../../assets/images/herecomesathought.jpg';
import loveLikeYouImg from '../../assets/images/Love_Like_You.jpg';
import choomImg from '../../assets/images/choom_image.webp';
import animalsImg from '../../assets/images/animals.webp';
import shitImg from '../../assets/images/shit_image.jpeg';
import shioriImg from '../../assets/images/shiori_image.webp';
import yeuEmTrongMoImg from '../../assets/images/yeuemtrongmo.webp';

// 2. Import Nhạc
import afterLikeAudio from '../../assets/audio/afterlike.mp3';
import newBeginningsAudio from '../../assets/audio/newbeginnings.mp3';
import sukidakaraAudio from '../../assets/audio/sukidakara.mp3';
import escapismAudio from '../../assets/audio/escapism.mp3';
import hereComesAudio from '../../assets/audio/herecomesathought.mp3';
import loveLikeYouAudio from '../../assets/audio/lovelikeyou.mp3';
import shioriAudio from '../../assets/audio/shiori.mp3';
import yeuEmTrongMoAudio from '../../assets/audio/yeu_em_trong_mo.mp3';
import choomAudio from '../../assets/audio/choom.mp3';
import animalsAudio from '../../assets/audio/animals.mp3';
import shitAudio from '../../assets/audio/shit.mp3';

// Chỉnh thời điểm bắt đầu ngay tại previewSeconds của từng bài.
// Ví dụ: previewSeconds: 75 nghĩa là bắt đầu phát từ 1 phút 15 giây.
// Sáu bài cũ để 0 giây (giữ cách phát cũ); năm bài mới đặt tạm 60 giây.
// Các mốc mới chỉ là ước lượng, có thể chỉnh theo chorus sau khi nghe thử.
const SIX_MONTHS_PLAYLIST = [
  {
    id: 's1',
    title: 'After Like',
    artist: 'IVE',
    cover: afterLikeImg,
    src: afterLikeAudio,
    previewSeconds: 0, // Bắt đầu phát ở giây thứ 0
  },
  {
    id: 's2',
    title: 'New Beginnings',
    artist: 'NEFFEX',
    cover: newBeginningsImg,
    src: newBeginningsAudio,
    previewSeconds: 0, // Bắt đầu phát ở giây thứ 0
  },
  {
    id: 's3',
    title: '好きだから',
    artist: 'ユイカ ft. れん',
    cover: sukidakaraImg,
    src: sukidakaraAudio,
    previewSeconds: 0, // Bắt đầu phát ở giây thứ 0
  },
  {
    id: 's4',
    title: 'Escapism',
    artist: 'Steven Universe',
    cover: escapismImg,
    src: escapismAudio,
    previewSeconds: 0, // Bắt đầu phát ở giây thứ 0
  },
  {
    id: 's5',
    title: 'Here Comes A Thought',
    artist: 'Steven Universe',
    cover: hereComesImg,
    src: hereComesAudio,
    previewSeconds: 0, // Bắt đầu phát ở giây thứ 0
  },
  {
    id: 's6',
    title: 'Love Like You',
    artist: 'Steven Universe',
    cover: loveLikeYouImg,
    src: loveLikeYouAudio,
    previewSeconds: 0, // Bắt đầu phát ở giây thứ 0
  }
];

const NOW_PLAYLIST = [
  {
    id: 'n1',
    title: 'Shiori',
    artist: '',
    cover: shioriImg,
    src: shioriAudio,
    previewSeconds: 60, // Bắt đầu phát ở giây thứ 60
  },
  {
    id: 'n2',
    title: 'Yêu Em Trong Mơ',
    artist: '',
    cover: yeuEmTrongMoImg,
    src: yeuEmTrongMoAudio,
    previewSeconds: 60, // Bắt đầu phát ở giây thứ 60
  },
  {
    id: 'n3',
    title: 'CHOOM',
    artist: '',
    cover: choomImg,
    src: choomAudio,
    previewSeconds: 60, // Bắt đầu phát ở giây thứ 60
  },
  {
    id: 'n4',
    title: 'Animals',
    artist: '',
    cover: animalsImg,
    src: animalsAudio,
    previewSeconds: 60, // Bắt đầu phát ở giây thứ 60
  },
  {
    id: 'n5',
    title: 'S.H.I.T (Sugar Honey Iced Tea)',
    artist: '',
    cover: shitImg,
    src: shitAudio,
    previewSeconds: 60, // Bắt đầu phát ở giây thứ 60
  }
];

const ALL_SONGS = [...SIX_MONTHS_PLAYLIST, ...NOW_PLAYLIST];

const MusicPlayer = () => {
  const [activeTab, setActiveTab] = useState('shared');
  const [playingId, setPlayingId] = useState(null);
  const [playProgress, setPlayProgress] = useState(0); // % tiến trình bài đang phát
  const [playElapsed, setPlayElapsed] = useState(0); // Giây hiện tại của bài đang phát
  const [durations, setDurations] = useState({}); // { [songId]: giây } - tự điền khi tải xong metadata, độc lập theo từng bài
  const playingRef = useRef(null);
  const audioRefs = useRef({}); // Lưu trữ các thẻ <audio>
  const analyserRefs = useRef({}); // Cache AnalyserNode theo từng song 
  const [activeAnalyser, setActiveAnalyser] = useState(null); // AnalyserNode của bài đang phát, null nếu không có bài nào chạy
  const { effectiveVolume } = useSoundSettings(); // Volume dùng chung toàn OS (0-100)

  const formatTime = (seconds) => {
    if (!seconds || !isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (playingId && audioRefs.current[playingId]) {
      audioRefs.current[playingId].volume = effectiveVolume / 100;
    }
  }, [effectiveVolume, playingId]);

  const getOrCreateAnalyser = (id, audioEl) => {
    if (analyserRefs.current[id]) return analyserRefs.current[id];
    try {
      const ctx = getAudioContext();
      if (!ctx) return null; 

      const source = ctx.createMediaElementSource(audioEl);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; 

      source.connect(analyser);
      analyser.connect(ctx.destination);

      analyserRefs.current[id] = analyser;
      return analyser;
    } catch (e) {
      return null;
    }
  };

  // Tua theo số giây trong playlist (áp dụng cho cả 11 bài).
  const seekToPreview = (songId, audio) => {
    const song = ALL_SONGS.find((item) => item.id === songId);
    if (!song || !Number.isFinite(song.previewSeconds) || song.previewSeconds <= 0) return;
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    // Nếu đặt giây quá dài, giữ ít nhất 10 giây cuối bài.
    const point = Math.max(0, Math.min(song.previewSeconds, audio.duration - 10));
    if (audio.currentTime < 1 || audio.ended) {
      audio.currentTime = point;
      setPlayElapsed(point);
      setPlayProgress((point / audio.duration) * 100);
    }
  };

  // Hàm xử lý Play/Pause nhạc
  const togglePlay = (id) => {
    const currentAudio = audioRefs.current[id];

    if (!currentAudio) return;

    if (playingRef.current === id) {
      playingRef.current = null;
      currentAudio.pause();
      setPlayingId(null);
      setActiveAnalyser(null);
    } else {
      if (playingRef.current && audioRefs.current[playingRef.current]) {
        audioRefs.current[playingRef.current].pause();
        audioRefs.current[playingRef.current].currentTime = 0;
      }
      playingRef.current = id;
      setPlayProgress(0);
      setPlayElapsed(0);
      currentAudio.volume = effectiveVolume / 100;
      seekToPreview(id, currentAudio);
      const playback = currentAudio.play();
      setPlayingId(id);
      setActiveAnalyser(getOrCreateAnalyser(id, currentAudio));
      playback?.catch(() => {
        if (playingRef.current !== id) return;
        playingRef.current = null;
        setPlayingId(null);
        setActiveAnalyser(null);
      });
    }
  };

  const handleTimeUpdate = (e) => {
    const { currentTime, duration } = e.target;
    const songId = Object.keys(audioRefs.current).find((id) => audioRefs.current[id] === e.currentTarget);
    if (playingRef.current !== songId) return;
    setPlayElapsed(currentTime);
    if (duration > 0) {
      setPlayProgress((currentTime / duration) * 100);
    }
  };

  useEffect(() => () => {
    Object.values(audioRefs.current).forEach((audio) => audio?.pause());
    audioRefs.current = {};
  }, []);

  const handleLoadedMetadata = (songId) => (e) => {
    setDurations((prev) => ({ ...prev, [songId]: e.target.duration }));
    if (playingRef.current === songId) seekToPreview(songId, e.target);
  };

  const renderSongCard = (song) => (
              <button
                type="button"
                key={song.id}
                className={`${styles.songCard} ${playingId === song.id ? styles.playingCard : ''}`}
                onClick={() => togglePlay(song.id)}
                aria-label={`${playingId === song.id ? 'Tạm dừng' : 'Phát'} ${song.title}`}
              >
                {/* Vinyl Đĩa Than */}
                <div className={styles.vinylWrapper}>
                  {song.cover ? (
                    <img
                      src={song.cover}
                      alt={song.title}
                      className={`${styles.vinylRecord} ${playingId === song.id ? styles.spinning : ''}`}
                    />
                  ) : (
                    <span
                      className={`${styles.vinylRecord} ${styles.vinylPlaceholder} ${playingId === song.id ? styles.spinning : ''}`}
                      aria-hidden="true"
                    >♪</span>
                  )}
                  <div className={styles.vinylHole}></div>
                </div>
                
                {/* Thông tin bài hát */}
                <div className={styles.songInfo}>
                  <h4 className={styles.songTitle}>{song.title}</h4>
                  {song.artist && <p className={styles.songArtist}>{song.artist}</p>}
                  <p className={styles.songDuration}>
                    {playingId === song.id
                      ? `${formatTime(playElapsed)} / ${formatTime(durations[song.id])}`
                      : formatTime(durations[song.id])}
                  </p>
                  {playingId === song.id && (
                    <div className={styles.progressWrap}>
                      <PixelProgressBar progress={playProgress} segments={16} />
                    </div>
                  )}
                </div>
                
                <div className={styles.playIndicator}>
                  {playingId === song.id ? '⏸' : '▶'}
                </div>
              </button>
  );

  return (
    <div className={styles.container}>
      {/* Thanh Tabs */}
      <div className={styles.tabBar}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'shared' ? styles.active : ''}`}
          onClick={() => setActiveTab('shared')}
        >
          ✨ Our Melody
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'past' ? styles.active : ''}`}
          onClick={() => setActiveTab('past')}
        >
          🎧 Gu Nhạc Ngày Xưa
        </button>
      </div>

      {/* Visualizer nhảy theo tần số âm thanh thực tế của bài đang phát */}
      <div className={styles.visualizerWrap}>
        <MusicVisualizer analyserNode={activeAnalyser} />
      </div>

      {/* melody*/}
      {activeTab === 'shared' && (
        <div className={styles.tabContent}>
          <p className={styles.description}>
            Cũng có, trong số đó, những giai điệu đặc biệt nữa đó... Những bài hát gợi nhớ đến em và những bài em thích nhất!
          </p>

          <section className={styles.musicSection} aria-labelledby="music-six-months">
            <h3 className={styles.sectionHeading} id="music-six-months">6 tháng trước:</h3>
            <div className={styles.playlistGrid}>
              {SIX_MONTHS_PLAYLIST.map(renderSongCard)}
            </div>
          </section>

          <section className={styles.musicSection} aria-labelledby="music-now">
            <h3 className={styles.sectionHeading} id="music-now">Bây giờ:</h3>
            {NOW_PLAYLIST.length > 0 ? (
              <div className={styles.playlistGrid}>
                {NOW_PLAYLIST.map(renderSongCard)}
              </div>
            ) : (
              <p className={styles.emptyPlaylist}>Những bài nhạc mới của tụi mình sẽ được thêm vào đây ♡</p>
            )}
          </section>
        </div>
      )}

      {/* past */}
      <div hidden aria-hidden="true">
        {ALL_SONGS.map((song) => (
          <audio
            key={song.id}
            ref={(el) => { audioRefs.current[song.id] = el; }}
            src={song.src}
            onLoadedMetadata={handleLoadedMetadata(song.id)}
            onTimeUpdate={handleTimeUpdate}
            onEnded={(event) => {
              if (playingRef.current !== song.id) return;
              playingRef.current = null;
              event.currentTarget.currentTime = 0;
              setPlayingId(null); setPlayProgress(0); setPlayElapsed(0); setActiveAnalyser(null);
            }}
          />
        ))}
      </div>

      {activeTab === 'past' && (
        <div className={styles.tabContent}>
          <p className={styles.description}>
            Biếc sao khôm? Ngày trước thì gu nhạc 2 đứa trông...
          </p>
          <div className={styles.pastGrid}>
            <div className={styles.pastCard}>
              <img src={pastBibiImg} alt="Gu của anh" className={styles.pastImg} />
              <h4 className={styles.pastTitle}>Gu của Anh</h4>
              <p className={styles.pastDesc}>Anh thì tạp nham, chả đâu vào đâu.</p>
            </div>
            <div className={styles.pastCard}>
              <img src={pastNhiNhiImg} alt="Gu của em" className={styles.pastImg} />
              <h4 className={styles.pastTitle}>Gu của Em</h4>
              <p className={styles.pastDesc}>Em thì dân K-Pop đún nghĩa.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;