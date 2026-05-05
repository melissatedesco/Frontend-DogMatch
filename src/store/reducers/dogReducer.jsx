const dogReducer = (state, action) => {
  switch (action.type) {

    case 'CARICA_RICHIESTE':
      return {
        ...state,
        requests: action.payload
      };

    case 'ACCETTA_MATCH': {
      const acceptedDog = state.requests.find(d => d.id === action.payload);
      if (!acceptedDog) return state;
      return {
        ...state,
        matches: [...state.matches, acceptedDog],
        requests: state.requests.filter(d => d.id !== action.payload)
      };
    }

    case 'AGGIUNGI_MATCH_DIRETTO':
      return {
        ...state,
        matches: [...state.matches, action.payload]
      };

    case 'CARICA_MATCHES':
      return {
        ...state,
        matches: action.payload
      };

    case 'RIFIUTA_MATCH':
      return {
        ...state,
        requests: state.requests.filter(req => req.id !== action.payload)
      };

    default:
      return state;
  }
};

export default dogReducer;
