import configuration from "../../content-collections.ts";
import { GetTypeByName } from "@content-collections/core";

export type Mix = GetTypeByName<typeof configuration, "mixes">;
export declare const allMixes: Array<Mix>;

export {};
