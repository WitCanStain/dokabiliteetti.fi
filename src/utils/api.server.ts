import { createServerFn } from '@tanstack/react-start'

export const getMapApiKey = createServerFn().handler(() => {
  const apiKey = process.env.THUNDERFOREST_MAP_API_KEY
  if (!apiKey) {
    throw new Error('Map API key is not defined')
  }
  return apiKey
})
