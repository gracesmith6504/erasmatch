
import React from "react";
import { Users, MapPin, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Group {
  id: string;
  name: string;
  type: "city" | "university";
  memberCount: number;
  image_url?: string | null;
}

interface GroupCardProps {
  group: Group;
  onJoinGroup: () => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onJoinGroup }) => {
  // Generate a consistent gradient based on the group name
  const generateGradient = (name: string) => {
    const charCode = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const gradients = [
      "linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)",
      "linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)",
      "linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)",
      "linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)",
      "linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)",
      "linear-gradient(90deg, hsla(139, 70%, 75%, 1) 0%, hsla(63, 90%, 76%, 1) 100%)",
      "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)",
      "linear-gradient(to top, #d299c2 0%, #fef9d7 100%)",
    ];
    return gradients[charCode % gradients.length];
  };

  // Determine country based on name (simplified approach)
  const getCountryEmoji = (name: string) => {
    const lowercaseName = name.toLowerCase();
    
    if (lowercaseName.includes('lisbon') || lowercaseName.includes('portugal')) return '🇵🇹';
    if (lowercaseName.includes('milan') || lowercaseName.includes('italy')) return '🇮🇹';
    if (lowercaseName.includes('paris') || lowercaseName.includes('france')) return '🇫🇷';
    if (lowercaseName.includes('berlin') || lowercaseName.includes('germany')) return '🇩🇪';
    if (lowercaseName.includes('madrid') || lowercaseName.includes('spain')) return '🇪🇸';
    if (lowercaseName.includes('amsterdam') || lowercaseName.includes('netherlands')) return '🇳🇱';
    
    // Default for universities or unknown cities
    return group.type === 'university' ? '🎓' : '🌆';
  };

  const bgStyle = group.image_url 
    ? { backgroundImage: `url(${group.image_url})` }
    : { background: generateGradient(group.name) };

  return (
    <Card className="overflow-hidden h-96 relative group hover:shadow-lg transition-all duration-300">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={bgStyle}
      >
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity" />
      </div>
      
      <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-2 mb-2 text-white/80">
            {group.type === 'university' ? (
              <School className="h-5 w-5" />
            ) : (
              <MapPin className="h-5 w-5" />
            )}
            <span className="text-sm font-medium capitalize">{group.type}</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 line-clamp-2">
            {group.name} {getCountryEmoji(group.name)}
          </h2>
          
          <div className="flex items-center text-white/90 mb-2">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">{group.memberCount} {group.memberCount === 1 ? 'student' : 'students'}</span>
          </div>
        </div>
        
        <Button
          onClick={onJoinGroup}
          className="w-full bg-white text-gray-900 hover:bg-white/90 font-medium"
        >
          {group.type === 'university' ? 'View University' : 'Join City Chat'}
        </Button>
      </div>
    </Card>
  );
};
