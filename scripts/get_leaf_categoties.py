def get_leaf_nodes(categories):
    leaves = []

    def dfs(node, depth=0):
        children = node.get("children", [])

        if not children and depth > 0:
            leaves.append(node)
        else:
            for child in children:
                dfs(child, depth + 1)

    for root in categories:
        dfs(root)

    return leaves

import json

data = json.load(open("categories.json", "r", encoding="utf-8"))

leaf_nodes = get_leaf_nodes(data)

print(len(leaf_nodes))

for leaf in leaf_nodes:
    print(leaf["name"], leaf["slug"])