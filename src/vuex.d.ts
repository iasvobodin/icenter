import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { rootState } from '@/types/rootState'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<rootState>
  }
}

declare module 'vuex' {
  export function useStore(key?: string): Store<rootState>
}
