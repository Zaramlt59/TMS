import { defineStore } from 'pinia'
import {
  mediumsApi,
  managementTypesApi,
  schoolTypesApi,
  blockOfficesApi,
  religionsApi,
  serviceCategoriesApi,
  subjectsApi
} from '../services/api'
import type { Medium, ManagementType, SchoolType, BlockOffice, Subject } from '../types'

type CacheEntry<T> = {
  data: T | null
  expiresAt: number
  inFlight?: Promise<T>
}

function now(): number {
  return Date.now()
}

export const useMasterDataStore = defineStore('masterData', {
  state: () => ({
    cacheTtlMs: 10 * 60 * 1000 as number, // 10 minutes
    mediums: { data: null, expiresAt: 0 } as CacheEntry<Medium[]>,
    managementTypes: { data: null, expiresAt: 0 } as CacheEntry<ManagementType[]>,
    schoolTypes: { data: null, expiresAt: 0 } as CacheEntry<SchoolType[]>,
    blockOffices: { data: null, expiresAt: 0 } as CacheEntry<BlockOffice[]>,
    religions: { data: null, expiresAt: 0 } as CacheEntry<string[]>,
    serviceCategories: { data: null, expiresAt: 0 } as CacheEntry<{ id: number, name: string }[]>,
    subjects: { data: null, expiresAt: 0 } as CacheEntry<Subject[]>
  }),

  actions: {
    async getMediums(force = false): Promise<Medium[]> {
      const e = this.mediums
      const fresh = e.data && e.expiresAt > now()
      if (!force && fresh && e.data) return e.data
      if (e.inFlight && !force) return e.inFlight
      const req = (async () => {
        const res = await mediumsApi.getActive()
        const data = (res.data?.data as Medium[]) || []
        this.mediums = { data, expiresAt: now() + this.cacheTtlMs }
        return data
      })()
      this.mediums.inFlight = req
      try { return await req } finally { this.mediums.inFlight = undefined }
    },

    async getManagementTypes(force = false): Promise<ManagementType[]> {
      const e = this.managementTypes
      const fresh = e.data && e.expiresAt > now()
      if (!force && fresh && e.data) return e.data
      if (e.inFlight && !force) return e.inFlight
      const req = (async () => {
        const res = await managementTypesApi.getActive()
        const data = (res.data?.data as ManagementType[]) || []
        this.managementTypes = { data, expiresAt: now() + this.cacheTtlMs }
        return data
      })()
      this.managementTypes.inFlight = req
      try { return await req } finally { this.managementTypes.inFlight = undefined }
    },

    async getSchoolTypes(force = false): Promise<SchoolType[]> {
      const e = this.schoolTypes
      const fresh = e.data && e.expiresAt > now()
      if (!force && fresh && e.data) return e.data
      if (e.inFlight && !force) return e.inFlight
      const req = (async () => {
        const res = await schoolTypesApi.getActive()
        const data = (res.data?.data as SchoolType[]) || []
        this.schoolTypes = { data, expiresAt: now() + this.cacheTtlMs }
        return data
      })()
      this.schoolTypes.inFlight = req
      try { return await req } finally { this.schoolTypes.inFlight = undefined }
    },

    async getBlockOffices(force = false): Promise<BlockOffice[]> {
      const e = this.blockOffices
      const fresh = e.data && e.expiresAt > now()
      if (!force && fresh && e.data) return e.data
      if (e.inFlight && !force) return e.inFlight
      const req = (async () => {
        const res = await blockOfficesApi.getActive()
        const data = (res.data?.data as BlockOffice[]) || []
        this.blockOffices = { data, expiresAt: now() + this.cacheTtlMs }
        return data
      })()
      this.blockOffices.inFlight = req
      try { return await req } finally { this.blockOffices.inFlight = undefined }
    },

    async getReligions(force = false): Promise<string[]> {
      const e = this.religions
      const fresh = e.data && e.expiresAt > now()
      if (!force && fresh && e.data) return e.data
      if (e.inFlight && !force) return e.inFlight
      const req = (async () => {
        const res = await religionsApi.getActive()
        const data = (res.data?.data || []).map((r: any) => r.name as string)
        this.religions = { data, expiresAt: now() + this.cacheTtlMs }
        return data
      })()
      this.religions.inFlight = req
      try { return await req } finally { this.religions.inFlight = undefined }
    },

    async getServiceCategories(force = false): Promise<{ id: number, name: string }[]> {
      const e = this.serviceCategories
      const fresh = e.data && e.expiresAt > now()
      if (!force && fresh && e.data) return e.data
      if (e.inFlight && !force) return e.inFlight
      const req = (async () => {
        const res = await serviceCategoriesApi.getActive()
        const data = (res.data?.data as { id: number, name: string }[]) || []
        this.serviceCategories = { data, expiresAt: now() + this.cacheTtlMs }
        return data
      })()
      this.serviceCategories.inFlight = req
      try { return await req } finally { this.serviceCategories.inFlight = undefined }
    },

    async getSubjects(force = false): Promise<Subject[]> {
      const e = this.subjects
      const fresh = e.data && e.expiresAt > now()
      if (!force && fresh && e.data) return e.data
      if (e.inFlight && !force) return e.inFlight
      const req = (async () => {
        const res = await subjectsApi.getAll()
        const data = (res.data?.data as Subject[]) || []
        this.subjects = { data, expiresAt: now() + this.cacheTtlMs }
        return data
      })()
      this.subjects.inFlight = req
      try { return await req } finally { this.subjects.inFlight = undefined }
    },

    invalidateAll(): void {
      this.mediums = { data: null, expiresAt: 0 }
      this.managementTypes = { data: null, expiresAt: 0 }
      this.schoolTypes = { data: null, expiresAt: 0 }
      this.blockOffices = { data: null, expiresAt: 0 }
      this.religions = { data: null, expiresAt: 0 }
      this.serviceCategories = { data: null, expiresAt: 0 }
      this.subjects = { data: null, expiresAt: 0 }
    }
  }
})


