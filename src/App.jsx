import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove,
  update,
} from "firebase/database";

const App = () => {
  let [Task, setTask] = useState("");
  let [TaskError, setTaskerror] = useState("");
  let [alltodos, setAlltodos] = useState([]);
  let [edit, setEdit] = useState(false);
  let [editTask, setEdittask] = useState("");
  let [id,setId]=useState('')

  let handleTask = (p) => {
    setTask(p.target.value);
    setTaskerror("");
  };

  let handleSubmit = (p) => {
    p.preventDefault();

    if (Task == "") {
      setTaskerror("Task is required");
      notify();
    } else {
      const db = getDatabase();
      set(push(ref(db, "todo/")), {
        todoname: Task,
      }).then(() => {
        setTask("");
      });
    }
  };

  useEffect(() => {
    const db = getDatabase();
    const todoRef = ref(db, "todo/");
    onValue(todoRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        array.push({ value: item.val(), id: item.key });
        setAlltodos(array);
      });
    });
  }, []);

  let handleDelete = (id) => {
    const db = getDatabase();
    remove(ref(db, "todo/" + id));
  };

  let hanldeEdit = (item) => {
    setEdit(true);
    setId(item.id);
  };

  let handleupdateTask = (p) => {
    setEdittask(p.target.value);
  };

  let handleUpdate = (p) => {
    const db = getDatabase();
    update(ref(db, "todo/" + id), {
      todoname: editTask,
    }).then(()=>{
      setEdit(false)
    } )
    
  };

  return (
    <div>
      <div className="max-w-sm mx-auto">
        <div className="mb-5 mt-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Enter Your Task
          </label>
          <input
            value={Task}
            onChange={handleTask}
            type="Text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter Your Task"
          />
          {TaskError && (
            <p className="text-red-500 font-poppins mt-3 text-sm">
              {TaskError}
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
        <div className="mt-2">
          <ul className="w-[390] relative text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {alltodos.map((item) => (
              <li className="w-full flex justify-between px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                {item.value.todoname}

                <div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 py-2 px-3 rounded-sm"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => hanldeEdit(item)}
                    className="bg-green-500 py-2 px-3 rounded-sm ml-2"
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}

            {edit && (
              <div className="w-full bg-gray-500 absolute top-0 left-0 p-5">
                <input
                  onChange={handleupdateTask}
                  type="Text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                  placeholder="Update Your Task"
                />
                <button
                  onClick={handleUpdate}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2"
                >
                  Update
                </button>
                <button
                  onClick={() => setEdit(false)}
                  className="text-white bg-red-500 hover:bg-green-500  px-5 py-2.5 rounded-md ml-3"
                >
                  Cancel
                </button>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
