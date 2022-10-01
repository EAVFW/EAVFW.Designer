import styled from "styled-components";

export const CellTemplate = styled.div<{ role: string }>`
  min-height:10px;
 height: 100%;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;


  &:before{
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    position: absolute;
    content: "";
    background:  ${props => props.role === 'article' ? '#bfbfbf' : '#d9d9d9'};
`