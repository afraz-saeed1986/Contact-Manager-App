import { useState, useEffect } from 'react';
import './App.css';
import {AddContact,EditContact,ViewContact,Contacts,Contact,Navbar} from './components';
import {Route,Routes,Navigate, useNavigate} from 'react-router-dom'
import {createContact, getAllContacts, getAllGroups, deleteContact} from "./services/contactService";
import {confirmAlert} from 'react-confirm-alert';
import { COMMENT, CURRENTLINE, FOREGROUND, PURPLE, YELLOW } from './helpers/colors';
import { ContactContext } from './context/contactContext';



const App = () => {
  // const [forceRender, setForceRender] = useState(false);
  const [loading,setLoading] = useState(false);
  const [contacts,setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [contact, setContact] = useState({});
  const [contactQuery, setContactQuery] = useState({text: ""});

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


const createContactForm = async event =>{
  event.preventDefault();
  try{
    setLoading((prevLoading) => !prevLoading);
    const {status, data} = await createContact(contact);

    /*
    * NOTE
    * 1- Rerender-> forceRender, setForceRender
    * 2- setContacts(data)
    */

    if(status === 201){
      const allContacts = [...contacts, data];

      setContacts(allContacts);
      setFilteredContacts(allContacts);

      setContact({});
      setLoading((prevLoading) => !prevLoading);
      navigate("/contacts");
    }
  } catch (err){
     console.log(err);
     setLoading((prevLoading) => !prevLoading);
  }
}

  const onContactChange = (event) =>{
    setContact({...contact, [event.target.name]: event.target.value});
  };


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
      const allContacts = [...contacts];
    try {
      //setLoading(true);
      const updatedContact = contacts.filter(c => c.id !== contactId);
      setContacts(updatedContact);
      setFilteredContacts(updatedContact);

      //Sending delete request to server
      const {status} = await deleteContact(contactId);

      if(status !== 200){
        setContacts(allContacts);
        setFilteredContacts(allContacts);
        //setLoading(false);
      }
    } catch (err) {
      console.log(err.message);

      setContacts(allContacts);
      setFilteredContacts(allContacts);
      //setLoading(false);
    }
  }

  const contactSearch = (event) =>{
    setContactQuery({...contactQuery, text: event.target.value});
    const allContacts = contacts.filter((contact)=>{
      return contact.fullname.toString().toLowerCase()
      .includes(event.target.value.toString().toLowerCase());
    });

    setFilteredContacts(allContacts);
  };

  return (
    <ContactContext.Provider value={{
      loading,
      setLoading,
      contact,
      setContacts,
      setFilteredContacts,
      contactQuery,
      contacts,
      filteredContacts,
      groups,
      onContactChange,
      deleteContact: confirmDelete,
      createContact: createContactForm,
      contactSearch
    }}>
    <div className="App">
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
