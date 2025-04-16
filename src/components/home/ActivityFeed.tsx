
import { useState, useEffect } from "react";
import { UserCheck, UserPlus, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActivityItem {
  id: number | string;
  text: string;
  time: string;
}

export const ActivityFeed = () => {
  const isMobile = useIsMobile();
  
  // Activity feed data - simulated real-time activities
  const [activities, setActivities] = useState([
    { id: 1, text: "✨ Paula matched with Leo in Barcelona", time: "Just now" },
    { id: 2, text: "🇮🇹 Anna joined the Rome University Chat", time: "2 minutes ago" },
    { id: 3, text: "🏠 Lucas found housing in Amsterdam", time: "5 minutes ago" },
    { id: 4, text: "🇫🇷 Sofia and Thiago met in Paris", time: "10 minutes ago" },
    { id: 5, text: "🎓 Michael joined ERASMUS+ 2025", time: "15 minutes ago" }
  ]);

  // Simulate new activities appearing in real-time
  useEffect(() => {
    // Skip activity simulation on mobile
    if (isMobile) return;
    
    const possibleActivities = [
      { text: "✨ Mia matched with Alex in Berlin", time: "Just now" },
      { text: "🇵🇹 Carlos joined the Lisbon University Chat", time: "Just now" },
      { text: "🏠 Emma found housing in Vienna", time: "Just now" },
      { text: "🇪🇸 Luca and Sophie met in Madrid", time: "Just now" },
      { text: "🎓 Olivia joined ERASMUS+ 2025", time: "Just now" }
    ];

    const interval = setInterval(() => {
      const randomActivity = possibleActivities[Math.floor(Math.random() * possibleActivities.length)];
      setActivities(prev => [{
        id: Date.now(),
        ...randomActivity
      }, ...prev.slice(0, 4)]);
    }, 10000);

    return () => clearInterval(interval);
  }, [isMobile]);

  // Don't render on mobile
  if (isMobile) return null;

  return (
    <div className="relative h-80 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hidden md:block">
      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-blue-50 to-transparent z-10"></div>
      <div className="overflow-auto h-full p-4">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className={`flex items-center gap-4 p-4 mb-3 rounded-lg border border-gray-100 ${index === 0 ? 'animate-pulse-soft bg-blue-50' : 'bg-white'}`}
          >
            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white ${index === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}>
              {activity.text.includes("matched") ? 
                <UserCheck className="h-6 w-6" /> : 
                activity.text.includes("joined") ? 
                <UserPlus className="h-6 w-6" /> : 
                <MessageCircle className="h-6 w-6" />
              }
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">{activity.text}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent z-10"></div>
    </div>
  );
};
