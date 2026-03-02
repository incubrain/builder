// Shared types between app/ and server/
// Add your shared type definitions here.

export interface AppUser {
  id: string
  name: string | null
  email: string
  image: string | null
}
