const person = {
    name: "Juan",
    age: 29,
    //funciones en los objetos
    greet() {
        console.log('Hi, Iam ' + this.name);
    }
};
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

// // const copiaDeArray = hobbies.slice();
// const copiaDeArray = [...hobbies];
// console.log(copiaDeArray);

//..args

// const toArray = (...args)=>{
//     return args;
// }
// console.log(toArray(1,2,3,4,5));


//Inmutabilidad no tocar, copiar y crear nuevo

// const copiedArray = hobbies.slice();
// const copiedArray = [hobbies]; //array de arrat

// //spread operator
// const copiedArray = [...hobbies];
// console.log(copiedArray);


// //rest operators MERGE multiple args in arrays 
// const toArray = (...args) =>{
//     return args;
// }

// console.log(toArray(1,2,3));

const printName = (personData) =>{
    console.log(personData.name);

}
//destructuracion

const deconstrucName = ({name,age})=>{
    console.log(name,age);
} 

//destructuracion objects

const {name, age} = person;
console.log(name,age);

deconstrucName(person);
//destructuracion arrays

const [hob1, hob2,hob3] = hobbies;
console.log(hob1,hob2,hob3);


