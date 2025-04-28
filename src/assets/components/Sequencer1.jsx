import React, { useRef, useState, useEffect } from "react";
import Seq1Voice from "../Seq1Voice";
import NumberInput from "./NumberInput";

export default function Sequencer1() {
  const seqArrayRef = useRef([]);
  const [seqIsPlaying, setSeqIsPlaying] = useState(false);
  const seq1Instance = useRef(null);

  useEffect(() => {
    seq1Instance.current = new Seq1Voice(400);
  }, []);

  const handleClick = () => {
    setSeqIsPlaying(!seqIsPlaying);
    seq1Instance.current.startStop(seqArrayRef.current);
  };

  return (
    <>
      <div
        style={{
          border: "solid 1px #666",
          padding: "0 10px 10px",
          marginTop: "20px",
        }}
      >
        <h2 style={{ marginBottom: "0", marginTop: "0" }}>Sequencer:</h2>
        <p style={{ marginTop: "0" }}>
          There are 8 frequency values accessable from the frequency slider.
          Sequence up to 8 positions on the slider (1-8). Enter 0 for a rest in
          the sequence. Empty boxes will result in a shorter sequence.
        </p>
        <NumberInput arrIndex={0} array={seqArrayRef} />
        <NumberInput arrIndex={1} array={seqArrayRef} />
        <NumberInput arrIndex={2} array={seqArrayRef} />
        <NumberInput arrIndex={3} array={seqArrayRef} />
        <NumberInput arrIndex={4} array={seqArrayRef} />
        <NumberInput arrIndex={5} array={seqArrayRef} />
        <NumberInput arrIndex={6} array={seqArrayRef} />
        <NumberInput arrIndex={7} array={seqArrayRef} />
        <div style={{ marginTop: "10px" }}>
          <button onClick={handleClick}>
            {seqIsPlaying ? "Stop" : "Play Seq"}
          </button>
        </div>
      </div>
    </>
  );
}
