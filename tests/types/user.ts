export interface TestUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
}

export interface UserData {
    testUsers: {
        standard: TestUser;
        newUser: TestUser;
    }
}