import { useState } from 'react';
import { useTheme } from '../ThemeContext';

const MenuSettings = () => {
  const [uiVolume, setUiVolume] = useState(50);
  const [musicVolume, setMusicVolume] = useState(50);
  const [accessibility, setAccessibility] = useState('none');
  const { theme, setTheme } = useTheme();

  return (
    <div className='settings-container'>
      <div className='settings-card'>
        <div className='settings-item'>
          <label>UI Volume</label>
          <input
            type='range'
            min='0'
            max='100'
            value={uiVolume}
            onChange={(e) => setUiVolume(Number(e.target.value))}
            className='ui-slider'
          />
        </div>
        <div className='settings-item'>
          <label>Music Volume</label>
          <input
            type='range'
            min='0'
            max='100'
            value={musicVolume}
            onChange={(e) => setMusicVolume(Number(e.target.value))}
            className='music-slider'
          />
        </div>
        <div className='settings-item'>
          <label>Accessibility Options</label>
          <select
            value={accessibility}
            onChange={(e) => setAccessibility(e.target.value)}
          >
            <option value='none'>None</option>
            <option value='high-contrast'>High Contrast</option>
            <option value='text-to-speech'>Text to Speech</option>
          </select>
        </div>
        <div className='settings-item'>
          <label>Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value='light'>Light</option>
            <option value='dark-theme'>Dark</option>
            <option value='high-contrast-theme'>High Contrast</option>
          </select>
        </div>
        <div className='settings-item'>
          <label>Credits</label>
          <p className='credits-text'>Our Names</p>
        </div>
      </div>
    </div>
  );
};

export default MenuSettings;

