# 배포 에러 케이스 관리

배포 에러를 방지하기 위한 체크리스트 및 케이스별 해결 방법

## 에러 케이스 #1: MDX 컴포넌트 미등록 (2026-01-12)

### 증상
```
Error: Expected component `LoanCalculator` to be defined: you likely forgot to import, pass, or provide it.
```

### 원인
- MDX 파일에서 사용한 커스텀 컴포넌트가 `mdx-components.tsx`에 등록되지 않음
- 프로젝트에 두 개의 `mdx-components.tsx` 파일 존재:
  - 루트: `/mdx-components.tsx`
  - 로컬: `/app/posts/[slug]/mdx-components.tsx`
- Next.js는 로컬 파일을 우선 사용하므로, 로컬 파일에 컴포넌트가 없으면 에러 발생

### 해결 방법
1. **로컬 mdx-components.tsx 확인**: `/app/posts/[slug]/mdx-components.tsx`에 컴포넌트 추가
   ```tsx
   import { LoanCalculator } from "@/components/calculators";

   export function useMDXComponents(components: any) {
     return {
       ...components,
       LoanCalculator,  // 추가
       // ... 기타 컴포넌트
     };
   }
   ```

2. **로컬 빌드 테스트**: 배포 전 반드시 `npm run build` 실행하여 에러 확인

### 예방 체크리스트
- [ ] 새로운 MDX 컴포넌트 추가 시 `/app/posts/[slug]/mdx-components.tsx`에 등록
- [ ] 배포 전 `npm run build` 실행
- [ ] 빌드 성공 확인 후 커밋/푸시

---

## 에러 케이스 #2: 이중 물음표 (??) 문법 오류 (2026-01-12)

### 증상
빌드 에러 또는 배포 실패 (MDX 파싱 오류 가능성)

### 원인
- `sed` 명령어를 사용한 톤 변환 시 `s/까요\?/까요?/g` 패턴이 이미 변환된 텍스트를 다시 매칭하여 `??` 생성
- 영향받은 파일:
  - `bok-mpc-secret.mdx`
  - `cofix-vs-cd.mdx`
  - `interest-rate-101.mdx`
  - `fed-bok-correlation.mdx`
  - `repo-msb.mdx`
  - `treasury-yield-curve.mdx`

### 해결 방법
```bash
sed -i 's/??/?/g' content/posts/*.mdx
```

### 예방 체크리스트
- [ ] `sed` 명령어 사용 시 패턴이 교체된 텍스트와 다시 매칭되지 않도록 주의
- [ ] 정규식 패턴 검증 후 실행
- [ ] 변경 후 `grep -n "??" content/posts/*.mdx`로 검증
- [ ] 배포 전 로컬 빌드 테스트

---

## 배포 전 필수 체크리스트

### 1. 코드 검증
```bash
# TypeScript 타입 체크
npm run type-check

# ESLint 검사
npm run lint

# 로컬 빌드
npm run build
```

### 2. 파일 검증
```bash
# MDX 파일 이중 물음표 확인
grep -n "??" content/posts/*.mdx

# MDX 컴포넌트 등록 확인
# /app/posts/[slug]/mdx-components.tsx 확인
```

### 3. Git 상태 확인
```bash
git status
git diff
```

### 4. 배포
```bash
git add .
git commit -m "descriptive message"
git push -u origin [branch-name]
```

---

## 빌드 에러 디버깅 절차

1. **로컬 빌드 실행**
   ```bash
   npm install  # 패키지가 없는 경우
   npm run build
   ```

2. **에러 로그 분석**
   - 에러 메시지에서 파일 경로와 라인 번호 확인
   - 관련 파일 Read 툴로 확인

3. **원인 파악**
   - MDX 컴포넌트 미등록
   - 문법 오류
   - TypeScript 타입 오류
   - Import 오류

4. **수정 및 재빌드**
   - 에러 수정
   - `npm run build` 재실행
   - 빌드 성공 확인

5. **배포**
   - 커밋 및 푸시
   - Vercel 배포 상태 모니터링

---

## 토큰 절약을 위한 원칙

1. **배포 전 로컬 검증 필수**: 배포 실패로 인한 토큰 낭비 방지
2. **에러 발생 시 체계적 접근**: 추측 대신 로컬 빌드로 정확한 에러 확인
3. **문서화**: 동일한 에러 재발 방지를 위해 케이스 문서화
4. **자동화 가능한 검증은 스크립트화**: package.json에 검증 스크립트 추가

---

## 참고: package.json 스크립트 추가 권장

```json
{
  "scripts": {
    "build": "next build",
    "type-check": "tsc --noEmit",
    "lint": "next lint",
    "validate": "npm run type-check && npm run lint && npm run build",
    "pre-deploy": "grep -n '??' content/posts/*.mdx || echo 'No double question marks found'"
  }
}
```

이렇게 하면 배포 전 `npm run validate`로 전체 검증 가능.
