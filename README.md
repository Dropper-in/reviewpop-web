# 리뷰팝 (ReviewPop)

> 체험단 서비스 플랫폼

[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

## 📋 목차

- [소개](#-소개)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [아키텍처](#-아키텍처)
- [코딩 규칙](#-코딩-규칙)
- [협업 가이드](#-협업-가이드)
- [주니어 개발자 가이드](#-주니어-개발자-가이드)

---

## 🎯 소개

리뷰팝은 체험단과 브랜드를 연결하는 플랫폼입니다.

### 주요 기능

- (추가 기능은 개발 진행에 따라 업데이트)

---

## 💻 기술 스택

### Frontend

- **Framework**: Next.js 16.0.1 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5.x
- **Styling**: SCSS (Sass)
- **Data Fetching**: axios, Tanstack Query
- **State Management**: Zustand
- **Mock API**: MSW (Mock Service Worker)

### Development Tools

- **Package Manager**: yarn
- **Code Quality**: ESLint, Prettier
- **Git Hooks**: Husky + lint-staged + commitlint
- **Version Control**: Git (Git Flow)

### DevOps

- **CI/CD**: GitHub Actions (예정)
- **Deployment**: (미정)

---

## 🚀 시작하기

### Prerequisites

다음 소프트웨어가 설치되어 있어야 합니다:

- **Node.js**: v20.x 이상
- **yarn**: v1.22.x 이상

### Installation

1. 저장소를 클론합니다:

```bash
git clone https://github.com/datepop/reviewpop-web.git
cd reviewpop-web
```

2. 의존성을 설치합니다:

```bash
yarn install
```

3. 환경 변수를 설정합니다:

```bash
cp .env.example .env.local
# .env.local 파일을 열어 필요한 환경 변수를 수정하세요
```

### Development

```bash
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인할 수 있습니다.

#### 🎭 Mock API

개발 환경에서는 **Mock Service Worker (MSW)**를 사용하여 가짜 API로 개발합니다.
백엔드가 준비되지 않아도 프론트엔드 개발을 진행할 수 있습니다!

- Mock API는 기본적으로 활성화되어 있습니다
- Mock API를 비활성화하려면 `.env.local`에서 `NEXT_PUBLIC_USE_MOCK=false`로 설정
- Mock 데이터는 [src/shared/api/mock/](src/shared/api/mock/) 폴더에서 관리
- 브라우저 콘솔에서 `🎭 MSW 활성화됨` 메시지 확인 가능

#### 🔍 React Query Devtools

개발 환경에서는 **React Query Devtools**가 자동으로 활성화됩니다.

**사용 방법:**

1. 개발 서버 실행 (`yarn dev`)
2. 브라우저 **우측 하단**에 React Query 아이콘 표시
3. 클릭하면 현재 실행 중인 쿼리 목록, 캐시 상태, 데이터 확인 가능

**주요 기능:**

- 🟢 실시간 쿼리 상태 모니터링 (fresh, stale, fetching)
- 📊 캐시된 데이터 확인
- 🔄 수동 Refetch, Invalidate 등 디버깅 작업
- 📈 쿼리 성능 분석

**Pro Tip:** 쿼리 이름으로 검색할 수 있습니다. 예: `reviews` 검색

### Production

프로덕션 빌드를 생성하고 서버를 실행합니다:

```bash
yarn build
yarn start
```

---

## 🏗 아키텍처

이 프로젝트는 **FSD (Feature-Sliced Design) Lite** 아키텍처를 사용합니다.

### FSD Lite란?

FSD의 핵심 개념만 차용한 경량화된 버전으로, 다음의 장점이 있습니다:

- ✅ **명확한 구조**: 코드를 어디에 넣어야 할지 명확함
- ✅ **협업 용이**: 기능별로 분리되어 충돌 최소화
- ✅ **확장성**: 프로젝트가 커져도 관리하기 쉬움
- ✅ **학습 용이**: 복잡하지 않아 주니어도 쉽게 이해

### 3개의 주요 레이어

```
src/
├── features/    # 기능 (사용자 시나리오)
├── entities/    # 엔티티 (비즈니스 데이터 모델)
└── shared/      # 공유 자원 (UI, API, 유틸)
```

| 레이어       | 역할                              | 예시                   |
| ------------ | --------------------------------- | ---------------------- |
| **features** | 사용자가 실제로 사용하는 기능     | 리뷰 작성, 제품 필터링 |
| **entities** | 비즈니스 엔티티와 전역 상태       | User                   |
| **shared**   | 프로젝트 전체에서 재사용하는 코드 | Button, API 클라이언트 |

### 폴더 구조

```
reviewpop-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── providers/          # React Query, MSW 등 Provider
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── features/               # 기능 단위
│   │   ├── review/             # 리뷰 기능
│   │   │   ├── components/     # ReviewCard, ReviewList
│   │   │   ├── hooks/          # useReviews
│   │   │   └── api/            # reviewApi.ts
│   │   └── product/            # 제품 기능 (예정)
│   │
│   ├── entities/               # 비즈니스 엔티티
│   │   └── user/               # 사용자
│   │       ├── store/          # userStore (Zustand)
│   │       └── types/          # user.types.ts
│   │
│   ├── shared/                 # 공유 자원
│   │   ├── ui/                 # Button, Input, ErrorBoundary
│   │   ├── api/                # axios, Mock API (MSW)
│   │   ├── lib/                # 유틸리티 함수
│   │   └── config/             # env, constants, routes
│   │
│   ├── styles/                 # 전역 스타일
│   └── assets/                 # 폰트, 이미지 등
│
├── public/                     # Public 폴더
├── .env.example                # 환경 변수 예시
└── README.md                   # 이 문서
```

### 레이어별 설명

#### 1. Features (기능)

> **"사용자가 실제로 하는 행동"**

**언제 사용하나요?**

- ✅ 사용자 시나리오가 명확한 경우 (예: 리뷰 작성, 제품 검색)

**폴더 구조:**

```
features/
└── review/
    ├── components/      # 리뷰 전용 컴포넌트
    ├── hooks/          # 리뷰 전용 훅
    └── api/            # 리뷰 API
```

**예시 코드:**

```typescript
// features/review/hooks/useReviews.ts
import { useQuery } from '@tanstack/react-query';

import { getReviews } from '../api/reviewApi';

export function useReviews() {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: getReviews,
  });
}
```

**중요 규칙:**

- ❌ **다른 feature는 import 금지** (review에서 product import 불가)
- ✅ **shared는 자유롭게 사용** (`@shared/ui/Button`)
- ✅ **entities는 사용 가능** (`@entities/user/store`)

> 💡 **더 자세한 내용**: [src/features/README.md](src/features/README.md)

#### 2. Entities (엔티티)

> **"앱의 핵심 비즈니스 개념"**

**언제 사용하나요?**

- ✅ 앱 전체에서 사용되는 데이터 모델
- ✅ 전역 상태 관리 (Zustand)

**예시 코드:**

```typescript
// entities/user/store/userStore.ts
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

**중요 규칙:**

- ❌ **features는 import 금지** (순환 의존성 방지)
- ✅ **shared는 사용 가능**

> 💡 **더 자세한 내용**: [src/entities/README.md](src/entities/README.md)

#### 3. Shared (공유)

> **"프로젝트 전체에서 재사용하는 코드"**

**언제 사용하나요?**

- ✅ 여러 곳에서 재사용되는 UI 컴포넌트
- ✅ API 설정, 유틸 함수, 상수

**폴더 구조:**

```
shared/
├── ui/              # Button, Input, ErrorBoundary
├── api/             # axios, Mock API
├── lib/             # 유틸리티 함수
└── config/          # env, constants, routes
```

**중요 규칙:**

- ❌ **비즈니스 로직 금지**
- ✅ **순수한 UI와 유틸만**

> 💡 **더 자세한 내용**: [src/shared/README.md](src/shared/README.md)

### 의존성 규칙

```
features  →  entities  →  shared
   ↓          ↓            ↓
   ✅         ✅           ✅  하위 레이어 사용 가능
   ❌         ❌           ❌  상위 레이어 사용 금지
```

**예시:**

```typescript
// ✅ 올바른 Import
// features/review/components/ReviewCard.tsx
import { Button } from '@shared/ui/Button'; // shared 사용 OK
import { useUserStore } from '@entities/user/store'; // entities 사용 OK

// ❌ 잘못된 Import
// entities/user/store/userStore.ts
import { ReviewCard } from '@features/review/components/ReviewCard'; // 상위 레이어

// features/review/hooks/useReviews.ts
import { useProducts } from '@features/product/hooks/useProducts'; // 다른 feature
```

### 개발 워크플로우

#### 새로운 기능 추가하기

**예시:** "제품 필터링" 기능을 추가한다면?

1. **폴더 생성**

```bash
mkdir -p src/features/product/{components,hooks,api}
```

2. **API 함수 작성**

```typescript
// features/product/api/productApi.ts
import { apiClient } from '@shared/api/client';

export async function getProducts() {
  const response = await apiClient.get('/products');
  return response.data;
}
```

3. **커스텀 훅 작성**

```typescript
// features/product/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';

import { getProducts } from '../api/productApi';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
}
```

4. **컴포넌트 작성**

```typescript
// features/product/components/ProductList.tsx
'use client';

import { useProducts } from '../hooks/useProducts';

export function ProductList() {
  const { data } = useProducts();
  // ...
}
```

#### 자주 묻는 질문

**Q1. 컴포넌트를 어디에 넣어야 할지 모르겠어요**

1. 여러 기능에서 재사용되나요?
   - YES → `shared/ui/`
   - NO → 다음 질문으로

2. 특정 기능에만 사용되나요?
   - YES → `features/{기능명}/components/`
   - NO → `shared/ui/`

**Q2. API 함수는 어디에?**

- 기능 관련 API → `features/{기능명}/api/`
- 공통 API 설정 → `shared/api/client.ts`

**Q3. 타입은 어디에?**

- 전역 타입 → `entities/{엔티티}/types/`
- 기능 전용 타입 → `features/{기능명}/api/` (API 응답 타입)

---

## 📏 코딩 규칙

### Import 순서 규칙

**⚠️ 중요: 모든 React/TypeScript 파일은 다음 순서로 import 해야 합니다!**

```typescript
// 1. 외부 라이브러리 (React, Next.js, 서드파티)
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

// 2. 내부 절대 경로 (@shared, @features, @entities)
import { Button } from '@shared/ui/Button';
import { useUserStore } from '@entities/user/store';

// 3. 상대 경로 (같은 feature 내부)
import { getReviews } from '../api/reviewApi';

// 4. 타입 imports
import type { User } from '@entities/user/types/user.types';

// 5. 스타일
import styles from './Component.module.scss';
```

**그룹 간에는 빈 줄 필수!**

#### ESLint 자동 검증

이 프로젝트는 **ESLint의 `import/order` 규칙**으로 자동 검증됩니다.

- ✅ 규칙을 지키면: 문제 없음
- ❌ 규칙을 어기면: **ESLint 에러 발생** (빨간 줄 표시)
- 🔧 커밋 전 **pre-commit hook**에서 자동 검사

**예시:**

```typescript
// ❌ 잘못된 순서 (ESLint 에러!)
import styles from './Button.module.scss';
import { useState } from 'react';
import { Button } from '@shared/ui/Button';

// ✅ 올바른 순서
import { useState } from 'react';

import { Button } from '@shared/ui/Button';

import styles from './Button.module.scss';
```

### 명명 규칙

- **변수/함수**: camelCase (`userName`, `handleClick`)
- **컴포넌트**: PascalCase (`Button`, `ReviewCard`)
- **상수**: UPPER_SNAKE_CASE (`MAX_LENGTH`, `API_URL`)
- **디렉토리**: kebab-case (`user-profile`, `review-list`)
- **타입/인터페이스**: PascalCase (`User`, `ButtonProps`)

### 코드 스타일

#### ESLint 설정

- Next.js Core Web Vitals 규칙
- TypeScript 권장 규칙
- Prettier와 통합
- **Import 순서 자동 검증**

#### Prettier 설정

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all"
}
```

#### 코딩 스타일 가이드

- **들여쓰기**: 2 spaces
- **따옴표**: 작은따옴표 (') 사용 (JSX 제외)
- **세미콜론**: 항상 사용
- **화살표 함수**: 컴포넌트 및 함수 정의 시 사용

### TypeScript 규칙

#### any 타입 사용 금지

**⚠️ 중요: 프로젝트 전체에서 `any` 타입 사용을 금지합니다!**

`any` 타입은 TypeScript의 타입 안정성을 완전히 무력화시키므로 절대 사용하지 마세요.

**대안:**

```typescript
// ❌ 잘못된 예시
function processData(data: any) {
  return data.value;
}

// ✅ 올바른 예시 1: 구체적인 타입 정의
interface Data {
  value: string;
}
function processData(data: Data) {
  return data.value;
}

// ✅ 올바른 예시 2: 제네릭 사용
function processData<T>(data: T) {
  return data;
}

// ✅ 올바른 예시 3: unknown 사용 (타입을 모를 때)
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data');
}
```

**언제 어떤 타입을 사용할까?**

- **구체적인 타입을 알 때**: 인터페이스나 타입 정의 사용
- **여러 타입을 지원할 때**: 제네릭 (`<T>`) 사용
- **정말 타입을 모를 때**: `unknown` 사용 후 타입 가드로 검증
- **여러 가능성이 있을 때**: Union 타입 (`string | number`) 사용

**주의사항:**

- 외부 라이브러리에서 `any`를 반환하는 경우, 즉시 구체적인 타입으로 변환하세요
- API 응답은 반드시 타입을 정의하세요 (`@features/{기능}/api/` 폴더)
- `unknown`을 사용할 때는 반드시 타입 가드를 통해 검증하세요

---

## 🤝 협업 가이드

### Git 브랜치 전략 (Git Flow)

이 프로젝트는 Git Flow 전략을 따릅니다.

#### 주요 브랜치

- **`main`**: 프로덕션 배포 브랜치
  - 항상 배포 가능한 상태 유지
  - 직접 커밋 금지
  - `develop` 또는 `hotfix`에서만 병합

- **`develop`**: 개발 통합 브랜치
  - 다음 릴리스를 위한 개발 작업 통합
  - 기능 개발 완료 시 이 브랜치로 병합

#### 지원 브랜치

- **`feature/*`**: 새로운 기능 개발
  - 명명: `feature/기능명` (예: `feature/user-authentication`)
  - `develop`에서 분기 → `develop`으로 병합

- **`hotfix/*`**: 프로덕션 긴급 수정
  - 명명: `hotfix/버그명` (예: `hotfix/login-error`)
  - `main`에서 분기 → `main`과 `develop` 모두 병합

#### 브랜치 작업 흐름

1. **기능 개발 시작**

```bash
git checkout develop
git pull origin develop
git checkout -b feature/new-feature
```

2. **개발 작업 및 커밋**

```bash
git add .
git commit -m "feat: 새로운 기능 추가"
```

3. **원격 저장소에 푸시**

```bash
git push origin feature/new-feature
```

4. **Pull Request 생성**
   - GitHub에서 `feature/new-feature` → `develop`으로 PR 생성
   - 코드 리뷰 후 병합

### 커밋 컨벤션 (Conventional Commits)

#### 커밋 메시지 형식

```
<type>: <subject>

<body (선택사항)>

<footer (선택사항)>
```

#### 타입 (Type)

- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 코드 포맷팅 (동작에 영향 없음)
- **refactor**: 코드 리팩토링
- **test**: 테스트 코드
- **chore**: 빌드, 패키지 설정 등
- **perf**: 성능 개선
- **ci**: CI/CD 설정

#### 예시

```bash
# 기본
feat: 사용자 로그인 기능 추가

# 본문 포함
fix: 리뷰 작성 시 이미지 업로드 오류 수정

- 이미지 파일 크기 제한을 5MB로 증가
- 업로드 실패 시 에러 메시지 표시
```

#### Commitlint 자동 검증

- ✅ 커밋 메시지가 규칙에 맞으면: 커밋 성공
- ❌ 규칙에 어긋나면: **커밋 거부** (에러 메시지 표시)

**예시:**

```bash
# ❌ 잘못된 커밋 (거부됨)
git commit -m "added login feature"
# → Error: type must be lowercase and one of [feat, fix, docs, ...]

# ✅ 올바른 커밋
git commit -m "feat: 로그인 기능 추가"
# → Success!
```

### Git Hooks (Husky)

이 프로젝트는 **Husky**를 사용하여 코드 품질을 자동으로 관리합니다:

#### Pre-commit Hook

커밋 전에 자동으로 실행:

- ESLint로 코드 검사
- Prettier로 코드 포맷팅
- **Import 순서 검증**

**스테이징된 파일만** 검사하므로 빠릅니다!

#### Commit-msg Hook

커밋 메시지가 Conventional Commits 규칙을 따르는지 검증합니다.

> 💡 **주니어 개발자 Tip**: Git hooks가 자동으로 실행되므로 신경쓰지 않아도 됩니다!
> 규칙에 어긋나면 에러 메시지가 표시되고, 수정 방법을 알려줍니다.

---

## 🎯 주니어 개발자 가이드

### 처음 시작하는 분들께

환영합니다! 🎉 이 프로젝트는 주니어 개발자 친화적으로 설계되었습니다.

---

### 📚 인턴을 위한 3단계 학습 로드맵

프로젝트를 처음 접하는 인턴이라면 다음 순서로 학습하세요!

#### **1단계: 프로젝트 구조 이해하기** (첫 주)

**목표:** FSD 아키텍처와 폴더 구조 파악

**읽을 문서 (순서대로):**

1. ✅ [루트 README.md](README.md) - 전체 개요 (현재 문서)
2. ✅ [src/features/README.md](src/features/README.md) - 기능 레이어
3. ✅ [src/entities/README.md](src/entities/README.md) - 엔티티 레이어
4. ✅ [src/shared/README.md](src/shared/README.md) - 공유 레이어

**체크리스트:**

- [ ] FSD의 3개 레이어(features, entities, shared)를 설명할 수 있다
- [ ] 의존성 규칙을 이해했다 (features → entities → shared)
- [ ] 다른 feature를 import하면 안 되는 이유를 안다
- [ ] 프로젝트의 폴더 구조를 둘러봤다

**실습:**

- VSCode에서 `src/` 폴더를 열어서 구조 탐색
- 각 폴더의 README.md를 읽으면서 역할 파악
- 예시 코드를 직접 열어서 import 패턴 확인

---

#### **2단계: Mock API로 개발 연습하기** (둘째 주)

**목표:** 백엔드 없이 프론트엔드 개발하는 방법 익히기

**읽을 문서:**

1. ✅ [src/shared/api/README.md](src/shared/api/README.md) - API 클라이언트와 Mock API
2. ✅ [src/app/providers/README.md](src/app/providers/README.md) - React Query 설정

**체크리스트:**

- [ ] Mock API가 활성화되어 있는지 확인 (브라우저 콘솔에서 "MSW 활성화됨" 메시지)
- [ ] React Query Devtools를 열어봤다 (우측 하단 아이콘)
- [ ] apiClient를 사용해서 API를 호출할 수 있다
- [ ] Mock 데이터를 수정해봤다

**실습:**

1. **개발 서버 실행:**

   ```bash
   yarn dev
   ```

2. **Mock API 확인:**
   - 브라우저 콘솔 열기 (F12)
   - "🎭 MSW 활성화됨" 메시지 확인
   - Network 탭에서 API 요청 확인

3. **React Query Devtools 사용:**
   - 우측 하단 React Query 아이콘 클릭
   - 쿼리 목록 확인
   - 캐시된 데이터 확인

4. **Mock 데이터 수정 연습:**
   - `src/shared/api/mock/data/` 폴더의 데이터 수정
   - 브라우저에서 변경 사항 확인

---

#### **3단계: 첫 기능 만들어보기** (셋째 주)

**목표:** 실제로 코드 작성하면서 FSD 패턴 체득하기

**읽을 문서:**

1. ✅ [src/features/review/README.md](src/features/review/README.md) - 리뷰 기능 예시
2. ✅ [src/features/history/README.md](src/features/history/README.md) - 체험 히스토리 예시
3. ✅ [src/entities/user/README.md](src/entities/user/README.md) - 사용자 엔티티

**체크리스트:**

- [ ] 커스텀 훅을 만들어봤다 (useQuery 사용)
- [ ] 컴포넌트에서 API 데이터를 표시해봤다
- [ ] 로딩/에러 상태를 처리해봤다
- [ ] 타입을 제대로 정의했다
- [ ] React Query Devtools로 캐싱을 확인했다

**실습 과제:**

**과제 1: 체험 목록 표시하기**

1. `features/history/hooks/useCampaigns.ts` 열어보기
2. 새 페이지에서 `useCampaigns` 훅 사용
3. 로딩/에러 상태 처리
4. 체험 목록 렌더링

**과제 2: 새로운 컴포넌트 만들기**

1. `shared/components/Card/` 참고
2. 비슷한 구조로 새 컴포넌트 만들기
3. SCSS 모듈로 스타일링
4. 다른 곳에서 import해서 사용

**과제 3: Mock API 핸들러 추가**

1. `src/shared/api/mock/handlers/` 폴더 탐색
2. 새로운 엔드포인트 추가
3. Mock 데이터 반환
4. 브라우저에서 테스트

---

#### 1. 먼저 읽어야 할 것들

읽는 순서:

1. **이 README.md** (현재 문서) - 프로젝트 전체 이해
2. **아키텍처 섹션** (위 ↑) - FSD Lite 구조 이해
3. **폴더별 README.md** - 상세 가이드
   - [src/features/README.md](src/features/README.md)
   - [src/entities/README.md](src/entities/README.md)
   - [src/shared/README.md](src/shared/README.md)

#### 2. 예시 코드 탐색

**완전한 예시가 준비되어 있습니다:**

- **UI 컴포넌트**: [src/shared/ui/Button](src/shared/ui/Button)
- **API 호출**: [src/features/review/api](src/features/review/api)
- **React Query 훅**: [src/features/review/hooks](src/features/review/hooks)
- **Zustand Store**: [src/entities/user/store](src/entities/user/store)
- **Error Boundary**: [src/shared/ui/ErrorBoundary](src/shared/ui/ErrorBoundary)

이 예시들을 **복사해서 수정**하면 됩니다!

#### 3. 자주 사용하는 명령어

```bash
# 개발 서버 시작
yarn dev

# 코드 포맷팅 (자동)
# VSCode에서 저장 시 자동으로 적용됨

# 린트 검사
yarn lint

# 빌드
yarn build
```

#### 4. 개발 환경 설정

**VSCode 추천 확장 프로그램:**

- ESLint
- Prettier
- TypeScript and JavaScript Language Features

**저장 시 자동 포맷팅 설정:**

`.vscode/settings.json` 파일 생성:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

#### 5. 실습 과제 (추천)

처음 시작한다면 다음 순서로 연습해보세요:

**1주차: 환경 설정 및 구조 이해**

- [ ] 프로젝트 클론 및 실행
- [ ] React Query Devtools 열어보기
- [ ] Mock API 확인 (브라우저 콘솔)
- [ ] 예시 코드 읽어보기

**2주차: 간단한 컴포넌트 만들기**

- [ ] `shared/ui/Card` 컴포넌트 만들기
- [ ] Button 컴포넌트 사용해보기
- [ ] SCSS 모듈로 스타일링

**3주차: 기능 추가하기**

- [ ] 제품 목록 조회 기능 (useProducts 훅)
- [ ] ProductCard 컴포넌트
- [ ] ProductList 컴포넌트

**4주차: 통합 작업**

- [ ] 여러 기능 조합
- [ ] 전역 상태 사용 (userStore)
- [ ] 에러 처리 (ErrorBoundary)

#### 6. 질문하는 방법

**막혔을 때:**

1. **에러 메시지 읽기** - 대부분 해결 방법이 적혀 있습니다
2. **콘솔 확인** - 브라우저 콘솔에 힌트가 있습니다
3. **예시 코드 참고** - 비슷한 패턴이 있을 겁니다
4. **팀원에게 질문** - 언제든 물어보세요!

**좋은 질문 예시:**

```
❌ "안 돼요"
✅ "ReviewCard 컴포넌트에서 useReviews 훅을 사용했는데,
   'Cannot find module' 에러가 발생합니다.
   import 경로는 '@features/review/hooks/useReviews'로 했습니다."
```

#### 7. 자주 발생하는 실수

**Import 경로 실수**

```typescript
// ❌
import { Button } from '../../shared/ui/Button';

// ✅
import { Button } from '@shared/ui/Button';
```

**Import 순서 실수**

```typescript
// ❌ (ESLint 에러 발생!)
import styles from './Button.module.scss';
import { useState } from 'react';

// ✅
import { useState } from 'react';

import styles from './Button.module.scss';
```

**타입 정의 누락**

```typescript
// ❌
function MyComponent({ data }) {  // 타입 없음

// ✅
interface MyComponentProps {
  data: string;
}
function MyComponent({ data }: MyComponentProps) {
```

**의존성 규칙 위반**

```typescript
// ❌ features에서 다른 features import
import { ProductCard } from '@features/product/components/ProductCard';

// ✅ shared 사용
import { Card } from '@shared/ui/Card';
```

#### 8. 도움이 되는 자료

- [React 공식 문서](https://react.dev/)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [React Query 문서](https://tanstack.com/query/latest)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)
- [FSD 공식 문서](https://feature-sliced.design/)

---

## 📚 추가 문서

### 폴더별 상세 가이드

- [Features 가이드](src/features/README.md)
- [Entities 가이드](src/entities/README.md)
- [Shared 가이드](src/shared/README.md)
- [Shared UI 가이드](src/shared/ui/README.md)
- [Error Boundary 가이드](src/shared/ui/ErrorBoundary/README.md)
- [Providers 가이드](src/app/providers/README.md)

### API 문서

> 🚧 API 문서는 개발 진행에 따라 추가

현재는 Mock API를 사용 중입니다.
Mock 데이터는 [src/shared/api/mock/data/](src/shared/api/mock/data/)에서 확인할 수 있습니다.
MSW 핸들러 통합 진입점은 [src/shared/api/mock/handlers.ts](src/shared/api/mock/handlers.ts)입니다.

---

## 💡 유용한 팁

### 빠른 개발을 위한 단축키

- **컴포넌트 생성**: 예시 코드를 복사해서 수정
- **Import 자동 완성**: VSCode가 자동으로 제안
- **타입 힌트**: 변수에 마우스 올리면 타입 표시

### 성능 최적화

- React Query가 자동으로 캐싱 처리
- React 19의 자동 최적화 활용
- 필요할 때만 `useMemo`, `useCallback` 사용

### 디버깅 도구

- **React Query Devtools**: 쿼리 상태 확인
- **React DevTools**: 컴포넌트 트리 확인
- **Redux DevTools**: (Zustand용으로도 사용 가능)
- **MSW**: Network 탭에서 Mock API 확인

---

## 🙋 FAQ

**Q: ESLint 에러가 너무 많아요**
A: `yarn lint --fix` 실행하면 자동으로 대부분 수정됩니다.

**Q: Import 순서를 수동으로 정렬해야 하나요?**
A: 아니요! ESLint가 자동으로 검증하고, 저장 시 자동 정렬됩니다.

**Q: Mock API는 언제까지 사용하나요?**
A: 백엔드 API가 준비되면 `.env.local`에서 `NEXT_PUBLIC_USE_MOCK=false`로 변경하면 됩니다.

**Q: 새로운 페이지를 추가하려면?**
A: `src/app/` 폴더에 폴더를 만들고 `page.tsx`를 추가하세요. (Next.js App Router)

**Q: 전역 상태는 언제 사용하나요?**
A: 여러 페이지/컴포넌트에서 공유되는 데이터만 (예: 사용자 정보, 테마)

**Q: Error Boundary는 무엇인가요?**
A: React 컴포넌트에서 발생하는 에러를 잡아내는 안전망입니다. 에러가 발생해도 앱 전체가 깨지지 않고 폴백 UI를 보여줍니다. 자세한 내용은 [Error Boundary 가이드](src/shared/ui/ErrorBoundary/README.md)를 참고하세요.

---

**Happy Coding! 🚀**

문의사항이 있으면 팀원에게 언제든 물어보세요!
