import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { fadeIn, fadeInUp, staggerContainer, slideInLeft, slideInRight, staggeredFadeInUp } from "@/lib/motion";
import { apiRequest } from "@/lib/queryClient";

// Form schema for the lead form
const formSchema = z.object({
  parentName: z.string().min(2, { message: "Name must be at least 2 characters" }).regex(/^[a-zA-Z\s]+$/, { message: "Only alphabets allowed" }),
  childGrade: z.string().min(1, { message: "Please select a grade" }),
  schoolName: z.string().regex(/^[a-zA-Z\s]*$/, { message: "Only alphabets allowed" }).optional(),
  city: z.string().min(2, { message: "City must be at least 2 characters" }).regex(/^[a-zA-Z\s]+$/, { message: "Only alphabets allowed" }),
  mobileNumber: z.string().regex(/^\d{10}$/, { message: "Must be exactly 10 digits" }),
  email: z.string().email({ message: "Please enter a valid email address" }).optional()
});

export default function Home() {
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStickyForm, setShowStickyForm] = useState(false);

  // Define grade options for dropdown
  const gradeOptions = [
    "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", 
    "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentName: "",
      childGrade: "",
      schoolName: "",
      city: "",
      mobileNumber: "",
      email: ""
    }
  });

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    setIsMenuOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Add scroll event listener to show/hide sticky form
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Show sticky form after scrolling past 50% of viewport height
      setShowStickyForm(scrollPosition > windowHeight * 0.5);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      // Extract consent as it's not part of our backend schema
      const { consent, ...leadData } = data;
      
      // Send the form data to our API
      await apiRequest("POST", "/api/leads", leadData);
      
      // Show success message
      toast({
        title: "Form submitted successfully!",
        description: "Thank you for your interest in Saarthi. We'll get back to you soon.",
        variant: "default",
      });
      
      // Reset the form
      form.reset();
    } catch (error) {
      // Show error message
      toast({
        title: "Error submitting form",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full bg-white bg-opacity-90 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="#" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse" style={{ width: 'calc(100% + 8px)', height: 'calc(100% + 8px)', top: '-4px', left: '-4px' }}></div>
                <i className="ri-shield-star-line text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold font-poppins text-gray-800">HaloRide</span>
            </a>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection(featuresRef)} className="font-medium hover:text-primary transition-colors">Features</button>
              <button onClick={() => scrollToSection(howItWorksRef)} className="font-medium hover:text-primary transition-colors">How It Works</button>
              <button onClick={() => scrollToSection(contactRef)} className="font-medium hover:text-primary transition-colors">Contact</button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button onClick={() => scrollToSection(contactRef)} className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
                Get Started
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="md:hidden text-gray-700 focus:outline-none"
              >
                <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-white border-t`}>
          <div className="container mx-auto px-4 py-3 space-y-3">
            <button onClick={() => scrollToSection(featuresRef)} className="block w-full text-left font-medium hover:text-primary py-2">Features</button>
            <button onClick={() => scrollToSection(howItWorksRef)} className="block w-full text-left font-medium hover:text-primary py-2">How It Works</button>
            <button onClick={() => scrollToSection(contactRef)} className="block w-full text-left font-medium hover:text-primary py-2">Contact</button>
            <button onClick={() => scrollToSection(contactRef)} className="block w-full bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-medium text-center transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="hero-bg min-h-screen flex items-center pt-20 overflow-hidden relative section">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 z-10"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins text-gray-800 leading-tight mb-4">
                HaloRide - <span className="text-primary">Divine Protection</span> for Every Journey
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                Track your child's commute in real-time with HaloRide — providing a protective ring of safety that connects parents, schools, and van drivers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => scrollToSection(contactRef)}
                  size="lg" 
                  className="shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Button>
                <Button 
                  onClick={() => scrollToSection(howItWorksRef)}
                  size="lg" 
                  variant="outline" 
                  className="bg-white text-primary border-primary/20 hover:bg-primary/10 shadow-md hover:shadow-lg"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.3 }}
            >
              <div className="glass rounded-2xl p-6 shadow-xl max-w-md w-full">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1617307326200-77f63340015b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                    alt="Indian school children in a van" 
                    className="rounded-xl w-full h-64 object-cover"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <i className="ri-map-pin-line text-primary"></i>
                      </div>
                      <div>
                        <p className="font-medium">Live Tracking</p>
                        <p className="text-xs text-gray-500">In Transit • 5 mins away</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 space-y-4">
                  <motion.div 
                    className="flex items-center space-x-3"
                    variants={staggeredFadeInUp(0.6)}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <i className="ri-shield-check-line text-primary"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">Safety First</h3>
                      <p className="text-sm text-gray-500">Verified drivers & real-time alerts</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center space-x-3"
                    variants={staggeredFadeInUp(0.8)}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <i className="ri-notification-3-line text-primary"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">Instant Updates</h3>
                      <p className="text-sm text-gray-500">Pickup & drop notifications</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <motion.a 
            href="#features" 
            className="animate-bounce bg-white p-2 rounded-full shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <i className="ri-arrow-down-s-line text-primary text-xl"></i>
          </motion.a>
        </div>
      </section>
      
      {/* Trusted By */}
      <section className="bg-gray-50 py-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.p 
            className="text-center text-gray-500 font-medium mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Trusted by leading schools across the country
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="text-gray-400 flex items-center font-medium" variants={fadeInUp}>
              <i className="ri-building-4-line text-2xl mr-2"></i>
            </motion.div>
            <motion.div className="text-gray-400 flex items-center font-medium" variants={fadeInUp}>
              <i className="ri-building-4-line text-2xl mr-2"></i>
            </motion.div>
            <motion.div className="text-gray-400 flex items-center font-medium" variants={fadeInUp}>
              <i className="ri-building-4-line text-2xl mr-2"></i>
            </motion.div>
            <motion.div className="text-gray-400 flex items-center font-medium" variants={fadeInUp}>
              <i className="ri-building-4-line text-2xl mr-2"></i>
            </motion.div>
            <motion.div className="text-gray-400 flex items-center font-medium" variants={fadeInUp}>
              <i className="ri-building-4-line text-2xl mr-2"></i>
            </motion.div>
            <motion.div className="text-gray-400 flex items-center font-medium" variants={fadeInUp}>
              <i className="ri-building-4-line text-2xl mr-2"></i>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 bg-white section">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-poppins text-gray-800 mb-4">For Everyone Involved</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              HaloRide connects all stakeholders in your child's commute journey, creating a divine shield of protection for everyone.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* For Parents */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInLeft}
            >
              <Card className="glass-dark h-full">
                <CardContent className="pt-8">
                  <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center mb-6">
                    <i className="ri-parent-line text-2xl text-primary"></i>
                  </div>
                  <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-3">For Parents</h3>
                  <p className="text-gray-600 mb-6">
                    Know exactly where your child is during their commute with real-time tracking and instant notifications.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>Real-time location tracking</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>Pickup & drop-off notifications</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>Driver information & ratings</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>Route monitoring & alerts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* For Schools */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-dark h-full">
                <CardContent className="pt-8">
                  <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center mb-6">
                    <i className="ri-school-line text-2xl text-primary"></i>
                  </div>
                  <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-3">For Schools</h3>
                  <p className="text-gray-600 mb-6">
                    Simplify transportation management and enhance safety protocols for all students.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>Centralized fleet management</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>Transportation analytics</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>Route optimization</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>Attendance integration</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* For Drivers */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInRight}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-dark h-full">
                <CardContent className="pt-8">
                  <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center mb-6">
                    <i className="ri-steering-2-line text-2xl text-primary"></i>
                  </div>
                  <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-3">For Drivers</h3>
                  <p className="text-gray-600 mb-6">
                    Streamline your routes and manage student pickups and drop-offs efficiently.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>Student manifest & attendance</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>Optimized route navigation</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>One-click pickup/drop confirmations</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>Emergency reporting system</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section ref={howItWorksRef} id="how-it-works" className="py-20 bg-gray-50 section">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-poppins text-gray-800 mb-4">How HaloRide Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started with HaloRide is simple. Follow these three steps to ensure divine protection for your child's daily commute.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <motion.div 
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggeredFadeInUp(0.1)}
            >
              <Card className="glass h-full">
                <CardContent className="pt-12">
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg">1</div>
                  <div className="text-center mb-6 pt-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <i className="ri-user-add-line text-2xl text-primary"></i>
                    </div>
                    <h3 className="text-xl font-semibold font-poppins text-gray-800">Register Your Child</h3>
                  </div>
                  <p className="text-gray-600 text-center">
                    Create a profile for your child with essential details about their school, grade, and pickup location.
                  </p>
                </CardContent>
              </Card>
              <div className="hidden md:block absolute top-1/2 -right-6 transform translate-x-0 -translate-y-1/2 z-10">
                <i className="ri-arrow-right-line text-3xl text-primary/50"></i>
              </div>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggeredFadeInUp(0.3)}
            >
              <Card className="glass h-full">
                <CardContent className="pt-12">
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg">2</div>
                  <div className="text-center mb-6 pt-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <i className="ri-school-line text-2xl text-primary"></i>
                    </div>
                    <h3 className="text-xl font-semibold font-poppins text-gray-800">Select Your School</h3>
                  </div>
                  <p className="text-gray-600 text-center">
                    Choose your child's school and get matched with verified and certified drivers serving your route.
                  </p>
                </CardContent>
              </Card>
              <div className="hidden md:block absolute top-1/2 -right-6 transform translate-x-0 -translate-y-1/2 z-10">
                <i className="ri-arrow-right-line text-3xl text-primary/50"></i>
              </div>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div 
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggeredFadeInUp(0.5)}
            >
              <Card className="glass h-full">
                <CardContent className="pt-12">
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg">3</div>
                  <div className="text-center mb-6 pt-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <i className="ri-map-pin-time-line text-2xl text-primary"></i>
                    </div>
                    <h3 className="text-xl font-semibold font-poppins text-gray-800">Track Daily Commute</h3>
                  </div>
                  <p className="text-gray-600 text-center">
                    Monitor your child's journey in real-time, receive notifications, and enjoy peace of mind every day.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      

      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-poppins text-gray-800 mb-4">What Parents Are Saying</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied parents who trust HaloRide's divine protection for their children's commute safety.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggeredFadeInUp(0.1)}
            >
              <Card className="glass h-full">
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="text-primary">
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    "HaloRide has removed all my worries about my daughter's school commute. The divine protection it offers gives me complete peace of mind with real-time tracking and instant notifications."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <span className="text-primary font-semibold">AP</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Anjali Patel</h4>
                      <p className="text-sm text-gray-500">Mother of a 7-year-old</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Testimonial 2 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggeredFadeInUp(0.3)}
            >
              <Card className="glass h-full">
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="text-primary">
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    "As a working parent, I was always concerned about my son's transportation. HaloRide's divine protection through verified drivers and real-time tracking gives me complete peace of mind."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <span className="text-primary font-semibold">RK</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Rahul Kumar</h4>
                      <p className="text-sm text-gray-500">Father of a 10-year-old</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Testimonial 3 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggeredFadeInUp(0.5)}
            >
              <Card className="glass h-full">
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="text-primary">
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    "The divine protection and direct communication with our van driver through HaloRide is a game-changer. It feels like there's a guardian angel watching over my children's journey."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <span className="text-primary font-semibold">SM</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Sameera Menon</h4>
                      <p className="text-sm text-gray-500">Mother of twins</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Contact Form */}
      <section ref={contactRef} id="contact" className="py-20 bg-white section">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-poppins text-gray-800 mb-4">Join HaloRide Today</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Request early access and be among the first to experience divine protection for your children's school commutes.
              </p>
            </motion.div>
            
            <motion.div 
              className="glass-dark rounded-xl p-8 shadow-xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              {...field} 
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="your.email@example.com" 
                              type="email" 
                              {...field} 
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your phone number" 
                              type="tel" 
                              {...field} 
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="school"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your child's school" 
                              {...field} 
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your requirements..." 
                            rows={4} 
                            {...field} 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                            className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" 
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm text-gray-600 font-normal">
                            I agree to receive updates about HaloRide's divine protection service and understand that my data will be processed in accordance with the Privacy Policy.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-6 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Request Early Access"}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col lg:flex-row items-center gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1594621848029-b3c763c28cfe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="School children safely commuting" 
                className="rounded-2xl shadow-xl w-full object-cover"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold font-poppins text-gray-800 mb-4">Our Divine Protection Vision</h2>
              <p className="text-lg text-gray-600 mb-6">
                At HaloRide, we're dedicated to creating a divine shield of protection around every child's journey to and from school. Our commitment to divine safety includes:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mt-1 mr-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <i className="ri-check-line text-white text-sm"></i>
                  </div>
                  <p className="text-gray-600">Thorough background checks for all drivers</p>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 mr-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <i className="ri-check-line text-white text-sm"></i>
                  </div>
                  <p className="text-gray-600">Regular vehicle safety inspections</p>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 mr-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <i className="ri-check-line text-white text-sm"></i>
                  </div>
                  <p className="text-gray-600">Advanced real-time tracking technology</p>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 mr-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <i className="ri-check-line text-white text-sm"></i>
                  </div>
                  <p className="text-gray-600">Emergency response protocols for any situation</p>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 mr-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <i className="ri-check-line text-white text-sm"></i>
                  </div>
                  <p className="text-gray-600">Continuous driver training and certification</p>
                </li>
              </ul>
            </div>
          </motion.div>
          
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <div className="relative mr-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <i className="ri-shield-star-line text-white"></i>
                </div>
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-50"></div>
              </div>
              <span className="font-bold text-primary">HaloRide</span>
            </div>
            <p className="text-gray-500">&copy; {new Date().getFullYear()} HaloRide. Divine Protection for School Commutes.</p>
          </div>
        </div>
      </section>
      
      {/* Sticky Lead Form */}
      <motion.div
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-xl z-40 transform transition-transform duration-300 ${showStickyForm ? 'translate-y-0' : 'translate-y-full'}`}
        initial={{ y: '100%' }}
        animate={{ y: showStickyForm ? 0 : '100%' }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Want Divine Protection for Your Child?</h3>
            <button 
              onClick={() => setShowStickyForm(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-1">
              <p className="text-gray-600">Register now for early access to the HaloRide platform and ensure divine protection during your child's school commute.</p>
            </div>
            
            <div className="md:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-3">
                  <div className="md:flex-1">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              {...field} 
                              className="w-full border-gray-300" 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="md:flex-1">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <Input 
                              placeholder="Your phone number" 
                              type="tel" 
                              {...field} 
                              className="w-full border-gray-300" 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting} className="whitespace-nowrap">
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <i className="ri-loader-2-line animate-spin mr-2"></i>
                        <span>Submitting...</span>
                      </div>
                    ) : "Get Started"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
