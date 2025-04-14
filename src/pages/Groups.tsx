
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { GroupCard } from "@/components/groups/GroupCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

type GroupType = "city" | "university";

interface Group {
  id: string;
  name: string;
  type: GroupType;
  memberCount: number;
  image_url?: string | null;
}

const Groups = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const itemsPerPage = 8;

  // Fetch city and university groups with member counts
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      
      // Fetch universities with counts
      const { data: universitiesData, error: uniError } = await supabase
        .from('universities')
        .select('id, name, city, country, image_url');
      
      if (uniError) throw uniError;

      // Get university member counts
      const universityGroups: Group[] = [];
      
      for (const uni of universitiesData || []) {
        const { count: memberCount, error: countError } = await supabase
          .from('profiles')
          .select('id', { count: "exact", head: false })
          .eq('university', uni.name);
          
        if (countError) throw countError;
        
        universityGroups.push({
          id: uni.id.toString(),
          name: uni.name,
          type: 'university',
          memberCount: memberCount || 0,
          image_url: uni.image_url
        });
      }
      
      // Get unique cities from profiles
      const { data: cityData, error: cityError } = await supabase
        .from('profiles')
        .select('city')
        .not('city', 'is', null);
        
      if (cityError) throw cityError;
      
      // Count unique cities and their members
      const cityGroups: Group[] = [];
      const cityMap = new Map();
      
      cityData?.forEach(profile => {
        if (profile.city) {
          const count = cityMap.get(profile.city) || 0;
          cityMap.set(profile.city, count + 1);
        }
      });
      
      cityMap.forEach((count, cityName) => {
        cityGroups.push({
          id: cityName,
          name: cityName,
          type: 'city',
          memberCount: count,
          image_url: null
        });
      });
      
      // Combine and sort groups by member count
      const allGroups = [...universityGroups, ...cityGroups]
        .sort((a, b) => b.memberCount - a.memberCount);
      
      setGroups(allGroups);
      setHasMore(allGroups.length > page * itemsPerPage);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to load groups");
      setIsLoading(false);
    }
  };

  const handleJoinGroup = (group: Group) => {
    if (group.type === 'university') {
      navigate(`/university-hub/${group.id}`);
    } else {
      // For city chat
      navigate(`/messages?tab=cities&city=${encodeURIComponent(group.name)}`);
    }
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
    setHasMore(groups.length > (page + 1) * itemsPerPage);
  };

  // Determine the items to display based on current page
  const displayedGroups = groups.slice(0, page * itemsPerPage);

  return (
    <div className="container py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Groups</h1>
        <p className="text-gray-600">
          Join university and city groups to connect with other students
        </p>
      </header>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {displayedGroups.map((group) => (
              <GroupCard
                key={`${group.type}-${group.id}`}
                group={group}
                onJoinGroup={() => handleJoinGroup(group)}
              />
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button 
                onClick={handleLoadMore} 
                variant="outline"
                className="px-8"
              >
                Load more
              </Button>
            </div>
          )}
          
          {!isLoading && displayedGroups.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                No groups found
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Groups;
