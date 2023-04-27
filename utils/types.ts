export interface State {
  session: string | undefined;
}

export interface User {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
  memos?: string[];
}

export interface Memo {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OauthSession {
  state: string;
  codeVerifier: string;
}

export type GameGrid = [
  string | null,
  string | null,
  string | null,
  string | null,
  string | null,
  string | null,
  string | null,
  string | null,
  string | null
];

export interface Game {
  id: string;
  initiator: User;
  opponent: User;
  grid: GameGrid;
  startedAt: Date;
  lastMoveAt: Date;
}
