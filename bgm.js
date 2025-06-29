const caches = {};
let currentaudio = null;
const getAudio = (fn) => {
  const cache = caches[fn];
  if (cache) return cache;
  const audio = new Audio();
  audio.src = fn;
  caches[fn] = audio;
  return audio;
};
const waitForAudioEnd = async (audioElement) => {
  return new Promise((resolve, reject) => {
    if (audioElement.ended) {
      resolve();
      return;
    }
    audioElement.addEventListener("ended", resolve, { once: true });
    audioElement.addEventListener("error", reject, { once: true });
  });
};
export const playBGM = async (audio) => {
  const stop = currentaudio == audio;
  stopBGM();
  if (stop) return;
  audio.currentTime = 0;
  audio.play();
  currentaudio = audio;
  await waitForAudioEnd(audio);
  currentaudio = null;
};
export const stopBGM = () => {
  if (currentaudio) {
    currentaudio.pause();
    currentaudio = null;
  }
};

let idx = 0;
export const playBGMs = async (bgms) => {
  if (currentaudio) {
    stopBGM();
    return;
  }
  for (;;) {
    const bgm = bgms[idx % bgms.length];
    idx++;
    console.log(bgm)
    const audio = getAudio(bgm);
    await playBGM(audio);
    if (!currentaudio) break;
  }
};
