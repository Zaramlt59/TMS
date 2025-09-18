export interface District {
  id?: number
  name: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface Medium {
  id?: number
  name: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface ManagementType {
  id?: number
  name: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface BlockOffice {
  id?: number
  name: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface Subject {
  id?: number
  name: string
  code?: string
  classes?: string
  created_at?: string
  updated_at?: string
}

export interface SchoolType {
  id?: number
  name: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface Religion {
  id?: number
  name: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface PostingHistory {
  id?: number
  school_name: string
  school_type: string
  medium: string
  management: string
  block_office: string
  district: string
  rd_block?: string
  pincode?: string
  habitation?: string
  habitation_class?: 'Rural' | 'Urban'
  habitation_category?: 'City' | 'Town' | 'Village'
  from_date: string
  to_date?: string
  status?: 'Active' | 'Completed'
  created_at?: string
  updated_at?: string
}

export interface Deputation {
  id?: number
  department_name: string
  designation: string
  joining_date: string
  end_date?: string
  status: 'Active' | 'Completed'
  created_at?: string
  updated_at?: string
}

export interface Attachment {
  id?: number
  department_name: string
  designation: string
  district: string
  rd_block: string
  habitation?: string
  joining_date: string
  end_date?: string
  status: 'Active' | 'Completed'
  created_at?: string
  updated_at?: string
}

export interface School {
  id?: number
  school_id: string
  school_name: string
  school_type: string
  school_level: string
  management: string
  medium: string
  pincode?: string
  district?: string
  rd_block?: string
  school_phone?: string
  school_email?: string
  habitation?: string
  habitation_class?: 'Rural' | 'Urban'
  habitation_category?: 'City' | 'Town' | 'Village'
  block_office: string
  created_at?: string
  updated_at?: string
}

export interface Teacher {
  id?: number
  teacher_ID?: string
  teacher_name: string
  date_of_birth: string
  joining_date: string
  phone_number: string
  email?: string
  social_group: string
  religion: string
  gender: string
  aadhaar_number: string

  subjects_taught: string // JSON string from database
  classes_taught: string // JSON string from database
  school_id: string
  current_school_name: string
  school_name_full?: string
  school_level: string
  management: string
  medium: string
  service_category?: string
  habitation?: string
  pincode?: string
  district?: string
  rd_block?: string
  school_phone?: string
  habitation_class?: 'Rural' | 'Urban'
  habitation_category?: 'City' | 'Town' | 'Village'
  block_office: string
  posting_histories: PostingHistory[]
  deputations: Deputation[]
  attachments: Attachment[]
  created_at?: string
  updated_at?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SchoolListResponse {
  schools: School[]
  pagination: PaginatedResponse<School>
}

export interface TeacherListResponse {
  teachers: Teacher[]
  pagination: PaginatedResponse<Teacher>
}

export interface User {
  id?: number
  username: string
  email: string
  phone?: string
  role: 'super_admin' | 'admin' | 'deo' | 'sdeo' | 'hoi' | 'teacher'
  is_active?: boolean
  school_id?: string
  district?: string
  rd_block?: string
  created_at?: string
  updated_at?: string
}
