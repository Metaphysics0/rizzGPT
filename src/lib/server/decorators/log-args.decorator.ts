export type LogArgsOptions = {
  label?: string;
  formatArgs?: (args: unknown[]) => unknown;
};

export function logArgs(options?: LogArgsOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
  ) {
    const originalMethod = descriptor.value!;
    const label = options?.label ?? "Service";
    const methodName = propertyKey;

    descriptor.value = function (this: unknown, ...args: any[]) {
      const argsData = options?.formatArgs ? options.formatArgs(args) : args;
      console.log(`[${label}] ${methodName} args: ${JSON.stringify(argsData)}`);
      return originalMethod.apply(this as any, args);
    } as unknown as (...args: any[]) => any;

    return descriptor;
  };
}
