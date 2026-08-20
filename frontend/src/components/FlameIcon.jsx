export function flameHtml(size = 28) {
  return `
  <div class="fireMarkerWrap" style="width:${size}px;height:${size}px">
    <svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">
      <path d="M34 4c3 11-5 15-1 25 3-3 5-8 6-13 9 8 15 18 15 28 0 12-10 18-22 18S10 56 10 44c0-12 8-21 17-29-1 7 1 12 5 15 1-8 4-15 2-26z" fill="#d84a38"/>
      <path d="M31 28c1 7-5 10-5 17 0 5 4 9 9 9s9-4 9-9c0-6-4-11-8-15 0 5-2 8-5 10 1-4 1-8 0-12z" fill="#f2a13d"/>
    </svg>
  </div>`;
}
