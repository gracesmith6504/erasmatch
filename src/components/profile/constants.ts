
export const PERSONALITY_TAGS = [
  { value: "weekend-trips", label: "Weekend Trips", icon: "🗺️", group: "Travel" },
  { value: "beach-days", label: "Beach Days", icon: "🏖️", group: "Travel" },
  { value: "train-adventures", label: "Train Adventures", icon: "🚆", group: "Travel" },
  { value: "pub-nights", label: "Pub Nights", icon: "🍻", group: "Social" },
  { value: "clubbing", label: "Clubbing", icon: "🕺", group: "Social" },
  { value: "sport", label: "Sport", icon: "🏅", group: "Activities" },
  { value: "music-lover", label: "Music Lover", icon: "🎧", group: "Arts" },
  { value: "photography", label: "Photography", icon: "📸", group: "Arts" },
  { value: "artsy", label: "Artsy", icon: "🎨", group: "Arts" },
  { value: "mindfulness", label: "Mindfulness", icon: "🧘", group: "Lifestyle" },
  { value: "bookworm", label: "Bookworm", icon: "📚", group: "Lifestyle" },
  { value: "cafe-hunting", label: "Café Hunting", icon: "☕", group: "Lifestyle" },
  { value: "social-butterfly", label: "Social Butterfly", icon: "🧑‍🤝‍🧑", group: "Personality" },
  { value: "go-with-flow", label: "Go with the Flow", icon: "🌿", group: "Personality" },
  { value: "looking-to-meet", label: "Looking to meet new people", icon: "👀", group: "Personality" },
];

export const PERSONALITY_TAG_GROUPS = [
  {
    name: "Travel",
    tags: PERSONALITY_TAGS.filter(tag => tag.group === "Travel")
  },
  {
    name: "Social",
    tags: PERSONALITY_TAGS.filter(tag => tag.group === "Social")
  },
  {
    name: "Activities",
    tags: PERSONALITY_TAGS.filter(tag => tag.group === "Activities")
  },
  {
    name: "Arts",
    tags: PERSONALITY_TAGS.filter(tag => tag.group === "Arts")
  },
  {
    name: "Lifestyle",
    tags: PERSONALITY_TAGS.filter(tag => tag.group === "Lifestyle")
  },
  {
    name: "Personality",
    tags: PERSONALITY_TAGS.filter(tag => tag.group === "Personality")
  },
];

export const getTagInfo = (tagValue: string) => {
  return PERSONALITY_TAGS.find(tag => tag.value === tagValue);
};

export const getTagBgColor = (tagValue: string) => {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-yellow-100 text-yellow-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-orange-100 text-orange-800",
    "bg-teal-100 text-teal-800",
  ];
  
  // Use the tag string to pick a consistent color
  const index = tagValue.length % colors.length;
  return colors[index];
};
