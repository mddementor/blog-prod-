const baseURL = 'https://blog-platform.kata.academy/api'

export const login = async ({email, password}:{email: string, password: string}) => {
    const response = await fetch(`${baseURL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user:{
                email,
                password
            }
        })
    });
    if (!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Login failed');
    }
    const data = await response.json();
    return data;
};

export const register = async (email: string, password: string, username: string) => {
    const response = await fetch(`${baseURL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user:{
                username: username,
                email: email,
                password: password,
            }
        })
    });
    if (!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Register failed');
    }
    const data = await response.json();
    await login({email, password})
    return data;
};

export const editProfile = async (newEmail: string, newUsername: string, newPassword: string, token: string) => {
 const response = await fetch(`${baseURL}/user`, {
     method: 'PUT',
     headers: {
         'Content-Type': 'application/json',
         'Authorization': `Token ${token}`
     },
     body: JSON.stringify({
         user: {
             email: newEmail,
             username: newUsername,
             password: newPassword,
         }
     })
 })
    if (!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Edit profile failed');
    }
    const data = await response.json();
    console.log(data)
    return data;
};

//export const getCurrentUser = async () => {
//    const response = await
//}