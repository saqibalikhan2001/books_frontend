export const removeNewlines = (str) => {
  if(str){
    return str.replace(/\n/g, "");
  }else{
    return null;
  }
};
