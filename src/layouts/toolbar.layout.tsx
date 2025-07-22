



const ToolbarLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="flex flex-col ">
            <div className="flex-1">
                {children}
            </div>
        </div>
    )
}


export default ToolbarLayout;
