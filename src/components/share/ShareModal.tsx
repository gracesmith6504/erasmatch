import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, Share2, Check } from "lucide-react";

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  city?: string;
  link: string; //new prop
};

export function ShareModal({ isOpen, onClose, city }: ShareModalProps) {
  const { currentUserProfile } = useAuth();
  const [copied, setCopied] = useState(false);

  const APP_URL = "https://erasmatch.com";
  const referralLink = link;

  const shareText = city 
    ? `Hey! I'm on ErasMatch — meet other Erasmus students going to ${city} before you go. Join me: ${referralLink}`
    : `Hey! I'm on ErasMatch — meet other Erasmus students going to the same place before you go. Join me: ${referralLink}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encodedText}`, "_blank");
  };

  const handleTelegramShare = () => {
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://t.me/share/url?url=${APP_URL}&text=${encodedText}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {city ? `Invite friends to ${city}` : "Invite a friend to ErasMatch"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">{shareText}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              className="flex-1" 
              variant="outline" 
              onClick={handleCopy}
            >
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            
            <Button 
              className="flex-1 bg-green-500 hover:bg-green-600" 
              onClick={handleWhatsAppShare}
            >
              <svg 
                viewBox="0 0 32 32" 
                className="h-4 w-4 mr-2 fill-current" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M23.328 19.177c-.401-.201-2.357-1.162-2.724-1.294-.364-.135-.633-.201-.898.199-.27.403-1.037 1.292-1.27 1.56-.233.265-.467.3-.868.1-.401-.2-1.695-.624-3.223-1.984-.19-.236-.301-.446-.214-.67.08-.21.255-.25.397-.345.396-.26.747-.667.747-.667s.498-.72.249-1.256c-.25-.535-1.070-1.288-1.070-1.288-.402-.534-1.035-.136-1.284.13l-.746.76c-.251.267-.48.801-.454 1.601.027.8.455 2.082 2.207 3.85 1.753 1.767 3.504 2.156 4.303 2.183.8.027 1.335-.176 1.601-.428.266-.25.614-.588.748-.829.133-.241.266-.509.067-.91zM16.5 30C8.492 30 2 23.507 2 15.5 2 7.492 8.492 1 16.5 1S31 7.492 31 15.5c0 8.007-6.493 14.5-14.5 14.5zm0-26c-6.35 0-11.5 5.15-11.5 11.5S10.15 27 16.5 27 28 21.85 28 15.5 22.85 4 16.5 4z"/>
              </svg>
              WhatsApp
            </Button>
            
            <Button 
              className="flex-1 bg-blue-500 hover:bg-blue-600" 
              onClick={handleTelegramShare}
            >
              <svg 
                viewBox="0 0 24 24" 
                className="h-4 w-4 mr-2 fill-current" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.06-.2-.08-.06-.19-.04-.27-.02-.12.02-1.93 1.25-5.46 3.69-.52.36-.99.54-1.41.53-.47-.01-1.36-.26-2.02-.48-.82-.27-1.47-.42-1.42-.89.03-.25.26-.5.71-.75 2.78-1.22 4.64-2.03 5.57-2.43 2.65-1.16 3.2-1.36 3.56-1.36.08 0 .26.02.38.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              Telegram
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
