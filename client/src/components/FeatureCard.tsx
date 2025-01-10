import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, X } from "lucide-react";
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  const descriptionLines = description.split('\n').filter(line => line.trim());

  const handleZoom = (delta: number) => {
    const newScale = Math.min(Math.max(0.5, scale + delta), 2);
    setScale(newScale);
    if (newScale <= 1) {
      setPosition({ x: 0, y: 0 }); // Reset position when zooming out to normal
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scale <= 1) return; // Only allow dragging when zoomed in
    e.preventDefault(); // Prevent image dragging behavior
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

  const handleMouseLeave = () => {
    dragRef.current.isDragging = false;
  };

  const handleOpenChange = (open: boolean) => {
    setShowImage(open);
    if (!open) {
      // Reset zoom and position when closing the modal
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setCurrentImageIndex(0);
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    setScale(1);
    setPosition({ x: 0, y: 0 });
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

      <Dialog open={showImage} onOpenChange={handleOpenChange}>
        <DialogContent 
          className="max-w-2xl [&>button]:hidden" // Hide the default close button
        >
          {/* Logo in top left */}
          <div className="absolute left-4 top-4">
            <img 
              src="/avo-friend.png" 
              alt="Veganize-iT Logo" 
              className="h-8 w-8"
            />
          </div>

          {/* Custom close button */}
          <Button 
            className="absolute right-4 top-4 h-8 w-8 rounded-full p-0 hover:bg-accent"
            variant="ghost"
            onClick={() => handleOpenChange(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Thumbnails strip */}
          <div className="flex justify-center gap-2 mb-2 p-1 bg-muted rounded-lg max-w-[240px] mx-auto">
            {images?.map((image, index) => (
              <div
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`
                  w-12 h-12 rounded-md overflow-hidden cursor-pointer transition-all
                  ${currentImageIndex === index ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'}
                `}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            {/* Zoom controls */}
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleZoom(0.1)}
                disabled={scale >= 2}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
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
                onClick={resetZoom}
                disabled={scale === 1 && position.x === 0 && position.y === 0}
              >
                <span className="text-xs">1:1</span>
              </Button>
            </div>

            {/* Full-size image */}
            <div 
              className="flex-1 relative overflow-hidden"
              style={{
                cursor: scale > 1 ? (dragRef.current.isDragging ? 'grabbing' : 'grab') : 'default',
                aspectRatio: '3/4',
                maxHeight: 'calc(80vh - 140px)' // Limit height on desktop while maintaining aspect ratio
              }}
            >
              <div
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transition: scale === 1 ? 'transform 0.2s ease-out' : 'none',
                }}
                className="w-full h-full"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {images && (
                  <img
                    src={images[currentImageIndex]}
                    alt={`${title} feature preview ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}