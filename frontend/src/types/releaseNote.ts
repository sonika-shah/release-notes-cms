export interface ReleaseNote {
  id: number;
  title: string;
  content: string;
  version: string;
  release_date: string;
  is_published: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface ReleaseNoteCreate {
  title: string;
  content: string;
  version: string;
  release_date: string;
  is_published: boolean;
}

export interface ReleaseNoteUpdate {
  title?: string;
  content?: string;
  version?: string;
  release_date?: string;
  is_published?: boolean;
}
