import styled from "styled-components"


type GridProps = {
    rows: string[],
    cols: string[]
}

type GridContainerProps = {
    grid: GridProps
}


export const GridContainer = styled.div<GridContainerProps>`
    width:100%;
    height:100%;
    grid-template-rows: ${(props) => props.grid.rows?.join(" ")};
    grid-template-columns: ${(props) => props.grid.cols?.join(" ")};
    display:grid;
    position:relative;
`