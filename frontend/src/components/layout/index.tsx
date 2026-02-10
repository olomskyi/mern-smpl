import { type NavigateFunction, Outlet, useNavigate } from "react-router-dom";
import { Container } from "../container";
import { Header } from "../header";
import { NavBar } from "../nav-bar";
import { selectCurrent, selectIsAuthenticated, selectUser } from "../../features/user/userSlice";
import { useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { Profile } from "../profile";

export const Layout = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const navigate: NavigateFunction = useNavigate();
    const user = useAppSelector(selectUser);
    const current = useAppSelector(selectCurrent);
    let currentUser = user;

    if (!user) {
        console.log("User NOT found!");
        if (!current) {
            console.log("Current user NOT found!");
        }
        else {
            currentUser = current;
        }
    }

    useEffect(() => {
        if (!isAuthenticated) {
            void navigate('/auth');
        }
    })

    return (
        <>
            <Header />
            <Container>
                <div className="p-4">
                    <NavBar />
                </div>
                <div className="flex flex-row">
                    <div className="flex-1 p-4">
                        <Outlet />
                    </div>
                    <div className="flex flex-1 p-4 justify-center">
                        <div className="flex-col flex gap-5">
                            {currentUser && <Profile />}
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
}