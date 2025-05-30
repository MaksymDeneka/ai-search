import { z } from 'zod';

export type TAnyToolDefinitionArray = Array<
  ToolDefinition<string, z.AnyZodObject>
>;

export type TAnyToolDefinitionMap = Readonly<{
  [K in string]: ToolDefinition<any, any>;
}>;

export type TToolDefinitionMap<
  TToolDefinitionArray extends TAnyToolDefinitionArray,
> = TToolDefinitionArray extends [infer TFirst, ...infer Rest]
  ? TFirst extends TAnyToolDefinitionArray[number]
    ? Rest extends TAnyToolDefinitionArray
      ? Readonly<{ [K in TFirst['name']]: TFirst }> & TToolDefinitionMap<Rest>
      : never
    : never
  : Readonly<{}>;

export interface ToolDefinition<
  NAME extends string,
  PARAMETERS extends z.AnyZodObject,
> {
  name: NAME;
  description?: string;
  parameters: PARAMETERS;
}
