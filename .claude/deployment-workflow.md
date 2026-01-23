# 배포 워크플로우 (확정)

> **중요**: 이 문서는 finance-blog의 배포 프로세스를 정의합니다. 절대 임의로 변경하지 마세요.

**최종 수정**: 2026-01-23

---

## 배포 정의

**배포 = GitHub Push + PR 생성 링크 제공**

Vercel은 GitHub에 연동되어 있어, GitHub에 변경사항이 반영되면 자동으로 배포됩니다.

---

## 배포 프로세스 (3단계)

### 1단계: Git Commit
```bash
git add -A
git commit -m "커밋 메시지"
```

**커밋 메시지 규칙**:
- `feat:` - 새로운 기능 추가
- `fix:` - 버그 수정
- `refactor:` - 코드 리팩토링
- `docs:` - 문서 수정
- `style:` - 코드 포맷팅

### 2단계: GitHub Push
```bash
git push -u origin <브랜치명>
```

**브랜치 명명 규칙**:
- `claude/` 접두사로 시작
- 세션 ID로 끝나야 함 (예: `claude/treasury-yield-curve-post-Q7ID3`)
- 403 에러 방지를 위해 필수

### 3단계: PR 생성 링크 제공 ✅ **이것이 배포의 마지막 단계**

**필수 형식**:
```
## ✅ PR 생성 링크

👉 [PR 생성하기](https://github.com/roacompany/finance-blog/compare/main...<브랜치명>)
```

**함께 제공할 정보**:
- PR 제목 (복사 가능한 형식)
- PR 본문 (마크다운 형식, 복사 가능)

---

## ❌ 하지 말아야 할 것

1. **`gh pr create` 명령어 사용 금지**
   - `gh` CLI가 설치되어 있지 않음
   - 항상 실패함

2. **Vercel 직접 배포 언급 금지**
   - Vercel은 GitHub에서 자동으로 배포
   - 사용자가 별도로 Vercel 조작 필요 없음

3. **main 브랜치에 직접 merge 금지**
   - 항상 PR을 통해야 함
   - 사용자가 PR을 검토하고 merge

4. **배포 완료 여부 확인 불가**
   - GitHub push 후 PR 링크 제공이 끝
   - Vercel 배포 상태는 확인할 수 없음

---

## ✅ 정확한 배포 멘트

**올바른 멘트**:
```
✅ GitHub에 push 완료!

**브랜치**: claude/xxx
**커밋**: abc1234

아래 링크에서 PR을 생성해주세요:
👉 [PR 생성하기](링크)

**PR 제목**:
(제목)

**PR 본문**:
(본문)
```

**잘못된 멘트** (사용 금지):
- "Vercel에 배포 중입니다" ❌
- "배포가 완료되었습니다" ❌ (PR 링크 제공 전)
- "gh pr create로 PR 생성하겠습니다" ❌
- "main 브랜치에 merge하겠습니다" ❌
- "어떤 방식으로 진행할까요?" ❌ (항상 PR 링크만 제공)

---

## 예시: 완벽한 배포 프로세스

```bash
# 1. Commit
git add -A
git commit -m "feat: 새로운 포스트 추가"

# 2. Push
git push -u origin claude/new-feature-ABC123

# 3. PR 링크 제공 (사용자에게)
```

**사용자에게 제공할 메시지**:
```
✅ GitHub에 push 완료!

**브랜치**: claude/new-feature-ABC123
**커밋**: abc1234

아래 링크에서 PR을 생성해주세요:
👉 [PR 생성하기](https://github.com/roacompany/finance-blog/compare/main...claude/new-feature-ABC123)

**PR 제목**:
feat: 새로운 포스트 추가

**PR 본문**:
(마크다운 형식 본문)
```

---

## Git Push 재시도 규칙

**네트워크 에러 시에만** 최대 4번 재시도:
- 1차 실패: 2초 대기 후 재시도
- 2차 실패: 4초 대기 후 재시도
- 3차 실패: 8초 대기 후 재시도
- 4차 실패: 16초 대기 후 재시도

**403 에러 시**:
- 재시도 하지 않음
- 브랜치명 확인 (claude/ 접두사, 세션 ID 접미사)

---

## 체크리스트

배포 전 반드시 확인:
- [ ] `npm run build` 성공
- [ ] Git commit 완료
- [ ] Git push 성공
- [ ] PR 생성 링크 제공
- [ ] PR 제목 및 본문 제공
- [ ] "배포 완료" 멘트는 "GitHub에 push 완료" 의미

---

## 요약

```
배포 = Git Push + PR 링크 제공
```

**이것만 기억하세요**:
1. Build 성공 확인
2. Git commit & push
3. **PR 생성 링크 제공** ← 배포의 마지막 단계
4. 끝!

Vercel은 사용자가 PR을 merge하면 자동으로 배포합니다.
