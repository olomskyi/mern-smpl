import { type NavigateFunction, Outlet, useNavigate } from "react-router-dom";
import { Container } from "../container";
import { Header } from "../header";
import { NavBar } from "../nav-bar";
import { selectIsAuthenticated } from "../../features/user/userSlice";
import { useAppSelector } from "../../app/hooks";
import { useEffect } from "react";

export const Layout = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    //const user = useAppSelector(selectUser);
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
                <div className="flex-2 p-4">
                    <NavBar />
                </div>
                <div className="flex-1 p-4">
                    <Outlet />
                </div>
                <div>
                    ... {/* TODO */}
                </div>
            </Container>
        </>
    )
}