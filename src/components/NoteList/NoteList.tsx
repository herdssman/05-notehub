import css from './NoteList.module.css'
import { deleteNote } from '../../services/noteService'
import type { Note } from '../../types/note'
import { useQueryClient, useMutation } from '@tanstack/react-query';

interface NoteListProps {
    notes: Note[]
    onNotesChange?: (updatedNotes: Note[]) => void
  }

export default function NoteList({ notes }: NoteListProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (noteId: number) => deleteNote(noteId),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        }
    });

    const handleDelete = (noteId: number) => {
        mutation.mutate(noteId);
    }
    

    return (
        <ul className={css.list}>
            {notes.map(note => (
                <li key={note.id} className={css.listItem}>
                    <h2 className={css.title}>{note.title}</h2>
                    <p className={css.content}>{note.content}</p>
                    <div className={css.footer}>
                        <span className={css.tag}>{note.tag}</span>
                        <button className={css.button} onClick={()=> handleDelete(note.id)}>Delete</button>
                    </div>
                </li>
            ))}
        </ul>
    )
}
