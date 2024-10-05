import axios from "axios";

const SERVER_URL = "http://localhost:9000";

// @desc Get ALL Contacts
// @route GET http://localhost:9000/contacts
export const getAllContacts = () =>{
  const url = `${SERVER_URL}/contacts`;
  return axios.get(url);
};

// @desc Get Contact with Contact ID
// @route GET http://localhost:9000/contacts/:contactid
export const getContact = (contactId)=>{
  const url = `${SERVER_URL}/contacts/${contactId}`;
  return axios.get(url);
};

// @desc Get ALL Groups
// @route GET http://localhost:9000/groups
export const getAllGroups = ()=>{
    const url = `${SERVER_URL}/groups`;
    return axios.get(url);
};

// @desc Get Group with Group ID
// @route GET http://localhost:9000/groups/:groupid
export const getGroup = (groupId)=>{
    const url = `${SERVER_URL}/groups/${groupId}`;
    return axios.get(url);
};

// @desc Create New Contact
// @route POST http://localhost:9000/contacts
export const createContact = (contact) => {
    const url = `${SERVER_URL}/contacts`;
    return axios.post(url, contact);
};

// @desc Update Contact
// @route PUT http://localhost:9000/contacts/:contactid
export const updateContact = (contact, contactId) =>{
    const url = `${SERVER_URL}/contacts/${contactId}`;
    return axios.put(url, contact);
};

// @desc Delete Contact
// @route Delete http://localhost:9000/contacts/:contactid
export const deleteContact = (contactId) =>{
    const url = `${SERVER_URL}/contacts/${contactId}`;
    return axios.delete(url);
};