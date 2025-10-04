import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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

interface FormData {
  name: string;
  title: string;
  content: string;
  rating: number;
  course: string;
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(mockTestimonials);

  // Form state for add/edit
  const [formData, setFormData] = useState<FormData>({
    name: "",
    title: "",
    content: "",
    rating: 5,
    course: "",
    featured: false,
    hasVideo: false
  });

  const filteredTestimonials = testimonials.filter(testimonial => {
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

  // Handler functions
  const handleAddTestimonial = () => {
    setFormData({
      name: "",
      title: "",
      content: "",
      rating: 5,
      course: "",
      featured: false,
      hasVideo: false
    });
    setIsAddModalOpen(true);
  };

  const handleEditTestimonial = (testimonial: TestimonialItem) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      title: testimonial.title,
      content: testimonial.content,
      rating: testimonial.rating,
      course: testimonial.course,
      featured: testimonial.featured,
      hasVideo: testimonial.hasVideo
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
    }
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.title || !formData.content || !formData.course) {
      alert("Please fill all required fields");
      return;
    }

    const newTestimonial: TestimonialItem = {
      id: Date.now().toString(),
      name: formData.name,
      title: formData.title,
      content: formData.content,
      rating: formData.rating,
      course: formData.course,
      date: new Date().toISOString().split('T')[0],
      featured: formData.featured,
      hasVideo: formData.hasVideo
    };

    setTestimonials([...testimonials, newTestimonial]);
    setIsAddModalOpen(false);
    setFormData({
      name: "",
      title: "",
      content: "",
      rating: 5,
      course: "",
      featured: false,
      hasVideo: false
    });
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !formData.name || !formData.title || !formData.content || !formData.course) {
      alert("Please fill all required fields");
      return;
    }

    const updatedTestimonial: TestimonialItem = {
      ...editingTestimonial,
      name: formData.name,
      title: formData.title,
      content: formData.content,
      rating: formData.rating,
      course: formData.course,
      featured: formData.featured,
      hasVideo: formData.hasVideo
    };

    setTestimonials(testimonials.map(testimonial => testimonial.id === editingTestimonial.id ? updatedTestimonial : testimonial));
    setIsEditModalOpen(false);
    setEditingTestimonial(null);
    setFormData({
      name: "",
      title: "",
      content: "",
      rating: 5,
      course: "",
      featured: false,
      hasVideo: false
    });
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
          <Button onClick={handleAddTestimonial}>
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
                    <Button size="sm" variant="outline" onClick={() => handleEditTestimonial(testimonial)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteTestimonial(testimonial.id)}>
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

      {/* Add Testimonial Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Testimonial</DialogTitle>
            <DialogDescription>
              Add a new student testimonial with their feedback and details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter student name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title/Role *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Fashion Design Student"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Testimonial Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the testimonial content"
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="course">Course *</Label>
                <Select value={formData.course} onValueChange={(value) => setFormData({ ...formData, course: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Advanced Pattern Making">Advanced Pattern Making</SelectItem>
                    <SelectItem value="Professional Draping">Professional Draping</SelectItem>
                    <SelectItem value="Color Theory in Fashion">Color Theory in Fashion</SelectItem>
                    <SelectItem value="Fashion Illustration">Fashion Illustration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rating">Rating</Label>
                <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ (5 Stars)</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ (4 Stars)</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ (3 Stars)</SelectItem>
                    <SelectItem value="2">⭐⭐ (2 Stars)</SelectItem>
                    <SelectItem value="1">⭐ (1 Star)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: !!checked })}
                  />
                  <Label htmlFor="featured">Featured Testimonial</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasVideo"
                    checked={formData.hasVideo}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasVideo: !!checked })}
                  />
                  <Label htmlFor="hasVideo">Video Testimonial</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Testimonial</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Testimonial Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
            <DialogDescription>
              Update the testimonial details and settings.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter student name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title/Role *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Fashion Design Student"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Testimonial Content *</Label>
                <Textarea
                  id="edit-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the testimonial content"
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-course">Course *</Label>
                <Select value={formData.course} onValueChange={(value) => setFormData({ ...formData, course: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Advanced Pattern Making">Advanced Pattern Making</SelectItem>
                    <SelectItem value="Professional Draping">Professional Draping</SelectItem>
                    <SelectItem value="Color Theory in Fashion">Color Theory in Fashion</SelectItem>
                    <SelectItem value="Fashion Illustration">Fashion Illustration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-rating">Rating</Label>
                <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ (5 Stars)</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ (4 Stars)</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ (3 Stars)</SelectItem>
                    <SelectItem value="2">⭐⭐ (2 Stars)</SelectItem>
                    <SelectItem value="1">⭐ (1 Star)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: !!checked })}
                  />
                  <Label htmlFor="edit-featured">Featured Testimonial</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-hasVideo"
                    checked={formData.hasVideo}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasVideo: !!checked })}
                  />
                  <Label htmlFor="edit-hasVideo">Video Testimonial</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Testimonial</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}