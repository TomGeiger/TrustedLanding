
'use server';

import type { z } from 'zod';
import { object, string } from 'zod';

// Define the schema for the input
const ChatInquirySchema = object({
  name: string().min(1, { message: 'Name is required.' }),
  email: string().email({ message: 'Invalid email address.' }),
  phone: string().optional(),
  question: string().min(1, { message: 'Question is required.' }),
});

export type ChatInquiryInput = z.infer<typeof ChatInquirySchema>;

interface SendChatInquiryResponse {
  success: boolean;
  message: string;
}

export async function sendChatInquiry(
  data: ChatInquiryInput
): Promise<SendChatInquiryResponse> {
  const validation = ChatInquirySchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      message: 'Invalid input: ' + validation.error.errors.map(e => e.message).join(', '),
    };
  }

  const { name, email, phone, question } = validation.data;
  const toEmail = 'tom.geiger@me.com'; // Target email address

  try {
    // Simulate sending email
    console.log('---- SIMULATING EMAIL SEND ----');
    console.log('To:', toEmail);
    console.log('From:', email); // Or a fixed sender email if preferred
    console.log('Subject: New Chat Inquiry from Trusted Future Website');
    console.log('Body:');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    if (phone) {
      console.log(`Phone: ${phone}`);
    }
    console.log(`Question: ${question}`);
    console.log('-------------------------------');

    // In a real scenario, you would use an email library here:
    // e.g., await sendEmail({ to: toEmail, subject: '...', html: '...' });

    return { success: true, message: 'Inquiry submitted successfully!' };
  } catch (error) {
    console.error('Error sending chat inquiry:', error);
    return {
      success: false,
      message: 'Failed to submit inquiry. Please try again later.',
    };
  }
}
