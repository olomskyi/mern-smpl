import type { JSX } from "react/jsx-runtime";
import type React from 'react';
import { Button as HeroButton } from "@heroui/react";

type Props = {
    children: React.ReactNode;
    icon?: JSX.Element;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
}

export const Button: React.FC<Props> = ({ children, icon, className, type, fullWidth, color }) => {

    return (
        <HeroButton startContent={icon} size="lg" color={color} className={className} type={type} fullWidth={fullWidth}>
            {children}
        </HeroButton>
    )
}