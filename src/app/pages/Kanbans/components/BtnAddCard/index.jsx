import { Button } from "@nextui-org/react"; 

function BtnAddCard({ label, icon, onClick, ...rest }) {
    return (  
        <Button
            fullWidth
            variant="light"
            radius="sm"
            className="bg-transparent justify-start pl-1"
            startContent={icon || <></>}
            onClick={onClick}
            {...rest}
        >
            <span className="font-medium">{label}</span>
        </Button>
    );
}

export default BtnAddCard;