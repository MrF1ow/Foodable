
export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="animate-pulse bg-gray-200 rounded-lg w-1/2 h-1/2"></div>
            <div className="mt-4 text-gray-500">Loading...</div>
        </div>
    );
}