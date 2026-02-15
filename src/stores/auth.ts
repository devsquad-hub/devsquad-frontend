import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    profile: null as any,
    loading: true,
  }),
  actions: {
    async fetchUser() {
      this.loading = true
      const {
        data: { user },
      } = await supabase.auth.getUser()
      this.user = user

      if (user) {
        const { data, error } = await supabase
          .from('cm_user')
          .select('*, cm_profile(*)')
          .eq('id_user', user.id)
          .single()
        if (error) throw error
        this.profile = data
      }
      this.loading = false
    },
  },
})
