import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart, Sparkles, Users, Shield, ArrowRight, MessageCircle } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Heart,
      title: "Mental Health Support",
      description: "48 themed rooms designed for guidance, comfort, and healing in every aspect of life",
      color: "text-primary"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Guidance",
      description: "Intelligent conversations that adapt to your needs and provide personalized support",
      color: "text-secondary"
    },
    {
      icon: Users,
      title: "Community Connection",
      description: "Connect with others through matchmaking and private chat features",
      color: "text-accent"
    },
    {
      icon: Shield,
      title: "Safe & Private",
      description: "Your conversations are secure with built-in moderation and safety features",
      color: "text-[hsl(var(--vip1-primary))]"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-primary/10 rounded-full border border-primary/20">
            <p className="text-sm font-medium text-primary">Mental Health Support Platform</p>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-[var(--gradient-hero)] bg-clip-text text-transparent leading-tight">
            Mercy Blade
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            All Colors of Life
          </p>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Your companion for mental wellness. Explore 48 themed rooms offering guidance, 
            comfort, and healing across every aspect of life.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all"
              onClick={() => navigate('/rooms')}
            >
              Explore Rooms
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-6 text-lg border-2 hover:bg-primary/5"
              onClick={() => navigate('/auth')}
            >
              Get Started Free
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">48+</p>
              <p className="text-sm text-muted-foreground">Themed Rooms</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-secondary mb-2">24/7</p>
              <p className="text-sm text-muted-foreground">Available Support</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">100%</p>
              <p className="text-sm text-muted-foreground">Private & Safe</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[hsl(var(--vip1-primary))] mb-2">AI</p>
              <p className="text-sm text-muted-foreground">Powered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-[var(--gradient-hero)] bg-clip-text text-transparent">
              Why Choose Mercy Blade?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience comprehensive mental health support designed for every aspect of your life
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group bg-card p-8 rounded-2xl border border-border hover:border-primary/30 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all hover:-translate-y-1"
                >
                  <div className={`${feature.color} mb-4 p-3 bg-current/10 rounded-xl inline-block`}>
                    <Icon className="h-8 w-8 opacity-100" style={{ color: 'currentColor' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tiers Preview Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From free access to premium VIP experiences, find the perfect level of support for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Tier */}
            <div className="bg-gradient-to-br from-[hsl(var(--page-free))] to-card p-8 rounded-2xl border border-border hover:border-primary/30 transition-all hover:-translate-y-1 shadow-[var(--shadow-soft)]">
              <div className="mb-4">
                <p className="text-sm font-medium text-primary mb-2">Free Access</p>
                <h3 className="text-2xl font-bold mb-2">Get Started</h3>
                <p className="text-muted-foreground">Essential mental health support rooms</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-6"
                onClick={() => navigate('/rooms')}
              >
                View Free Rooms
              </Button>
            </div>
            
            {/* VIP Tiers */}
            <div className="bg-gradient-to-br from-[hsl(var(--page-vip1))] to-card p-8 rounded-2xl border-2 border-[hsl(var(--vip1-primary))]/30 hover:border-[hsl(var(--vip1-primary))]/50 transition-all hover:-translate-y-1 shadow-[var(--shadow-rainbow)]">
              <div className="mb-4">
                <p className="text-sm font-medium text-[hsl(var(--vip1-primary))] mb-2">Premium</p>
                <h3 className="text-2xl font-bold mb-2">VIP Access</h3>
                <p className="text-muted-foreground">Specialized rooms for deeper exploration</p>
              </div>
              <Button 
                className="w-full mt-6 bg-[hsl(var(--vip1-primary))] hover:bg-[hsl(var(--vip1-primary))]/90"
                onClick={() => navigate('/tiers')}
              >
                Explore VIP Tiers
              </Button>
            </div>
            
            {/* Custom Topics */}
            <div className="bg-gradient-to-br from-[hsl(var(--page-vip3))] to-card p-8 rounded-2xl border border-border hover:border-secondary/30 transition-all hover:-translate-y-1 shadow-[var(--shadow-soft)]">
              <div className="mb-4">
                <p className="text-sm font-medium text-secondary mb-2">Custom</p>
                <h3 className="text-2xl font-bold mb-2">Request Topics</h3>
                <p className="text-muted-foreground">Request personalized content creation</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-6"
                onClick={() => navigate('/vip-topic-request')}
              >
                Request Custom Topic
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8">
            <MessageCircle className="h-16 w-16 text-primary mx-auto mb-6" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands finding support, guidance, and healing through Mercy Blade
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)]"
              onClick={() => navigate('/auth')}
            >
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="px-10 py-6 text-lg border-2"
              onClick={() => navigate('/tiers')}
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold bg-[var(--gradient-hero)] bg-clip-text text-transparent mb-2">
                Mercy Blade
              </h3>
              <p className="text-sm text-muted-foreground">
                All Colors of Life - Mental Health Support Platform
              </p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <button onClick={() => navigate('/rooms')} className="hover:text-primary transition-colors">
                Rooms
              </button>
              <button onClick={() => navigate('/tiers')} className="hover:text-primary transition-colors">
                Pricing
              </button>
              <button onClick={() => navigate('/auth')} className="hover:text-primary transition-colors">
                Sign In
              </button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 Mercy Blade. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;