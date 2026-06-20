"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (userMsg) => {
    if (!userMsg?.content || isLoading) return;

    const userMessage = { 
      id: Date.now().toString(), 
      role: "user", 
      content: userMsg.content 
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get response");

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Sorry, I encountered an error: ${error.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[350px] h-[500px] z-50 shadow-2xl flex flex-col"
          >
            <Card className="h-full flex flex-col border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <CardHeader className="p-4 border-b bg-muted/50 flex flex-row items-center justify-between rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-md">DevDeploy AI</CardTitle>
                    <p className="text-xs text-muted-foreground">Ask me anything!</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1 p-0 overflow-hidden relative">
                <div 
                  ref={scrollRef}
                  className="h-full w-full overflow-y-auto p-4 space-y-4"
                >
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm mt-10 space-y-2">
                      <p>👋 Hi there!</p>
                      <p>I'm your AI assistant for DevDeploy.</p>
                      <p>How can I help you today?</p>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 text-sm ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role !== "user" && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-[80%] whitespace-pre-wrap ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                        }`}
                      >
                        {message.content}
                      </div>

                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                    <div className="flex gap-3 text-sm justify-start">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      </div>
                      <div className="px-4 py-2 rounded-2xl bg-muted rounded-tl-sm flex items-center">
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-3 border-t bg-background rounded-b-xl">
                <div className="flex w-full gap-2">
                  <input
                    placeholder="Ask about deployments..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (input && input.trim() !== "" && !isLoading) {
                          sendMessage({ role: "user", content: input });
                          setInput("");
                        }
                      }
                    }}
                    className="flex-1 rounded-lg bg-muted border border-input px-3 py-1 outline-none focus-visible:ring-1 text-sm"
                  />
                  <Button 
                    onClick={() => {
                      if (input && input.trim() !== "" && !isLoading) {
                        sendMessage({ role: "user", content: input });
                        setInput("");
                      }
                    }} 
                    size="icon" 
                    disabled={isLoading || !input}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center z-50 hover:shadow-primary/25 transition-shadow"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
}
