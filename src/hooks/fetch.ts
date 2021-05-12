import {ref, Ref} from 'vue'
import store from '@/store/index'
type ApiRequest = () => Promise<void>

interface FetchApi<T> {
  request: ApiRequest
  response: Ref<T | undefined>
}
export function useFetch<T>(url: RequestInfo, options?: RequestInit): FetchApi<T> {
  const response = ref<T>()

  const request: ApiRequest = async () => {
  store.commit("changeLoader", true)
    const res = await fetch(url, options)
    response.value = await res.json()
  store.commit("changeLoader", false)

  }

  return {response, request}
}