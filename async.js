/**
* ASYNC CODE
*
**/ 

const fetchData = () =>{
    const promise = new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve("Done!(3)!");
        }, 3000);
    });
    return promise;
};

setTimeout (()=>{
    console.log("timer's done");
    fetchData()
    .then(text=>{
        console.log(text);
        return fetchData();
    })
    .then(text=>{
        console.log(text);
        return fetchData();
    });
},2000);


//SYNC CODE
console.log("hello");
console.log("hi");

