import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  images?: string[];
}

export default function FeatureCard({ title, description, icon, images }: FeatureCardProps) {
  const [showImage, setShowImage] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  const descriptionLines = description.split('\n').filter(line => line.trim());

  const handleZoom = (delta: number) => {
    const newScale = Math.min(Math.max(0.5, scale + delta), 2);
    setScale(newScale);
    if (newScale <= 1) {
      setPosition({ x: 0, y: 0 }); // Reset position when zooming out to normal
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scale <= 1) return; // Only allow dragging when zoomed in
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDragging) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    // Calculate boundaries based on zoom level
    const maxOffset = (scale - 1) * 150; // Adjust this value based on your needs

    const newX = Math.min(Math.max(dragRef.current.startPosX + dx, -maxOffset), maxOffset);
    const newY = Math.min(Math.max(dragRef.current.startPosY + dy, -maxOffset), maxOffset);

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
  };

  // Clean up drag state when mouse leaves the window
  const handleMouseLeave = () => {
    dragRef.current.isDragging = false;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          className="h-full transition-transform hover:scale-105 cursor-pointer" 
          onClick={() => images?.length && setShowImage(true)}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{icon}</span>
              <h3 className="text-xl font-semibold">{title}</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              {descriptionLines.map((line, index) => (
                <p key={index} className={index > 0 ? 'mt-2' : ''}>
                  {line}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={showImage} onOpenChange={setShowImage}>
        <DialogContent className="max-w-4xl">
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom(-0.1)}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom(0.1)}
              disabled={scale >= 2}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images?.map((image, index) => (
              <div 
                key={index} 
                className="aspect-video relative overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  style={{
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                    transition: scale === 1 ? 'transform 0.2s ease-out' : 'none',
                    cursor: scale > 1 ? 'grab' : 'default',
                  }}
                  className="w-full h-full"
                >
                  <img
                    src={image}
                    alt={`${title} feature preview ${index + 1}`}
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}