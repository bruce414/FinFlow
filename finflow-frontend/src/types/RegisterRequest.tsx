export interface RegisterRequest {
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string
    password: string
    dateOfBirth: string // ISO date YYYY-MM-DD
    timeZone: string
    baseCurrencyCode: string
}