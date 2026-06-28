import { ClubMembersResponse } from "./types";

export function getFlagEmoji(countryCode: string): string {
  if (countryCode.toLowerCase() === 'xx') return '🌍'; // International / Unknown
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function getCountryName(countryCode: string): string {
  if (countryCode.toLowerCase() === 'xx') return 'International';
  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return displayNames.of(countryCode.toUpperCase()) || countryCode;
  } catch (e) {
    return countryCode;
  }
}

export function extractUsernames(data: ClubMembersResponse): string[] {
  const allUsers = new Set<string>();
  const addUsers = (list: any[] | undefined) => {
    if (!list || !Array.isArray(list)) return;
    list.forEach((item) => {
      if (typeof item === 'string') {
        allUsers.add(item);
      } else if (item && typeof item === 'object' && item.username) {
        allUsers.add(item.username);
      }
    });
  };

  addUsers(data.weekly);
  addUsers(data.monthly);
  addUsers(data.all_time);
  
  return Array.from(allUsers);
}
