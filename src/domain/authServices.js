import config from '@/configs/appBase';
import http from '@/infrastructures/apiHttp';

export default {
  register(role, newUser) {
    return http.post(`${config.baseApiUrl}/api/v1/${role}/signUpNewVersion`, newUser);
  },
  login(email, password, role) {
    return http.post(`${config.baseApiUrl}/api/v1/${role}/login`, { email: email, password: password });
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuth');
    localStorage.removeItem('user');
    window.location = config.baseUrl + '/login';
  },
  access_denied() {
    window.location = config.baseUrl + '/error/403';
  },
  unauthorized() {
    this.logout();
  },
  getAccessToken(data) {
    return data;
  },
  forgot(email) {
    return http.post(`${config.baseApiUrl}/api/v1/forgotPassword/changePassword/${email}`, { email: email });
  },

  sendOTP(newUser) {
    return http.post(`${config.baseApiUrl}/api/v1/${newUser.role}/signUpNewVersion`, newUser);
  },

  sendOTPForgetPassword(email) {
    return http.post(`${config.baseApiUrl}/api/forgotPassword/sendOtp`, { email: email });
  },

  checkOTP(role, email, otp) {
    const otpNumber = Number(otp);

    console.log(role);
    return http.post(`${config.baseApiUrl}/api/v1/${role}/verifyOtp`, {
      email: email,
      otp: otpNumber
    });
  },

  checkOTPForgotPassword(email, otp) {
    const otpNumber = Number(otp);
    return http.post(`${config.baseApiUrl}/api/forgotPassword/verifyOtp/${otp}/${email}`, {
      email: email,
      otp: otpNumber
    });
  },

  resendOTP(email) {
    return http.post(`${config.baseApiUrl}/api/v1/user/resendOtp`, { email: email });
  },

  // ADDRESS
  fetchAllProvince() {
    return http.get(`https://open.oapi.vn/location/provinces?page=0&size=100`);
  },

  fetchAllDistrict(provinceId) {
    return http.get(`https://open.oapi.vn/location/districts/${provinceId}?page=0&size=100`);
  },
  
  fetchAllWard(districtId) {
    return http.get(`https://open.oapi.vn/location/wards/${districtId}?page=0&size=100`);
  }
};
