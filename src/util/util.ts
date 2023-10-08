export const randomListFromInterval = (length: number, listLength: number) => {
  console.log(length,listLength);
  
  let arr = [];
  while(arr.length < length){
      let r = Math.floor(Math.random() * listLength) + 1;
      if(arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
};
