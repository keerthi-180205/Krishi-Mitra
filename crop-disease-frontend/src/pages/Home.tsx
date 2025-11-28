import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Upload, Brain, CheckCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

const Home = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const steps = [
    {
      icon: Upload,
      title: "Upload Image",
      description: "Take a photo of the affected crop leaf and upload it to our platform",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our advanced ML model analyzes the image to detect diseases",
    },
    {
      icon: CheckCircle,
      title: "Get Results",
      description: "Receive instant diagnosis with remedies and prevention tips",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-glow to-secondary py-20 text-primary-foreground">
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary-foreground/10 p-4 backdrop-blur-sm">
                <Leaf className="h-12 w-12" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              Protect Your Crops with AI-Powered Disease Detection
            </h1>
            <p className="mb-8 text-lg opacity-90 md:text-xl">
              Get instant, accurate diagnosis of crop diseases and expert advice to save your harvest.
              No technical expertise required.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate(session ? "/detection" : "/auth")}
                className="gap-2 text-lg"
              >
                Start Detection
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/about")}
                className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple 3-step process to detect and treat crop diseases
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={index} className="relative shadow-soft">
                <CardHeader>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardContent>
                {index < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block">
                    <ArrowRight className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="text-2xl">Why Choose CropCare AI?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">High Accuracy</h3>
                      <p className="text-sm text-muted-foreground">
                        90%+ accuracy powered by advanced deep learning models
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">Instant Results</h3>
                      <p className="text-sm text-muted-foreground">
                        Get diagnosis and remedies in seconds, not days
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">Expert Advice</h3>
                      <p className="text-sm text-muted-foreground">
                        Actionable recommendations backed by agricultural research
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">Easy to Use</h3>
                      <p className="text-sm text-muted-foreground">
                        No technical knowledge needed - just upload and go
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Ready to Start?</CardTitle>
                  <CardDescription className="text-base">
                    Join thousands of farmers protecting their crops with AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    Create a free account to start detecting crop diseases and get expert advice
                    tailored to your needs. Early detection can save your entire harvest!
                  </p>
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      onClick={() => navigate("/auth")}
                      className="w-full gap-2"
                    >
                      {session ? "Go to Detection" : "Get Started Free"}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      No credit card required • Free forever
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
