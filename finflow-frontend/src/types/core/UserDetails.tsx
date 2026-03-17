/** Response from GET /api/v1/me (UserDetailsOutDto) */
export interface UserDetails {
  userId: string
  firstName: string
  lastName: string
  email: string
  emailVerified: boolean
  phoneNumber: string | null
  dateOfBirth: string | null // ISO date YYYY-MM-DD
  timeZone: string | null
  status: string
  lastLoginAt: string | null // ISO instant
}
