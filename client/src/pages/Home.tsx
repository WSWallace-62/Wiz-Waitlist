import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  // Hidden features for future use
  const hiddenFeatures = [
    {
      title: "Recipe Conversion",
      description: "The Wiz can conjure and inspire amazing plant based recipes:\n\n• An image of your favourite family recipe.\n• Typing in the kind if recipe that you are interested in.\n• Using a built in example recipe.",
      icon: "🥗",
      images: ["/recipe-wizard.png", "/brisket-recipe.png"]
    },
    {
      title: "Dietary Preferences",
      description: "Customize recipes based on allergies, restrictions, and preferences like keto or low-sodium.",
      icon: "🍽️",
      images: ["/features/dietary-preferences.png"]
    },
    {
      title: "Unit Flexibility",
      description: "Switch between metric and imperial measurements seamlessly for temperature, weight, and volume.",
      icon: "⚖️",
      images: ["/features/unit-flexibility.png"]
    },
    {
      title: "Smart Appliance Integration",
      description: "Adapt recipes to work with the cooking appliances you have at home.",
      icon: "🔧",
      images: ["/features/smart-appliance.png"]
    },
    {
      title: "Nutrition Tracking",
      description: "Monitor nutritional content and adjust recipes to meet your health goals.",
      icon: "📊",
      images: ["/features/nutrition-tracking.png"]
    },
    {
      title: "Personalized Experience",
      description: "Get recommendations based on your cooking style and dietary preferences.",
      icon: "👤",
      images: ["/features/personalized-experience.png"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <Separator className="my-6 md:my-12" />

      <section className="container px-4 py-8 md:py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Transform Your Cooking</h2>
        <p className="text-muted-foreground text-center mb-8 md:mb-12 max-w-2xl mx-auto">
          The Wiz makes it easy to convert or create any recipe into a delicious plant-based version while maintaining the flavors you love.
        </p>

        {/* Single window for custom link */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <CardContent className="space-y-4">
              <h3 className="text-2xl font-semibold">Try The Wiz</h3>
              <p className="text-muted-foreground mb-6">
                Experience our customized features and join our community of plant-based cooking enthusiasts.
              </p>
              <a 
                href="https://wswallace-62.github.io/wiz-gallery/scrollable_screenshot_gallery.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Check out some of the features 
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-muted py-6 md:py-12 mt-10 md:mt-20">
        <div className="container px-4">
          <p className="text-center text-muted-foreground">
            2025 Plant-Based-World.com
          </p>
        </div>
      </footer>
    </div>
  );
}