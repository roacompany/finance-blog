/**
 * Daily Auto Post Generator
 *
 * Claude Code가 매일 새벽 2시에 실행하여 포스트를 자동 생성합니다.
 * 생성된 포스트는 'pending_review' 상태로 어드민에 등록되며,
 * 관리자의 '발행 승인' 버튼을 누르면 프론트에 게시됩니다.
 *
 * 사용법:
 *   npx tsx scripts/generate-daily-post.ts
 *
 * 또는 cron으로 설정:
 *   0 2 * * * cd /path/to/finance-blog && npx tsx scripts/generate-daily-post.ts
 *
 * GitHub Actions에서 실행 시, API 엔드포인트를 호출하는 방식으로 동작합니다.
 */

const API_URL = process.env.SITE_URL || 'http://localhost:3000';
const API_SECRET = process.env.AUTO_POST_SECRET || 'auto-post-default-key';

// 금융 토픽 목록 (Claude Code가 주제를 선택하여 작성)
const TOPIC_POOL = [
  { title: '금리 인하기에 알아야 할 예금 전략', tags: ['금리', '예금', '투자'], series: 'Series 01. 금리·통화정책' },
  { title: '2026년 부동산 시장 전망과 대출 전략', tags: ['부동산', '대출', '투자'], series: 'Series 02. 실전 대출 가이드' },
  { title: 'ETF vs 개별주식, 초보 투자자를 위한 가이드', tags: ['투자', '주식', '기초'], series: '' },
  { title: '연금저축과 IRP, 세액공제 200% 활용법', tags: ['세금', '투자', '연금'], series: '' },
  { title: '신용점수 관리의 모든 것', tags: ['대출', '기초', '신용'], series: 'Series 02. 실전 대출 가이드' },
  { title: '환율 변동이 내 자산에 미치는 영향', tags: ['투자', '환율', '경제지표'], series: 'Series 01. 금리·통화정책' },
  { title: '적금 vs 예금 vs CMA, 최적의 단기 저축 상품 비교', tags: ['예금', '기초', '투자'], series: '' },
  { title: '주택담보대출 갈아타기 체크리스트', tags: ['대출', '부동산', '금리'], series: 'Series 02. 실전 대출 가이드' },
];

async function generateDailyPost() {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const dayIndex = today.getDate() % TOPIC_POOL.length;
  const topic = TOPIC_POOL[dayIndex];

  const slug = `auto-${dateStr}-${topic.title
    .replace(/[^a-zA-Z0-9가-힣\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 50)}`;

  const content = `## 핵심 요약

> 이 글은 AI가 자동 생성한 초안입니다. 관리자의 검수 후 발행됩니다.

- **주제**: ${topic.title}
- **작성일**: ${dateStr}
- **카테고리**: ${topic.tags.join(', ')}

---

## 도입

${topic.title}에 대해 알아보겠습니다.

이 포스트는 Claude Code가 자동으로 생성한 초안입니다.
관리자가 내용을 검수하고 보완한 후 발행 승인을 진행합니다.

---

## 본문

<!-- 관리자가 여기에 본문 내용을 작성합니다 -->

이 부분은 관리자가 검수 시 채워넣을 내용입니다.

---

## FAQ

<Accordion title="이 글은 AI가 작성한 건가요?">
초안은 AI가 자동 생성하지만, 관리자가 내용을 검수하고 보완한 후 발행합니다.
</Accordion>

---

> **면책 조항**: 이 글은 정보 제공 목적으로 작성되었으며, 투자 권유가 아닙니다.
`;

  const postData = {
    title: topic.title,
    slug,
    description: `${topic.title} - AI가 분석한 최신 금융 인사이트를 확인하세요.`,
    content,
    date: dateStr,
    tags: topic.tags,
    series: topic.series,
  };

  console.log(`Generating daily post: "${topic.title}"`);
  console.log(`Slug: ${slug}`);
  console.log(`API: ${API_URL}/api/auto-post`);

  try {
    const res = await fetch(`${API_URL}/api/auto-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_SECRET}`,
      },
      body: JSON.stringify(postData),
    });

    const result = await res.json();

    if (res.ok) {
      console.log('Post created successfully:', result);
    } else {
      console.error('Failed to create post:', result);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error connecting to API:', error);
    process.exit(1);
  }
}

generateDailyPost();
