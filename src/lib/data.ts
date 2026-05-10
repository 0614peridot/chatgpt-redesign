import conversationsData from '../../styles/data/conversations.json';
import groupsData from '../../styles/data/groups.json';
import userData from '../../styles/data/user.json';

import type { Conversation, ConversationCategory, Group, User } from '../types';

// ─── Raw loaders ─────────────────────────────────────────────────────────────

export function getConversations(): Conversation[] {
  return conversationsData.conversations as Conversation[];
}

export function getGroups(): Group[] {
  return groupsData.groups as Group[];
}

export function getUser(): User {
  return userData as User;
}

// ─── Search helpers ──────────────────────────────────────────────────────────

function normalizeQuery(input: string): string {
  return input.trim().toLowerCase();
}

function includesNormalized(haystack: string, needle: string): boolean {
  if (!needle) return false;
  return haystack.toLowerCase().includes(needle);
}

/**
 * Search conversations by simple text match.
 * Rule: keep logic lightweight and deterministic for mock data.
 */
export function searchConversations(query: string): Conversation[] {
  const q = normalizeQuery(query);
  if (!q) return [];

  const conversations = getConversations();

  return conversations
    .map((c) => {
      const score =
        (includesNormalized(c.title, q) ? 3 : 0) +
        (includesNormalized(c.summary, q) ? 2 : 0) +
        (includesNormalized(c.firstUserMessage, q) ? 1 : 0) +
        (includesNormalized(c.lastUserMessage, q) ? 1 : 0);

      return { conversation: c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.conversation.updatedAt).getTime() - new Date(a.conversation.updatedAt).getTime();
    })
    .map((x) => x.conversation);
}

// ─── Lookup helpers ──────────────────────────────────────────────────────────

export function getConversationById(id: string): Conversation | undefined {
  return getConversations().find((c) => c.id === id);
}

export function getGroupById(id: string): Group | undefined {
  return getGroups().find((g) => g.id === id);
}

// ─── Filter helpers ──────────────────────────────────────────────────────────

export function getConversationsByGroup(groupId: string): Conversation[] {
  return getConversations().filter((c) => c.groupId === groupId);
}

export function getConversationsByCategory(category: ConversationCategory): Conversation[] {
  return getConversations().filter((c) => c.category === category);
}

// ─── Derived helpers ─────────────────────────────────────────────────────────

export function getGroupWithConversations(
  groupId: string
): { group: Group; conversations: Conversation[] } | undefined {
  const group = getGroupById(groupId);
  if (!group) return undefined;
  return { group, conversations: getConversationsByGroup(groupId) };
}
