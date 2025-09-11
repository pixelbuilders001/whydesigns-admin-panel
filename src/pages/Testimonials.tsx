import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Search, Plus, Edit, Trash2, Star, User, Quote } from "lucide-react";

interface TestimonialItem {
  id: string;
  name: string;
  title: string;
  content: string;
  rating: number;
  course: string;
  date: string;
  featured: boolean;
  hasVideo: boolean;
}

const mockTestimonials: TestimonialItem[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "Fashion Design Student",
    content: "This course completely transformed my understanding of pattern making. The instructor's explanations are clear and the hands-on approach made complex concepts easy to grasp. I'm now confident in creating my own designs!",
    rating: 5,
    course: "Advanced Pattern Making",
    date: "2024-01-15",
    featured: true,
    hasVideo: true
  },
  {
    id: "2",
    name: "Emily Chen", 
    title: "Professional Designer",
    content: "As someone already in the industry, I was looking to refine my draping skills. This course exceeded my expectations with advanced techniques I hadn't encountered before. Highly recommended!",
    rating: 5,
    course: "Professional Draping",
    date: "2024-01-12",
    featured: false,
    hasVideo: false
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    title: "Fashion Entrepreneur",
    content: "The color theory module helped me create more cohesive collections. Understanding the psychology behind color choices has elevated my brand significantly. Thank you for such valuable content!",
    rating: 4,
    course: "Color Theory in Fashion",
    date: "2024-01-10",
    featured: true,
    hasVideo: true
  }
];

export default function Testimonials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredTestimonials = mockTestimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "featured" && testimonial.featured) ||
                         (selectedFilter === "video" && testimonial.hasVideo);
    
    return matchesSearch && matchesFilter;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`}
      />
    ));
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
            <p className="text-muted-foreground">
              Manage student feedback and course testimonials.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">All Testimonials</option>
            <option value="featured">Featured Only</option>
            <option value="video">Video Testimonials</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className={`${testimonial.featured ? 'ring-2 ring-primary/20' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-full">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        {testimonial.featured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                        {testimonial.hasVideo && (
                          <Badge variant="outline">Video</Badge>
                        )}
                      </div>
                      <CardDescription className="mb-2">
                        {testimonial.title}
                      </CardDescription>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {renderStars(testimonial.rating)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {testimonial.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-muted-foreground/20" />
                  <p className="text-sm leading-relaxed pl-6 italic">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="font-medium">{testimonial.course}</span>
                  <span>{new Date(testimonial.date).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTestimonials.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No testimonials found</p>
            <p className="text-muted-foreground">Try adjusting your search or add your first testimonial.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}