// ─── Conversation ────────────────────────────────────────────────────────────

export type ConversationCategory = 'research' | 'code' | 'writing' | 'misc';

export interface Conversation {
  id: string;
  title: string;
  category: ConversationCategory;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  firstUserMessage: string;
  lastUserMessage: string;
  summary: string;
}

// ─── Group ───────────────────────────────────────────────────────────────────

export interface DuplicatePattern {
  detected: boolean;
  description: string;
}

export interface Group {
  id: string;
  name: string;
  displayName: string;
  description: string;
  conversationIds: string[];
  conversationCount: number;
  summary: string;
  keyDecisions: string[];
  openQuestions: string[];
  lastUpdated: string;
  color: string;
  confidence: number;
  createdAt: string;
  duplicatePattern?: DuplicatePattern;
}

// ─── User ────────────────────────────────────────────────────────────────────

export type RuleCategory = 'tone' | 'format' | 'context' | 'language' | 'tools' | 'preference';

export interface ImplicitRule {
  id: string;
  category: RuleCategory;
  rule: string;
  evidence: string;
  confidence: number;
  createdAt: string;
  isActive: boolean;
}

export interface CategoryDistribution {
  category: ConversationCategory;
  count: number;
  percent: number;
}

export interface TimePattern {
  hour: number;
  count: number;
}

export interface MonthlyPattern {
  monthsAgo: number;
  count: number;
}

export interface GroupConnection {
  from: string;
  to: string;
  strength: number;
}

export interface TopicPercent {
  topic: string;
  percent: number;
}

export interface UserStats {
  categoryDistribution: CategoryDistribution[];
  timePattern: TimePattern[];
  monthlyPattern: MonthlyPattern[];
  duplicateDetected: number;
  potentialTimeSaved: string;
  topConnections: GroupConnection[];
}

export interface ThematicDrift {
  lastSevenDays: TopicPercent[];
  trendingUp: string[];
  fadingOut: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  totalConversations: number;
  thesisTopic: string;
  stats: UserStats;
  implicitRules: ImplicitRule[];
  thematicDrift: ThematicDrift;
}
// ─── AI Suggestions ──────────────────────────────────────────────────────────

export type SuggestionType =
  | 'group_creation'
  | 'context_resume'
  | 'similar_conversation';

export interface AISuggestion {
  id: string;
  type: SuggestionType;
  triggerContext: string;
  relatedConversationIds: string[];
  confidence: number;
  createdAt: string;
}