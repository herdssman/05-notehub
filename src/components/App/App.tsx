import { useState, useEffect } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce';
import css from './App.module.css'
import NoteList from '../NoteList/NoteList'
import { fetchNotes } from '../../services/noteService'
import SearchBox from '../SearchBox/SearchBox'
import Modal from '../Modal/Modal';
import Pagination from '../Pagination/Pagination';
import NoteForm from '../NoteForm/NoteForm';



function App() {

  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300)
  const [page, setPage] = useState(1);


  const perPage = 15;
  const sortBy = 'created'; 


  const { data, isSuccess, refetch } = useQuery({
    queryKey: ['notes', debouncedSearch, page, perPage, sortBy],
    queryFn: () => fetchNotes({
      search: debouncedSearch,
      page,
      perPage,
      sortBy,
    }),
    placeholderData: keepPreviousData,
    
  })


  const totalPages = data?.totalPages ?? 0;


  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);


  return (
    <div className={css.app}>
      <header className={css.toolbar}>

        <SearchBox value={search} onChange={setSearch} />

        {isSuccess && totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />)}
      
      <button className={css.button} onClick={()=>setOpenModal(true)}>Create note +</button>

      </header>

      {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}
      
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <NoteForm
            onClose={() => setOpenModal(false)}
            onSuccess={() => {
              setPage(1);
              refetch();
              setOpenModal(false);
            }}  
          />
        </Modal>
      )}

    </div>
  )
}

export default App
