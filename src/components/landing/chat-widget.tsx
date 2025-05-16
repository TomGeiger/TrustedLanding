
'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { MessageSquare, Send, User, Mail, Phone, CheckCircle, AlertTriangle } from 'lucide-react';
import { sendChatInquiry, type ChatInquiryInput } from '@/app/actions/send-chat-inquiry';
import { useToast } from "@/hooks/use-toast";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const inquiryData: ChatInquiryInput = { name, email, phone, question };

    const result = await sendChatInquiry(inquiryData);

    if (result.success) {
      setIsSubmitted(true);
      toast({
        title: "Inquiry Sent!",
        description: "Trish or her team will get back to you soon.",
        variant: "default",
      });
      // Clear form fields after successful submission
      setQuestion('');
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
    setIsLoading(false);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset submission state when sheet is closed, fields are cleared on successful submit or if re-opened
      setIsSubmitted(false);
      // Optionally, clear fields if form was not submitted successfully and sheet is closed
      // if (!isSubmitted) {
      //   setQuestion('');
      //   setName('');
      //   setEmail('');
      //   setPhone('');
      // }
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-xl hover:shadow-2xl transition-shadow bg-primary hover:bg-primary/90 z-[60]"
        size="icon"
        aria-label="Open chat with Trish"
      >
        <MessageSquare className="h-8 w-8 text-primary-foreground" />
      </Button>

      <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-2xl text-primary flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" />
              Chat with Trish
            </SheetTitle>
            <SheetDescription className="text-sm">
              Hi, I&apos;m here to help! Ask your questions about insurance or request a consultation.
            </SheetDescription>
          </SheetHeader>

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center flex-grow p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Inquiry Sent!</h3>
              <p className="text-muted-foreground mb-6">
                Thank you for your message. Trish or her team will get back to you soon.
              </p>
              <Button onClick={() => handleSheetOpenChange(false)} variant="outline">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto space-y-4 px-6 py-4">
              <div>
                <Label htmlFor="chat-question" className="flex items-center mb-1.5 text-sm font-medium">
                  <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                  Your Question
                </Label>
                <Textarea
                  id="chat-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  rows={5}
                  required
                  className="resize-none"
                />
              </div>
              
              <div className="pt-3 space-y-4">
                <p className="text-sm text-muted-foreground">
                  If you&apos;d like a consultation, please provide your details:
                </p>
                <div>
                  <Label htmlFor="chat-name" className="flex items-center mb-1.5 text-sm font-medium">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    Your Name
                  </Label>
                  <Input
                    id="chat-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="chat-email" className="flex items-center mb-1.5 text-sm font-medium">
                    <Mail className="h-4 w-4 mr-2 text-primary" />
                    Your Email
                  </Label>
                  <Input
                    id="chat-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="chat-phone" className="flex items-center mb-1.5 text-sm font-medium">
                    <Phone className="h-4 w-4 mr-2 text-primary" />
                    Your Phone <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
                  </Label>
                  <Input
                    id="chat-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              
              <SheetFooter className="pt-6 pb-2 sticky bottom-0 bg-background">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Inquiry
                    </>
                  )}
                </Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
