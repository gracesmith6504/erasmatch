
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ImageCropper from "./ImageCropper";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  showEditButton?: boolean;
  onEditClick?: () => void;
  onCropComplete?: (croppedImage: string) => void;
}

const ImageModal = ({
  isOpen,
  onClose,
  imageUrl,
  showEditButton = false,
  onEditClick,
  onCropComplete,
}: ImageModalProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!imageUrl) return null;

  const handleEditImage = () => {
    if (onEditClick) {
      onEditClick();
      onClose();
    } else {
      setIsEditing(true);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    if (onCropComplete) {
      onCropComplete(croppedImage);
    }
    setIsEditing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden border-none bg-transparent">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-2 top-2 z-50 rounded-full bg-black/20 hover:bg-black/40 text-white"
        >
          <X className="h-4 w-4" />
        </Button>

        {isEditing ? (
          <div className="bg-white rounded-lg p-4">
            <ImageCropper
              imageUrl={imageUrl}
              onSave={handleCropComplete}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Profile"
              className="max-w-full max-h-[90vh] object-contain rounded-lg animate-in zoom-in-50 duration-200"
            />
            {showEditButton && (
              <Button
                onClick={handleEditImage}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 hover:bg-white text-black"
              >
                Edit Photo
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
