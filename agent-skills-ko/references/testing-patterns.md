# 테스트 패턴 참조 (JavaScript/TypeScript)

JavaScript/TypeScript 테스트 패턴의 빠른 참조입니다. Jest, React Testing Library, Supertest, Playwright를 다루며, `test-driven-development` 스킬의 보편 원칙을 보여 줍니다. 원칙(Arrange-Act-Assert, 이름 짓기, 목 규율, 안티 패턴)은 어떤 생태계에도 적용됩니다. 여기에 나온 문법과 도구는 JS/TS 전용입니다. 다른 스택에서는 같은 원칙을 따르되, 그 저장소의 테스트 프레임워크와 명령을 사용하세요.

## 목차

- [테스트 구조 (Arrange-Act-Assert)](#테스트-구조-arrange-act-assert)
- [테스트 이름 규칙](#테스트-이름-규칙)
- [자주 쓰는 어서션](#자주-쓰는-어서션)
- [목 패턴](#목-패턴)
- [React/컴포넌트 테스트](#react컴포넌트-테스트)
- [API / 통합 테스트](#api--통합-테스트)
- [E2E 테스트 (Playwright)](#e2e-테스트-playwright)
- [테스트 안티 패턴](#테스트-안티-패턴)

## 테스트 구조 (Arrange-Act-Assert)

```typescript
it('describes expected behavior', () => {
  // Arrange: Set up test data and preconditions
  const input = { title: 'Test Task', priority: 'high' };

  // Act: Perform the action being tested
  const result = createTask(input);

  // Assert: Verify the outcome
  expect(result.title).toBe('Test Task');
  expect(result.priority).toBe('high');
  expect(result.status).toBe('pending');
});
```

## 테스트 이름 규칙

```typescript
// Pattern: [unit] [expected behavior] [condition]
describe('TaskService.createTask', () => {
  it('creates a task with default pending status', () => {});
  it('throws ValidationError when title is empty', () => {});
  it('trims whitespace from title', () => {});
  it('generates a unique ID for each task', () => {});
});
```

## 자주 쓰는 어서션

```typescript
// Equality
expect(result).toBe(expected);           // Strict equality (===)
expect(result).toEqual(expected);        // Deep equality (objects/arrays)
expect(result).toStrictEqual(expected);  // Deep equality + type matching

// Truthiness
expect(result).toBeTruthy();
expect(result).toBeFalsy();
expect(result).toBeNull();
expect(result).toBeDefined();
expect(result).toBeUndefined();

// Numbers
expect(result).toBeGreaterThan(5);
expect(result).toBeLessThanOrEqual(10);
expect(result).toBeCloseTo(0.3, 5);      // Floating point

// Strings
expect(result).toMatch(/pattern/);
expect(result).toContain('substring');

// Arrays / Objects
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(object).toHaveProperty('key', 'value');

// Errors
expect(() => fn()).toThrow();
expect(() => fn()).toThrow(ValidationError);
expect(() => fn()).toThrow('specific message');

// Async
await expect(asyncFn()).resolves.toBe(value);
await expect(asyncFn()).rejects.toThrow(Error);
```

## 목 패턴

### 목 함수

```typescript
const mockFn = jest.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue({ data: 'test' });
mockFn.mockImplementation((x) => x * 2);

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(3);
```

### 목 모듈

```typescript
// Mock an entire module
jest.mock('./database', () => ({
  query: jest.fn().mockResolvedValue([{ id: 1, title: 'Test' }]),
}));

// Mock specific exports
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  generateId: jest.fn().mockReturnValue('test-id'),
}));
```

### 경계에서만 목하기

```
Mock these:                    Don't mock these:
├── Database calls             ├── Internal utility functions
├── HTTP requests              ├── Business logic
├── File system operations     ├── Data transformations
├── External API calls         ├── Validation functions
└── Time/Date (when needed)    └── Pure functions
```

## React/컴포넌트 테스트

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

describe('TaskForm', () => {
  it('submits the form with entered data', async () => {
    const onSubmit = jest.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    // Find elements by accessible role/label (not test IDs)
    await screen.findByRole('textbox', { name: /title/i });
    fireEvent.change(screen.getByRole('textbox', { name: /title/i }), {
      target: { value: 'New Task' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ title: 'New Task' });
    });
  });

  it('shows validation error for empty title', async () => {
    render(<TaskForm onSubmit={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });
});
```

## API / 통합 테스트

```typescript
import request from 'supertest';
import { app } from '../src/app';

describe('POST /api/tasks', () => {
  it('creates a task and returns 201', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task' })
      .set('Authorization', `Bearer ${testToken}`)
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      title: 'Test Task',
      status: 'pending',
    });
  });

  it('returns 422 for invalid input', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: '' })
      .set('Authorization', `Bearer ${testToken}`)
      .expect(422);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 401 without authentication', async () => {
    await request(app)
      .post('/api/tasks')
      .send({ title: 'Test' })
      .expect(401);
  });
});
```

## E2E 테스트 (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('user can create and complete a task', async ({ page }) => {
  // Navigate and authenticate
  await page.goto('/');
  await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
  await page.getByLabel(/password/i).fill('testpass123');
  await page.getByRole('button', { name: /log in/i }).click();

  // Create a task
  await page.getByRole('button', { name: /new task/i }).click();
  await page.getByRole('textbox', { name: /title/i }).fill('Buy groceries');
  await page.getByRole('button', { name: /create/i }).click();

  // Verify task appears
  // listitem has no accessible name from its content, so filter by text
  const task = page.getByRole('listitem').filter({ hasText: /buy groceries/i });
  await expect(task).toBeVisible();

  // Complete the task
  await task.getByRole('checkbox', { name: /complete buy groceries/i }).check();
  await expect(task).toHaveCSS('text-decoration-line', 'line-through');
});
```

## 테스트 안티 패턴

| 안티 패턴 | 문제 | 더 나은 접근 |
|---|---|---|
| 구현 세부 사항을 테스트함 | 리팩터하면 깨집니다 | 입력과 출력을 테스트하세요 |
| 모든 것을 스냅샷함 | 아무도 스냅샷 diff를 리뷰하지 않습니다 | 구체적인 값을 어서션하세요 |
| 공유되는 변경 가능 상태 | 테스트가 서로를 오염시킵니다 | 테스트마다 setup과 teardown을 두세요 |
| 서드파티 코드를 테스트함 | 시간을 낭비하고, 우리 버그가 아닙니다 | 경계를 목하세요 |
| CI를 통과시키려고 테스트를 건너뜀 | 실제 버그를 숨깁니다 | 테스트를 고치거나 삭제하세요 |
| `test.skip`을 영구적으로 사용함 | 죽은 코드입니다 | 제거하거나 고치세요 |
| 지나치게 넓은 어서션 | 회귀를 잡지 못합니다 | 구체적으로 작성하세요 |
| 비동기 오류 처리가 없음 | 오류가 삼켜지고 거짓으로 통과합니다 | 비동기 테스트는 항상 `await` 하세요 |
