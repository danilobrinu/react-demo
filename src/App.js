import React, { Fragment } from "react";
import "./App.css";

////////////////////////////////////////////////////////////////////////////////////////////////////

import { AppStateProvider, useAppState } from "./sweatpants";

////////////////////////////////////////////////////////////////////////////////////////////////////

const initialState = {
  todos: [
    { id: 1, text: "Hacer la tarea temprano", completed: false },
    { id: 2, text: "Comprar pan", completed: false }
  ],
  visibility: "ALL"
};

const appStateReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.payload] };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload.id) {
            return { ...todo, completed: !todo.completed };
          }

          return todo;
        })
      };
    case "CHANGE_VISIBILITY":
      return { ...state, visibility: action.payload };
    default:
      return state;
  }
};

///////////////////////////////////////////////////////////////////////////////

const Todo = ({ todo }) => {
  const [, dispatch] = useAppState();

  return (
    <li
      onClick={() => dispatch({ type: "TOGGLE_TODO", payload: todo })}
      style={{
        margin: 8,
        cursor: "pointer",
        textDecoration: todo.completed ? "line-through" : "none"
      }}
    >
      {todo.text}
    </li>
  );
};

const TodoList = ({ todos }) => (
  <ul>
    {todos.map(todo => (
      <Todo key={todo.id} todo={todo} />
    ))}
  </ul>
);

const TodoFilters = () => {
  const [state, dispatch] = useAppState();

  return (
    <Fragment>
      <button
        style={{
          color: "white",
          backgroundColor: state.visibility === "ALL" ? "green" : "blue"
        }}
        onClick={() => dispatch({ type: "CHANGE_VISIBILITY", payload: "ALL" })}
      >
        Show All
      </button>
      <button
        style={{
          color: "white",
          backgroundColor: state.visibility === "ACTIVE" ? "green" : "blue"
        }}
        onClick={() =>
          dispatch({ type: "CHANGE_VISIBILITY", payload: "ACTIVE" })
        }
      >
        Show Active
      </button>
      <button
        style={{
          color: "white",
          backgroundColor: state.visibility === "COMPLETED" ? "green" : "blue"
        }}
        onClick={() =>
          dispatch({ type: "CHANGE_VISIBILITY", payload: "COMPLETED" })
        }
      >
        Show Completed
      </button>
    </Fragment>
  );
};

const filterTodos = (todos, visibility) => {
  switch (visibility) {
    case "ACTIVE": {
      return todos.filter(todo => !todo.completed);
    }
    case "COMPLETED": {
      return todos.filter(todo => todo.completed);
    }
    case "ALL":
    default: {
      return todos;
    }
  }
};

const TodoApp = () => {
  const [state] = useAppState();
  const todos = filterTodos(state.todos, state.visibility);

  return (
    <Fragment>
      {todos.length ? <TodoList todos={todos} /> : <h3>Add some todo</h3>}
      <TodoFilters />
    </Fragment>
  );
};

///////////////////////////////////////////////////////////////////////////////

export default function App() {
  return (
    <AppStateProvider reducer={appStateReducer} initialState={initialState}>
      <TodoApp />
    </AppStateProvider>
  );
}
