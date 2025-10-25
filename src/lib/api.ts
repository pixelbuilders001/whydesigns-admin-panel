const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  profilePicture: string;
  roleId: {
    _id: string;
    name: string;
  };
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    refreshToken: string;
  };
}


interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface UsersResponse {
  success: boolean;
  message: string;
  data: User[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  fullName: string;
  id: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  authorId: Author;
  tags: string[];
  status: string;
  publishedAt: string;
  viewCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  readTime: number;
  id: string;
}

export interface CreateBlogResponse {
  success: boolean;
  message: string;
  data: Blog;
}
export interface CreateBlogResponse {
  success: boolean;
  message: string;
  data: Blog;
}

interface GetBlogsResponse {
  success: boolean;
  message: string;
  data: Blog[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export interface Counselor {
  _id: string;
  fullName: string;
  title: string;
  yearsOfExperience: number;
  bio: string;
  avatarUrl?: string;
  specialties: string[];
  isActive: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
  id: number;
  experienceLevel: string;
}
export interface CounselorsResponse {
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

export interface CreateCounselorRequest {
  fullName: string;
  title: string;
  yearsOfExperience: number;
  bio: string;
  avatarUrl?: string;
  specialties: string[];
  isActive: boolean;
  rating: number;
  email:string;
}

export interface CreateCounselorResponse {
  success: boolean;
  message: string;
  data: Counselor;
}

export interface UpdateCounselorResponse {
  success: boolean;
  message: string;
  data: Counselor;
}
export interface UpdateBlogResponse {
  success: boolean;
  message: string;
  data: Blog;
}

export interface Booking {
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

export interface BookingsResponse {
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

export interface CreateBookingRequest {
  counselorId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  bookingDate: string;
  bookingTime: string;
  duration?: number;
  discussionTopic?: string;
  meetingLink?: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled" | "expired";
}

export interface UpdateBookingRequest {
  counselorId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  bookingDate?: string;
  bookingTime?: string;
  duration?: number;
  discussionTopic?: string;
  meetingLink?: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled" | "expired";
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  data: Booking;
}

export interface UpdateBookingResponse {
  success: boolean;
  message: string;
  data: Booking;
}

export interface UpdateBookingRequest {
  counselorId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  bookingDate?: string;
  bookingTime?: string;
  duration?: number;
  discussionTopic?: string;
  meetingLink?: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled" | "expired";
}
export interface DeleteCounselorResponse {
  success: boolean;
  message: string;
}

export interface PDFMaterial {
  _id: string;
  name: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  tags: string[];
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
  downloadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PDFResponse {
  success: boolean;
  message: string;
  data: PDFMaterial[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreatePDFResponse {
  success: boolean;
  message: string;
  data: PDFMaterial;
}

export interface UpdatePDFResponse {
  success: boolean;
  message: string;
  data: PDFMaterial;
}

export interface DeletePDFResponse {
  success: boolean;
  message: string;
}


interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data: {};
}

export interface Reel {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  fileSize: number;
  uploadedBy: string;
  tags: string[];
  category: string;
  viewCount: number;
  likeCount: number;
  isPublished: boolean;
  isActive: boolean;
  displayOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  fileSizeFormatted: string;
  durationFormatted: string;
  id: string;
}

export interface CreateReelRequest {
  title: string;
  description: string;
  video: File;
  thumbnail: File; 
  tags: string[];
  duration: number;
  fileSize: number;
  category?: string;
}

export interface CreateReelResponse {
  success: boolean;
  message: string;
  data: Reel;
}

export interface ReelsResponse {
  success: boolean;
  message: string;
  data: Reel[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SocialMedia {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
}

export interface CreateTestimonialRequest {
  name: string;
  email: string;
  city: string;
  state: string;
  country: string;
  rating: number;
  message: string;
  designation: string;
  company: string;
  profileImage: string;
  socialMedia: SocialMedia;
}

export interface Testimonial {
  _id: string;
  userId: string;
  name: string;
  email: string;
  city: string;
  state: string;
  country: string;
  rating: number;
  message: string;
  designation: string;
  company: string;
  profileImage: string;
  isFavorite: boolean;
  isApproved: boolean;
  isActive: boolean;
  socialMedia: SocialMedia;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  fullLocation: string;
}

export interface CreateTestimonialResponse {
  success: boolean;
  message: string;
  data: Testimonial;
}

export interface TestimonialResponse {
  success: boolean;
  message: string;
  data: Testimonial[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export interface Lead {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  areaOfInterest: string;
  message: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    users: {
      total: number;
      active: number;
      inactive: number;
    };
    blogs: {
      total: number;
      published: number;
      draft: number;
      totalViews: number;
    };
    testimonials: {
      total: number;
      approved: number;
      pending: number;
    };
    reels: {
      total: number;
      published: number;
      totalViews: number;
      totalLikes: number;
    };
    videos: {
      total: number;
      published: number;
      totalViews: number;
      totalLikes: number;
    };
    leads: {
      total: number;
      active: number;
    };
    materials: {
      total: number;
      totalDownloads: number;
    };
    bookings: {
      total: number;
      confirmed: number;
      pending: number;
    };
    counselors: {
      total: number;
      active: number;
    };
    categories: {
      total: number;
      active: number;
    };
    timestamp: string;
  };
}

export interface LeadsResponse {
  success: boolean;
  message: string;
  data: {
    leads: Lead[];
    total: number;
    page: number;
    totalPages: number;
  };
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
   
    const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
          ...options.headers,
        },
        ...options,
      };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async signin(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse['data']>('/api/v1/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(refreshToken: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return this.request<RefreshTokenResponse['data']>('/api/v1/users/refresh-token', {
      method: 'POST',
      body: JSON.stringify(refreshToken),
    });
  }

  async getUsers(page: number = 1, limit: number = 10): Promise<UsersResponse> {
    return this.request<UsersResponse[]>(`/api/v1/users?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }
  async getBlogs(page: number = 1, limit: number = 10): Promise<GetBlogsResponse> {
    return this.request<GetBlogsResponse>(`/api/v1/blogs?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }
  async createBlog(formData: FormData): Promise<CreateBlogResponse> {
    const url = `${this.baseURL}/api/v1/blogs`;

    const config: RequestInit = {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - let browser set it with boundary
        ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  async updateBlog(id: string, formData: FormData): Promise<UpdateBlogResponse> {
    const url = `${this.baseURL}/api/v1/blogs/${id}`;

    const config: RequestInit = {
      method: 'PATCH',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - let browser set it with boundary
        ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async deleteBlog(id: string): Promise<UpdateBlogResponse> {
    const url = `${this.baseURL}/api/v1/blogs/${id}`;

    const config: RequestInit = {
      method: 'DELETE',
      headers: {
        // Don't set Content-Type for FormData - let browser set it with boundary
        ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
 
  async getCounselors(page: number = 1, limit: number = 10): Promise<CounselorsResponse> {
    const url = `${this.baseURL}/api/v1/counselors?page=${page}&limit=${limit}`;
  
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
      },
    };
  
    try {
      const response = await fetch(url, config);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
  
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async createCounselor(formData: FormData): Promise<CreateCounselorResponse> {
    const url = `${this.baseURL}/api/v1/counselors`;

    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async updateCounselor(id: number, formData: FormData): Promise<UpdateCounselorResponse> {
    const url = `${this.baseURL}/api/v1/counselors/${id}`;

    const config: RequestInit = {
      method: 'PATCH',
      headers: {
        ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  async deleteCounselor(id: number): Promise<DeleteCounselorResponse> {
    const url = `${this.baseURL}/api/v1/counselors/${id}`;

    const config: RequestInit = {
      method: 'DELETE',
      headers: {
        ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
// Add to your apiService class
async getBookings(queryParams: string): Promise<BookingsResponse> {
  const url = `${this.baseURL}/api/v1/bookings?${queryParams}`;

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

async createBooking(bookingData: CreateBookingRequest): Promise<CreateBookingResponse> {
  const url = `${this.baseURL}/api/v1/bookings`;

  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
    body: JSON.stringify(bookingData),
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

async updateBooking(id: string, bookingData: UpdateBookingRequest): Promise<UpdateBookingResponse> {
  const url = `${this.baseURL}/api/v1/bookings/${id}`;

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
    body: JSON.stringify(bookingData),
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

async confirmBooking(id: string, meetingLink: string): Promise<UpdateBookingResponse> {
  const url = `${this.baseURL}/api/v1/bookings/${id}/confirm`;

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
    body: JSON.stringify({ meetingLink }),
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// async getMaterials(page: number = 1, limit: number = 10): Promise<PDFResponse> {
//   const url = `${this.baseURL}/api/v1/materials?page=${page}&limit=${limit}`;

//   const config: RequestInit = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
//     },
//   };

//   try {
//     const response = await fetch(url, config);
//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || `HTTP error! status: ${response.status}`);
//     }

//     return data;
//   } catch (error) {
//     console.error('API request failed:', error);
//     throw error;
//   }
// }
async getMaterials(queryParams: string): Promise<PDFResponse> {
  const url = `${this.baseURL}/api/v1/materials?${queryParams}`;

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
async createMaterial(formData: FormData): Promise<CreatePDFResponse> {
  const url = `${this.baseURL}/api/v1/materials`;

  const config: RequestInit = {
    method: 'POST',
    headers: {
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
    body: formData,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
async updateMaterial(id: string, materialData: any): Promise<UpdatePDFResponse> {
    const url = `${this.baseURL}/api/v1/materials/${id}`;

    const config: RequestInit = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
        },
        body: JSON.stringify(materialData),
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

async deleteMaterial(id: string): Promise<DeletePDFResponse> {
    const url = `${this.baseURL}/api/v1/materials/${id}`;

    const config: RequestInit = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
        },
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}
async deactivateMaterial(id: string): Promise<ApiResponse<PDFMaterial>> {
  const url = `${this.baseURL}/api/v1/materials/${id}/deactivate`;

  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
  async changePassword(credentials: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    return this.request<ChangePasswordResponse>('/api/v1/users/change-password', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
async getReels(page: number,limit:number): Promise<ReelsResponse> {
 
   const url = `${this.baseURL}/api/v1/reels?page=${page}&limit=${limit}`;

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

async createReel(formData: FormData): Promise<CreateReelResponse> {
  const url = `${this.baseURL}/api/v1/reels`;

  const config: RequestInit = {
    method: 'POST',
    headers: {
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
    body: formData,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

async updateReel(id: string, formData: FormData): Promise<CreateReelResponse> {
  const url = `${this.baseURL}/api/v1/reels/${id}`;

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      // Don’t manually set Content-Type for FormData
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
    body: formData,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error updating reel:', error);
    throw error;
  }
}

async deleteReel(id: string): Promise<{ success: boolean; message: string }> {
  const url = `${this.baseURL}/api/v1/reels/${id}`;

  const config: RequestInit = {
    method: 'DELETE',
    headers: {
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error deleting reel:', error);
    throw error;
  }
}


async publishReel(id: string): Promise<{ success: boolean; message: string }> {
  const url = `${this.baseURL}/api/v1/reels/${id}/publish`;

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error publishing reel:', error);
    throw error;
  }
}

async unpublishReel(id: string): Promise<{ success: boolean; message: string }> {
  const url = `${this.baseURL}/api/v1/reels/${id}/unpublish`;

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error unpublishing reel:', error);
    throw error;
  }
}


// Create Testimonial
async createTestimonial(payload: CreateTestimonialRequest): Promise<CreateTestimonialResponse> {
  const url = `${this.baseURL}/api/v1/testimonials`;

  const config: RequestInit = {
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
    body: payload,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Get Testimonials
async getTestimonials(page: number = 1, limit: number = 2): Promise<TestimonialResponse> {
  
      const url = `${this.baseURL}/api/v1/testimonials?page=${page}&limit=${limit}`;

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Update Testimonial
async updateTestimonial(id: string, payload: Partial<CreateTestimonialRequest>): Promise<CreateTestimonialResponse> {
  const url = `${this.baseURL}/api/v1/testimonials/${id}`;

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      // 'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
    body: payload,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Delete Testimonial
async deleteTestimonial(id: string): Promise<{ success: boolean; message: string }> {
  const url = `${this.baseURL}/api/v1/testimonials/${id}`;

  const config: RequestInit = {
    method: 'DELETE',
    headers: {
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

async getLeads(page: number = 1, limit: number = 10): Promise<LeadsResponse> {
  return this.request<LeadsResponse>(`/api/v1/leads?page=${page}&limit=${limit}`, {
    method: 'GET',
  });
}

async publishBlog(id: string): Promise<{ success: boolean; message: string }> {
  const url = `${this.baseURL}/api/v1/blogs/${id}/publish`;

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error publishing blog:', error);
    throw error;
  }
}

async unpublishBlog(id: string): Promise<{ success: boolean; message: string }> {
  const url = `${this.baseURL}/api/v1/blogs/${id}/unpublish`;

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error unpublishing blog:', error);
    throw error;
  }
}


async getDashboardSummary(): Promise<DashboardResponse> {
  return this.request<DashboardResponse>('/api/v1/summary/dashboard', {
    method: 'GET',
  });
}

async createVideo(formData: FormData): Promise<CreateReelResponse> {
  const url = `${this.baseURL}/api/v1/videos`;

  const config: RequestInit = {
    method: 'POST',
    headers: {
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
    body: formData,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}


async getVideos(page: number,limit:number): Promise<ReelsResponse> {
 
  const url = `${this.baseURL}/api/v1/videos/all/videos?page=${page}&limit=${limit}`;

 const config: RequestInit = {
   method: 'GET', 
   headers: {
     'Content-Type': 'application/json',
     ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
   },
 };

 try {
   const response = await fetch(url, config);
   const data = await response.json();

   if (!response.ok) {
     throw new Error(data.message || `HTTP error! status: ${response.status}`);
   }

   return data;
 } catch (error) {
   console.error('API request failed:', error);
   throw error;
 }
}



async updateVideo(id: string, formData: FormData): Promise<CreateReelResponse> {
 const url = `${this.baseURL}/api/v1/videos/${id}`;

 const config: RequestInit = {
   method: 'PATCH',
   headers: {
     // Don’t manually set Content-Type for FormData
     ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
   },
   body: formData,
 };

 try {
   const response = await fetch(url, config);
   const data = await response.json();

   if (!response.ok) {
     throw new Error(data.message || `HTTP error! status: ${response.status}`);
   }

   return data;
 } catch (error) {
   console.error('Error updating reel:', error);
   throw error;
 }
}

async deleteVideo(id: string): Promise<{ success: boolean; message: string }> {
 const url = `${this.baseURL}/api/v1/videos/${id}`;

 const config: RequestInit = {
   method: 'DELETE',
   headers: {
     ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
   },
 };

 try {
   const response = await fetch(url, config);
   const data = await response.json();

   if (!response.ok) {
     throw new Error(data.message || `HTTP error! status: ${response.status}`);
   }

   return data;
 } catch (error) {
   console.error('Error deleting reel:', error);
   throw error;
 }
}


async publishVideo(id: string): Promise<{ success: boolean; message: string }> {
 const url = `${this.baseURL}/api/v1/videos/${id}/publish`;

 const config: RequestInit = {
   method: 'PATCH',
   headers: {
     'Content-Type': 'application/json',
     ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
   },
 };

 try {
   const response = await fetch(url, config);
   const data = await response.json();

   if (!response.ok) {
     throw new Error(data.message || `HTTP error! status: ${response.status}`);
   }

   return data;
 } catch (error) {
   console.error('Error publishing reel:', error);
   throw error;
 }
}

async unpublishVideo(id: string): Promise<{ success: boolean; message: string }> {
 const url = `${this.baseURL}/api/v1/videos/${id}/unpublish`;

 const config: RequestInit = {
   method: 'PATCH',
   headers: {
     'Content-Type': 'application/json',
     ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
   },
 };

 try {
   const response = await fetch(url, config);
   const data = await response.json();

   if (!response.ok) {
     throw new Error(data.message || `HTTP error! status: ${response.status}`);
   }

   return data;
 } catch (error) {
   console.error('Error unpublishing reel:', error);
   throw error;
 }
}
async publishTestimonial(id: string): Promise<{ success: boolean; message: string }> {
  const url = `${this.baseURL}/api/v1/testimonials/${id}/publish`;
 
  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
  };
 
  try {
    const response = await fetch(url, config);
    const data = await response.json();
 
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
 
    return data;
  } catch (error) {
    console.error('Error publishing reel:', error);
    throw error;
  }
 }
 
 async unpublishTestimonial(id: string): Promise<{ success: boolean; message: string }> {
  const url = `${this.baseURL}/api/v1/testimonials/${id}/unpublish`;
 
  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
  };
 
  try {
    const response = await fetch(url, config);
    const data = await response.json();
 
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
 
    return data;
  } catch (error) {
    console.error('Error unpublishing reel:', error);
    throw error;
  }
 }

 async publishCounselor(id: string): Promise<{ success: boolean; message: string }> {
  const url = `${this.baseURL}/api/v1/counselors/${id}/publish`;
 
  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
  };
 
  try {
    const response = await fetch(url, config);
    const data = await response.json();
 
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
 
    return data;
  } catch (error) {
    console.error('Error publishing reel:', error);
    throw error;
  }
 }
 
 async unpublishCounselor(id: string): Promise<{ success: boolean; message: string }> {
  const url = `${this.baseURL}/api/v1/counselors/${id}/unpublish`;
 
  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem("userToken") && { Authorization: `Bearer ${localStorage.getItem("userToken")}` }),
    },
  };
 
  try {
    const response = await fetch(url, config);
    const data = await response.json();
 
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
 
    return data;
  } catch (error) {
    console.error('Error unpublishing reel:', error);
    throw error;
  }
 }





  async getHealth() {
    return this.request('/health');
  }


 
}



// Create and export a singleton instance
export const apiService = new ApiService(API_BASE_URL);
export type { LoginRequest, UsersResponse, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, UpdateBlogResponse, PDFMaterial, PDFResponse, CreatePDFResponse, UpdatePDFResponse, DeletePDFResponse, CreateBlogResponse,DashboardResponse };
export default apiService;
