export interface ClubMembersResponse {
  weekly: { username: string; joined: number }[] | string[];
  monthly: { username: string; joined: number }[] | string[];
  all_time: { username: string; joined: number }[] | string[];
}

export interface PlayerProfile {
  username: string;
  country: string; // e.g. "https://api.chess.com/pub/country/XX"
}

export interface CountryStat {
  code: string;
  name: string;
  flag: string;
  count: number;
}
