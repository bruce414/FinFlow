/** Body for PATCH /api/v1/me (UserPatchDto). All fields optional. */
export interface MePatchRequest {
  firstName?: string
  lastName?: string
  phoneNumber?: string | null
  dateOfBirth?: string | null // ISO date YYYY-MM-DD
  timeZone?: string | null
}