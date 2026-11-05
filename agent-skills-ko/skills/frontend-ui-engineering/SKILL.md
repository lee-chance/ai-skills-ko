---
name: frontend-ui-engineering
description: 프로덕션 품질의, 접근 가능하고 반응형인 사용자 대면 UI를 만듭니다. 인터페이스와 페이지를 만들거나 수정할 때, 컴포넌트를 만들 때, 레이아웃을 구현할 때, WCAG 접근성 요구사항을 맞출 때, 상태를 관리할 때, 또는 결과물이 AI가 생성한 느낌이 아니라 프로덕션 품질의 모습과 느낌이어야 할 때 사용하세요.
---

# Frontend UI Engineering

## 개요

접근 가능하고, 성능이 좋으며, 시각적으로 다듬어진 프로덕션 품질의 사용자 인터페이스를 만드세요. 목표는 일류 회사의 디자인 감각이 있는 엔지니어가 만든 UI처럼 보이는 것입니다. AI가 생성한 것처럼 보이면 안 됩니다. 실제 디자인 시스템을 따르고, 접근성을 제대로 갖추고, 상호작용 패턴을 신중히 고르며, 흔한 "AI 미감"을 넣지 않는 일입니다.

## 언제 사용하나

- 새 UI 컴포넌트나 페이지를 만들 때
- 기존 사용자 대면 인터페이스를 수정할 때
- 반응형 레이아웃을 구현할 때
- 상호작용이나 상태 관리를 추가할 때
- 시각적 문제나 UX 문제를 고칠 때

## 컴포넌트 아키텍처

### 파일 구조

컴포넌트와 관련된 모든 것을 같은 곳에 두세요.

```
src/components/
  TaskList/
    TaskList.tsx          # 컴포넌트 구현
    TaskList.test.tsx     # 테스트
    TaskList.stories.tsx  # Storybook 스토리 (사용하는 경우)
    use-task-list.ts      # 커스텀 훅 (상태가 복잡할 때)
    types.ts              # 컴포넌트 전용 타입 (필요할 때)
```

### 컴포넌트 패턴

**설정 나열보다 합성을 우선하세요:**

```tsx
// Good: Composable
<Card>
  <CardHeader>
    <CardTitle>Tasks</CardTitle>
  </CardHeader>
  <CardBody>
    <TaskList tasks={tasks} />
  </CardBody>
</Card>

// Avoid: Over-configured
<Card
  title="Tasks"
  headerVariant="large"
  bodyPadding="md"
  content={<TaskList tasks={tasks} />}
/>
```

**컴포넌트가 하는 일을 좁히세요:**

```tsx
// Good: Does one thing
export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="flex items-center gap-3 p-3">
      <Checkbox checked={task.done} onChange={() => onToggle(task.id)} />
      <span className={task.done ? 'line-through text-muted' : ''}>{task.title}</span>
      <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
        <TrashIcon />
      </Button>
    </li>
  );
}
```

**데이터 가져오기와 표현을 분리하세요:**

```tsx
// Container: handles data
export function TaskListContainer() {
  const { tasks, isLoading, error, refetch, toggleTask, deleteTask } = useTasks();

  if (isLoading) return <TaskListSkeleton />;
  if (error) return <ErrorState message="Failed to load tasks" retry={refetch} />;
  if (tasks.length === 0) return <EmptyState message="No tasks yet" />;

  return <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />;
}

// Presentation: handles rendering
export function TaskList({ tasks, onToggle, onDelete }: { tasks: Task[] } & Pick<TaskItemProps, 'onToggle' | 'onDelete'>) {
  return (
    <ul role="list" className="divide-y">
      {tasks.map(task => <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />)}
    </ul>
  );
}
```

## 상태 관리

**동작하는 가장 단순한 방법을 고르세요:**

```
로컬 상태 (useState)           → 컴포넌트 전용 UI 상태
끌어올린 상태                  → 형제 컴포넌트 2~3개가 공유
Context                        → 테마, 인증, 로케일 (읽기가 많고 쓰기는 드묾)
URL 상태 (searchParams)        → 필터, 페이지네이션, 공유 가능한 UI 상태
서버 상태 (React Query, SWR)   → 캐시가 있는 원격 데이터
전역 스토어 (Zustand, Redux)   → 앱 전체에서 공유하는 복잡한 클라이언트 상태
```

**3단계를 넘는 프롭 드릴링을 피하세요.** 쓰지 않는 컴포넌트를 거쳐 프롭을 넘기고 있다면, 컨텍스트를 도입하거나 컴포넌트 트리를 다시 구성하세요.

## 디자인 시스템 준수

### 레퍼런스 기반 UI 품질

제품에 뚜렷한 시각적 방향이 필요하면, 레이아웃을 고르기 전에 근거를 모으세요.

1. 신뢰할 수 있는 레퍼런스 카탈로그를 찾거나, 제품 팀이 제공한 레퍼런스를 사용하세요.
2. 관련 화면 두세 개를 살펴보세요. 위계, 밀도, 탐색, 컨트롤, 반응형 동작, 상호작용 상태에 대한 결정을 기록하세요.
3. 그 결정을 구현 전에 짧은 디자인 계약으로 바꾸세요. 화면의 역할, 주요 동작, 필요한 상태, 반응형 규칙, 거부할 패턴을 적으세요.
4. 유용한 구조를 제품 자신의 컴포넌트, 토큰, 콘텐츠, 시각 언어로 다시 만드세요. 다른 제품의 브랜딩, 독점 문구, 이미지, 정확한 레이아웃은 복사하지 마세요.

레퍼런스는 템플릿이 아니라 근거로 쓰세요. 레퍼런스를 구할 수 없으면 가정을 문서로 남기고, 결과를 제품의 기존 디자인 시스템과 대조해 검증하세요.

### AI 특유의 모습을 피하세요

AI가 생성한 UI에는 알아볼 수 있는 패턴이 있습니다. 모두 피하세요.

| AI 기본값 | 왜 문제인가 | 프로덕션 품질 |
|---|---|---|
| 모든 곳에 보라/인디고 | 모델은 시각적으로 "안전한" 팔레트를 기본으로 써서, 모든 앱이 똑같아 보입니다 | 프로젝트의 실제 색 팔레트를 사용하세요 |
| 과한 그라데이션 | 그라데이션은 시각적 잡음을 더하고 대부분의 디자인 시스템과 충돌합니다 | 디자인 시스템에 맞는 단색, 또는 은은한 그라데이션 |
| 모든 모서리를 둥글게 (`rounded-2xl`) | 최대 라운딩은 "친근함"을 신호하지만, 실제 디자인의 모서리 반지름 위계를 무시합니다 | 디자인 시스템의 일관된 border-radius |
| 흔한 히어로 섹션 | 실제 콘텐츠나 사용자 필요와 연결되지 않은 템플릿 레이아웃 | 콘텐츠를 먼저 두는 레이아웃 |
| Lorem ipsum 스타일의 카피 | 자리표시 문구는 실제 콘텐츠가 드러내는 레이아웃 문제(길이, 줄바꿈, 넘침)를 숨깁니다 | 현실적인 자리표시 콘텐츠 |
| 모든 곳의 과도한 패딩 | 똑같이 넉넉한 패딩은 시각적 위계를 망가뜨리고 화면 공간을 낭비합니다 | 일관된 간격 스케일 |
| 천편일률적인 카드 그리드 | 균일한 그리드는 정보 우선순위와 훑어보기 패턴을 무시하는 레이아웃 지름길입니다 | 목적에 맞춘 레이아웃 |
| 그림자가 무거운 디자인 | 겹겹의 그림자는 콘텐츠와 경쟁하는 깊이를 더하고, 저사양 기기에서 렌더링을 느리게 합니다 | 디자인 시스템이 지정하지 않으면 은은한 그림자, 또는 그림자 없음 |

### 간격과 레이아웃

일관된 간격 스케일을 쓰세요. 값을 지어내지 마세요.

```css
/* Use the scale: 0.25rem increments (or whatever the project uses) */
/* Good */  padding: 1rem;      /* 16px */
/* Good */  gap: 0.75rem;       /* 12px */
/* Bad */   padding: 13px;      /* Not on any scale */
/* Bad */   margin-top: 2.3rem; /* Not on any scale */
```

### 타이포그래피

타입 위계를 존중하세요.

```
h1 → 페이지 제목 (페이지당 하나)
h2 → 섹션 제목
h3 → 하위 섹션 제목
body → 기본 텍스트
small → 보조/도움말 텍스트
```

제목 단계를 건너뛰지 마세요. 제목이 아닌 콘텐츠에 제목 스타일을 쓰지 마세요.

### 색

- 시맨틱 컬러 토큰을 사용하세요. `text-primary`, `bg-surface`, `border-default`. 원시 hex 값은 쓰지 마세요
- 충분한 대비를 확보하세요 (일반 텍스트 4.5:1, 큰 텍스트 3:1)
- 정보를 색만으로 전달하지 마세요 (아이콘, 텍스트, 패턴도 함께 쓰세요)

## 접근성 (WCAG 2.1 AA)

모든 컴포넌트는 이 기준을 충족해야 합니다.

### 키보드 탐색

```tsx
// Every interactive element must be keyboard accessible
<button onClick={handleClick}>Click me</button>        // ✓ Focusable by default
<div onClick={handleClick}>Click me</div>               // ✗ Not focusable
<div role="button" tabIndex={0} onClick={handleClick}    // ✓ But prefer <button>
     onKeyDown={e => {
       if (e.key === 'Enter') handleClick();
       if (e.key === ' ') e.preventDefault();
     }}
     onKeyUp={e => {
       if (e.key === ' ') handleClick();
     }}>
  Click me
</div>
```

### ARIA 레이블

```tsx
// Label interactive elements that lack visible text
<button aria-label="Close dialog"><XIcon /></button>

// Label form inputs
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Or use aria-label when no visible label exists
<input aria-label="Search tasks" type="search" />
```

### 포커스 관리

```tsx
// Move focus when content changes
function Dialog({ isOpen, onClose }: DialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  // Trap focus inside dialog when open
  return (
    <dialog open={isOpen}>
      <button ref={closeRef} onClick={onClose}>Close</button>
      {/* dialog content */}
    </dialog>
  );
}
```

### 의미 있는 빈 상태와 오류 상태

```tsx
// Don't show blank screens
function TaskList({ tasks, onCreateTask }: { tasks: Task[]; onCreateTask: () => void }) {
  if (tasks.length === 0) {
    return (
      <div role="status" className="text-center py-12">
        <TasksEmptyIcon className="mx-auto h-12 w-12 text-muted" />
        <h3 className="mt-2 text-sm font-medium">No tasks</h3>
        <p className="mt-1 text-sm text-muted">Get started by creating a new task.</p>
        <Button className="mt-4" onClick={onCreateTask}>Create Task</Button>
      </div>
    );
  }

  return <ul role="list">...</ul>;
}
```

## 반응형 디자인

모바일 우선으로 설계한 다음 확장하세요.

```tsx
// Tailwind: mobile-first responsive
<div className="
  grid grid-cols-1      /* Mobile: single column */
  sm:grid-cols-2        /* Small: 2 columns */
  lg:grid-cols-3        /* Large: 3 columns */
  gap-4
">
```

이 브레이크포인트에서 테스트하세요: 320px, 768px, 1024px, 1440px.

## 로딩과 전환

```tsx
// Skeleton loading (not spinners for content)
function TaskListSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-busy="true" aria-label="Loading tasks">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-12 bg-muted animate-pulse rounded" />
      ))}
    </div>
  );
}

// Optimistic updates for perceived speed
function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: Task[]) =>
        old.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
      );

      return { previous };
    },
    onError: (_err, _taskId, context) => {
      queryClient.setQueryData(['tasks'], context?.previous);
    },
  });
}
```

## 함께 보기

자세한 접근성 요구사항과 테스트 도구는 `../../references/accessibility-checklist.md`를 보세요.

## 흔한 합리화

| 합리화 | 현실 |
|---|---|
| "접근성은 있으면 좋은 것입니다" | 많은 관할에서 법적 요구사항이고, 엔지니어링 품질 기준입니다. |
| "반응형은 나중에 맞추겠습니다" | 반응형 디자인을 나중에 끼워 넣는 일은 처음부터 만드는 것보다 3배 어렵습니다. |
| "디자인이 확정이 아니니 스타일은 건너뛰겠습니다" | 디자인 시스템 기본값을 쓰세요. 스타일이 없는 UI는 리뷰어에게 망가진 첫인상을 줍니다. |
| "이건 프로토타입일 뿐입니다" | 프로토타입은 프로덕션 코드가 됩니다. 기초를 제대로 만드세요. |
| "지금은 AI 미감이어도 괜찮습니다" | 낮은 품질을 신호합니다. 처음부터 프로젝트의 실제 디자인 시스템을 쓰세요. |

## 레드 플래그

- 200줄을 넘는 컴포넌트 (나누세요)
- 인라인 스타일이나 임의의 픽셀 값
- 오류 상태, 로딩 상태, 빈 상태가 빠짐
- 키보드 탐색 테스트를 하지 않음
- 색이 상태의 유일한 표시 (텍스트나 아이콘 없는 빨강/초록)
- 흔한 "AI 모습" (보라 그라데이션, 지나치게 큰 카드, 천편일률적인 레이아웃)

## 검증

UI를 만든 뒤:

- [ ] 컴포넌트가 콘솔 오류 없이 렌더됩니다
- [ ] 모든 상호작용 요소를 키보드로 사용할 수 있습니다 (페이지를 Tab으로 이동)
- [ ] 스크린 리더가 페이지의 콘텐츠와 구조를 전달할 수 있습니다
- [ ] 반응형: 320px, 768px, 1024px, 1440px에서 동작합니다
- [ ] 해당될 때 로딩, 빈 상태, 오류, 성공, 권한 상태를 처리합니다
- [ ] 프로젝트의 디자인 시스템을 따릅니다 (간격, 색, 타이포그래피)
- [ ] 렌더된 결과가 최종 UI 전용 마무리 게이트 리뷰를 통과합니다
- [ ] 개발자 도구나 axe-core에 접근성 경고가 없습니다
