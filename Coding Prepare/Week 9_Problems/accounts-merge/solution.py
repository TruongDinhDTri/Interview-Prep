"""
Accounts Merge — LeetCode #721
Pattern: Connected Components (graph DFS) — same muscle as Number of Islands.

THE 3 PHASES (Blueprint — Step 4 Phase 1, comments first):
  PHASE 1  build adjacency list (email -> neighbor emails) + email -> name
  PHASE 2  DFS from each unvisited email -> gather one connected component (= 1 person)
  PHASE 3  for each component: attach name + sort emails -> output row
"""
from collections import defaultdict


class Solution:
    def accountsMerge(self, accounts):
        # ── PHASE 1: BUILD THE GRAPH ────────────────────────────────
        adj = defaultdict(set)        # email -> set of neighbor emails (the bridges)
        email_to_name = {}            # email -> person's name (grab it while we're here)

        for account in accounts:
            name = account[0]
            emails = account[1:]
            for email in emails:
                email_to_name[email] = name
                # Add email links to email 0 ?
                adj[email].add(emails[0])
                adj[emails[0]].add(email)

        # ── PHASE 2: DFS — GATHER CONNECTED COMPONENTS ──────────────
        visited = set()
        result = []
        for email in adj:
            if email not in visited:
                component = []
                # mark visited, append to component, recurse into adj[email]
                def dfs(email):
                    visited.add(email)
                    component.append(email) 
                    for neighbor in adj[email]:
                        if neighbor not in visited:
                            dfs(neighbor)
                        else:
                            continue
                dfs(email)
                result.append(component)   # one island = one person's emails

        # ── PHASE 3: FORMAT OUTPUT ──────────────────────────────────
        final_ouput = []
        for component in result:
            name = email_to_name[component[0]]   # any email gives the name
            row = [name] + sorted(component)
            final_ouput.append(row)
        return final_ouput


# quick local test (uncomment once implemented)
# print(Solution().accountsMerge([
#     ["John","johnsmith@mail.com","john_newyork@mail.com"],
#     ["John","johnsmith@mail.com","john00@mail.com"],
#     ["Mary","mary@mail.com"],
#     ["John","johnnybravo@mail.com"],
# ]))
