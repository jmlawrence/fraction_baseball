export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

export const removeNonAlphas = (s: string) => {
  return s.replace(/[^a-zA-Z]/g, "");
};

export function keyHasText<T>(obj: T, key: keyof T, text: string) {
  return String(obj[key]).toLowerCase().includes(text.toLowerCase());
}

export function isValidLinkedIn(s = "") {
  const r = new RegExp(
    /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)\/([-a-zA-Z0-9]+)\/*/gm,
  );

  return r.test(s);
}

export function isValidGitHub(s?: string): boolean {
  const regex = /^(http(s)?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+(\/)?$/;

  return regex.test(s || "");
}

export function isValidName(s = "") {
  const cleaned = s.trim();

  if (cleaned.length < 5 || cleaned.split(" ").length !== 2) {
    return false;
  }

  const r = new RegExp(
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
  );

  return r.test(cleaned);
}

export function toTitleCase(sentence: string): string {
  return sentence
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function moveItemUp<T>(list: T[], idx: number): T[] {
  // Check if the index is valid
  if (idx <= 0 || idx >= list.length) {
    console.error("Invalid index");
    return list;
  }

  // Swap the item with the previous one
  const temp = list[idx - 1];
  list[idx - 1] = list[idx];
  list[idx] = temp;

  return list;
}

export function moveItemDown<T>(list: T[], idx: number): T[] {
  // Check if the index is valid
  if (idx < 0 || idx >= list.length - 1) {
    console.error("Invalid index");
    return list;
  }

  // Swap the item with the next one
  const temp = list[idx + 1];
  list[idx + 1] = list[idx];
  list[idx] = temp;

  return list;
}

export function arrayFallback<T>(val?: T[]) {
  return val || [];
}

export const numberFallback = (val?: number) => {
  return val || 0;
};

export function truncateString(input: string, maxLength: number = 100): string {
  if (input.length <= maxLength) {
    return input;
  }
  return input.substring(0, maxLength - 3) + "...";
}

export const normalizeJobTitles = (str: string) => {
  // Convert to lowercase
  let normalized = str.toLowerCase();

  // Remove punctuation and extra spaces
  normalized = normalized
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Split into words and remove common modifiers like "junior", "senior"
  const wordsToIgnore = new Set(["junior", "senior", "intern", "trainee"]);
  const words = normalized
    .split(" ")
    .filter((word) => !wordsToIgnore.has(word));

  // Join the remaining words back into a normalized title
  return words.join(" ");
};

export function treeShake<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      // @ts-ignore
      acc[key] = value;
    }
    return acc;
  }, {} as Partial<T>);
}
