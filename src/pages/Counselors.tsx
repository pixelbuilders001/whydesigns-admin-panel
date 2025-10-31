import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, X, Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ImageCropModal } from "@/components/ImageCropModal";

interface Counselor {
  _id: string;
  fullName: string;
  title: string;
  yearsOfExperience: number;
  bio: string;
  avatarUrl?: string;
  specialties: string[];
  isActive: boolean;
  isPublished: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
  id: number;
  experienceLevel: string;
  email:string;
}

interface CounselorsResponse {
  success: boolean;
  message: string;
  data: Counselor[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const predefinedTags = [
  "Career Guidance",
  "Personal Development",
  "Academic Support",
  "Mental Health",
  "Fashion Industry",
  "Portfolio Review",
  "Interview Prep",
  "Skill Development",
  "Anxiety",
  "Depression",
  "CBT",
  "Therapy",
  "Counseling",
  "Wellness"
];

const Counselors = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCounselor, setEditingCounselor] = useState<Counselor | null>(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCounselors, setTotalCounselors] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    yearsOfExperience: 0,
    bio: "",
    specialties: [] as string[],
    avatarFile: "",
    rating: 0,
    email: "",
    isActive: false,

  });
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  console.log("formdat-----",formData)
  const [customTag, setCustomTag] = useState("");
  const { toast } = useToast();

  // Fetch counselors from API
  const fetchCounselors = async (page: number = 1) => {
    try {
      setLoading(true);
      // You'll need to add getCounselors method to your apiService
      const response: CounselorsResponse = await apiService.getCounselors(page, 10);
      
      if (response.success) {
        setCounselors(response.data);
        setTotalPages(response.meta?.totalPages || 1);
        setTotalCounselors(response.meta?.total || 0);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching counselors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch counselors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounselors();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchCounselors(newPage);
    }
  };


  const resetForm = () => {
    setFormData({
      fullName: "",
      title: "",
      yearsOfExperience: 0,
      bio: "",
      specialties: [],
      avatarUrl: "",
      rating: 0,
      email: "",
      isActive: false,
    });
    setCustomTag("");
  };

  const handleAddCounselor = async () => {
    if (!formData.fullName || !formData.title || !formData.yearsOfExperience) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.specialties.length < 3) {
      toast({
        title: "Error",
        description: "Please select at least 3 specialties.",
        variant: "destructive",
      });
      return;
    }

    try {
      setFormLoading(true);

      // Create FormData for file upload support
      const formDataToSend = new FormData();

      // Add all text fields to FormData
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('yearsOfExperience', formData.yearsOfExperience.toString());
      formDataToSend.append('bio', formData.bio || '');
      formDataToSend.append('isActive', 'false');
      formDataToSend.append('rating', formData.rating.toString());
      formDataToSend.append('email', formData.email);

      // Handle specialties array
      formData.specialties.forEach((specialty, index) => {
        formDataToSend.append(`specialties[${index}]`, specialty);
      });

      // Handle file upload - send as 'avatar' field, not 'avatarUrl'
      if (formData.avatarFile) {
        formDataToSend.append('avatar', formData.avatarFile);
      }

      const response = await apiService.createCounselor(formDataToSend);

      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setIsAddDialogOpen(false);
        resetForm();
        fetchCounselors(currentPage); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating counselor:', error);
      toast({
        title: "Error",
        description: "Failed to create counselor",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };
  

  const handleDeleteCounselor = async (id: string) => {
    try {
      // You'll need to add deleteCounselor method to your apiService
      const response = await apiService.deleteCounselor(id);

      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        fetchCounselors(currentPage); // Refresh the current page
      }
    } catch (error) {
      console.error('Error deleting counselor:', error);
      toast({
        title: "Error",
        description: "Failed to delete counselor",
        variant: "destructive",
      });
    }
  };
const handleOpenDeleteDialog = (counselor: Counselor) => {


};
  const openEditDialog = (counselor: Counselor) => {
    console.log("formdat-----",counselor)
    setEditingCounselor(counselor);
    setFormData({
      fullName: counselor.fullName,
      title: counselor.title,
      yearsOfExperience: counselor.yearsOfExperience,
      bio: counselor.bio,
      specialties: counselor.specialties,
      avatarFile: counselor.avatarUrl || "",
      rating: counselor.rating,
      email: counselor.email,
      isActive: counselor.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(tag)
        ? prev.specialties.filter(t => t !== tag)
        : [...prev.specialties, tag]
    }));
  };

  const addCustomTag = () => {
    if (customTag.trim() && !formData.specialties.includes(customTag.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, customTag.trim()]
      }));
      setCustomTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(t => t !== tag)
    }));
  };

  const renderTagsSection = () => (
    <>
      <div className="grid gap-2">
        <Label>Add Specialties</Label>
        <div className="flex gap-2">
          <Input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Type a specialty and press Enter"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomTag();
              }
            }}
          />
          <Button type="button" onClick={addCustomTag} variant="outline">
            Add
          </Button>
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Specialties ({formData.specialties.length})</Label>
        <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[50px]">
          {formData.specialties.length === 0 ? (
            <span className="text-sm text-muted-foreground">No specialties added</span>
          ) : (
            formData.specialties.map((tag, index) => (
              <Badge key={`${tag}-${index}`} variant="secondary" className="gap-1">
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))
          )}
        </div>
      </div>
    </>
  );


  const handleEditCounselor = async () => {
    if (!formData.fullName || !formData.title || !formData.yearsOfExperience || !editingCounselor) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.specialties.length < 3) {
      toast({
        title: "Error",
        description: "Please select at least 3 specialties.",
        variant: "destructive",
      });
      return;
    }

    try {
      setFormLoading(true);

      // Create FormData for update (similar to create)
      const formDataToSend = new FormData();

      // Add all text fields to FormData
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('yearsOfExperience', formData.yearsOfExperience.toString());
      formDataToSend.append('bio', formData.bio || '');
      formDataToSend.append('isActive', formData.isActive.toString());
      formDataToSend.append('rating', formData.rating.toString());
      formDataToSend.append('email', formData.email);

      // Handle specialties array
      formData.specialties.forEach((specialty, index) => {
        formDataToSend.append(`specialties[${index}]`, specialty);
      });

      // Handle file upload - send as 'avatar' field, not 'avatarUrl'
      if (formData.avatarFile) {
        formDataToSend.append('avatar', formData.avatarFile);
      }

      const response = await apiService.updateCounselor(editingCounselor.id, formDataToSend);

      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setIsEditDialogOpen(false);
        setEditingCounselor(null);
        resetForm();
        fetchCounselors(currentPage); // Refresh the current page
      }
    } catch (error) {
      console.error('Error updating counselor:', error);
      toast({
        title: "Error",
        description: "Failed to update counselor",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleBlogPublish = async (id: string, status: string) => {
    try {
      const response = await apiService.publishCounselor(id);
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        fetchCounselors(currentPage); // Refresh the current page
      }
    } catch (error) {
      console.error('Error publishing blog:', error);
      toast({
        title: "Error",
        description: "Failed to publish blog",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Counselors ({totalCounselors})</h1>
            <p className="text-muted-foreground">
              Manage counselors and their expertise areas.
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>

                <Plus className="mr-2 h-4 w-4" />
                Add Counselor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Counselor</DialogTitle>
                <DialogDescription>
                  Add a new counselor. Fill in all the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                  <div className="relative w-32 h-32">
                    <input
                      type="file"
                      accept="image/*"
                      id="avatarUrl"
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
                      //     setFormData({ ...formData, image: file });
                      //   } else {
                      //     setFormData({ ...formData, image: null });
                      //   }
                      // }}
                    />
                    <label
                      htmlFor="avatarUrl"
                      className="cursor-pointer w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100 hover:border-gray-400 relative"
                    >
                      {formData.avatarFile ? (
                        <img
                          src={
                            typeof formData.avatarFile === "string"
                              ? formData.avatarFile
                              : URL.createObjectURL(formData.avatarFile)
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </label>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter counselor full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Title/Designation *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter designation/title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) })}
                    placeholder="e.g., 5"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Enter counselor bio"
                    rows={1}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    placeholder="e.g., 4.5"
                  />
                </div>
          
                {renderTagsSection()}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCounselor} disabled={formLoading}>
                  {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Counselor
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading state */}
        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading counselors...</span>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!loading && counselors.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <span>No counselors found. Add your first counselor!</span>
            </CardContent>
          </Card>
        )}

        {/* Counselors table */}
        {!loading && counselors.length > 0 && (
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Specialties</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {counselors.map((counselor) => (
                    <TableRow key={counselor._id}>
                      <TableCell className="font-medium">{counselor.fullName}</TableCell>
                      <TableCell>{counselor.title}</TableCell>
                      <TableCell>{counselor.yearsOfExperience} years</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {counselor.specialties.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {counselor.specialties.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{counselor.specialties.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{counselor.rating}</span>
                          <div className="text-yellow-500">★</div>
                        </div>
                      </TableCell>
                      <TableCell>{counselor.email}</TableCell>
                      <TableCell>   <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-semibold",
                          counselor.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        )}>
                          {counselor.isActive ? "Active" : "Inactive"}
                        </span></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                       
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(counselor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the counselor "{counselor.fullName}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteCounselor(counselor.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Counselor</DialogTitle>
              <div className="flex items-center justify-between">
              <DialogDescription>
                Update the counselor details below.
              </DialogDescription>
              <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
              </div>
             
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="flex justify-center">
                  <div className="relative w-32 h-32">
                    <input
                      type="file"
                      accept="image/*"
                      id="avatarUrl"
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
                      //     setFormData({ ...formData, image: file });
                      //   } else {
                      //     setFormData({ ...formData, image: null });
                      //   }
                      // }}
                    />
                    <label
                      htmlFor="avatarUrl"
                      className="cursor-pointer w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100 hover:border-gray-400 relative"
                    >
                      {formData.avatarFile ? (
                        <img
                          src={
                            typeof formData.avatarFile === "string"
                              ? formData.avatarFile
                              : URL.createObjectURL(formData.avatarFile)
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </label>
                  </div>
                </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-fullName">Full Name *</Label>
                <Input
                  id="edit-fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter counselor full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title/Designation *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter designation/title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-yearsOfExperience">Years of Experience *</Label>
                <Input
                  id="edit-yearsOfExperience"
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 5"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-bio">Bio</Label>
                <textarea
                  id="edit-bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Enter counselor bio"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-rating">Rating</Label>
                <Input
                  id="edit-rating"
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value)  })}
                  placeholder="e.g., 4.5"
                />
              </div>
          
              <div className="grid gap-2">
                  <Label htmlFor="isActive">Active</Label>
                
                </div>
              {renderTagsSection()}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCounselor} disabled={formLoading}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Counselor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ImageCropModal
  imageSrc={tempImageSrc}
  open={cropModalOpen}
  onClose={() => setCropModalOpen(false)}
  onCropComplete={(croppedFile) => {
    setFormData({ ...formData, avatarFile: croppedFile });
  }}
/>
      </div>
    </Layout>
  );
};

export default Counselors;