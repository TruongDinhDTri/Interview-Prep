
import { VisualState, AlgorithmScenario } from './algorithm_steps';

const BASE_X = 400;
const BASE_Y = 50;
const GAP_Y = 80;

// Re-using the interface structure from algorithm_steps to maintain consistency
// but keeping the data completely separate.

export const TECHNIQUE_SCENARIOS: Record<string, AlgorithmScenario> = {
  EMPTY_SEARCH: {
    id: 'EMPTY_SEARCH',
    title: 'The Void Search',
    subtitle: 'Searching in an Empty Trie',
    description: `What happens when we search for a word in a freshly planted, empty forest?

### 🗺️ The Strategy
1.  **The Root Exists**: Even in an "empty" Trie, the Root node always exists. It is the soil.
2.  **Immediate Rejection**: The algorithm tries to find the first character (e.g., 'H') in the Root's children.
3.  **The Empty Dictionary**: Since the Root has no children, the check \`if char not in node.children\` triggers immediately.
4.  **Result**: Returns \`False\`.

### 🧠 Mental Model
Imagine walking into an empty room looking for a door labeled "H".
*   You stand in the center (Root).
*   You look around. There are no doors.
*   You immediately know you cannot go further. You don't need to check for "E", "L", "L", "O". The journey ends before it begins.`,
    complexity: "O(1) - Fails on first char",
    code: `def search(self, word: "HELLO"):
    node = self.root
    
    # 1. First iteration
    for char in word: # char = 'H'
        
        # Root has no children!
        if char not in node.children:
            return False
            
        node = node.children[char]
        
    return node.is_end_of_word`,
    steps: [
      {
        lineNo: 2,
        log: "INITIALIZATION: We start at the Root. The Trie is empty, meaning the Root has no edges/children.",
        visual: {
          nodes: [{ id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y + 100, isEnd: false, status: 'active' }],
          links: [],
          pointer: { x: BASE_X + 40, y: BASE_Y + 100, label: 'node' },
          message: "Empty Trie"
        }
      },
      {
        lineNo: 5,
        log: "ATTEMPT 'H': We look for the first letter 'H' in the Root's children map.",
        visual: {
          nodes: [{ id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y + 100, isEnd: false, status: 'visited' }],
          links: [],
          pointer: { x: BASE_X + 40, y: BASE_Y + 100, label: 'node' },
          message: "Check 'H'?"
        }
      },
      {
        lineNo: 8,
        log: "BLOCKADE: `node.children` is empty. 'H' is not found. The if-condition is True.",
        visual: {
          nodes: [{ id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y + 100, isEnd: false, status: 'visited' }],
          links: [],
          pointer: { x: BASE_X + 40, y: BASE_Y + 100, label: 'node' },
          message: "Missing!"
        }
      },
      {
        lineNo: 9,
        log: "RETURN FALSE: We immediately return False. The search is over.",
        visual: {
          nodes: [{ id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y + 100, isEnd: false, status: 'active' }],
          links: [],
          pointer: { x: BASE_X + 40, y: BASE_Y + 100, label: 'Return False' },
          message: "Result: False"
        }
      }
    ]
  },
  EMPTY_INSERT: {
    id: 'EMPTY_INSERT',
    title: 'The Silent Seed',
    subtitle: 'Inserting an Empty String',
    description: `Can you store "nothing"? In a Trie, yes. Inserting an empty string \`""\` is a valid edge case.

### 🗺️ The Strategy
1.  **The Loop that Never Runs**: The loop \`for char in word\` runs 0 times because the length is 0.
2.  **Stay at Root**: The pointer \`node\` starts at Root and never moves.
3.  **Mark the Root**: After the (skipped) loop, we execute \`node.is_end_of_word = True\`.
4.  **Meaning**: This means the "Root" itself is a valid word. It represents the empty string.

### 🧠 Mental Model
Imagine you are told to "Stand still."
*   You step onto the starting mat (Root).
*   You receive 0 instructions to move.
*   You plant your flag right there on the starting mat.
*   You have successfully claimed the "empty space".`,
    complexity: "O(1) - Zero steps",
    code: `def insert(self, word: ""):
    node = self.root
    
    # Loop over characters...
    # But word is empty!
    for char in word:
        if char not in node.children:
            node.children[char] = TrieNode()
        node = node.children[char]
        
    # Mark current node (Root)
    node.is_end_of_word = True`,
    steps: [
      {
        lineNo: 2,
        log: "INITIALIZATION: Start at Root. `word` is an empty string \"\".",
        visual: {
          nodes: [{ id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y + 100, isEnd: false, status: 'active' }],
          links: [],
          pointer: { x: BASE_X + 40, y: BASE_Y + 100, label: 'node' },
          message: "Start: ROOT"
        }
      },
      {
        lineNo: 6,
        log: "SKIPPING LOOP: The code checks `for char in word`. Since `word` has length 0, the loop body is skipped entirely.",
        visual: {
          nodes: [{ id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y + 100, isEnd: false, status: 'visited' }],
          links: [],
          pointer: { x: BASE_X + 40, y: BASE_Y + 100, label: 'node' },
          message: "Loop Skipped"
        }
      },
      {
        lineNo: 12,
        log: "MARKING ROOT: We proceed to `node.is_end_of_word = True`. The Root node itself turns into a 'Word'.",
        visual: {
          nodes: [{ id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y + 100, isEnd: true, status: 'found' }],
          links: [],
          pointer: { x: BASE_X + 40, y: BASE_Y + 100, label: 'node' },
          message: "Root Marked!"
        }
      }
    ]
  },
  PREPROCESSING: {
    id: 'PREPROCESSING',
    title: 'The Weaver (Build)',
    subtitle: 'Preprocessing a Dictionary',
    description: `A Trie is rarely built one word at a time by a user. Usually, we "load" an entire dictionary into it at the start. This is **Preprocessing**.

### 🗺️ The Strategy
1.  **Batch Insertion**: We take a list of words \`["TO", "TE"]\`.
2.  **Iterative Growth**:
    *   Insert "TO": Path T -> O is created.
    *   Insert "TE": Path T is **reused**, then branches to E.
3.  **Result**: A compressed dictionary ready for ultra-fast lookups.

### 🧠 Mental Model
Imagine weaving a basket.
*   You don't just hold one strand of straw.
*   You take the first strand ("TO") and weave it.
*   You take the second strand ("TE"). You align it with the first one as long as they match (T), then weave it in a new direction (E).
*   The basket grows stronger and denser with every word.`,
    complexity: "O(N * L) - N words, Avg Length L",
    code: `def build_trie(words: ["TO", "TE"]):
    trie = Trie()
    
    # Iterate through the dictionary
    for word in words:
        trie.insert(word)
        
    return trie`,
    steps: [
      {
        lineNo: 2,
        log: "INIT: We create a fresh Trie. Root is empty.",
        visual: {
          nodes: [{ id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'active' }],
          links: [],
          message: "New Trie"
        }
      },
      {
        lineNo: 6,
        log: "INSERT 'TO': The first word. We build the path T -> O.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
            { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
            { id: 'o', char: 'O', x: BASE_X - 60, y: BASE_Y + GAP_Y*2, isEnd: true, status: 'found' }
          ],
          links: [
            { source: 'root', target: 't', status: 'default' },
            { source: 't', target: 'o', status: 'active' }
          ],
          pointer: { x: BASE_X - 20, y: BASE_Y + GAP_Y*2, label: 'Inserted TO' },
          message: "Added 'TO'"
        }
      },
      {
        lineNo: 6,
        log: "INSERT 'TE': The second word. We start at Root. 'T' exists, so we traverse it (reuse). 'E' is missing, so we branch.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
            { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'active' },
            { id: 'o', char: 'O', x: BASE_X - 60, y: BASE_Y + GAP_Y*2, isEnd: true, status: 'default' },
            { id: 'e', char: 'E', x: BASE_X + 60, y: BASE_Y + GAP_Y*2, isEnd: true, status: 'found' }
          ],
          links: [
            { source: 'root', target: 't', status: 'active' },
            { source: 't', target: 'o', status: 'default' },
            { source: 't', target: 'e', status: 'active' }
          ],
          pointer: { x: BASE_X + 100, y: BASE_Y + GAP_Y*2, label: 'Inserted TE' },
          message: "Added 'TE'"
        }
      }
    ]
  },
  COMPLEXITY: {
    id: 'COMPLEXITY',
    title: 'The Shortcut (O(k))',
    subtitle: 'Why Trie Search is Faster',
    description: `Why do we say Trie search is **O(k)** (or O(L)) instead of **O(n)**?

### 🗺️ The Strategy
*   **O(n)**: In a list, you must check *every* word. If you have 1 million words, you might check 1 million strings.
*   **O(k)**: In a Trie, you only step down the branch matching your word.
*   **The Cut**: The moment you step into the 'A' branch, you have effectively "ignored" every word starting with B, C, D... Z.

### 🧠 Mental Model
Imagine a Library vs. a Pile of Books.
*   **Pile (List)**: To find "Harry Potter", you pick up book 1, check title. Pick up book 2, check title...
*   **Library (Trie)**: You walk to the "Fantasy" section. You immediately ignore History, Science, and Cooking. You walk to "H". You ignore A-G.
*   The size of the library (N) doesn't matter. Only the length of your walk (k) matters.`,
    complexity: "O(k) where k = word length",
    code: `def search_efficiency(self, word: "A"):
    # Dictionary has 3 words:
    # "A" (Target)
    # "B..." (Ignored)
    # "C..." (Ignored)
    
    node = self.root
    
    # We take 1 step to 'A'.
    # We NEVER visit 'B' or 'C'.
    node = node.children['A']
    
    return node.is_end_of_word`,
    steps: [
      {
        lineNo: 8,
        log: "START: We are at Root. The Trie has 3 branches: A, B, C.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'active' },
            { id: 'a', char: 'A', x: BASE_X - 100, y: BASE_Y + GAP_Y, isEnd: true, status: 'default' },
            { id: 'b', char: 'B', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: true, status: 'default' },
            { id: 'c', char: 'C', x: BASE_X + 100, y: BASE_Y + GAP_Y, isEnd: true, status: 'default' }
          ],
          links: [
            { source: 'root', target: 'a', status: 'default' },
            { source: 'root', target: 'b', status: 'default' },
            { source: 'root', target: 'c', status: 'default' }
          ],
          pointer: { x: BASE_X + 40, y: BASE_Y, label: 'Search A' },
          message: "Trie Loaded"
        }
      },
      {
        lineNo: 12,
        log: "THE SHORTCUT: We step to 'A'. Notice we simply DO NOT TOUCH 'B' or 'C'. In a list, we might have had to compare them.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
            { id: 'a', char: 'A', x: BASE_X - 100, y: BASE_Y + GAP_Y, isEnd: true, status: 'found' },
            { id: 'b', char: 'B', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: true, status: 'visited' }, // Visited color here implies "Inactive/Ghost"
            { id: 'c', char: 'C', x: BASE_X + 100, y: BASE_Y + GAP_Y, isEnd: true, status: 'visited' }
          ],
          links: [
            { source: 'root', target: 'a', status: 'active' },
            { source: 'root', target: 'b', status: 'default' },
            { source: 'root', target: 'c', status: 'default' }
          ],
          pointer: { x: BASE_X - 60, y: BASE_Y + GAP_Y, label: 'Found A' },
          message: "Ignored B & C"
        }
      }
    ]
  }
};
