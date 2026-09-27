import type { User } from "userbase";

export const useUser = () => {
  const getUser = () => $fetch("/api/auth/me") as Promise<{ user: User }>;
  return { getUser };
};
