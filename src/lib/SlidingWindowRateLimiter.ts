class Node<T> {
  value: T;
  prev: Node<T> | null = null;
  next: Node<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

class Deque<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  private _size = 0;

  get size(): number {
    return this._size;
  }

  pushBack(value: T): void {
    const node = new Node(value);
    if (this.tail) {
      this.tail.next = node;
      node.prev = this.tail;
    } else {
      this.head = node;
    }
    this.tail = node;
    this._size++;
  }

  popFront(): T | undefined {
    if (!this.head) return undefined;
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }
    this._size--;
    return value;
  }

  peekFront(): T | undefined {
    return this.head?.value;
  }
}

export class SlidingWindowRateLimiter {
  private store = new Map<string, Deque<number>>();

  constructor(
    private readonly windowMs: number,
    private readonly maxRequests: number
  ) {}

  isAllowed(key: string): { allowed: boolean; retryAfterMs: number } {
    const now = Date.now();
    let deque = this.store.get(key);
    if (!deque) {
      deque = new Deque<number>();
      this.store.set(key, deque);
    }

    // Evict timestamps outside the window — each entry is enqueued and
    // dequeued exactly once, so this loop is O(1) amortized per request
    while (deque.size > 0 && deque.peekFront()! <= now - this.windowMs) {
      deque.popFront();
    }

    if (deque.size < this.maxRequests) {
      deque.pushBack(now);
      return { allowed: true, retryAfterMs: 0 };
    }

    const oldestTimestamp = deque.peekFront()!;
    const retryAfterMs = oldestTimestamp + this.windowMs - now;
    return { allowed: false, retryAfterMs };
  }
}
