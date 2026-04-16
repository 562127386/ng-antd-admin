import {NzTreeNode} from "ng-zorro-antd/core/tree";

export function calcChecks(nodes: NzTreeNode[]): any[] {
    const arr: any[] = [];

    function putParents(node: NzTreeNode): void {
        const parent = node.getParentNode();
        if (parent) {
            arr.push(parent.key);
            putParents(parent);
        }
    }

    function putChildren(node: NzTreeNode): void {
        const children = node.getChildren();
        if (children && children.length > 0) {
            for (const child of children) {
                putChildren(child);
                arr.push(child.key);
            }
        }
    }

    for (const node of nodes) {
        arr.push(node.key);
        if (node.isChecked) {
            putParents(node);
        }
        putChildren(node);
    }

    return arr;
}