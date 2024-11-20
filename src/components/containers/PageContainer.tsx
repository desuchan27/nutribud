export const PageContainer = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="min-h-screen w-full max-w-7xl mx-auto px-2 py-4 flex flex-col gap-8 items-center">     
                {children}
        </div>
    )
}