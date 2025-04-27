
import { useEffect, useRef, useState } from "react";
import { Canvas, Image as FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

interface ImageCropperProps {
  imageUrl: string;
  onSave: (croppedImage: string) => void;
  onCancel: () => void;
}

const ImageCropper = ({ imageUrl, onSave, onCancel }: ImageCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: Math.min(window.innerWidth - 40, 600),
      height: Math.min(window.innerWidth - 40, 600),
      backgroundColor: "#f1f5f9"
    });

    // Load the image using the correct Fabric.js v6 approach
    FabricImage.fromURL(imageUrl).then(img => {
      const scale = Math.min(
        fabricCanvas.width! / img.width!,
        fabricCanvas.height! / img.height!
      );

      img.scale(scale);
      img.center();
      img.setControlsVisibility({
        mt: true, 
        mb: true, 
        ml: true, 
        mr: true,
        mtr: true
      });

      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.renderAll();
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, [imageUrl]);

  const handleSave = () => {
    if (!canvas) return;
    
    try {
      // Fix: Add the required 'multiplier' property to toDataURL options
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 0.8,
        multiplier: 1 // Add the required multiplier property
      });
      onSave(dataUrl);
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error("Failed to save image. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <canvas ref={canvasRef} className="border border-gray-200 rounded-lg shadow-sm" />
      
      <div className="flex gap-2 w-full justify-center mt-2">
        <Button onClick={onCancel} variant="outline">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Check className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default ImageCropper;
