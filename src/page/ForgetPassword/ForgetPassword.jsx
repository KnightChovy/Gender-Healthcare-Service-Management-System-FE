import React from 'react'
import FormInputText from '../../components/ui/FormInputText';

function ForgetPassword() {
    return (  
        <div className='forget-password'>
            <h2>Quên mật khẩu</h2>
            <p>Vui lòng nhập số điện thoại của bạn để nhận liên kết đặt lại mật khẩu.</p>
            <form>
                <FormInputText textHolder="Số điện thoại" textName="phone" type="text" />
                <button type="submit">Gửi liên kết đặt lại mật khẩu</button>
            </form>
        </div>
    );
}

export default ForgetPassword;