import { useAppSelector } from "../../app/hooks";
import { User } from "../../components/user";
import { selectCurrent } from "../../features/user/userSlice";
import { Link } from "react-router-dom";
import { Card, CardBody } from "@heroui/react";

export const Following = () => {
    const currentUser = useAppSelector(selectCurrent);

    if (!currentUser) {
        console.log("Following: current user not found!");
        return null;
    }

    return currentUser.following.length > 0 ? (
        <div className="flex flex-col gap-5" >
            { currentUser.following.map(user => (
                <Link to={`/user/${user.following.id}`} key={user.following.id}>
                    <Card >
                        <CardBody className="block">
                            <User
                                name={user.following.name ?? ''}
                                avatarUrl={user.following.avatarUrl ?? ''}
                                description={user.following.email}
                            />
                        </CardBody>
                    </Card>
                </Link>
            ))}
        </div>
    ) : (
        <h1>No followers</h1>
    )
}