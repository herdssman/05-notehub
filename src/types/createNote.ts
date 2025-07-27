import type { Tag } from "./tag";

export interface CreateNote {
    title: string;
    content: string;
    tag: Tag;
}