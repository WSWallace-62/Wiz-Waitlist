import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const features = [
    {
      title: "Recipe Conversion",
      description: "Transform any recipe into a delicious vegan alternative with smart ingredient substitutions, using:\n\n• An image of your favourite family recipe.\n• Typing in the kind if recipe that you are interested in.\n• Using a built in example recipe.",
      icon: "🥗"
    },
    {
      title: "Dietary Preferences",
      description: "Customize recipes based on allergies, restrictions, and preferences like keto or low-sodium.",
      icon: "🍽️"
    },
    {
      title: "Unit Flexibility",
      description: "Switch between metric and imperial measurements seamlessly for temperature, weight, and volume.",
      icon: "⚖️"
    },
    {
      title: "Smart Appliance Integration",
      description: "Adapt recipes to work with the cooking appliances you have at home.",
      icon: "🔧"
    },
    {
      title: "Nutrition Tracking",
      description: "Monitor nutritional content and adjust recipes to meet your health goals.",
      icon: "📊"
    },
    {
      title: "Personalized Experience",
      description: "Get recommendations based on your cooking style and dietary preferences.",
      icon: "👤"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <Separator className="my-6 md:my-12" />

      <section className="container px-4 py-8 md:py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Transform Your Cooking</h2>
        <p className="text-muted-foreground text-center mb-8 md:mb-12 max-w-2xl mx-auto">
          Veganize-iT makes it easy to convert any recipe into a delicious plant-based version while maintaining the flavors you love.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </section>

      <footer className="bg-muted py-6 md:py-12 mt-10 md:mt-20">
        <div className="container px-4">
          <p className="text-center text-muted-foreground">
            © 2024 Plant-Based-World.com. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}