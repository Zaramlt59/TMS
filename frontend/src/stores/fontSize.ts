import { defineStore } from 'pinia'

export const useFontSizeStore = defineStore('fontSize', {
  state: () => ({
    scale: 1, // Default scale (100%)
    minScale: 0.8, // Minimum scale (80%)
    maxScale: 1.4, // Maximum scale (140%)
    step: 0.1 // Scale step (10%)
  }),

  getters: {
    fontSize: (state) => `${state.scale * 100}%`,
    canDecrease: (state) => state.scale > state.minScale,
    canIncrease: (state) => state.scale < state.maxScale
  },

  actions: {
    increaseFontSize() {
      if (this.canIncrease) {
        this.scale = Math.min(this.scale + this.step, this.maxScale)
        this.applyFontSize()
      }
    },

    decreaseFontSize() {
      if (this.canDecrease) {
        this.scale = Math.max(this.scale - this.step, this.minScale)
        this.applyFontSize()
      }
    },

    resetFontSize() {
      this.scale = 1
      this.applyFontSize()
    },

    applyFontSize() {
      // Apply font size using CSS custom property to avoid affecting government header
      document.documentElement.style.setProperty('--font-scale', this.scale.toString())
      
      // Also apply directly to specific elements to ensure it works
      const mainContent = document.querySelector('main')
      const navigation = document.querySelector('nav')
      
      if (mainContent) {
        mainContent.style.fontSize = `${this.scale * 16}px`
      }
      
      if (navigation) {
        navigation.style.fontSize = `${this.scale * 16}px`
      }
      
      // Store in localStorage for persistence
      localStorage.setItem('fontSize', this.scale.toString())
    },

    loadFontSize() {
      // Load font size from localStorage on app initialization
      const savedScale = localStorage.getItem('fontSize')
      if (savedScale) {
        this.scale = parseFloat(savedScale)
        this.applyFontSize()
      }
    }
  }
})
