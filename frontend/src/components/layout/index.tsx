import { type NavigateFunction, Outlet, useNavigate } from "react-router-dom";
import { Container } from "../container";
import { Header } from "../header";
import { NavBar } from "../nav-bar";
import { selectIsAuthenticated, selectUser } from "../../features/user/userSlice";
import { useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { Profile } from "../profile";

export const Layout = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const navigate: NavigateFunction = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            void navigate('/auth');
        }
    })

    return (
        <>
            <Header />
            <Container>
                <div className="flex-1 p-4">
                    <NavBar />
                </div>
                <div className="flex-2 p-4">
                    <Outlet />
                </div>
                <div className="flex-2 p-4">
                    <div className="flex-col flex gap-5">
                        {user && <Profile />}
                    </div>
                </div>
            </Container>
        </>
    )
}