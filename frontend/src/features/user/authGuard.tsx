
import {type JSX } from "react"
import { useCurrentQuery } from "../../app/services/userApi"
import { Spinner } from "@heroui/react";

export const AuthGuard = ({ children } : { children: JSX.Element}) => {
    const { isLoading } = useCurrentQuery(undefined);

    if (isLoading) {
        return <Spinner />;
    }
    return children;
}