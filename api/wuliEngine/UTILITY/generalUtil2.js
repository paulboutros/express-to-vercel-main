function parseNumberArray(value) {
    if (Array.isArray(value)) return value;

    if (typeof value !== "string") return [];

    return value
        .split(",")
        .map(v => Number(v.trim()))
        .filter(v => !Number.isNaN(v));
}

function pad(num, size = 4) {
  let s = String(num);
  while (s.length < size) s = '0' + s;
  return s;
}


  function mapSetToObject(map) {
  return Object.fromEntries(
    [...map.entries()].map(([key, value]) => [
      key,
      value instanceof Set ? [...value] : value
    ])
  );
  }


function serializeActiveTraitUI(TraitUI) {
  const list = [];

  for (const [traitKey, values] of  TraitUI.entries()) {
    for (const value of values) {
      list.push({ traitKey, value });
    }
  }

  return list;
}

function pillsArrayToTraitMap(pills) {
  const resultMap = new Map();

  pills.forEach(({ traitKey, value }) => {
    if (!resultMap.has(traitKey)) {
      resultMap.set(traitKey, new Set());
    }

    resultMap.get(traitKey).add(value);
  });

  return resultMap;
}

function buildObject(config, prefix) {

    const obj = {};
    const search = prefix + ".";

    for (const key in config) {

        if (!key.startsWith(search))
            continue;

        const path = key.slice(search.length).split(".");

        let current = obj;

        while (path.length > 1) {

            const part = path.shift();

            if (!current[part]) {
                current[part] = {};
            }

            current = current[part];
        }

        current[path[0]] = Number(config[key]);

    }

    return obj;
}




//================================================
//================================================= 


function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(array, seedInput) {
  const result = [...array];
  const rand = mulberry32(hashString(String(seedInput)));

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
 
function buildTraitSeed(renderTraitObject) {
  return Object.keys(renderTraitObject)
    .sort()
    .map(traitKey => {
      const values = [...renderTraitObject[traitKey]].sort();
      return `${traitKey}:${values.join(",")}`;
    })
    .join("|");
}

//================================================
//================================================





  

module.exports ={
  buildObject,
   parseNumberArray,pad, mapSetToObject , pillsArrayToTraitMap , 
  serializeActiveTraitUI,
  seededShuffle ,buildTraitSeed
 }