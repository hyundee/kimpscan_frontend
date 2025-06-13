const crc32Table: number[] = (() => {
  const table: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(str: string): number {
  let crc = 0 ^ (-1);

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    crc = (crc >>> 8) ^ crc32Table[(crc ^ code) & 0xff];
  }

  return (crc ^ (-1)) >>> 0;
}
