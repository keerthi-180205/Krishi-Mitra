import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabaseClient"; 
import { Session } from "@supabase/supabase-js";

type AssistantResponse = {
  answer: string;
};

const Assistant = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Please login to use the AI Assistant");
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

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const askAssistant = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }
    setIsAsking(true);
    setAnswer(null);
    
    const ASSISTANT_API_URL = 'http://localhost:5001/api/ask-assistant';

    try {
      const response = await fetch(ASSISTANT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result: AssistantResponse = await response.json();
      setAnswer(result.answer);
      toast.success("Received answer from assistant!");

    } catch (error) {
      console.error('Error asking assistant:', error);
      if (error instanceof Error) {
        toast.error(`${error.message}`);
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setIsAsking(false);
    }
  };

  if (!session) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-to-b from-primary/5 via-background to-secondary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">AI Agricultural Assistant</h1>
              <p className="mt-2 text-muted-foreground">
                Ask any question related to farming, crops, and soil.
              </p>
            </div>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Ask a Question</CardTitle>
                <CardDescription>
                  Our AI assistant will provide you with expert advice.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="e.g., What are the best crops to grow in sandy soil?"
                  value={question}
                  onChange={handleQuestionChange}
                  rows={4}
                  className="resize-none"
                />
                <Button
                  onClick={askAssistant}
                  disabled={isAsking}
                  className="w-full"
                  size="lg"
                >
                  {isAsking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    "Ask Assistant"
                  )}
                </Button>
              </CardContent>
            </Card>

            {answer && (
              <Card className="shadow-medium border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Sparkles className="h-5 w-5" />
                    Assistant's Answer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                    {answer}
                  </div>
                  <Button
                    onClick={() => {
                      setQuestion("");
                      setAnswer(null);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Ask Another Question
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

export default Assistant;
