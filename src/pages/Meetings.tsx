import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ExternalLink, Plus, Search, User, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Meeting {
  id: number;
  name: string;
  counselorName: string;
  counselorId: number;
  userName: string;
  userEmail: string;
  meetingLink: string;
  date: string;
  startTime: string;
  status: "Scheduled" | "Completed" | "Expired";
}

interface Counselor {
  id: number;
  name: string;
  designation: string;
  experience: string;
  tags: string[];
}

interface User {
  name: string;
  email: string;
  phone: string;
  gender: string;
}

// Mock data for counselors and users
const counselors: Counselor[] = [
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

const users: User[] = [
  { name: "John Doe", email: "john@example.com", phone: "+1234567890", gender: "Male" },
  { name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", gender: "Female" },
  { name: "Bob Johnson", email: "bob@example.com", phone: "+1234567892", gender: "Male" },
  { name: "Alice Brown", email: "alice@example.com", phone: "+1234567893", gender: "Female" },
  { name: "Charlie Wilson", email: "charlie@example.com", phone: "+1234567894", gender: "Male" },
];

const initialMeetings: Meeting[] = [
  {
    id: 1,
    name: "Fashion Consultation Session",
    counselorName: "Dr. Sarah Johnson",
    counselorId: 1,
    userName: "John Doe",
    userEmail: "john@example.com",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    date: "2024-01-20",
    startTime: "14:00",
    status: "Scheduled"
  },
  {
    id: 2,
    name: "Portfolio Review",
    counselorName: "Michael Chen",
    counselorId: 2,
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    meetingLink: "https://zoom.us/j/123456789",
    date: "2024-01-18",
    startTime: "10:30",
    status: "Completed"
  },
  {
    id: 3,
    name: "Career Guidance Session",
    counselorName: "Emily Rodriguez",
    counselorId: 3,
    userName: "Bob Johnson",
    userEmail: "bob@example.com",
    meetingLink: "https://teams.microsoft.com/meeting",
    date: "2024-01-15",
    startTime: "16:00",
    status: "Expired"
  },
  {
    id: 4,
    name: "Design Workshop",
    counselorName: "Dr. Sarah Johnson",
    counselorId: 1,
    userName: "Alice Brown",
    userEmail: "alice@example.com",
    meetingLink: "https://meet.google.com/xyz-1234-567",
    date: "2024-01-25",
    startTime: "13:00",
    status: "Scheduled"
  },
  {
    id: 5,
    name: "Trend Analysis Session",
    counselorName: "Michael Chen",
    counselorId: 2,
    userName: "Charlie Wilson",
    userEmail: "charlie@example.com",
    meetingLink: "https://zoom.us/j/987654321",
    date: "2024-01-12",
    startTime: "11:00",
    status: "Completed"
  }
];

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    counselorId: "",
    userEmail: "",
    meetingLink: "",
    date: "",
    startTime: "",
    status: "Scheduled" as "Scheduled" | "Completed" | "Expired"
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: "",
      counselorId: "",
      userEmail: "",
      meetingLink: "",
      date: "",
      startTime: "",
      status: "Scheduled"
    });
  };

  const handleAddMeeting = () => {
    if (!formData.name || !formData.counselorId || !formData.userEmail || !formData.meetingLink || !formData.date || !formData.startTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const selectedCounselor = counselors.find(c => c.id === parseInt(formData.counselorId));
    const selectedUser = users.find(u => u.email === formData.userEmail);

    if (!selectedCounselor || !selectedUser) {
      toast({
        title: "Error",
        description: "Please select valid counselor and user.",
        variant: "destructive",
      });
      return;
    }

    const newMeeting: Meeting = {
      id: Math.max(...meetings.map(m => m.id)) + 1,
      name: formData.name,
      counselorName: selectedCounselor.name,
      counselorId: selectedCounselor.id,
      userName: selectedUser.name,
      userEmail: selectedUser.email,
      meetingLink: formData.meetingLink,
      date: formData.date,
      startTime: formData.startTime,
      status: formData.status
    };

    setMeetings([...meetings, newMeeting]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Success",
      description: "Meeting scheduled successfully!",
    });
  };

  const openEditDialog = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      name: meeting.name,
      counselorId: meeting.counselorId.toString(),
      userEmail: meeting.userEmail,
      meetingLink: meeting.meetingLink,
      date: meeting.date,
      startTime: meeting.startTime,
      status: meeting.status
    });
    setIsEditDialogOpen(true);
  };

  const handleEditMeeting = () => {
    if (!formData.name || !formData.counselorId || !formData.userEmail || !formData.meetingLink || !formData.date || !formData.startTime || !editingMeeting) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const selectedCounselor = counselors.find(c => c.id === parseInt(formData.counselorId));
    const selectedUser = users.find(u => u.email === formData.userEmail);

    if (!selectedCounselor || !selectedUser) {
      toast({
        title: "Error",
        description: "Please select valid counselor and user.",
        variant: "destructive",
      });
      return;
    }

    const updatedMeetings = meetings.map(meeting =>
      meeting.id === editingMeeting.id
        ? {
            ...meeting,
            name: formData.name,
            counselorName: selectedCounselor.name,
            counselorId: selectedCounselor.id,
            userName: selectedUser.name,
            userEmail: selectedUser.email,
            meetingLink: formData.meetingLink,
            date: formData.date,
            startTime: formData.startTime,
            status: formData.status
          }
        : meeting
    );

    setMeetings(updatedMeetings);
    setIsEditDialogOpen(false);
    setEditingMeeting(null);
    resetForm();
    toast({
      title: "Success",
      description: "Meeting updated successfully!",
    });
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingMeeting(null);
    resetForm();
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.counselorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || meeting.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>;
      case "Completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case "Expired":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
            <p className="text-muted-foreground">
              Manage your fashion consultation and guidance sessions.
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Schedule New Meeting</DialogTitle>
                <DialogDescription>
                  Create a new meeting session with a counselor and user.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="meeting-name">Meeting Name *</Label>
                  <Input
                    id="meeting-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter meeting name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="counselor">Counselor *</Label>
                  <Select value={formData.counselorId} onValueChange={(value) => setFormData({ ...formData, counselorId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a counselor" />
                    </SelectTrigger>
                    <SelectContent>
                      {counselors.map((counselor) => (
                        <SelectItem key={counselor.id} value={counselor.id.toString()}>
                          {counselor.name} - {counselor.designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user">User *</Label>
                  <Select value={formData.userEmail} onValueChange={(value) => setFormData({ ...formData, userEmail: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.email} value={user.email}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="meeting-link">Meeting Link *</Label>
                  <Input
                    id="meeting-link"
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    placeholder="Enter meeting link (Zoom, Google Meet, etc.)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: "Scheduled" | "Completed" | "Expired") => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMeeting}>Schedule Meeting</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  <Label htmlFor="meeting-name">Meeting Name *</Label>
                  <Input
                    id="meeting-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter meeting name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="counselor">Counselor *</Label>
                  <Select value={formData.counselorId} onValueChange={(value) => setFormData({ ...formData, counselorId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a counselor" />
                    </SelectTrigger>
                    <SelectContent>
                      {counselors.map((counselor) => (
                        <SelectItem key={counselor.id} value={counselor.id.toString()}>
                          {counselor.name} - {counselor.designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user">User *</Label>
                  <Select value={formData.userEmail} onValueChange={(value) => setFormData({ ...formData, userEmail: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.email} value={user.email}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="meeting-link">Meeting Link *</Label>
                  <Input
                    id="meeting-link"
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    placeholder="Enter meeting link (Zoom, Google Meet, etc.)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: "Scheduled" | "Completed" | "Expired") => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button onClick={handleEditMeeting}>Update Meeting</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search meetings, counselors, or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md"
          >
            <option value="all">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        <Card>
         
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meeting Name</TableHead>
                  <TableHead>Counselor</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Meeting Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        {meeting.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {meeting.counselorName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{meeting.userName}</div>
                        <div className="text-sm text-muted-foreground">{meeting.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(meeting.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {meeting.startTime}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(meeting.meetingLink, '_blank')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(meeting.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(meeting)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredMeetings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No meetings found</p>
                <p className="text-muted-foreground">Try adjusting your search or schedule a new meeting.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Meetings;