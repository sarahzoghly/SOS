// ============================================================
//  MARS STORY DATA
//  All the words, dates and questions live here.
//  To change the story, edit this file. You don't need to touch mars.js.
//
//  How a scene works:
//    title / date / place  -> shown on the chapter card
//    bg                    -> which backdrop to use (see "backdrops" below)
//    actor                 -> what is drawn on the stage (see list below)
//    beats                 -> the lines of the scene, played one click at a time
//    entry                 -> the text that gets written in the book when the scene ends
//
//  Beat types:
//    { who: "me", text: "..." }          the rover talks
//    { who: "earth", text: "..." }       mission control talks
//    { who: "narrator", text: "..." }    plain story text
//    { type: "meanwhile", text: "..." }  what the OTHER rover is doing
//    { type: "choice", prompt: "...", options: [ { label, who, text } ] }
//    { type: "found", img, title, caption }   a photo / document you "find"
//
//  Any beat can also have:  date: "2004-01-24"  (the day counter jumps to it)
//                           approx: true        (date is only roughly right, counter shows ~)
//                           bg: "night"         (change the backdrop in the middle of a scene)
//                           actor: "rover dark" (change what is on the stage)
//
//  Actors:  "rover"  "rover left"  "rover right"  "rover stuck"  "rover dark"
//           "craft"  "craft launch"  "craft chute"  "none"
//
//  Facts come from NASA's Mars Exploration Rovers pages, the PDF and your notes.
// ============================================================

const IMG = "assets/images/mars/";

// Day 0 on the counter is the day each rover launched.
export const rovers = {
  opportunity: {
    name: "Opportunity",
    nickname: "MER-B",
    launch: "2003-07-07",
    accent: "#4d4dff",
    light: "#9c9cff",
    other: "spirit",
    tagline: "Lands on the flat plains of Meridiani Planum, where minerals hint at ancient water.",
    stats: ["Lasted 14+ years", "Drove 28 miles (45.16 km)", "217,594 raw images"]
  },
  spirit: {
    name: "Spirit",
    nickname: "MER-A",
    launch: "2003-06-10",
    accent: "#be007d",
    light: "#ff6fc4",
    other: "opportunity",
    tagline: "Lands in Gusev Crater, a possible former lake, and climbs a hill nobody expected a rover to climb.",
    stats: ["Lasted 6 years", "Drove 4.8 miles (7.7 km)", "124,838 raw images"]
  }
};

// Backdrops are just colors. The stage paints a sky, two layers of hills and some stars.
export const backdrops = {
  launch:  { skyTop: "#02020f", skyBottom: "#4b3a78", far: "#0b0b24", ground: "#07071a", stars: 0.8, dust: 0,    sun: 0 },
  space:   { skyTop: "#00000f", skyBottom: "#000030", far: "transparent", ground: "transparent", stars: 1, dust: 0, sun: 0 },
  entry:   { skyTop: "#2a0505", skyBottom: "#ff7a1a", far: "transparent", ground: "transparent", stars: 0.1, dust: 0.35, sun: 0 },
  plain:   { skyTop: "#9a6f4d", skyBottom: "#d9aa78", far: "#a8653c", ground: "#8a4a2a", stars: 0, dust: 0.1, sun: 0.9 },
  gusev:   { skyTop: "#8f5f45", skyBottom: "#cf9a6e", far: "#7a4630", ground: "#6e3a22", stars: 0, dust: 0.1, sun: 0.8 },
  crater:  { skyTop: "#7a5238", skyBottom: "#b8865a", far: "#5c3322", ground: "#4a2616", stars: 0, dust: 0.1, sun: 0.7 },
  dunes:   { skyTop: "#a87a52", skyBottom: "#e0b27c", far: "#c47f45", ground: "#b8692f", stars: 0, dust: 0.15, sun: 0.9 },
  hills:   { skyTop: "#7d5a48", skyBottom: "#c8956a", far: "#5a3a2c", ground: "#4d2c1c", stars: 0, dust: 0.1, sun: 0.8 },
  storm:   { skyTop: "#2e1f18", skyBottom: "#6b4430", far: "#3a261c", ground: "#2a1a12", stars: 0, dust: 0.75, sun: 0 },
  night:   { skyTop: "#00000f", skyBottom: "#14091f", far: "#1a0d12", ground: "#120808", stars: 1, dust: 0, sun: 0 },
  dusk:    { skyTop: "#05051f", skyBottom: "#4a78b8", far: "#2a1a28", ground: "#1c1018", stars: 0.6, dust: 0, sun: 0.5 }
};

// ============================================================
//  OPPORTUNITY'S STORY
// ============================================================
const opportunityStory = [
  {
    title: "Liftoff",
    date: "2003-07-07",
    place: "Cape Canaveral, Florida",
    bg: "launch",
    actor: "craft launch",
    beats: [
      { who: "narrator", text: "Cape Canaveral, Florida. July 7, 2003. You are folded up inside a metal shell on top of a Delta II Heavy rocket. You have never turned a single wheel." },
      { who: "earth", text: "T-minus ten seconds. You are Opportunity, also known as MER-B. Your twin, Spirit, left four weeks ago, so try not to be late." },
      { type: "choice", prompt: "The countdown is running. How do you feel?", options: [
        { label: "Ready!", who: "me", text: "Ready! Let's go see a planet." },
        { label: "Nervous.", who: "earth", text: "Everyone is nervous. Even the rocket is a little nervous." },
        { label: "Is it too late to stay?", who: "earth", text: "Yes. Very. Hold on tight." }
      ] },
      { who: "narrator", actor: "craft launch lift", text: "Three. Two. One. Fire and thunder. A few minutes later you are above the clouds, and then above the sky." },
      { who: "me", text: "My mission is simple: find out if Mars was ever wet. I am built to last 90 sols, about three months. After that, who knows?" },
      { who: "narrator", date: "2004-01-03", bg: "space", actor: "craft", text: "Seven months of cruising later, news crackles in from Earth: your twin has landed." },
      { type: "meanwhile", text: "Spirit touched down inside Gusev Crater, a giant impact crater that may once have held a lake. Your turn comes in three weeks." }
    ],
    entry: {
      text: "Launched July 7, 2003 on a Delta II Heavy from Cape Canaveral, four weeks after Spirit. Seven months in a metal shell. My mission: search for clues to past water on Mars. Built to last 90 sols, about three months.",
      meanwhile: "Spirit landed in Gusev Crater, a possible former lake, on January 3, 2004."
    }
  },
  {
    title: "Six Minutes",
    date: "2004-01-24",
    place: "Entering the Martian atmosphere",
    bg: "entry",
    actor: "craft chute",
    beats: [
      { who: "narrator", text: "January 24, 2004. Mars fills the whole sky. You slam into the atmosphere at a ridiculous speed, and everything outside turns orange." },
      { who: "earth", text: "The heat shield is doing its job. Hang in there, Opportunity." },
      { who: "me", text: "Parachute out! Rockets firing! And then the airbags blow up around me like a giant bouncy castle." },
      { type: "choice", prompt: "You are about to bounce across Mars. Any last words?", options: [
        { label: "Wheeeee!", who: "narrator", text: "You bounce. You roll. You bounce again." },
        { label: "Please be flat, please be flat.", who: "narrator", text: "Mars is not flat. Mars is never flat." },
        { label: "Tell my twin I said hi.", who: "earth", text: "Spirit is on the other side of the planet. We will pass it along." }
      ] },
      { who: "narrator", text: "Bounce. Bounce. Roll. Stop. Silence. The whole fall took about six minutes, and then the airbags slowly deflate." },
      { type: "meanwhile", text: "Three days ago Spirit fell silent for a while, and engineers on Earth had to untangle a memory problem to bring it back. They are still working on it." }
    ],
    entry: {
      text: "Entry, descent and landing took about six minutes: a fiery plunge, a parachute, rockets, then airbags to cushion the fall. I bounced and rolled to a stop on Meridiani Planum, on the opposite side of Mars from Spirit.",
      meanwhile: "Spirit had its own scare a few days earlier: a memory problem made it go quiet."
    }
  },
  {
    title: "Hole in One",
    date: "2004-01-24",
    place: "Eagle Crater, Meridiani Planum",
    bg: "plain",
    actor: "rover",
    beats: [
      { who: "narrator", text: "The petals of the lander open like a metal flower. You unfold your solar panels and raise your head." },
      { who: "me", text: "First system check! Let me see what I am made of." },
      { type: "choice", prompt: "Which part do you check first?", options: [
        { label: "My brain", who: "me", text: "My computer brain thinks for me, and it runs the heaters and insulation that keep me from freezing." },
        { label: "My head", who: "me", text: "My camera head sits on a tall mast, so I see the world at human height. Looking good." },
        { label: "My arm", who: "me", text: "My arm is a lot like yours. It bends so I can get up close and personal with Martian rocks." }
      ] },
      { who: "me", text: "Full report: a strong body, a computer brain, a camera head on a mast, an arm with three joints (shoulder, elbow and wrist), six wheels, solar panels and antennas. All present." },
      { who: "earth", text: "Welcome to Mars, Opportunity. You landed inside a small crater called Eagle. That is a hole in one." },
      { type: "found", img: IMG + "opportunity-landing.jpg", title: "Found: your landing site", caption: "Opportunity's landing site on Meridiani Planum, a place where mineral deposits suggested Mars once had water. Your lander sits in a shallow crater." },
      { type: "meanwhile", text: "Spirit is exploring Gusev Crater, on the opposite side of Mars. Two rovers, two very different places." }
    ],
    entry: {
      text: "Landed inside Eagle Crater on Meridiani Planum, a hole in one. System check: a strong body, a computer brain, a camera head on a mast, an arm with three joints (shoulder, elbow and wrist), six wheels, solar panels and antennas.",
      meanwhile: "Spirit's site, Gusev Crater, is a possible former lake in a giant impact crater."
    }
  },
  {
    title: "Blueberries",
    date: "2004-03-02",
    approx: true,
    place: "Meridiani Planum",
    bg: "plain",
    actor: "rover",
    beats: [
      { who: "me", text: "My main objective: search for rocks and soils that hold clues to past water. Time to get close to some rocks." },
      { who: "narrator", text: "The rocks around Eagle Crater are layered and salty, and the soil is full of tiny round pebbles that scientists nickname blueberries." },
      { type: "choice", prompt: "What do you look at first?", options: [
        { label: "The blueberries", who: "me", text: "Round little spheres, all over the place. Not real berries, sadly." },
        { label: "The layered rock", who: "me", text: "Layers like pages in a book. Each one is a different moment in Martian history." },
        { label: "Ask Earth", who: "earth", text: "We think this place was once soaking wet." }
      ] },
      { who: "me", text: "The blueberries are hematite, an iron oxide. They are spheres that crystallize in water. Water, on Mars!" },
      { who: "earth", text: "In early March 2004 we tell the world: Opportunity's landing site was once drenched in water." },
      { who: "narrator", date: "2004-04-26", approx: true, text: "By late April your 90-sol mission is done. Nobody tells you to stop, so you keep driving." },
      { type: "meanwhile", text: "Spirit finished its 90 sols too. It is rolling across the dark volcanic rocks of Gusev Crater, aiming for a range of distant hills." }
    ],
    entry: {
      text: "My main objective: find rocks and soils that hold clues to past water. The tiny round blueberries are hematite, an iron oxide that crystallizes in water. In March 2004 NASA announced that my landing site was once drenched in water. My 90 sols ended in April. I kept going.",
      meanwhile: "Spirit finished its 90 sols in Gusev Crater, heading for the Columbia Hills."
    }
  },
  {
    title: "Crater and Meteorite",
    date: "2004-06-15",
    approx: true,
    place: "Endurance Crater",
    bg: "crater",
    actor: "rover",
    beats: [
      { who: "narrator", text: "Summer 2004. Ahead of you is a much bigger crater called Endurance, with steep walls, layered rock and dunes at the bottom." },
      { who: "earth", text: "Opportunity, do you want to go in?" },
      { type: "choice", prompt: "Into Endurance Crater?", options: [
        { label: "Go in carefully", who: "me", text: "Slowly, wheel by wheel. These walls show layer after layer of ancient rock." },
        { label: "Stay on the rim", who: "earth", text: "Too late, we already voted yes. Down you go." },
        { label: "Take a selfie first", who: "narrator", text: "Your front camera catches your own shadow sliding down the slope. A rover selfie." }
      ] },
      { who: "me", text: "I spend about six months inside Endurance, reading its rock layers like a book about wet times and dry times." },
      { who: "narrator", date: "2005-01-10", approx: true, bg: "plain", text: "January 2005. Back on the plains, you pass your own discarded heat shield, the shield that saved you during that fiery entry. Beside it sits a strange rock." },
      { who: "me", text: "It is the size of a basketball. Dark. Metallic. It does not belong here." },
      { who: "earth", text: "It is an iron-nickel meteorite, the first one ever identified on another planet. We are calling it Heat Shield Rock." },
      { type: "meanwhile", text: "Spirit has reached the Columbia Hills, a range inside Gusev Crater, and is working its way up Husband Hill. Nobody expected a rover to climb a hill." }
    ],
    entry: {
      text: "From June to December 2004 I explored Endurance Crater and read its rock layers. In January 2005 I found a basketball-sized metal rock near my own heat shield: an iron-nickel meteorite, the first ever identified on another planet. Heat Shield Rock.",
      meanwhile: "Spirit reached the Columbia Hills and started climbing Husband Hill."
    }
  },
  {
    title: "Stuck in the Sand",
    date: "2005-04-26",
    place: "Between Endurance and Victoria craters",
    bg: "dunes",
    actor: "rover",
    beats: [
      { who: "narrator", text: "April 26, 2005. You are crossing a rippled field of sand on your way to a new crater. It looks harmless. It is not." },
      { who: "me", text: "My wheels are spinning. Spinning. And going nowhere. Uh-oh.", actor: "rover stuck" },
      { who: "earth", text: "You are stuck in a sand dune, Opportunity. All four of your corner wheels are buried." },
      { type: "choice", prompt: "What should you do?", options: [
        { label: "Panic", who: "earth", text: "Please do not. Panic uses a lot of battery." },
        { label: "Wiggle the wheels", who: "earth", text: "We will do exactly that, a few centimeters at a time." },
        { label: "Wait for rescue", who: "earth", text: "Nobody is coming. But a team on Earth is building a copy of your dune to practice on." }
      ] },
      { who: "me", text: "Days pass. Forward a little, backward a little. A few centimeters at a time." },
      { who: "narrator", date: "2005-06-04", actor: "rover", text: "June 4, 2005. After about five weeks, your wheels finally bite. You are free." },
      { type: "meanwhile", text: "Earlier this year a dust devil swept Spirit's solar panels clean and gave it a power boost. Spirit is climbing Husband Hill." }
    ],
    entry: {
      text: "April 26, 2005: I got stuck in a sand dune with all four corner wheels buried. Engineers practiced on a copy of the dune back on Earth. After about five weeks of tiny wiggles, I drove out on June 4.",
      meanwhile: "A dust devil cleaned Spirit's solar panels, and Spirit climbed Husband Hill."
    }
  },
  {
    title: "The Big Crater",
    date: "2006-09-26",
    approx: true,
    place: "Victoria Crater",
    bg: "crater",
    actor: "rover",
    beats: [
      { who: "narrator", text: "September 2006. Victoria Crater, a huge bowl with scalloped cliffs. It took you more than a year to get here." },
      { type: "choice", prompt: "Do you drive in right away?", options: [
        { label: "Yes, dive in!", who: "earth", text: "Slow down. There is a lot to see from the rim first." },
        { label: "Circle the rim", who: "earth", text: "Good call. Looking down from different angles will help us choose a way in." },
        { label: "Is it safe?", who: "earth", text: "Nothing on Mars is safe. But we will be careful." }
      ] },
      { who: "me", text: "I drive around the rim for about a year, then slowly roll down into the crater in 2007." },
      { type: "meanwhile", text: "Spirit's right front wheel broke in 2006, so it now drives backward and drags the dead wheel. The wheel scrapes up bright soil of almost pure silica, which forms in hot springs and steam vents. Spirit has found direct evidence of hydrothermal activity." },
      { who: "narrator", date: "2007-07-15", approx: true, bg: "storm", text: "Summer 2007. A planet-wide dust storm turns the sky brown. Your panels barely get any sunlight, so you go into power-saving mode and wait." },
      { who: "me", text: "The storm passes. I wake up, dusty but alive." },
      { who: "narrator", date: "2008-08-28", approx: true, bg: "crater", text: "August 2008. You climb out of Victoria and aim for a far-away target: Endeavour Crater." }
    ],
    entry: {
      text: "Victoria Crater: a huge bowl I studied for about two years. I circled the rim, rolled in during 2007, and survived a planet-wide dust storm by sleeping through it. In August 2008 I climbed out and aimed for Endeavour Crater.",
      meanwhile: "Spirit's dead wheel scraped up almost pure silica, evidence of hot springs: hydrothermal activity."
    }
  },
  {
    title: "The Long Walk",
    date: "2010-03-22",
    place: "Somewhere on the way to Endeavour",
    bg: "dusk",
    actor: "rover",
    beats: [
      { who: "earth", text: "Opportunity, we have sad news. Spirit got stuck in a sand trap in 2009. It could not tilt its panels toward the Sun for winter. Its last message came on March 22, 2010." },
      { who: "me", text: "I never got to meet it. A whole planet between us, and yet it feels like I lost a friend." },
      { type: "choice", prompt: "How do you honor Spirit?", options: [
        { label: "Keep driving", who: "me", text: "That is what Spirit would want. Next stop: Endeavour Crater." },
        { label: "Take a quiet moment", who: "narrator", text: "You sit still for one whole sol. Then the Sun comes up and you roll on." },
        { label: "Send a message to Earth", who: "earth", text: "We read it. We miss Spirit too." }
      ] },
      { who: "earth", date: "2011-05-25", text: "May 25, 2011. After more than a year of listening, NASA ends its efforts to reach Spirit." },
      { who: "narrator", date: "2011-08-09", text: "August 9, 2011. After a trek of about 21 kilometers from Victoria, you reach the rim of Endeavour Crater, around 22 kilometers wide. Scientists call it your second landing site." },
      { who: "me", text: "I was built for three months. I have been here for seven years, and I am just getting started." }
    ],
    entry: {
      text: "Spirit's last message came on March 22, 2010, and NASA ended its efforts to reach it on May 25, 2011. I kept going. On August 9, 2011 I reached the rim of Endeavour Crater, about 22 km wide, after a 21 km trek. A second landing site.",
      meanwhile: "Spirit stayed behind in Gusev Crater, stuck at a sand trap called Troy."
    }
  },
  {
    title: "Marathon Rover",
    date: "2014-03-24",
    place: "Endeavour Crater rim",
    bg: "plain",
    actor: "rover",
    beats: [
      { who: "narrator", text: "March 2014. For years, dust has been dimming your solar panels. Then the wind steps in." },
      { type: "found", img: "assets/images/opportunity.jpeg", title: "Found: self-portrait", caption: "Opportunity's self-portrait shows how the wind cleaned much of the dust off the solar panels. It combines several frames from the panoramic camera (Pancam), taken through three color filters from March 22 to 24, 2014." },
      { who: "me", text: "Whoa, I'm shiny again! Thank you, wind." },
      { type: "choice", prompt: "What is your next big goal?", options: [
        { label: "A marathon", who: "earth", text: "Funny you should say that." },
        { label: "Another crater", who: "earth", text: "You have been to plenty." },
        { label: "A nap", who: "me", text: "Rover naps are called sleep mode. I take one every night." }
      ] },
      { who: "earth", date: "2015-03-24", text: "March 24, 2015: you have now driven 42.195 kilometers (26.2 miles), the exact length of a marathon. You are the first to go beyond marathon distance on another world." },
      { type: "meanwhile", text: "Spirit rests quietly in Gusev Crater, still at Troy. Over its whole life it drove 4.8 miles (7.7 km)." }
    ],
    entry: {
      text: "March 2014: wind cleaned much of the dust off my solar panels, and my Pancam caught the self-portrait. On March 24, 2015 I passed 42.195 km, a marathon distance, the first to do so on another world.",
      meanwhile: "Spirit's total distance: 4.8 miles (7.7 km)."
    }
  },
  {
    title: "The Dark Sky",
    date: "2018-06-01",
    approx: true,
    place: "Perseverance Valley",
    bg: "storm",
    actor: "rover dark",
    beats: [
      { who: "narrator", text: "June 2018. You are inside Perseverance Valley, on the rim of Endeavour. A dust storm is growing in the distance." },
      { who: "earth", text: "It is a planet-encircling dust storm, Opportunity. It will blot out the Sun. Use power-saving mode." },
      { who: "me", text: "Each day my panels get less light. My battery is running low." },
      { type: "choice", prompt: "Do you think you will wake up?", options: [
        { label: "Yes", who: "narrator", text: "Rovers are very optimistic." },
        { label: "I hope so", who: "earth", text: "We hope so too." },
        { label: "I'm not scared", who: "me", text: "I am a rover. Scared is not in my specs." }
      ] },
      { who: "narrator", date: "2018-06-10", text: "June 10, 2018. You send one last message to Earth. People later put it into words: my battery is low and it is getting dark." },
      { who: "earth", date: "2019-02-13", text: "We kept calling for months. Silence. On February 13, 2019, NASA declares the mission complete. Opportunity worked for more than 14 years, from a plan that lasted 90 sols." }
    ],
    entry: {
      text: "June 2018: a planet-wide dust storm blotted out the Sun over Perseverance Valley. My last message to Earth came on June 10, 2018. NASA declared the mission complete on February 13, 2019, after more than 14 years.",
      meanwhile: "Spirit had been silent since 2010, but its story was never forgotten."
    }
  },
  {
    title: "Legacy",
    date: "2026-10-11",
    place: "Records, numbers and a new rover",
    bg: "dusk",
    actor: "none",
    beats: [
      { who: "narrator", text: "Years later, the numbers still tell the story." },
      { type: "found", img: IMG + "by-the-numbers.jpg", title: "Found: by the numbers", caption: "Spirit: 6 years, 124,838 raw images, 4.8 miles traveled, 30 degrees steepest slope. Opportunity: 14+ years, 217,594 raw images, 28 miles traveled, 32 degrees steepest slope. (NASA, updated Feb. 4, 2019)" },
      { who: "narrator", text: "Opportunity drove 28.06 miles (45.16 kilometers) and held the record for the farthest distance driven off Earth." },
      { who: "narrator", text: "On October 11, 2026, NASA's Perseverance rolled past that mark and kept going: 28.10 miles (45.22 kilometers) and counting." },
      { type: "found", img: IMG + "records.jpg", title: "Found: out-of-this-world records", caption: "Driving distances on Mars and the Moon, as of October 12, 2026. Perseverance 45.2 km, Opportunity 45.16 km, Curiosity 38.15 km, Spirit 7.7 km." },
      { type: "choice", prompt: "What do you say to the next rover?", options: [
        { label: "Good luck", who: "me", text: "Good luck, Perseverance. You are going to see wonderful things." },
        { label: "Mind the sand", who: "me", text: "Mind the sand. Trust me." },
        { label: "Say hi to Spirit", who: "me", text: "If you find Spirit, say hi from me." }
      ] },
      { type: "meanwhile", text: "On the Moon, Apollo's lunar rovers set records of their own. Apollo 17's rover drove 35.74 km. Ready for the next level?" },
      { who: "me", text: "Built for 90 sols. Lasted more than 14 years. Not bad for a tin can." }
    ],
    entry: {
      text: "Opportunity worked for more than 14 years and drove 28.06 miles (45.16 km), the off-Earth driving record. On October 11, 2026, Perseverance passed it, reaching 28.10 miles (45.22 km) and counting.",
      meanwhile: "On the Moon, Apollo 17's rover drove 35.74 km."
    }
  }
];

// ============================================================
//  SPIRIT'S STORY
// ============================================================
const spiritStory = [
  {
    title: "Liftoff",
    date: "2003-06-10",
    place: "Cape Canaveral, Florida",
    bg: "launch",
    actor: "craft launch",
    beats: [
      { who: "narrator", text: "Cape Canaveral, Florida. June 10, 2003. You are the first of two twin rovers to leave Earth. Your twin, Opportunity, launches in four weeks." },
      { who: "earth", text: "T-minus ten seconds. You are Spirit, also known as MER-A. Make us proud." },
      { type: "choice", prompt: "Any last words before liftoff?", options: [
        { label: "See you on Mars!", who: "me", text: "See you on Mars! Save me a crater." },
        { label: "Please don't explode.", who: "earth", text: "We are doing our best. Truly." },
        { label: "I'm afraid of heights.", who: "earth", text: "Bad news: the next part is very, very high." }
      ] },
      { who: "narrator", actor: "craft launch lift", text: "Liftoff! In a few minutes you are above the clouds, and then above the sky." },
      { who: "me", text: "My mission is simple: find out if Mars was ever wet. I am built to last 90 sols, about three months." },
      { who: "narrator", date: "2004-01-03", bg: "space", actor: "craft", text: "Seven months of cruising. Mars grows from a dot to a ball, and then to a whole world." },
      { type: "meanwhile", text: "Opportunity launched on July 7, 2003, four weeks after you. It is still on its way and will land on the other side of Mars three weeks after you." }
    ],
    entry: {
      text: "Launched June 10, 2003 from Cape Canaveral, the first of the twins. Seven months of cruising. My mission: search for clues to past water on Mars. Built to last 90 sols, about three months.",
      meanwhile: "Opportunity launched four weeks later, on July 7, 2003."
    }
  },
  {
    title: "Six Minutes",
    date: "2004-01-03",
    place: "Entering the Martian atmosphere",
    bg: "entry",
    actor: "craft chute",
    beats: [
      { who: "narrator", text: "January 3, 2004. Mars fills the whole sky. You hit the atmosphere at a ridiculous speed, and everything outside turns orange." },
      { who: "earth", text: "The heat shield is doing its job. Hang in there, Spirit." },
      { who: "me", text: "Parachute out! Rockets firing! And then the airbags inflate around me like a giant bouncy castle." },
      { type: "choice", prompt: "You are about to bounce across Mars. Any last words?", options: [
        { label: "Wheeeee!", who: "narrator", text: "You bounce. You roll. You bounce again." },
        { label: "Be gentle, Mars.", who: "narrator", text: "Mars is not gentle. Mars is never gentle." },
        { label: "Please land right-side up.", who: "earth", text: "Good news: the lander is designed to fix that." }
      ] },
      { who: "narrator", text: "Bounce. Bounce. Roll. Stop. Silence. The whole fall took about six minutes, and then the airbags slowly deflate." },
      { type: "meanwhile", text: "Opportunity is still in space. It will land on the opposite side of Mars three weeks from now." }
    ],
    entry: {
      text: "Entry, descent and landing took about six minutes: a fiery plunge, a parachute, rockets, then airbags to cushion the fall. I bounced, rolled, and stopped inside Gusev Crater.",
      meanwhile: "Opportunity was still in space, three weeks from its own landing."
    }
  },
  {
    title: "Gusev Crater",
    date: "2004-01-03",
    place: "Gusev Crater",
    bg: "gusev",
    actor: "rover",
    beats: [
      { who: "narrator", text: "The petals of the lander open. You unfold your solar panels and raise your head." },
      { who: "me", text: "First system check! Let me see what I am made of." },
      { type: "choice", prompt: "Which part do you check first?", options: [
        { label: "My brain", who: "me", text: "My computer brain thinks for me, and it runs the heaters and insulation that keep me from freezing." },
        { label: "My head", who: "me", text: "My camera head sits on a tall mast, so I see the world at human height. Looking good." },
        { label: "My arm", who: "me", text: "My arm is a lot like yours. It bends so I can get up close and personal with Martian rocks." }
      ] },
      { who: "me", text: "Full report: a strong body, a computer brain, a camera head on a mast, an arm with three joints (shoulder, elbow and wrist), six wheels, solar panels and antennas. All present." },
      { who: "earth", text: "Welcome to Gusev Crater, Spirit. Scientists think it may once have been a lake, inside a giant impact crater." },
      { type: "found", img: IMG + "spirit-landing.jpg", title: "Found: your landing site", caption: "Spirit's view of its lander, wrapped in deflated airbags, on the floor of Gusev Crater, a possible former lake in a giant impact crater." },
      { type: "meanwhile", text: "Opportunity is still in space. It is headed for Meridiani Planum, a place where mineral deposits suggest Mars once had water." }
    ],
    entry: {
      text: "Landed in Gusev Crater, a possible former lake in a giant impact crater. System check: a strong body, a computer brain, a camera head on a mast, an arm with three joints (shoulder, elbow and wrist), six wheels, solar panels and antennas.",
      meanwhile: "Opportunity's target: Meridiani Planum, where mineral deposits suggest ancient water."
    }
  },
  {
    title: "Silence",
    date: "2004-01-21",
    place: "Gusev Crater",
    bg: "gusev",
    actor: "rover dark",
    beats: [
      { who: "narrator", text: "January 21, 2004. Day 17 on Mars. Earth sends you a command. You answer with gibberish." },
      { who: "earth", text: "Spirit? Are you there? We are receiving nonsense." },
      { who: "me", text: "Beep. Boop. I forgot how to remember. My memory is full of files I cannot manage." },
      { type: "choice", prompt: "What do you tell Earth?", options: [
        { label: "I'm fine!", who: "earth", text: "You are not fine. But we love your confidence." },
        { label: "Reboot me.", who: "earth", text: "That is exactly the plan. Turn it off and on again." },
        { label: "Mmmmbblrgh.", who: "earth", text: "Yes. That is the problem." }
      ] },
      { type: "meanwhile", date: "2004-01-24", text: "While engineers work on you, Opportunity lands on the other side of the planet, inside a small crater called Eagle. A hole in one." },
      { who: "earth", date: "2004-02-06", approx: true, actor: "rover", text: "Our team worked day and night, Spirit. They cleaned up your flash memory, and about two weeks later you are back to normal." }
    ],
    entry: {
      text: "January 21, 2004, sol 17: I stopped making sense. My memory was a mess. Engineers on Earth worked day and night, cleaned up my flash memory, and in about two weeks I was back to normal.",
      meanwhile: "Opportunity landed in Eagle Crater on January 24, a hole in one."
    }
  },
  {
    title: "Plains and Hills",
    date: "2004-03-15",
    approx: true,
    place: "Floor of Gusev Crater",
    bg: "gusev",
    actor: "rover",
    beats: [
      { who: "narrator", text: "Spring 2004. Gusev Crater's floor is covered in dark volcanic rock. If a lake was ever here, it is hiding well." },
      { who: "me", text: "I grind a rock with my Rock Abrasion Tool to peek inside. Fresh rock tells a better story than dusty rock." },
      { type: "choice", prompt: "What is your next target?", options: [
        { label: "That interesting rock", who: "me", text: "Everything looks interesting. I am a geologist." },
        { label: "Those far hills", who: "earth", text: "The Columbia Hills. That is exactly where we want you to go." },
        { label: "Take a nap", who: "me", text: "Sleeping now. Back in a sol." }
      ] },
      { who: "me", date: "2004-04-26", approx: true, text: "By late April my 90-sol mission is done. But I am only getting started. Next stop: the hills." },
      { type: "meanwhile", text: "Opportunity found tiny round blueberries: hematite, an iron oxide that crystallizes in water. NASA announced its landing site was once drenched in water." },
      { who: "narrator", date: "2004-06-20", approx: true, text: "Mid-2004. After a long drive across the plain, you reach the foot of the Columbia Hills." }
    ],
    entry: {
      text: "Gusev's floor is dark volcanic rock. I ground into rocks with my Rock Abrasion Tool to see inside. By late April 2004 my 90 sols were done, and I was driving toward the Columbia Hills.",
      meanwhile: "Opportunity found hematite blueberries, evidence that its site was once drenched in water."
    }
  },
  {
    title: "The First Hill",
    date: "2005-03-10",
    place: "Husband Hill, Columbia Hills",
    bg: "hills",
    actor: "rover",
    beats: [
      { who: "narrator", text: "2005. You are inside the Columbia Hills, climbing Husband Hill. No rover has ever climbed a hill on another world. You are about to." },
      { who: "me", text: "I was built for flat plains, but I climb anyway. Slow and steady." },
      { who: "narrator", text: "March 2005. A dust devil sweeps across the hill and cleans your solar panels. Free power!" },
      { type: "meanwhile", date: "2005-04-26", text: "Opportunity is stuck in a sand dune that buried its wheels for about five weeks. Engineers practice on a copy of the dune on Earth." },
      { who: "narrator", date: "2005-09-29", text: "September 29, 2005. You reach the summit of Husband Hill, named for the commander of the space shuttle Columbia, and look out over Gusev Crater." },
      { type: "choice", prompt: "You are on top of a hill on another planet. What do you do?", options: [
        { label: "Take a panorama", who: "me", text: "A full 360 degrees of Gusev Crater, in true color." },
        { label: "Do a little dance", who: "narrator", text: "Your wheels wobble a little. Technically, a dance." },
        { label: "Do some science", who: "me", text: "Always." }
      ] }
    ],
    entry: {
      text: "In March 2005 a dust devil cleaned my solar panels. On September 29, 2005 I reached the summit of Husband Hill, the first time a rover had climbed a hill on another planet. I could see across Gusev Crater.",
      meanwhile: "Opportunity was stuck in a sand dune for about five weeks."
    }
  },
  {
    title: "Dead Wheel, Bright Soil",
    date: "2006-03-13",
    place: "Columbia Hills",
    bg: "hills",
    actor: "rover",
    beats: [
      { who: "narrator", text: "March 13, 2006. You are heading for McCool Hill when your right front wheel stops turning. For good." },
      { who: "earth", text: "Spirit, we cannot fix a wheel from another planet." },
      { who: "me", text: "No problem. I will drive backward and drag the broken wheel behind me, like a shopping cart with a bad wheel." },
      { type: "choice", prompt: "How do you feel about dragging it?", options: [
        { label: "Embarrassed", who: "narrator", text: "Nobody is watching. Except a satellite or two." },
        { label: "Determined", who: "earth", text: "We know." },
        { label: "It's a feature", who: "earth", text: "We will put that in the report." }
      ] },
      { who: "narrator", date: "2006-04-09", text: "Winter 2006. You park on a sun-facing slope called Low Ridge Haven for months to save power." },
      { who: "narrator", date: "2007-05-01", approx: true, text: "2007. As you drag the dead wheel through the soil, it scrapes away the top layer and exposes bright, pale dirt." },
      { type: "meanwhile", text: "Opportunity is circling Victoria Crater. In 2007 a planet-wide dust storm tries to starve both rovers of sunlight. Both survive." },
      { who: "earth", date: "2007-12-10", text: "December 10, 2007. That bright soil is almost pure silica. On Earth, silica like this forms in hot springs or steam vents. Spirit found direct evidence of hydrothermal activity on Mars." }
    ],
    entry: {
      text: "March 13, 2006: my right front wheel died. I drove backward and dragged it. In 2007 the dead wheel scraped away the top layer of soil and exposed bright, almost pure silica. On Earth, that forms in hot springs: direct evidence of hydrothermal activity on Mars.",
      meanwhile: "Opportunity survived the 2007 dust storm while exploring Victoria Crater."
    }
  },
  {
    title: "Troy",
    date: "2009-04-23",
    place: "West of Home Plate",
    bg: "dunes",
    actor: "rover",
    beats: [
      { who: "narrator", text: "April 2009. Home Plate, the circle of layered rock you explored, is behind you. Ahead lies a patch of soft, powdery ground, hidden under a crust you cannot see." },
      { who: "me", text: "Everything looks fine. The ground looks fine. My instincts say it is fine." },
      { who: "narrator", text: "Crack. The crust gives way. Your wheels sink. This place will be called Troy.", actor: "rover stuck" },
      { type: "choice", prompt: "Try to drive out?", options: [
        { label: "Forward!", who: "earth", text: "Forward, backward, left, right. We try everything." },
        { label: "Backward!", who: "earth", text: "You are very good at backward. It does not help here." },
        { label: "Stay calm", who: "me", text: "Calm. I am very calm. My wheels are not." }
      ] },
      { who: "earth", text: "For months we test every trick on a copy of Troy built on Earth. The loose sand will not let go." },
      { who: "narrator", date: "2009-12-05", approx: true, text: "By December 2009 another wheel has given up. You have spun your wheels for months." },
      { type: "meanwhile", text: "Opportunity left Victoria and is making the long drive to Endeavour Crater, about 21 km away. It was stuck in sand once too. It got out." }
    ],
    entry: {
      text: "April 2009: the ground beside Home Plate broke through under me, and I became stuck in soft sand at a place called Troy. Engineers tried every trick on a copy on Earth. By December another wheel had failed.",
      meanwhile: "Opportunity, once stuck in a sand dune, drove on toward Endeavour Crater."
    }
  },
  {
    title: "Winter Without Sun",
    date: "2010-01-15",
    approx: true,
    place: "Troy, Gusev Crater",
    bg: "night",
    actor: "rover dark",
    beats: [
      { who: "narrator", text: "Winter 2010. Without moving, you cannot tilt your panels toward the Sun. Your power drops. Each sol is colder than the last." },
      { who: "me", text: "I turn off everything I can: heaters, instruments. Save the batteries. Wait for spring." },
      { who: "earth", text: "We are listening, Spirit." },
      { type: "choice", prompt: "Any last message?", options: [
        { label: "See you in spring", who: "narrator", text: "That was the plan." },
        { label: "Thank you", who: "earth", text: "No. Thank you." },
        { label: "Tell Opportunity to keep going", who: "earth", text: "We will." }
      ] },
      { who: "narrator", date: "2010-03-22", text: "March 22, 2010. Your final message reaches Earth." },
      { who: "earth", date: "2011-05-25", text: "May 25, 2011. After more than a year of listening, NASA ends its efforts to reach you." },
      { type: "meanwhile", text: "Opportunity keeps driving. On August 9, 2011 it reaches Endeavour Crater, and it will roll on for almost seven more years." },
      { who: "me", text: "I was built for 90 sols. I lasted six years." }
    ],
    entry: {
      text: "Without sunlight on my panels I ran out of power in the cold. My last message reached Earth on March 22, 2010. NASA ended its efforts to reach me on May 25, 2011. I was built for 90 sols and lasted six years.",
      meanwhile: "Opportunity reached Endeavour Crater on August 9, 2011 and kept going."
    }
  },
  {
    title: "Legacy",
    date: "2011-05-25",
    place: "Records, numbers and a new rover",
    bg: "dusk",
    actor: "none",
    beats: [
      { who: "narrator", text: "Years later, the numbers still tell the story." },
      { type: "found", img: IMG + "by-the-numbers.jpg", title: "Found: by the numbers", caption: "Spirit: 6 years, 124,838 raw images, 4.8 miles traveled, 30 degrees steepest slope. Opportunity: 14+ years, 217,594 raw images, 28 miles traveled, 32 degrees steepest slope. (NASA, updated Feb. 4, 2019)" },
      { who: "me", text: "4.8 miles. 124,838 raw images. A 30 degree slope. The first rover to climb a hill on another planet." },
      { who: "earth", text: "And evidence of hot springs, found because of a broken wheel." },
      { type: "meanwhile", date: "2018-06-10", text: "Opportunity kept going for 8 more years. On June 10, 2018 a planet-wide dust storm silenced it. NASA declared its mission complete on February 13, 2019, after more than 14 years." },
      { who: "narrator", date: "2026-10-11", text: "Opportunity drove 28.06 miles (45.16 kilometers). On October 11, 2026, NASA's Perseverance passed that mark, reaching 28.10 miles (45.22 kilometers) and counting." },
      { type: "found", img: IMG + "records.jpg", title: "Found: out-of-this-world records", caption: "Driving distances on Mars and the Moon, as of October 12, 2026. Perseverance 45.2 km, Opportunity 45.16 km, Curiosity 38.15 km, Spirit 7.7 km." },
      { type: "meanwhile", text: "On the Moon, Apollo's lunar rovers set records of their own. Apollo 17's rover drove 35.74 km. Ready for the next level?" },
      { who: "me", text: "Built for 90 sols. Lasted six years. Not bad for a tin can." }
    ],
    entry: {
      text: "Over six years I drove 4.8 miles (7.7 km), took 124,838 raw images, climbed a 30 degree slope, and found direct evidence of hydrothermal activity. Perseverance passed Opportunity's record of 45.16 km on October 11, 2026.",
      meanwhile: "Opportunity was silenced by a dust storm on June 10, 2018 and lasted more than 14 years."
    }
  }
];

export const story = { opportunity: opportunityStory, spirit: spiritStory };

// ============================================================
//  THE TEST
//  answer = the number of the right option, starting from 0.
//  The options get shuffled when the quiz is shown.
// ============================================================
export const quiz = [
  { q: "How long were Spirit and Opportunity planned to work?",
    options: ["90 sols (about three months)", "One Earth year", "Five years", "Fifteen years"], answer: 0,
    why: "Each rover was built for a 90-sol mission. Opportunity lasted 14+ years and Spirit lasted 6." },
  { q: "Where did Spirit land?",
    options: ["Gusev Crater", "Meridiani Planum", "Eagle Crater", "Victoria Crater"], answer: 0,
    why: "Spirit landed in Gusev Crater, a possible former lake inside a giant impact crater." },
  { q: "Where did Opportunity land?",
    options: ["Gusev Crater", "Meridiani Planum", "Endeavour Crater", "Husband Hill"], answer: 1,
    why: "Opportunity landed on Meridiani Planum, inside Eagle Crater, where mineral deposits suggested Mars once had water." },
  { q: "What are the blueberries Opportunity found?",
    options: ["Frozen berries", "Tiny iron-oxide (hematite) spheres that form in water", "Meteorite pieces", "Blue algae fossils"], answer: 1,
    why: "The blueberries are hematite, an iron oxide that crystallizes in water." },
  { q: "What was Heat Shield Rock?",
    options: ["A piece of Spirit", "A fossil", "An iron-nickel meteorite", "A volcanic bomb"], answer: 2,
    why: "It was the first meteorite ever identified on another planet." },
  { q: "What trapped Opportunity for about five weeks in 2005?",
    options: ["A dust storm", "A sand dune", "A broken wheel", "A deep crater"], answer: 1,
    why: "All four corner wheels were buried in a sand dune. Engineers practiced on a copy on Earth." },
  { q: "How did Spirit's broken wheel help science?",
    options: ["It made Spirit faster", "It scraped the soil and exposed almost pure silica, a sign of hot springs", "It found a meteorite", "It drew a map of the crater"], answer: 1,
    why: "The dragged wheel exposed bright silica-rich soil, direct evidence of hydrothermal activity." },
  { q: "How many joints does a rover's arm have?",
    options: ["One", "Two", "Three", "Six"], answer: 2,
    why: "Shoulder, elbow and wrist: three joints." },
  { q: "What did Opportunity reach on March 24, 2015?",
    options: ["The summit of a mountain", "Marathon distance (42.195 km)", "Its 1,000th day", "The Moon"], answer: 1,
    why: "It was the first to go beyond marathon distance on another world." },
  { q: "What silenced Opportunity on June 10, 2018?",
    options: ["A planet-encircling dust storm", "A meteorite hit", "A software update", "A flat tire"], answer: 0,
    why: "The storm blocked the Sun, and its solar panels could not make enough power." },
  { q: "How far did Opportunity drive in total?",
    options: ["4.8 miles (7.7 km)", "10 miles (16 km)", "28 miles (45.16 km)", "100 miles (160 km)"], answer: 2,
    why: "Opportunity drove 28.06 miles (45.16 km). Spirit drove 4.8 miles (7.7 km)." },
  { q: "Which rover passed Opportunity's off-Earth driving record on October 11, 2026?",
    options: ["Curiosity", "Spirit", "Perseverance", "Sojourner"], answer: 2,
    why: "Perseverance rolled past 45.16 km and kept counting." }
];
