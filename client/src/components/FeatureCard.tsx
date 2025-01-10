import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  images?: string[];
}

export default function FeatureCard({ title, description, icon, images }: FeatureCardProps) {
  const [showImage, setShowImage] = useState(false);
  const [scale, setScale] = useState(1);
  const descriptionLines = description.split('\n').filter(line => line.trim());

  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(0.5, prev + delta), 2));
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
              >
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transition: 'transform 0.2s ease-out',
                  }}
                  className="w-full h-full"
                >
                  <img
                    src={image}
                    alt={`${title} feature preview ${index + 1}`}
                    className="w-full h-full object-contain"
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