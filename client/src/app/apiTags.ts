export const API_TAGS = {
  AUTH: "Auth",
  SESSIONS: "Sessions",
} as const;

export const tagTypes = Object.values(API_TAGS);

export const createEntityTag = (entityType: string, id?: string | number) => ({
  type: entityType,
  id: id || "LIST",
});

export const createListTag = (entityType: string) => ({
  type: entityType,
  id: "LIST",
});
