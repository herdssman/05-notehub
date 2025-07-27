import axios from 'axios';
import type { Note } from '../types/note';
import type { CreateNote } from '../types/createNote';

const BASE_URL = 'https://notehub-public.goit.study/api'
const NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;


interface NoteServiceProps {
    notes: Note[];
    totalPages: number;
}

interface FetchNotesParams {
    page: number;
    perPage: number;
    search?: string ;
    sortBy: string;
}
  

export async function fetchNotes({ search, page, perPage, sortBy }: FetchNotesParams): Promise<{ notes: Note[]; totalPages: number }> {
    
    const params = {
        page,
        perPage,
        sortBy,
    } as { page: number; perPage: number; sortBy: string; search?: string };

    if (search?.trim() !== '') {
        params.search = search?.trim();
      }

    try {
        const response = await axios.get<NoteServiceProps>(`${BASE_URL}/notes`,
            {
                params ,
                headers: {
                    Authorization: `Bearer ${NOTEHUB_TOKEN}`,
                },
            }
        );
        const { notes, totalPages } = response.data;

        return { notes, totalPages };

    } catch {
        throw new Error('Failed to load notes. Please, ensure your connection and try again')
    }

}

export async function createNote(newNote: CreateNote): Promise<Note> {
    
    try {
        const response = await axios.post<Note>(`${BASE_URL}/notes`, newNote, 
            {
                headers: {
                    Authorization: `Bearer ${NOTEHUB_TOKEN}`,
                }
            }
        )
        return response.data;

    } catch {
        throw new Error('Failed to create note. Please, ensure your connection and try again')
    }
}

export async function deleteNote(noteId: number): Promise<Note> {

    try {
        const response = await axios.delete(`${BASE_URL}/notes/${noteId}`,
            {
                headers: {
                    Authorization: `Bearer ${NOTEHUB_TOKEN}`,
                }
            }
        );
        return response.data;

    } catch {
        throw new Error("Failed to delete note. Please, ensure your connection and try again");
    }
}