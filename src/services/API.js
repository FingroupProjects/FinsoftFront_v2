import axios from 'axios'
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'

export default function API(url) {
  const router = useRouter()
  const { cookies } = useCookies()
  return axios.create({
    baseURL: url,
    transformResponse: [
      function(data, headers, status) {
        if (status === 401) {
          cookies.remove('aut-token')
          router.push('/sign-in')
        }
        try {
          if (data) return JSON.parse(data)
        } catch (e) {
          return data
        }
      }
    ],
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  })

}
