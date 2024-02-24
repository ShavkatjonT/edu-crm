import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useMediaQueries from 'media-queries-in-react';


const InputContent = styled.input`
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
const InputSmallContent = styled.input`
@font-face {
    font-family: 'sfPro';
    src: url(/public/fonts/sf-pro-display/SFPRODISPLAYREGULAR.OTF);
}
    font-family: 'sfPro';
    padding: 10px;
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

const Input = ({ value, onChange, disabled, invalid, width, placeholder, smallInput, isResponsive, errorMessage, ref }) => {

    const responsiveStyle = { 
        width: width ? width : '100%',
        borderColor: invalid && '#F51C1C',
        padding: '18px',
        fontSize: '20px'
    };
    const responsiveStyleHelperText = {visibility: invalid ? 'visible' : 'hidden', fontSize: '17px', opacity: invalid ? '1' : '0', color: '#F51C1C', paddingLeft: '10px', transition: 'opacity 0.3s'};

    const additionalStyle = { width: width ? width : '100%', borderColor: invalid && '#F51C1C'};
    const additionalStyleHelperText = {visibility: invalid ? 'visible' : 'hidden', opacity: invalid ? '1' : '0', color: '#F51C1C', paddingLeft: '10px', transition: 'opacity 0.3s'};


    const mediaQueries = useMediaQueries({
        narrow: 'screen and (min-width: 1600px)',
    });
    const smallQueries = useMediaQueries({
        narrow: 'screen and (max-width: 600px)',
    });
    const responsiveInput = function () {
        if (mediaQueries.narrow) {
            return responsiveStyle;
        }else{
            return additionalStyle;
        }
    };

    const responsiveHelperText = function () {
        if (mediaQueries.narrow) {
            return responsiveStyleHelperText;
        }else{
            return additionalStyleHelperText;
        }
    };

    return smallInput ? (
        <InputSmallContent style={{ width: width ? width : '100%', borderColor: invalid && '#F51C1C'}} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} ref={ref} />
    ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
            <InputContent style={isResponsive ? responsiveInput() : additionalStyle} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} ref={ref} />
            {smallQueries.narrow ? <p style={{visibility: invalid ? 'visible' : 'hidden', fontSize: '12px', opacity: invalid ? '1' : '0', color: '#F51C1C', paddingLeft: '10px', transition: 'opacity 0.3s'}}>{errorMessage}</p> : <p style={isResponsive ? responsiveHelperText() : additionalStyleHelperText}>{errorMessage}</p>}  
        </div>
    );
};

Input.propTypes = {
    isResponsive: PropTypes.bool,
    smallInput: PropTypes.bool,
    errorMessage: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    width: PropTypes.number,
    invalid: PropTypes.bool,
    ref: PropTypes.any
};

export default Input;