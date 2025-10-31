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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { MessageSquare, Trash2, List } from "lucide-react";
import { apiService } from "@/lib/api";
import type { Lead } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const { toast } = useToast();

  // Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // 🔹 Activity Modal
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [newActivity, setNewActivity] = useState({
    activityType: "",
    remarks: "",
    activityDate: "",
    nextFollowUpDate: "",
  });
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [creatingActivity, setCreatingActivity] = useState(false);

  const fetchLeads = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getLeads(page, 6);
      if (response.success && response.data) {
        setLeads(response.data.leads);
        setTotalPages(response.data.totalPages || 1);
        setTotalLeads(response.data.total || 0);
        setCurrentPage(response.data.page || page);
      } else {
        setError(response.message || "Failed to fetch leads");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      setError("Failed to fetch leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchLeads(newPage);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  const openDeleteModal = (lead: Lead) => {
    setLeadToDelete(lead);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteLead = async () => {
    if (leadToDelete) {
      try {
        await apiService.deleteLead(leadToDelete._id);
        toast({
          title: "Success",
          description: "Lead deleted successfully",
        });
        fetchLeads(currentPage);
      } catch (error) {
        console.error("Error deleting lead:", error);
        toast({
          title: "Error",
          description: "Failed to delete lead",
          variant: "destructive",
        });
      } finally {
        setIsDeleteModalOpen(false);
        setLeadToDelete(null);
      }
    }
  };

  const cancelDeleteLead = () => {
    setIsDeleteModalOpen(false);
    setLeadToDelete(null);
  };

  // 🔹 Fetch lead activities
  const openActivityModal = async (lead: Lead) => {
    setSelectedLead(lead);
    setIsActivityModalOpen(true);
    setLoadingActivities(true);
    try {
      const res = await apiService.getLeadActivities(lead._id);
      if (res.success && res.data) {
        setActivities(res.data);
      } else {
        setActivities([]);
      }
    } catch (err) {
      console.error("Error fetching activities", err);
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  // 🔹 Create new activity
  const handleCreateActivity = async () => {
    if (!selectedLead) return;

    // ✅ Create a clean payload (omit empty nextFollowUpDate)
    const payload: any = {
      activityType: newActivity.activityType,
      remarks: newActivity.remarks,
      activityDate: newActivity.activityDate,
    };

    if (newActivity.nextFollowUpDate) {
      payload.nextFollowUpDate = newActivity.nextFollowUpDate;
    }

    // ✅ Basic validation
    if (!payload.activityType || !payload.remarks) {
      toast({
        title: "Validation error",
        description: "Please select activity type and add remarks.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreatingActivity(true);
      const res = await apiService.createLeadActivity(
        selectedLead._id,
        payload
      );

      if (res.success) {
        toast({
          title: "Activity Added",
          description: "New activity created successfully.",
        });
        setNewActivity({
          activityType: "",
          remarks: "",
          activityDate: "",
          nextFollowUpDate: "",
        });

        // Refresh activity list
        const updated = await apiService.getLeadActivities(selectedLead._id);
        setActivities(updated.data || []);
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to add activity",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setCreatingActivity(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // 🔹 Delete Activity
  const handleDeleteActivity = async (activityId: string) => {
    if (!selectedLead) return;

    try {
      const confirmed = confirm(
        "Are you sure you want to delete this activity?"
      );
      if (!confirmed) return;

      const res = await apiService.deleteLeadActivity(
        selectedLead._id,
        activityId
      );

      if (res.success) {
        toast({
          title: "Deleted",
          description: "Activity removed successfully.",
        });
        // Refresh activities after deletion
        const updated = await apiService.getLeadActivities(selectedLead._id);
        setActivities(updated.data || []);
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to delete activity",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong while deleting activity",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Leads ({totalLeads})
            </h1>
            <p className="text-muted-foreground">
              Manage and view all leads in the system.
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Area of Interest</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No leads found.
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow key={lead._id}>
                      <TableCell>{lead.fullName}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone || "N/A"}</TableCell>
                      <TableCell>{lead.areaOfInterest || "N/A"}</TableCell>
                      <TableCell>
                        {lead.message ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Lead Message</DialogTitle>
                                <DialogDescription>
                                  Message from {lead.fullName}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4 p-4 bg-muted rounded-lg">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                  {lead.message}
                                </p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>{formatDate(lead.createdAt)}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-semibold",
                            lead.contacted
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                          )}
                        >
                          {lead.contacted ? "Contacted" : "Pending"}
                        </span>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => openDeleteModal(lead)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {/* 🔹 View Activities Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => openActivityModal(lead)}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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

        {/* 🗑️ Delete Confirmation Dialog */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete Confirmation</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-semibold">{leadToDelete?.fullName}</span>?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={cancelDeleteLead}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteLead}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 📋 Activity Modal */}
        {/* 📋 Activity Modal */}
        <Dialog
          open={isActivityModalOpen}
          onOpenChange={setIsActivityModalOpen}
        >
          <DialogContent className="max-w-5xl w-full p-0 overflow-hidden">
            <div className="grid md:grid-cols-2 h-[85vh]">
              {/* LEFT: Activity List */}
              <div className="border-r bg-muted/20 p-6 overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    Lead — {selectedLead?.fullName}  
                  </DialogTitle>
                  <DialogDescription>
                    Track progress, calls, meetings, and follow-ups.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                  {loadingActivities ? (
                    <div className="text-center text-sm text-muted-foreground py-10">
                      Loading activities...
                    </div>
                  ) : activities.length > 0 ? (
                    activities.map((act) => (
                      <div
                        key={act._id}
                        className="p-4 rounded-xl border bg-white dark:bg-neutral-900 hover:shadow-md transition"
                      >
                        <div className="flex justify-end">
                        <button
                          onClick={() => handleDeleteActivity(act._id)}
                          className=" right-3 text-muted-foreground hover:text-destructive transition"
                          title="Delete activity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        </div>
                      
                        <div className="flex justify-between items-center mb-1">
                          <span className="capitalize text-sm font-semibold text-primary">
                            {act.activityType.replace("_", " ")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(act.activityDate)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {act.remarks}
                        </p>
                     
                        <div className="flex justify-between items-center">
                        {act.nextFollowUpDate && (
                          <p className="text-xs text-blue-600 dark:text-blue-300">
                            Next follow-up: {formatDate(act.nextFollowUpDate)}
                          </p>
                        )}
                        {act.counselorId && (
                          <p className="text-xs text-blue-600 dark:text-blue-300">
                            Counselor: {act.counselorId.firstName}
                          </p>
                        )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-sm text-muted-foreground py-10">
                      No activities found yet.
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Create Activity Form */}
              <div className="p-6 bg-background">
                <h3 className="text-lg font-semibold mb-3">Add New Activity</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Log a new contact or update the lead’s follow-up history.
                </p>

                <div className="space-y-4">
                  <Select
                    onValueChange={(v) =>
                      setNewActivity({ ...newActivity, activityType: v })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Activity Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "contacted",
                        "follow_up",
                        "meeting_scheduled",
                        "meeting_completed",
                        "interested",
                        "not_interested",
                        "converted",
                        "closed",
                        // "other",
                      ].map((t) => (
                        <SelectItem key={t} value={t}>
                          {t.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Textarea
                    placeholder="Enter remarks (min 5 characters)"
                    value={newActivity.remarks}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        remarks: e.target.value,
                      })
                    }
                    rows={8}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Activity Date
                      </label>
                      <Input
                        type="date"
                        value={newActivity.activityDate}
                        onChange={(e) =>
                          setNewActivity({
                            ...newActivity,
                            activityDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Next Follow-up Date
                      </label>
                      <Input
                        type="date"
                        value={newActivity.nextFollowUpDate}
                        onChange={(e) =>
                          setNewActivity({
                            ...newActivity,
                            nextFollowUpDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateActivity}
                    disabled={creatingActivity}
                    className="w-full mt-4"
                  >
                    {creatingActivity ? "Adding..." : "Add Activity"}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Leads;
