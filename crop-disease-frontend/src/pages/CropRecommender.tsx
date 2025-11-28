import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, Leaf } from "lucide-react";
import { toast } from "sonner";

type RecommendationResponse = {
  recommendation: string;
};

const CropRecommender = () => {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const getRecommendation = async () => {
    // Validate that all fields are filled
    for (const key in formData) {
      if (formData[key as keyof typeof formData] === "") {
        toast.error(`Please fill in the ${key} field.`);
        return;
      }
    }

    setIsAnalyzing(true);
    setResult(null);
    const API_URL = 'http://localhost:5001/api/recommend-crop';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const apiResult: RecommendationResponse = await response.json();
      setResult(apiResult);
      toast.success("Recommendation received!");

    } catch (error) {
      console.error('Error during recommendation:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-to-b from-primary/5 via-background to-secondary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">Crop Recommender</h1>
              <p className="mt-2 text-muted-foreground">
                Enter your soil and weather conditions to get a crop recommendation.
              </p>
            </div>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Enter Environmental Data</CardTitle>
                <CardDescription>
                  Provide the following metrics for an accurate recommendation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="N">Nitrogen (N)</Label>
                    <Input id="N" type="number" placeholder="e.g., 90" value={formData.N} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="P">Phosphorus (P)</Label>
                    <Input id="P" type="number" placeholder="e.g., 42" value={formData.P} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="K">Potassium (K)</Label>
                    <Input id="K" type="number" placeholder="e.g., 43" value={formData.K} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input id="temperature" type="number" placeholder="e.g., 20.8" value={formData.temperature} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="humidity">Humidity (%)</Label>
                    <Input id="humidity" type="number" placeholder="e.g., 82" value={formData.humidity} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ph">Soil pH</Label>
                    <Input id="ph" type="number" placeholder="e.g., 6.5" value={formData.ph} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rainfall">Rainfall (mm)</Label>
                    <Input id="rainfall" type="number" placeholder="e.g., 202" value={formData.rainfall} onChange={handleInputChange} />
                  </div>
                </div>

                <Button
                  onClick={getRecommendation}
                  disabled={isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Recommendation...
                    </>
                  ) : (
                    "Get Recommendation"
                  )}
                </Button>
              </CardContent>
            </Card>

            {result && (
              <Card className="shadow-medium border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CheckCircle className="h-5 w-5" />
                    Recommendation Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-primary/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-primary">Recommended Crop</h3>
                    </div>
                    <p className="text-lg font-medium text-foreground">{result.recommendation}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This recommendation is based on the provided environmental data. For best results, consult with a local agricultural expert.
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setResult(null);
                      setFormData({ N: "", P: "", K: "", temperature: "", humidity: "", ph: "", rainfall: "" });
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Get Another Recommendation
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CropRecommender;
