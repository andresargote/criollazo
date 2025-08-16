import { describe, it, expect } from 'vitest';
import { getInvalidFields } from '../../src/utils/getInvalidFields';

describe('getInvalidFields', () => {
    describe('valid fields', () => {
        it('should return empty array for all valid fields', () => {
            const fields = [
                { name: 'player_name', type: 'string', value: 'Simón Bolívar', required: true },
                { name: 'attempts', type: 'number', value: 3, required: true },
                { name: 'time_ms', type: 'number', value: 54000, required: true },
                { name: 'points', type: 'number', value: 1020, required: true }
            ];

            const body = {
                player_name: 'Simón Bolívar',
                attempts: 3,
                time_ms: 54000,
                points: 1020
            };

            const result = getInvalidFields(fields, body);
            expect(result).toEqual([]);
        });

        it('should return empty array for optional fields that are not provided', () => {
            const fields = [
                { name: 'player_name', type: 'string', value: 'Simón', required: true },
                { name: 'nickname', type: 'string', value: undefined, required: false }
            ];

            const body = {
                player_name: 'Simón'
            };

            const result = getInvalidFields(fields, body);
            expect(result).toContain('nickname');
        });
    });

    // Test cases for missing required fields
    describe('missing required fields', () => {
        it('should detect missing required string field', () => {
            const fields = [
                { name: 'player_name', type: 'string', value: undefined, required: true },
                { name: 'attempts', type: 'number', value: 3, required: true }
            ];

            const body = {
                attempts: 3
            };

            const result = getInvalidFields(fields, body);
            expect(result).toContain('player_name');
        });

        it('should detect missing required number field', () => {
            const fields = [
                { name: 'player_name', type: 'string', value: 'Simón', required: true },
                { name: 'attempts', type: 'number', value: undefined, required: true }
            ];

            const body = {
                player_name: 'Simón'
            };

            const result = getInvalidFields(fields, body);
            expect(result).toContain('attempts');
        });
    });

    // Test cases for invalid string values
    describe('invalid string values', () => {
        it('should detect empty string', () => {
            const fields = [
                { name: 'player_name', type: 'string', value: '', required: true }
            ];

            const body = {
                player_name: ''
            };

            const result = getInvalidFields(fields, body);
            expect(result).toContain('player_name');
        });

        it('should detect whitespace-only string', () => {
            const fields = [
                { name: 'player_name', type: 'string', value: '   ', required: true }
            ];

            const body = {
                player_name: '   '
            };

            const result = getInvalidFields(fields, body);
            expect(result).toContain('player_name');
        });

        it('should accept valid string with spaces', () => {
            const fields = [
                { name: 'player_name', type: 'string', value: 'Simón Bolívar', required: true }
            ];

            const body = {
                player_name: 'Simón Bolívar'
            };

            const result = getInvalidFields(fields, body);
            expect(result).toEqual([]);
        });
    });

    // Test cases for invalid number values
    describe('invalid number values', () => {
        it('should detect NaN', () => {
            const fields = [
                { name: 'attempts', type: 'number', value: NaN, required: true }
            ];

            const body = {
                attempts: NaN
            };

            const result = getInvalidFields(fields, body);
            expect(result).toContain('attempts');
        });

        it('should detect negative numbers', () => {
            const fields = [
                { name: 'attempts', type: 'number', value: -1, required: true }
            ];

            const body = {
                attempts: -1
            };

            const result = getInvalidFields(fields, body);
            expect(result).toContain('attempts');
        });

        it('should accept zero', () => {
            const fields = [
                { name: 'attempts', type: 'number', value: 0, required: true }
            ];

            const body = {
                attempts: 0
            };

            const result = getInvalidFields(fields, body);
            expect(result).toEqual([]);
        });

        it('should accept positive numbers', () => {
            const fields = [
                { name: 'attempts', type: 'number', value: 5, required: true }
            ];

            const body = {
                attempts: 5
            };

            const result = getInvalidFields(fields, body);
            expect(result).toEqual([]);
        });
    });

    // Test cases for mixed scenarios
    describe('mixed scenarios', () => {
        it('should detect multiple invalid fields', () => {
            const fields = [
                { name: 'player_name', type: 'string', value: '', required: true },
                { name: 'attempts', type: 'number', value: -1, required: true },
                { name: 'time_ms', type: 'number', value: 54000, required: true }
            ];

            const body = {
                player_name: '',
                attempts: -1,
                time_ms: 54000
            };

            const result = getInvalidFields(fields, body);
            expect(result).toContain('player_name');
            expect(result).toContain('attempts');
            expect(result).not.toContain('time_ms');
            expect(result.length).toBe(2);
        });

        it('should handle real-world score validation', () => {
            const fields = [
                { name: 'player_name', type: 'string', value: 'Simón', required: true },
                { name: 'attempts', type: 'number', value: 3, required: true },
                { name: 'time_ms', type: 'number', value: 54000, required: true },
                { name: 'points', type: 'number', value: 1020, required: true }
            ];

            const body = {
                player_name: 'Simón',
                attempts: 3,
                time_ms: 54000,
                points: 1020
            };

            const result = getInvalidFields(fields, body);
            expect(result).toEqual([]);
        });
    });
});
