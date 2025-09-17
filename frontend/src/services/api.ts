import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
// Local lightweight types for medical records; existing types are imported where available
import type { School, Teacher, District, Medium, ManagementType, BlockOffice, Subject, SchoolType, Religion, ApiResponse } from '../types'

export type MedicalRecord = {
  id: number
  teacher_id: number
  ailment_name: string
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical'
  diagnosis_date?: string | null
  treatment_status?: 'Pending' | 'Ongoing' | 'Completed' | 'Cancelled' | null
  remarks?: string | null
  documents?: string | null
  entered_by_id: number
  created_at: string
  updated_at?: string | null
  teachers?: {
    id: number
    teacher_name: string
    school_id: string
  }
}

export type PaginationInfo = {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = (config.headers as any) || {}
    ;(config.headers as any).Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to refresh token on 401
let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((newToken: string) => {
            original.headers.Authorization = `Bearer ${newToken}`
            resolve(api(original))
          })
        })
      }

      original._retry = true
      isRefreshing = true
      try {
        const csrf = localStorage.getItem('csrf') || ''
        const resp = await axios.post('/api/users/refresh', {}, { withCredentials: true, headers: { 'X-CSRF-Token': csrf } })
        const newToken = resp.data?.data?.token || ''
        const newCsrf = resp.data?.data?.csrf || ''
        if (newToken) localStorage.setItem('token', newToken)
        if (newCsrf) localStorage.setItem('csrf', newCsrf)
        pendingRequests.forEach((cb) => cb(newToken))
        pendingRequests = []
        isRefreshing = false
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (e) {
        isRefreshing = false
        pendingRequests = []
        localStorage.removeItem('token')
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

// Schools API
export const schoolsApi = {
  getAll: (page = 1, limit = 10) => 
    api.get<ApiResponse & { pagination: any }>(`/schools?page=${page}&limit=${limit}`),
  
  getById: (id: string) => 
    api.get<ApiResponse<School>>(`/schools/${id}`),
  
  getBySchoolId: (schoolId: string) => 
    api.get<ApiResponse<School>>(`/schools/school-id/${schoolId}`),
  
  create: (data: School) => 
    api.post<ApiResponse<School>>('/schools', data),
  
  update: (id: string, data: Partial<School>) => 
    api.put<ApiResponse<School>>(`/schools/${id}`, data),
  
  updateBySchoolId: (schoolId: string, data: Partial<School>) => 
    api.put<ApiResponse<School>>(`/schools/school-id/${schoolId}`, data),
  
  delete: (id: string) => 
    api.delete<ApiResponse>(`/schools/${id}`),
  
  deleteBySchoolId: (schoolId: string) => 
    api.delete<ApiResponse>(`/schools/school-id/${schoolId}`),
  
  search: (query: string) => 
    api.get<ApiResponse<School[]>>(`/schools/search?q=${encodeURIComponent(query)}`),
  
  getStats: () => 
    api.get<ApiResponse>('/schools/stats'),
}

// Teachers API
export const teachersApi = {
  getAll: (page = 1, limit = 10) => 
    api.get<ApiResponse & { pagination: any }>(`/teachers?page=${page}&limit=${limit}`),
  
  getById: (id: number) => 
    api.get<ApiResponse<Teacher>>(`/teachers/${id}`),
  
  create: (data: Teacher) => 
    api.post<ApiResponse<Teacher>>('/teachers', data),
  
  update: (id: number, data: Partial<Teacher>) => 
    api.put<ApiResponse<Teacher>>(`/teachers/${id}`, data),
  
  delete: (id: number) => 
    api.delete<ApiResponse>(`/teachers/${id}`),
  
  getBySchool: (schoolId: string) => 
    api.get<ApiResponse<Teacher[]>>(`/teachers/school/${schoolId}`),
  
  search: (query: string) => 
    api.get<ApiResponse<Teacher[]>>(`/teachers/search?q=${encodeURIComponent(query)}`),
  getStats: () =>
    api.get<ApiResponse>(`/teachers/stats`),
}

// Medical Records API
export const medicalRecordsApi = {
  getAll: (page: number = 1, limit: number = 10) =>
    api.get<ApiResponse<MedicalRecord[]> & { pagination: PaginationInfo }>(`/medical-records?page=${page}&limit=${limit}`),

  getTeachersWithoutRecords: () =>
    api.get<ApiResponse<{ id: number; teacher_name: string; school_id: string }[]>>('/medical-records/teachers-without-records'),

  create: (data: { teacherId: number; ailmentName: string; severity: 'Mild'|'Moderate'|'Severe'|'Critical'; diagnosisDate?: string; treatmentStatus?: string; remarks?: string; documents?: string }) =>
    api.post<ApiResponse<MedicalRecord>>('/medical-records', data),

  getByTeacher: (teacherId: number) =>
    api.get<ApiResponse<MedicalRecord[]>>(`/medical-records/${teacherId}`),

  update: (id: number, data: Partial<{ ailmentName: string; severity: 'Mild'|'Moderate'|'Severe'|'Critical'; diagnosisDate?: string; treatmentStatus?: string; remarks?: string; documents?: string }>) =>
    api.put<ApiResponse<MedicalRecord>>(`/medical-records/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse>(`/medical-records/${id}`)
}

export const uploadApi = {
  // Upload medical record file
  uploadMedicalRecord: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<ApiResponse<{
      url: string;
      relativeUrl: string;
      originalName: string;
      size: number;
      filename: string;
    }>>('/uploads/medical-records', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // List all uploaded files
  listFiles: () =>
    api.get<ApiResponse<Array<{
      filename: string;
      url: string;
      relativeUrl: string;
      size: number;
      uploadedAt: string;
    }>>>('/uploads'),

  // Get file info
  getFileInfo: (filename: string) =>
    api.get<ApiResponse<{
      filename: string;
      url: string;
      relativeUrl: string;
      size: number;
      uploadedAt: string;
    }>>(`/uploads/medical-records/${filename}`),

  // Delete uploaded file
  deleteFile: (filename: string) =>
    api.delete<ApiResponse<any>>(`/uploads/medical-records/${filename}`)
}

// Districts API
export const districtsApi = {
  getAll: () =>
    api.get<ApiResponse<District[]>>('/districts'),

  getAllIncludingInactive: () =>
    api.get<ApiResponse<District[]>>('/districts/all'),

  getById: (id: number) =>
    api.get<ApiResponse<District>>(`/districts/${id}`),

  create: (data: District) =>
    api.post<ApiResponse<District>>('/districts', data),

  update: (id: number, data: Partial<District>) =>
    api.put<ApiResponse<District>>(`/districts/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse>(`/districts/${id}`),
  hardDelete: (id: number) =>
    api.delete<ApiResponse>(`/districts/${id}/permanent`),
}

// Mediums API
export const mediumsApi = {
  getAll: () =>
    api.get<ApiResponse<Medium[]>>('/mediums'),

  getAllIncludingInactive: () =>
    api.get<ApiResponse<Medium[]>>('/mediums/all'),

  getActive: () =>
    api.get<ApiResponse<Medium[]>>('/mediums/active'),

  getById: (id: number) =>
    api.get<ApiResponse<Medium>>(`/mediums/${id}`),

  create: (data: Medium) =>
    api.post<ApiResponse<Medium>>('/mediums', data),

  update: (id: number, data: Partial<Medium>) =>
    api.put<ApiResponse<Medium>>(`/mediums/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse>(`/mediums/${id}`),

  hardDelete: (id: number) =>
    api.delete<ApiResponse>(`/mediums/${id}/permanent`),
}

// Management Types API
export const managementTypesApi = {
  getAll: () =>
    api.get<ApiResponse<ManagementType[]>>('/management-types'),

  getActive: () =>
    api.get<ApiResponse<ManagementType[]>>('/management-types/active'),

  getById: (id: number) =>
    api.get<ApiResponse<ManagementType>>(`/management-types/${id}`),

  create: (data: ManagementType) =>
    api.post<ApiResponse<ManagementType>>('/management-types', data),

  update: (id: number, data: Partial<ManagementType>) =>
    api.put<ApiResponse<ManagementType>>(`/management-types/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse>(`/management-types/${id}`),
  hardDelete: (id: number) =>
    api.delete<ApiResponse>(`/management-types/${id}/permanent`),
}

// Block Offices API
export const blockOfficesApi = {
  getAll: () =>
    api.get<ApiResponse<BlockOffice[]>>('/block-offices'),

  getAllIncludingInactive: () =>
    api.get<ApiResponse<BlockOffice[]>>('/block-offices/all'),

  getActive: () =>
    api.get<ApiResponse<BlockOffice[]>>('/block-offices/active'),

  getById: (id: number) =>
    api.get<ApiResponse<BlockOffice>>(`/block-offices/${id}`),

  create: (data: BlockOffice) =>
    api.post<ApiResponse<BlockOffice>>('/block-offices', data),

  update: (id: number, data: Partial<BlockOffice>) =>
    api.put<ApiResponse<BlockOffice>>(`/block-offices/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse>(`/block-offices/${id}`),
  hardDelete: (id: number) =>
    api.delete<ApiResponse>(`/block-offices/${id}/permanent`),
}

// Subjects API
export const subjectsApi = {
  getAll: () =>
    api.get<ApiResponse<Subject[]>>('/subjects'),

  getById: (id: number) =>
    api.get<ApiResponse<Subject>>(`/subjects/${id}`),

  create: (data: Subject) =>
    api.post<ApiResponse<Subject>>('/subjects', data),

  update: (id: number, data: Partial<Subject>) =>
    api.put<ApiResponse<Subject>>(`/subjects/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse>(`/subjects/${id}`),
}

// School Types API
export const schoolTypesApi = {
  getAll: () =>
    api.get<ApiResponse<SchoolType[]>>('/school-types'),

  getAllIncludingInactive: () =>
    api.get<ApiResponse<SchoolType[]>>('/school-types/all'),

  getActive: () =>
    api.get<ApiResponse<SchoolType[]>>('/school-types/active'),

  getById: (id: number) =>
    api.get<ApiResponse<SchoolType>>(`/school-types/${id}`),

  create: (data: SchoolType) =>
    api.post<ApiResponse<SchoolType>>('/school-types', data),

  update: (id: number, data: Partial<SchoolType>) =>
    api.put<ApiResponse<SchoolType>>(`/school-types/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse>(`/school-types/${id}`),

  hardDelete: (id: number) =>
    api.delete<ApiResponse>(`/school-types/${id}/permanent`),
}

// Religions API
export const religionsApi = {
  getAll: () =>
    api.get<ApiResponse<Religion[]>>('/religions'),

  getActive: () =>
    api.get<ApiResponse<Religion[]>>('/religions/active'),

  getById: (id: number) =>
    api.get<ApiResponse<Religion>>(`/religions/${id}`),

  create: (data: Religion) =>
    api.post<ApiResponse<Religion>>('/religions', data),

  update: (id: number, data: Partial<Religion>) =>
    api.put<ApiResponse<Religion>>(`/religions/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse>(`/religions/${id}`),
  hardDelete: (id: number) =>
    api.delete<ApiResponse>(`/religions/${id}/permanent`),
  forceDelete: (id: number) =>
    api.delete<ApiResponse>(`/religions/${id}/force`),
}

// Locations API for cascading dropdowns
export const locationsApi = {
  getDistricts: () =>
    api.get<ApiResponse<{id: number, name: string}[]>>('/locations/districts'),
  
  getRdBlocks: (districtId?: number) =>
    api.get<ApiResponse<{id: number, name: string, district_id: number}[]>>(
      districtId ? `/locations/rd-blocks/${districtId}` : '/locations/rd-blocks'
    ),

  getAllRdBlocks: () =>
    api.get<ApiResponse<{id: number, name: string, district_id: number, is_active: boolean}[]>>('/locations/rd-blocks/all'),

  getActiveRdBlocks: () =>
    api.get<ApiResponse<{id: number, name: string, district_id: number, is_active: boolean}[]>>('/locations/rd-blocks/active'),
  
  getVillages: (rdBlockId?: number) =>
    api.get<ApiResponse<{id: number, name: string, rd_block_id: number}[]>>(
      rdBlockId ? `/locations/villages/${rdBlockId}` : '/locations/villages'
    ),

  getAllVillages: () =>
    api.get<ApiResponse<{id: number, name: string, rd_block_id: number, is_active: boolean}[]>>('/locations/villages/all'),

  getActiveVillages: () =>
    api.get<ApiResponse<{id: number, name: string, rd_block_id: number, is_active: boolean}[]>>('/locations/villages/active'),

  // RD Blocks CRUD
  createRdBlock: (data: { name: string, district_id: number, is_active?: boolean }) =>
    api.post<ApiResponse<any>>('/locations/rd-blocks', data),

  updateRdBlock: (id: number, data: { name: string, district_id: number, is_active?: boolean }) =>
    api.put<ApiResponse<any>>(`/locations/rd-blocks/${id}`, data),

  deleteRdBlock: (id: number) =>
    api.delete<ApiResponse<any>>(`/locations/rd-blocks/${id}`),

  hardDeleteRdBlock: (id: number) =>
    api.delete<ApiResponse<any>>(`/locations/rd-blocks/${id}/permanent`),

  // Habitations CRUD
  createHabitation: (data: { name: string, rd_block_id: number, is_active?: boolean }) =>
    api.post<ApiResponse<any>>('/locations/habitations', data),

  updateHabitation: (id: number, data: { name: string, rd_block_id: number, is_active?: boolean }) =>
    api.put<ApiResponse<any>>(`/locations/habitations/${id}`, data),

  deleteHabitation: (id: number) =>
    api.delete<ApiResponse<any>>(`/locations/habitations/${id}`),

  hardDeleteHabitation: (id: number) =>
    api.delete<ApiResponse<any>>(`/locations/habitations/${id}/permanent`),
}

// Service Categories API
export const serviceCategoriesApi = {
  getAll: () =>
    api.get<ApiResponse<any[]>>('/service-categories'),

  getActive: () =>
    api.get<ApiResponse<any[]>>('/service-categories/active'),

  getById: (id: number) =>
    api.get<ApiResponse<any>>(`/service-categories/${id}`),

  create: (data: { name: string, is_active?: boolean }) =>
    api.post<ApiResponse<any>>('/service-categories', data),

  update: (id: number, data: { name: string, is_active?: boolean }) =>
    api.put<ApiResponse<any>>(`/service-categories/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse>(`/service-categories/${id}`),

  hardDelete: (id: number) =>
    api.delete<ApiResponse>(`/service-categories/${id}/permanent`),
}

// Cascade Management API
export const cascadeApi = {
  // Get cascade information
  getSchoolCascadeInfo: (schoolId: string) =>
    api.get<ApiResponse<{
      schoolId: string;
      cascadeInfo: {
        teachers: number;
        medicalRecords: number;
        attachments: number;
        deputations: number;
        postingHistories: number;
      };
      totalAffected: number;
      warning: string;
    }>>(`/cascade/school/${schoolId}`),

  getTeacherCascadeInfo: (teacherId: number) =>
    api.get<ApiResponse<{
      teacherId: number;
      cascadeInfo: {
        medicalRecords: number;
        attachments: number;
        deputations: number;
        postingHistories: number;
      };
      totalAffected: number;
      warning: string;
    }>>(`/cascade/teacher/${teacherId}`),

  getUserCascadeInfo: (userId: number) =>
    api.get<ApiResponse<{
      userId: number;
      cascadeInfo: {
        refreshTokens: number;
        medicalRecordsEntered: number;
        auditLogs: number;
      };
      totalAffected: number;
      canDelete: boolean;
      warning: string;
    }>>(`/cascade/user/${userId}`),

  // Safe delete operations
  safeDeleteSchool: (schoolId: string, force: boolean = false) =>
    api.delete<ApiResponse<any>>(`/cascade/school/${schoolId}?force=${force}`),

  safeDeleteTeacher: (teacherId: number, force: boolean = false) =>
    api.delete<ApiResponse<any>>(`/cascade/teacher/${teacherId}?force=${force}`),

  safeDeleteUser: (userId: number, force: boolean = false) =>
    api.delete<ApiResponse<any>>(`/cascade/user/${userId}?force=${force}`),
}

// User Profile Management API
export const userProfileApi = {
  getCurrentUser: () =>
    api.get<ApiResponse<any>>('/users/me'),

  updateCurrentUser: (data: { username?: string; email?: string; phone?: string }) =>
    api.put<ApiResponse<any>>('/users/me', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post<ApiResponse<any>>('/users/change-password', data),
}

// Roles and Permissions API
export const rolesApi = {
  getAllRoles: () =>
    api.get<ApiResponse<{
      roles: any[];
      hierarchy: any;
      permissions: any;
    }>>('/roles'),

  getRolePermissions: (role: string) =>
    api.get<ApiResponse<{
      role: string;
      permissions: string[];
      display_name: string;
      description: string;
    }>>(`/roles/${role}/permissions`),

  getRoleHierarchy: () =>
    api.get<ApiResponse<{
      hierarchy: any[];
      levels: any;
    }>>('/roles/hierarchy'),

  getAllPermissions: () =>
    api.get<ApiResponse<{
      permissions: string[];
      permissionsByCategory: any;
      totalCount: number;
    }>>('/roles/permissions/all'),
}

// Session Management API
export const sessionApi = {
  getUserSessions: () =>
    api.get<ApiResponse<{
      sessions: any[];
      currentSession: string;
    }>>('/sessions'),

  revokeSession: (sessionId: string) =>
    api.delete<ApiResponse<any>>(`/sessions/${sessionId}`),

  revokeOtherSessions: () =>
    api.delete<ApiResponse<{
      revokedCount: number;
    }>>('/sessions/others'),

  getSessionInfo: (sessionId: string) =>
    api.get<ApiResponse<any>>(`/sessions/${sessionId}`),
}

export default api
