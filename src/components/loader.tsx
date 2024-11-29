import Image from "next/image"

export const Loader = () => {
    return (
        <div className="w-7 h-9 relative animate-spin">
            <Image alt="logo" fill src="/globe.svg" />
        </div>
    )
}

export default Loader