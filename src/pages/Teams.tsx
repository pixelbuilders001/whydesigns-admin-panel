"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Eye, EyeOff, Users, User, Loader2 } from "lucide-react";
import apiService from "@/lib/api";
import { Team } from "@/lib/api";
import { Switch } from "@/components/ui/switch";
import { ImageCropModal } from "@/components/ImageCropModal";

interface TeamFormData {
  name: string;
  designation: string;
  description: string;
  image: File | null;
}

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const [cropModalOpen, setCropModalOpen] = useState(false);
const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);


  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    designation: "",
    description: "",
    image: null,
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTeams(page);
  }, [page]);

  const fetchTeams = async (pageNumber: number = 1) => {
    setLoading(true);
    try {
      const res = await apiService.getTeams(pageNumber, 10);
      setTeams(res.data.teams);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = () => {
    setFormData({
      name: "",
      designation: "",
      description: "",
      image: null,
    });
    setIsAddModalOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      designation: team.designation,
      description: team.description,
      image: team.image, // For editing, we don't pre-populate the file input
    });
    setIsEditModalOpen(true);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.designation ||
      !formData.description ||
      !formData.image
    ) {
      alert("Please fill in all required fields and select an image");
      return;
    }
    setLoading(true);
    const submitFormData = new FormData();
    
    submitFormData.append("name", formData.name);
    submitFormData.append("designation", formData.designation);
    submitFormData.append("description", formData.description);
    submitFormData.append("image", formData.image);

    try {
      await apiService.createTeam(submitFormData);
      setLoading(false);
      setIsAddModalOpen(false);
      fetchTeams(page);
    } catch (error) {
      setLoading(false)
      console.error("Error creating team member:", error);
      alert("Failed to create team member");
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingTeam) return;

    const submitFormData = new FormData();
    submitFormData.append("name", formData.name);
    submitFormData.append("designation", formData.designation);
    submitFormData.append("description", formData.description);

    // Only append image if a new one is selected
    if (formData.image) {
      submitFormData.append("image", formData.image);
    }

    try {
      setLoading(true);
      await apiService.updateTeam(editingTeam.id, submitFormData);
      setLoading(false);
      setIsEditModalOpen(false);
      setEditingTeam(null);
      fetchTeams(page);
    } catch (error) {
      setLoading(false);
      console.error("Error updating team member:", error);
      alert("Failed to update team member");
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      setLoading(true);
      await apiService.deleteTeam(id);
      fetchTeams(page);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error deleting team member:", error);
      alert("Failed to delete team member");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const status = currentStatus ? "unpublish" : "publish";
      await apiService.toggleTeamStatus(id, status);
      fetchTeams(page);
    } catch (error) {
      console.error("Error toggling team member status:", error);
      alert("Failed to update team member status");
    }
  };

  //   const filteredTeams = teams?.filter((team) =>
  //     team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     team.designation.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team Management</h1>
            <p className="text-muted-foreground">
              Manage your team members and their information
            </p>
          </div>
          <Button onClick={handleAddTeam} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Team Member
          </Button>
        </div>
        {/* 
        <Card>
      
          <CardContent> */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No team members found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "No team members match your search."
                : "Get started by adding your first team member."}
            </p>
            {!searchTerm && (
              <Button onClick={handleAddTeam}>
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Card key={team.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={team.image}
                      alt={team.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {team.name}
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        {team.designation}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {team.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={team.isPublished ? "default" : "secondary"}
                      >
                        {team.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      <Switch
                        checked={team.isPublished}
                        onCheckedChange={(checked) =>
                          handleToggleStatus(team.id, team.isPublished)
                        }
                        title={
                          team.isPublished ? "Deactivate PDF" : "Activate PDF"
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTeam(team)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTeam(team.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {/* </CardContent>
        </Card> */}

        {/* Add Team Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid gap-4 py-4">
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
                      //     setFormData({ ...formData, image: file });
                      //   } else {
                      //     setFormData({ ...formData, image: null });
                      //   }
                      // }}
                    />
                    <label
                      htmlFor="profileImageAdd"
                      className="cursor-pointer w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100 hover:border-gray-400 relative"
                    >
                      {formData.image ? (
                        <img
                          src={
                            typeof formData.image === "string"
                              ? formData.image
                              : URL.createObjectURL(formData.image)
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
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter team member name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    placeholder="Enter designation"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter description"
                    rows={4}
                    required
                  />
                </div>
                {/* <div className="grid gap-2">
                  <Label htmlFor="image">Profile Image *</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                    required
                  />
                </div> */}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit"> {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />  : ""} Add Team Member</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Team Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid gap-4 py-4">
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
          //  onChange={(e) =>
          //    setFormData({ ...formData, image: e.target.files?.[0] || null })
          //  }
         />
         <label
           htmlFor="profileImageEdit"
           className="cursor-pointer w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100 hover:border-gray-400"
         >
           {formData.image ? (
             <img
              src={
            typeof formData.image === "string"
              ? formData.image
              : URL.createObjectURL(formData.image)
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
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter team member name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-designation">Designation *</Label>
                  <Input
                    id="edit-designation"
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    placeholder="Enter designation"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description *</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter description"
                    rows={4}
                    required
                  />
                </div>
                {/* <div className="grid gap-2">
                  <Label htmlFor="edit-image">Profile Image</Label>
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Leave empty to keep current image
                  </p>
                </div> */}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit"> {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :null } Update Team Member</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <ImageCropModal
  imageSrc={tempImageSrc}
  open={cropModalOpen}
  onClose={() => setCropModalOpen(false)}
  onCropComplete={(croppedFile) => {
    setFormData({ ...formData, image: croppedFile });
  }}
/>
      </div>
    </Layout>
  );
}
