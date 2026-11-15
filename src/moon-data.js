// ============================================================
//  APOLLO 15 STORY DATA
//  Same format as mars-data.js (read the notes at the top of that file).
//  Two stories you can play, like Spirit and Opportunity:
//     "rover"  the Lunar Roving Vehicle (LRV-1), nicknamed "Rover"
//     "falcon" the lunar module Falcon, which also carried the ALSEP science station
//
//  EVERY FACT here comes from NASA pages (all listed in the About screen):
//   - NSSDCA, Apollo 15 Lunar Module / ALSEP (1971-063C)   <- the main source
//       https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C
//   - NSSDCA, The Apollo Lunar Roving Vehicle (rover size, wheels, controls, driving numbers, cost)
//   - NSSDCA, Apollo 15 mission page (crew, launch, landing, return)
//   - NSSDCA, The Apollo 15 Hammer-Feather Drop
//   - NASA/JPL infographic "Comparing Off-World Rover Driving Distances" (the records picture)
//
//  Day 0 on the counter is launch day, July 26, 1971.
//
//  Extra actors for this level (see level-art.js):
//     "lander"  "lander descend"  "lander liftoff"  "alsep"  and the usual "rover", "craft"...
//
//  Pictures: "img" is a local file. Every picture is a NASA photograph or NASA/JPL graphic.
// ============================================================

const IMG = "assets/images/moon/";

export const rovers = {
  rover: {
    name: "Rover",
    nickname: "LRV-1",
    launch: "1971-07-26",
    accent: "#4d4dff",
    light: "#9c9cff",
    other: "falcon",
    img: IMG + "lrv-hadley-1.jpg",
    tagline: "Rides to the Moon folded up in the side of the lander, then carries two astronauts across the Hadley-Apennine region.",
    stats: ["Mass of 210 kg", "Drove 27.8 km (17.3 miles)", "3 hours 2 minutes of driving"]
  },
  falcon: {
    name: "Falcon",
    nickname: "LM-10",
    launch: "1971-07-26",
    accent: "#be007d",
    light: "#ff6fc4",
    other: "rover",
    img: IMG + "saturn5-pad.jpg",
    tagline: "Lands two astronauts at the foot of the Apennine mountains and leaves a science station behind.",
    stats: ["Landed July 30, 1971", "66 hours 55 minutes on the Moon", "Left the ALSEP science station"]
  }
};

// The Moon has no air, so the sky is always black and there is no wind: only a deep, quiet hum.
export const backdrops = {
  launch:    { skyTop: "#02020f", skyBottom: "#4b3a78", far: "#0b0b24", ground: "#07071a", stars: 0.8, dust: 0, sun: 0, earth: 0 },
  space:     { skyTop: "#00000f", skyBottom: "#000030", far: "transparent", ground: "transparent", stars: 1, dust: 0, sun: 0, earth: 0 },
  descent:   { skyTop: "#00000a", skyBottom: "#0b0b1c", far: "#3c3c48", ground: "#6a6a76", stars: 1, dust: 0, sun: 0.7, earth: 0 },
  surface:   { skyTop: "#00000a", skyBottom: "#0b0b18", far: "#55555f", ground: "#8d8d96", stars: 1, dust: 0, sun: 0.95, earth: 0.95 },
  rille:     { skyTop: "#00000a", skyBottom: "#0a0a16", far: "#3f3f4a", ground: "#7a7a84", stars: 1, dust: 0, sun: 0.95, earth: 0.95 },
  mountains: { skyTop: "#00000a", skyBottom: "#0a0a16", far: "#707080", ground: "#9a9aa4", stars: 1, dust: 0, sun: 0.9, earth: 0.95 },
  dusk:      { skyTop: "#05051f", skyBottom: "#2a2a5a", far: "#25253a", ground: "#34344a", stars: 0.9, dust: 0, sun: 0.3, earth: 0.9 }
};

// ============================================================
//  ROVER'S STORY  (the Lunar Roving Vehicle)
// ============================================================
const roverStory = [
  {
    title: "Folded Up",
    date: "1971-07-26",
    place: "Cape Canaveral, Florida",
    bg: "launch",
    actor: "craft launch",
    beats: [
      { who: "narrator", text: "Cape Canaveral, Florida. July 26, 1971. You are folded up like a suitcase in a bay on the side of the lander Falcon. Your wheels are tucked in and your underside faces out. You have never turned a single wheel." },
      { who: "earth", text: "T-minus ten seconds. You are the Lunar Roving Vehicle, but everyone calls you Rover. You were developed in only 17 months by Boeing, with Delco as a major sub-contractor, so try not to waste a second of it." },
      { type: "choice", prompt: "You are about to ride a Saturn 5 rocket to the Moon. How do you feel?", options: [
        { label: "Ready!", who: "me", text: "Ready! Let's go for a drive." },
        { label: "Squished.", who: "earth", text: "You were folded to fit. Squished is exactly the plan." },
        { label: "Can I stay home?", who: "earth", text: "Not today. There is a whole Moon waiting for your wheels." }
      ] },
      { type: "found", img: IMG + "saturn5-pad.jpg", title: "Found: your rocket", caption: "A NASA photograph of a Saturn 5 rocket, the kind that launched the Apollo missions to the Moon, standing on its mobile launcher platform." },
      { who: "narrator", actor: "craft launch lift", text: "Three. Two. One. Liftoff! The Saturn 5 shakes the ground, and a few minutes later you are above the clouds, and then above the sky." },
      { who: "me", text: "My job is simple: carry two astronauts and their tools far beyond where their own legs could take them. My seatbelts are Velcro. Fancy, right?" },
      { who: "narrator", date: "1971-07-30", bg: "space", actor: "craft", text: "After a few days of flying, the Moon is close. The command module Endeavour and the lander Falcon, with you inside it, are about to part ways." },
      { type: "meanwhile", text: "On July 30, 1971, Falcon separates from the command module. Alfred M. Worden stays in orbit, and Falcon begins the trip down to the surface." }
    ],
    entry: {
      text: "Launched July 26, 1971 on a Saturn 5 from Cape Canaveral, folded up in a bay on the side of the lander Falcon. I was developed in only 17 months. My job: carry two astronauts far beyond where their own legs can go.",
      meanwhile: "Falcon separated from the command module on July 30, 1971, while Alfred M. Worden stayed in orbit."
    }
  },
  {
    title: "Touchdown at Hadley",
    date: "1971-07-30",
    place: "Hadley Rille and the Apennine mountains",
    bg: "descent",
    actor: "lander descend",
    beats: [
      { who: "narrator", text: "July 30, 1971. Falcon's descent engine fires, and you feel the rumble through the whole lander. You can't see a thing. You are folded up inside a side bay." },
      { who: "earth", text: "Houston is watching every step of the landing, Rover. Hold on tight." },
      { who: "me", text: "Four landing legs with round footpads hold us 1.5 meters above the ground. Please don't look down." },
      { type: "choice", prompt: "Falcon is about to touch the Moon. What do you say?", options: [
        { label: "Gently, please!", who: "earth", text: "The descent engine can throttle deeply, so it can push gently or hard. Gently it is." },
        { label: "Is the Moon dusty?", who: "me", text: "Probably. I have dust guards over my wheels, just in case." },
        { label: "Are we there yet?", who: "narrator", text: "Almost. A little more engine burn, and then a very soft stop." }
      ] },
      { who: "narrator", actor: "lander", bg: "surface", text: "At 6:16 p.m. EDT, Falcon lands in the Mare Imbrium region, at the foot of the Apennine mountains, near a long valley called Hadley Rille." },
      { who: "earth", text: "Falcon has landed. On board are Commander David R. Scott and lunar module pilot James B. Irwin. They will become the seventh and eighth people to walk on the Moon." },
      { type: "meanwhile", text: "Falcon is down. There are no seats inside it, so the astronauts stand up the whole time. In two hours, Scott will open the top hatch." }
    ],
    entry: {
      text: "On July 30, 1971 at 6:16 p.m. EDT, Falcon landed in the Mare Imbrium region at the foot of the Apennine mountains, near Hadley Rille. Four legs held the lander 1.5 meters above the ground, with me folded up in a bay on its side.",
      meanwhile: "Falcon carried two astronauts, Commander David R. Scott and lunar module pilot James B. Irwin."
    }
  },
  {
    title: "Unfolding",
    date: "1971-07-31",
    place: "Hadley Base, the Moon",
    bg: "surface",
    actor: "lander",
    beats: [
      { who: "narrator", text: "July 31, 1971. The first moonwalk. One astronaut climbs the ladder on Falcon's leg and releases you. The other waits on the ground." },
      { who: "me", text: "He lowers me slowly with ropes and cloth tapes. Most of the unfolding happens by itself, and my rear wheels flip out and lock into place." },
      { type: "choice", prompt: "How does it feel to stretch out after a long trip folded up?", options: [
        { label: "Great!", who: "me", text: "Ahhh. A suitcase that just turned into a car." },
        { label: "A little stiff.", who: "earth", text: "Everything locks into place as you open. You will be fine." },
        { label: "Is that really the Moon?", who: "me", text: "Gray dust, a black sky and a lot of rocks. Yes. It really is." }
      ] },
      { who: "earth", text: "The front half unfolds next. When the rear wheels touch the ground, the front wheels deploy, and the pulleys lower the whole frame to the surface." },
      { who: "narrator", actor: "rover", text: "Cables, pins and tripods come off. The seats and footrests go up. The electronics switch on, and you are ready to back away from Falcon." },
      { type: "found", img: IMG + "lrv-hadley-1.jpg", title: "Found: unfolded and ready", caption: "A NASA photograph of the rover on the Moon with an astronaut beside it. Unfolded, its frame was 3.1 meters long." },
      { type: "meanwhile", text: "Falcon's side bay is empty now. The lander's work on the Moon is about to begin in earnest." }
    ],
    entry: {
      text: "On July 31, 1971, one astronaut released me from Falcon's side bay and the other lowered me with ropes and cloth tapes. My rear wheels folded out and locked, the front wheels deployed, the frame came down to the surface and the seats went up. I was ready to drive.",
      meanwhile: "Falcon's side bay, called quad 1, was empty."
    }
  },
  {
    title: "First Drive",
    date: "1971-07-31",
    place: "Elbow Crater and St. George Crater",
    bg: "rille",
    actor: "rover",
    beats: [
      { who: "narrator", text: "Scott and Irwin climb aboard, side by side. There is no steering wheel, only a T-shaped hand controller between the two seats." },
      { type: "found", img: IMG + "lrv-seated.jpg", title: "Found: you, on the Moon", caption: "A NASA photograph of an Apollo Lunar Roving Vehicle on the Moon with an astronaut aboard. A large mesh dish antenna stood on a mast at the front." },
      { who: "me", text: "Push the stick forward and I go forward. Left and right turn me. Pull it back and I brake, and all the way back is the parking brake. Each of my wheels has its own electric motor." },
      { who: "narrator", text: "In front of the handle, a control and display module shows speed, heading, pitch, power and temperature. A Sun-shadow device at the top gives a heading from the direction of the Sun." },
      { type: "choice", prompt: "No roads, no signs. How do you find your way home?", options: [
        { label: "Follow my tracks", who: "me", text: "Not a bad idea. But I have something better." },
        { label: "Ask Houston", who: "earth", text: "We are happy to help, but you carry your own navigator." },
        { label: "Use the Sun", who: "me", text: "I have a Sun-shadow device for that. The Sun moves very slowly in the sky, so it works like a compass." }
      ] },
      { who: "me", text: "My real navigator keeps count of direction with a gyro and distance with an odometer, so a computer always knows the way back to Falcon." },
      { who: "narrator", text: "The first traverse is 10.3 kilometers long. You roll to the edge of Hadley Rille, then to Elbow Crater, near St. George Crater, and back to Falcon." },
      { who: "earth", text: "Back at Falcon, the astronauts take a core sample from three meters below the surface. At the end of the traverse they set up ALSEP, a science station." },
      { type: "meanwhile", text: "Falcon watches the astronauts set up ALSEP next to it. Seven instruments will listen to the Moon for years." }
    ],
    entry: {
      text: "First moonwalk, July 31, 1971: a 10.3 km drive to the edge of Hadley Rille, to Elbow Crater, near St. George Crater and back to Falcon. I was steered with a T-shaped hand controller, and a gyro and an odometer always knew the way home.",
      meanwhile: "At the end of the traverse the astronauts set up ALSEP, a science station, next to Falcon."
    }
  },
  {
    title: "Along the Mountains",
    date: "1971-08-01",
    place: "Base of the Apennine mountains",
    bg: "mountains",
    actor: "rover",
    beats: [
      { who: "narrator", text: "August 1, 1971. The second moonwalk. The astronauts steer you southeast, along the base of the Apennine mountains." },
      { who: "me", text: "My tires are woven from steel strands, with titanium chevrons for grip. Moon dust, bring it on." },
      { type: "choice", prompt: "Lots of craters ahead. Which one first?", options: [
        { label: "Index", who: "earth", text: "Good choice. The route also passes Arbeit, Crescent, Dune and Spur craters." },
        { label: "Spur", who: "earth", text: "Spur is on the route too, along with Index, Arbeit, Crescent and Dune." },
        { label: "All of them!", who: "me", text: "That's the route: Index, Arbeit, Crescent, Dune and Spur." }
      ] },
      { who: "narrator", text: "You drive a 12.5 kilometer traverse, your longest one, past Index, Arbeit, Crescent, Dune and Spur craters, and back to the ALSEP site." },
      { type: "found", img: IMG + "lrv-hadley-2.jpg", title: "Found: a drive near the mountains", caption: "A NASA photograph of the rover on the Moon with an astronaut beside it. Gray hills rise behind it under a black sky." },
      { who: "me", text: "The farthest I get from Falcon on the whole mission is 5.0 kilometers." },
      { who: "earth", text: "Every stop is a chance to collect rocks and soil and to take photographs for science." },
      { type: "meanwhile", text: "ALSEP's central station has been switched on since July 31. It keeps sending data from the Moon to Earth." }
    ],
    entry: {
      text: "August 1, 1971: the second moonwalk, a 12.5 km traverse southeast along the base of the Apennine mountains, past Index, Arbeit, Crescent, Dune and Spur craters and back to the ALSEP site. My steel-mesh tires with titanium chevrons held on fine.",
      meanwhile: "ALSEP's central station had been switched on since July 31."
    }
  },
  {
    title: "Hammer and Feather",
    date: "1971-08-02",
    place: "Hadley Rille, near Falcon",
    bg: "rille",
    actor: "rover",
    beats: [
      { who: "narrator", text: "August 2, 1971. The third and last moonwalk. You drive 5.1 kilometers west to Scarp Crater, then northwest along the edge of Hadley Rille, and back east across the dark plain." },
      { type: "choice", prompt: "It is your last drive. Anything to say to the Moon?", options: [
        { label: "Thanks for having us.", who: "me", text: "The Moon doesn't answer. But the view was worth every kilometer." },
        { label: "Wow.", who: "narrator", text: "Gray dust, a black sky and a long, deep valley. Wow is right." },
        { label: "See you later!", who: "earth", text: "In a way, yes. You are staying right here." }
      ] },
      { who: "earth", text: "Before they leave, Commander Scott has one more thing to show the TV cameras. He holds out a geologic hammer in one hand and a feather in the other." },
      { who: "me", text: "The 1.32 kg aluminum hammer and a falcon feather are let go together from about 1.6 meters. With no air to slow the feather, both hit the surface at the same time. Galileo reached the same idea hundreds of years ago." },
      { who: "narrator", text: "The astronauts also leave a plaque and a small figure in memory of fourteen American and Soviet space explorers who died." },
      { type: "meanwhile", text: "Falcon is almost ready to lift off. It will be gone in a few hours." }
    ],
    entry: {
      text: "August 2, 1971: the third moonwalk, a 5.1 km drive west to Scarp Crater, northwest along Hadley Rille and back east across the plain. At the end, Commander Scott dropped a hammer and a feather together on live TV, and they landed at the same time. A plaque and a small figure were left in memory of fourteen space explorers.",
      meanwhile: "Falcon was almost ready to lift off."
    }
  },
  {
    title: "Parked for Good",
    date: "1971-08-02",
    place: "Hadley Base, the Moon",
    bg: "surface",
    actor: "rover",
    beats: [
      { who: "narrator", text: "The last drive ends. Scott and Irwin climb off and head back to Falcon. You will not carry anyone again." },
      { who: "me", text: "My numbers: 27.8 kilometers in 3 hours and 2 minutes of driving. My longest traverse was 12.5 kilometers, and my farthest point from Falcon was 5.0." },
      { who: "earth", text: "No major problems, Rover. A vehicle like you had never been used before, and you did everything we asked. You were developed in only 17 months." },
      { type: "choice", prompt: "What do you do now?", options: [
        { label: "Stay on guard", who: "me", text: "Somebody has to watch over Falcon's landing site." },
        { label: "Say thank you", who: "earth", text: "Thank you, Rover. All of us." },
        { label: "Watch the liftoff", who: "narrator", text: "Good idea. In a few moments, Falcon will be gone." }
      ] },
      { who: "narrator", date: "1971-08-02", actor: "lander liftoff", text: "At 17:11 UT, after 66 hours and 55 minutes on the Moon, Falcon's ascent stage lifts off. The bottom half stays on the Moon. So do you." },
      { who: "earth", text: "And for the first time, people on Earth watch a lunar liftoff, through your TV camera." },
      { who: "me", actor: "rover", text: "Parked for good. Not bad for a folding car." }
    ],
    entry: {
      text: "I drove 27.8 km in 3 hours 2 minutes, my longest traverse was 12.5 km, and I never went farther than 5.0 km from Falcon. I had no major problems. On August 2, 1971, after 66 hours 55 minutes on the Moon, Falcon lifted off and left me parked. For the first time, my TV camera showed a lunar liftoff to Earth.",
      meanwhile: "Falcon's ascent stage lifted off at 17:11 UT, and its descent stage stayed on the Moon."
    }
  },
  {
    title: "Legacy",
    date: "2026-10-12",
    place: "Records and numbers",
    bg: "dusk",
    actor: "none",
    beats: [
      { who: "narrator", text: "Three Lunar Roving Vehicles were driven on the Moon: one on Apollo 15, one on Apollo 16 and one on Apollo 17." },
      { type: "found", img: "assets/images/mars/records.jpg", title: "Found: the driving records", caption: "Driving distances on Mars and the Moon, as of October 12, 2026. Apollo 17 lunar rover 35.74 km, Apollo 15 lunar rover 27.8 km, Apollo 16 lunar rover 27.1 km. (NASA/JPL-Caltech)" },
      { who: "earth", text: "Harrison Schmitt of Apollo 17 said that without the rovers, the major discoveries of Apollo 15, 16 and 17 would not have been possible." },
      { who: "narrator", text: "Four lunar rovers were built. Three were driven on the Moon. The fourth was used for spare parts when the last Apollo missions were cancelled." },
      { type: "choice", prompt: "What would you tell the next explorer to drive on another world?", options: [
        { label: "Hold on tight", who: "me", text: "And don't forget your Velcro belt." },
        { label: "Mind the craters", who: "me", text: "They look small until you are inside one." },
        { label: "Bring a camera", who: "me", text: "There is a lot to see." }
      ] },
      { type: "meanwhile", text: "Falcon's ALSEP station kept listening to the Moon for years. On September 30, 1977, all the ALSEP stations were shut down." },
      { who: "me", text: "Developed in 17 months. Drove 27.8 kilometers. Not bad for a folding car." }
    ],
    entry: {
      text: "Three lunar rovers drove on the Moon: on Apollo 15, 16 and 17. Mine was the first of the three, and it went 27.8 km. Harrison Schmitt of Apollo 17 said the major discoveries of the last three Apollo missions would not have been possible without the rovers.",
      meanwhile: "The ALSEP stations were shut down on September 30, 1977."
    }
  }
];

// ============================================================
//  FALCON'S STORY  (the lunar module, with the ALSEP station)
// ============================================================
const falconStory = [
  {
    title: "Two Stages, No Seats",
    date: "1971-07-26",
    place: "Cape Canaveral, Florida",
    bg: "launch",
    actor: "craft launch",
    beats: [
      { who: "narrator", text: "Cape Canaveral, Florida. July 26, 1971. You are Falcon, the Apollo 15 lunar module, also called LM-10. You weigh 16,430 kilograms, and you are built in two stages." },
      { who: "earth", text: "Descent stage on the bottom, ascent stage on top. The bottom half lands you. The top half takes the astronauts home." },
      { type: "choice", prompt: "Any last words before liftoff?", options: [
        { label: "Where are my seats?", who: "earth", text: "There are no seats in the lunar module. The astronauts stand up the whole time." },
        { label: "Is it comfortable?", who: "earth", text: "The crew cabin is 6.65 cubic meters. Cozy is the word." },
        { label: "See you on the Moon!", who: "me", text: "See you on the Moon! Save me a flat spot." }
      ] },
      { type: "found", img: IMG + "saturn5-pad.jpg", title: "Found: your rocket", caption: "A NASA photograph of a Saturn 5 rocket, the kind that launched the Apollo missions to the Moon, standing on its mobile launcher platform." },
      { who: "narrator", actor: "craft launch lift", text: "Three. Two. One. Liftoff! The Saturn 5 carries you up, with a Lunar Roving Vehicle folded up in your side." },
      { who: "me", text: "I will be the fourth crewed vehicle to land on the Moon. Commander David R. Scott and lunar module pilot James B. Irwin will ride inside me. Alfred M. Worden will stay in the command module." },
      { who: "narrator", date: "1971-07-30", bg: "space", actor: "craft", text: "After a few days of flying, you reach the Moon together with the command module Endeavour." },
      { type: "meanwhile", text: "The Lunar Roving Vehicle rides folded up in a bay on your side, wheels tucked in. It has never turned a wheel." }
    ],
    entry: {
      text: "Launched July 26, 1971 on a Saturn 5. I am the lunar module LM-10, with a descent stage that lands and an ascent stage that flies home. I weigh 16,430 kg and have no seats.",
      meanwhile: "The Lunar Roving Vehicle rode folded up in a bay on my side."
    }
  },
  {
    title: "Undocking",
    date: "1971-07-30",
    place: "Lunar orbit",
    bg: "space",
    actor: "craft",
    beats: [
      { who: "narrator", text: "July 30, 1971. At 18:13 UT you separate from the command module Endeavour, flown by Alfred M. Worden. From now on you are on your own." },
      { who: "me", text: "I have two engines. The descent engine can throttle from gentle to hard, up to about 45,000 newtons. The ascent engine is simpler: one fixed push of about 15,000 newtons." },
      { who: "earth", text: "And small thrusters keep you pointed the right way: four modules around your sides, with four little nozzles each." },
      { type: "choice", prompt: "Are you ready to land?", options: [
        { label: "Ready!", who: "me", text: "Radar, gyroscopes, accelerometers and the Apollo guidance computer are all working." },
        { label: "A little nervous.", who: "earth", text: "Everything is working. Houston is watching." },
        { label: "Do I get a parachute?", who: "earth", text: "No air to hold one up. Your engine does all the work." }
      ] },
      { who: "narrator", text: "You fire the descent engine, and the long fall toward the surface begins." },
      { type: "meanwhile", text: "The rover is still asleep in your side bay. In a few hours, it will see the Moon." }
    ],
    entry: {
      text: "July 30, 1971: I separated from Endeavour at 18:13 UT. My descent engine can throttle from gentle to hard (up to about 45,000 N), and I steered with radar, gyroscopes, accelerometers and the Apollo guidance computer.",
      meanwhile: "The rover stayed folded up in my side bay."
    }
  },
  {
    title: "Touchdown",
    date: "1971-07-30",
    place: "Hadley Rille and the Apennine mountains",
    bg: "descent",
    actor: "lander descend",
    beats: [
      { who: "narrator", text: "The Moon grows beneath you: gray plains, a black sky, and a long valley called Hadley Rille next to the Apennine mountains." },
      { who: "me", text: "Legs out. Four round footpads, 1.5 meters off the ground, with 9.4 meters between the farthest two. I hope the ground is flat." },
      { type: "choice", prompt: "You are about to touch down. What do you think about?", options: [
        { label: "Staying level", who: "me", text: "A flat landing means an easy liftoff later." },
        { label: "The view", who: "me", text: "Mountains on one side, a deep valley on the other. Not bad." },
        { label: "Nothing at all", who: "earth", text: "Good. A calm lander is a lucky lander." }
      ] },
      { who: "narrator", actor: "lander", bg: "surface", text: "At 6:16 p.m. EDT on July 30, 1971 (22:16 UT), you land in the Mare Imbrium region, at the foot of the Apennine mountains." },
      { who: "earth", text: "Falcon has landed. You are the fourth crewed vehicle to land on the Moon." },
      { type: "meanwhile", text: "The rover is still folded up in your side bay, ready to wake up." }
    ],
    entry: {
      text: "At 6:16 p.m. EDT on July 30, 1971 I landed in the Mare Imbrium region at the foot of the Apennine mountains, near Hadley Rille. My four legs held me 1.5 meters above the ground, with 9.4 meters between the farthest footpads.",
      meanwhile: "The rover was still folded up in my side bay."
    }
  },
  {
    title: "The Standup",
    date: "1971-07-30",
    place: "Hadley Base, the Moon",
    bg: "surface",
    actor: "lander",
    beats: [
      { who: "narrator", text: "Two hours after landing, the cabin is depressurized and Commander Scott stands up in the top hatch. For 33 minutes he describes and photographs the landscape." },
      { who: "me", text: "No seats, remember? He just stands in my cabin and looks out of the top hatch." },
      { who: "earth", text: "Your S-band antenna sends voice, TV and data to Earth. VHF radio links the astronauts, you and the command module." },
      { type: "choice", prompt: "What does the Moon look like from the top hatch?", options: [
        { label: "Gray", who: "narrator", text: "Gray dust, gray rocks and a black sky." },
        { label: "Huge", who: "me", text: "Huge. And completely silent." },
        { label: "Dusty", who: "me", text: "Very. I hope Rover's dust guards are ready." }
      ] },
      { who: "narrator", text: "Six silver-zinc batteries power you, and an environmental control system recycles oxygen and keeps the electronics and the cabin at the right temperature." },
      { type: "meanwhile", text: "Tomorrow, the rover wakes up. The first moonwalk is on its way." }
    ],
    entry: {
      text: "Two hours after landing, Commander Scott stood in my top hatch for 33 minutes, describing and photographing the landscape. My S-band antenna sent TV, voice and data to Earth, and six silver-zinc batteries kept me powered.",
      meanwhile: "The rover would be unloaded the next day."
    }
  },
  {
    title: "The Rover Rolls Out",
    date: "1971-07-31",
    place: "Hadley Base, the Moon",
    bg: "surface",
    actor: "lander",
    beats: [
      { who: "narrator", text: "July 31. The first moonwalk begins at 13:13 UT. Scott and Irwin unload the Lunar Roving Vehicle from your side bay and drive it away." },
      { who: "me", text: "That bay is called quad 1, and it is empty now. Rover is rolling away." },
      { who: "earth", text: "Your descent stage was built to carry equipment: water, oxygen, helium, fuel and storage space for lunar tools. On Apollo 15, 16 and 17 that included a rover." },
      { type: "found", img: IMG + "lrv-hadley-1.jpg", title: "Found: Rover, on the Moon", caption: "A NASA photograph of the Lunar Roving Vehicle on the Moon with an astronaut beside it. It rode to the Moon folded up in your side bay." },
      { type: "choice", prompt: "Rover is rolling away. Say something.", options: [
        { label: "Don't go too far!", who: "me", text: "Rover's farthest point from me is 5.0 kilometers." },
        { label: "Take photos!", who: "earth", text: "The astronauts will take lots of photographs and collect lots of rocks." },
        { label: "Be back soon!", who: "me", text: "It will be. Three drives, one per day." }
      ] },
      { who: "narrator", text: "The first traverse is 10.3 kilometers long and ends right back at your feet, where the astronauts take a core sample from three meters below the surface." },
      { type: "meanwhile", text: "Rover's first drive takes it to the edge of Hadley Rille, to Elbow Crater, and near St. George Crater." }
    ],
    entry: {
      text: "On July 31, 1971 at 13:13 UT the first moonwalk began. The Lunar Roving Vehicle rolled out of my side bay. Its first traverse was 10.3 km and ended back at my feet, where a core sample was taken three meters deep.",
      meanwhile: "Rover drove to Hadley Rille, Elbow Crater and near St. George Crater."
    }
  },
  {
    title: "ALSEP",
    date: "1971-07-31",
    place: "The ALSEP site, next to Falcon",
    bg: "surface",
    actor: "alsep",
    beats: [
      { who: "narrator", text: "At the end of the first traverse, the astronauts set up a science station near you: ALSEP, the Apollo Lunar Surface Experiments Package." },
      { who: "me", text: "It is built around a central station, a 25 kg box with an antenna that the astronauts point toward Earth." },
      { who: "earth", text: "Power comes from a small nuclear generator, an RTG. Its fuel capsule holds plutonium-238, and the generator makes about 70 watts. The astronauts place the capsule inside when they set it up." },
      { type: "choice", prompt: "Which instrument sounds the coolest?", options: [
        { label: "The seismometer", who: "earth", text: "It measures seismic activity and the physical properties of the Moon's crust and interior." },
        { label: "The heat flow experiment", who: "earth", text: "It measures how fast the Moon loses heat from its interior." },
        { label: "The magnetometer", who: "earth", text: "It measures the magnetic field at the lunar surface." }
      ] },
      { who: "narrator", date: "1971-07-31", text: "At 18:37 UT on July 31, 1971, ALSEP's central station is switched on, and its instruments begin sending data to Earth." },
      { who: "me", text: "Seven instruments: a seismometer, a magnetometer, a solar wind spectrometer, an ion detector, an ion gauge, a dust detector and a heat flow experiment." },
      { type: "meanwhile", text: "Rover finishes its first drive back at Falcon." }
    ],
    entry: {
      text: "At the end of the first traverse the astronauts set up ALSEP near me. Its central station was switched on at 18:37 UT on July 31, 1971. A nuclear generator (RTG) with plutonium-238 powered seven instruments that listened to the Moon.",
      meanwhile: "Rover ended its first drive back at Falcon."
    }
  },
  {
    title: "Liftoff From the Moon",
    date: "1971-08-02",
    place: "Hadley Base, the Moon",
    bg: "surface",
    actor: "lander",
    beats: [
      { who: "narrator", text: "August 2, 1971. After the third moonwalk, Commander Scott does one last thing for the TV cameras: he drops a 1.32 kg aluminum hammer and a falcon feather from about 1.6 meters. They hit the surface at the same time." },
      { who: "earth", text: "Before they leave, the astronauts also place a plaque and a small figure in memory of fourteen American and Soviet space explorers who died." },
      { who: "me", text: "My descent stage is a launch platform. The ascent stage flies home. The descent stage stays here." },
      { type: "choice", prompt: "Ready for liftoff?", options: [
        { label: "Ready!", who: "me", text: "66 hours and 55 minutes on the Moon. Time to go home." },
        { label: "Sad to leave?", who: "me", text: "A little. This was a good place." },
        { label: "Three, two, one...", who: "narrator", text: "Ignition!" }
      ] },
      { who: "narrator", actor: "lander liftoff", text: "At 17:11 UT, the ascent engine fires and the top half of you flies up. The bottom half, with its four legs, stays behind." },
      { who: "earth", text: "People on Earth watch the lunar liftoff through the rover's TV camera. It is a first." },
      { type: "meanwhile", text: "Rover stays parked for good. In three drives it covered 27.8 kilometers." }
    ],
    entry: {
      text: "On August 2, 1971, after 66 hours and 55 minutes on the Moon, my ascent stage lifted off with Scott and Irwin. My descent stage stayed behind. Before that, Scott dropped a hammer and a feather on live TV, and a plaque and a small figure were left for fourteen space explorers.",
      meanwhile: "Rover was parked for good after covering 27.8 km."
    }
  },
  {
    title: "Left Behind",
    date: "1971-08-03",
    place: "Lunar orbit, then the Moon",
    bg: "dusk",
    actor: "none",
    beats: [
      { who: "narrator", text: "At 19:09 UT on August 2, the ascent stage docks with Endeavour, flown by Alfred M. Worden. At 01:04 UT on August 3, you are jettisoned into lunar orbit." },
      { who: "me", text: "Two hours later my ascent stage comes back down and hits the Moon at 26.36 N, 0.25 E. A very last landing." },
      { who: "earth", text: "But your descent stage is still at Hadley. So is ALSEP, listening to the Moon." },
      { type: "choice", prompt: "Your story ends here. Anything to say?", options: [
        { label: "Thank you", who: "me", text: "Thank you, Scott, Irwin, Worden and everyone at Houston." },
        { label: "Two stages, one job", who: "me", text: "Two stages. One landing. One liftoff. Perfect." },
        { label: "Goodbye, Moon", who: "narrator", text: "Goodbye, Moon." }
      ] },
      { type: "meanwhile", text: "ALSEP kept working for years. On September 30, 1977, all the ALSEP stations were shut down." },
      { who: "narrator", date: "1971-08-07", text: "On August 7, 1971, the crew returns to Earth, ending a mission of about 12 days." },
      { who: "me", text: "Built to land. Built to leave half of myself behind. Not bad for a lander." }
    ],
    entry: {
      text: "After docking with Endeavour I was jettisoned on August 3, 1971, and my ascent stage hit the Moon about two hours later. My descent stage stayed at Hadley. ALSEP kept listening until September 30, 1977, and the crew returned to Earth on August 7, 1971.",
      meanwhile: "Rover and ALSEP stayed at Hadley."
    }
  }
];

export const story = { rover: roverStory, falcon: falconStory };

// ============================================================
//  THE TEST
//  answer = the number of the right option, starting from 0.
//  The options get shuffled when the quiz is shown.
// ============================================================
export const quiz = [
  { q: "Which Apollo mission was the first to use a Lunar Roving Vehicle?",
    options: ["Apollo 11", "Apollo 13", "Apollo 15", "Apollo 17"], answer: 2,
    why: "Apollo 15 was the first mission to use the Lunar Roving Vehicle. Apollo 16 and 17 used one too." },
  { q: "What was the name of the Apollo 15 lunar module?",
    options: ["Eagle", "Falcon", "Endeavour", "Columbia"], answer: 1,
    why: "Falcon was the lunar module. Endeavour was the command module." },
  { q: "How did the rover travel to the Moon?",
    options: ["It drove there", "Folded up in a bay on the side of the lunar module", "Inside the command module", "It was built on the Moon"], answer: 1,
    why: "The rover was folded and stored in a bay of the lunar module, with the underside of its chassis facing out." },
  { q: "How did the astronauts get the rover out of the lander?",
    options: ["With a crane", "With ropes, cloth tapes and pulleys", "It drove out by itself", "They threw it"], answer: 1,
    why: "One astronaut released it, and the other lowered it with reels, tapes and pulleys. Most of the unfolding was automatic." },
  { q: "How far did the Apollo 15 rover drive in total?",
    options: ["2.8 km", "27.8 km", "78 km", "278 km"], answer: 1,
    why: "It drove 27.8 km in 3 hours and 2 minutes of driving." },
  { q: "What was the longest single traverse of the Apollo 15 rover?",
    options: ["3.1 km", "5.1 km", "10.3 km", "12.5 km"], answer: 3,
    why: "The second moonwalk, on August 1, 1971, covered 12.5 km along the base of the Apennine mountains." },
  { q: "What was the farthest the rover ever got from the lander?",
    options: ["500 m", "5.0 km", "50 km", "It never left the lander"], answer: 1,
    why: "On Apollo 15 the rover's maximum range from the lunar module was 5.0 km." },
  { q: "How did the astronauts steer the rover?",
    options: ["A steering wheel", "Pedals", "A T-shaped hand controller", "A computer touchscreen"], answer: 2,
    why: "The T-shaped hand controller between the seats controlled the four drive motors, the two steering motors and the brakes." },
  { q: "What did Commander David Scott drop for the TV cameras on the last moonwalk?",
    options: ["A flag and a rock", "A hammer and a feather", "Two rocks", "A camera and a hammer"], answer: 1,
    why: "With no air to slow the feather, the hammer and the feather landed at the same time." },
  { q: "What powered the ALSEP science station?",
    options: ["Solar panels only", "A small nuclear generator (RTG) with plutonium-238", "A gasoline engine", "A cable to the lander"], answer: 1,
    why: "A SNAP-27 radioisotope generator made about 70 watts for the seven ALSEP instruments." },
  { q: "How many seats did the lunar module have?",
    options: ["None", "Two", "Four", "Six"], answer: 0,
    why: "There were no seats in the lunar module. The astronauts stood up." },
  { q: "What happened to Falcon's ascent stage after the astronauts left it?",
    options: ["It flew back to Earth", "It was jettisoned and hit the Moon about two hours later", "It stayed in orbit forever", "It landed at Hadley"], answer: 1,
    why: "It was jettisoned on August 3, 1971 and impacted the Moon about two hours later. The descent stage stayed at the landing site." }
];
