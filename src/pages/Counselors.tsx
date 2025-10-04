import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Counselor {
  id: number;
  name: string;
  designation: string;
  experience: string;
  tags: string[];
}

const predefinedTags = [
  "Career Guidance",
  "Personal Development",
  "Academic Support",
  "Mental Health",
  "Fashion Industry",
  "Portfolio Review",
  "Interview Prep",
  "Skill Development"
];

const initialCounselors: Counselor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    designation: "Senior Career Counselor",
    experience: "10 years",
    tags: ["Career Guidance", "Fashion Industry", "Interview Prep", "Portfolio Review"]
  },
  {
    id: 2,
    name: "Michael Chen",
    designation: "Academic Advisor",
    experience: "8 years",
    tags: ["Academic Support", "Skill Development", "Personal Development", "Career Guidance"]
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    designation: "Wellness Counselor",
    experience: "6 years",
    tags: ["Mental Health", "Personal Development", "Academic Support", "Career Guidance"]
  }
];

const Counselors = () => {
  const [counselors, setCounselors] = useState<Counselor[]>(initialCounselors);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCounselor, setEditingCounselor] = useState<Counselor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    experience: "",
    tags: [] as string[]
  });
  const [customTag, setCustomTag] = useState("");
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      experience: "",
      tags: []
    });
    setCustomTag("");
  };

  const handleAddCounselor = () => {
    if (!formData.name || !formData.designation || !formData.experience) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.tags.length < 4) {
      toast({
        title: "Error",
        description: "Please select at least 4 tags.",
        variant: "destructive",
      });
      return;
    }

    const newCounselor: Counselor = {
      id: Math.max(...counselors.map(c => c.id)) + 1,
      name: formData.name,
      designation: formData.designation,
      experience: formData.experience,
      tags: formData.tags
    };

    setCounselors([...counselors, newCounselor]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Success",
      description: "Counselor added successfully!",
    });
  };

  const handleEditCounselor = () => {
    if (!formData.name || !formData.designation || !formData.experience || !editingCounselor) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.tags.length < 4) {
      toast({
        title: "Error",
        description: "Please select at least 4 tags.",
        variant: "destructive",
      });
      return;
    }

    const updatedCounselors = counselors.map(counselor =>
      counselor.id === editingCounselor.id
        ? {
            ...counselor,
            name: formData.name,
            designation: formData.designation,
            experience: formData.experience,
            tags: formData.tags
          }
        : counselor
    );

    setCounselors(updatedCounselors);
    setIsEditDialogOpen(false);
    setEditingCounselor(null);
    resetForm();
    toast({
      title: "Success",
      description: "Counselor updated successfully!",
    });
  };

  const handleDeleteCounselor = (id: number) => {
    setCounselors(counselors.filter(counselor => counselor.id !== id));
    toast({
      title: "Success",
      description: "Counselor deleted successfully!",
    });
  };

  const openEditDialog = (counselor: Counselor) => {
    setEditingCounselor(counselor);
    setFormData({
      name: counselor.name,
      designation: counselor.designation,
      experience: counselor.experience,
      tags: counselor.tags
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
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const addCustomTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, customTag.trim()]
      }));
      setCustomTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const renderTagsSection = () => (
    <>
      <div className="grid gap-2">
        <Label>Tags (Select at least 4)</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {predefinedTags.map(tag => (
            <Badge
              key={tag}
              variant={formData.tags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Add Custom Tag</Label>
        <div className="flex gap-2">
          <Input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Enter custom tag"
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
        <Label>Selected Tags ({formData.tags.length})</Label>
        <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[50px]">
          {formData.tags.length === 0 ? (
            <span className="text-sm text-muted-foreground">No tags selected</span>
          ) : (
            formData.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="gap-1">
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

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Counselors</h1>
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
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter counselor name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="Enter designation"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="experience">Experience *</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g., 5 years"
                  />
                </div>
                {renderTagsSection()}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCounselor}>Add Counselor</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
        
       
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {counselors.map((counselor) => (
                  <TableRow key={counselor.id}>
                    <TableCell className="font-medium">{counselor.name}</TableCell>
                    <TableCell>{counselor.designation}</TableCell>
                    <TableCell>{counselor.experience}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {counselor.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {counselor.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{counselor.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
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
                                This action cannot be undone. This will permanently delete the counselor "{counselor.name}".
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
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Counselor</DialogTitle>
              <DialogDescription>
                Update the counselor details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter counselor name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-designation">Designation *</Label>
                <Input
                  id="edit-designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Enter designation"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-experience">Experience *</Label>
                <Input
                  id="edit-experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g., 5 years"
                />
              </div>
              {renderTagsSection()}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCounselor}>Update Counselor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Counselors;

