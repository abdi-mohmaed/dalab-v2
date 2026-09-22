import { describe, it, expect } from 'vitest'
import { loginSchema } from '../validations'

describe('validations', () => {
    describe('loginSchema', () => {
        it('should validate correct email and password', () => {
            const result = loginSchema.safeParse({
                email: 'test@example.com',
                password: 'password123',
            })
            expect(result.success).toBe(true)
        })

        it('should fail on invalid email', () => {
            const result = loginSchema.safeParse({
                email: 'not-an-email',
                password: 'password123',
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBeTruthy()
            }
        })

        it('should fail on short password', () => {
            const result = loginSchema.safeParse({
                email: 'test@example.com',
                password: '123',
            })
            expect(result.success).toBe(false)
        })
    })
})
