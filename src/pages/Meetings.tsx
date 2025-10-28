import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ExternalLink, Plus, Search, User, Video, Loader2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";

interface Booking {
  _id: string;
  counselorId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  bookingDate: string;
  bookingTime: string;
  duration: number;
  discussionTopic: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "expired";
  meetingLink: string;
  confirmationEmailSent: boolean;
  reminderEmailSent: boolean;
  createdAt: string;
  updatedAt: string;
  bookingDateTime: string;
  endDateTime: string;
  isUpcoming: boolean;
  isPast: boolean;
  id: string;
  counselor?: {
    _id: string;
    fullName: string;
    title: string;
    avatarUrl?: string;
  };
}

interface BookingsResponse {
  success: boolean;
  message: string;
  data: Booking[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface Counselor {
  _id: string;
  fullName: string;
  title: string;
  yearsOfExperience: number;
  specialties: string[];
  isActive: boolean;
}

interface CounselorsResponse {
  success: boolean;
  message: string;
  data: Counselor[];
}

const Meetings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [approvingBooking, setApprovingBooking] = useState<Booking | null>(null);
  const [meetingLinkInput, setMeetingLinkInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [formData, setFormData] = useState({
    counselorId: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    bookingDate: "",
    bookingTime: "",
    duration: 60,
    discussionTopic: "",
    meetingLink: "",
    status: "pending" as "pending" | "confirmed" | "completed" | "cancelled" | "expired"
  });
  const { toast } = useToast();

 // Build query parameters for API
 const buildQueryParams = (page: number = 1) => {
  const params: Record<string, string> = {
    page: page.toString(),
    limit: "8",

  };

  if (searchTerm) params.search = searchTerm;
  if (statusFilter !== "all") params.status = statusFilter;


  return new URLSearchParams(params).toString();
};


  // Fetch bookings from API
  const fetchBookings = async (page: number = 1) => {
    try {
      setLoading(true);
      const queryParams = buildQueryParams(page);
      const response: BookingsResponse = await apiService.getBookings(queryParams);
      
      if (response.success) {
        setBookings(response.data);
        setTotalPages(response.meta?.totalPages || 1);
        setTotalBookings(response.meta?.total || 0);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBookings(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter])
  // Fetch counselors from API
  const fetchCounselors = async () => {
    try {
      const response: CounselorsResponse = await apiService.getCounselors(1, 100);
      if (response.success) {
        setCounselors(response.data);
      }
    } catch (error) {
      console.error('Error fetching counselors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch counselors",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // fetchBookings();
    fetchCounselors();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchBookings(newPage);
    }
  };

  const resetForm = () => {
    setFormData({
      counselorId: "",
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      bookingDate: "",
      bookingTime: "",
      duration: 60,
      discussionTopic: "",
      meetingLink: "",
      status: "pending"
    });
  };

  const handleAddBooking = async () => {
    if (!formData.counselorId || !formData.guestName || !formData.guestEmail || !formData.bookingDate || !formData.bookingTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setFormLoading(true);
      const response = await apiService.createBooking({
        counselorId: formData.counselorId,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        duration: formData.duration,
        discussionTopic: formData.discussionTopic,
        meetingLink: formData.meetingLink,
        status: formData.status
      });

      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setIsAddDialogOpen(false);
        resetForm();
        fetchBookings(currentPage);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditBooking = async () => {
    if (!formData.counselorId || !formData.guestName || !formData.guestEmail || !formData.bookingDate || !formData.bookingTime || !editingBooking) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setFormLoading(true);
      const response = await apiService.updateBooking(editingBooking._id, {
        counselorId: formData.counselorId,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        duration: formData.duration,
        discussionTopic: formData.discussionTopic,
        meetingLink: formData.meetingLink,
        status: formData.status
      });

      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setIsEditDialogOpen(false);
        setEditingBooking(null);
        resetForm();
        fetchBookings(currentPage);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      const response = await apiService.updateBooking(id, {
        status: "cancelled"
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Booking cancelled successfully",
        });
        fetchBookings(currentPage);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      counselorId: booking.counselorId,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      bookingDate: booking.bookingDate.split('T')[0],
      bookingTime: booking.bookingTime,
      duration: booking.duration,
      discussionTopic: booking.discussionTopic,
      meetingLink: booking.meetingLink,
      status: booking.status
    });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  // const filteredBookings = bookings.filter(booking => {
  //   const matchesSearch = 
  //     booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     booking.discussionTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     (booking.counselor?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
  //   const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
  //   return matchesSearch && matchesStatus;
  // });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCounselorName = (counselorId: string) => {
    const counselor = counselors.find(c => c._id === counselorId);
    return counselor ? counselor.fullName : "Unknown Counselor";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const openApproveDialog = (booking: Booking) => {
    setApprovingBooking(booking);
    setMeetingLinkInput("");
    setIsApproveDialogOpen(true);
  };

  const handleApproveBooking = async () => {
    if (!approvingBooking || !meetingLinkInput.trim()) {
      toast({
        title: "Error",
        description: "Please provide a meeting link",
        variant: "destructive",
      });
      return;
    }

    try {
      setFormLoading(true);
      await apiService.confirmBooking(approvingBooking._id, meetingLinkInput.trim());
      
      toast({
        title: "Success",
        description: "Booking confirmed successfully",
      });
      
      setIsApproveDialogOpen(false);
      setApprovingBooking(null);
      setMeetingLinkInput("");
      
      // Refresh bookings
      await fetchBookings(currentPage);
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast({
        title: "Error",
        description: "Failed to confirm booking",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };



  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meetings ({totalBookings})</h1>
            <p className="text-muted-foreground">
              Manage your consultation and guidance sessions.
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Schedule New Meeting</DialogTitle>
                <DialogDescription>
                  Create a new booking session with a counselor.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="counselor">Counselor *</Label>
                  <Select value={formData.counselorId} onValueChange={(value) => setFormData({ ...formData, counselorId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a counselor" />
                    </SelectTrigger>
                    <SelectContent>
                      {counselors.map((counselor) => (
                        <SelectItem key={counselor._id} value={counselor._id}>
                          {counselor.fullName} - {counselor.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="guestName">Guest Name *</Label>
                  <Input
                    id="guestName"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="Enter guest name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="guestEmail">Guest Email *</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={formData.guestEmail}
                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                    placeholder="Enter guest email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="guestPhone">Guest Phone</Label>
                  <Input
                    id="guestPhone"
                    value={formData.guestPhone}
                    onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                    placeholder="Enter guest phone number"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bookingDate">Date *</Label>
                    <Input
                      id="bookingDate"
                      type="date"
                      value={formData.bookingDate}
                      onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bookingTime">Time *</Label>
                    <Input
                      id="bookingTime"
                      type="time"
                      value={formData.bookingTime}
                      onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                    placeholder="Duration in minutes"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discussionTopic">Discussion Topic</Label>
                  <textarea
                    id="discussionTopic"
                    value={formData.discussionTopic}
                    onChange={(e) => setFormData({ ...formData, discussionTopic: e.target.value })}
                    placeholder="Enter discussion topic"
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="meetingLink">Meeting Link</Label>
                  <Input
                    id="meetingLink"
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    placeholder="Enter meeting link (Zoom, Google Meet, etc.)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: "pending" | "confirmed" | "completed" | "cancelled" | "expired") => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBooking} disabled={formLoading}>
                  {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Schedule Meeting
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4">
          {/* <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by guest name, email, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={setStatusFilter}
            className="px-3 py-2 border border-input bg-background rounded-md"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select> */}
           {/* <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
        </div>

        {/* Loading state */}
        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading meetings...</span>
            </CardContent>
          </Card>
        )}

        {/* Bookings table */}
        {!loading && (
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Counselor</TableHead>
                    <TableHead>Date & Time</TableHead>
                    {/* <TableHead>Duration</TableHead>? */}
                    <TableHead>Topic</TableHead>
                    <TableHead>Meeting Link</TableHead>
                    <TableHead>Status</TableHead>
                    {/* <TableHead className="w-[120px]">Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.guestName}</div>
                          <div className="text-sm text-muted-foreground">{booking.guestEmail}</div>
                          {booking.guestPhone && (
                            <div className="text-sm text-muted-foreground">{booking.guestPhone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {booking.counselorId===null?'N.A':booking.counselorId.fullName}
                          {/* {booking.counselorId.fullName} */}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(booking.bookingDate)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {booking.bookingTime}
                          </div>
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        {booking.duration} min
                      </TableCell> */}
                      <TableCell className="max-w-[200px] truncate">
                        {booking.discussionTopic}
                      </TableCell>
                      <TableCell>
                        {booking.meetingLink && booking.status === "confirmed" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(booking.meetingLink, '_blank')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">No link</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => openEditDialog(booking)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {booking.status === "pending" || booking.status === "confirmed" ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openApproveDialog(booking)}
                            
                            >
                              Approve
                            </Button>
                          ) : null}
                        </div>
                      </TableCell> 
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {bookings.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No meetings found</p>
                  <p className="text-muted-foreground">Try adjusting your search or schedule a new meeting.</p>
                </div>
              )}

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
              <DialogTitle>Edit Meeting</DialogTitle>
              <DialogDescription>
                Update the meeting details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-counselor">Counselor *</Label>
                <Select value={formData.counselorId} onValueChange={(value) => setFormData({ ...formData, counselorId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a counselor" />
                  </SelectTrigger>
                  <SelectContent>
                    {counselors.map((counselor) => (
                      <SelectItem key={counselor._id} value={counselor._id}>
                        {counselor.fullName} - {counselor.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-guestName">Guest Name *</Label>
                <Input
                  id="edit-guestName"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  placeholder="Enter guest name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-guestEmail">Guest Email *</Label>
                <Input
                  id="edit-guestEmail"
                  type="email"
                  value={formData.guestEmail}
                  onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                  placeholder="Enter guest email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-guestPhone">Guest Phone</Label>
                <Input
                  id="edit-guestPhone"
                  value={formData.guestPhone}
                  onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                  placeholder="Enter guest phone number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-bookingDate">Date *</Label>
                  <Input
                    id="edit-bookingDate"
                    type="date"
                    value={formData.bookingDate}
                    onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-bookingTime">Time *</Label>
                  <Input
                    id="edit-bookingTime"
                    type="time"
                    value={formData.bookingTime}
                    onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-duration">Duration (minutes)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                  placeholder="Duration in minutes"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-discussionTopic">Discussion Topic</Label>
                <textarea
                  id="edit-discussionTopic"
                  value={formData.discussionTopic}
                  onChange={(e) => setFormData({ ...formData, discussionTopic: e.target.value })}
                  placeholder="Enter discussion topic"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-meetingLink">Meeting Link</Label>
                <Input
                  id="edit-meetingLink"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  placeholder="Enter meeting link (Zoom, Google Meet, etc.)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: "pending" | "confirmed" | "completed" | "cancelled" | "expired") => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline"
               onClick={() => setIsEditDialogOpen(false)}
               >
                Cancel
              </Button>
              <Button 
              // onClick={handleEditBooking}
               disabled={formLoading}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Meeting
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Approve Dialog */}
        <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Approve Meeting</DialogTitle>
              <DialogDescription>
                Confirm the meeting with the provided meeting link.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="meetingLink">Meeting Link *</Label>
                <Input
                  id="meetingLink"
                  value={meetingLinkInput}
                  onChange={(e) => setMeetingLinkInput(e.target.value)}
                  placeholder="Enter meeting link (Zoom, Google Meet, etc.)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApproveBooking} disabled={formLoading}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Approve Meeting
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Meetings;