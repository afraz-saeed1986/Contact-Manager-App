import { useEffect } from 'react';
import './App.css';
import {AddContact,EditContact,ViewContact,Contacts,Navbar} from './components';
import {Route,Routes,Navigate, useNavigate} from 'react-router-dom'
import {createContact, getAllContacts, getAllGroups, deleteContact} from "./services/contactService";
import {confirmAlert} from 'react-confirm-alert';
import { COMMENT, CURRENTLINE, FOREGROUND, PURPLE, YELLOW } from './helpers/colors';
import { ContactContext } from './context/contactContext';

import _ from 'lodash';
import {useImmer} from 'use-immer'
import {ToastContainer, toast} from 'react-toastify';
// import toast, {Toaster} from 'react-hot-toast';



const App = () => {
  const [loading,setLoading] = useImmer(false);
  const [contacts,setContacts] = useImmer([]);
  const [filteredContacts, setFilteredContacts] = useImmer([]);
  const [groups, setGroups] = useImmer([]);
  const navigate = useNavigate();

  useEffect(()=>{

 const fetchData = async ()=>{
      try {
        setLoading(true);
        const {data: contactsData} = await getAllContacts();
        const {data: groupsData} = await getAllGroups();

        setContacts(contactsData);
        setFilteredContacts(contactsData);
        setGroups(groupsData);

        setLoading(false);
        
      } catch (err) {
        console.log(err.message);
        setLoading(false);
      }
 }

 fetchData();
  }, []) // [] :یعنی تنها زمانی اجرا شود که کامپوننت ساخته می شود.


const createContactForm = async (values) =>{
  try{
    setLoading(draft => !draft);

    const {status, data} = await createContact(values);

    /*
    * NOTE
    * 1- Rerender-> forceRender, setForceRender
    * 2- setContacts(data)
    */

    if(status === 201){
      toast.success("مخاطب با موفقیت ساخته شد." , {icon: ""});

      setContacts(draft => {draft.push(data)});
      setFilteredContacts(draft => {draft.push(data)});

      setLoading((prevLoading) => !prevLoading);
      navigate("/contacts");
    }
  } catch (err){
     console.log(err.message);
     setLoading((prevLoading) => !prevLoading);
  }
}


  const confirmDelete = (contactId, contactFullname)=>{
    confirmAlert({
      customUI: ({onClose}) =>{
        return(
          <div dir='rtl' style={{backgroundColor: CURRENTLINE, border: `1px solid ${PURPLE}`,borderRadius: "1em" }}
           className='p-4'>
            <h1 style={{color: YELLOW}}>پاک کردن مخاطب</h1>
            <p style={{color: FOREGROUND}}>
              آیا مطمئن هستید که مخاطب {contactFullname} پاک شود؟
            </p>
            <button onClick={()=>{
              removeContact(contactId);
              onClose();
            }}
            className='btn mx-2'
            style={{backgroundColor: PURPLE}}
            >مطئن هستم</button>
            <button onClick={onClose} className='btn' style={{backgroundColor: COMMENT}}>
              انصراف
            </button>
          </div>
        )
      }
    })
  }

  const removeContact = async (contactId)=>{
          /**
        * NOTE
        * 1-forceRender => setForceRender
        * 2- Server request
        * 3- Delete local state
        * 4- Delete state before server request
        */

       // contacts copy
      const contactsBackup = [...contacts];
    try {

      setContacts(draft => draft.filter(c => c.id !== contactId));
      setFilteredContacts(draft => draft.filter(c => c.id !== contactId));

      //Sending delete request to server
      const {status} = await deleteContact(contactId);

      toast.error("مخاطب با موفقیت حذف شد", {icon: ""});

      if(status !== 200){
        setContacts(contactsBackup);
        setFilteredContacts(contactsBackup);
        //setLoading(false);
      }
    } catch (err) {
      console.log(err.message);

      setContacts(contactsBackup);
      setFilteredContacts(contactsBackup);
      //setLoading(false);
    }
  }

  // let filterTimeout;
  const contactSearch = _.debounce(query =>{
   if(!query) return setFilteredContacts([...contacts]);

    setFilteredContacts(draft => draft.filter(c => c.fullname.toString().toLowerCase()
    .includes(query.toString().toLowerCase())))
  }, 1000);

  return (
    <ContactContext.Provider value={{
      loading,
      setLoading,
      setContacts,
      setFilteredContacts,
      contacts,
      filteredContacts,
      groups,
      deleteContact: confirmDelete,
      createContact: createContactForm,
      contactSearch
    }}>
    <div className="App">
      <ToastContainer rtl={true} position="top-right" theme="colored"/>
      {/* <Toaster /> */}
      <Navbar />
      <Routes>
          <Route path='/' element={<Navigate to="/contacts" />} />
          <Route path='/contacts' element={<Contacts />} />
          <Route path='/contacts/add' element={<AddContact />} />
          <Route path='/contacts/:contactId' element={<ViewContact />} />
          <Route path='/contacts/edit/:contactId' element={<EditContact />} />
      </Routes>
    </div>
    </ContactContext.Provider>
  );
}

export default App;
