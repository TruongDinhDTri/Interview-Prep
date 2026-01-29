# LeetCode 78: Subsets

## 1. Problem Explanation

**The Goal:** Given a set of *unique* numbers (e.g., `[1, 2, 3]`), find **every possible collection** of these numbers. This includes the empty set `[]` and the full set itself `[1, 2, 3]`.

**Key Concepts:**

- **"Power Set":** Another name for finding all subsets.
- **Order Doesn't Matter:** `[1, 3]` is the same as `[3, 1]`.
- **Distinct Integers:** The input has no duplicates (crucial for this version).

**The Core Question:** For every single number in the list, you have exactly two choices:

1. **Include it** in your current group.
2. **Exclude it** (leave it behind).

---

## 2. Phase Analysis (Thinking Log)

### Phase 1: Identifying the Pattern

- **Initial Confusion:** "Is this a subset problem?"
- **Signal:** The keywords "Find all distinct" and "Subsets" strongly suggest **Backtracking**.
- **The Mental Model:** The "Decision Tree". We visualized walking through the array `[1, 5, 3]`.
  At each number, the path splits into two branches: YES (Include) and NO (Exclude).

### Phase 2: Building the Recursion State

- **Question:** What does the helper function need to know?
- **Analogy:** Reading a book.
  - `nums`: The book itself.
  - `subset`: The notes we are currently taking.
  - `index`: The **page number** we are on.
- **Consensus:** We need `backtrack(index, subset)`.

### Phase 3: The "Reference vs. Snapshot" Struggle (Crucial Aha! Moment) 🧠

- **The Bug:** `result.append(subset)`
- **The Symptom:** The result list ended up full of empty lists or identical modified lists: `[[], [], []]`.
- **The Realization:**
  - **Reference (`subset`):** Like a camera pointing at a "Live Scene". When the scene changes (backtracking), the view in the camera changes.
  - **Copy (`subset[:]`):** Like taking a **Snapshot (Photo)**. Even if the live scene changes later, the photo remains frozen in time.
  - **Fix:** We must use `result.append(subset[:])` to save the state *at that specific moment*.

### Phase 4: Tree Visualization Misunderstanding

- **Confusion:** The visualization seemed "wrong" because the `index` in the diagram node didn't match the number being included *inside* the function.
- **Clarification:**
  - **Edge (Line):** The *Action* (calling the function with `index + 1`).
  - **Node (Box):** The *State* (where we are *after* the call).
  - The action `Include 1` happens at `index=0`, transitioning us to the state `index=1`.

---

## 3. Step-by-Step Guidance (How to Think)

### Step 1: Define the State

"Where am I, and what have I collected so far?"

- You need an index to track progress.
- You need a list to track the current subset.

### Step 2: Establish the Base Case (The Stop Sign)

"When do I stop making decisions?"

- When `index == len(nums)`, you've said Yes or No to every number.
- **Action:** Take a snapshot (`subset[:]`) and add it to the result. Return.

### Step 3: The "Include" Branch

"What happens if I take this number?"

- `subset.append(nums[index])`
- Move forward: `backtrack(index + 1, subset)`

### Step 4: The Backtrack (Undo)

"I'm done with the 'Yes' path. I need to go back up to explore the 'No' path."

- **Crucial Step:** `subset.pop()`
- This cleans the slate. Without this, the 'No' branch would still have the number from the 'Yes' branch!

### Step 5: The "Exclude" Branch

"What happens if I skip this number?"

- Move forward without adding anything: `backtrack(index + 1, subset)`

---

## 4. Final Solution

```python
class Solution:
    def subsets(self, nums):
        result = []
      
        def backtrack(index, subset):
            # Base Case: If we've considered every number (reached the end)
            if index == len(nums):
                result.append(subset[:]) # 📸 CRITICAL: Take a snapshot (Copy)
                return
          
            # Choice 1: INCLUDE the current number
            subset.append(nums[index])
            backtrack(index + 1, subset)
          
            # Backtrack: Undo the choice to explore the other path
            subset.pop()
          
            # Choice 2: EXCLUDE the current number
            backtrack(index + 1, subset)
      
        # Start the recursion from the 0th index with an empty subset
        backtrack(0, [])
      
        return result
```

**Complexity:**

- **Time:** $O(N \times 2^N)$ — We generate $2^N$ subsets, and each subset can take $O(N)$ to copy.
- **Space:** $O(N)$ — The depth of the recursion tree is $N$.

---

## 5. Errors, Misunderstandings & Mistakes

### 1. The Reference Bug (Major)

- **Mistake:** `result.append(subset)`
- **Why it failed:** Python lists are mutable references. Modifying `subset` later (via `pop()`) changed the versions already stored in `result`.
- **Lesson:** Always use `[:]` (slicing) or `.copy()` when storing a mutable state during recursion.

### 2. Scope & Indentation (Syntax)

- **Mistake:**
  ```python
  backtrack(0, [])
  return result # Un-indented
  ```
- **Why it failed:** `return` was outside the function scope, causing a `SyntaxError`.
- **Fix:** Align `return result` inside the `subsets` function.

### 3. Naming Convention (Runtime)

- **Mistake:** Defining `def find_subsets(self, nums):` instead of `def subsets(self, nums):`.
- **Why it failed:** The LeetCode driver (test runner) looks for a specific function name.
- **Lesson:** Always match the template signature exactly.

### 4. Conceptual: "Why do we need Sort & Skip?" (Preview of Subsets II)

- **Confusion:** You questioned why we need to handle duplicates (`2A` vs `2B`).
- **Status:** *Unresolved in this session.* This is the bridge to the next problem (Subsets II), where `[1, 2]` (from 2A) and `[1, 2]` (from 2B) would be duplicates.

---

*Archived by Hadriel based on Session Log 2026-01-28*

```

```
