
export const ErrorMessage = ({ error }: { error: string }) => {

    return error && (
        <p className="text-red-500 mt-2 mb-3 text-small">{error}</p>
    )
}
