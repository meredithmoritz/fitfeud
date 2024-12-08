const configs = {
    development: {
        apiKey: "AIzaSyAw7n52UncGHLV6ASY1PAwOT2_XgT-5jPk",
        authDomain: "fitfeud-dev.firebaseapp.com",
        projectId: "fitfeud-dev",
        messagingSenderId: "563932128447",
    },
    testing: {
        apiKey: "AIzaSyCMsncKrnJP0uZWpxesIgNiPWIhHk3am8o",
        authDomain: "fitfeud-test.firebaseapp.com",
        projectId: "fitfeud-test",
        messagingSenderId: "852956770036",
    },
    production: {
        apiKey: "AIzaSyDqZYXwkeLYRm9rBYujeRokzJI8o45gRYE",
        authDomain: "fitfeud-34151.firebaseapp.com",
        projectId: "fitfeud-34151",
        storageBucket: "fitfeud-34151.appspot.com",
        messagingSenderId: "1051381490700",
        appId: "1:1051381490700:web:c292d29f5c6b7c5429ba29",
        measurementId: "G-0TZJPKN7ML"
    }
};

export const getFirebaseConfig = () => {
    const env = process.env.REACT_APP_ENV || 'development';
    return configs[env];
};