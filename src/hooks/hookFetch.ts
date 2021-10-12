import { reactive, toRefs } from 'vue'
import axios from 'axios'

interface State {
  isLoading: boolean
  isError: boolean
  errorMessage: string
  data: object | null
}

export default function useAxios(url: string, data: object) {
  const state = reactive({
    isLoading: true,
    isError: false,
    errorMessage: '',
    data: null,
  }) as State

  const fetchData = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: url, // '/test_data/campaign.json'
        data: data,
      })
      state.data = response.data
    } catch (e) {
      state.isError = true
      state.errorMessage = e.message
    } finally {
      state.isLoading = false
    }
  }

  return {
    ...toRefs(state), //TS complains over "Parameter 'state' implicitly has an 'any' type." But it's already typed in the above???
    fetchData,
  }
}
