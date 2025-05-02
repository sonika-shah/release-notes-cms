export interface Bucket {
  id: number;
  title: string;
  slug: string;
  created_at: string;
  updated_at: string | null;
}

export interface BucketCreate {
  title: string;
  slug: string;
}

export interface BucketUpdate {
  title?: string;
  slug?: string;
}

export interface File {
  id: number;
  name: string;
  slug: string;
  directory: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface FileCreate {
  name: string;
  slug: string;
  directory: string;
  content: string;
  is_published: boolean;
}
