import styled from "styled-components"


type CellProps = {
    cell: {

        position: {
            col: number,
            row: number,
        },
        span: {
            cols: number,
            rows: number,

        },
        alignment: {
            vertical: string,
            horizontal: string
        }
    }

}

export const CellStyled = styled.div<CellProps>`
    grid-row-start: ${props => props.cell.position.row};
    grid-row-end: ${props => props.cell.position.row + props.cell.span.rows};
    grid-column-start: ${props => props.cell.position.col};
    grid-column-end: ${props => props.cell.position.col + props.cell.span.cols};
    display: flex;
    flex-wrap: wrap;
    min-width: 0;
    position:relative;
`
export const Cell = CellStyled;
//export const Cell: React.FC<CellProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = ({ children, ...props }) => <CellStyled {...props}>{children}</CellStyled>
