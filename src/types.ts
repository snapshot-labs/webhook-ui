export type Space = {
  id: string;
  name: string;
  avatar: string;
};

export type Subscription = {
  id: string;
  owner: string;
  space: string;
  url: string;
  active: number;
  created: string;
};

export type User = {
  id: string;
  proposal_count: number;
  vote_count: number;
  created: number;
};
