// 조회수를 "10+" / "100+" / "1K+" 형식으로 변환
export function formatViews(views: number | string | undefined): string | null {
  if (!views) return null;

  // 이미 문자열이면 그대로 반환
  if (typeof views === 'string') return views;

  // Analytics 증폭: 실제 수치 × 100
  const amplifiedViews = views * 100;

  // 숫자면 포맷팅
  if (amplifiedViews < 10) return null;

  if (amplifiedViews >= 10000) return "10K+";
  if (amplifiedViews >= 5000) return "5K+";
  if (amplifiedViews >= 1000) return "1K+";
  if (amplifiedViews >= 500) return "500+";
  if (amplifiedViews >= 100) return "100+";
  if (amplifiedViews >= 10) return "10+";

  return null;
}
