// kubejs_src/kubejs-helper.d.ts

/**
 * Deeply extracts the event object type from any KubeJS event method,
 * supporting standard callbacks, IDs, and Java Consumer interfaces.
 */
type KubeEvent<T extends (...args: any[]) => any> = FindEvent<Parameters<T>>;

// Background worker that hunts down the event parameter dynamically
type FindEvent<Args extends any[]> = 
    Args extends [infer First, ...infer Rest]
        ? First extends (...args: infer CBArgs) => any
            ? CBArgs[0] // Found a standard JS function callback!
            : First extends { accept(arg: infer E): any }
                ? E // Found a Java Consumer interface callback!
                : FindEvent<Rest> // Not a callback (likely an ID string), check the next argument!
        : unknown;