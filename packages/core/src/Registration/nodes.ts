import { Resolver, UserComponent } from "@craftjs/core";

export type UserComponentMap = { [key: string]: UserComponent | string };
const craftJSNodes: UserComponentMap = {};

export function registerNode(name: string, node: UserComponent) {

    craftJSNodes[name] = node;
}

export function usePageDesignerResolver(): UserComponentMap {
    return craftJSNodes;
}