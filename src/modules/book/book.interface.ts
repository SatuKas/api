export type BookListResponse = {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
  owner: {
    id: string;
    name: string;
    username: string;
  };
};
