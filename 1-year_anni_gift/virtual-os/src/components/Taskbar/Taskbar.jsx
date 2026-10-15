import React, { useState, useEffect } from 'react';
import styles from './Taskbar.module.css';
import { useSoundSettings } from '../../context/SoundSettingsContext';

// Import ảnh icon pixel mới bro tìm được
import batteryIcon from '../../assets/images/battery_icon.png'; //image_6.png
import volumeIcon from '../../assets/images/volume_icon.png'; //image_7.png
import wifiPinkIcon from '../../assets/images/wifi_icon.png'; //image_8.png

const Taskbar = ({ openWindows, APPS, onTabClick, toggleStartMenu, onShowDesktop }) => {
  const [time, setTime] = useState(new Date());
  // Volume/Mute giờ lấy từ context dùng chung toàn OS, không còn là state cục bộ nữa
  const { volume, setVolume, isMuted, setIsMuted } = useSoundSettings();
  const [batteryLevel, setBatteryLevel] = useState(100); // Mức pin đồng bộ
  const [isCharging, setIsCharging] = useState(false); // Trạng thái đang sạc

  // 1. Cập nhật đồng hồ thời gian thực
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Tích hợp Pin thực tế (navigator.getBattery)
  useEffect(() => {
    if (!navigator.getBattery) return undefined;

    let mounted = true;
    let battery = null;
    const update = () => {
      if (!mounted || !battery) return;
      setBatteryLevel(Math.floor(battery.level * 100));
      setIsCharging(battery.charging);
    };

    navigator.getBattery().then((manager) => {
      if (!mounted) return;
      battery = manager;
      update();
      battery.addEventListener('levelchange', update);
      battery.addEventListener('chargingchange', update);
    }).catch(() => {});

    return () => {
      mounted = false;
      battery?.removeEventListener('levelchange', update);
      battery?.removeEventListener('chargingchange', update);
    };
  }, []);

  // 3. Xử lý thanh kéo Volume và Mute
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!isMuted && volume === 0) return; // Không mute nếu volume đang là 0
    setIsMuted(!isMuted);
  };

  return (
    <div className={styles.taskbar}>
      
      {/* KHU VỰC BÊN TRÁI: Start (giữ nguyên) */}
      <div className={styles.leftSection}>
        <button data-start-menu className={styles.startBtn} title="Start Menu" onClick={toggleStartMenu}>
          <span className={styles.startIcon}>✿</span>
          <span>Start</span>
        </button>
      </div>

      {/* KHU VỰC GIỮA: Danh sách App đang mở / ghim (giữ nguyên) */}
      <div className={styles.windowTabs}>
        {openWindows.map(win => {
          const app = APPS.find(a => a.id === win.id);
          if (!app) return null;
          
          return (
            <button 
              key={win.id} 
              className={styles.tab}
              onClick={() => onTabClick(win.id)}
              title={app.title}
            >
              <img src={app.icon} alt="" className={styles.tabIcon} />
              <span className={styles.tabTitle}>{app.title.split('.')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* KHU VỰC BÊN PHẢI: System Tray nâng cấp */}
      <div className={styles.systemTray}>
        
        {/* Wi-Fi Icon (sử dụng icon hồng mới) */}
        <div className={styles.trayItem} title="Wi-Fi: Connected to LoveNet_5G">
          <img src={wifiPinkIcon} alt="WiFi" className={styles.pixelIcon} />
        </div>

        {/* Volume & Slider */}
        <div className={`${styles.trayItem} ${styles.volumeTrayItem}`} title={`Volume: ${isMuted ? 'Muted' : volume + '%'}`}>
          {/* Nút bấm Volume Icon */}
          <button 
            className={styles.muteBtn} 
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <img src={volumeIcon} alt="Volume" className={`${styles.pixelIcon} ${isMuted ? styles.mutedIcon : ''}`} />
          </button>
          
          {/* Thanh kéo Volume Slider Retro */}
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={isMuted ? 0 : volume} 
            onChange={handleVolumeChange}
            className={styles.volumeSlider} 
          />
        </div>

        {/* Battery Icon (sử dụng icon mới và đồng bộ thực tế) */}
        <div className={styles.trayItem} title={`Battery: ${batteryLevel}% ${isCharging ? '(Charging)' : ''}`}>
          <img src={batteryIcon} alt="Battery" className={styles.pixelIcon} />
          <span className={`${styles.batteryText} ${isCharging ? styles.charging : ''}`}>{batteryLevel}%</span>
        </div>

        {/* Đồng hồ & Ngày tháng (Format 24h & dd/mm/yyyy) */}
        <div className={styles.clockBox}>
          {/* Giờ 24h: format hh : mm, dấu hai chấm nhấp nháy mỗi giây */}
          <div className={styles.timeText}>
            {time.getHours().toString().padStart(2, '0')}
            <span className={styles.blinkColon}>:</span>
            {time.getMinutes().toString().padStart(2, '0')}
          </div>
          {/* Ngày tháng dd/mm/yyyy: format: vi-VN */}
          <div className={styles.dateText}>
            {time.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </div>
        </div>

        {/* Nút Show Desktop (giữ nguyên) */}
        <button type="button" className={styles.showDesktopBtn} onClick={onShowDesktop} title="Show Desktop" aria-label="Show Desktop" />
      </div>

    </div>
  );
};

export default Taskbar;