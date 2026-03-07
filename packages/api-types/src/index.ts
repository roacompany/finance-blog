/**
 * ROA Finance — Shared Data Models
 * Web(TypeScript) 직접 사용 / iOS(Swift) 참조 기준
 * Supabase 테이블 스키마와 1:1 대응
 */

// ─── Post ────────────────────────────────────────────────

export type PostType = 'letter' | 'deep-dive' | 'series-hub';

export type PostStatus = 'draft' | 'published' | 'archived';

export interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;           // SEO 설명 (Free 공개)
  content_preview: string;       // 도입부 (Free 공개, ~300자)
  content_full: string;          // 전체 본문 (Member 전용)
  type: PostType;
  status: PostStatus;
  series_id: string | null;
  series_order: number | null;
  tags: string[];
  cover_image_url: string | null;
  reading_time_minutes: number;
  published_at: string | null;   // ISO 8601
  created_at: string;
  updated_at: string;
  views: number;
  is_featured: boolean;
}

// ─── Series ──────────────────────────────────────────────

export interface Series {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  color: string | null;          // 시리즈 테마 색상
  order: number;
  created_at: string;
}

// ─── Member ──────────────────────────────────────────────

export type MemberRole = 'member' | 'admin';

export interface Member {
  id: string;                    // Supabase Auth UUID
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: MemberRole;
  subscribed_newsletter: boolean;
  created_at: string;
}

// ─── API Response Wrappers ───────────────────────────────

export interface ApiSuccess<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: {
    message: string;
    code?: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Feed / Listing ──────────────────────────────────────

export interface PostSummary
  extends Pick<
    Post,
    | 'id'
    | 'slug'
    | 'title'
    | 'subtitle'
    | 'description'
    | 'content_preview'
    | 'type'
    | 'series_id'
    | 'tags'
    | 'cover_image_url'
    | 'reading_time_minutes'
    | 'published_at'
    | 'views'
    | 'is_featured'
  > {}

export interface SeriesWithPosts extends Series {
  posts: PostSummary[];
}

// ─── Realtime Events ─────────────────────────────────────

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

export interface RealtimePayload<T> {
  event: RealtimeEvent;
  table: string;
  new: T | null;
  old: T | null;
}
