import styled from 'styled-components';
import { Card } from 'rendition';

export const GridCard = styled(Card)`
padding: 0px;
overflow-x: hidden;
overflow-y: scroll;
:hover{
    box-shadow: 0 3px 4px 0 rgba(0,0,0,0.34);
}
`;

