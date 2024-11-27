const users = [
    {
        id: "001",
        username: "superAdmin",
        password: "1234",
        role: "superAdmin",
        token: "superAdmin",
        name_surname: "Araya Kositkrai"
    },
    {
        id: "002",
        username: "admin",
        password: "1234",
        role: "admin",
        token: "admin",
        name_surname: "Sirin Chanton"
    },
    {
        id: "003",
        username: "user1",
        password: "1234",
        role: "user",
        token: "user",
        name_surname: "Sirawan Jandang"
    },
    {
        id: "004",
        username: "user2",
        password: "1234",
        role: "user",
        token: "user",
        name_surname: "Jiraphat Teaman"
    },
    {
        id: "005",
        username: "user3",
        password: "1234",
        role: "user",
        token: "user",
        name_surname: "Kritsada Chomthong"
    },
    {
        id: "006",
        username: "user4",
        password: "1234",
        role: "user",
        token: "user",
        name_surname: "Nattapong Chomthong"
    },
    {
        id: "007",
        username: "guest1",
        password: "1234",
        role: "guestBranch",
        token: "guest",
        name_surname: "Kannisa Intra"
    },
    {
        id: "008",
        username: "guest2",
        password: "1234",
        role: "guestSubBranch",
        token: "guest",
        name_surname: "Nutdanai Rodmui"
    }
];

export function verifyUser(username, password) {
    const userFound = users.find((u) => {
        //ค้นหาว่ามีในระบบมั้ย
        return u.username === username && u.password === password
    })
    //ถ้าไม่เจอก็ return null
    return userFound ? {
        role: userFound.role,
        token: userFound.token,
        name_surname: userFound.name_surname,
        username: userFound.username
    } : null
}
export default users