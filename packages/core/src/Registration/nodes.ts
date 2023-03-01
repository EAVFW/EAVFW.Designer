import { Resolver, UserComponent } from "@craftjs/core";

export type UserComponentMap = { [key: string]: UserComponent | string };
const craftJSNodes: UserComponentMap = {};

export function registerNode(name: string, node: UserComponent) {

    craftJSNodes[name] = node;
}

export function usePageDesignerResolver(): UserComponentMap {
    return craftJSNodes;
}

export function registredName(u: UserComponent) {

    return Object.entries(craftJSNodes).filter(([x, y]) => y == u)[0]?.[0];
}