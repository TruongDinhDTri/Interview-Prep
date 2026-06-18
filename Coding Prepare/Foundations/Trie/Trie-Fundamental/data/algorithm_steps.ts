
export interface VisualState {
  nodes: { id: string; char: string; x: number; y: number; isEnd: boolean; status: 'default' | 'active' | 'visited' | 'ghost' | 'found' }[];
  links: { source: string; target: string; status: 'default' | 'active' }[];
  pointer?: { x: number; y: number; label: string };
  message: string;
}

export interface AlgorithmStep {
  lineNo: number; // 1-based index matching the code string
  visual: VisualState;
  log: string;
}

export interface AlgorithmScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  complexity: string;
  code: string;
  steps: AlgorithmStep[];
}

const BASE_X = 400;
const BASE_Y = 50;
const GAP_Y = 80;

export const ALGORITHM_SCENARIOS: Record<string, AlgorithmScenario> = {
  BASIC: {
    id: 'BASIC',
    title: 'The Blueprint (Basic)',
    subtitle: 'The Complete Architecture',
    description: `To master the Trie, one must see the whole machinery at once. It is not enough to know the node; one must see how the operations weave together.

### 🗺️ The Strategy
The Trie is composed of two simple classes working in unison:

1.  **\`TrieNode\` (The Spark)**
    *   Acts as a container for connections (\`children\`) and a status flag (\`is_end_of_word\`).
    *   It knows nothing of the tree above it, only what lies below.

2.  **\`Trie\` (The Manager)**
    *   Holds the single entry point: \`self.root\`.
    *   Orchestrates the movement of pointers for every operation.

### 🧠 Mental Model
Think of the \`Trie\` class as the **Librarian** and the \`TrieNode\` objects as the **Rooms** in the library.
*   **Insert**: The Librarian builds new rooms and corridors where none exist.
*   **Search**: The Librarian follows existing signs. If a sign is missing, the book is missing.
*   **StartsWith**: The Librarian checks if a hallway exists, without needing to enter a specific room at the end.

Below is the complete, standard Python implementation used in technical interviews and production systems.`,
    complexity: "O(1) Init",
    code: `class TrieNode:
    def __init__(self):
        # Maps char -> TrieNode
        self.children = {}
        # True if a word ends here
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word

    def startsWith(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True
    
    def delete(self, word):
        def _delete(node, word, depth):
            if depth == len(word):
                node.is_end_of_word = False
                return len(node.children) == 0
            
            char = word[depth]
            if char not in node.children:
                return False
            
            should_delete = _delete(node.children[char], word, depth + 1)
            
            if should_delete:
                del node.children[char]
                return len(node.children) == 0 and not node.is_end_of_word
            return False
            
        _delete(self.root, word, 0)`,
    steps: [
      {
        lineNo: 1,
        log: "DEFINING THE NODE: We define the `TrieNode` class. This is the structural unit. It holds the `children` dictionary (edges) and the `is_end_of_word` boolean (marker).",
        visual: {
          nodes: [],
          links: [],
          message: "Class Defined"
        }
      },
      {
        lineNo: 8,
        log: "INITIALIZING THE SYSTEM: The `Trie` class is initialized. It creates a single empty `TrieNode` to serve as the permanent Root. All words will grow from this single point.",
        visual: {
          nodes: [{ id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y + 100, isEnd: false, status: 'active' }],
          links: [],
          pointer: { x: BASE_X + 40, y: BASE_Y + 100, label: 'self.root' },
          message: "Root Ready"
        }
      },
      {
        lineNo: 12,
        log: "THE OPERATIONS: The class includes methods for `insert`, `search`, and `startsWith`. Notice they all share the same traversal pattern: Start at root, loop through characters, move deeper.",
        visual: {
          nodes: [{ id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y + 100, isEnd: false, status: 'active' }],
          links: [],
          pointer: { x: BASE_X + 40, y: BASE_Y + 100, label: 'Methods Ready' },
          message: "Full Implementation"
        }
      }
    ]
  },
  INSERT: {
    id: 'INSERT',
    title: 'The Cartographer (Insert)',
    subtitle: 'Blazing a New Trail',
    description: `Insertion is the act of creation. You are given a word, say "CAT", and your job is to ensure a path exists in the forest for it.

### 🗺️ The Strategy
1.  **Anchor at the Root**: We always begin our journey at the \`root\` node. It is the only fixed point in our universe.
2.  **The Step-by-Step Construction**:
    *   We take the first letter ('C'). We ask the current node: *"Do you have a child labeled C?"*
    *   **If No:** We must be the creators. We instantiate a new \`TrieNode\` and link it to the current node under key 'C'.
    *   **If Yes:** The path exists. We simply step onto it.
3.  **Advance the Pointer**: We move our \`node\` reference to this child. We are now one level deeper in the tree.
4.  **The Seal of Completion**: When we run out of letters (after 'T'), we are standing on the final node. We MUST set \`is_end_of_word = True\`. This distinguishes the word "CAT" from just a prefix "CA".

### 🧠 Mental Model
Imagine walking through deep snow.
*   If you see footprints ahead matching your direction, you step into them (save energy).
*   If the snow is untouched, you must stomp down a new path (allocate memory).
*   When you reach your destination, you plant a flag (is_end) so others know this is a valid stopping point.`,
    complexity: "O(L) - One step per character",
    code: `def insert(self, word: "CAT"):
    # Start at the root (the entry point)
    node = self.root
    
    # Iterate through every character in the word
    for char in word:
        # If the path doesn't exist, build it
        if char not in node.children:
            node.children[char] = TrieNode()
            
        # Step forward onto the next node
        node = node.children[char]
        
    # Mark the final node as a completed word
    node.is_end_of_word = True`,
    steps: [
      {
        lineNo: 2,
        log: "INITIALIZATION: We define `node` as a pointer to `self.root`. We are preparing to traverse. The root is our anchor.",
        visual: {
          nodes: [{ id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'active' }],
          links: [],
          pointer: { x: BASE_X + 40, y: BASE_Y, label: 'node' },
          message: "Start: ROOT"
        }
      },
      {
        lineNo: 5,
        log: "PROCESSING 'C': We begin the loop with the first character 'C'. We are asking the Root: 'Do you have a path for C?'",
        visual: {
          nodes: [{ id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'visited' }],
          links: [],
          pointer: { x: BASE_X + 40, y: BASE_Y, label: 'node' },
          message: "Current Char: 'C'"
        }
      },
      {
        lineNo: 7,
        log: "CHECKING EXISTENCE: We check `if 'C' not in node.children`. In this visual, the path is missing. We must create it.",
        visual: {
          nodes: [{ id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'visited' }],
          links: [],
          pointer: { x: BASE_X + 40, y: BASE_Y, label: 'node' },
          message: "Check: 'C' exists?"
        }
      },
      {
        lineNo: 8,
        log: "CREATION: The path was missing. We allocate a new `TrieNode()` in memory and assign it to `node.children['C']`.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'visited' },
            { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'active' }
          ],
          links: [{ source: 'root', target: 'c', status: 'active' }],
          pointer: { x: BASE_X + 40, y: BASE_Y, label: 'node' },
          message: "Created Node 'C'"
        }
      },
      {
        lineNo: 11,
        log: "ADVANCE POINTER: We execute `node = node.children['C']`. Our reference moves from Root down to the new 'C' node.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
            { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'active' }
          ],
          links: [{ source: 'root', target: 'c', status: 'default' }],
          pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y, label: 'node' },
          message: "Moved to 'C'"
        }
      },
      {
        lineNo: 5,
        log: "PROCESSING 'A': The loop continues. The next character is 'A'. We are standing at Node 'C'.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
            { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'visited' }
          ],
          links: [{ source: 'root', target: 'c', status: 'default' }],
          pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y, label: 'node' },
          message: "Current Char: 'A'"
        }
      },
      {
        lineNo: 7,
        log: "CHECKING EXISTENCE: We check `node.children`. 'A' is not there. We need to build again.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
            { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'visited' }
          ],
          links: [{ source: 'root', target: 'c', status: 'default' }],
          pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y, label: 'node' },
          message: "Check: 'A' exists?"
        }
      },
      {
        lineNo: 8,
        log: "CREATION: We allocate a new `TrieNode` for 'A' and link it to 'C'. The tree grows deeper.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
            { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'visited' },
            { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'active' }
          ],
          links: [
            { source: 'root', target: 'c', status: 'default' },
            { source: 'c', target: 'a', status: 'active' }
          ],
          pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y, label: 'node' },
          message: "Created Node 'A'"
        }
      },
      {
        lineNo: 11,
        log: "ADVANCE POINTER: `node` moves down to 'A'. We are now at depth 2.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
            { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
            { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'active' }
          ],
          links: [
            { source: 'root', target: 'c', status: 'default' },
            { source: 'c', target: 'a', status: 'default' }
          ],
          pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 2, label: 'node' },
          message: "Moved to 'A'"
        }
      },
      {
        lineNo: 5,
        log: "PROCESSING 'T': The final character. We are standing at Node 'A'.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
            { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
            { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'visited' }
          ],
          links: [
            { source: 'root', target: 'c', status: 'default' },
            { source: 'c', target: 'a', status: 'default' }
          ],
          pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 2, label: 'node' },
          message: "Current Char: 'T'"
        }
      },
      {
        lineNo: 8,
        log: "CREATION: 'T' is missing. We create the final node.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
            { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
            { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'visited' },
            { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: false, status: 'active' }
          ],
          links: [
            { source: 'root', target: 'c', status: 'default' },
            { source: 'c', target: 'a', status: 'default' },
            { source: 'a', target: 't', status: 'active' }
          ],
          pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 2, label: 'node' },
          message: "Created Node 'T'"
        }
      },
      {
        lineNo: 11,
        log: "ADVANCE POINTER: `node` moves to 'T'. The loop finishes because there are no more characters in 'CAT'.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
            { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
            { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
            { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: false, status: 'active' }
          ],
          links: [
            { source: 'root', target: 'c', status: 'default' },
            { source: 'c', target: 'a', status: 'default' },
            { source: 'a', target: 't', status: 'default' }
          ],
          pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 3, label: 'node' },
          message: "Moved to 'T'"
        }
      },
      {
        lineNo: 14,
        log: "MARKING THE END: We are at the end of the word. We must execute `node.is_end_of_word = True`. This changes the status of node 'T' to 'FOUND'. It is now a destination.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
            { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
            { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
            { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'found' }
          ],
          links: [
            { source: 'root', target: 'c', status: 'default' },
            { source: 'c', target: 'a', status: 'default' },
            { source: 'a', target: 't', status: 'default' }
          ],
          pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 3, label: 'node' },
          message: "Marked 'is_end'"
        }
      }
    ]
  },
  SEARCH: {
    id: 'SEARCH',
    title: 'The Tracker (Search)',
    subtitle: 'Following the Footsteps',
    description: `Search is a strict verification process. It asks: "Did anyone go exactly this way and stop here?"

### 🗺️ The Strategy
1.  **Strict Pathfinding**: Like insertion, we start at Root and follow the characters.
2.  **The Cliff Edge**: If we try to step onto a character (e.g., 'Z') and the path doesn't exist, we immediately return \`False\`. The word is not in the library.
3.  **The Final Verification**: If we successfully traverse "CAT", we are standing on 'T'. We must check: **Is this a destination?**
    *   If \`is_end_of_word\` is **True**, we found the word.
    *   If **False**, we merely found a prefix (e.g., we found "CAT" but were searching for "CA").

### 🧠 Mental Model
Think of it like following a treasure map.
*   The map says: "Go North (C), then East (A), then Dig (T)."
*   If you go North and hit a wall (path missing), the treasure isn't there.
*   If you go North, East, and Dig, but find no chest (flag is False), the treasure isn't there.
*   Only if you find the chest is the search successful.`,
    complexity: "O(L) - One step per character",
    code: `def search(self, word: "CAT"):
    node = self.root
    for char in word:
        # If the path is broken, the word is missing
        if char not in node.children:
            return False
        # Move pointer forward
        node = node.children[char]
        
    # We found the path, but is it marked as a word?
    return node.is_end_of_word`,
    steps: [
      {
        lineNo: 2,
        log: "INITIALIZATION: We set `node = self.root`. We start the tracking process at the entrance.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'active' },
            { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
            { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
            { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'default' }
          ],
          links: [
            { source: 'root', target: 'c', status: 'default' },
            { source: 'c', target: 'a', status: 'default' },
            { source: 'a', target: 't', status: 'default' }
          ],
          pointer: { x: BASE_X + 40, y: BASE_Y, label: 'node' },
          message: "Start: ROOT"
        }
      },
      {
        lineNo: 3,
        log: "PROCESSING 'C': We check the first instruction from the map. Look for 'C'.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'visited' },
            { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
            { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
            { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'default' }
          ],
          links: [
            { source: 'root', target: 'c', status: 'default' },
            { source: 'c', target: 'a', status: 'default' },
            { source: 'a', target: 't', status: 'default' }
          ],
          pointer: { x: BASE_X + 40, y: BASE_Y, label: 'node' },
          message: "Check: 'C'?"
        }
      },
      {
        lineNo: 7,
        log: "ADVANCE POINTER: 'C' exists in `children`. We follow the path. `node` is now at 'C'.",
        visual: {
          nodes: [
            { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
            { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'active' },
            { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
            { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'default' }
          ],
          links: [
            { source: 'root', target: 'c', status: 'active' },
            { source: 'c', target: 'a', status: 'default' },
            { source: 'a', target: 't', status: 'default' }
          ],
          pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y, label: 'node' },
          message: "Moved to 'C'"
        }
      },
      {
        lineNo: 3,
        log: "PROCESSING 'A': Next instruction. Look for 'A' from our current position.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'visited' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'default' }
            ],
            links: [
                { source: 'root', target: 'c', status: 'active' },
                { source: 'c', target: 'a', status: 'default' },
                { source: 'a', target: 't', status: 'default' }
            ],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y, label: 'node' },
            message: "Check: 'A'?"
        }
      },
      {
        lineNo: 7,
        log: "ADVANCE POINTER: 'A' found. Moving `node` deeper to 'A'.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'active' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'default' }
            ],
            links: [
                { source: 'root', target: 'c', status: 'active' },
                { source: 'c', target: 'a', status: 'active' },
                { source: 'a', target: 't', status: 'default' }
            ],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 2, label: 'node' },
            message: "Moved to 'A'"
        }
      },
      {
        lineNo: 3,
        log: "PROCESSING 'T': Final instruction. Look for 'T'.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'visited' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'default' }
            ],
            links: [
                { source: 'root', target: 'c', status: 'active' },
                { source: 'c', target: 'a', status: 'active' },
                { source: 'a', target: 't', status: 'default' }
            ],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 2, label: 'node' },
            message: "Check: 'T'?"
        }
      },
      {
        lineNo: 7,
        log: "ADVANCE POINTER: 'T' found. Moving `node` to 'T'.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'active' }
            ],
            links: [
                { source: 'root', target: 'c', status: 'active' },
                { source: 'c', target: 'a', status: 'active' },
                { source: 'a', target: 't', status: 'active' }
            ],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 3, label: 'node' },
            message: "Moved to 'T'"
        }
      },
      {
        lineNo: 10,
        log: "CHECKING FLAG: Loop finished. We verify: `node.is_end_of_word`. It is True! The word exists.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'found' }
            ],
            links: [
                { source: 'root', target: 'c', status: 'active' },
                { source: 'c', target: 'a', status: 'active' },
                { source: 'a', target: 't', status: 'active' }
            ],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 3, label: 'node' },
            message: "Found: TRUE"
        }
      }
    ]
  },
  STARTSWITH: {
    id: 'STARTSWITH',
    title: 'The Scout (StartsWith)',
    subtitle: 'Checking the Horizon',
    description: `StartsWith is the "loose" cousin of Search. It is used for autocomplete. It asks: "Is there ANY word in the library that begins with this prefix?"

### 🗺️ The Strategy
1.  **Identical Pathing**: We walk the tree exactly like Search. If we fall off the path (missing character), we return \`False\`.
2.  **The Key Difference**: When we finish walking the prefix (e.g., "CA"), we **STOP**.
3.  **No Flag Check**: We do not care if "CA" is a word or not. We only care that the nodes exist. If we arrived at the 'A' node safely, then "CA" is a valid prefix. Return \`True\`.

### 🧠 Mental Model
Imagine you are a scout checking if a road exists.
*   You walk down the road labeled "Main St" (Prefix).
*   If you reach the end of the street, you report: "Yes, the road exists."
*   You don't need to knock on the door of the last house to see if anyone is home. The existence of the road is enough.`,
    complexity: "O(P) - P is prefix length",
    code: `def startsWith(self, prefix: "CA"):
    node = self.root
    for char in prefix:
        # If the path breaks, the prefix doesn't exist
        if char not in node.children:
            return False
        # Move pointer forward
        node = node.children[char]
    
    # If we made it here, the path exists.
    # We don't need to check is_end_of_word!
    return True`,
    steps: [
      {
        lineNo: 2,
        log: "INITIALIZATION: We start at Root. Scouting for prefix 'CA'.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'active' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'default' }
            ],
            links: [
                { source: 'root', target: 'c', status: 'default' },
                { source: 'c', target: 'a', status: 'default' },
                { source: 'a', target: 't', status: 'default' }
            ],
            pointer: { x: BASE_X + 40, y: BASE_Y, label: 'node' },
            message: "Start: ROOT"
        }
      },
      {
        lineNo: 5,
        log: "PROCESSING 'C': Checking if the path starts with 'C'.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'visited' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'default' }
            ],
            links: [
                { source: 'root', target: 'c', status: 'default' },
                { source: 'c', target: 'a', status: 'default' },
                { source: 'a', target: 't', status: 'default' }
            ],
            pointer: { x: BASE_X + 40, y: BASE_Y, label: 'node' },
            message: "Check: 'C'?"
        }
      },
      {
        lineNo: 8,
        log: "ADVANCE POINTER: 'C' found. Moving to 'C'.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'active' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'default' }
            ],
            links: [
                { source: 'root', target: 'c', status: 'active' },
                { source: 'c', target: 'a', status: 'default' },
                { source: 'a', target: 't', status: 'default' }
            ],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y, label: 'node' },
            message: "Moved to 'C'"
        }
      },
      {
        lineNo: 5,
        log: "PROCESSING 'A': Checking if the next step is 'A'.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'visited' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'visited' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'default' }
            ],
            links: [
                { source: 'root', target: 'c', status: 'active' },
                { source: 'c', target: 'a', status: 'default' },
                { source: 'a', target: 't', status: 'default' }
            ],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y, label: 'node' },
            message: "Check: 'A'?"
        }
      },
      {
        lineNo: 8,
        log: "ADVANCE POINTER: 'A' found. Moving to 'A'.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'active' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'default' }
            ],
            links: [
                { source: 'root', target: 'c', status: 'active' },
                { source: 'c', target: 'a', status: 'active' },
                { source: 'a', target: 't', status: 'default' }
            ],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 2, label: 'node' },
            message: "Moved to 'A'"
        }
      },
      {
        lineNo: 12,
        log: "SUCCESS: Loop finished. We processed all letters in the prefix 'CA'. We return True immediately. We do not check if 'A' is an end.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'found' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'default' }
            ],
            links: [
                { source: 'root', target: 'c', status: 'active' },
                { source: 'c', target: 'a', status: 'active' },
                { source: 'a', target: 't', status: 'default' }
            ],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 2, label: 'node' },
            message: "Prefix Found!"
        }
      }
    ]
  },
  DELETE: {
    id: 'DELETE',
    title: 'The Pruner (Delete)',
    subtitle: 'Reclaiming the Forest',
    description: `Deletion is the most misunderstood operation because it requires **thinking backwards**. We cannot simply delete a node just because we want to remove a word; that node might be part of *another* word's path.

### 🗺️ The Strategy: Three Phases of Recursion
We use **Recursive Post-Order Traversal**. This simply means: "Go to the very bottom first, then make decisions on the way back up."

1.  **Phase 1: The Dive (Scouting)**
    *   **Goal**: Find the node representing the last letter of the word (e.g., 'T' in "CAT").
    *   **Action**: The function calls itself recursively: \`delete(root)\` calls \`delete(C)\` which calls \`delete(A)\`...
    *   **Visual**: We are building a "stack" of paused function calls. Nothing is deleted yet.

2.  **Phase 2: The Verdict (The Base Case)**
    *   **Goal**: We reached the end of the word ('T'). Is it time to delete?
    *   **Action**: We unmark the node (\`is_end = False\`).
    *   **The Check**: If 'T' has no children, it is now useless. We return \`True\` to its parent ('A'). This \`True\` means: *"I am empty. Please delete me."*

3.  **Phase 3: The Cleanup (Bubbling Up)**
    *   **Goal**: Clean up the branch if it's no longer needed.
    *   **Action**: Parent 'A' receives the \`True\` signal. It deletes 'T'.
    *   **The Chain Reaction**: Now 'A' asks itself: *"Am I empty too? And am I NOT a word myself?"*
    *   **Result**: If yes, 'A' returns \`True\` to 'C'. If no (maybe 'A' has another child 'R' for "CAR"), it returns \`False\`, stopping the destruction.

### 🧠 Mental Model: The Parent-Child Contract
Think of it as a strict contract between a Parent Node and a Child Node:
*   **The Child's Plea**: "Parent, you can only delete me if I have **nothing** left to offer. No children, and no 'Word-End' flag."
*   **The Parent's Promise**: "I will wait for you to check your own status. If you tell me you are empty, I will cut the connection."`,
    complexity: "O(L) - Visit down, prune up.",
    code: `def delete(node, word, depth):
    # Phase 2: The Verdict (Base Case)
    if depth == len(word):
        # Unmark the node (it's no longer a word end)
        node.is_end = False
        
        # The Contract: "Delete me only if I have no children"
        return len(node.children) == 0

    char = word[depth]
    
    # Phase 1: The Dive (Recursive Step)
    # We pause here and wait for the child to report back
    should_prune_child = delete(node.children[char], word, depth + 1)
    
    # Phase 3: The Cleanup (Post-Order / Bubble Up)
    if should_prune_child:
        del node.children[char] # Cut the link
        
        # Am I (the parent) now useless too?
        # 1. Do I have no other children?
        # 2. Am I NOT a word ending myself?
        return len(node.children) == 0 and not node.is_end
    
    return False`,
    steps: [
      {
        lineNo: 1,
        log: "START (Depth 0): calling `delete(root, 'CAT', 0)`. We are at the Root. We prepare to dive.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'active' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'default' }
            ],
            links: [{ source: 'root', target: 'c', status: 'default' }, { source: 'c', target: 'a', status: 'default' }, { source: 'a', target: 't', status: 'default' }],
            pointer: { x: BASE_X + 40, y: BASE_Y, label: 'depth: 0' },
            message: "Dive: Root"
        }
      },
      {
        lineNo: 12,
        log: "DIVE TO 'C' (Depth 1): The function calls itself for child 'C'. The Root pauses execution and waits.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'visited' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'active' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'default' }
            ],
            links: [{ source: 'root', target: 'c', status: 'active' }, { source: 'c', target: 'a', status: 'default' }, { source: 'a', target: 't', status: 'default' }],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y, label: 'depth: 1' },
            message: "Dive: 'C'"
        }
      },
      {
        lineNo: 12,
        log: "DIVE TO 'A' (Depth 2): 'C' calls the function for child 'A'. 'C' pauses execution and waits.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'visited' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'active' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'default' }
            ],
            links: [{ source: 'root', target: 'c', status: 'active' }, { source: 'c', target: 'a', status: 'active' }, { source: 'a', target: 't', status: 'default' }],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 2, label: 'depth: 2' },
            message: "Dive: 'A'"
        }
      },
      {
        lineNo: 12,
        log: "DIVE TO 'T' (Depth 3): 'A' calls the function for child 'T'. 'A' pauses execution and waits.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'visited' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'active' }
            ],
            links: [{ source: 'root', target: 'c', status: 'active' }, { source: 'c', target: 'a', status: 'active' }, { source: 'a', target: 't', status: 'active' }],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 3, label: 'depth: 3' },
            message: "Dive: 'T'"
        }
      },
      {
        lineNo: 3,
        log: "THE VERDICT: We reached the bottom! (Depth 3 == Len 3). We are at node 'T'.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: true, status: 'active' }
            ],
            links: [{ source: 'root', target: 'c', status: 'active' }, { source: 'c', target: 'a', status: 'active' }, { source: 'a', target: 't', status: 'active' }],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 3, label: 'depth: 3' },
            message: "Reached Bottom"
        }
      },
      {
        lineNo: 5,
        log: "UNMARK 'T': We set `node.is_end = False`. 'CAT' is officially deleted from the dictionary.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: false, status: 'active' }
            ],
            links: [{ source: 'root', target: 'c', status: 'active' }, { source: 'c', target: 'a', status: 'active' }, { source: 'a', target: 't', status: 'active' }],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 3, label: 'depth: 3' },
            message: "Unmarked 'T'"
        }
      },
      {
        lineNo: 8,
        log: "THE REPORT: We check if 'T' has children. It has 0. We return `True` to parent 'A'. This message means: 'I am empty. Delete me.'",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'default' },
                { id: 't', char: 'T', x: BASE_X, y: BASE_Y + GAP_Y * 3, isEnd: false, status: 'active' }
            ],
            links: [{ source: 'root', target: 'c', status: 'active' }, { source: 'c', target: 'a', status: 'active' }, { source: 'a', target: 't', status: 'active' }],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 3, label: 'Return True' },
            message: "Report: Empty"
        }
      },
      {
        lineNo: 15,
        log: "BACK TO 'A': We are back in 'A's scope. `should_prune_child` is True. So we execute `del node.children['T']`.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'active' }
            ],
            links: [{ source: 'root', target: 'c', status: 'active' }, { source: 'c', target: 'a', status: 'active' }],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 2, label: 'depth: 2' },
            message: "Deleted 'T'"
        }
      },
      {
        lineNo: 19,
        log: "CHECK 'A': Now 'A' asks itself: 'Am I empty?' Yes (T is gone). 'Am I a word?' No. So 'A' returns `True` to parent 'C'.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'default' },
                { id: 'a', char: 'A', x: BASE_X, y: BASE_Y + GAP_Y * 2, isEnd: false, status: 'ghost' }
            ],
            links: [{ source: 'root', target: 'c', status: 'active' }, { source: 'c', target: 'a', status: 'active' }],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y * 2, label: 'Return True' },
            message: "'A' is Useless"
        }
      },
      {
        lineNo: 15,
        log: "BACK TO 'C': We are back in 'C's scope. `should_prune_child` is True. We delete `node.children['A']`.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'active' }
            ],
            links: [{ source: 'root', target: 'c', status: 'active' }],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y, label: 'depth: 1' },
            message: "Deleted 'A'"
        }
      },
      {
        lineNo: 19,
        log: "CHECK 'C': 'C' asks: 'Am I empty?' Yes. 'Am I a word?' No. 'C' returns `True` to Root.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'default' },
                { id: 'c', char: 'C', x: BASE_X, y: BASE_Y + GAP_Y, isEnd: false, status: 'ghost' }
            ],
            links: [{ source: 'root', target: 'c', status: 'active' }],
            pointer: { x: BASE_X + 40, y: BASE_Y + GAP_Y, label: 'Return True' },
            message: "'C' is Useless"
        }
      },
      {
        lineNo: 15,
        log: "BACK TO ROOT: We are back at Root. `should_prune_child` is True. We delete `node.children['C']`.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'active' }
            ],
            links: [],
            pointer: { x: BASE_X + 40, y: BASE_Y, label: 'depth: 0' },
            message: "Deleted 'C'"
        }
      },
      {
        lineNo: 21,
        log: "COMPLETE: The Root is never deleted. The operation finishes successfully.",
        visual: {
            nodes: [
                { id: 'root', char: 'ROOT', x: BASE_X, y: BASE_Y, isEnd: false, status: 'found' }
            ],
            links: [],
            pointer: { x: BASE_X + 40, y: BASE_Y, label: 'Done' },
            message: "Tree Cleaned"
        }
      }
    ]
  }
};
