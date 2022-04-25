const events = global.__$NEXT_SAAS_CACHE__.events;

export type EventHandler<T> = (event?: T) => void | Promise<void>;
export type EventRemovalCallback = () => void;

export const on = <T = any>(type: string, handler: EventHandler<T>): EventRemovalCallback => {
  (events[type] || (events[type] = [])).push(handler);

  return () => off(type, handler);
};

export const off = <T = any>(type: string, handler: EventHandler<T>) => {
  if (events[type]) {
    events[type].splice(events[type].indexOf(handler) >>> 0, 1);
  }
};

export const emit = async <T = any>(type: string, event?: T) => {
  return Promise.all((events[type] || []).slice().map((handler: EventHandler<T>) => handler(event)));
};
