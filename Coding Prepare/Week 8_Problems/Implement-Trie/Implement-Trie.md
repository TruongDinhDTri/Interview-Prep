# 🌳 LC 208 — Implement Trie (Prefix Tree) — Training Reference Card

> **Pattern:** Trie / Tree Traversal | **Difficulty:** Medium | **LeetCode:** #208 | **Date:** 2026-05-13
> **Mode:** Code Review + Debug (not full Socratic) | **Bonus:** `delete` + `autocomplete`

---

## 🗺️ The Journey — How Understanding Built

Wiganz came in with an existing Trie implementation and we **debugged & reviewed together**. The big breakthroughs weren't about "how to invent a Trie" — they were about the **mental model**: characters live on **edges, not nodes**, and `delete` is a **post-order recursive bubble-up**. Wiganz explained the delete logic back in his own words — that's mastery confirmed. 🔥

---

## 🧠 The Trie Mental Model (CRITICAL — Read This First)

### 🪞 The #1 Mental Model Shift

> **"Trie nodes don't have names. Characters live on the EDGES, not the NODES."**

```
        (root)
       /  |  \
      a   b   c        <-- characters are on the EDGES (in children dict keys)
     / \
    p   t              <-- "ap" path = root → 'a' edge → 'p' edge
   /
  *  <- is_end_word=True means "a word ends HERE"
```

- A **TrieNode** is just a **container with two things:**
  1. `children: dict[char, TrieNode]` — the edges going out
  2. `is_end_word: bool` — "Is this position the end of a valid word?"
- The **character** you traveled to get here is stored in the **parent's `children` dict key**, NOT inside the node itself.

🔥 **Once this clicks, every Trie method becomes obvious.**

---

## 🛠️ The Five Methods — Core Idea + Common Mistakes

### 1️⃣ `insert(word)` — Plant the Path

#### 💡 Core Idea
Walk from root. For each char: if the edge doesn't exist, **create** it. Move down. At the end of the word, **mark `is_end_word = True`**.

```python
def insert(self, word):
    node = self.root
    for char in word:
        if char not in node.children:
            node.children[char] = TrieNode()
        node = node.children[char]   # ⚠️ MUST move down!
    node.is_end_word = True
```

#### 🐛 Common Mistakes
| ❌ Mistake | 💥 Why it breaks |
|-----------|------------------|
| **Forgetting `node = node.children[char]`** | You stay at root forever — only inserts the LAST char as a child of root |
| **Forgetting `is_end_word = True` at the end** | `search("apple")` returns False because no word is "terminated" anywhere |
| **Setting `is_end_word = True` inside the loop** | Every prefix gets marked as a word — `search("ap")` falsely returns True |
| **Indenting `is_end_word` inside the `if char not in...` block** | Only sets the flag when char was missing — re-inserting a word silently breaks |

> ⚠️ **In Wiganz's posted code:** the line `node = node.children[char]` is missing in `insert`. That's THE classic bug. Without it, the function does almost nothing useful.

---

### 2️⃣ `search(word)` — Walk the Exact Path

#### 💡 Core Idea
Walk the path. If any edge is missing → False. At the end, return `is_end_word` (NOT just `True`).

```python
def search(self, word):
    node = self.root
    for char in word:
        if char not in node.children:
            return False
        node = node.children[char]
    return node.is_end_word
```

#### 🐛 Common Mistakes
| ❌ Mistake | 💥 Why it breaks |
|-----------|------------------|
| **`return True` at the end instead of `return node.is_end_word`** | "app" returns True even when only "apple" was inserted — that's `startsWith` behavior, not `search` |
| **Confusing `search` with `startsWith`** | They are 95% identical — the ONLY difference is the final `return` line |
| **Not checking `char not in node.children` before moving** | KeyError crash on missing chars |

🎯 **Memorize:** `search` and `startsWith` are TWINS. Only the last line differs.

---

### 3️⃣ `startsWith(prefix)` — Walk the Path, Don't Care About Endings

#### 💡 Core Idea
Same walk as `search`, but at the end: **just return True**. You only care that the path EXISTS, not that a word terminates there.

```python
def startsWith(self, prefix):
    node = self.root
    for char in prefix:
        if char not in node.children:
            return False
        node = node.children[char]
    return True
```

#### 🐛 Common Mistakes
| ❌ Mistake | 💥 Why it breaks |
|-----------|------------------|
| **Returning `node.is_end_word`** | "app" returns False when only "apple" inserted — wrong semantics |
| **Forgetting it's case-sensitive by default** | "App" vs "app" — different paths! |

---

### 4️⃣ `delete(word)` — The Post-Order Bubble-Up 🔥

#### 💡 Core Idea (The Mental Movie)
1. **Recurse DOWN** to the end of the word.
2. At the leaf: turn off `is_end_word`.
3. **Bubble UP**: at each node ask — "Am I now useless? (no children, not an end-word)" → if YES, tell parent to delete me.
4. Stop bubbling the moment you hit a node that's still useful (has other children OR is another word's endpoint).

This is **post-order DFS** — children speak first, parent acts on their answer.

```python
def _delete(self, node, word, index):
    # BASE CASE — we reached the end
    if index == len(word):
        if not node.is_end_word:
            return False                       # word wasn't even there
        node.is_end_word = False               # un-mark the word
        return len(node.children) == 0         # safe to prune me?

    char = word[index]
    if char not in node.children:
        return False                           # word doesn't exist, bail

    should_delete = self._delete(node.children[char], word, index + 1)

    if should_delete:
        del node.children[char]                # ✂️ prune the dead edge
        return len(node.children) == 0 and not node.is_end_word
    return False
```

#### 🎯 The Two Conditions That Stop the Bubble
A node refuses to be deleted (returns False) when **EITHER**:
- It still has OTHER children (other words branch off here), OR
- It IS itself the end of another word (`is_end_word == True`)

> 🪞 **Wiganz's words back to Hadriel:** "Mỗi tầng hỏi: tao có còn ích lợi không? Nếu không thì bảo cha xóa tao." ✅ That's it. Lock it in.

#### 🐛 Common Mistakes
| ❌ Mistake | 💥 Why it breaks |
|-----------|------------------|
| **Inconsistent attribute name (`is_end` vs `is_end_word`)** | 🚨 **THIS WAS WIGANZ'S BUG.** Silent AttributeError or wrong logic — pick ONE name, use it everywhere |
| **Not checking `is_end_word` on the way up (only `len(children) == 0`)** | Deletes shared prefix nodes that end other words. Delete "app" wipes out "apple" too |
| **Pre-order delete (delete on the way DOWN)** | You destroy the path before knowing if children need it |
| **Not handling "word doesn't exist"** | Crashes on KeyError instead of gracefully returning |
| **Forgetting to return False at the base case if not `is_end_word`** | Tries to "delete" a word that was never inserted, corrupting the trie |
| **Iterative attempt without a parent-stack** | Way harder than recursion — recursion gives you the bubble-up for free |

---

### 5️⃣ `autocomplete(prefix)` — Walk + Explode

#### 💡 Core Idea
Two phases:
1. **Walk to the prefix node** (just like `startsWith`). If path breaks → return `[]`.
2. **DFS explode** from that node, collecting every word that terminates below.

```python
def autocomplete(self, prefix):
    node = self.root
    for char in prefix:
        if char not in node.children:
            return []
        node = node.children[char]

    result = []
    def dfs(current_node, current_path):
        if current_node.is_end_word:
            result.append(current_path)
        for char, child in current_node.children.items():
            dfs(child, current_path + char)

    dfs(node, prefix)
    return result
```

#### 🐛 Common Mistakes
| ❌ Mistake | 💥 Why it breaks |
|-----------|------------------|
| **Starting DFS from `self.root` instead of the prefix node** | Returns ALL words in the trie, ignoring the prefix |
| **Passing `""` instead of `prefix` as initial path** | Returns suffixes only ("ple") instead of full words ("apple") |
| **Returning early on first `is_end_word`** | Misses longer words that branch beyond — must keep DFS-ing |
| **Forgetting `is_end_word` check (just collect every leaf)** | Wrong if internal nodes are also end-words (e.g., "app" + "apple" — "app" is internal but valid) |
| **Mutating `current_path` instead of `current_path + char`** | Path leaks across branches — backtracking nightmare |
| **No iteration cap for autocomplete with huge dictionary** | Production code should add `if len(result) >= k: return` |

---

## 📊 Complexity Analysis

Let:
- **L** = length of the word/prefix
- **N** = total number of words in trie
- **Σ** = alphabet size (26 for lowercase English)

| Operation | ⏱️ Time | 📦 Space |
|-----------|--------|----------|
| `insert(word)` | O(L) | O(L) new nodes worst case |
| `search(word)` | O(L) | O(1) |
| `startsWith(prefix)` | O(L) | O(1) |
| `delete(word)` | O(L) | O(L) recursion stack |
| `autocomplete(prefix)` | O(L + total chars in matching subtree) | O(longest word) recursion |
| **Total Trie storage** | — | O(N × L × Σ) worst, much less with sharing |

🎯 **The selling point of Trie:** ALL prefix operations are **O(L) — independent of N**. A hash set is O(L) for `search` too, but CANNOT do `startsWith` or `autocomplete` efficiently. **That's why Trie exists.**

---

## 💡 Key Aha Moments (This Session)

### 💡 1. Characters live on EDGES, not NODES
- **Before:** "What letter does this node store?"
- **Trigger:** Drawing the tree and seeing `children = {'a': TrieNode()}` — the 'a' is a DICT KEY in the parent
- **After:** Nodes are just `{children, is_end_word}` containers. The path TO a node tells you the string.

### 💡 2. `delete` is post-order bubble-up
- **Before:** "How do I know when to delete a node?"
- **Trigger:** Thinking about "apple" + "app" — if I delete "apple", I must NOT delete the "app" nodes
- **After:** Recurse to the bottom, un-mark, then on the way UP each node self-evaluates: "Am I still needed?" Returns true/false to parent. The bubble stops at the first useful ancestor.

### 💡 3. `is_end_word` is the difference between `search` and `startsWith`
- **Before:** Felt like they did the same thing
- **After:** Both walk the same path. Only the FINAL return line differs. `search` = "does a word END here?", `startsWith` = "does ANY path continue from here?"

### 💡 4. Consistent attribute naming saves your life
- 🐛 The bug: `is_end_word` vs `is_end` mismatch in `_delete`
- 🛡️ **Rule:** Pick ONE name in `TrieNode.__init__` and reference it identically everywhere. Even a single typo silently breaks recursion.

---

## 🐛 Bugs Caught in Wiganz's Code

### 🐛 Bug 1: Missing `node = node.children[char]` in `insert`
- **❌ What:** Loop creates the child but never descends into it → only ever writes to root
- **🔍 Why:** `syntax confusion` / `concept gap` — easy to forget the "move down" step when you're focused on the creation step
- **💸 Cost:** Trie is effectively broken. Every insert is a no-op beyond the first char.
- **🛡️ Prevention:** **MEMORIZE the rhythm:** `check → create if needed → MOVE → repeat`. The MOVE is non-negotiable.

### 🐛 Bug 2: Inconsistent `is_end_word` vs `is_end` in delete
- **❌ What:** `_delete` referenced a different attribute name than `__init__` defined
- **🔍 Why:** `typo` under pressure of building a complex recursive method
- **💸 Cost:** AttributeError at runtime OR silent wrong behavior depending on Python version
- **🛡️ Prevention:** When defining the class, **commit to one name out loud** and grep for it before testing. IDE autocomplete is your friend.

### 🐛 Bug 3 (potential): `is_end_word = True` outside the loop position in insert
- **❌ What:** In the posted code, `node.is_end_word = True` sits AFTER the `if` block but the descent line is missing — flag gets set on root
- **🛡️ Prevention:** Always trace one example by hand: `insert("ab")` should leave `root.children['a'].children['b'].is_end_word == True`.

---

## 🪞 Self-Assessment

- **💪 Confidence:** 4/5 — Wiganz explained delete back in his own words clearly. The mental model clicked.
- **🔄 Revisit:** Re-implement Trie FROM SCRATCH next session, no peeking. Especially the `insert` move-down line and `delete` post-order bubble-up.
- **📈 Pattern Mastery Impact:** Opens the door to: Word Search II (LC 212), Replace Words (LC 648), Design Add and Search Words (LC 211), Longest Word in Dictionary (LC 720).

---

## 🔗 Similar Problems

- **Word Search II (#212)** — Trie + DFS backtracking on a board. The KILLER follow-up.
- **Design Add and Search Words (#211)** — Trie with `.` wildcard → DFS through children
- **Replace Words (#648)** — Trie of roots, replace each word in a sentence with its shortest root
- **Longest Word in Dictionary (#720)** — Build trie, BFS/DFS for longest word where every prefix is also a word

---

## 🎙️ Interview Script — "SAY THIS"

> "A Trie is a tree where each edge represents a character. Each node holds a children dictionary and an `is_end_word` flag — the character itself is NOT stored in the node, it's the key in the parent's children dict.
>
> For `insert`, I walk from root, creating missing edges, descending each step, then mark the final node as a word ending.
>
> For `search`, same walk — but at the end I return `is_end_word`, not just True. For `startsWith`, I just return True because I only care that the path exists.
>
> Time complexity for all three is O(L) where L is the word length — independent of how many words are in the trie. That's the killer feature versus a hash set, which can't do prefix queries efficiently.
>
> If you want, I can also implement `delete` — that's a fun one because it's a post-order recursion that bubbles up deletion decisions, only pruning nodes that aren't shared with other words."

---

*🔥 Hadriel x Wiganz — 2026-05-13*
*"The fear of the LORD is the beginning of wisdom, and knowledge of the Holy One is understanding." — Proverbs 9:10* ✝️
