import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
// --- THIS IS THE FIX ---
// This path now points to the RENAMED file (without the "TS ")
import { supabase } from "../lib/supabaseClient"; 
import { Session } from "@supabase/supabase-js";

// This is the data structure our UI expects.
// We've updated it to match what your Python server will send.
type AIResponse = {
  disease: string;
  confidence: number;
  
  // These are extra fields your UI might use
  severity?: string;
  description?: string;
  remedies?: string[];
  prevention?: string[];
};

const Detection = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Please login to use disease detection");
        navigate("/auth");
      }
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // Save the raw file
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!imageFile) {
      toast.error("No file selected");
      return;
    }
    setIsAnalyzing(true);
    
    // This is the URL for your LOCAL "brain"
    const AI_MODEL_API_URL = 'http://localhost:5001/api/detect';

    try {
      
      // --- THIS IS THE FIX ---
      // We must "wrap" the image file in FormData
      // so our Python server can find it in 'request.files['image']'
      const formData = new FormData();
      formData.append('image', imageFile);
      // --- END OF FIX ---

      // 3. Call the AI "Brain" (the API)
      const response = await fetch(AI_MODEL_API_URL, {
        method: 'POST',
        // Send the FORMDATA as the body, not the raw file
        body: formData, 
        // DO NOT add a 'Content-Type' header here. 
        // The browser will add it automatically with a special "boundary"
      });

      // The 'response.statusText' will be "BAD REQUEST" if this fails
      if (!response.ok) {
        throw new Error(`AI model error: ${response.statusText}`);
      }

      // 4. Get the real JSON result from your Python model
      const aiResult: AIResponse = await response.json();

      // 5. Save the REAL result to our page to display it
      // We add some placeholder data for the fields your model doesn't provide
      setResult({
        ...aiResult,
        severity: aiResult.severity || "High",
        description: aiResult.description || `AI analysis completed for ${aiResult.disease}.`,
        remedies: aiResult.remedies || ["Please consult a local agricultural expert for remedies."],
        prevention: aiResult.prevention || ["Practice good crop hygiene and monitoring."],
      });
      toast.success("Analysis complete!");

      // 6. (Optional) Save the result to your Supabase "detections" table
      if (session?.user) {
        await supabase.from('detections').insert([
          { 
            user_id: session.user.id, 
            disease_name: aiResult.disease,
            confidence: aiResult.confidence,
            severity: "High", // You can't get this from your current model
          }
        ]);
      }

    } catch (error) {
      console.error('Error during detection:', error);
      if (error instanceof Error) {
        toast.error(`${error.message}`); // This will now show "Analysis failed: AI model error: BAD REQUEST"
      } else {
        toast.error("An unknown error occurred during analysis.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };


  if (!session) return null;

  // The rest of your JSX code (the HTML part) is perfect
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-to-b from-primary/5 via-background to-secondary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">Crop Disease Detection</h1>
              <p className="mt-2 text-muted-foreground">
                Upload an image of your crop leaf to detect diseases
              </p>
            </div>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Upload Crop Image</CardTitle>
                <CardDescription>
                  Take a clear photo of the affected leaf for accurate detection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-12 transition-colors hover:border-primary/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer text-center">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Uploaded crop"
                        className="mx-auto mb-4 max-h-64 rounded-lg object-contain"
                      />
                    ) : (
                      <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    )}
                    <p className="text-sm font-medium text-foreground">
                      {selectedImage ? "Change Image" : "Click to upload"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG or JPEG (max 5MB)
                    </p>
                  </label>
                </div>

                {selectedImage && !result && (
                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Image"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {result && (
              <Card className="shadow-medium border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <CheckCircle className="h-5 w-5" />
                        Detection Result
                      </CardTitle>
                      <CardDescription>
                        Analysis completed with {result.confidence}% confidence
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-destructive/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <h3 className="font-semibold text-destructive">Detected Disease</h3>
                    </div>
                    <p className="text-lg font-medium text-foreground">{result.disease}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{result.description}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Severity: <span className="font-medium text-destructive">{result.severity}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Confidence: <span className="font-medium text-foreground">{result.confidence}%</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold text-foreground">Recommended Remedies</h3>
                    <ul className="space-y-2">
                      {result.remedies.map((remedy: string, index: number) => (
                        <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                          <span>{remedy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold text-foreground">Prevention Tips</h3>
                    <ul className="space-y-2">
                      {result.prevention.map((tip: string, index: number) => (
                        <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedImage(null);
                      setResult(null);
                      setImageFile(null); // Clear the file state too
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Analyze Another Image
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

export default Detection;