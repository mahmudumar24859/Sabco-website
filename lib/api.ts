
const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api'

export async function fetchJSON(path){
  const res = await fetch(`${API}${path.startsWith('/')?path:''}`)
  if(!res.ok) throw new Error('Fetch error')
  return res.json()
}
