import { QuizQuestion } from '../types';

export const PYTHON_CODE_NODE = `class TrieNode:
    """
    A single spark in the darkness. 
    Represents one character in our sequence.
    """
    def __init__(self):
        # The glowing paths leading to other sparks
        self.children = {}  # Dict[str, TrieNode]
        
        # Does a spell (word) end at this exact spark?
        self.is_end_of_word = False`;

export const PYTHON_CODE_INSERT = `    def insert(self, word: str) -> None:
        """
        Weaving a new path through the forest.
        Time Complexity: O(L) where L is the length of the word.
        """
        node = self.root
        for char in word:
            # If the path doesn't exist, clear the brush (create node)
            if char not in node.children:
                node.children[char] = TrieNode()
            # Step forward onto the glowing rune
            node = node.children[char]
        
        # Mark this spot as the completion of a spell
        node.is_end_of_word = True`;

export const PYTHON_CODE_SEARCH = `    def search(self, word: str) -> bool:
        """
        Following the breadcrumbs to find a specific truth.
        Returns True only if the exact word exists.
        Time Complexity: O(L)
        """
        node = self.root
        for char in word:
            if char not in node.children:
                return False # The path is broken
            node = node.children[char]
        
        # We found the path, but is it a complete spell?
        return node.is_end_of_word`;

export const PYTHON_CODE_STARTSWITH = `    def startsWith(self, prefix: str) -> bool:
        """
        Gazing down a corridor to see if any path lies ahead.
        Returns True if ANY word begins with this prefix.
        Time Complexity: O(L)
        """
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True # The path exists, even if no spell ends here`;

export const PYTHON_CODE_DELETE = `    def delete(self, word: str) -> bool:
        """
        Gently letting the forest reclaim a path.
        Recursive approach allows us to prune dead branches upwards.
        """
        def _delete(node, word, depth):
            # Base case: We have reached the end of the word
            if depth == len(word):
                if not node.is_end_of_word:
                    return False # Word wasn't here
                
                # Unmark this as an end
                node.is_end_of_word = False
                
                # If no leaves grow from here, this node can be removed
                return len(node.children) == 0

            char = word[depth]
            if char not in node.children:
                return False # Path didn't exist
            
            should_delete_child = _delete(node.children[char], word, depth + 1)
            
            if should_delete_child:
                del node.children[char]
                # Return True if we should delete THIS node too
                return len(node.children) == 0 and not node.is_end_of_word
            
            return False

        _delete(self.root, word, 0)`;

// --- Anatomy Code Snippets ---

export const ANATOMY_CODE_ROOT = `class Trie:
    def __init__(self):
        # The Root is an empty vessel.
        # It holds no character, only pointers.
        self.root = TrieNode()`;

export const ANATOMY_CODE_NODE = `class TrieNode:
    def __init__(self):
        # Dictionary acts as the edges
        self.children = {} 
        # Boolean acts as the marker
        self.is_end_of_word = False`;

export const ANATOMY_CODE_EDGE = `# Connecting 'T' to 'E'
# inside the node for 'T'
node_t.children['e'] = node_e

# Moving across the edge
node = node.children['e']`;

export const ANATOMY_CODE_MARKER = `# Reached the end of "CAT"
# We mark the 'T' node.
node_t.is_end_of_word = True

# "CA" is a prefix, so for 'A':
node_a.is_end_of_word = False`;

// --- Journal Logic Snippets ---

export const CODE_AUTOCOMPLETE_LOGIC = `def autocomplete(self, prefix):
    # 1. Travel to the end of the prefix
    node = self.root
    for char in prefix:
        if char not in node.children:
            return []
        node = node.children[char]
    
    # 2. Harvest all words from this point down
    results = []
    def dfs(current_node, current_path):
        if current_node.is_end_of_word:
            results.append(current_path)
        
        for char, child_node in current_node.children.items():
            dfs(child_node, current_path + char)
            
    dfs(node, prefix)
    return results`;

export const CODE_SEARCH_LOGIC = `def search(self, word):
    node = self.root
    for char in word:
        # If the edge doesn't exist, stop.
        if char not in node.children:
            return False
        # Move pointer
        node = node.children[char]
    
    # Check the marker
    return node.is_end_of_word`;

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "In the Forest of Prefix Paths, if the words 'CAT' and 'CAR' are stored, how many nodes (sparks) do they share?",
    options: ["Zero. They are separate paths.", "One (The letter C).", "Two (The letters C and A).", "Three (They are identical)."],
    correctIndex: 2,
    explanation: "Like two travelers walking the same trail before parting ways, 'CAT' and 'CAR' share the path 'C' -> 'A'. They diverge only at the third step."
  },
  {
    id: 2,
    question: "Why is the Trie often faster than a Hash Map for autocomplete?",
    options: ["It has O(1) lookups.", "It allows us to traverse only the shared prefix branch.", "It uses magical teleportation.", "It sorts the words alphabetically automatically."],
    correctIndex: 1,
    explanation: "In a Hash Map, you cannot easily find all keys starting with 'XY'. In a Trie, you simply walk the path 'X' -> 'Y' and look at everything glowing beneath it."
  },
  {
    id: 3,
    question: "What is the Time Complexity of searching for a word of length L?",
    options: ["O(1) - Instant.", "O(L) - One step per character.", "O(N) - Dependent on total words in forest.", "O(log N) - Like a binary search tree."],
    correctIndex: 1,
    explanation: "We take exactly one step for each character in the word. The size of the rest of the forest (N) does not matter for a single lookup."
  }
];