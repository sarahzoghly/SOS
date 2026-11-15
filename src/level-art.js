// ============================================================
//  LEVEL ART  (the Moon's drawings)
//
//  The Mars level draws its rover and spacecraft right inside index.html.
//  The Moon level shares the same stage, so its drawings live here and are
//  added to the stage when the page loads.
//
//  Actors used by src/moon-data.js and what shows up:
//     "rover"                 the Lunar Roving Vehicle (wheels spin while it arrives)
//     "craft launch"          the Saturn 5 rocket  ("craft launch lift" = it takes off)
//     "craft"                 the Apollo ship on its way to the Moon
//     "lander"                the lunar module Falcon, sitting on the Moon
//     "lander descend"        Falcon coming down on its engine
//     "lander liftoff"        the top half of Falcon flying away (the bottom half stays)
//     "alsep"                 the ALSEP science station
//
//  Colors: --accent is blue for Rover and magenta for Falcon (set by level.js).
// ============================================================

const ROVER = `
<svg id="moon-rover-svg" viewBox="0 0 260 160" xmlns="http://www.w3.org/2000/svg">
  <!-- mesh dish antenna on its mast (front of the rover) -->
  <path d="M192 100 L192 52" stroke="#cfcfcf" stroke-width="4"/>
  <path d="M192 56 L206 40" stroke="#cfcfcf" stroke-width="3"/>
  <g transform="rotate(-32 208 34)">
    <ellipse cx="208" cy="34" rx="30" ry="9" fill="#14142a" stroke="#cfcfcf" stroke-width="2.5"/>
    <path d="M186 34 L230 34 M194 28 L194 40 M202 26 L202 42 M210 25 L210 43 M218 26 L218 42 M226 29 L226 39" stroke="#8d8d9a" stroke-width="1.3"/>
  </g>
  <!-- chassis -->
  <rect x="46" y="98" width="168" height="9" rx="2" fill="#cfcfcf" stroke="#00000f" stroke-width="2"/>
  <rect x="46" y="103" width="168" height="3" fill="var(--accent, #4d4dff)"/>
  <!-- batteries at the back -->
  <rect x="50" y="86" width="40" height="13" rx="2" fill="#8d8d9a" stroke="#00000f" stroke-width="2"/>
  <!-- the second seat (behind) and the first seat -->
  <g stroke="#00000f" stroke-width="1.6">
    <rect x="98" y="66" width="7" height="32" rx="1.5" fill="#9a9aa6" transform="rotate(-8 101 98)"/>
    <rect x="98" y="90" width="34" height="6" rx="1.5" fill="#9a9aa6"/>
    <rect x="108" y="62" width="7" height="34" rx="1.5" fill="#cfcfcf" transform="rotate(-8 111 96)"/>
    <rect x="108" y="88" width="36" height="7" rx="1.5" fill="#cfcfcf"/>
  </g>
  <path d="M113 80 L141 84" stroke="#ff6fc4" stroke-width="2"/>
  <!-- footrest -->
  <path d="M146 94 L162 100" stroke="#cfcfcf" stroke-width="3"/>
  <rect x="158" y="96" width="20" height="4" rx="1" fill="#cfcfcf" stroke="#00000f"/>
  <!-- control and display module + T-shaped hand controller -->
  <rect x="150" y="62" width="30" height="16" rx="2" fill="#cfcfcf" stroke="#00000f" stroke-width="2"/>
  <rect x="154" y="66" width="12" height="8" fill="#00001e" stroke="var(--accent, #4d4dff)"/>
  <path d="M170 78 L170 96" stroke="#cfcfcf" stroke-width="4"/>
  <path d="M142 76 L142 88 M135 76 L149 76" stroke="#e8e8e8" stroke-width="3" stroke-linecap="round"/>
  <!-- suspension -->
  <path d="M70 107 L62 128 M96 107 L62 128 M190 107 L198 128 M164 107 L198 128" stroke="#cfcfcf" stroke-width="4" stroke-linecap="round" fill="none"/>
  <!-- dust guards -->
  <path d="M36 114 Q62 86 88 114 L80 114 Q62 96 44 114 Z" fill="#8d8d9a" stroke="#00000f" stroke-width="2"/>
  <path d="M172 114 Q198 86 224 114 L216 114 Q198 96 180 114 Z" fill="#8d8d9a" stroke="#00000f" stroke-width="2"/>
  <!-- wheels: woven wire mesh with titanium chevrons -->
  <g class="wheel">
    <circle cx="62" cy="128" r="22" fill="#14142a" stroke="#cfcfcf" stroke-width="4"/>
    <circle cx="62" cy="128" r="15" fill="none" stroke="#8d8d9a" stroke-width="5" stroke-dasharray="4 5"/>
    <path d="M62 108 L62 148 M42 128 L82 128" stroke="#cfcfcf" stroke-width="2.5"/>
    <circle cx="62" cy="128" r="5" fill="#cfcfcf"/>
  </g>
  <g class="wheel">
    <circle cx="198" cy="128" r="22" fill="#14142a" stroke="#cfcfcf" stroke-width="4"/>
    <circle cx="198" cy="128" r="15" fill="none" stroke="#8d8d9a" stroke-width="5" stroke-dasharray="4 5"/>
    <path d="M198 108 L198 148 M178 128 L218 128" stroke="#cfcfcf" stroke-width="2.5"/>
    <circle cx="198" cy="128" r="5" fill="#cfcfcf"/>
  </g>
</svg>`;

const CRAFT = `
<svg id="moon-craft-svg" viewBox="0 0 120 360" xmlns="http://www.w3.org/2000/svg">
  <!-- Saturn 5 rocket (liftoff) -->
  <g class="part-rocket" stroke="#00000f" stroke-width="1.6">
    <polygon class="flame" points="38,330 82,330 60,358" fill="#ff7a1a" stroke="none"/>
    <polygon class="flame" points="48,330 72,330 60,350" fill="#ffe08a" stroke="none"/>
    <polygon points="40,300 20,336 40,330" fill="#8d8d9a"/>
    <polygon points="80,300 100,336 80,330" fill="#8d8d9a"/>
    <polygon points="54,306 66,306 66,334 54,334" fill="#8d8d9a"/>
    <rect x="38" y="206" width="44" height="126" fill="#e8e8e8"/>
    <rect x="38" y="238" width="44" height="22" fill="#14142a"/>
    <rect x="38" y="292" width="44" height="6" fill="var(--accent, #4d4dff)"/>
    <rect x="40" y="194" width="40" height="12" fill="#14142a"/>
    <rect x="40" y="142" width="40" height="52" fill="#e8e8e8"/>
    <rect x="40" y="168" width="40" height="8" fill="#14142a"/>
    <rect x="41" y="100" width="38" height="42" fill="#e8e8e8"/>
    <rect x="41" y="92" width="38" height="8" fill="#14142a"/>
    <polygon points="41,92 79,92 72,64 48,64" fill="#cfcfcf"/>
    <rect x="48" y="46" width="24" height="18" fill="#e8e8e8"/>
    <polygon points="48,46 72,46 60,26" fill="#cfcfcf"/>
    <path d="M60 26 L60 8" stroke-width="3" fill="none"/>
    <polygon points="56,12 64,12 60,2" fill="var(--accent, #4d4dff)"/>
  </g>
  <!-- the Apollo ship in space: command and service module with the lander on its nose -->
  <g class="part-capsule" stroke="#00000f" stroke-width="1.6">
    <polygon points="48,300 72,300 80,330 40,330" fill="#8d8d9a"/>
    <rect x="42" y="220" width="36" height="80" fill="#cfcfcf"/>
    <rect x="42" y="250" width="36" height="8" fill="var(--accent, #4d4dff)"/>
    <ellipse cx="90" cy="252" rx="10" ry="4" fill="#cfcfcf" transform="rotate(-25 90 252)"/>
    <path d="M78 256 L88 254" stroke="#cfcfcf" stroke-width="2"/>
    <polygon points="42,220 78,220 60,172" fill="#e8e8e8"/>
    <rect x="55" y="152" width="10" height="20" fill="#8d8d9a"/>
    <polygon points="46,152 74,152 70,118 50,118" fill="#b6b5b5"/>
    <polygon points="56,128 64,128 60,138" fill="#00001e" stroke="#4d4dff" stroke-width="1"/>
    <polygon points="40,118 80,118 88,104 88,86 80,76 40,76 32,86 32,104" fill="#c9a24b"/>
    <path d="M36 80 L22 66 M84 80 L98 66 M36 108 L22 122 M84 108 L98 122" stroke="#cfcfcf" stroke-width="3" fill="none"/>
  </g>
</svg>`;

const LANDER = `
<svg id="moon-lander-svg" viewBox="0 0 260 220" xmlns="http://www.w3.org/2000/svg">
  <!-- bottom half: the descent stage (stays on the Moon) -->
  <g class="lm-descent" stroke="#00000f" stroke-width="2">
    <polygon class="lm-flame" points="118,200 142,200 130,252" fill="#ff7a1a" stroke="none"/>
    <polygon class="lm-flame" points="123,200 137,200 130,230" fill="#ffe08a" stroke="none"/>
    <!-- legs -->
    <path d="M66 172 L30 204" stroke="#cfcfcf" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M86 178 L50 198" stroke="#8d8d9a" stroke-width="3" fill="none"/>
    <path d="M194 172 L230 204" stroke="#cfcfcf" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M174 178 L210 198" stroke="#8d8d9a" stroke-width="3" fill="none"/>
    <path d="M130 180 L130 206" stroke="#cfcfcf" stroke-width="5" fill="none"/>
    <ellipse cx="26" cy="207" rx="15" ry="4.5" fill="#8d8d9a"/>
    <ellipse cx="234" cy="207" rx="15" ry="4.5" fill="#8d8d9a"/>
    <ellipse cx="130" cy="208" rx="14" ry="4" fill="#8d8d9a"/>
    <!-- ladder and platform on the front leg -->
    <path d="M122 134 L119 206 M138 134 L141 206" stroke="#cfcfcf" stroke-width="2.2" fill="none"/>
    <path d="M121 150 L139 150 M121 166 L139 166 M120 182 L140 182 M120 196 L140 196" stroke="#cfcfcf" stroke-width="1.6" fill="none"/>
    <!-- engine bell -->
    <polygon points="114,182 146,182 154,200 106,200" fill="#8d8d9a"/>
    <!-- gold foil body -->
    <polygon points="70,128 190,128 200,138 200,170 190,180 70,180 60,170 60,138" fill="#c9a24b"/>
    <path d="M76 134 L98 176 M104 132 L124 178 M140 132 L158 176 M168 134 L186 174" stroke="#a67f2e" stroke-width="1.6" fill="none"/>
    <rect x="60" y="164" width="140" height="5" fill="var(--accent, #4d4dff)"/>
  </g>
  <!-- top half: the ascent stage (flies home) -->
  <g class="lm-ascent" stroke="#00000f" stroke-width="2">
    <polygon class="lm-ascent-flame" points="116,130 144,130 130,172" fill="#ff7a1a" stroke="none"/>
    <polygon class="lm-ascent-flame" points="122,130 138,130 130,154" fill="#ffe08a" stroke="none"/>
    <!-- antennas -->
    <path d="M150 62 L150 76" stroke="#cfcfcf" stroke-width="3"/>
    <ellipse cx="150" cy="58" rx="17" ry="5" fill="#cfcfcf" transform="rotate(-24 150 58)"/>
    <path d="M110 64 L110 76" stroke="#cfcfcf" stroke-width="3"/>
    <ellipse cx="110" cy="60" rx="10" ry="4" fill="#cfcfcf" transform="rotate(14 110 60)"/>
    <path d="M178 80 L190 50 M82 80 L72 54" stroke="#cfcfcf" stroke-width="2" fill="none"/>
    <!-- crew cabin -->
    <polygon points="90,130 170,130 182,104 172,68 88,68 78,104" fill="#cfcfcf"/>
    <polygon points="98,86 114,86 105,102" fill="#00001e" stroke="#4d4dff" stroke-width="1.5"/>
    <polygon points="146,86 162,86 155,102" fill="#00001e" stroke="#4d4dff" stroke-width="1.5"/>
    <rect x="121" y="96" width="18" height="20" rx="2" fill="#8d8d9a"/>
    <rect x="76" y="94" width="11" height="18" rx="2" fill="#8d8d9a"/>
    <rect x="173" y="94" width="11" height="18" rx="2" fill="#8d8d9a"/>
    <rect x="80" y="118" width="100" height="5" fill="var(--accent, #4d4dff)"/>
  </g>
</svg>`;

const ALSEP = `
<svg id="moon-alsep-svg" viewBox="0 0 260 160" xmlns="http://www.w3.org/2000/svg">
  <!-- cables -->
  <path d="M52 138 Q78 154 104 138 M148 136 Q168 152 188 140 M148 130 Q190 120 218 138" stroke="#8d8d9a" stroke-width="2" fill="none"/>
  <!-- data going to Earth -->
  <g class="alsep-signal" fill="none" stroke="#9c9cff" stroke-width="3" stroke-linecap="round">
    <path d="M106 46 Q96 40 94 28"/>
    <path d="M98 56 Q82 46 78 24"/>
    <path d="M90 66 Q68 52 62 20"/>
  </g>
  <g stroke="#00000f" stroke-width="2">
    <!-- the central station and its antenna -->
    <path d="M126 108 L116 62" stroke="#cfcfcf" stroke-width="5"/>
    <path d="M124 100 L132 96 M122 90 L130 86 M120 80 L128 76 M118 70 L126 66" stroke="#e8e8e8" stroke-width="2.5"/>
    <rect x="102" y="108" width="48" height="34" rx="2" fill="#cfcfcf"/>
    <rect x="102" y="108" width="48" height="9" fill="#c9a24b"/>
    <rect x="102" y="132" width="48" height="4" fill="var(--accent, #4d4dff)"/>
    <!-- the nuclear power generator (RTG) with its fins -->
    <rect x="31" y="100" width="22" height="44" rx="2" fill="#8d8d9a"/>
    <path d="M22 108 L62 108 M22 118 L62 118 M22 128 L62 128 M22 138 L62 138" stroke="#cfcfcf" stroke-width="3"/>
    <rect x="35" y="94" width="14" height="8" fill="#14142a"/>
    <!-- seismometer dome -->
    <path d="M172 146 Q172 128 188 128 Q204 128 204 146 Z" fill="#cfcfcf"/>
    <path d="M178 140 L198 140" stroke="#8d8d9a" stroke-width="2"/>
    <!-- magnetometer with three sensors on booms -->
    <path d="M222 146 L222 124 M222 124 L238 112 M222 124 L206 112 M222 124 L222 102" stroke="#cfcfcf" stroke-width="2.5" fill="none"/>
    <circle cx="238" cy="112" r="4.5" fill="#cfcfcf"/>
    <circle cx="206" cy="112" r="4.5" fill="#cfcfcf"/>
    <circle cx="222" cy="102" r="4.5" fill="#cfcfcf"/>
    <rect x="216" y="142" width="12" height="6" fill="#8d8d9a"/>
    <!-- heat flow probes -->
    <rect x="158" y="128" width="3.5" height="18" fill="#e8e8e8"/>
    <rect x="164" y="132" width="3.5" height="14" fill="#e8e8e8"/>
  </g>
</svg>`;

// adds the Moon's drawings to the stage (called once when the page loads)
export function installMoonArt() {
  const actor = document.getElementById('mars-actor');
  if (!actor || document.getElementById('moon-rover-svg')) return;
  actor.insertAdjacentHTML('beforeend', ROVER + CRAFT + LANDER + ALSEP);
}
