import { Avatar, AvatarImage } from "./ui/avatar";

const BotAvatar = () => {
    return (
        <Avatar className="h-8 w-8">
            <AvatarImage src='/globe.svg' />
        </Avatar>
    );
}

export default BotAvatar