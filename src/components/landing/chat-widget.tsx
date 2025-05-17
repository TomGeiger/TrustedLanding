
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
} from "@/components/ui/accordion";
import { MessageSquare, Send, User, Mail, Phone, CheckCircle, Bot, Sparkles, FileText, Lightbulb } from 'lucide-react';
import { sendChatInquiry, type ChatInquiryInput } from '@/app/actions/send-chat-inquiry';
import { aiChatAction, type AiClientChatInput } from '@/app/actions/ai-chat-action';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isStreaming?: boolean;
}

const samplePrompts = [
  "What is IUL insurance?",
  "Can you give me a financial tip?",
  "Tell me about 'Mornings with Trish'.",
  "How can Trusted Future help me?",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);

  const [inquiryQuestion, setInquiryQuestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isInquirySubmitted, setIsInquirySubmitted] = useState(false);
  const [isInquiryLoading, setIsInquiryLoading] = useState(false);

  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const currentAiMessageIdRef = useRef<string | null>(null);
  const [showSamplePrompts, setShowSamplePrompts] = useState(false);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [conversation]);

  const streamAiResponse = async (message: string, history: AiClientChatInput['history'], isInitialGreetingStream: boolean = false) => {
    setIsAiResponding(true);
    if (!isInitialGreetingStream) {
      setShowSamplePrompts(false);
    }

    const newAiMessageId = `ai-${Date.now()}`;
    currentAiMessageIdRef.current = newAiMessageId;

    setConversation(prev => [
      ...prev,
      { id: newAiMessageId, sender: 'ai', text: '', isStreaming: true }
    ]);

    let streamedText = '';
    let streamHadError = false;
    try {
      console.log('[ChatWidget] Calling aiChatAction with:', { message, history });
      const streamResult = await aiChatAction({ message, history });

      console.log('[ChatWidget] aiChatAction call result (awaited, raw stream object):', streamResult);
      console.log('[ChatWidget] typeof stream (awaited):', typeof streamResult);

      if (!streamResult || typeof streamResult[Symbol.asyncIterator] !== 'function') {
         console.error('[ChatWidget] CRITICAL: aiChatAction (awaited) did not return an async iterable object. Value:', streamResult);
         streamHadError = true; throw new Error('AI action did not return a valid stream.');
      }
      console.log('[ChatWidget] Stream (awaited) appears to be an async iterable. Starting iteration...');

      for await (const chunk of streamResult) {
        if (typeof chunk === 'string') {
          streamedText += chunk;
          setConversation(prevConv =>
            prevConv.map(msg =>
              msg.id === newAiMessageId ? { ...msg, text: streamedText, isStreaming: true } : msg
            )
          );
        } else {
          console.warn('[ChatWidget] Received non-string chunk from stream:', chunk);
        }
      }
      console.log('[ChatWidget] Stream iteration finished successfully.');

    } catch (error: any) {
      console.error("[ChatWidget] AI Streaming Error (client-side catch):", error);
      console.error("[ChatWidget] Error name:", error?.name);
      console.error("[ChatWidget] Error message:", error?.message);
      console.error("[ChatWidget] Error stack:", error?.stack);
      
      let errorMessageText = "An error occurred while fetching the AI response.";
      if (error.message) {
        if (error.message.includes('valid stream')) {
            errorMessageText = "AI action did not return a valid stream.";
        } else if (error.message.includes('non-iterable')) {
            errorMessageText = "AI action returned a Promise that resolved to a non-iterable value.";
        } else {
            errorMessageText = error.message;
        }
      }
      streamHadError = true;
      streamedText = `Sorry, I encountered an issue: ${errorMessageText}`;
      
      if (currentAiMessageIdRef.current === newAiMessageId && conversation.find(m => m.id === newAiMessageId)) {
        // This path should ideally not be needed if the finally block handles the final state
      } else {
        // This case might happen if the placeholder itself failed to be added.
        setConversation(prev => [
            ...prev,
            { id: newAiMessageId, sender: 'ai', text: `Sorry, I encountered an issue: ${errorMessageText}`, isStreaming: false }
        ]);
      }
    } finally {
      setConversation(prevConv =>
        prevConv.map(msg =>
          msg.id === newAiMessageId ? { ...msg, text: streamedText, isStreaming: false } : msg
        )
      );
      setIsAiResponding(false);
      currentAiMessageIdRef.current = null;

      if (isInitialGreetingStream && !streamHadError) {
        setShowSamplePrompts(true);
        console.log("[ChatWidget] Initial greeting stream finished successfully. setShowSamplePrompts(true)");
      } else if (isInitialGreetingStream && streamHadError) {
        setShowSamplePrompts(false);
        console.log("[ChatWidget] Initial greeting stream failed. setShowSamplePrompts(false)");
      }
      console.log('[ChatWidget] streamAiResponse finally block executed.');
    }
  };

  const handleAiMessageSend = async () => {
    if (!currentMessage.trim() || isAiResponding) return;
    setShowSamplePrompts(false); 

    const userMessageText = currentMessage.trim();
    const newUserMessage: ChatMessage = { id: `user-${Date.now()}`, sender: 'user', text: userMessageText };
    
    const conversationForApi = [...conversation, newUserMessage];
    setConversation(conversationForApi);
    setCurrentMessage('');

    const historyForApi = conversationForApi
      .filter(msg => msg.id !== newUserMessage.id) 
      .filter(msg => msg.sender === 'user' || (msg.sender === 'ai' && msg.text.trim() !== '' && !msg.isStreaming)) 
      .map(msg => ({
        sender: msg.sender,
        text: msg.text,
    }));

    await streamAiResponse(userMessageText, historyForApi, false);
  };

  const handleSamplePromptClick = (promptText: string) => {
    setShowSamplePrompts(false);
    setCurrentMessage(promptText);
    setTimeout(() => {
      handleAiMessageSend();
    }, 0);
  };


  const handleInquirySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsInquiryLoading(true);
    const inquiryData: ChatInquiryInput = { name, email, phone, question: inquiryQuestion };
    const result = await sendChatInquiry(inquiryData);
    if (result.success) {
      setIsInquirySubmitted(true);
      toast({ title: "Inquiry Sent!", description: "Trish or her team will get back to you soon." });
      setName(''); setEmail(''); setPhone(''); setInquiryQuestion('');
    } else {
      toast({ title: "Submission Failed", description: result.message || "Could not submit your inquiry.", variant: "destructive" });
    }
    setIsInquiryLoading(false);
  };

  const handleSheetOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setIsInquirySubmitted(false);
      setShowSamplePrompts(false); 
    } else {
      if (conversation.length === 0 && !isAiResponding) {
         console.log("[ChatWidget] Sheet opened, conversation empty. Streaming initial AI greeting.");
         setShowSamplePrompts(false); // Hide prompts while initial greeting is streaming
         await streamAiResponse("Hello", [], true); 
      } else if (conversation.length === 1 && conversation[0].sender === 'ai' && !conversation[0].isStreaming && !isAiResponding) {
        console.log("[ChatWidget] Sheet reopened, only AI greeting exists and not streaming. Showing sample prompts.");
        setShowSamplePrompts(true);
      } else if (conversation.length > 0) {
        setShowSamplePrompts(false);
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
                  {msg.sender === 'ai' && msg.isStreaming && msg.text.length === 0 && (
                     <Sparkles className="h-4 w-4 ml-1 inline-block animate-pulse text-muted-foreground" />
                  )}
                   {msg.sender === 'ai' && msg.isStreaming && msg.text.length > 0 && (
                     <span className="inline-block w-2 h-3 bg-muted-foreground animate-pulse ml-1 opacity-70"></span>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
          
          {showSamplePrompts && (
            <div className="px-4 pt-2 pb-1 border-t bg-background/50">
              <p className="text-xs text-muted-foreground mb-2 flex items-center"><Lightbulb className="h-3 w-3 mr-1.5"/>Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1 px-2.5"
                    onClick={() => handleSamplePromptClick(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}


          <div className="px-4 pb-2 pt-2 border-t bg-background">
            <div className="flex items-center space-x-2">
              <Input
                id="ai-chat-message"
                value={currentMessage}
                onChange={(e) => {
                  setCurrentMessage(e.target.value);
                  if (e.target.value.trim() !== '') {
                     setShowSamplePrompts(false); 
                  }
                }}
                placeholder="Ask Trish anything..."
                onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAiMessageSend(); }}}
                disabled={isAiResponding}
                className="flex-grow"
              />
              <Button onClick={handleAiMessageSend} disabled={isAiResponding || !currentMessage.trim()} size="icon">
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

