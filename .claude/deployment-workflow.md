# 배포 프로세스 개선안

## 현재 문제점

- 커밋 후 즉시 푸시 → Vercel 자동 배포
- 사용자 확인 없이 배포됨
- 실수 시 롤백 어려움

---

## 개선된 워크플로우

### Stage 1: 작업 완료 (Local)

```
[작업 진행] → [파일 수정] → [로컬 커밋]
```

**상태**: 로컬에만 존재, 원격/배포 없음

### Stage 2: 사용자 확인 요청 (Review)

```
[변경 내역 요약 제시] → [사용자 검토] → [수정 요청 or 승인]
```

**AI 제공 정보**:
- 수정된 파일 목록
- 주요 변경사항 요약
- 예상 영향 범위
- 롤백 방법

**사용자 액션**:
- ✅ 승인: "배포해" → Stage 3로
- ❌ 수정 요청: "XX 수정해" → Stage 1로
- 🔍 상세 확인: "XX 파일 보여줘"

### Stage 3: 원격 푸시 (Remote Push)

```
[git push] → [GitHub에 커밋 반영]
```

**상태**: GitHub에 반영, Vercel 미배포 (아직)

### Stage 4: Vercel 배포 확인 (Deploy)

```
[Vercel Preview 링크 제공] → [사용자 Preview 확인] → [Production 배포 승인]
```

**AI 제공 정보**:
- Vercel Preview URL
- 빌드 로그 (에러 있으면)
- PR 링크

**사용자 액션**:
- ✅ Production 배포: PR merge
- ❌ 취소: PR 닫기

---

## 구현 방법

### 방법 A: Git Hook 활용 (추천)

**장점**: 자동화, 실수 방지
**구현**: `.claude/pre-push-hook.sh`

```bash
#!/bin/bash
# .claude/pre-push-hook.sh

echo "⚠️  배포 전 확인이 필요합니다."
echo ""
echo "변경된 파일:"
git diff --name-only @{u}..HEAD
echo ""
echo "계속 푸시하시겠습니까? (y/N)"
read -r response

if [[ "$response" != "y" ]]; then
  echo "❌ 푸시가 취소되었습니다."
  exit 1
fi

echo "✅ 푸시를 진행합니다..."
exit 0
```

**설치**:
```bash
ln -s ../../.claude/pre-push-hook.sh .git/hooks/pre-push
chmod +x .claude/pre-push-hook.sh
```

### 방법 B: AI 프로토콜 변경 (간단)

**AI 행동 원칙**:
1. 커밋 완료 후 **절대 자동 푸시 금지**
2. 다음 메시지 출력:
   ```
   ✅ 작업 완료 (로컬 커밋)

   변경 내역:
   - 파일1: 설명
   - 파일2: 설명

   배포하시겠습니까?
   - "배포해" 입력 시 푸시 진행
   - "수정해" 입력 시 추가 작업
   ```
3. 사용자 승인 받은 후에만 푸시

---

## 단계별 체크리스트

### AI 작업 완료 시

- [ ] 로컬 커밋 완료
- [ ] 변경 파일 목록 제시
- [ ] 주요 변경사항 요약
- [ ] "배포하시겠습니까?" 질문
- [ ] **사용자 응답 대기**

### 사용자 승인 시

- [ ] git push 실행
- [ ] PR 링크 제공
- [ ] Vercel Preview URL 제공 (가능하면)
- [ ] "Preview 확인 후 merge 해주세요" 안내

### 사용자 수정 요청 시

- [ ] 추가 작업 진행
- [ ] 기존 커밋에 amend 또는 새 커밋
- [ ] 다시 승인 요청

---

## 예시 대화

### ✅ 올바른 워크플로우

```
AI: [작업 완료]
    변경 파일:
    - app/page.tsx: 메타데이터 추가
    - lib/content.ts: formatViews 수정

    배포하시겠습니까?

사용자: app/page.tsx 보여줘

AI: [파일 내용 표시]

사용자: 좋아, 배포해

AI: [푸시 실행]
    PR: https://github.com/...
    Preview: https://vercel.app/...
```

### ❌ 잘못된 워크플로우

```
AI: [작업 완료]
    [자동 푸시] ← 이러면 안됨!
    PR: https://github.com/...
```

---

## Vercel 배포 설정

### Production vs Preview

**현재 설정**:
- `main` 브랜치 → Production 자동 배포
- `claude/*` 브랜치 → Preview 자동 생성

**권장 설정**:
- Preview 자동 생성 유지
- Production은 PR merge 시만 배포
- Vercel 설정: "Auto-deploy only on main"

### Preview 링크 확인 방법

1. GitHub PR 페이지 접속
2. "Checks" 탭 확인
3. Vercel bot 코멘트에서 Preview URL 클릭

---

## 롤백 방법

### 1. 푸시 전 (로컬만)

```bash
git reset --soft HEAD~1  # 커밋 취소, 파일 유지
git reset --hard HEAD~1  # 커밋 + 파일 모두 취소
```

### 2. 푸시 후 (원격 반영됨)

```bash
git revert HEAD          # 되돌리는 새 커밋 생성
git push
```

### 3. 배포 후 (Production)

- Vercel 대시보드에서 이전 배포로 롤백
- 또는 PR revert 후 merge

---

## 적용 제안

**즉시 적용 가능 (방법 B)**:
- AI 행동 원칙만 변경
- Hook 설치 불필요
- 바로 효과

**장기적 권장 (방법 A)**:
- Git hook 설치
- 실수 방지 자동화
- 팀원 추가 시에도 유효

어떤 방법을 선호하시나요?
