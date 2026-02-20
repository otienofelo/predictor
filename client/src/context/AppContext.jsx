import React, { createContext,useContext } from "react";
import { useEffect, useReducer } from 'react'

// Actions
export const ACTIONS = {
  SET_FARMERS: "SET_FARMERS",
  ADD_FARMER: "ADD_FARMER",
  UPDATE_FARMER: "UPDATE_FARMER",
  DELETE_FARMER: "DELETE_FARMER",
  SET_CURRENT_FARMER: "SET_CURRENT_FARMER",
   //Animals
  SET_ANIMALS: 'SET_ANIMALS',
  ADD_ANIMAL: 'ADD_ANIMAL',
  UPDATE_ANIMAL: 'UPDATE_ANIMAL',
  DELETE_ANIMAL: 'DELETE_ANIMAL',
  SET_CURRENT_ANIMAL: 'SET_CURRENT_ANIMAL',
    // Visits (Health Records)
  SET_VISITS: 'SET_VISITS',
  ADD_VISIT: 'ADD_VISIT',
  UPDATE_VISIT: 'UPDATE_VISIT',
  DELETE_VISIT: 'DELETE_VISIT',
  SET_CURRENT_VISIT: 'SET_CURRENT_VISIT',
  // Disease Library
    SET_DISEASES: 'SET_DISEASES',
  ADD_DISEASE: 'ADD_DISEASE',
  UPDATE_DISEASE: 'UPDATE_DISEASE',
  DELETE_DISEASE: 'DELETE_DISEASE',
};


// Initial state
const initialState = {
  userRole: null,
  selectedAnimal: null,
  farmers: [],
  currentFarmer: null,
   animals: [],          
  currentAnimal: null, 
  currentVisit: null,
  visits: [],
  diseases: [],
};

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_FARMERS:
      return { ...state, farmers: action.payload };
    case ACTIONS.ADD_FARMER:
      return { ...state, farmers: [...state.farmers, action.payload] };
    case ACTIONS.UPDATE_FARMER:
      return {
        ...state,
        farmers: state.farmers.map(f =>
          f.id === action.payload.id ? action.payload : f
        ),
      };
    case ACTIONS.DELETE_FARMER:
      return {
        ...state,
        farmers: state.farmers.filter(f => f.id !== action.payload),
      };
    case ACTIONS.SET_CURRENT_FARMER:
      return { ...state, currentFarmer: action.payload };

      //Animals
        case ACTIONS.SET_ANIMALS:
      return { ...state, animals: action.payload }
    case ACTIONS.ADD_ANIMAL:
      return { ...state, animals: [...state.animals, action.payload] }
    case ACTIONS.UPDATE_ANIMAL:
      return {
        ...state,
        animals: state.animals.map(a => a.id === action.payload.id ? action.payload : a),
      }
    case ACTIONS.DELETE_ANIMAL:
      return { ...state, animals: state.animals.filter(a => a.id !== action.payload) }
    case ACTIONS.SET_CURRENT_ANIMAL:
      return { ...state, currentAnimal: action.payload }
    default:
      return state;
      //visits
  case ACTIONS.SET_VISITS:
  return { ...state, visits: action.payload }

case ACTIONS.ADD_VISIT:
  return { ...state, visits: [...state.visits, action.payload] }

case ACTIONS.UPDATE_VISIT:
  return {
    ...state,
    visits: state.visits.map(v =>
      v.id === action.payload.id ? action.payload : v
    )
  }

case ACTIONS.DELETE_VISIT:
  return {
    ...state,
    visits: state.visits.filter(v => v.id !== action.payload)

  }
// Disease Library
case ACTIONS.SET_CURRENT_VISIT:
  return { ...state, currentVisit: action.payload }
  case ACTIONS.SET_DISEASES:
  return { ...state, diseases: action.payload }
case ACTIONS.ADD_DISEASE:
  return { ...state, diseases: [...state.diseases, action.payload] }
case ACTIONS.UPDATE_DISEASE:
  return {
    ...state,
    diseases: state.diseases.map(d => d.id === action.payload.id ? action.payload : d)
  }
case ACTIONS.DELETE_DISEASE:
  return {
    ...state,
    diseases: state.diseases.filter(d => d.id !== action.payload)
  }

  }
}


export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  //  preload from rules file
   useEffect(() => {
    dispatch({
      type: ACTIONS.SET_DISEASES,
      payload: [], 
    })
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext)