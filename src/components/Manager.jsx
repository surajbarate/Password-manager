import React, { useState, useRef, useEffect } from 'react';
import eye from '../images/eye.svg';
import eyecross from '../images/eyecross.svg';
import edit from '../images/edit.svg';
import deleteIcon from '../images/delete.svg';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const [showPassword, setShowPassword] = useState(false);
    const passwordRef = useRef();
    const [form, setform] = useState({ website: "", username: "", password: "" });
    const [passwordArray, setpasswordArray] = useState([])

    const getpasswords = async () => {
      let req= await fetch("http://localhost:3000/")
      let passwords = await req.json()
      console.log(passwords)
      setpasswordArray(passwords)
      
    }
    
    useEffect(() => {
       getpasswords()
    }, [])

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        passwordRef.current.type = showPassword ? "password" : "text";
    };

    const savepassword = async () => {
        // Send delete request to avoid duplicates
        await fetch("http://localhost:3000/", {
            method: "DELETE",
            headers: { "content-Type": "application/json" },
            body: JSON.stringify({ id: form.id })
        });
    
        // Add the password to the state array with a unique id
        setpasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
    
        // Send POST request to save the new password
        await fetch("http://localhost:3000/", {
            method: "POST",
            headers: { "content-Type": "application/json" },
            body: JSON.stringify({ ...form, id: uuidv4() })
        });
    
        // Reset the form after saving
        setform({ website: "", username: "", password: "" });
    };
    

    const deletePassword = async (id) => {
        let c = confirm("Do you want to delete the password?");
        if (c) {
            const updatedArray = passwordArray.filter(item => item.id !== id);
            setpasswordArray(updatedArray);
            // localStorage.setItem("passwords", JSON.stringify(updatedArray));
            let res = await fetch("http://localhost:3000/",{method:"DELETE", headers:{"content-Type":"application/json"},body:JSON.stringify({ id})})
        }
    };

    const editPassword = (id) => {
        const selectedPassword = {...passwordArray.filter(i => i.id === id)[0], id:id};
        setform(selectedPassword);
        const updatedArray = passwordArray.filter(item => item.id !== id);
        setpasswordArray(updatedArray);
        
    }

    const handlechange = (e) => {
        editPassword();
        setform({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold">Your Password Manager</h1>
                </div>

                {/* Form */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-10">
                    <div className="flex flex-col w-full sm:flex-row gap-5 ">
                        <input
                            value={form.website}
                            onChange={handlechange}
                            name="website"
                            className="border-solid border-2 border-gray-300 rounded-lg p-3 w-full sm:w-1/2"
                            type="text"
                            placeholder="Enter website name"
                            aria-label="Website Name"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-5 mt-5">
                        <input
                            value={form.username}
                            onChange={handlechange}
                            name="username"
                            className="border-solid border-2 border-gray-300 rounded-lg p-3 w-full sm:w-1/2"
                            type="text"
                            placeholder="Enter username"
                            aria-label="Username"
                        />
                        <div className="relative w-full sm:w-1/2">
                            <input
                                value={form.password}
                                onChange={handlechange}
                                name="password"
                                ref={passwordRef}
                                className="border-solid border-2 border-gray-300 rounded-lg p-3 w-full"
                                type="password"
                                placeholder="Enter password"
                                aria-label="Password"
                            />
                            <img
                                src={showPassword ? eyecross : eye}
                                alt="Toggle Password Visibility"
                                className="absolute right-3 top-3 cursor-pointer w-6 h-6"
                                onClick={togglePasswordVisibility}
                            />
                        </div>
                    </div>
                    <button
                        onClick={savepassword}
                        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg w-full sm:w-auto"
                    >
                        Save Password
                    </button>
                </div>

                {/* Password List */}
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Website</th>
                                <th className="border border-gray-300 px-4 py-2">Username</th>
                                <th className="border border-gray-300 px-4 py-2">Password</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {passwordArray.length > 0 ? (
                                passwordArray.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 px-4 py-2 break-all">
                                            <a href={item.website} target="_blank" rel="noopener noreferrer">{item.website}</a>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{item.username}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.password}</td>
                                        <td className="border border-gray-300 px-4 py-2 flex gap-4">
                                            <button
                                                onClick={() => editPassword(item.id)}
                                                className="text-blue-500"
                                            >
                                                <img src={edit} alt="Edit" className="inline w-4 h-4" /> Edit
                                            </button>
                                            <button
                                                onClick={() => deletePassword(item.id)}
                                                className="text-red-500"
                                            >
                                                <img src={deleteIcon} alt="Delete" className="inline w-4 h-4" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center px-4 py-2">No saved passwords</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Manager;
