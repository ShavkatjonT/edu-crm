import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import showPassOpen from '../../../public/images/showPassOpen.png';
import showPass from '../../../public/images/showPass.png';
import useMediaQueries from 'media-queries-in-react';

const BasicContent = styled.div`
    .passInputPart{
        display: flex;
        border: 2px solid transparent;
        background-color: #F3F3F3;
        color: #252525;
        font-weight: 400px;
        border-radius: 8px;
        transition: 0.2s ease-in-out;
        .iconBtn{
            width: 15%;
            display: flex;
            justify-content: center;
            align-items: center;
            button{
                width: 20px;
                border: none;
                cursor: pointer;
                background-color: transparent;
                img{
                    width: 100%;
                }
                @media screen and (max-width: 600px){
                    &{
                        width: 15px;
                    }
                }
            }
        }
    }
`;

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
    width: 100%;
    padding: 16px;
    transition: 0.2s ease-in-out;
    font-size: 16px;
    line-height: 19.09px;
    background-color: transparent;
    border: none;
    color: #252525;
    font-weight: 400px;
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
    width: 100%;
    padding: 10px;
    transition: 0.2s ease-in-out;
    font-size: 16px;
    line-height: 19.09px;
    background-color: transparent;
    border: none;
    color: #252525;
    font-weight: 400px;
    &::placeholder{
        color: #BFBFBF;
    }
`;


const PasswordInput = ({ value, onChange, disabled, invalid, width, placeholder, smallInput, isResponsive, errorMessage, ref }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [inputFocus, setInputFocus] = useState(false);

    const changeShowPass = (click) => {
        click.preventDefault();
        setShowPassword(!showPassword);
    };

    const onInputFucos = () => {
        setInputFocus(true);
    };
    const onInputBlur = () => {
        setInputFocus(false);
    };

    const responsiveStyle = {
        padding: '20px',
        fontSize: '20px'
    };
    const responsiveStyleHelperText = {visibility: invalid ? 'visible' : 'hidden', fontSize: '17px', opacity: invalid ? '1' : '0', color: '#F51C1C', paddingLeft: '10px', transition: 'opacity 0.3s'};

    const additionalStyle = {
        width: width ? width : '100%',
        borderColor: invalid ? '#F51C1C' : inputFocus ? '#607AFB' : '#F3F3F3'
    };
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


    return (
        <BasicContent>
            {smallInput ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div className='passInputPart' style={{
                        width: width ? width : '100%',
                        borderColor: invalid ? '#F51C1C' : inputFocus ? '#607AFB' : '#F3F3F3'
                    }}>
                        <InputSmallContent
                            onFocus={onInputFucos}
                            onBlur={onInputBlur}
                            type={showPassword ? 'text' : 'password'}
                            value={value} onChange={onChange}
                            disabled={disabled}
                            placeholder={placeholder}
                            ref={ref} />
                        <div className='iconBtn'>
                            <button onClick={changeShowPass}>
                                <img src={showPassword ? showPassOpen : showPass} alt="" />
                            </button>
                        </div>
                    </div>
                    {smallQueries.narrow ? <p style={{visibility: invalid ? 'visible' : 'hidden', fontSize: '12px', opacity: invalid ? '1' : '0', color: '#F51C1C', paddingLeft: '10px', transition: 'opacity 0.3s'}}>{errorMessage}</p> : <p style={isResponsive ? responsiveHelperText() : additionalStyleHelperText}>{errorMessage}</p>}  
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div className='passInputPart' style={{
                        width: width ? width : '100%',
                        borderColor: invalid ? '#F51C1C' : inputFocus ? '#607AFB' : '#F3F3F3'
                    }}>
                        <InputContent
                            onFocus={onInputFucos}
                            onBlur={onInputBlur}
                            style={isResponsive && responsiveInput()}
                            type={showPassword ? 'text' : 'password'}
                            value={value} onChange={onChange}
                            disabled={disabled}
                            placeholder={placeholder}
                            ref={ref} />
                        <div className='iconBtn'>
                            <button onClick={changeShowPass}>
                                <img src={showPassword ? showPassOpen : showPass} alt="" />
                            </button>
                        </div>
                    </div>
                    {smallQueries.narrow ? <p style={{visibility: invalid ? 'visible' : 'hidden', fontSize: '12px', opacity: invalid ? '1' : '0', color: '#F51C1C', paddingLeft: '10px', transition: 'opacity 0.3s'}}>{errorMessage}</p> : <p style={isResponsive ? responsiveHelperText() : additionalStyleHelperText}>{errorMessage}</p>}  
                </div>
            )}
        </BasicContent>
    );
};

PasswordInput.propTypes = {
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

export default PasswordInput;