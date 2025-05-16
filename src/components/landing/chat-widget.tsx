
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Added Accordion imports
import { MessageSquare, Send, User, Mail, Phone, CheckCircle, Bot, Sparkles, FileText, ChevronDown } from 'lucide-react';
import { sendChatInquiry, type ChatInquiryInput } from '@/app/actions/send-chat-inquiry';
import { aiChatAction, type AiClientChatInput } from '@/app/actions/ai-chat-action';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  // AI Chat state
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Inquiry Form state
  const [inquiryQuestion, setInquiryQuestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isInquirySubmitted, setIsInquirySubmitted] = useState(false);
  const [isInquiryLoading, setIsInquiryLoading] = useState(false);
  
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [conversation]);

  const handleAiMessageSend = async () => {
    if (!currentMessage.trim()) return;

    const userMessageText = currentMessage.trim();
    const newUserMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: userMessageText };
    
    const currentConversation = [...conversation, newUserMessage];
    setConversation(currentConversation);
    setCurrentMessage('');
    setIsAiLoading(true);

    const historyForApi = conversation.map(msg => ({ // Use `conversation` state before adding newUserMessage
        sender: msg.sender,
        text: msg.text,
    }));
    
    const result = await aiChatAction({ message: userMessageText, history: historyForApi });

    if (result.success && result.response) {
      const aiResponse: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: result.response };
      setConversation(prev => [...prev, aiResponse]);
    } else {
      toast({
        title: "AI Response Error",
        description: result.errorMessage || "Could not get a response from AI.",
        variant: "destructive",
      });
       const aiErrorResponse: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: result.errorMessage || "Sorry, I'm having trouble connecting right now. Please try again in a moment." };
      setConversation(prev => [...prev, aiErrorResponse]);
    }
    setIsAiLoading(false);
  };

  const handleInquirySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsInquiryLoading(true);

    const inquiryData: ChatInquiryInput = { name, email, phone, question: inquiryQuestion };
    const result = await sendChatInquiry(inquiryData);

    if (result.success) {
      setIsInquirySubmitted(true);
      toast({
        title: "Inquiry Sent!",
        description: "Trish or her team will get back to you soon.",
        variant: "default",
      });
      // Clear form fields only, keep inquiryQuestion for context if they re-open form
      // setInquiryQuestion(''); 
      setName('');
      setEmail('');
      setPhone('');
    } else {
      toast({
        title: "Submission Failed",
        description: result.message || "Could not submit your inquiry. Please try again.",
        variant: "destructive",
      });
    }
    setIsInquiryLoading(false);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // When closing, reset inquiry submitted state so form shows next time
      setIsInquirySubmitted(false); 
    } else {
      if (conversation.length === 0 && !isAiLoading) {
         setIsAiLoading(true);
         // Use a small timeout to ensure sheet is visually open before AI "typing"
         setTimeout(async () => {
            const initialGreetingResult = await aiChatAction({message: "Hello", history: []});
            if (initialGreetingResult.success && initialGreetingResult.response) {
                 setConversation([{id: 'initial-ai-greeting', sender: 'ai', text: initialGreetingResult.response}]);
            } else {
                 setConversation([{id: 'initial-ai-greeting-fallback', sender: 'ai', text: "Hi, I'm Trish, your AI assistant! How can I help you with your financial questions today?"}]);
            }
            setIsAiLoading(false);
        }, 100);
      }
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => handleSheetOpenChange(true)}
          className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-xl hover:shadow-2xl transition-shadow bg-primary hover:bg-primary/90 z-[60]"
          size="icon"
          aria-label="Open chat with Trish"
        >
          <Sparkles className="h-8 w-8 text-primary-foreground" />
        </Button>
      )}

      <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-2xl text-primary flex items-center">
              <Bot className="h-7 w-7 mr-2" />
              Chat with AI Trish
            </SheetTitle>
            <SheetDescription className="text-sm">
              Ask your questions below. For direct consultations, expand the form.
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
            {conversation.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full mb-3",
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div className={cn(
                    "max-w-[80%] p-3 rounded-lg shadow",
                    msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-none' 
                        : 'bg-muted text-foreground rounded-bl-none'
                )}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isAiLoading && conversation.length === 0 && ( // Show loading for initial greeting
                 <div className="flex justify-start mb-3">
                    <div className="bg-muted text-foreground p-3 rounded-lg shadow rounded-bl-none">
                        <p className="text-sm flex items-center">
                            <Sparkles className="h-4 w-4 mr-2 animate-pulse" /> AI Trish is typing...
                        </p>
                    </div>
                </div>
            )}
             {isAiLoading && conversation.length > 0 && ( // Show thinking for subsequent messages
                 <div className="flex justify-start mb-3">
                    <div className="bg-muted text-foreground p-3 rounded-lg shadow rounded-bl-none">
                        <p className="text-sm flex items-center">
                            <Sparkles className="h-4 w-4 mr-2 animate-pulse" /> Thinking...
                        </p>
                    </div>
                </div>
            )}
          </ScrollArea>
          
          <div className="px-4 pb-2 pt-2 border-t bg-background">
            <div className="flex items-center space-x-2">
              <Input
                id="ai-chat-message"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask Trish anything..."
                onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAiMessageSend(); }}}
                disabled={isAiLoading}
                className="flex-grow"
              />
              <Button onClick={handleAiMessageSend} disabled={isAiLoading || !currentMessage.trim()} size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full border-t">
            <AccordionItem value="consultation-form" className="border-b-0">
              <AccordionTrigger className="px-6 py-3 text-sm hover:no-underline text-muted-foreground hover:text-primary [&[data-state=open]>svg]:text-primary">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Or, Request a Consultation
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                {isInquirySubmitted ? (
                  <div className="flex flex-col items-center justify-center pt-4 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                    <h3 className="text-lg font-semibold mb-1 text-foreground">Inquiry Sent!</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Thank you! Trish or her team will get back to you soon.
                    </p>
                    <Button onClick={() => setIsInquirySubmitted(false)} variant="outline" size="sm">
                      Start New Inquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3 pt-2">
                    <div>
                      <Label htmlFor="chat-question-inquiry" className="flex items-center mb-1.5 text-xs font-medium">
                        Your Question/Interest
                      </Label>
                      <Textarea
                        id="chat-question-inquiry"
                        value={inquiryQuestion}
                        onChange={(e) => setInquiryQuestion(e.target.value)}
                        placeholder="e.g., Interested in IUL options"
                        rows={3}
                        required
                        className="resize-none text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="chat-name" className="flex items-center mb-1.5 text-xs font-medium">
                          <User className="h-3 w-3 mr-1 text-primary" /> Name
                        </Label>
                        <Input id="chat-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required className="text-sm" />
                      </div>
                      <div>
                        <Label htmlFor="chat-email" className="flex items-center mb-1.5 text-xs font-medium">
                          <Mail className="h-3 w-3 mr-1 text-primary" /> Email
                        </Label>
                        <Input id="chat-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="text-sm" />
                      </div>
                    </div>
                    <div>
                        <Label htmlFor="chat-phone" className="flex items-center mb-1.5 text-xs font-medium">
                          <Phone className="h-3 w-3 mr-1 text-primary" /> Phone <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
                        </Label>
                        <Input id="chat-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" className="text-sm" />
                    </div>
                    <SheetFooter className="pt-3 pb-1 !mt-4 sticky bottom-0 bg-background">
                      <Button type="submit" className="w-full" disabled={isInquiryLoading}>
                        {isInquiryLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting Inquiry...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Submit Formal Inquiry
                          </>
                        )}
                      </Button>
                    </SheetFooter>
                  </form>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SheetContent>
      </Sheet>
    </>
  );
}

