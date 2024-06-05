type VerticalLineProps = {
    height: number,
    color: string
}

const VerticalLine = ({height, color}: VerticalLineProps) => {
    return <div style={{borderLeft: `3px solid ${color}`, height: `${height}px`, margin: "-1px 6px"}} className="ml-1"></div>
}

export default VerticalLine;