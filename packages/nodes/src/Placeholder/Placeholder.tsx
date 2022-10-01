import styled from "styled-components";



export const Placeholder = styled.div`
    min-height: 80px;
    font-family: monospace;
    font-size: 12px;
    text-transform: uppercase;
    height: 100%;
    width: 100%;
   
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 auto;
    flex-direction: column;

position:relative;
 
  &:before{
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    position: absolute;
    content: "";
    background: repeating-linear-gradient(
45deg
, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 10px, rgba(0, 0, 0, 0.05) 10px, rgba(0, 0, 0, 0.05) 20px);
 }
`;