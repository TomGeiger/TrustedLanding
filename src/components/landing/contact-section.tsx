
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from '@/components/landing/section-wrapper';
import { Phone, Mail, MapPin, CalendarCheck } from 'lucide-react';

const contactDetails = [
  {
    icon: <Phone className="h-6 w-6 text-primary" />,
    title: "Phone",
    value: "(919) 522-3462",
    href: "tel:9195223462",
  },
  {
    icon: <Mail className="h-6 w-6 text-primary" />,
    title: "Email",
    value: "pgeiger.iul@gmail.com",
    href: "mailto:pgeiger.iul@gmail.com",
  },
  {
    icon: <MapPin className="h-6 w-6 text-primary" />,
    title: "Office (By Appointment)",
    value: "116 Donmoor Ct, Garner NC 27527-2500",
    href: "#", // Placeholder for map link
  },
];

export function ContactSection() {
  return (
    <SectionWrapper id="contact" className="bg-background">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">
          Get in Touch
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Ready to take the next step towards a secure financial future? Contact us today for a personalized consultation.
        </p>
        <h3 className="mt-6 text-xl md:text-2xl font-semibold text-foreground">
          Contact Trusted Future Today!
        </h3>
      </div>
      
      <Card className="max-w-3xl mx-auto shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {contactDetails.map((detail, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-md mt-1">
                {detail.icon}
              </div>
              <div>
                <h4 className="font-semibold text-lg text-foreground">{detail.title}</h4>
                {detail.href !== "#" ? (
                   <a href={detail.href} className="text-accent hover:underline hover:text-accent/80 transition-colors">
                    {detail.value}
                   </a>
                ) : (
                  <p className="text-muted-foreground">{detail.value}</p>
                )}
              </div>
            </div>
          ))}
          <div className="pt-4 text-center">
            <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow" asChild>
              <a href="mailto:pgeiger.iul@gmail.com">
                Send us an Email <Mail className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <div className="mt-4">
              <a 
                href="mailto:pgeiger.iul@gmail.com?subject=Consultation%20Request" 
                className="inline-flex items-center text-sm text-accent hover:underline hover:text-accent/80 transition-colors"
              >
                <CalendarCheck className="mr-2 h-4 w-4" />
                Schedule a Consultation
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </SectionWrapper>
  );
}
