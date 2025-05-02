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

  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: 1, text: "👋 A student from Trinity just joined the Paris group", time: "Just now" },
    { id: 2, text: "🎓 A new student signed up from Rome", time: "4 minutes ago" },
    { id: 3, text: "💬 A message was sent in the Madrid university chat", time: "6 minutes ago" },
    { id: 4, text: "🌍 Students from 3 new cities joined today", time: "10 minutes ago" }
  ]);

  useEffect(() => {
    if (isMobile) return;

    const possibleActivities: ActivityItem[] = [
      { text: "👋 A new student joined the Berlin group", time: "Just now", id: 0 },
      { text: "🎓 A student registered from Lisbon", time: "Just now", id: 0 },
      { text: "💬 A new message was posted in the Vienna chat", time: "Just now", id: 0 },
      { text: "🌐 5 students signed up from different countries", time: "Just now", id: 0 },
      { text: "📢 A university chat got its 20th member", time: "Just now", id: 0 }
    ];

    const interval = setInterval(() => {
      const randomActivity = possibleActivities[Math.floor(Math.random() * possibleActivities.length)];
      setActivities(prev => [{
        ...randomActivity,
        id: Date.now()
      }, ...prev.slice(0, 4)]);
    }, 10000);

    return () => clearInterval(interval);
  }, [isMobile]);

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
              {activity.text.includes("message") ? 
                <MessageCircle className="h-6 w-6" /> :
                activity.text.includes("joined") || activity.text.includes("signed up") ? 
                <UserPlus className="h-6 w-6" /> : 
                <UserCheck className="h-6 w-6" />
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
