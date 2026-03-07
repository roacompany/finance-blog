/**
 * AI 콘텐츠 생성 서비스 추상화
 *
 * 현재는 플레이스홀더 템플릿을 반환합니다.
 * AI_PROVIDER와 AI_API_KEY 환경변수 설정 시 실제 AI API 연동 지점입니다.
 */

export function isAIConfigured(): boolean {
  return !!(process.env.AI_PROVIDER && process.env.AI_API_KEY);
}

export function getAIProviderName(): string | null {
  const provider = process.env.AI_PROVIDER;
  if (!provider) return null;

  const names: Record<string, string> = {
    claude: 'Claude',
    openai: 'OpenAI',
  };
  return names[provider] || provider;
}

interface GenerateContentParams {
  title: string;
  tags: string[];
  description?: string;
  series?: string;
}

export async function generateContent(params: GenerateContentParams): Promise<string> {
  // TODO: AI_PROVIDER에 따라 Claude/OpenAI SDK 연동
  // 현재는 플레이스홀더 템플릿 반환
  return `## ${params.title}

> 이 포스트는 백로그 토픽에서 생성된 초안입니다. 내용을 채워주세요.

### 핵심 요약

- 핵심 내용 1
- 핵심 내용 2
- 핵심 내용 3

### 상세 분석

본문 내용을 작성해주세요.

### 실전 활용 팁

독자에게 실질적인 도움이 되는 팁을 작성해주세요.

### 마치며

마무리 내용을 작성해주세요.

---

**관련 키워드**: ${params.tags.join(', ')}
`;
}
