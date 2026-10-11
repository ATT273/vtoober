import { ILiveStreamParams } from "../types/live.types";

export const liveKeys = {
  all: ["lives"] as const,
  list: (params: ILiveStreamParams) => [...liveKeys.all, "list", params] as const,
  infinite: (params: Omit<ILiveStreamParams, "offset">) => [...liveKeys.all, "infinite", params] as const,
};
