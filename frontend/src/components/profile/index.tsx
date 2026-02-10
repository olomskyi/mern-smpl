import { Card, CardBody, CardHeader, Image } from "@heroui/react";
import { useAppSelector } from "../../app/hooks";
import { selectCurrent } from "../../features/user/userSlice";
import { BASE_URL } from "../../constants";
import { Link } from "react-router-dom";
import { MdAlternateEmail } from "react-icons/md";

export const Profile = () => {
    const current = useAppSelector(selectCurrent);

    console.log("Current user:", current);

    if (!current) {
        console.log("Current user NOT found!");
        return null;
    }

    const { name, email, avatarUrl, id } = current;

    return (
        <Card className='py-4 w-75.5' >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-center" >
                <Image
                    alt='Card profile'
                    className="object-cover rounded-xl"
                    src={`${BASE_URL}${avatarUrl ?? ""}`}
                    width={370}
                />
            </CardHeader>
            <CardBody>
                <Link to={`/users/${id}`} >
                    <h4 className="font-bold text-large mb-2">{name}</h4>
                </Link>
                <p className="text-default-500 flex items-center gap-2">
                    <MdAlternateEmail />
                    {email}
                </p>
            </CardBody>
        </Card>
    )
}