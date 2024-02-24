import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useMediaQueries from 'media-queries-in-react';

const ButtonContent = styled.button`
@font-face {
    font-family: 'sfPro';
    src: url(/public/fonts/sf-pro-display/SFPRODISPLAYREGULAR.OTF);
}
    @media screen and (max-width: 600px){
        &{
            padding: 13px;
            font-size: 13px;
        }
    }
    font-family: 'sfPro';
    padding: 16px;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    font-size: 16px;
    line-height: 19.09px;
    border-radius: 8px;
    border: none;
    background-color: #607AFB;
    color: #FFFFFF;
    font-weight: 400px;
    &:hover{
        background-color: #415cdf;
    }
    &:active{
        background-color: #3148b8;
    }
`;
const ButtonSmallContent = styled.button`
@font-face {
    font-family: 'sfPro';
    src: url(/public/fonts/sf-pro-display/SFPRODISPLAYREGULAR.OTF);
}
    font-family: 'sfPro';
    padding: 10px;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    font-size: 16px;
    line-height: 19.09px;
    border-radius: 8px;
    border: 2px solid transparent;
    background-color: #F3F3F3;
    color: #252525;
    font-weight: 400px;
    &:focus{
        border-color: #607AFB;
    }
    &::placeholder{
        color: #BFBFBF;
    }
`;

const Button = ({ value, onClick, disabled, width, smallInput, isResponsive, ref }) => {

    const responsiveStyle = { 
        width: width ? width : '100%',
        padding: '20px',
        fontSize: '20px'
    };

    const additionalStyle = { width: width ? width : '100%'};


    const mediaQueries = useMediaQueries({
        narrow: 'screen and (min-width: 1600px)',
    });

    const responsiveButton = function () {
        if (mediaQueries.narrow) {
            return responsiveStyle;
        }else{
            return additionalStyle;
        }
    };


    return smallInput ? (
        <ButtonSmallContent style={{ width: width ? width : '100%' }} onClick={onClick} disabled={disabled} ref={ref}>
            {value}
        </ButtonSmallContent>
    ) : (
        <ButtonContent  style={isResponsive ? responsiveButton() : additionalStyle} onClick={onClick} disabled={disabled} ref={ref}>
            {value}
        </ButtonContent>
    );
};

Button.propTypes = {
    isResponsive: PropTypes.bool,
    smallInput: PropTypes.bool,
    value: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    width: PropTypes.number,
    ref: PropTypes.any
};

export default Button;