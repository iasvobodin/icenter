import {useFetch} from '@/hooks/fetch'
import {ref, Ref} from 'vue'

interface Projects {
    id: string
    status: string
    ['senior fitter']: string
}

export type UsableProject = Promise<{projetList: Ref<Projects[] | undefined>}>

export async function useProjects(): UsableProject {
  const loading = ref(false)
  const {request, response: projetList} = useFetch<Projects[]>("/api/projectsSharepoint")
  if (!loading.value) {
    await request()
    loading.value = true
  }
  // console.log(projetList,'projetListfromfetch', store);

  return { projetList }
}