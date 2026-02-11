import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks"
import { selectCurrent } from "../../features/user/userSlice"
import { Card, CardBody } from "@heroui/react";
import { User } from "../../components/user";

export const Followers = () => {
    const currentUser = useAppSelector(selectCurrent);

    if (!currentUser) {
        console.log("Followers: current user not found!");
        return null;
    }

    return currentUser.followers.length > 0 ? (
        <div className="flex flex-col gap-5" >
            { currentUser.followers.map(user => (
                <Link to={`/user/${user.follower.id}`} key={user.follower.id}>
                    <Card >
                        <CardBody className="block">
                            <User
                                name={user.follower.name ?? ''}
                                avatarUrl={user.follower.avatarUrl ?? ''}
                                description={user.follower.email}
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