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

  checkOTP(role, email, otp) {
    const otpNumber = Number(otp);

    console.log(role);
    return http.post(`${config.baseApiUrl}/api/v1/${role}/verifyOtp`, {
      email: email,
      otp: otpNumber
    });
  },

  resendOTP(email) {
    return http.post(`${config.baseApiUrl}/api/v1/user/resendOtp`, { email: email });
  }
};
