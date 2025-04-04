import './App.css'
import { useEffect, useRef, useState } from 'react';

export default function App() {

  const audioContextRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const nowRef = useRef(null);
  const oscStartedRef = useRef(false);
  const freqRef = useRef(440);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(()=> {
    audioContextRef.current = new AudioContext();
    oscRef.current = audioContextRef.current.createOscillator();
    gainRef.current = audioContextRef.current.createGain();

    oscRef.current.connect(gainRef.current);
    gainRef.current.connect(audioContextRef.current.destination);
    gainRef.current.gain.value = 0.0;
    nowRef.current = audioContextRef.current.currentTime;
    oscRef.current.frequency.value = 440; 
    
    return () => {
      audioContextRef.current.close(); 
    };
  }, []);
  
  
  const handleClick = () => {
    if(!oscStartedRef.current) { 
      oscStartedRef.current = true;
      oscRef.current.start(); 
    }

    if(!isPlaying) { 
      gainRef.current.gain.setTargetAtTime(0.05, nowRef.current, 0.1);
    } else {
      gainRef.current.gain.setTargetAtTime(0.0, nowRef.current, 0.1);
    }

    setIsPlaying(!isPlaying);
  }

  return (
    <>
      <h1>Web Audio API + React</h1>
      <div className="card">
        <button onClick={handleClick}>
          {`${isPlaying ? "stop"  :  "play" }`}
        </button>
      </div>
      
    </>
  )
};
