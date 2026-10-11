"use client";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../actions";
import { profileKeys } from "./keys";

export const useMyProfile = () =>
  useQuery({
    queryKey: profileKeys.me(),
    queryFn: () => getMyProfile(),
  });
