import { useContext } from "react";
import { ThemeContext } from "../theme-provider";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { FaRegMoon } from "react-icons/fa";
import { LuSunMedium } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout, selectIsAuthenticated } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { Button } from "@heroui/react";

export const Header = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        void navigate('/auth');
    }

    return (
        <Navbar>
            <NavbarBrand>
                <p className="font-bold text-inherit">Network Social</p>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem className="lg:flex text-3xl cursor-pointer" 
                onClick={() => {toggleTheme()}}>
                    { theme === 'light' ? <FaRegMoon /> : <LuSunMedium />}
                </NavbarItem>
                <NavbarItem>
                    {isAuthenticated && (
                        <Button color="default" variant="flat" className="gap-2" onPress={handleLogout} >
                            <CiLogout />
                            <span>Logout</span>
                        </Button>
                    )}
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}