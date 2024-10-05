import { useState, useEffect } from 'react';
import './App.css';
import {AddContact,EditContact,ViewContact,Contacts,Contact,Navbar} from './components';
import {Route,Routes,Navigate} from 'react-router-dom'
import {getAllContacts, getAllGroups} from "./services/contactService";



const App = () => {
  const [getContacts,setContacts] = useState([]);
  const [getGroups, setGroups] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
 const fetchData = async ()=>{
      try {
        setLoading(true);
        const {data: contactsData} = await getAllContacts();
        const {data: groupsData} = await getAllGroups();
        setContacts(contactsData);
        setGroups(groupsData);

        setLoading(false);
        
      } catch (err) {
        console.log(err.message);
        setLoading(false);
      }
 }

 fetchData();
  }, []) // [] :یعنی تنها زمانی اجرا شود که کامپوننت ساخته می شود.



  return (
    <div className="App">
      <Navbar />
      <Routes>
          <Route path='/' element={<Navigate to="/contacts" />} />
          <Route path='/contacts' element={<Contacts contacts={getContacts} loading={loading} />} />
          <Route path='/contacts/add' element={<AddContact />} />
          <Route path='/contacts/:contactId' element={<ViewContact />} />
          <Route path='/contacts/edit/:contactId' element={<EditContact />} />
      </Routes>
    </div>
  );
}

export default App;
