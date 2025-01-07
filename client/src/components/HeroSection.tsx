import { motion } from "framer-motion";
import WaitlistForm from "./WaitlistForm";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div 
        className="absolute inset-0 -z-10 bg-gradient-to-br from-green-50 to-green-100"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,128,0,0.1) 2px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="container px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Transform Any Recipe Into a 
            <span className="text-primary"> Plant-Based </span>
            Delight
          </motion.h1>

          <motion.p 
            className="mt-6 text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join the waitlist for Veganize-iT, the smart recipe converter that makes plant-based cooking easy, 
            delicious, and perfectly tailored to your preferences.
          </motion.p>

          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <WaitlistForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}