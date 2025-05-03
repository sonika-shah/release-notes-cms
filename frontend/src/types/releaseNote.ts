export interface Bucket {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface BucketCreate {
  title: string;
  release_date: string;
  is_published: boolean;
}

export interface BucketUpdate {
  title?: string;
  release_date?: string;
  is_published?: boolean;
}

export interface Files {
  id: number;
  original_name: string;
  bucketId: number;
  created_at: string;
  updated_at: string | null;
  description: string;
  file_size?: number;
  file_type?: string;
  filePath?: string;
}

export interface FileCreate {
  bucketId: number;
  description: string;
  file: File;
}
