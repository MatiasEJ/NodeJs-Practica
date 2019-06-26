// const person = {
//     name: "Juan",
//     age: 29,
//     //funciones en los objetos
//     greet() {
//         console.log('Hi, Iam ' + this.name);
//     }
// };
// person.greet();

const hobbies = [ "sports","cooking","wat"];
// for (let hobby of hobbies){
//     console.log(hobby);
// }
// console.log(hobbies.map(hobby =>{
//     return "hobby: "+hobby;
// }));
// console.log(hobbies);


//Arrays objetos por referencia.

// hobbies.push("programming");
// console.log(hobbies);

//copia de arrays

// const copiaDeArray = hobbies.slice();
const copiaDeArray = [...hobbies];
console.log(copiaDeArray);

//..args

const toArray = (...args)=>{
    return args;
}
console.log(toArray(1,2,3,4,5));