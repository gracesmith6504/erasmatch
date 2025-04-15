
import React, { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { ShareModal } from "./ShareModal";

interface ShareButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: "default" | "ghost";
  showText?: boolean;
  city?: string;
}

export function ShareButton({ 
  variant = "default", 
  showText = false,
  city,
  className,
  ...props 
}: ShareButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const getButtonStyle = () => {
    switch (variant) {
      case "default":
        return "rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700";
      case "ghost":
        return "bg-transparent hover:bg-gray-100";
      default:
        return "";
    }
  };
  
  return (
    <>
      <Button 
        size="sm"
        variant="ghost"
        className={`${getButtonStyle()} ${className}`}
        onClick={() => setIsModalOpen(true)}
        {...props}
      >
        <Share2 className="h-4 w-4 mr-1" />
        {showText && "Invite a friend"}
      </Button>
      
      <ShareModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        city={city}
      />
    </>
  );
}
