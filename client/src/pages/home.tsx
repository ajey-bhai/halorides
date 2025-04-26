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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      
      // Send the form data to our API
      await apiRequest("POST", "/api/leads", data);
      
      // Show success message
      toast({
        title: "Form submitted successfully!",
        description: "Thank you for your interest in HaloRide. We'll get back to you soon.",
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
                HaloRide - <span className="text-primary">Complete Safety</span> for Every Journey
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                Track your child's commute in real-time with HaloRide — providing a protective shield of safety that connects parents, schools, and van drivers.
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
                    src="https://images.pexels.com/photos/6491991/pexels-photo-6491991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="School children in a van" 
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
      

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 bg-white section relative overflow-hidden">
        <div className="absolute top-40 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-green-200/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-poppins text-gray-800 mb-4">For Everyone Involved</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              HaloRide connects all stakeholders in your child's commute journey, creating a complete safety system for everyone.
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
              <Card className="glass-dark h-full backdrop-blur-sm shadow-xl border border-white/10 overflow-hidden relative">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
                <CardContent className="pt-8 relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center mb-6 shadow-lg backdrop-blur-sm">
                    <i className="ri-parent-line text-2xl text-primary"></i>
                  </div>
                  <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-3">For Parents</h3>
                  <p className="text-gray-600 mb-6">
                    Know exactly where your child is during their commute with real-time tracking and instant notifications.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-primary text-xs"></i>
                      </div>
                      <span>Real-time location tracking</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-primary text-xs"></i>
                      </div>
                      <span>Pickup & drop-off notifications</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-primary text-xs"></i>
                      </div>
                      <span>Driver information & ratings</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-primary text-xs"></i>
                      </div>
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
              <Card className="glass-dark h-full backdrop-blur-sm shadow-xl border border-white/10 overflow-hidden relative">
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
                <CardContent className="pt-8 relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center mb-6 shadow-lg backdrop-blur-sm">
                    <i className="ri-school-line text-2xl text-primary"></i>
                  </div>
                  <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-3">For Schools</h3>
                  <p className="text-gray-600 mb-6">
                    Simplify transportation management and enhance safety protocols for all students.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-primary text-xs"></i>
                      </div>
                      <span>Centralized fleet management</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-primary text-xs"></i>
                      </div>
                      <span>Transportation analytics</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-primary text-xs"></i>
                      </div>
                      <span>Route optimization</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-primary text-xs"></i>
                      </div>
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
              <Card className="glass-dark h-full backdrop-blur-sm shadow-xl border border-white/10 overflow-hidden relative">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
                <CardContent className="pt-8 relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center mb-6 shadow-lg backdrop-blur-sm">
                    <i className="ri-steering-2-line text-2xl text-primary"></i>
                  </div>
                  <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-3">For Drivers</h3>
                  <p className="text-gray-600 mb-6">
                    Streamline your routes and manage student pickups and drop-offs efficiently.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-primary text-xs"></i>
                      </div>
                      <span>Student manifest & attendance</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-primary text-xs"></i>
                      </div>
                      <span>Optimized route navigation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-primary text-xs"></i>
                      </div>
                      <span>One-click pickup/drop confirmations</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-primary text-xs"></i>
                      </div>
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
      <section ref={howItWorksRef} id="how-it-works" className="py-20 bg-gray-50 section relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-poppins text-gray-800 mb-4">How HaloRide Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started with HaloRide is simple. Follow these three steps to ensure complete safety for your child's daily commute.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
            <div className="hidden md:block absolute top-32 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 z-0"></div>
            
            {/* Step 1 */}
            <motion.div 
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggeredFadeInUp(0.1)}
            >
              <Card className="glass-dark h-full backdrop-blur-md shadow-xl border border-white/10">
                <CardContent className="pt-12">
                  <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-xl ring-4 ring-primary/20">1</div>
                  <div className="text-center mb-6 pt-4">
                    <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-inner">
                      <i className="ri-user-add-line text-3xl text-primary"></i>
                    </div>
                    <h3 className="text-xl font-semibold font-poppins text-gray-800">Register Your Child</h3>
                  </div>
                  <p className="text-gray-600 text-center">
                    Create a profile for your child with essential details about their school, grade, and pickup location.
                  </p>
                </CardContent>
              </Card>
              <div className="hidden md:block absolute top-1/2 -right-6 transform translate-x-0 -translate-y-1/2 z-10">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 backdrop-blur-sm">
                  <i className="ri-arrow-right-line text-2xl text-primary"></i>
                </div>
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
              <Card className="glass-dark h-full backdrop-blur-md shadow-xl border border-white/10">
                <CardContent className="pt-12">
                  <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-xl ring-4 ring-primary/20">2</div>
                  <div className="text-center mb-6 pt-4">
                    <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-inner">
                      <i className="ri-school-line text-3xl text-primary"></i>
                    </div>
                    <h3 className="text-xl font-semibold font-poppins text-gray-800">Select Your School</h3>
                  </div>
                  <p className="text-gray-600 text-center">
                    Choose your child's school and get matched with verified and certified drivers serving your route.
                  </p>
                </CardContent>
              </Card>
              <div className="hidden md:block absolute top-1/2 -right-6 transform translate-x-0 -translate-y-1/2 z-10">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 backdrop-blur-sm">
                  <i className="ri-arrow-right-line text-2xl text-primary"></i>
                </div>
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
              <Card className="glass-dark h-full backdrop-blur-md shadow-xl border border-white/10">
                <CardContent className="pt-12">
                  <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-xl ring-4 ring-primary/20">3</div>
                  <div className="text-center mb-6 pt-4">
                    <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-inner">
                      <i className="ri-map-pin-time-line text-3xl text-primary"></i>
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
          
          <motion.div 
            className="mt-16 p-8 glass-light rounded-2xl shadow-xl max-w-4xl mx-auto backdrop-blur-sm border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/2">
                <img 
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Mobile app interface" 
                  className="rounded-lg shadow-md w-full object-cover h-[300px]"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold mb-3">Complete Transparency</h3>
                <p className="text-gray-600 mb-4">
                  Our intuitive mobile app puts control in parents' hands with detailed trip information, driver details, and real-time location tracking for complete peace of mind.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <i className="ri-shield-check-line text-primary"></i>
                  </div>
                  <span className="font-medium">Safety-First Approach</span>
                </div>
              </div>
            </div>
          </motion.div>
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
              Join thousands of satisfied parents who trust HaloRide's complete safety system for their children's commute.
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
                    "HaloRide has removed all my worries about my daughter's school commute. The safety features give me complete peace of mind with real-time tracking and instant notifications."
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
                    "As a working parent, I was always concerned about my son's transportation. HaloRide's comprehensive safety system with verified drivers and real-time tracking gives me complete peace of mind."
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
                    "The robust safety features and direct communication with our van driver through HaloRide is a game-changer. The comprehensive tracking system ensures my children's journey is always secure."
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
                Request early access and be among the first to experience complete safety for every journey.
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
                      name="parentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              onKeyPress={(e) => {
                                const charCode = e.which ? e.which : e.keyCode;
                                if (!(charCode >= 65 && charCode <= 90) && 
                                    !(charCode >= 97 && charCode <= 122) && 
                                    !(charCode === 32)) {
                                  e.preventDefault();
                                }
                              }}
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
                          <FormLabel>Email Address (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="your.email@example.com (optional)" 
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
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none">
                                +91
                              </div>
                              <Input 
                                placeholder="10-digit mobile number" 
                                type="tel" 
                                maxLength={10}
                                onKeyPress={(e) => {
                                  const charCode = e.which ? e.which : e.keyCode;
                                  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                                    e.preventDefault();
                                  }
                                }}
                                {...field} 
                                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="childGrade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child's Grade <span className="text-red-500">*</span></FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors">
                                <SelectValue placeholder="Select grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Pre-primary">Pre-primary (Pre-nursery, Nursery, LKG, UKG)</SelectItem>
                              <SelectItem value="Lower primary">Lower primary (Class 1-5)</SelectItem>
                              <SelectItem value="Higher primary">Higher primary (Class 6-8)</SelectItem>
                              <SelectItem value="Secondary">Secondary (Class 9-10)</SelectItem>
                              <SelectItem value="Higher secondary">Higher secondary (Class 11-12)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="schoolName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Name (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your child's school (optional)" 
                              onKeyPress={(e) => {
                                const charCode = e.which ? e.which : e.keyCode;
                                if (!(charCode >= 65 && charCode <= 90) && 
                                    !(charCode >= 97 && charCode <= 122) && 
                                    !(charCode === 32)) {
                                  e.preventDefault();
                                }
                              }}
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
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your city" 
                              onKeyPress={(e) => {
                                const charCode = e.which ? e.which : e.keyCode;
                                if (!(charCode >= 65 && charCode <= 90) && 
                                    !(charCode >= 97 && charCode <= 122) && 
                                    !(charCode === 32)) {
                                  e.preventDefault();
                                }
                              }}
                              {...field} 
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex items-center mt-2 mb-2">
                    <div className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                      <i className="ri-information-line text-primary text-xs"></i>
                    </div>
                    <p className="text-sm text-gray-600">
                      By submitting this form, you agree to receive updates about HaloRide's safety services.
                    </p>
                  </div>
                  
                  <div className="mb-4 text-sm text-gray-500">
                    <span className="text-red-500">*</span> Indicates required fields
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-6 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit details"}
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
                src="https://images.pexels.com/photos/20874644/pexels-photo-20874644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="School buses" 
                className="rounded-2xl shadow-xl w-full object-cover h-[400px]"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold font-poppins text-gray-800 mb-4">Our Safety Vision</h2>
              <p className="text-lg text-gray-600 mb-6">
                At HaloRide, we're dedicated to creating a complete safety system around every child's journey to and from school. Our commitment to transportation safety includes:
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
            <p className="text-gray-500">&copy; {new Date().getFullYear()} HaloRide. Complete safety for every journey.</p>
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
            <h3 className="text-lg font-semibold text-gray-800">Want Complete Safety for Your Child?</h3>
            <button 
              onClick={() => setShowStickyForm(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-1">
              <p className="text-gray-600">Register now for early access to the HaloRide platform and ensure complete safety for every journey.</p>
            </div>
            
            <div className="md:col-span-3">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-3">
                  <div className="md:flex-1">
                    <FormField
                      control={form.control}
                      name="parentName"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              onKeyPress={(e) => {
                                const charCode = e.which ? e.which : e.keyCode;
                                if (!(charCode >= 65 && charCode <= 90) && 
                                    !(charCode >= 97 && charCode <= 122) && 
                                    !(charCode === 32)) {
                                  e.preventDefault();
                                }
                              }}
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
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none text-xs">
                                +91
                              </div>
                              <Input 
                                placeholder="10-digit mobile number" 
                                type="tel" 
                                maxLength={10}
                                onKeyPress={(e) => {
                                  const charCode = e.which ? e.which : e.keyCode;
                                  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                                    e.preventDefault();
                                  }
                                }}
                                {...field} 
                                className="w-full pl-10 border-gray-300" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="md:flex-1">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <Input 
                              placeholder="Your city" 
                              onKeyPress={(e) => {
                                const charCode = e.which ? e.which : e.keyCode;
                                if (!(charCode >= 65 && charCode <= 90) && 
                                    !(charCode >= 97 && charCode <= 122) && 
                                    !(charCode === 32)) {
                                  e.preventDefault();
                                }
                              }}
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
                      name="childGrade"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full border-gray-300">
                                <SelectValue placeholder="Select grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pre-primary">Pre-primary (Pre-nursery, Nursery, LKG, UKG)</SelectItem>
                                <SelectItem value="Lower primary">Lower primary (Class 1-5)</SelectItem>
                                <SelectItem value="Higher primary">Higher primary (Class 6-8)</SelectItem>
                                <SelectItem value="Secondary">Secondary (Class 9-10)</SelectItem>
                                <SelectItem value="Higher secondary">Higher secondary (Class 11-12)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <Button type="submit" disabled={isSubmitting} className="whitespace-nowrap">
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <i className="ri-loader-2-line animate-spin mr-2"></i>
                          <span>Submitting...</span>
                        </div>
                      ) : "Submit details"}
                    </Button>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      <span className="text-red-500">*</span> Required fields
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
