"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Star,
  User,
  Quote,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Loader2
} from "lucide-react";
import apiService from "@/lib/api";
import { ImageCropModal } from "@/components/ImageCropModal";

interface TestimonialItem {
  _id: string;
  id:string;
  name: string;
  title: string;
  content: string;
  rating: number;
  course: string;
  date: string;
  featured: boolean;
  isActive: boolean;
  hasVideo: boolean;
  profileImage?: string | File | null;
  isPublished: boolean;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}
interface FormData {
  name: string;
  title: string;
  content: string;
  rating: number;
  course: string;
  featured: boolean;
  hasVideo: boolean;
  email?: string;
  company:string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  profileImage?: File | string; // File during editing/adding, string if coming from API
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email:"",
    title: "",
    content: "",
    rating: 5,
    company:"",
    course: "",
    featured: false,
    hasVideo: false,
    profileImage: null,
    socialMedia: { facebook: "", instagram: "", twitter: "", linkedin: "" },
  });
console.log("tetetetete--",formData)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTestimonials(page);
  }, [page]);

  const fetchTestimonials = async (pageNumber: number = 1) => {
    setLoading(true);
    try {
      const res = await apiService.getTestimonials(pageNumber, 6);
      const formatted = res.data.testimonials.map((item: any) => ({
        _id: item._id,
        id:item.id,
        name: item.name,
        email:  item.email,
        company: item.company,
        title: item.designation || "",
        content: item.message,
        rating: item.rating,
        // company: item.company || "",
        date: item.createdAt,
        featured: item.isFavorite,
        hasVideo: false,
        isActive: item.isActive,
        isPublished: item.isPublished,
        socialMedia: {
          facebook: item.socialMedia?.facebook || "",
          instagram: item.socialMedia?.instagram || "",
          twitter: item.socialMedia?.twitter || "",
          linkedin: item.socialMedia?.linkedin || "",
        },
        profileImage: item.profileImage || "",
      }));
      setTestimonials(formatted);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "featured" && testimonial.featured) ||
      (selectedFilter === "video" && testimonial.hasVideo);
    return matchesSearch && matchesFilter;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-muted-foreground"}`}
      />
    ));
  };

  // Handlers
  const handleAddTestimonial = () => {
    setFormData({
      name: "",
      title: "",
      content: "",
      rating: 5,
      course: "",
      email:"",
      company:"",
      featured: false,
      hasVideo: false,
      profileImage: null,
      socialMedia: { facebook: "", instagram: "", twitter: "", linkedin: "" },
    });
    setIsAddModalOpen(true);
  };

  const handleEditTestimonial = (testimonial: TestimonialItem) => {
    console.log("the data---",testimonial)
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      title: testimonial.title,
      email:testimonial.email,
      company:testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      course: testimonial.course,
      featured: testimonial.featured,
      hasVideo: testimonial.hasVideo,
      profileImage: testimonial.profileImage || null,
      socialMedia: { ...testimonial.socialMedia },
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteTestimonial = async (id: string) => {
    console.log("the test---",id)
    // if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await apiService.deleteTestimonial(id);
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete testimonial");
    }
  };

const handleSubmitAdd = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setLoading(true)
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email",formData.email);
    payload.append("designation", formData.title);
    payload.append("message", formData.content);
    payload.append("rating", formData.rating.toString());
    payload.append("company", formData.company);
    payload.append("isFavorite", formData.featured.toString());
    payload.append("isActive", "true");

    if (formData.profileImage) {
      payload.append("profileImage", formData.profileImage);
    }

    if (formData.socialMedia) {
    payload.append("socialMedia.facebook", formData.socialMedia.facebook || "");
payload.append("socialMedia.instagram", formData.socialMedia.instagram || "");
payload.append("socialMedia.twitter", formData.socialMedia.twitter || "");
payload.append("socialMedia.linkedin", formData.socialMedia.linkedin || "");

    }

    const res = await apiService.createTestimonial(payload); // make sure your backend accepts multipart/form-data
    fetchTestimonials();
    setIsAddModalOpen(false);
    setLoading(false)
  } catch (err) {
    console.error(err);
    alert("Failed to add testimonial");
    setLoading(false)
  }
};


const handleSubmitEdit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingTestimonial) return;

  try {
    setLoading(true)
    const payload = new FormData();
    payload.append("name", formData.name);
      payload.append("email",formData.email);
    payload.append("designation", formData.title);
    payload.append("message", formData.content);
    payload.append("rating", formData.rating.toString());
    payload.append("company", formData.company);
    payload.append("isFavorite", formData.featured.toString());

    if (formData.profileImage && typeof formData.profileImage !== "string") {
      payload.append("profileImage", formData.profileImage);
    }

    if (formData.socialMedia) {
    payload.append("socialMedia.facebook", formData.socialMedia.facebook || "");
payload.append("socialMedia.instagram", formData.socialMedia.instagram || "");
payload.append("socialMedia.twitter", formData.socialMedia.twitter || "");
payload.append("socialMedia.linkedin", formData.socialMedia.linkedin || "");

    }

    await apiService.updateTestimonial(editingTestimonial.id, payload);
    fetchTestimonials();
    setIsEditModalOpen(false);
    setLoading(false)
  } catch (err) {
    console.error(err);
    alert("Failed to update testimonial");
    setLoading(false)
  }
};


const handleTogglePublish = async (id: string, newStatus: boolean) => {
  console.log("New publish status:", newStatus); // <-- now will be true/false correctly

  try {
    // Optimistically update UI
    setTestimonials((prevTestimonials) =>
      prevTestimonials.map((t) =>
        t._id === id ? { ...t, isPublished: newStatus } : t
      )
    );

    // Call appropriate API
    if (newStatus) {
      await apiService.publishTestimonial(id);
      fetchTestimonials();
    } else {
      await apiService.unpublishTestimonial(id);
      fetchTestimonials();
    }
  } catch (err) {
    console.error("Error toggling publish:", err);

    // Revert if failed
    setTestimonials((prevTestimonials) =>
      prevTestimonials.map((t) =>
        t._id === id ? { ...t, isPublished: !newStatus } : t
      )
    );
  }
};

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <Button onClick={handleAddTestimonial}>
            <Plus className="mr-2 h-4 w-4" /> Add Testimonial
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {!loading && filteredTestimonials.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No testimonials found</p>
            </div>
          )}

          {!loading &&
            testimonials.map((testimonial) => (
              <Card key={testimonial._id} className={`${testimonial.featured ? "ring-2 ring-primary/20" : ""}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {/* Profile Image */}
                      <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                        {testimonial.profileImage ? (
                          <img
                            src={typeof testimonial.profileImage === "string" ? testimonial.profileImage : URL.createObjectURL(testimonial.profileImage)}
                            alt={testimonial.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                          {testimonial.featured && <Badge variant="secondary">Featured</Badge>}
                          {testimonial.hasVideo && <Badge variant="outline">Video</Badge>}
                        </div>
                        <CardDescription className="mb-2">{testimonial.title}</CardDescription>
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(testimonial.rating)}</div>
                          <span className="text-sm text-muted-foreground">{testimonial.rating}/5</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 items-center">
                    <Switch
                    checked={Boolean(testimonial.isPublished)}
                    onCheckedChange={(checked) =>
                      handleTogglePublish(testimonial.id, checked)
                    }
                  />  
                      <Button size="sm" variant="outline" onClick={() => handleEditTestimonial(testimonial)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteTestimonial(testimonial._id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="relative max-h-[140px] overflow-y-auto pr-2">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-muted-foreground/20" />
                    <p className="text-sm leading-relaxed pl-6 italic">"{testimonial.content}"</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="font-medium">{testimonial.course}</span>
                    <span>{new Date(testimonial.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-3 mt-2">
                    {testimonial.socialMedia.facebook ? (
                      <a href={testimonial.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-5 w-5 text-blue-600 hover:text-blue-800" />
                      </a>
                    ) : (
                      <Facebook className="h-5 w-5 text-muted-foreground" />
                    )}
                    {testimonial.socialMedia.instagram ? (
                      <a href={testimonial.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-5 w-5 text-pink-500 hover:text-pink-700" />
                      </a>
                    ) : (
                      <Instagram className="h-5 w-5 text-muted-foreground" />
                    )}
                    {testimonial.socialMedia.twitter ? (
                      <a href={testimonial.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-5 w-5 text-blue-400 hover:text-blue-600" />
                      </a>
                    ) : (
                      <Twitter className="h-5 w-5 text-muted-foreground" />
                    )}
                    {testimonial.socialMedia.linkedin ? (
                      <a href={testimonial.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-5 w-5 text-blue-700 hover:text-blue-900" />
                      </a>
                    ) : (
                      <Linkedin className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="px-4 py-2 bg-muted rounded">{page} / {totalPages}</span>
          <Button variant="outline" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
            Next
          </Button>
        </div>

      </div>

      {/* Add & Edit modals remain the same as your code, just now handleSubmitAdd & handleSubmitEdit include profileImage */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
 <DialogContent className="max-w-3xl w-full max-h-[80vh] sm:h-auto overflow-y-auto rounded-xl p-6">
   <DialogHeader>
     <DialogTitle className="text-2xl">Add New Testimonial</DialogTitle>
   </DialogHeader>

   <form onSubmit={handleSubmitAdd} className="space-y-6">
     {/* Profile Image Upload */}
     <div className="flex justify-center">
      <div className="relative w-32 h-32">
    <input
      type="file"
      accept="image/*"
      id="profileImageAdd"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setTempImageSrc(reader.result as string);
            setCropModalOpen(true);
          };
          reader.readAsDataURL(file);
        }
      }}
      // onChange={(e) => {
      //   const file = e.target.files?.[0] || null;
      //   if (file) {
      //     setFormData({ ...formData, profileImage: file });
      //   } else {
      //     setFormData({ ...formData, profileImage: null });
      //   }
      // }}
    />
    <label
      htmlFor="profileImageAdd"
      className="cursor-pointer w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100 hover:border-gray-400 relative"
    >
      {formData.profileImage ? (
        <img
          src={
            typeof formData.profileImage === "string"
              ? formData.profileImage
              : URL.createObjectURL(formData.profileImage)
          }
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <User className="w-12 h-12 text-gray-400" />
      )}
      {/* <span className="absolute bottom-1 right-1 bg-primary text-white text-xs px-2 py-1 rounded-full">
        Edit
      </span> */}
    </label>
  </div>
     </div>

     {/* Name & Email */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div className="grid gap-2">
         <Label htmlFor="name">Name *</Label>
         <Input
           id="name"
           value={formData.name}
           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
           placeholder="Enter name"
         />
       </div>
       <div className="grid gap-2">
         <Label htmlFor="email">Email *</Label>
         <Input
           id="email"
           value={formData.email || ""}
           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
           placeholder="Enter email"
         />
       </div>
     </div>

     {/* Designation & Company */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div className="grid gap-2">
         <Label htmlFor="designation">Designation *</Label>
         <Input
           id="designation"
           value={formData.title}
           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
           placeholder="Enter designation"
         />
       </div>
       <div className="grid gap-2">
         <Label htmlFor="company">Company *</Label>
         <Input
           id="company"
           value={formData.company}
           onChange={(e) => setFormData({ ...formData, company: e.target.value })}
           placeholder="Enter company"
         />
       </div>
     </div>

     {/* Rating */}
     <div className="grid gap-2">
       <Label htmlFor="rating">Rating</Label>
       <Select
         value={formData.rating.toString()}
         onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
       >
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

     {/* Message */}
     <div className="grid gap-2">
       <Label htmlFor="message">Message *</Label>
       <Textarea
         id="message"
         value={formData.content}
         onChange={(e) => setFormData({ ...formData, content: e.target.value })}
         placeholder="Enter testimonial message"
         rows={5}
       />
     </div>

     {/* Social Media */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div className="grid gap-2">
         <Label htmlFor="facebook">Facebook</Label>
         <Input
           id="facebook"
           value={formData.socialMedia?.facebook || ""}
           onChange={(e) =>
             setFormData({
               ...formData,
               socialMedia: { ...formData.socialMedia, facebook: e.target.value },
             })
           }
           placeholder="Facebook URL"
         />
       </div>
       <div className="grid gap-2">
         <Label htmlFor="instagram">Instagram</Label>
         <Input
           id="instagram"
           value={formData.socialMedia?.instagram || ""}
           onChange={(e) =>
             setFormData({
               ...formData,
               socialMedia: { ...formData.socialMedia, instagram: e.target.value },
             })
           }
           placeholder="Instagram URL"
         />
       </div>
       <div className="grid gap-2">
         <Label htmlFor="twitter">Twitter</Label>
         <Input
           id="twitter"
           value={formData.socialMedia?.twitter || ""}
           onChange={(e) =>
             setFormData({
               ...formData,
               socialMedia: { ...formData.socialMedia, twitter: e.target.value },
             })
           }
           placeholder="Twitter URL"
         />
       </div>
       <div className="grid gap-2">
         <Label htmlFor="linkedin">LinkedIn</Label>
         <Input
           id="linkedin"
           value={formData.socialMedia?.linkedin || ""}
           onChange={(e) =>
             setFormData({
               ...formData,
               socialMedia: { ...formData.socialMedia, linkedin: e.target.value },
             })
           }
           placeholder="LinkedIn URL"
         />
       </div>
     </div>

     <DialogFooter className="flex justify-end gap-2">
       <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
         Cancel
       </Button>
       <Button type="submit">{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Add Testimonial</Button>
     </DialogFooter>
   </form>
 </DialogContent>
</Dialog>

{/* Edit Testimonial Modal */}
{/* Edit Testimonial Modal */}
<Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
 <DialogContent className="max-w-3xl w-full max-h-[80vh] sm:h-auto overflow-y-auto rounded-xl p-6">
   <DialogHeader>
     <DialogTitle className="text-2xl">Edit Testimonial</DialogTitle>
   </DialogHeader>

   <form onSubmit={handleSubmitEdit} className="space-y-6">
     {/* Profile Image Upload */}
     <div className="flex justify-center">
       <div className="relative w-32 h-32">
         <input
           type="file"
           accept="image/*"
           id="profileImageEdit"
           className="hidden"
           onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                setTempImageSrc(reader.result as string);
                setCropModalOpen(true);
              };
              reader.readAsDataURL(file);
            }
          }}
         />
         <label
           htmlFor="profileImageEdit"
           className="cursor-pointer w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100 hover:border-gray-400"
         >
           {formData.profileImage ? (
             <img
              src={
            typeof formData.profileImage === "string"
              ? formData.profileImage
              : URL.createObjectURL(formData.profileImage)
          }
               alt="Profile"
               className="w-full h-full object-cover"
             />
           ) : (
             <User className="w-12 h-12 text-gray-400" />
           )}
           <span className="absolute bottom-1 right-1 bg-primary text-white text-xs px-2 py-1 rounded-full">
             Edit
           </span>
         </label>
       </div>
     </div>

     {/* Name & Email */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div className="grid gap-2">
         <Label htmlFor="edit-name">Name *</Label>
         <Input
           id="edit-name"
           value={formData.name}
           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
           placeholder="Enter name"
         />
       </div>
       <div className="grid gap-2">
         <Label htmlFor="edit-email">Email *</Label>
         <Input
           id="edit-email"
           value={formData.email || ""}
           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
           placeholder="Enter email"
         />
       </div>
     </div>

     {/* Designation & Company */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div className="grid gap-2">
         <Label htmlFor="edit-designation">Designation *</Label>
         <Input
           id="edit-designation"
           value={formData.title}
           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
           placeholder="Enter designation"
         />
       </div>
       <div className="grid gap-2">
         <Label htmlFor="edit-company">Company *</Label>
         <Input
           id="edit-company"
           value={formData.company}
           onChange={(e) => setFormData({ ...formData, company: e.target.value })}
           placeholder="Enter company"
         />
       </div>
     </div>

     {/* Rating */}
     <div className="grid gap-2">
       <Label htmlFor="edit-rating">Rating</Label>
       <Select
         value={formData.rating.toString()}
         onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
       >
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

     {/* Message */}
     <div className="grid gap-2">
       <Label htmlFor="edit-message">Message *</Label>
       <Textarea
         id="edit-message"
         value={formData.content}
         onChange={(e) => setFormData({ ...formData, content: e.target.value })}
         placeholder="Enter testimonial message"
         rows={5}
       />
     </div>

     {/* Social Media */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div className="grid gap-2">
         <Label htmlFor="edit-facebook">Facebook</Label>
         <Input
           id="edit-facebook"
           value={formData.socialMedia?.facebook || ""}
           onChange={(e) =>
             setFormData({
               ...formData,
               socialMedia: { ...formData.socialMedia, facebook: e.target.value },
             })
           }
           placeholder="Facebook URL"
         />
       </div>
       <div className="grid gap-2">
         <Label htmlFor="edit-instagram">Instagram</Label>
         <Input
           id="edit-instagram"
           value={formData.socialMedia?.instagram || ""}
           onChange={(e) =>
             setFormData({
               ...formData,
               socialMedia: { ...formData.socialMedia, instagram: e.target.value },
             })
           }
           placeholder="Instagram URL"
         />
       </div>
       <div className="grid gap-2">
         <Label htmlFor="edit-twitter">Twitter</Label>
         <Input
           id="edit-twitter"
           value={formData.socialMedia?.twitter || ""}
           onChange={(e) =>
             setFormData({
               ...formData,
               socialMedia: { ...formData.socialMedia, twitter: e.target.value },
             })
           }
           placeholder="Twitter URL"
         />
       </div>
       <div className="grid gap-2">
         <Label htmlFor="edit-linkedin">LinkedIn</Label>
         <Input
           id="edit-linkedin"
           value={formData.socialMedia?.linkedin || ""}
           onChange={(e) =>
             setFormData({
               ...formData,
               socialMedia: { ...formData.socialMedia, linkedin: e.target.value },
             })
           }
           placeholder="LinkedIn URL"
         />
       </div>
     </div>

     <DialogFooter className="flex justify-end gap-2">
       <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
         Cancel
       </Button>
       <Button type="submit">{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Update Testimonial</Button>
     </DialogFooter>
   </form>
 </DialogContent>
</Dialog>
<ImageCropModal
  imageSrc={tempImageSrc}
  open={cropModalOpen}
  onClose={() => setCropModalOpen(false)}
  onCropComplete={(croppedFile) => {
    setFormData({ ...formData, profileImage: croppedFile });
  }}
/>
    </Layout>
  );
}
