
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type CityCount = {
  city: string;
  post_count: number;
};

export default function ForumCities() {
  const [cities, setCities] = useState<CityCount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCities();
  }, []);
  
  const fetchCities = async () => {
    try {
      setLoading(true);
      
      // Get unique cities and count posts per city - using any to bypass type checking
      const { data, error } = await (supabase as any)
        .from('city_forums')
        .select('city, id')
        .order('city');
        
      if (error) {
        throw error;
      }
      
      // Process data to count posts per city
      const cityMap = new Map<string, number>();
      data.forEach((item: any) => {
        const count = cityMap.get(item.city) || 0;
        cityMap.set(item.city, count + 1);
      });
      
      // Convert map to array
      const citiesWithCounts: CityCount[] = Array.from(cityMap.entries()).map(([city, count]) => ({
        city,
        post_count: count
      }));
      
      setCities(citiesWithCounts);
    } catch (err) {
      console.error('Error fetching cities:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredCities = cities.filter(city =>
    city.city.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">City Forums</h1>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search cities..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-md" />
          ))}
        </div>
      ) : filteredCities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCities.map(city => (
            <Link to={`/forum/${city.city}`} key={city.city} className="block no-underline text-inherit">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{city.city}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {city.post_count} {city.post_count === 1 ? 'post' : 'posts'}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center text-sm text-erasmatch-blue">
                    <MessageSquare className="h-4 w-4 mr-1" /> 
                    <span>View discussions</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">No cities found</h3>
          <p className="text-muted-foreground mt-2">
            {searchQuery ? 'No cities match your search criteria' : 'No city forums have been created yet'}
          </p>
        </div>
      )}
    </div>
  );
}
