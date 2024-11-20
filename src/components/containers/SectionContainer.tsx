"use client"

export const SectionContainerCenter = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="w-full flex flex-col gap-4 items-center">     
                {children}
        </div>
    )
}

export const SectionContainerStart = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="w-full flex flex-col gap-4 items-start">     
                {children}
        </div>
    )
}
