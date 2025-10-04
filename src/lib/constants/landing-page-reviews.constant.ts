import { getRandomElement } from "$lib/utils/array.util";

interface Review {
  name: string;
  date: string;
  rating: number;
  title: string;
  content: string;
  borderColor: string;
}

function getRandomBorderColor() {
  const borderColors = [
    "border-blue-400",
    "border-red-400",
    "border-pink-400",
    "border-purple-400",
    "border-green-400",
    "border-yellow-400",
  ];

  return getRandomElement(borderColors);
}

export const landingPageReviews: Review[] = [
  {
    name: "Marcus_T",
    date: "08/14/2024",
    rating: 5,
    title: "Actually saved my dating life fr",
    content:
      "no cap this app is clutch. used to send the most basic 'hey' messages and wonder why girls never replied 💀 now i'm getting actual convos started. the AI suggestions are lowkey genius and don't sound cringe like other apps",
    borderColor: getRandomBorderColor(),
  },
  {
    name: "SarahK_23",
    date: "09/03/2024",
    rating: 5,
    title: "Finally something that gets it",
    content:
      "As someone who's terrible at small talk, this has been a lifesaver! The conversation starters actually feel natural and help me show my personality instead of just being another boring opener.",
    borderColor: getRandomBorderColor(),
  },
  {
    name: "zay_vibes",
    date: "07/28/2024",
    rating: 5,
    title: "this app is actually goated 🔥",
    content:
      "bro i was skeptical at first but this thing generates some FIRE openers. went from getting left on read to actually having decent convos. premium is definitely worth it if you're serious about not being single forever lmao",
    borderColor: getRandomBorderColor(),
  },
  {
    name: "Emma_Rodriguez",
    date: "06/19/2024",
    rating: 5,
    title: "Game changer for introverts",
    content:
      "I'm naturally shy and always struggled with making the first move. This app gives me confidence by suggesting conversation starters that actually match the person's profile. My match rate has improved so much!",
    borderColor: getRandomBorderColor(),
  },
  {
    name: "jayden.codes",
    date: "08/07/2024",
    rating: 5,
    title: "developer approved ✅",
    content:
      "as a software engineer i appreciate good UX and this app delivers. the AI actually reads profiles and suggests relevant openers instead of generic garbage. been using it for months and still impressed",
    borderColor: getRandomBorderColor(),
  },
  {
    name: "riley_adventures",
    date: "09/12/2024",
    rating: 5,
    title: "Perfect for busy people",
    content:
      "Between work and grad school I barely have time to craft thoughtful messages. This app does the heavy lifting while still letting me sound like myself. Honestly wish I found this sooner!",
    borderColor: getRandomBorderColor(),
  },

  {
    name: "alex_m",
    date: "09/21/2024",
    rating: 5,
    title: "No more awkward openers",
    content:
      "Used to overthink every message for like 20 minutes. Now I just tap and send. Actually getting replies for once 🙌",
    borderColor: getRandomBorderColor(),
  },
  {
    name: "Jordan_Lee",
    date: "08/05/2024",
    rating: 5,
    title: "Premium is worth every penny",
    content:
      "Free version is cool but premium unlocks the real magic. Haven't been left on read in weeks, this app just gets it.",
    borderColor: getRandomBorderColor(),
  },
  {
    name: "chris.wanderlust",
    date: "07/14/2024",
    rating: 5,
    title: "Confidence booster fr",
    content:
      "I'm not smooth with words at all but this makes me sound interesting. My friends are asking what changed lol",
    borderColor: getRandomBorderColor(),
  },
  {
    name: "Taylor_Adams",
    date: "09/08/2024",
    rating: 5,
    title: "Finally matched my effort",
    content:
      "Tired of putting in work on dating apps with zero results? This actually helps. Simple, fast, and it works.",
    borderColor: getRandomBorderColor(),
  },
  {
    name: "mike_fitness",
    date: "08/29/2024",
    rating: 5,
    title: "Game recognize game",
    content:
      "This AI is smarter than me when it comes to flirting 😂 Got three dates lined up this week. Coincidence? I think not.",
    borderColor: getRandomBorderColor(),
  },
  {
    name: "Priya_K",
    date: "07/22/2024",
    rating: 5,
    title: "Saves so much time",
    content:
      "As someone juggling two jobs, I don't have hours to spend on apps. This lets me be efficient without sounding like a bot myself.",
    borderColor: getRandomBorderColor(),
  },
  {
    name: "danny.creative",
    date: "09/15/2024",
    rating: 5,
    title: "Actually feels natural",
    content:
      "Other apps gave me cringe pickup lines. This one reads the vibe and suggests stuff I'd actually say. Big difference.",
    borderColor: getRandomBorderColor(),
  },
  {
    name: "Ashley_Chen",
    date: "08/18/2024",
    rating: 5,
    title: "Went from 0 to 100 real quick",
    content:
      "Was about to delete all my dating apps then found this. Now I'm actually excited to check messages. Wild turnaround honestly",
    borderColor: getRandomBorderColor(),
  },
  {
    name: "brandon_tech",
    date: "07/31/2024",
    rating: 5,
    title: "The intro killer app",
    content:
      "First impressions matter and this nails it every time. Haven't used a boring 'hey' since downloading. My match rate shows it.",
    borderColor: getRandomBorderColor(),
  },
  {
    name: "Mia_Torres",
    date: "09/02/2024",
    rating: 5,
    title: "Skeptical turned believer",
    content:
      "Thought AI dating help was gimmicky. Tried it anyway. Now I can't imagine going back to struggling on my own. It's that good.",
    borderColor: getRandomBorderColor(),
  },
];
