
export enum TabId {
  INTRO = 'INTRO',
  EXPLANATION = 'EXPLANATION',
  APPLICATIONS = 'APPLICATIONS',
  IMPLEMENTATION = 'IMPLEMENTATION',
  TECHNIQUES = 'TECHNIQUES',
  MENTAL_MODELS = 'MENTAL_MODELS',
  QUIZZES = 'QUIZZES',
  SUMMARY = 'SUMMARY',
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TrieNodeVisual {
  char: string;
  isEnd: boolean;
  children: { [key: string]: TrieNodeVisual };
}
