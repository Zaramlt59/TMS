import axios from 'axios'
import type { School, Teacher, District, Medium, ManagementType, BlockOffice, Subject, SchoolType, Religion, ApiResponse } from '../types'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Schools API
export const schoolsApi = {
  getAll: (page = 1, limit = 10) => 
    api.get<ApiResponse>(`/schools?page=${page}&limit=${limit}`),
  
  getById: (id: string) => 
    api.get<ApiResponse<School>>(`/schools/${id}`),
  
  create: (data: School) => 
    api.post<ApiResponse<School>>('/schools', data),
  
  update: (id: string, data: Partial<School>) => 
    api.put<ApiResponse<School>>(`/schools/${id}`, data),
  
  delete: (id: string) => 
    api.delete<ApiResponse>(`/schools/${id}`),
  
  search: (query: string) => 
    api.get<ApiResponse<School[]>>(`/schools/search?q=${encodeURIComponent(query)}`),
  
  getStats: () => 
    api.get<ApiResponse>('/schools/stats'),
}

// Teachers API
export const teachersApi = {
  getAll: (page = 1, limit = 10) => 
    api.get<ApiResponse>(`/teachers?page=${page}&limit=${limit}`),
  
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

export default api
