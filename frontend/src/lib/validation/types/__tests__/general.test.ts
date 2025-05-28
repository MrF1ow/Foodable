import {
  isValidObjectId,
  isValidUserId,
  isValidStringArray,
  isValidDate,
  isValidCollectionName,
} from "@/lib/validation/types/general";

describe('isValidObjectId', () => {
  it('should return true for a valid 24-character hex string', () => {
    expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
  });

  it('should return false for a string shorter than 24 characters', () => {
    expect(isValidObjectId('507f1f77')).toBe(false);
  });

  it('should return false for non-hex characters', () => {
    expect(isValidObjectId('zzzzzzzzzzzzzzzzzzzzzzzz')).toBe(false);
  });

  it('should return false for non-string inputs', () => {
    expect(isValidObjectId(123456)).toBe(false);
    expect(isValidObjectId(null)).toBe(false);
    expect(isValidObjectId(undefined)).toBe(false);
  });
});

describe('isValidUserId', () => {
  it('should return true for valid Clerk user ID', () => {
    expect(isValidUserId('user_abcdefghijklmnopqrstuvwxyz1')).toBe(true);
  });

  it('should return false for invalid prefix', () => {
    expect(isValidUserId('usr_abcdefghijklmnopqrstuvwxyz1')).toBe(false);
  });

  it('should return false for short IDs', () => {
    expect(isValidUserId('user_shortid')).toBe(false);
  });

  it('should return false for non-string or empty inputs', () => {
    expect(isValidUserId('')).toBe(false);
    expect(isValidUserId(null as unknown as string)).toBe(false);
    expect(isValidUserId(undefined as unknown as string)).toBe(false);
  });
});

describe('isValidStringArray', () => {
  it('should return true for an array of strings', () => {
    expect(isValidStringArray(['a', 'b', 'c'])).toBe(true);
  });

  it('should return true for an empty array', () => {
    expect(isValidStringArray([])).toBe(true);
  });

  it('should return false for arrays with non-strings', () => {
    expect(isValidStringArray(['a', 1, true])).toBe(false);
  });

  it('should return false for non-array values', () => {
    expect(isValidStringArray('not an array')).toBe(false);
    expect(isValidStringArray(null)).toBe(false);
  });
});

describe('isValidDate', () => {
  it('should return true for a valid Date object', () => {
    expect(isValidDate(new Date())).toBe(true);
  });

  it('should return true for a valid date string', () => {
    expect(isValidDate('2024-05-27')).toBe(true);
  });

  it('should return false for an invalid date string', () => {
    expect(isValidDate('invalid-date')).toBe(false);
  });

  it('should return false for a Date object with NaN time', () => {
    expect(isValidDate(new Date('invalid-date'))).toBe(false);
  });

  it('should return false for non-date types', () => {
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(123)).toBe(false);
  });
});

describe('isValidCollectionName', () => {
  it('should return true for valid collection names', () => {
    expect(isValidCollectionName('users')).toBe(true);
    expect(isValidCollectionName('recipes')).toBe(true);
    expect(isValidCollectionName('groceryLists')).toBe(true);
    expect(isValidCollectionName('vectors')).toBe(true);
  });

  it('should return false for invalid collection names', () => {
    expect(isValidCollectionName('invalid')).toBe(false);
    expect(isValidCollectionName('')).toBe(false);
    expect(isValidCollectionName(null)).toBe(false);
  });
});
