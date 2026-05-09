#### 🌟2 Sum:

* Signal: Because we need to keep track of the position and those value we have been going through => we need a data structure to hold and to keep track => Hashmap

#### 🌟Valid Parentheses

    * Signal: we need "pending", "waiting" signal. Because open would be waiting to be resolved when we meet closed brackets. Need to be waiting to be taken out => wait => stacks

#### 🌟Merged 2 sorted lists

    * Signal: simple linkedlist. Sorted already so which on smaller get attached

#### 🌟Best Time Buy/Sell

    * Signal: Just 2 pointer, greedy single past to find the best buy time (lowest price)

#### 🌟Valid Palindrome

    * Signal: Reverse the string

#### 🌟Invert Binary Tree

    * Singal: Recursive easily because we can invert the last 2 and backtrack that up

#### 🌟Valid Anagram

    Singal: Characters 26, compare them 2 => use HahsMap to store those characters

#### 🌟FloodFill

    * Signal: BFS, because we need to explore all and all neighbor efficiency. Expand in width to fill

#### 🌟LCA of BST

#### 
    Signal: Just tree, the spliting point

#### 🌟Balanced Binary Tree

#### 
    Signal: Just tree, if heighb of left and tree differentce <= 1. It would be Balanced

#### 🌟Link List Cycle

    Signal: Fast and Slow pointer. If some of them go 2x faster. And they meet means they're cycle

#### 🌟Queue using Stacks

    * Signal: Just use Queue and Stacks



### Question1: What patterns did I learn this weeks ? 

1. Two Pointers:
   1. Use when we need to find pairs we need to find triplets in sorted array. Move left point or right pointer or reset when needed
2. Hashmap
   1. Use when we need to keep track of element and their properties (value, position, frequency v.v.v)
3. Stacks
   1. Use when we see the pattern of "waiting", "pending"
4. BFS
   1. Use when problemes just like FloodFill. We need to explore in width of all neighbors
5. Recurse in Binary Tree
   1. Use when we need to comes to the very last position of a tree and do an action. Like comes to the last position of a tree and invert those position
   2. use when we check Balanced of Binary Tree. Which is when we report back the height and we also check the abs(left-right) height every time
6. Fast and Slow pointers
   1. Use when to find middle of linkedlist, cycle detect because if something move 2x faster it eventually will meet the on move slow if they're in ccycle
