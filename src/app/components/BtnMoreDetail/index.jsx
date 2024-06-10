import { Button } from "@nextui-org/react";

function BtnMoreDetail({ label, bg, height, align, py, onClick, ...rest }) {
    return (  
        <Button
            fullWidth
            variant="light"
            className={`${bg || 'bg-transparent'} ${height} data-[hover=true]:bg-transparent data-[hover=true]:border-1 border-default-200 rounded-md justify-start cursor-text ${align || 'items-start'} ${py || 'py-2'} px-2`}
            onClick={onClick}
            {...rest}
        >
            <span className="text-sm font-normal">{label}</span>
        </Button>
    );
}

export default BtnMoreDetail;