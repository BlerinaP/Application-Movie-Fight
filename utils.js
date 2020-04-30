const debounce = (func, delay = 1000) => { // we declare the parameters of debounce function which is delay and func
  let timeoutId;
  return(...args) => {
    if(timeoutId){
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
