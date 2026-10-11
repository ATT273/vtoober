export interface ISession {
  id?: string;
  email?: string;
  name: string;
  // Thumbnail of the YouTube channel the user owns; null when no channel is linked.
  avatarUrl?: string | null;
  accessToken?: string;
  role: string;
}
