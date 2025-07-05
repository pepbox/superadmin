export const searchInObject = (obj: any, searchTerm: string): boolean => {
  if (obj === null || obj === undefined) return false;

  const normalizedSearchTerm = searchTerm.toLowerCase();

  if (typeof obj === "string") {
    return obj.toLowerCase().includes(normalizedSearchTerm);
  }

  if (typeof obj === "number") {
    return obj.toString().includes(normalizedSearchTerm);
  }

  if (typeof obj === "object") {
    return Object.values(obj).some((value) =>
      searchInObject(value, normalizedSearchTerm)
    );
  }

  return false;
};

export const filterBySearch = <T>(items: T[], searchQuery?: string): T[] => {
  if (!searchQuery?.trim()) return items;

  const searchTerm = searchQuery.toLowerCase();
  return items.filter((item) => searchInObject(item, searchTerm));
};
