import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Target, Lightbulb, Users } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Target,
      title: "Accurate Detection",
      description: "Using advanced CNN models trained on thousands of crop images for 90%+ accuracy in disease identification.",
    },
    {
      icon: Lightbulb,
      title: "Expert Advisory",
      description: "Get instant, actionable advice on remedies, pesticides, and preventive measures for detected diseases.",
    },
    {
      icon: Users,
      title: "Farmer-Friendly",
      description: "Simple interface designed for farmers with no technical expertise required. Just upload and get results.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-to-b from-secondary/10 via-background to-primary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">About CropCare AI</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Empowering farmers with artificial intelligence
              </p>
            </div>

            {/* About Us section - editable content */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>About Us</CardTitle>
                <CardDescription>Who we are and how we help farmers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  CropCare AI (also published as KRISHI MITHRA) is a team of agricultural
                  scientists, machine learning engineers, and software developers focused on
                  delivering easy-to-use AI tools for smallholder and commercial farmers. Our goal
                  is to reduce crop losses by making fast, reliable disease detection and
                  practical advisory accessible from any smartphone or computer.
                </p>
                <p>
                  We combine state-of-the-art computer vision models, curated agronomy knowledge,
                  and a simple UI so users can upload a leaf image and receive an instant
                  diagnosis and recommended treatment steps. We respect farmer privacy — images
                  are processed securely and any data sharing is opt-in.
                </p>
                <div>
                  <h4 className="font-medium text-foreground">Contact</h4>
                  <p className="text-sm text-muted-foreground">Email:keerthin180205@gmail.com</p>
                  <p className="text-sm text-muted-foreground">If you'd like to contribute or report issues, reach out and we'll respond within 48 hours.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Agriculture is the cornerstone of the Indian economy, but it faces significant
                  threats from various crop diseases. Traditional methods for disease identification
                  rely on manual inspection, which is often time-consuming, subjective, and not
                  scalable.
                </p>
                <p>
                  CropCare AI leverages Machine Learning and deep learning-based computer vision
                  techniques to automate the detection of diseases in crop leaves. By simply
                  analyzing an image of a plant leaf, our system identifies the presence of disease
                  and provides immediate, actionable advice.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="shadow-soft">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
                <CardDescription>Built with cutting-edge technologies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">Machine Learning</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Convolutional Neural Networks (CNN)</li>
                      <li>• Transfer Learning (MobileNetV2, VGG16)</li>
                      <li>• PlantVillage Dataset</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">Development</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Python, TensorFlow, Keras</li>
                      <li>• OpenCV for image processing</li>
                      <li>• React for web interface</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Our Team</CardTitle>
                  <CardDescription>Meet the people behind Krishi Mithra CropCare AI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">K</div>
                      <div className="font-medium">Keerthi</div>
                      <div className="text-sm text-muted-foreground">AI-ML Trainer</div>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">T</div>
                      <div className="font-medium">Tejas Gupta</div>
                      <div className="text-sm text-muted-foreground">Backend developer</div>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">S</div>
                      <div className="font-medium">Sathish</div>
                      <div className="text-sm text-muted-foreground">Frontend developer</div>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">SS</div>
                      <div className="font-medium">Syed Samiulla</div>
                      <div className="text-sm text-muted-foreground">API Generator</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            <Card className="shadow-medium border-primary/20">
              <CardHeader>
                <CardTitle>Future Scope</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <Leaf className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Deployment as a mobile app for on-field usage</span>
                  </li>
                  <li className="flex gap-2">
                    <Leaf className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Expansion to include more crops and region-specific diseases</span>
                  </li>
                  <li className="flex gap-2">
                    <Leaf className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Integration with weather and soil data for holistic advisory</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
