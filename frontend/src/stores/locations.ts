import { defineStore } from 'pinia'
import { locationsApi } from '../services/api'
import type { District } from '../types'

type BasicItem = { id: number; name: string }

type CacheEntry<T> = {
  data: T | null
  expiresAt: number
  inFlight?: Promise<T>
}

function now(): number {
  return Date.now()
}

export const useLocationsStore = defineStore('locations', {
  state: () => ({
    cacheTtlMs: 5 * 60 * 1000 as number, // 5 minutes
    districtsCache: { data: null, expiresAt: 0 } as CacheEntry<District[]>,
    rdBlocksCache: new Map<number, CacheEntry<BasicItem[]>>(),
    villagesCache: new Map<number, CacheEntry<BasicItem[]>>()
  }),

  actions: {
    async getDistricts(force = false): Promise<District[]> {
      const entry = this.districtsCache
      const isFresh = entry.data && entry.expiresAt > now()
      if (!force && isFresh && entry.data) return entry.data

      if (entry.inFlight && !force) return entry.inFlight

      const request = (async () => {
        const response = await locationsApi.getDistricts()
        const data = (response.data?.data as District[]) || []
        this.districtsCache = {
          data,
          expiresAt: now() + this.cacheTtlMs
        }
        return data
      })()

      this.districtsCache.inFlight = request
      try {
        return await request
      } finally {
        this.districtsCache.inFlight = undefined
      }
    },

    async getRdBlocks(districtId: number, force = false): Promise<BasicItem[]> {
      if (!districtId) return []
      const existing = this.rdBlocksCache.get(districtId)
      const isFresh = existing?.data && (existing.expiresAt > now())
      if (!force && isFresh && existing?.data) return existing.data

      if (existing?.inFlight && !force) return existing.inFlight

      const request = (async () => {
        const response = await locationsApi.getRdBlocks(districtId)
        const data = (response.data?.data as BasicItem[]) || []
        this.rdBlocksCache.set(districtId, {
          data,
          expiresAt: now() + this.cacheTtlMs
        })
        return data
      })()

      this.rdBlocksCache.set(districtId, {
        data: existing?.data ?? null,
        expiresAt: existing?.expiresAt ?? 0,
        inFlight: request
      })

      try {
        return await request
      } finally {
        const latest = this.rdBlocksCache.get(districtId)
        if (latest) latest.inFlight = undefined
      }
    },

    async getVillages(rdBlockId: number, force = false): Promise<BasicItem[]> {
      if (!rdBlockId) return []
      const existing = this.villagesCache.get(rdBlockId)
      const isFresh = existing?.data && (existing.expiresAt > now())
      if (!force && isFresh && existing?.data) return existing.data

      if (existing?.inFlight && !force) return existing.inFlight

      const request = (async () => {
        const response = await locationsApi.getVillages(rdBlockId)
        const data = (response.data?.data as BasicItem[]) || []
        this.villagesCache.set(rdBlockId, {
          data,
          expiresAt: now() + this.cacheTtlMs
        })
        return data
      })()

      this.villagesCache.set(rdBlockId, {
        data: existing?.data ?? null,
        expiresAt: existing?.expiresAt ?? 0,
        inFlight: request
      })

      try {
        return await request
      } finally {
        const latest = this.villagesCache.get(rdBlockId)
        if (latest) latest.inFlight = undefined
      }
    },

    invalidateAll(): void {
      this.districtsCache = { data: null, expiresAt: 0 }
      this.rdBlocksCache.clear()
      this.villagesCache.clear()
    }
  }
})


