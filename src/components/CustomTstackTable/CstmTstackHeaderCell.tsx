import { capitalizeStr } from "^/utils/capitalizeStr"
import { FC } from "react"

interface CstmTstackHeaderCellProps {
    str: string
}

const CstmTstackHeaderCell: FC<CstmTstackHeaderCellProps> = ({ str }) => {
    return <div className="flex items-start justify-start"> {capitalizeStr(str)} </div>
}

export default CstmTstackHeaderCell