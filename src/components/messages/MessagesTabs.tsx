
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode, useEffect } from "react";

interface MessagesTabsProps {
  activeTab: "direct" | "cities";
  setActiveTab: (value: "direct" | "cities") => void;
  directContent: ReactNode;
  citiesContent: ReactNode;
  className?: string;
}

export const MessagesTabs = ({
  activeTab,
  setActiveTab,
  directContent,
  citiesContent,
  className = "",
}: MessagesTabsProps) => {
  // Force the document title to be ErasMatch for this component too
  useEffect(() => {
    document.title = "ErasMatch";
  }, []);

  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    setActiveTab(value as "direct" | "cities");
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange}
      className={className}
    >
      <TabsList className="w-full">
        <TabsTrigger value="direct" className="flex-1">
          Direct Messages
        </TabsTrigger>
        <TabsTrigger value="cities" className="flex-1">
          City Chats
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="direct" className="flex-1 overflow-y-auto">
        {directContent}
      </TabsContent>
      
      <TabsContent value="cities" className="flex-1 overflow-y-auto">
        {citiesContent}
      </TabsContent>
    </Tabs>
  );
};
