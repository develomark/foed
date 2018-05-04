import styled from 'styled-components';

export const Table = styled.div`
  width: 100%;

  &:last-child tr:last-child {
    border-bottom: 0;
  }
`;

export const TableRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.borderColor};
  word-wrap: break-word;
`;

interface TableDataProps {
  alignRight?: boolean;
  size?: number;
}

export const TableData = styled.div`
  flex: ${props => (props.size != null ? props.size : 1)};
  padding: 8px 4px;
  font-size: 14px;
  text-align: ${(props: TableDataProps) =>
    props.alignRight ? 'right' : 'left'};
`;
