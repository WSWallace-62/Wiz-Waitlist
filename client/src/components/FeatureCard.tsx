import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full transition-transform hover:scale-105">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            <h3 className="text-xl font-semibold">{title}</h3>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
