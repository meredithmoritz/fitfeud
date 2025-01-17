import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    setDoc,
} from "firebase/firestore";
import { db } from "../firebase/fire";

const generateRandomID = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomID = "";

    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomID += characters.charAt(randomIndex);
    }
    return randomID;
}

export const createData = async (collectionName, data) => {
    const id = generateRandomID();
    try {
        const docRef = doc(db, collectionName, id);
        await setDoc(docRef, {
            id,
            ...data,
    });
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

export const readData = async (collectionName, id) => {
    try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data: ", docSnap.data());
            return docSnap.data();
        } else {
            console.log("No such document. ");
        }
    } catch (error) {
        console.error("Error reading document: ", error.message);
    }
}

export const updateData = async (collectionName, id, data) => {
    try {
        const docRef = doc(db, collectionName, id);
        await setDoc(docRef, {
            id: id,
            ...data,
        });

        console.log("Document successfully updated!");
    } catch (error) {
        console.log("Error updating document: ", error.message);
    }
}

export const deleteData = async (collectionName, id) => {
    try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);

        console.log("Document successfully deleted!");
    } catch (error) {
        console.error("Error deleting document: ", error.message);
    }
}

export const readAllData = async (collectionName) => {
    try {
        const newDataArr = [];
        const querySnapshot = await getDocs(collection(db, collectionName));
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            newDataArr.push(doc.data());
        });
        return newDataArr;
    } catch (error) {
        console.log("Error reading collection: ", error.message);
    }
}

// Function to listen to a Firestore collection and execute a callback with the new data
export const listenToCollection = (collectionName, callback) => {
    // Create a reference to the collection
    const collectionRef = collection(db, collectionName);

    // Listen to real-time updates in the collection
    return onSnapshot(collectionRef, (querySnapshot) => {
        const newDataArr = [];
        querySnapshot.forEach((doc) => {
            newDataArr.push(doc.data());
        });

        console.log("Current data: ", newDataArr);
        callback(newDataArr);
    });
}


// const newDataArr = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// const newDataArr = querySnapshot.map((doc) => ({id: doc.id, ...doc.data() }));


// const testData = {
//     name: "John Doe",
//     age: 25,
//     email: "testdfsfsdfdsfsdfsdfetrteujj@gmail.com",
// }
//
// createData("Users", testData);