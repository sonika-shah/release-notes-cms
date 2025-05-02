export interface CallBucket {
  id: number;
  title: string;
  slug: string;
  content: string;
  version: string;
  release_date: string;
  is_published: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface CallBucketCreate {
  title: string;
  slug: string;
  content: string;
  version: string;
  release_date: string;
  is_published: boolean;
}

export interface CallBucketUpdate {
  title?: string;
  slug?: string;
  content?: string;
  version?: string;
  release_date?: string;
  is_published?: boolean;
}
