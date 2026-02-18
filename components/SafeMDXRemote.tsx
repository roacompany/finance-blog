import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

interface SafeMDXRemoteProps {
  source: string;
  components?: React.ComponentProps<typeof MDXRemote>['components'];
}

export async function SafeMDXRemote({ source, components }: SafeMDXRemoteProps) {
  try {
    return (
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
          parseFrontmatter: false,
          blockJS: false,
        }}
        components={components}
      />
    );
  } catch (error) {
    console.error('[SafeMDXRemote] MDX rendering failed:', error);
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-800 mb-1">
          콘텐츠 렌더링 오류
        </p>
        <p className="text-xs text-red-600">
          이 포스트의 MDX 콘텐츠를 처리하는 중 오류가 발생했습니다.
        </p>
        <details className="mt-3">
          <summary className="text-xs text-red-500 cursor-pointer">기술 정보</summary>
          <pre className="mt-2 text-xs text-red-400 whitespace-pre-wrap break-all">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </details>
      </div>
    );
  }
}
