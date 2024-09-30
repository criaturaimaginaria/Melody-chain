
'use client';
import { useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import { database } from '../../firebase.config'
import { ref, set, push, get } from 'firebase/database';
import { onValue } from 'firebase/database';
import tracks from './tracks';
import styles from './page.module.css'


export default function Home() {
  const [selectedTracks, setSelectedTracks] = useState([]);
  // const [blocks, setBlocks] = useState([]);
  //WITH GENESIS BLOCK
  const [blocks, setBlocks] = useState([{ tracks: [tracks[0]], name: 'Bloque Génesis' }]);
  const [blockName, setBlockName] = useState('');
  const [playingBlock, setPlayingBlock] = useState(null); 
  const [playingTrack, setPlayingTrack] = useState(null); 
  const currentHowlRef = useRef(null);
  const crossfadeDuration = 1;
  const [visibleTracks, setVisibleTracks] = useState(16); 
  const [blocksUntilHalving, setBlocksUntilHalving] = useState(4); 
  const [halvingMessage, setHalvingMessage] = useState("");

  const [trackOffset, setTrackOffset] = useState(0); 
  const blockTimeoutRef = useRef(null); 
  const [disabledGroups, setDisabledGroups] = useState([]);
  const [blockMined, setBlockMined] = useState(false); 
  const [mounted, setMounted] = useState(false); 
  const [chainStarted, setChainStarted] = useState(false); 
  const [gridClass, setGridClass] = useState("tracksContainer"); 




  useEffect(() => {
    const blocksRef = ref(database, 'blocks');
  
    const unsubscribe = onValue(blocksRef, (snapshot) => {
      const blocksData = snapshot.val();
      if (blocksData) {
        const loadedBlocks = Object.values(blocksData); 
        setBlocks(loadedBlocks);
      }
    });



    const gameStateRef = ref(database, 'gameState');
    onValue(gameStateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // setTrackOffset(data.trackOffset || 0);
        setVisibleTracks(data.visibleTracks || 16);
        // setDisabledGroups(data.disabledGroups || []);
      }
    });
      setMounted(true)
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const gameStateRef = ref(database, 'gameState');
    const chainStartedRef = ref(database, 'chainStarted');

    onValue(chainStartedRef, (snapshot) => {
      const chainStartedData = snapshot.val();
      if (chainStartedData !== null) {
        setChainStarted(chainStartedData); 
      }
    });


    // set(chainStartedRef, true); // Establece 'chainStarted' en true
  
    onValue(gameStateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // setTrackOffset(data.trackOffset || 0); 
        setVisibleTracks(data.visibleTracks || 16); 
        // setDisabledGroups(data.disabledGroups || []); 
      }
    });
  }, []);


  useEffect(() => {
    let dbBlocks = blocks?.length - 1
console.log("dbBlocks", dbBlocks)

    if (dbBlocks == 1 ) { 
      setTrackOffset(16);
      setVisibleTracks(16)
      setGridClass("tracksContainer")
    }
    if (dbBlocks == 2 )  { 
      setTrackOffset(32);
      setVisibleTracks(16)
      setGridClass("tracksContainer")
    }
    if (dbBlocks == 3) { 
      setTrackOffset(48);
      setVisibleTracks(16)
      setGridClass("tracksContainer")
    }
    if (dbBlocks == 4) { 
      setTrackOffset(64);
      setVisibleTracks(8)
      setGridClass("tracksContainer2")
    }
    if (dbBlocks == 5 ) { 
      setTrackOffset(72);
      setVisibleTracks(8)
      setGridClass("tracksContainer2")
    }
    if (dbBlocks == 6 )  { 
      setTrackOffset(80);
      setVisibleTracks(8)
      setGridClass("tracksContainer2")
    }
    if (dbBlocks == 7) { 
      setTrackOffset(88);
      setVisibleTracks(8)
      setGridClass("tracksContainer2")
    }
    if (dbBlocks == 8) { 
      setTrackOffset(96);
      setVisibleTracks(4)
      setGridClass("tracksContainer3")
    }
    if (dbBlocks == 9 ) { 
      setTrackOffset(100);
      setVisibleTracks(4)
      setGridClass("tracksContainer3")
    }
    if (dbBlocks == 10 )  { 
      setTrackOffset(104);
      setVisibleTracks(4)
      setGridClass("tracksContainer3")
    }
    if (dbBlocks == 11) { 
      setTrackOffset(108);
      setVisibleTracks(4)
      setGridClass("tracksContainer3")
    }
    if (dbBlocks == 12) { 
      setTrackOffset(112);
      setVisibleTracks(2)
      setGridClass("tracksContainer4")
    }
    if (dbBlocks == 13) { 
      setTrackOffset(114);
      setVisibleTracks(2)
      setGridClass("tracksContainer4")
    }
    if (dbBlocks == 14) { 
      setTrackOffset(116);
      setVisibleTracks(2)
      setGridClass("tracksContainer4")
    }
    if (dbBlocks == 15) { 
      setTrackOffset(118);
      setVisibleTracks(2)
      setGridClass("tracksContainer4")
    }
    if (dbBlocks == 16) { 
      setTrackOffset(120);
      setVisibleTracks(1)
      setGridClass("tckCont5")
    }
    if (dbBlocks == 17) { 
      setTrackOffset(120);
      setVisibleTracks(1)
      setGridClass("tckCont5")
    }
    if (dbBlocks == 18) { 
      setTrackOffset(121);
      setVisibleTracks(1)
      setGridClass("tckCont5")
    }
    if (dbBlocks == 19) { 
      setTrackOffset(122);
      setVisibleTracks(1)
      setGridClass("tckCont5")
    }


  }, [blocks]);

  

  const getTrackGroup = (trackId) => {
    if (trackId <= 64) {
      return Math.floor((trackId - 1) / 4); 
    } else if (trackId >= 65 && trackId <= 96) {
      return Math.floor((trackId - 1) / 2); 
    } else if (trackId >= 97 && trackId <= 112) {
      return Math.floor((trackId - 1) / 2); 
    } else if (trackId >= 113 && trackId <= 120) {
      return Math.floor((trackId - 1) / 1); 
    } else if (trackId >= 121) {
      return Math.floor((trackId - 1) / 1); 
    }
    return -1;

  };
  

  const handleTrackSelection = (track) => {
    if (selectedTracks.length < 4) {
      const newSelectedTracks = [...selectedTracks, track];
      setSelectedTracks(newSelectedTracks);
  
      const groupToDisable = getTrackGroup(track.id);
      if (!disabledGroups.includes(groupToDisable)) {
        const updatedGroups = [...disabledGroups, groupToDisable];
        setDisabledGroups(updatedGroups);
  
        const gameStateRef = ref(database, 'gameState');
        set(gameStateRef, {
          trackOffset: trackOffset, 
          visibleTracks: visibleTracks, 
        });
      }
    }
  };
  

  const stopAllSounds = () => {
    if (currentHowlRef.current) {
      currentHowlRef.current.forEach((howl) => howl.stop());
    }
    setPlayingTrack(null);
    setPlayingBlock(null);

  clearTimeout(blockTimeoutRef.current);
  blockTimeoutRef.current = null;
  };

  const removeSelectedTrack = (trackId) => {
    const newSelectedTracks = selectedTracks.filter((track) => track.id !== trackId);
    setSelectedTracks(newSelectedTracks);
  
    // Habilitar el grupo al que pertenece el track
    const groupToEnable = getTrackGroup(trackId);
    setDisabledGroups(disabledGroups.filter(group => group !== groupToEnable));
  };
  


  const createBlock = async() => {
    const chainStartedRef = ref(database, 'chainStarted');
    // setBlockMined(true)
    set(chainStartedRef, true); // Establece 'chainStarted' en true
    
    if (selectedTracks.length > 0) {
      const blocksRef = ref(database, 'blocks');

    const snapshot = await get(blocksRef);
    const blocksData = snapshot.val();

    const gameStateRef = ref(database, 'gameState');
    set(gameStateRef, {
      trackOffset: trackOffset,
      visibleTracks: visibleTracks,
    });
    
    if (!blocksData) {
      const genesisBlock = { tracks: [tracks[0]], name: 'Bloque Génesis' };
      push(blocksRef, genesisBlock);
    }

      const newBlock = { tracks: selectedTracks, name: blockName || `Bloque ${blocks.length +1 }` };
      setBlocks([...blocks, newBlock]);
      setSelectedTracks([]);
      setBlockName('');
      setHalvingMessage("")
      push(blocksRef, newBlock);
      

      if ((blocks.length + 1) <= 5 ) { 
        setTrackOffset(prevOffset => prevOffset + 16);
        setVisibleTracks(16)
      }
      if ((blocks.length + 1) <= 9 && (blocks.length + 1)  >= 6) { 
        setTrackOffset(prevOffset => prevOffset + 8);
        setVisibleTracks(8)
      }
      if ((blocks.length + 1) <= 13 && (blocks.length + 1)  >= 10) { 
        setTrackOffset(prevOffset => prevOffset + 4);
        setVisibleTracks(4)
      }
      if ((blocks.length + 1) <= 17 && (blocks.length + 1)  >= 14) { 
        setTrackOffset(prevOffset => prevOffset + 2);
        setVisibleTracks(2)
      }
      if ((blocks.length + 1)  >= 18) { 
        setTrackOffset(prevOffset => prevOffset + 1 );
        setVisibleTracks(1)
        // setTrackOffset(0);
      }

      const blockRef = ref(database, 'blocks');


    if ((blocks.length - 1 + 1) % 4 === 0) { 
      setVisibleTracks(prev => Math.ceil(prev / 2));
      setHalvingMessage("Primer bloque de halving :D");
    }


      if (blocks.length + 1 === 20) {
        setHalvingMessage("Último bloque de la melody chain");
      }
      

      setBlocksUntilHalving(prev => (prev - 1 === 0 ? 4 : prev - 1));
    } else {
      alert('Selecciona al menos 1 pista para crear un bloque');
      setHalvingMessage("")
    }
  };


  const playBlockSimultaneously = (block, callback) => {
    stopAllSounds();
    const howls = block.tracks.map((track) => new Howl({
      src: [track.src],
      volume: 1.0,
      onend: () => setPlayingBlock(null), // Actualizar estado cuando termine.
    }));

    howls.forEach((howl) => howl.play());

    const longestDuration = Math.max(...howls.map(howl => howl.duration()));


  blockTimeoutRef.current = setTimeout(() => {
    callback && callback();
  }, (longestDuration - crossfadeDuration) * 1000);


    currentHowlRef.current = howls;
    setPlayingBlock(block);
  };




  const playBlocksSequentiallyWithEvents = (blocks) => {
    let blockIndex = 0;
    if (blocks.length === 0) return;
  
    const playNextBlock = () => {
      if (blockIndex < blocks.length) {
        const block = blocks[blockIndex];
        stopAllSounds(); 
  
        const howls = block.tracks.map((track) => new Howl({
          src: [track.src],
          volume: 1.0,
          onend: () => {
            console.log(`Track ${track.id} from block ${block.name} ended`);
          }
        }));
  

  
    howls.forEach((howl) => howl.play());
    currentHowlRef.current = howls;
    setPlayingBlock(block);

    const longestDuration = Math.max(...howls.map(howl => howl.duration()));
    const fadeTime = Math.max(0, (longestDuration - crossfadeDuration) * 1000)

  
    blockTimeoutRef.current = setTimeout(() => {
      if (blockIndex < blocks.length - 1) {
        blockIndex++;
        playNextBlock();
      } else {
        setTimeout(stopAllSounds, longestDuration * 1000);
      }
    }, fadeTime);


    
  }
};

    stopAllSounds();
    clearTimeout(blockTimeoutRef.current);
    playNextBlock();
  };
  


  const playBlocksSequentially = (blocks) => {
    let blockIndex = 0;
    if (blocks.length === 0) {
      return;
    }

    const playNextBlock = () => {
      if (blockIndex < blocks.length) {
        playBlockSimultaneously(blocks[blockIndex], () => {
          blockIndex++;
          playNextBlock();
        });
      }
    };

    stopAllSounds();
    playNextBlock();
  };


  const playTrackSection1 = (track) => {
    stopAllSounds();
    const sound = new Howl({
      src: [track.src],
      volume: 1.0,
      onplay: () => setPlayingTrack(track.id),
      onend: () => setPlayingTrack(null),
    });
    sound.play();
    currentHowlRef.current = [sound];
  };
  
  const previewBlockSection2 = (block) => {
    stopAllSounds();
    const howls = block.tracks.map((track) => new Howl({ src: [track.src], volume: 1.0 }));
    howls.forEach((howl) => howl.play());
    currentHowlRef.current = howls;
    setPlayingBlock(block);
  };
  



  return (
    <div className={styles.homeContainer}>
      <div className={styles.home}>

        <div className={styles.header}>
          <h1>Melody <text>₿lock</text>chain</h1>
        </div>
        {/* <h2>Sección 1: Elige tus pistas</h2> */}
        <div className={styles.sectionOne}>
          <h2>1- Fragments</h2>
          <div className={styles.clefssAndTracks}>

            <div className={styles.clefsContainer}>
              <div className={styles.clefLine}></div>

              <div className={styles.sol}><img src='./images/sol.png'></img> </div>
              <div className={(gridClass === "tracksContainer3" || gridClass === "tracksContainer4" || gridClass === "tckCont5") ? styles.clefNone : styles.sol2}><img src='./images/sol.png'></img> </div>
              <div className={(gridClass === "tracksContainer3" || gridClass === "tracksContainer4" || gridClass === "tckCont5") ? styles.clefNone : styles.do}><img src='./images/do.png'></img> </div>
              <div className={gridClass == "tckCont5" ? styles.clefNone : styles.Fa}><img src='./images/fa.png'></img> </div>
            </div>

              <div className={styles[gridClass]}>
              {mounted == true ? 
              <>
                {tracks.slice(trackOffset, trackOffset + visibleTracks).map((track) => {
                  const trackGroup = getTrackGroup(track.id);
                  const isGroupDisabled = disabledGroups.includes(trackGroup);
                  return (
                    <div
                      className={styles.trackItem}
                      key={track.id}
                      style={{
                        // 1F9EC9
                        // 5FBDD6
                        // 07010F
                        backgroundColor: playingTrack === track.id ? '#1F9EC9' : 'transparent',
                        opacity: isGroupDisabled ? 0.35 : 1,
                      }}
                    >
                      <p>{track.name}</p>
                      <button className={styles.button} onClick={() => playTrackSection1(track)} disabled={isGroupDisabled}>Play</button>
                      <button className={styles.button} onClick={stopAllSounds}>Stop</button>   
                      <button className={styles.buttonSelect} onClick={() => handleTrackSelection(track)} disabled={isGroupDisabled || blocks.length >= 20 || blockMined == true}>
                        Select
                      </button>
                    </div>
                  );
                })}
              </> : 
              <>
                Loading...
              </>}
            </div>
          </div>  
            {/* <button onClick={stopAllSounds}>Stop</button>       */}
        </div>


      <div className={styles.sectionTwo}>
          <h2>2- Mempool </h2>
            <div className={styles.mempoolContainer}>
              <div className={styles.mempoolBox}>

                <div className={styles.columnContainer}>
                {selectedTracks.map((track) => (
                  <div className={styles.mempoolItem} key={track.id}>
                    <span>{track.name}</span>
                    <button onClick={() => removeSelectedTrack(track.id)}>Eliminar</button>
                  </div>
                ))}  
                </div>

              
              </div>

              <div className={styles.mempoolButtons}>
                  <input
                    type="text"
                    placeholder="Name the block"
                    value={blockName}
                    onChange={(e) => setBlockName(e.target.value)}
                  />
                  <button id={styles.confirmBlock} onClick={createBlock} disabled={blocks.length >= 20 || blockMined == true}>Confirmar bloque</button>
                  {/* <button onClick={() => previewBlock({ tracks: selectedTracks })}>Escuchar bloque</button> */}
                  <button onClick={() => previewBlockSection2({ tracks: selectedTracks })}>Escuchar bloque</button>

                  <button onClick={stopAllSounds}>Detener bloque</button>
              </div>
            </div>
      </div>

    <div className={styles.sectionThree}>

      <h2>3- Melody chain</h2>

      <div className={styles.halvingCountdown}>
        <h3>
            {blocks?.length < 20 ? (
              <p>
                 {(Math.ceil(blocks?.length / 4) * 4 - blocks?.length) +1 } bloques para el próximo halving
              </p>
            ) : (
              <p>Ya se ha minado toda la música, melody chain ha finalizado.</p>
            )}
        </h3>
        <h4>{halvingMessage}</h4>
      </div>


      <div className={styles.melodyChainContainer} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', }}>
        {blocks.map((block, index) => (
          <div
            key={index}
            className={styles.block}
            style={{
              backgroundColor: playingBlock === block ? '#31cd19' : '#006edc',
              color: playingBlock === block ? '#fff' : '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <text>Bloque {index + 1}</text>
            <p>{block.name}</p>
            <button onClick={() => playBlocksSequentially([block])}>Reproducir bloque</button>
          </div>
        ))}
      </div>

      <div className={styles.buttonsContainer}>
        <button id={styles.chainButton1} onClick={() => playBlocksSequentiallyWithEvents(blocks)}>Play chain</button>
        <button id={styles.chainButton2} onClick={stopAllSounds}>Stop chain</button> 
      </div>


    </div>

      </div>
    </div>
  );
}

