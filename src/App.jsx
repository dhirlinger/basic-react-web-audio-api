import './App.css'
import { useEffect, useRef, useState } from 'react';
import NumberInput from './assets/components/NumberInput';

export default function App() {

  const audioContextRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const nowRef = useRef(null);
  const oscStartedRef = useRef(false);
  const seqArrayRef = useRef([]);
  const [freq, setFreq] = useState(440);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveshape, setWaveshape] = useState("square");
  const [seqIsPlaying, setSeqIsPlaying] = useState(false);

  useEffect(()=> {
    audioContextRef.current = new AudioContext();
    oscRef.current = audioContextRef.current.createOscillator();
    gainRef.current = audioContextRef.current.createGain();

    oscRef.current.connect(gainRef.current);
    gainRef.current.connect(audioContextRef.current.destination);
    gainRef.current.gain.value = 0.0;
    nowRef.current = audioContextRef.current.currentTime;
    oscRef.current.addEventListener("ended", () => {console.log('ended')});
    
    return () => {
      audioContextRef.current.close(); 
    };
  }, []);
  
  useEffect(() => {
    oscRef.current.frequency.value = freq;
  }, [freq]);

  useEffect(() => {
    oscRef.current.type = waveshape; 
  }, [waveshape]);
  
  const handlePlay = () => {
    if(!oscStartedRef.current) { 
      oscStartedRef.current = true;
      oscRef.current.start(); 
    }
   
    if(isPlaying === false) { 
      gainRef.current.gain.setTargetAtTime(0.5, audioContextRef.current.currentTime, 0.1);
    } else {
      gainRef.current.gain.setTargetAtTime(0.0, audioContextRef.current.currentTime, 0.1);
    }
    setIsPlaying(!isPlaying);
  }

  const handleShort = () => {
    if(!oscStartedRef.current) { 
      oscStartedRef.current = true;
      oscRef.current.start(); 
    }
    gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, audioContextRef.current.currentTime);
    gainRef.current.gain.linearRampToValueAtTime(0.5, audioContextRef.current.currentTime + 0.001);
    gainRef.current.gain.linearRampToValueAtTime(0.0, audioContextRef.current.currentTime + 0.05);
    
  }

  const handleFreqChange = (event) => {
    setFreq(event.target.value);
  };

  const handleShapeChange = (event) => {
    setWaveshape(event.target.value);
  }

  const handleSeqPlay = () => {
    if(!oscStartedRef.current) { 
      oscStartedRef.current = true;
      oscRef.current.start(); 
    }

    //setSeqIsPlaying(!seqIsPlaying);
    if (!seqIsPlaying) {
      const interval = 80; 
      setSeqIsPlaying(true);
  
      seqArrayRef.current.forEach((val, i) => {
        setTimeout(() => {
          const p = val === 0 ? 0 : 110 * val;
          oscRef.current.frequency.value = p;
          if (p > 0) {
            handleShort();
          }
          console.log(`Played note ${p}`);
          if (i === seqArrayRef.current.length - 1) {
            setSeqIsPlaying(false);
          }
        }, i * interval);
      });
    } else {
      oscRef.current.frequency.value = freq;
      gainRef.current.gain.cancelScheduledValues(audioContextRef.current.currentTime);
      setSeqIsPlaying(false);
    }
  };
  

  

  return (
    <>
      <h1>Web Audio API + React</h1>
      <div className="card">
        <button onClick={handlePlay}>
          {`${isPlaying ? "Stop"  :  "Play" }`}
        </button>
        <button style={{marginLeft: '10px'}} onClick={handleShort}>Short</button>
        <div style={{marginTop: '20px', border: 'solid 1px #666'}}>
          <input type="radio" value="sine" name="waveshape" id="sine" checked={waveshape === "sine"} onChange={handleShapeChange}></input>
          <label htmlFor='sine'>sine</label>
          <input type="radio" value="triangle" name="waveshape" id="triangle" checked={waveshape === "triangle"} onChange={handleShapeChange}></input>
          <label htmlFor='triange'>triangle</label>
          <input type="radio" value="square" name="waveshape" id="square" checked={waveshape === "square"} onChange={handleShapeChange}></input>
          <label htmlFor='square'>square</label>
          <input type="radio" value="sawtooth" name="waveshape" id="sawtooth" checked={waveshape === "sawtooth"} onChange={handleShapeChange}></input>
          <label htmlFor='sawtooth'>sawtooth</label>
        </div>
        <div>
          <h2>Frequency: {freq}</h2>
          <input max="880" min="110" type="range" value={freq} step="110" onChange={handleFreqChange}/>
        </div>
        <div style={{border: 'solid 1px #666', padding: '0 10px 10px', marginTop: "20px"}}>
          <h2 style={{marginBottom: "0", marginTop: "0"}}>Sequencer:</h2>
          <p style={{marginTop: "0"}}>There are 8 frequency values accessable from the frequency slider. Sequence up to 8 positions on the slider (1-8). Enter 0 for a rest in the sequence. Empty boxes will result in a shorter sequence.</p>
            <NumberInput arrIndex={0} array={seqArrayRef}/>
            <NumberInput arrIndex={1} array={seqArrayRef}/>
            <NumberInput arrIndex={2} array={seqArrayRef}/>
            <NumberInput arrIndex={3} array={seqArrayRef}/>
            <NumberInput arrIndex={4} array={seqArrayRef}/>
            <NumberInput arrIndex={5} array={seqArrayRef}/>
            <NumberInput arrIndex={6} array={seqArrayRef}/>
            <NumberInput arrIndex={7} array={seqArrayRef}/>
            <div style={{marginTop: '10px'}}>
              <button onClick={handleSeqPlay}>{seqIsPlaying ? 'Stop' : 'Play Seq'}</button>
              </div>
        </div>
      </div>
      
      
    </>
  )
};
