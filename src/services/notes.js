import axios from "axios";

const baseUrl = "/api/persons";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newPerson) => {
  const response = await axios.post(baseUrl, newPerson);
  return response.data;
};
const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
};
const update = async (id, newPerson) => {
  const response = await axios.put(`${baseUrl}/${id}`, newPerson);
  return response.data;
};

const personService = {
  getAll,
  create,
  remove,
  update,
};

export default personService;
