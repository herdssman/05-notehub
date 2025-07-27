import css from './NoteForm.module.css';
import type { Tag } from '../../types/tag';
import { createNote } from '../../services/noteService';
import type { CreateNote } from '../../types/createNote';
import type { ModalProps } from '../../types/modalProps';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useQueryClient, useMutation } from '@tanstack/react-query';


const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Title is required'),

  content: Yup.string()
    .max(500, 'Maximum 500 characters'),

  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Tag is required'),
});


interface NoteFormValues {
    title: string;
    content: string;
    tag: Tag;
}

const initialValues: NoteFormValues = {
    title: '',
    content: '',
    tag: 'Todo'
}


export default function NoteForm({ onClose }: ModalProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (noteData: CreateNote) => createNote(noteData),
    })

    const handleSubmit = (
        values: NoteFormValues,
        actions: FormikHelpers<NoteFormValues>
    ) => {
        mutation.mutate({
            title: values.title,
            content: values.content,
            tag: values.tag,
        },
        {
            onSuccess: async () => {
                actions.resetForm();
                actions.setSubmitting(false);
                await queryClient.invalidateQueries({ queryKey: ["notes"] });
                onClose();
            }, 
            onError: () => {
                actions.setSubmitting(false);
            }
        }
        )
    };

    return (
        <Formik
            
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema} >
            
            {({ isSubmitting }) => (

                <Form className={css.form}>

                    <div className={css.formGroup}>
                        <label htmlFor="title">Title</label>
                        <Field id="title" name="title" type="text" className={css.input} />
                        <ErrorMessage name="title" component="span" className={css.error} />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="content">Content</label>
                        <Field
                            as="textarea"
                            id="content"
                            name="content"
                            rows={8}
                            className={css.textarea}
                        />
                        <ErrorMessage name="content" component="span" className={css.error} />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="tag">Tag</label>
                        <Field as="select" id="tag" name="tag" className={css.select}>
                            <option value="Todo">Todo</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Shopping">Shopping</option>
                        </Field>
                        <ErrorMessage name="tag" component="span" className={css.error} />
                    </div>

                    <div className={css.actions}>
                        <button type="button" className={css.cancelButton} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className={css.submitButton} disabled={isSubmitting}>
                            Create note
                        </button>
                    </div>
                    
                </Form>
            )}
        </Formik>
        
        

    )
}