import React, { Fragment } from "react";
import "./App.css";

import { AppStateProvider, useAppState } from "./sweatpants";

///////////////////////////////////////////////////////////////////////////////

const initialState = {
  todos: [{ id: 1, text: "8 O Clock" }],
  visibility: "ALL"
};

const appStateReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.todo] };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.todo.id) {
            return { ...todo, completed: !todo.completed };
          }

          return todo;
        })
      };
    case "CHANGE_VISIBILITY":
      return { ...state, visibility: action.visibility };
    default:
      return state;
  }
};

///////////////////////////////////////////////////////////////////////////////

const Todo = ({ todo }) => {
  const [, dispatch] = useAppState();

  return (
    <li
      onClick={() => dispatch({ type: "TOGGLE_TODO", todo })}
      style={{
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
  const [, dispatch] = useAppState();

  return (
    <Fragment>
      <button
        onClick={() =>
          dispatch({ type: "CHANGE_VISIBILITY", visibility: "ALL" })
        }
      >
        Show All
      </button>
      <button
        onClick={() =>
          dispatch({ type: "CHANGE_VISIBILITY", visibility: "ACTIVE" })
        }
      >
        Show Active
      </button>
      <button
        onClick={() =>
          dispatch({ type: "CHANGE_VISIBILITY", visibility: "COMPLETED" })
        }
      >
        Show Completed
      </button>
    </Fragment>
  );
};

const filterTodos = (todos, visibility) => {
  switch (visibility) {
    case "ACTIVE":
      return todos.filter(todo => !todo.completed);
    case "COMPLETED":
      return todos.filter(todo => todo.completed);
    case "ALL":
    default:
      return todos;
  }
};

const TodoApp = () => {
  const [state,] = useAppState();
  const todos = filterTodos(state.todos, state.visibility);

  return (
    <Fragment>
      <TodoList todos={todos} />
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
