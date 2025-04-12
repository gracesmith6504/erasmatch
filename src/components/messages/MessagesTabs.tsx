
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MapPin, MessageSquare } from "lucide-react";
import { ReactNode } from "react";

interface MessagesTabsProps {
  activeTab: "direct" | "groups" | "cities";
  setActiveTab: (value: "direct" | "groups" | "cities") => void;
  directContent: ReactNode;
  groupsContent: ReactNode;
  citiesContent: ReactNode;
  className?: string;
}

export const MessagesTabs = ({
  activeTab,
  setActiveTab,
  directContent,
  groupsContent,
  citiesContent,
  className = "",
}: MessagesTabsProps) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={(value) => setActiveTab(value as "direct" | "groups" | "cities")}
      className={className}
    >
      <TabsList className="w-full">
        <TabsTrigger value="direct" className="flex-1">
          <MessageSquare className="h-4 w-4 mr-2" /> Direct Messages
        </TabsTrigger>
        <TabsTrigger value="groups" className="flex-1">
          <Users className="h-4 w-4 mr-2" /> University
        </TabsTrigger>
        <TabsTrigger value="cities" className="flex-1">
          <MapPin className="h-4 w-4 mr-2" /> City
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="direct" className="flex-1 overflow-y-auto">
        {directContent}
      </TabsContent>
      
      <TabsContent value="groups" className="flex-1 overflow-y-auto">
        {groupsContent}
      </TabsContent>
      
      <TabsContent value="cities" className="flex-1 overflow-y-auto">
        {citiesContent}
      </TabsContent>
    </Tabs>
  );
};
