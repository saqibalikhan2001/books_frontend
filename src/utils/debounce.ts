export const debounce = (fn: any, delay: number) => {
  let timer;
  return function () {
    //@ts-ignore
    let context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
};
