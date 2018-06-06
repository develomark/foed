import styled from 'react-emotion';

export const ReceiptBackground = styled('div')`
  width: 100%;
  background: #255042;
  margin: 20px 0;
  padding: 20px 0;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    display: block;

    height: 10px;
    bottom: -10px;
    left: 0;
    right: 0;
    background: linear-gradient(
        45deg,
        transparent 33.333%,
        #255042 33.333%,
        #255042 66.667%,
        transparent 66.667%
      ),
      linear-gradient(
        -45deg,
        transparent 33.333%,
        #255042 33.333%,
        #255042 66.667%,
        transparent 66.667%
      );

    background-size: 8px 20px; /* toothSize doubleHeight */
    background-position: 0 -10px; /* horizontalOffset -height */
  }

  &:after {
    content: '';
    position: absolute;
    display: block;

    height: 10px;
    top: -10px;
    left: 0;
    right: 0;
    background: linear-gradient(
        45deg,
        #255042 33.333%,
        transparent 33.333%,
        transparent 66.667%,
        #255042 66.667%
      ),
      linear-gradient(
        -45deg,
        #255042 33.333%,
        transparent 33.333%,
        transparent 66.667%,
        #255042 66.667%
      );

    background-size: 8px 20px; /* toothSize doubleHeight */
    background-position: 0 -10px; /* horizontalOffset -height */
  }
`;