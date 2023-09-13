import React, { useState, useEffect } from "react";
import SearchFilter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Person from "./components/Persons";

import personService from "./services/notes";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDelete = (id) => {
    setPersons(persons.filter((person) => person.id !== id));
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Duration in milliseconds (3 seconds)
  };

  const addPerson = (event) => {
    event.preventDefault();

    if (newName.trim() === "" || newNumber.trim() === "") {
      return; // Ignore empty name or number
    }

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to the phonebook. Do you want to update the number?`
      );

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id === existingPerson.id ? response : person
              )
            );
            setNewName("");
            setNewNumber("");
            showNotification(`Updated ${response.name}`);
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              showNotification(
                `Error: The person you are trying to update does not exist.`
              );
            } else {
              console.log(error);
            }
          });
      }
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    personService
      .create(newPerson)
      .then((response) => {
        setPersons([...persons, response]);
        setNewName("");
        setNewNumber("");
        showNotification(`Added ${response.name}`);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          showNotification(`Error: name: ${error.response.data.error}`);
        } else {
          console.log(error);
        }
      });
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hook = () => {
    console.log("effect");
    personService
      .getAll()
      .then((data) => {
        console.log("promise fulfilled");
        setPersons(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(hook, []);
  console.log("render", persons.length, "persons");

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      />
      {notification && <Notification message={notification} />}
      <h3>Add a new person</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <ul>
        {filteredPersons.map((person, index) => (
          <Person key={index} person={person} handleDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
};

export default App;
