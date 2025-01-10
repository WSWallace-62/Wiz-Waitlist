
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

      <div className="container px-4 py-8 md:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            className="text-xl sm:text-2xl font-semibold text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Testing Edit
          </motion.p>

          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Transform Any Recipe Into a 
            <span className="text-primary block sm:inline"> Plant-Based </span>
            Delight
          </motion.h1>

          <motion.p 
            className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-red-600">Join the waitlist</span> for Veganize-iT, the smart recipe converter that makes plant-based cooking easy, 
            delicious, and perfectly tailored to your preferences.
          </motion.p>

          <motion.div 
            className="mt-8 sm:mt-12"
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
