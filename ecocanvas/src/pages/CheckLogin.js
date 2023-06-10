import React from "react";
const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 로그인 상태를 localstorage에서 확인
        const loggedInStatus = localStorage.getItem('access');
        if (loggedInStatus) {
            setIsLoggedIn(true);
        }
    }, []);
}
export { Home };