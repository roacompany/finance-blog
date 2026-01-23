'use client';

import Link from "next/link";
import type { PostMeta } from "@/lib/content";
import { formatViews } from "@/lib/utils";

// 태그별 gradient 색상
function getTagGradient(tags: string[]): string {
  const firstTag = tags[0] || "기본";

  const gradients: Record<string, string> = {
    "금리": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "실전": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "기초": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "해외여행": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "절약": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "투자심화": "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    "한국은행": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "대출": "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "계산기": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  };

  return gradients[firstTag] || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
}

// 태그별 텍스트 색상
function getTagColor(tag: string): string {
  const colors: Record<string, string> = {
    "금리": "#667eea",
    "실전": "#f5576c",
    "기초": "#4facfe",
    "해외여행": "#38f9d7",
    "절약": "#fa709a",
    "투자심화": "#330867",
    "한국은행": "#30cfd0",
    "대출": "#ff9a9e",
    "계산기": "#fcb69f",
  };

  return colors[tag] || "#667eea";
}

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <article style={{
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E8EB',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}>
        {/* Gradient Banner */}
        <div style={{
          height: '180px',
          background: getTagGradient(post.tags),
          position: 'relative'
        }} />

        {/* Card Content */}
        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Tags */}
          <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: getTagColor(tag),
                  backgroundColor: `${getTagColor(tag)}15`,
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 style={{
            marginBottom: '8px',
            fontSize: '18px',
            fontWeight: 700,
            color: '#191F28',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {post.title}
          </h3>

          {/* Description */}
          <p style={{
            marginBottom: '16px',
            fontSize: '14px',
            lineHeight: 1.6,
            color: '#6B7684',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1
          }}>
            {post.description}
          </p>

          {/* Metadata */}
          <div style={{
            fontSize: '13px',
            color: '#8B95A1',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <time dateTime={post.date}>{post.date}</time>
            {post.readingTime && (
              <>
                <span style={{ color: '#E5E8EB' }}>·</span>
                <span>{post.readingTime}</span>
              </>
            )}
            {formatViews(post.views) && (
              <>
                <span style={{ color: '#E5E8EB' }}>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {formatViews(post.views)}
                </span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
