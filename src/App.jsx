import './App.css'
import { useEffect, useRef, useState } from 'react';

export default function App() {

  const audioContextRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const nowRef = useRef(null);
  const oscStartedRef = useRef(false);
  const [freq, setFreq] = useState(440);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(()=> {
    audioContextRef.current = new AudioContext();
    oscRef.current = audioContextRef.current.createOscillator();
    gainRef.current = audioContextRef.current.createGain();

    oscRef.current.connect(gainRef.current);
    gainRef.current.connect(audioContextRef.current.destination);
    gainRef.current.gain.value = 0.0;
    nowRef.current = audioContextRef.current.currentTime;
    
    return () => {
      audioContextRef.current.close(); 
    };
  }, []);
  
  useEffect(() => {
    oscRef.current.frequency.value = freq;
  }, [freq]);
  
  const handleClick = () => {
    if(!oscStartedRef.current) { 
      oscStartedRef.current = true;
      oscRef.current.start(); 
    }

    if(!isPlaying) { 
      gainRef.current.gain.setTargetAtTime(0.5, nowRef.current, 0.1);
    } else {
      gainRef.current.gain.setTargetAtTime(0.0, nowRef.current, 0.1);
    }

    setIsPlaying(!isPlaying);
  }

  const handleFreqChange = (event) => {
    setFreq(event.target.value);
  };

  return (
    <>
      <h1>Web Audio API + React</h1>
      <div className="card">
        <button onClick={handleClick}>
          {`${isPlaying ? "Stop"  :  "Play" }`}
        </button>
        <div>
          <h2>Frequency: {freq}</h2>
          <input max="880" min="110" type="range" value={freq} step="110" onChange={handleFreqChange}/>
        </div>
      </div>
      
      
    </>
  )
};
